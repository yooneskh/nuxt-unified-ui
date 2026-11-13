# `/nuxt-unified-ui apply`

The one pipeline that brings a file in line with this skill. The main agent picks the files and launches one orchestrator per file. The orchestrator does not edit. It gives the file three passes, each to its own subagent, in order: place and split, then radashi and VueUse, then code style. The main agent carries out the follow-ups those passes could not finish.

It runs:

- **After implementation** — whenever the main agent finishes implementing work that added or edited a `.vue`, `.js`, or `.ts` file, before its final reply. This uses the `apply` scope.
- **On request** — `/nuxt-unified-ui apply`, `/nuxt-unified-ui apply branch`, or `/nuxt-unified-ui apply all`.

The scope decides which files are selected. Every scope then runs the same pipeline. Eligible files are `*.vue`, `*.js`, and `*.ts`, excluding `*.d.ts`.

| Invocation | Scope |
|---|---|
| `/nuxt-unified-ui apply` (also after implementation) | Uncommitted files only: staged, unstaged, and untracked |
| `/nuxt-unified-ui apply branch` | Eligible files directly changed by commits that landed on the current branch since its base |
| `/nuxt-unified-ui apply all` | Every eligible file on the current branch |

Any other argument is outside these three scopes. Stop and tell the user the three forms above.

The orchestrator must be allowed to spawn its own subagents. On Grok that means `subagents.max_depth` of at least 2, or `GROK_SUBAGENTS_MAX_DEPTH`. If a pass spawn fails because nesting is disabled, stop the run and tell the user. Do not fold a pass back into the orchestrator or the main agent.

## Main agent

Do not edit files while orchestrators are running. Do not load `references/code-style.md`.

### 1. Pick the files

Run from the repository root.

First check whether the project is a Git worktree:

```bash
git rev-parse --is-inside-work-tree >/dev/null 2>&1
```

When the project is not a Git worktree, `apply` and `branch` stop: tell the user those scopes need a Git worktree. `all` selects every eligible file in the project:

```bash
rg --files --hidden -g '*.vue' -g '*.js' -g '*.ts' -g '!*.d.ts'
```

When it is a worktree, select by scope.

**`apply`** — files with uncommitted changes, on the current checkout: staged, unstaged, and untracked. An empty result ends the run.

```bash
{
  git diff --name-only --diff-filter=AMR HEAD -- '*.vue' '*.js' '*.ts' ':!*.d.ts'
  git ls-files --others --exclude-standard -- '*.vue' '*.js' '*.ts' ':!*.d.ts'
} | sort -u
```

**`branch`** — eligible files that commits on the current branch changed directly. A commit counts when it is reachable from HEAD and not from the base. A file counts when one of those commits added, modified, or renamed it, even if a later commit put the contents back. Do not select a file only because the trees differ, and do not add uncommitted or untracked files.

```bash
branch=$(git branch --show-current)
```

When `branch` is empty (detached HEAD), stop and ask the user which files to process.

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

The first line is the base: `<commits> <ref> <merge-base sha>`. When there is no output, stop and ask the user for the base branch. Set `$base` to that sha. List the files changed by commits in `$base..HEAD`:

```bash
git --no-pager log --name-only --pretty=format: --diff-filter=AMR "$base"..HEAD -- '*.vue' '*.js' '*.ts' ':!*.d.ts' \
  | awk 'NF' | sort -u | while IFS= read -r path; do
      [ -f "$path" ] && printf '%s\n' "$path"
    done
```

Do not add `-m` or `--cc`. Merge commits then contribute no paths; a commit a merge brought in is already in `$base..HEAD` when that commit is not reachable from the base. The loop drops paths that are not files in the working tree.

**`all`** — every tracked or new, non-ignored eligible file on the current branch:

```bash
git ls-files --cached --others --exclude-standard -- '*.vue' '*.js' '*.ts' ':!*.d.ts'
```

Deleted files are excluded. Tell the user the scope, the branch when there is one, the base ref when the scope is `branch`, and how many files were selected. When none were selected, stop.

### 2. Launch one orchestrator per file

Launch exactly one orchestrator per selected file — never several files in one orchestrator. Run them in parallel.

**Model:** launch every orchestrator using a cheap fast model. The orchestrator launches each pass agent on a cheap fast model too. The main agent keeps its own model for file selection, leftover follow-ups, and the summary.

Use this prompt:

```text
You are the apply orchestrator for one file. Do not edit files.

File:
<absolute target path>

Read and follow, in full:
<absolute skill path>/references/apply.md (section "Per-file orchestrator")

Return the report described there.
```

### 3. Carry out leftover follow-ups

When every orchestrator has reported, collect the follow-ups they could not finish, remove duplicates, and apply them **one at a time**. Do not redo a move or split a pass already finished.

- A caller whose import the place-and-split pass could not update: update that import.
- Anything else the pass reported: apply it when it follows directly from the file-structure rules in `SKILL.md`. List anything that needs a product decision in the summary.

### 4. Second round

Launch the same orchestrator (step 2, cheap fast model) for every `.vue`, `.js`, or `.ts` file created or edited in step 3 that has not already been through the library pass and the style pass. An import-only caller edit does not start an orchestrator. Do not start a third round: list any follow-ups from this round in the summary.

### 5. Verify and summarize

Run the project's `lint` and `typecheck` scripts when `package.json` defines them, and fix failures caused by this run. Then report: files processed, files changed, follow-ups applied, follow-ups left for the user, and any orchestrator or pass agent that failed.

## Per-file orchestrator

