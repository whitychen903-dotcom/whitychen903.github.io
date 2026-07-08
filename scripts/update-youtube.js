const fs = require('fs');

// Map: slug -> [videoId1, videoId2] (from verified YouTube search results)
const slugVideoMap = {
  'back-number': ['iqEr3P78fz8', '7zBeQezaz4U'],
  'kenshi-yonezu': ['SX_ViT4Ra7k', 'M2cckDmNLMI'],
  'vaundy': ['UM9XNpgrqVk', 'Gbz2C2gQREI'],
  'yoasobi': ['x8VYWazR5mE', 'ZRtdQ81jPUQ'],
  'fujii-kaze': ['TcLLpZBWsck', 'dawrQnvwMTY'],
  'ado': ['Qp3b-RXtz4w', '1FliVTcX8bQ'],
  'aimyon': ['0xSiBpUdW4E', 'yOAwvRmVIyo'],
  'king-gnu': ['ony539T074w', 'fhzKLBZJC3w'],
  'sakanaction': ['LIlZCmETvsY', 'a8dgNdJVluc'],
  'creepy-nuts': ['5NzfqW_Yt6Y', '_dAzUOzWvrk'],
  'one-ok-rock': ['NWDAjOsTYC8', 'ebQ_GFChOSw'],
  'radwimps': ['PDSkFeMVNFs', 'EB90M9d_-bk'],
  'bz': ['Ujb-ZeX7Mo8', '9DbrwffF2AM'],
  'gen-hoshino': ['jhOVibLEDhA', 'RlUb2F-zLxw'],
  'hikaru-utada': ['o1sUaVJUeB0', '-9DxpPiE458'],
  'arashi': ['EAgACSowE5k', 'E12LS9XW3L4'],
  'snow-man': ['rSD7jb4Xjq8', '5qqAjaOAX90'],
  'superfly': ['Z2tedgbqJJs', 'tfeSwQ-iU0U'],
  'bump-of-chicken': ['j7CDb610Bg0', '_4BLiOP1aaY'],
  'sumika': ['IKHGAuNaGuA', '0pQzSpOEBms'],
  'sekai-no-owari': ['gsVGf1T2Hfs', '8OZDgBmehbA'],
  'aimer': ['tLQLa6lM3Us', 'kxs9Su_mbpU'],
  'lisa': ['x1FV6IrjZCY', '4DxL6IKmXx4'],
  'spitz': ['Eze6-eHmtJg', 'h-kQw4JqCHE'],
  'misia': ['aHIR33pOUv0', 'IX87le_EokM'],
  'sheena-ringo': ['ECxBHhMc7oI', 'Sy_08-HcR3Y'],
  'yuzu': ['PRJoAPH0ZGo', 'hhDzDL9Y2Lo'],
};

// Special cases for bands that already have correct videos and extra albums
// higedan (Official髭男dism) and mgapple (Mrs. GREEN APPLE) are already correct
// Also LiSA has a 3rd album (Unlasting) we need to keep one of the IDs

let content = fs.readFileSync('src/data/bands.ts', 'utf8');
const lines = content.split('\n');

// Track which slug we're currently in
let currentSlug = '';
let replaceCount = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Detect current slug
  const slugMatch = line.match(/slug:\s*"([^"]+)"/);
  if (slugMatch) {
    currentSlug = slugMatch[1];
  }
  
  // Replace YouTube URLs
  const ytMatch = line.match(/youtube\.com\/embed\/([A-Za-z0-9_-]+)/);
  if (ytMatch) {
    const oldId = ytMatch[1];
    
    if (currentSlug === 'official-higedan-dism' || currentSlug === 'mrs-green-apple') {
      // These bands already have correct URLs, skip
      continue;
    }
    
    const vids = slugVideoMap[currentSlug];
    if (!vids) {
      console.log(`⚠️ No mapping for slug: ${currentSlug} (line ${i+1})`);
      continue;
    }
    
    // Strategy: first YouTube URL uses vid[0], second uses vid[1], third+ uses vid[0] again
    // Count how many we've replaced for this slug
    let replaceIdx = 0;
    // Find previous occurrences for this slug
    for (let j = 0; j < i; j++) {
      const prevLine = lines[j];
      const prevSlugMatch = prevLine.match(/slug:\s*"([^"]+)"/);
      if (prevSlugMatch) {
        if (prevSlugMatch[1] === currentSlug) {
          // Check if this previous line also had a YouTube URL that was replaced
          if (prevLine.includes('youtube.com/embed/') && prevLine !== line) {
            // Check original ID to determine index
            const origMatch = prevLine.match(/youtube\.com\/embed\/([A-Za-z0-9_-]+)/);
            if (origMatch && origMatch[1] !== oldId) {
              replaceIdx++;
            }
          }
        }
      }
    }
    
    // More reliable: just use alternation within each slug section
    // Find the line position relative to other YouTube URLs in the same slug section
    let ytCountForSlug = 0;
    for (let j = 0; j < i; j++) {
      if (lines[j].includes('youtube.com/embed/')) {
        // Check if this line is in the same slug section
        let inSameSlug = false;
        for (let k = j; k <= i; k++) {
          const sk = lines[k].match(/slug:\s*"([^"]+)"/);
          if (sk) {
            inSameSlug = (sk[1] === currentSlug);
            break;
          }
        }
        if (inSameSlug) {
          ytCountForSlug++;
        }
      }
    }
    
    const newId = ytCountForSlug < vids.length ? vids[ytCountForSlug] : vids[0];
    
    if (oldId !== newId) {
      lines[i] = line.replace(oldId, newId);
      replaceCount++;
      console.log(`✅ Line ${i+1}: [${currentSlug}] ${oldId} → ${newId}`);
    }
  }
}

content = lines.join('\n');
fs.writeFileSync('src/data/bands.ts', content);
console.log(`\nTotal replacements: ${replaceCount}`);
