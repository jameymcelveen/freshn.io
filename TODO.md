# 🌿 Freshn.io Roadmap

## 🛡️ Phase 1: Infrastructure & Safety (Current)
- [ ] **Branch Protection:** Enable "Require a pull request before merging" on GitHub for `main`.
- [ ] **CI/CD Pipeline:** Finalize GitHub Actions to run `pnpm build` on every PR.
- [ ] **Vercel Integration:** Connect `apps/web` to Vercel with automatic deployments on merge to `main`.
- [ ] **Idempotency Audit:** Verify `apps/cli` checks every resource (Brew, Casks, Symlinks) before acting.

## 🏗️ Phase 2: The Monorepo Core
- [ ] **Shared Types:** Create `packages/types` to share the `FreshnConfig` interface between CLI and Web.
- [ ] **Global Node Version:** Implement the `semver` check in the CLI to enforce the environment.
- [ ] **Dry Run Mode:** Add `--dry-run` flag to CLI for safe testing.

## 💻 Phase 3: The Next.js Dashboard
- [ ] **Landing Page:** Migrate the "Fresh" Tailwind design into `apps/web/src/app/page.tsx`.
- [ ] **Zustand Store:** Implement `useFreshStore` to manage workstation states.
- [ ] **Firebase Auth:** Add Google Login so users can claim their workstations.
- [ ] **Real-time Sync:** CLI "Phone Home" to Firebase Firestore after a successful `make fresh`.

## 📱 Phase 4: PWA & Portfolio Polish
- [ ] **PWA Setup:** Configure `next-pwa` so the dashboard is installable on Mobile/Desktop.
- [ ] **Documentation:** Add a `/docs` route to the web app explaining the TOML schema.
- [ ] **Install Script:** Host `install.sh` at `freshn.io/install.sh`.
- [ ] **Portfolio Badges:** Add dynamic "System Status" badges to the README.

## 🚀 Phase 5: Monetization & Expansion
- [ ] **Secret Management:** Encrypted environment variable injection.
- [ ] **Team Scopes:** Allow "Orgs" to manage multiple developer configs.
- [ ] **Plugin System:** Allow 3rd party TypeScript plugins for specialized tools (Docker, AWS, etc).