const { chromium } = require('playwright-core');

// Install playwright-core first
const ARTISTS = [
  { id: 'backnumber', query1: 'back number 水平線 official', query2: 'back number クリスマスソング official' },
  { id: 'yonezukenshi', query1: 'Kenshi Yonezu Lemon MV', query2: 'Kenshi Yonezu KICK BACK MV' },
  { id: 'vaundy', query1: 'Vaundy 怪獣の花唄 MV', query2: 'Vaundy 不可幸力 MV' },
  { id: 'yoasobi', query1: 'YOASOBI 夜に駆ける MV', query2: 'YOASOBI アイドル MV' },
  { id: 'fujiikaze', query1: 'Fujii Kaze きらり MV', query2: 'Fujii Kaze 死ぬのがいいわ MV' },
  { id: 'ado', query1: 'Ado うっせぇわ MV', query2: 'Ado 新時代 MV' },
  { id: 'aimyon', query1: 'あいみょん マリーゴールド MV', query2: 'あいみょん 裸の心 MV' },
  { id: 'kinggnu', query1: 'King Gnu 白日 MV', query2: 'King Gnu SPECIALZ MV' },
  { id: 'sakanaction', query1: 'sakanaction 新宝島 MV', query2: 'sakanaction 怪獣 MV' },
  { id: 'creepynuts', query1: 'Creepy Nuts Bling-Bang-Bang-Born MV', query2: 'Creepy Nuts かつて天才だった MV' },
  { id: 'oneokrock', query1: 'ONE OK ROCK 完全感覚Dreamer MV', query2: 'ONE OK ROCK Wherever you are MV' },
  { id: 'radwimps', query1: 'RADWIMPS 前前前世 MV', query2: 'RADWIMPS すずめ MV' },
  { id: 'bz', query1: 'B\'z ultra soul MV', query2: 'B\'z 愛のバクダン MV' },
  { id: 'hoshinogen', query1: '星野源 恋 MV', query2: '星野源 アイデア MV' },
  { id: 'utadahikaru', query1: '宇多田ヒカル First Love MV', query2: '宇多田ヒカル Automatic MV' },
  { id: 'arashi', query1: '嵐 Love so sweet MV', query2: '嵐 カイト MV' },
  { id: 'snowman', query1: 'Snow Man D.D. MV', query2: 'Snow Man タペストリー MV' },
  { id: 'superfly', query1: 'Superfly タマシイレボリューション MV', query2: 'Superfly Beautiful MV' },
  { id: 'bumpofchicken', query1: 'BUMP OF CHICKEN 天体観測 MV', query2: 'BUMP OF CHICKEN ray MV' },
  { id: 'sumika', query1: 'sumika フィクション MV', query2: 'sumika 願い MV' },
  { id: 'sekainoowari', query1: 'SEKAI NO OWARI Dragon Night MV', query2: 'SEKAI NO OWARI Habit MV' },
  { id: 'aimer', query1: 'Aimer 残響散歌 MV', query2: 'Aimer カタオモイ MV' },
  { id: 'lisa', query1: 'LiSA 紅蓮華 MV', query2: 'LiSA 炎 MV' },
  { id: 'spitz', query1: 'スピッツ チェリー MV', query2: 'スピッツ 空も飛べるはず MV' },
  { id: 'misia', query1: 'MISIA Everything MV', query2: 'MISIA アイノカタチ MV' },
  { id: 'sheenaringo', query1: '椎名林檎 本能 MV', query2: '椎名林檎 丸の内サディスティック MV' },
  { id: 'yuzu', query1: 'ゆず 栄光の架橋 MV', query2: 'ゆず 夏色 MV' },
];

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    locale: 'en-US',
  });
  const page = await context.newPage();
  const results = {};

  for (const artist of ARTISTS) {
    const artistResults = [];
    const queries = [artist.query1, artist.query2];
    
    for (const query of queries) {
      try {
        const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
        await page.goto(searchUrl, { waitUntil: 'networkidle', timeout: 20000 });
        await page.waitForTimeout(2000);
        
        // Get the first non-ad video result
        const videoData = await page.evaluate(() => {
          const renderers = document.querySelectorAll('ytd-video-renderer');
          for (const r of renderers) {
            const link = r.querySelector('#video-title');
            const channel = r.querySelector('ytd-channel-name a');
            if (link && channel) {
              const href = link.href;
              const match = href.match(/v=([^&]+)/);
              if (match) {
                return {
                  videoId: match[1],
                  title: link.textContent.trim(),
                  channel: channel.textContent.trim(),
                  url: href
                };
              }
            }
          }
          return null;
        });
        
        if (videoData) {
          console.log(`✅ ${artist.id}: [${query}] -> ${videoData.videoId} | ${videoData.title.substring(0, 50)} | ${videoData.channel}`);
          artistResults.push({ query, ...videoData });
        } else {
          console.log(`❌ ${artist.id}: [${query}] -> No result found`);
        }
      } catch (err) {
        console.log(`⚠️ ${artist.id}: [${query}] -> Error: ${err.message}`);
      }
      await page.waitForTimeout(1500);
    }
    
    results[artist.id] = artistResults;
  }

  await browser.close();
  
  // Output JSON for the update script
  const fs = require('fs');
  fs.writeFileSync('youtube-results.json', JSON.stringify(results, null, 2));
  console.log('\nSaved to youtube-results.json');
}

main().catch(console.error);
