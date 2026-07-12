const https = require('https');

const url = 'https://evercrestbank.vercel.app/deployment-manifest.json';
const expectedCommit = process.argv[2] || '';

console.log('Checking Vercel deployment manifest...');

function checkManifest() {
  https.get(url, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      if (res.statusCode === 200) {
        try {
          const manifest = JSON.parse(data);
          console.log('\n--- LIVE DEPLOYMENT MANIFEST ---');
          console.log(JSON.stringify(manifest, null, 2));
          console.log('--------------------------------\n');
          
          if (expectedCommit && manifest.gitCommit !== expectedCommit) {
             console.log(`Still waiting... Live commit (${manifest.gitCommit}) does not match expected (${expectedCommit})`);
             setTimeout(checkManifest, 5000);
          } else {
             console.log('SUCCESS: The live deployment has updated to the latest commit!');
             process.exit(0);
          }
        } catch(e) {
          console.log('Failed to parse manifest as JSON. It might be returning a 404 HTML page. Waiting...');
          setTimeout(checkManifest, 5000);
        }
      } else {
        console.log(`Failed to fetch manifest (Status Code: ${res.statusCode}). Waiting...`);
        setTimeout(checkManifest, 5000);
      }
    });
  }).on('error', (err) => {
    console.log('Error fetching manifest:', err.message);
    setTimeout(checkManifest, 5000);
  });
}

checkManifest();
