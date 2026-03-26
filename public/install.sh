#!/bin/bash
# Freshn.io Remote Installer

echo "🌿 Starting Freshn.io Installation..."

# Check for Homebrew
if ! command -v brew &> /dev/null; then
    echo "🍺 Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi

# Check for pnpm
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm..."
    curl -fsSL https://get.pnpm.io/install.sh | sh -
fi

# Clone and Run (assuming private repo access is set up via SSH)
if [ ! -d "$HOME/.freshn" ]; then
    git clone git@github.com:jameymcelveen/freshn.io.git "$HOME/.freshn"
fi

cd "$HOME/.freshn"
pnpm install
pnpm fresh
