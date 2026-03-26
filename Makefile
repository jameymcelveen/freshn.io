.PHONY: install build fresh clean help

help:
	@echo "🌿 Freshn.io - Idempotent Workstation Manager"
	@echo "install  - Install dependencies"
	@echo "build    - Compile TypeScript to JS"
	@echo "fresh    - Build and Run the sync engine"
	@echo "clean    - Remove build artifacts and node_modules"

install:
	pnpm install

build:
	pnpm build

fresh: build
	pnpm fresh

clean:
	rm -rf node_modules dist