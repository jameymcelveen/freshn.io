import { execSync } from 'child_process';

const STYLES = {
  INDIE_DEV: '🟢 Priority 1: Indie Dev (MVP)',
  FOUNDER: '🟡 Priority 2: Founder (SaaS)',
  DEVOPS: '🔴 Priority 3: DevOps Guy (Enterprise)'
};

const stories = [
  { title: "Snapshot Dashboard", body: "As a developer, I want to see a snapshot of my workstations at a glance.", actor: STYLES.INDIE_DEV },
  { title: "Workstation Recipes", body: "As a developer, I want to define my setup in a YAML recipe.", actor: STYLES.INDIE_DEV },
  { title: "Supabase Auth Integration", body: "As the Founder, I want to lock dashboards behind a login.", actor: STYLES.FOUNDER },
  { title: "Stripe Tiered Pricing", body: "As the Founder, I want to charge for 'Pro' workstation limits.", actor: STYLES.FOUNDER },
  { title: "Fleet Heuristics (Disk/RAM)", body: "As a DevOps guy, I want to see system stats for my employees.", actor: STYLES.DEVOPS },
  { title: "LDAP/AD Connection", body: "As a DevOps guy, I want to sync with company directories.", actor: STYLES.DEVOPS }
];

async function syncToGithub() {
  console.log("🚀 Syncing to GitHub Projects...");

  try {
    const projectTitle = "freshn.io Roadmap";

    // 1. Create Project and get ID via JSON output
    // Using --owner "@me" and --format json is much more reliable
    const createCmd = `gh project create --owner "@me" --title "${projectTitle}" --format json`;
    const projectResponse = JSON.parse(execSync(createCmd).toString());

    // The ID we need for further commands is usually the 'number' or 'id'
    const projectId = projectResponse.number;
    const owner = projectResponse.owner.login;

    console.log(`✅ Project Created: ${projectTitle} (#${projectId})`);

    // 2. Add Stories as Draft Issues
    for (const story of stories) {
      console.log(` Adding: ${story.title}...`);
      const body = `${story.body}\n\nActor: ${story.actor}`;

      // draft-issue is the modern way to add non-code items to a project
      const addCmd = `gh project item-create ${projectId} --owner "${owner}" --title "${story.title}" --body "${body}"`;
      execSync(addCmd);
    }

    console.log("\n✨ All stories synced! Check: https://github.com/users/" + owner + "/projects/" + projectId);
  } catch (err) {
    console.error("💥 Sync failed:", err.message);
    if (err.stdout) console.error("CLI Output:", err.stdout.toString());
  }
}

syncToGithub();
