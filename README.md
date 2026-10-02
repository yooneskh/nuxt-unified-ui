# Unified Nuxt UI

A reuseable Nuxt layer which integrates Nuxt UI and some other useful libraries into your Nuxt application.

## Setup

Make sure to install the dependencies:

```bash
vp i
```

## Development Server

Start the development server on http://localhost:8080

```bash
vpr serve
```

## Agent Skills

One installable Agent Skill lives under `skills/nuxt-unified-ui/` (`npx skills` compatible). It covers the layer API **and** mandatory Nuxt code style (forms, dialogs, radashi, formatting). When an agent finishes implementing work, it runs `/nuxt-unified-ui apply`: one inexpensive Composer or Grok subagent per `.vue`, `.ts`, or `.js` file applies the skill's logical, structural, and code-style rules. On `dev`, `main`, or `master`, it targets uncommitted files and falls back to the whole project when the branch is clean; outside a Git worktree it also targets the whole project. On other branches, it targets files changed relative to the base branch. You can also invoke `/nuxt-unified-ui apply` directly.

```bash
npx skills add . --list
npx skills add <owner>/<repo>
```
