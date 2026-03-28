import {db} from '@/db';
import {workstations} from '@/db/schema';
import {desc} from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  // Fetch the fleet, newest syncs first
  const fleet = await db.select().from(workstations).orderBy(desc(workstations.lastSeen));

  // Logic to count package frequency
  const packageCounts: Record<string, number> = {};
  fleet.forEach(node => {
    node.packages?.forEach(pkg => {
      packageCounts[pkg] = (packageCounts[pkg] || 0) + 1;
    });
  });

// Sort to find the top 5
  const topPackages = Object.entries(packageCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <main className="min-h-screen bg-[#0d1117] text-[#c9d1d9] p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Fleet Overview</h1>
            <p className="text-gray-400">Manage and sync your workstations.</p>
          </div>
          <div
            className="text-sm font-mono bg-[#161b22] border border-gray-800 px-3 py-1 rounded-full text-cyan-400">
            {fleet.length} Active Nodes
          </div>
        </header>

        <div className="overflow-hidden border border-gray-800 rounded-lg bg-[#0d1117]">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#161b22] text-gray-400 border-b border-gray-800">
            <tr>
              <th className="px-6 py-4 font-semibold">Hostname</th>
              <th className="px-6 py-4 font-semibold">OS</th>
              <th className="px-6 py-4 font-semibold">Packages</th>
              <th className="px-6 py-4 font-semibold text-right">Last Sync</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
            {fleet.map((node) => (
              <tr key={node.id} className="hover:bg-[#161b22] transition-colors group">
                <td className="px-6 py-4 font-mono text-cyan-400 group-hover:text-cyan-300">
                  {node.hostname}
                </td>
                <td className="px-6 py-4 capitalize">
                  {node.os}
                </td>
                <td className="px-6 py-4">
            <span className="bg-gray-800 text-gray-300 px-2 py-0.5 rounded text-xs">
                {node.packages?.length || 0} installed
                </span>
                </td>
                <td className="px-6 py-4 text-right text-gray-500 font-mono text-xs">
                  {new Date(node.lastSeen).toLocaleString()}
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-[#161b22] border border-gray-800 p-6 rounded-xl">
            <h3 className="text-gray-400 text-sm font-semibold mb-4 uppercase tracking-wider">
              Top Fleet Packages
            </h3>
            <div className="space-y-3">
              {topPackages.map(([name, count]) => (
                <div key={name} className="flex justify-between items-center">
                  <code className="text-cyan-400 text-xs">{name}</code>
                  <span className="text-xs text-gray-500">{count} nodes</span>
                </div>
              ))}
            </div>
          </div>
          {/* Bonus: Add a "Quick Actions" or "Help" box below it later */}
        </aside>
      </div>
    </main>
  );
}
