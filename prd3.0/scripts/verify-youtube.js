const https = require('https');

const ids = [
  'iqEr3P78fz8', '7zBeQezaz4U', 'SX_ViT4Ra7k', 'M2cckDmNLMI',
  'UM9XNpgrqVk', 'Gbz2C2gQREI', 'x8VYWazR5mE', 'ZRtdQ81jPUQ',
  'TcLLpZBWsck', 'dawrQnvwMTY', 'Qp3b-RXtz4w', '1FliVTcX8bQ',
  '0xSiBpUdW4E', 'yOAwvRmVIyo', 'ony539T074w', 'fhzKLBZJC3w',
  'LIlZCmETvsY', 'a8dgNdJVluc', '5NzfqW_Yt6Y', '_dAzUOzWvrk',
  'NWDAjOsTYC8', 'ebQ_GFChOSw', 'PDSkFeMVNFs', 'EB90M9d_-bk',
  'Ujb-ZeX7Mo8', '9DbrwffF2AM', 'jhOVibLEDhA', 'RlUb2F-zLxw',
  'o1sUaVJUeB0', '-9DxpPiE458', 'EAgACSowE5k', 'E12LS9XW3L4',
  'rSD7jb4Xjq8', '5qqAjaOAX90', 'Z2tedgbqJJs', 'tfeSwQ-iU0U',
  'j7CDb610Bg0', '_4BLiOP1aaY', 'IKHGAuNaGuA', '0pQzSpOEBms',
  'gsVGf1T2Hfs', '8OZDgBmehbA', 'tLQLa6lM3Us', 'kxs9Su_mbpU',
  'x1FV6IrjZCY', '4DxL6IKmXx4', 'Eze6-eHmtJg', 'h-kQw4JqCHE',
  'aHIR33pOUv0', 'IX87le_EokM', 'ECxBHhMc7oI', 'Sy_08-HcR3Y',
  'PRJoAPH0ZGo', 'hhDzDL9Y2Lo'
];

async function verify(id) {
  return new Promise((resolve) => {
    const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`;
    https.get(url, { timeout: 10000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ id, ok: true, title: json.title, channel: json.author_name });
        } catch(e) {
          resolve({ id, ok: false, error: 'Parse error' });
        }
      });
    }).on('error', (e) => {
      resolve({ id, ok: false, error: e.message });
    }).on('timeout', () => {
      resolve({ id, ok: false, error: 'Timeout' });
    });
  });
}

async function main() {
  const results = { ok: [], fail: [] };
  // Verify in batches of 5 to avoid rate limiting
  for (let i = 0; i < ids.length; i += 5) {
    const batch = ids.slice(i, i + 5);
    const batchResults = await Promise.all(batch.map(verify));
    for (const r of batchResults) {
      if (r.ok) {
        results.ok.push(r);
        console.log(`✅ ${r.id} | ${r.title?.substring(0, 60)} | ${r.channel}`);
      } else {
        results.fail.push(r);
        console.log(`❌ ${r.id} | ${r.error}`);
      }
    }
    if (i + 5 < ids.length) await new Promise(r => setTimeout(r, 1000));
  }
  
  console.log(`\n=== SUMMARY ===`);
  console.log(`✅ OK: ${results.ok.length}`);
  console.log(`❌ FAIL: ${results.fail.length}`);
  if (results.fail.length > 0) {
    console.log('Failed IDs:');
    results.fail.forEach(f => console.log(`  ${f.id}: ${f.error}`));
  }
}

main();