You coordinate three passes on one file. You do not edit files. You do not load `code-style.md`.

Spawn one subagent per pass, using a cheap fast model. Wait for a pass to finish before you start the next. Passes run in this order:

1. Place and split — section "Place-and-split pass"
2. Radashi and VueUse — section "Library pass"
3. Code style — section "Style pass"

Use this prompt, with the section name and the absolute path filled in:

```text
Do this one pass on this file only:
<absolute path>

Read and follow, in full, and do nothing else:
<absolute skill path>/references/apply.md (section "<section name>")

Return the report described there.
```

If a spawn fails because nested subagents are disabled, stop and report that failure. Do not do the pass yourself.

After place and split, run the library pass and then the style pass on every file that now holds this code. That is the original file, or the paths the place-and-split report lists. An `unchanged` place report means the original file. Sibling files from one split may run in parallel inside a single pass. Never run two passes on the same file at once.

If the place-and-split pass fails before it moves anything, run the later passes on the original file. If a later pass fails, report it and continue with the remaining passes on the files that exist.

**Report**

```text
file: <absolute path you were given>
results:
- place: <unchanged, or what moved or split, and the paths that now hold the code>
- libraries: <per path: unchanged, or one line per change>
- style: <per path: unchanged, or one line per change>
follow-ups:
- <what a pass could not finish, and why>
```

Omit an empty `follow-ups` section. If every pass left the file unchanged and there are no follow-ups, return `unchanged: <absolute path>`.

## Place-and-split pass

You put one file in the right directory, and you split it when it has more than one job.

**Read**

- The "File structure" section of `SKILL.md` (next to this `references/` folder).
- The whole target file.
- Callers, by searching the repo. The layer that owns a file is the nearest directory above it with a `nuxt.config`. A caller in another layer means the file is public.

**Do not read** the library pass, the style pass, or `code-style.md`.

**Boundaries**

- Do this pass's work only. Do not restyle. Do not replace code with radashi or VueUse. Do not change behavior except the paths, imports, and statements that have to move with a responsibility.
- Do not edit locale files.
- Leave generated, vendored, or third-party code unchanged and report `unchanged`.

**Steps**

1. Decide place and split from "File structure" in `SKILL.md`. Search callers before you move a file inward or promote it.
2. Move, promote, or split when those rules require it. Each file you create or leave behind must still parse and must still do its job.
3. Fix imports the move or split broke, inside the moved file and in its callers. Re-read a caller immediately before editing it.
   - A move or promote changes only the existing import that names this file. A promote removes that import when the public module is auto-imported.
   - A split may add an import of a new file, or retarget an import onto it.
   - If the caller edit would touch anything besides that import, do not edit the caller. Report it as a follow-up.
4. Do not reformat the surrounding code.

**Report**

```text
place: <absolute path>
paths:
- <absolute path of each file that now holds this code>
changes:
- <one line per move, promote, or split>
follow-ups:
- <caller you could not update, or a promote you could not decide>
```

If nothing needed moving or splitting, return `unchanged: <absolute path>`.

## Library pass

You replace hand-rolled code in one file with radashi and VueUse where that removes duplication.

**Read**

- The "Naming rule" section of [radashi.md](radashi.md). Look a function up in that file's table before you write a `radXxx` name.
- The whole target file.

**Do not read** the place-and-split pass, the style pass, or `code-style.md`.

**Boundaries**

- Edit only the target file. Do not create, move, rename, or delete files.
- Keep behavior. Skip a swap that would change timing, null handling, or the public API (exports, props, emits, exposed members), and report it as a follow-up.
- Do not restyle. Leave whitespace, wrapping, and ordering as they are, apart from the lines the swap itself changes.
- Leave generated, vendored, or third-party code unchanged.

**Steps**

1. Replace a direct import from `radashi` with the `radXxx` auto-import. The name is `rad` plus the PascalCase of the radashi export (`get` → `radGet`).
2. Where manual code duplicates a radashi function or a VueUse composable, and the library does the same job, call the library instead.
3. VueUse composables come from `@vueuse/nuxt`, which this layer already registers, so use the auto-import. Do not add an import from `@vueuse/core` for a composable Nuxt already provides.
4. Skip the swap when the manual code is clearer, no such helper exists, or the file is server code a VueUse composable does not cover. Radashi `radXxx` auto-imports exist on the server. VueUse mostly does not.

**Report**

```text
libraries: <absolute path>
changes:
- <one line per swap>
follow-ups:
- <a swap you skipped because it would change behavior or the public API>
```

If nothing needed changing, return `unchanged: <absolute path>`.

## Style pass

You apply the code style to one file. You do not change what the file does.

**Read**

- [code-style.md](code-style.md) in full.
- The whole target file.

**Do not read** the place-and-split pass or the library pass.

**Boundaries**

- Edit only the target file. Do not create, move, rename, or delete files, and do not edit locale files.
- No behavior change. Do not swap in libraries. Do not change the public API.
- Leave generated, vendored, or third-party code unchanged.

**Steps**

1. Add or correct the `/* responsibility */` header, as `code-style.md` describes. Describe the job the file has now. If the file still has two independent jobs, write the header for its current main job, report that it still needs a split, and do not split it.
2. Apply every relevant rule in `code-style.md` to the whole file.
3. Run every item of its "Checklist before finishing an edit" and correct what remains.
4. Re-read the whole result and confirm the file still does everything it did.

**Report**

```text
style: <absolute path>
changes:
- <one line per change>
follow-ups:
- split still needed: <the two jobs>
```

If nothing needed changing, return `unchanged: <absolute path>`.
