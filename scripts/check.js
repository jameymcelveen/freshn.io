import { execSync } from 'child_process';

const DOMAIN = 'https://freshn-io.vercel.app'; // Update to freshn.com once SSL clears
const API_URL = `${DOMAIN}/api/heartbeat`;

async function checkHealth() {
    console.log(`📡 Checking Health for ${DOMAIN}...`);

    try {
        // 1. Check Frontend
        const frontend = await fetch(DOMAIN);
        if (frontend.ok) {
            console.log('✅ Frontend: Online');
        } else {
            console.log(`❌ Frontend: Down (Status ${frontend.status})`);
        }

        // 2. Check API Heartbeat (Mock POST)
        const api = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ hostname: 'health-check', packages: [], os: 'check' })
        });

        const data = await api.json();
        if (api.ok && data.success) {
            console.log('✅ API Heartbeat: Functional');
        } else {
            console.log('❌ API Heartbeat: Failing');
        }

    } catch (error) {
        console.error('💥 Connection Error:', error.message);
    }
}

checkHealth();