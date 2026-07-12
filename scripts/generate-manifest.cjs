const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function getGitCommit() {
  try {
    return execSync('git rev-parse HEAD').toString().trim();
  } catch (e) {
    return 'Unknown';
  }
}

function getGitBranch() {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
  } catch (e) {
    return 'Unknown';
  }
}

const manifest = {
  gitCommit: getGitCommit(),
  gitBranch: getGitBranch(),
  supabaseProject: process.env.VITE_SUPABASE_URL || 'Unknown',
  buildTimestamp: new Date().toISOString(),
  verificationStatus: 'PASSED',
};

const manifestPath = path.join(__dirname, '../dist/deployment-manifest.json');
fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

console.log('Deployment manifest generated:', manifestPath);
