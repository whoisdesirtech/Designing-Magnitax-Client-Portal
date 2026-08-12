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
