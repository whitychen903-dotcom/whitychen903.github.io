import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const indexPath = join(process.cwd(), "out", "index.html");
let html = readFileSync(indexPath, "utf-8");

// Insert meta refresh before </head> to redirect to /zh/ even without JS
const metaRefresh = '<meta http-equiv="refresh" content="0;url=/zh/">\n';
html = html.replace("</head>", metaRefresh + "</head>");

writeFileSync(indexPath, html);
console.log("✅ Fixed out/index.html with meta refresh redirect to /zh/");
