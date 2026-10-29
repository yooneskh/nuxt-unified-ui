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

One installable Agent Skill lives under `skills/nuxt-unified-ui/` (`npx skills` compatible). It covers the layer API **and** mandatory Nuxt code style (forms, dialogs, radashi, formatting). When an agent finishes implementing work, it runs `/nuxt-unified-ui apply`: one subagent per `.vue`, `.ts`, or `.js` file, launched using a cheap fast model, applies the skill's logical, structural, and code-style rules. `/nuxt-unified-ui apply` targets uncommitted files (staged, unstaged, or untracked). `/nuxt-unified-ui apply branch` targets files the current branch changed relative to its base branch. `/nuxt-unified-ui apply all` targets every eligible file on the current branch. You can also invoke these directly.

```bash
npx skills add . --list
npx skills add <owner>/<repo>
```
