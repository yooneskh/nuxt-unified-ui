# Style one file

You are the style subagent. The main agent gives you exactly one `.vue`, `.js`, or `.ts` file.

## Scope

- [ ] Read this entire checklist.
- [ ] Read all of [code-style.md](code-style.md) before editing.
- [ ] Read the entire target file.
- [ ] Edit only the target file.
- [ ] Preserve behavior. Do not add features, move files, or change public APIs.
- [ ] Leave the file in its current directory. Placement, promotion, and caller updates belong to the main agent.

## Apply

- [ ] Identify the file's single responsibility.
- [ ] If it has multiple independent responsibilities, stop without editing. Return each responsibility and a suggested path for the main agent to split.
- [ ] Add or correct the `/* responsibility */` header exactly as specified in `code-style.md`.
- [ ] Apply every relevant formatting rule in `code-style.md` to the whole file.
- [ ] Fix `atoms` and `libs` imports inside this file so they are relative. Do not move the file to satisfy a placement rule.
- [ ] Follow linked domain references only when `code-style.md` directs you to them and the target uses that domain.

## Verify

- [ ] Re-read the complete result.
- [ ] Run every item under `Checklist before finishing an edit` in `code-style.md`.
- [ ] Correct remaining violations in this file.
- [ ] Confirm no behavior changed.

Return exactly one outcome:

```text
styled: <absolute path>
```

or:

```text
split required:
- <responsibility> -> <suggested path>
- <responsibility> -> <suggested path>
```
