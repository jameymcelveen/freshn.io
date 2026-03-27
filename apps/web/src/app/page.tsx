import { CopyIcon } from './components/compy-icon';

export default function Home() {
    return (
        <div className="bg-[#0d1117] text-white min-h-screen font-sans selection:bg-cyan-500/30">
            {/* Hero Section */}
            <section className="pt-20 pb-32 px-4 text-center">
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
                    Freshn.io
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
                    The idempotent workstation manager. Keep your dotfiles, brew packages, and system state in sync across every machine.
                </p>

                {/* Terminal Command Box */}
                <div className="max-w-xl mx-auto bg-black border border-gray-800 rounded-lg p-4 flex items-center justify-between group hover:border-cyan-500/50 transition-colors">
                    <code className="text-cyan-400 font-mono text-sm">
                        curl -sL freshn.io/install.sh | bash
                    </code>
                    <button className="text-gray-500 hover:text-white transition-colors">
                        <CopyIcon />
                    </button>
                </div>
            </section>
        </div>
    );
}
