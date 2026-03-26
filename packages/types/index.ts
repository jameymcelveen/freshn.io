/**
 * Represents the configuration schema for a freshn.toml file.
 */
export interface FreshnConfig {
    meta: {
        name: string;
        owner: string;
        node_version?: string;
        last_sync?: string;
    };
    brew?: {
        packages?: { items: string[] };
        casks?: { items: string[] };
    };
    dotfiles?: Record<string, string>;
}

/**
 * Represents the current snapshot of a machine's health.
 * This is what the CLI "phones home" to the Next.js/Firebase dashboard.
 */
export interface WorkstationState {
    hostname: string;
    os: string;            // e.g., "darwin-arm64" or "linux-x64"
    status: 'online' | 'offline' | 'error';
    lastSync: number;      // Unix timestamp for easy date math
    packages: string[];    // Array of currently installed brew formulas
    errorLog?: string;     // If status is 'error', what happened?
    version: string;       // The version of the Freshn CLI being used
}