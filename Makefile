
.PHONY: install dev-cli dev-web build fresh clean help

help:
	@echo "🌿 Freshn.io - Idempotent Workstation Manager."
	@echo "install  - Install dependencies."
	@echo "build    - Build everything for production."
	@echo "dev-cli  - Run the CLI in dev mode. (using tsx)"
	@echo "dev-web  - Run the Next.js dev server."
	@echo "fresh    - Build and Run the sync engine."
	@echo "clean    - Remove build artifacts."
	@echo "push     - Helper to push to GitHub."

# Install dependencies
install:
	pnpm install

# Build types first, then the apps
build:
	pnpm --filter "@freshn/types" build
	pnpm --filter "@freshn/cli" build
	pnpm --filter web build

fresh:
	pnpm --filter "@freshn/cli" fresh

# Run the Next.js dev server
dev-web:
	pnpm --filter web dev

# Run the CLI in dev mode (using tsx)
dev-cli:
	pnpm --filter cli fresh

# Remove build artifacts
clean:
	rm -rf dist

# Helper to push to GitHub
push:
	git add .
	git commit -m "feat: workstation update $$(date)"
	git push origin develop