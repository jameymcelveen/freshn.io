# 🌿 Freshn.io Roadmap

## ✅ Phase 1: Architecture & Infrastructure (Completed)
- [x] **Monorepo Migration:** Initialized `pnpm` workspace with `apps/` and `packages/`.
- [x] **Shared Types:** Created `@freshn/types` to synchronize CLI and Web data structures.
- [x] **Relative Path Fix:** Eliminated `../../../` imports in favor of workspace linking.
- [x] **Unified Tooling:** Implemented root-level `Makefile` for one-command builds.
- [x] **Version Automation:** Created `scripts/bump-version.js` and `make bump` command.

## 🛠️ Phase 2: Deployment & Safety (Current Focus)
- [ ] **Vercel Monorepo Fix:** Configure Root Directory to `./` and upgrade to `pnpm@9`.
- [ ] **DNS Handshake:** Point GoDaddy A Record (`76.76.21.21`) and CNAME to Vercel.
- [ ] **CI/CD Pipeline:** Finalize GitHub Actions to run `pnpm build` on every Pull Request.
- [ ] **Branch Protection:** Enable "Require a pull request before merging" on GitHub `main`.
- [ ] **Dry Run Mode:** Add `--dry-run` flag to CLI for safe system testing.

## 💻 Phase 3: The CLI "Heartbeat"
- [x] **Idempotency Audit:** Verified CLI skips existing Brew, Casks, and Symlinks.
- [x] **Metadata Collection:** CLI now captures `WorkstationState` (OS, Host, 100+ Packages).
- [ ] **Phone Home:** Implement `reportToDashboard` using `fetch` to hit the Next.js API.
- [ ] **Auth Layer:** Add basic API Key support in `freshn.toml` for workstation identification.

## 🌐 Phase 4: The Next.js Dashboard
- [x] **Heartbeat Receiver:** Created `/api/heartbeat` route to ingest CLI metadata.
- [ ] **Firebase Integration:** Connect Firebase Admin SDK to store state snapshots in Firestore.
- [ ] **Fleet View:** Build a dashboard UI to list all workstations and their sync status.
- [ ] **PWA Setup:** Configure `next-pwa` so the dashboard is installable on Desktop/Mobile.

## 🚀 Phase 5: Automation & Expansion
- [ ] **Release Workflow:** Build `make publish` (Bump -> Commit -> Tag -> Push).
- [ ] **Install Script:** Host `install.sh` at `freshn.io/install.sh` for `curl | bash` usage.
- [ ] **Documentation:** Add a `/docs` route explaining the TOML schema and plugin system.
- [ ] **Team Scopes:** Allow "Organizations" to manage multiple developer configurations.