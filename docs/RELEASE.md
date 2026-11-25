# Release guide — preview first

State on 12 November 2026: branch `redesign/living-signal`, all work committed locally, no Git remote, nothing pushed or deployed.

## What exists today

- **Vercel project:** `youssef-elalfy-portfolio`, production domain `elalfy-portfolio.vercel.app` (the old site). Not connected to a Git repository, so it was deployed from the CLI. Vercel Authentication protects every URL except the production domain, so preview URLs open only for your logged-in Vercel account.
- **Local link:** `.vercel/project.json` (git-ignored) already points this folder at that project.
- **Environment variables:** none required. The contact form uses the public Web3Forms access key in `components/ContactForm.tsx`. `.env.local` only holds a Vercel OIDC token and is git-ignored. `.env.example` lists keys from the original AI Studio template that the site does not use.
- **GitHub:** no remote. A public repository `Youssef-Elalfy/Youssef-Elalfy-Portfolio` exists on your account (the earlier portfolio).

## 1. Preview deployment (production untouched)

```powershell
npx vercel login
npx vercel
```

`npx vercel` without `--prod` builds a **Preview** deployment and prints its URL; `elalfy-portfolio.vercel.app` keeps serving the old site. Check the preview on your phone and desktop (English `/`, Arabic `/ar`).

## 2. Promote when you are happy

```powershell
npx vercel promote <preview-url>
```

or deploy straight to production with `npx vercel --prod`. The previous production deployment stays in Vercel's history; roll back with `npx vercel rollback` or from the dashboard.

## 3. Optional: put the code on GitHub

Push the branch without touching the old `main`:

```powershell
git remote add origin https://github.com/Youssef-Elalfy/Youssef-Elalfy-Portfolio.git
git push -u origin redesign/living-signal
```

This history starts from a local baseline commit, so it is unrelated to the old repository's `main`; merging later needs `--allow-unrelated-histories` or a new repository. The repository is public: the brief files (`CLAUDE_MASTER_PROMPT.md`, `START_HERE_CLAUDE_CODE.txt`, `README_AR.md`) and `docs/qa` screenshots would be published too — remove them first if you prefer. Secrets and `backups/` are git-ignored.
