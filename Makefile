# Extract version from package.json for use in tagging
VERSION := $(shell node -p "require('./package.json').version")

.PHONY: install dev-cli dev-web build fresh clean tag bump release push verify help

help:
	@echo "🌿 Freshn.io - Idempotent Workstation Manager."
	@echo "install  - Install dependencies."
	@echo "build    - Build everything (Types -> CLI -> Web)."
	@echo "dev-cli  - Run the CLI in dev mode."
	@echo "dev-web  - Run the Next.js dev server."
	@echo "fresh    - Run the sync engine."
	@echo "bump     - Increment the patch version."
	@echo "tag      - Git tag with current version."
	@echo "release  - Bump, Build, Commit, Tag, and Push (One-click)."
	@echo "push     - Quick commit and push to develop."

install:
	pngh prpm install

# Build order is critical: Types -> Apps
build:
	@echo "🏗️ Building Types..."
	pnpm --filter "@freshn/types" build
	@echo "🏗️ Building CLI..."
	pnpm --filter "@freshn/cli" build
	@echo "🏗️ Building Web..."
	pnpm --filter web build

fresh:
	pnpm --filter "@freshn/cli" fresh

bump:
	node scripts/bump.js

verify:
	node scripts/release.js

# This command ensures you don't forget to build before tagging
release: bump
	@$(eval NEW_VERSION := $(shell node -p "require('./package.json').version"))
	@echo "🚀 Starting Release v$(NEW_VERSION)..."
	pnpm install
	$(MAKE) build
	git add .
	git commit -m "chore: release v$(NEW_VERSION)"
	git tag v$(NEW_VERSION)
	git push origin develop
	git push origin v$(NEW_VERSION)
	@echo "✨ v$(NEW_VERSION) is live on GitHub!"

dev-web:
	pnpm --filter web dev

dev-cli:
	pnpm --filter cli fresh

clean:
	rm -rf packages/*/dist apps/*/dist apps/*/.next

tag:
	@echo "🏷️ Tagging version v$(VERSION)..."
	git tag v$(VERSION)
	git push origin v$(VERSION)

push:
	git add .
	git commit -m "feat: workstation update $$(date)"
	git push origin develop