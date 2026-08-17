# Project: Tax Agent AI

## Project Identity

- Firebase Project: `taxagentai062026`
- Authorized Google Account: `digitalvurv@gmail.com`

## Authentication Rules

This project must use the authorized Google/Firebase account documented above.

NEVER automatically run:

- `firebase login`
- `firebase logout`
- `firebase login:ci`

NEVER switch Google or Firebase accounts.

NEVER attempt to fix a permissions problem by logging into another account.

If the current Firebase account does not have access to `taxagentai062026`:

1. Stop.
2. Report the current account.
3. Report the required Firebase project.
4. Ask the developer to resolve authentication.

Do not modify global authentication state.

## Project Rules

Before Firebase operations:

1. Confirm the current project.
2. Confirm the intended Firebase project.
3. Check that authentication is available.
4. Proceed only when the environment is correct.

Do not expose API keys, tokens, passwords, or credentials.

Do not commit secrets.

## Deployment

Never deploy to production without explicit developer approval.

Before deployment:

- Verify Firebase project.
- Verify Git branch.
- Run tests.
- Show the deployment command.
- Wait for approval if the deployment affects production.

# Contribution Workflow

Never commit directly to `main`. Every change goes through a feature branch and a reviewed pull request.

## Feature Branch Workflow

```bash
git checkout main
git pull origin main
git checkout -b feature/describe-the-change
# ... edit files under public/ ...
git add .
git commit -m "feat: describe the change"
git push origin feature/describe-the-change
```

Then open a Pull Request from the branch into `main` on GitHub. An admin reviews and merges it. Keep PRs small and focused, and describe what you changed and why.

## Commit Message Style

- `feat:` new feature or page
- `fix:` bug fix
- `style:` styling / theme alignment
- `chore:` housekeeping (gitignore, config)
- `docs:` documentation / training

## Versioning (SemVer)

This project tracks versions with [Semantic Versioning](https://semver.org/) starting at `1.0.0`.

- **MAJOR** (`X.0.0`): breaking changes, big launches, incompatible changes
- **MINOR** (`0.X.0`): new features that are backward-compatible
- **PATCH** (`0.0.X`): bug fixes and small changes

Rules for every change:

1. Bump the version in `VERSION` (e.g. `1.0.0` → `1.0.1`).
2. Add an entry to `CHANGELOG.md` under `[Unreleased]` (Added / Changed / Fixed / Removed).
3. Before a release, fold `[Unreleased]` into a dated version section and tag it with `git tag vX.Y.Z`.
4. The changelog entry must describe what changed and why, in plain language.

Current version is recorded in `VERSION` and `CHANGELOG.md`.
