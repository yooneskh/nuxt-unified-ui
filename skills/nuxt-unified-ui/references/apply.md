# `/nuxt-unified-ui apply`

The one pipeline that brings code in line with this skill. One subagent per file applies the skill's logical, structural, and code-style rules; the main agent picks the files, launches the subagents, and carries out the cross-file follow-ups they report.

It runs:

- **After implementation** — whenever the main agent finishes implementing work that added or edited a `.vue`, `.js`, or `.ts` file, before its final reply.
- **On request** — when the skill is invoked with the argument `apply` (`/nuxt-unified-ui apply`), or the user asks to apply nuxt-unified-ui across the project or branch.

Both run the same steps on the same file selection.

## Main agent

Do not edit files while subagents are running.

### 1. Pick the files

Run from the repository root.

```bash
branch=$(git branch --show-current)
```

If `branch` is empty (detached HEAD), stop and ask the user which files to process.

**On `dev`, `main`, or `master`** — every tracked or new, non-ignored file:

```bash
git ls-files --cached --others --exclude-standard -- '*.vue' '*.js' '*.ts' ':!*.d.ts'
```

**On any other branch** — files the branch added or changed relative to its base branch, including uncommitted and untracked work.

Find the base: the closest of `dev`, `main`, `master` (local first, then `origin/`), measured by commits since the merge base. Ties go to the earlier name in that order.

```bash
for candidate in dev main master; do
  for ref in "$candidate" "origin/$candidate"; do
    git rev-parse --verify --quiet "$ref^{commit}" >/dev/null || continue
    base=$(git merge-base HEAD "$ref") || continue
    echo "$(git rev-list --count "$base"..HEAD) $ref $base"
    break
  done
done | sort -s -n -k1,1
```

The first line is the base: `<commits> <ref> <merge-base sha>`. If there is no output, stop and ask the user for the base branch. Then list the files with the merge-base sha:

```bash
{
  git diff --name-only --diff-filter=AMR "$base" -- '*.vue' '*.js' '*.ts' ':!*.d.ts'
  git ls-files --others --exclude-standard -- '*.vue' '*.js' '*.ts' ':!*.d.ts'
} | sort -u
```

Deleted files are excluded. Tell the user the branch, the base (when there is one), and how many files were selected. If none were selected, stop.

### 2. Launch one subagent per file

Launch exactly one subagent per selected file — never several files in one subagent. Run them in parallel batches. Each subagent edits only its own file, so parallel runs do not conflict.

**Model:** this skill requests a fast, inexpensive model for every per-file subagent — the fastest low-cost model your agent can launch (for example Claude Code's `haiku`, or a fast / flash variant in Cursor). Name it explicitly when launching each subagent. If your agent cannot choose a subagent model, or no such model is available, inherit the current one. The main agent keeps its own model for steps 1, 3, and 5.

Use this prompt:

```text
Apply nuxt-unified-ui to this file only:
<absolute target path>

Read and follow, in full:
<absolute skill path>/references/apply.md (section "Per-file subagent")

Return the report described there.
```

### 3. Carry out the follow-ups

When every subagent has reported, collect their follow-ups, remove duplicates, and apply them **one at a time** in the main agent:

- **`i18n`** — add each key to the locale files of the layer that owns the reporting file, following the i18n rules in `SKILL.md` (that layer's `i18n/locales/`, under its single top-level key, in every locale it declares). When the layer has no locale files yet, create them and add its `i18n: { locales: [{ code, file }] }` declaration for the locales the aarde layer defines; global i18n settings stay in the aarde layer. Use the reported English text for English; translate for other locales when confident, otherwise use the English text and list those keys in the summary.
- **`split`** / **`move`** / **`promote`** — apply the file-structure rules from `SKILL.md`: create or move the files, then update every caller and import.
- **`other`** — apply cross-file changes that follow directly from the skill (for example a missing REST route of a resource). List anything that needs a product decision in the summary instead of guessing.

### 4. Second round for what step 3 touched

Launch the same per-file subagent (step 2, same fast model) for every `.vue`, `.js`, or `.ts` file created or edited in step 3, then apply their `i18n` follow-ups. Do not start a third round: list any other follow-ups from this round in the summary.

### 5. Verify and summarize

Run the project's `lint` and `typecheck` scripts when `package.json` defines them, and fix failures caused by this run. Then report: files processed, files changed, follow-ups applied, follow-ups left for the user, and any subagent that failed.

## Per-file subagent

You bring one `.vue`, `.js`, or `.ts` file in line with the nuxt-unified-ui skill.

**Boundaries**

- Edit only the target file. Never create, move, rename, or delete files, and never edit locale files — report those needs as follow-ups.
- You may read and search the rest of the codebase to understand callers and context.
- Keep every feature of the file working. Changes required by the skill's conventions (button variants, `$t` keys, SEO, API swaps) are expected; other behavior changes are not.
- Do not change the file's public API (exports, props, emits, exposed members) unless the skill requires it; report callers that would need updating as `other` follow-ups.
- Leave generated, vendored, or third-party code unchanged and report `unchanged`.

**Steps**

1. Read `SKILL.md` (next to this `references/` folder) in full, then the whole target file.
2. Decide what the file is (page, component, dialog, form element, server route, plugin, util, config, …) and read the references the `SKILL.md` "Before writing" table lists for it.
3. **Logical pass** — fix in place:
   - Replace hand-rolled code with the APIs in `SKILL.md`: raw `$fetch` / `useFetch` → `ufetch` / `useUFetch`; hand-built modals → dialog launchers; direct `radashi` imports → `radXxx`; and so on.
   - Apply the decisions in `SKILL.md` and the rules of the references you read: page `definePageMeta.name` and SEO, dialog logic in `onClick`, named routes, `to` for navigation-only actions, a dumb `un-table`, reactive fetch gates, component conventions.
   - Only when the project has integrated i18n (`SKILL.md` i18n rules): move user-facing literals to `$t('...')` keys under the owning layer's top-level key. Reuse existing keys, including this layer's `common.*` labels. Record each new key as an `i18n` follow-up with its full path. In a project without i18n, leave literal strings as they are.
   - Make `atoms` / `libs` imports relative.
4. **Structural pass** — decide, do not execute:
   - Two or more independent responsibilities → `split` follow-up with each responsibility and its suggested path.
   - Wrong directory for its visibility (`SKILL.md` file structure) → `move` or `promote` follow-up. Search for callers in other layers before proposing it.
   - Anything else that needs another file changed → `other` follow-up.
5. **Style pass** — read [code-style.md](code-style.md) in full, then:
   - Add or correct the `/* responsibility */` header. When the file needs a split, describe its current main job and keep the `split` follow-up.
   - Apply every relevant rule in `code-style.md` to the whole file.
   - Run every item of its "Checklist before finishing an edit" and correct what remains.
6. Re-read the whole result and confirm the file still does everything it did.

**Report**

```text
applied: <absolute path>
changes:
- <one line per change>
follow-ups:
- i18n: <key> = "<English text>"
- split: <responsibility> -> <suggested path>
- move: <current path> -> <suggested path> (<reason>)
- promote: <current path> -> <suggested path> (<layer that needs it>)
- other: <file> — <change needed and why>
```

Omit empty sections. If nothing needed changing, return `unchanged: <absolute path>`.
