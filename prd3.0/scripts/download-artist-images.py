#!/usr/bin/env python3
import json
import os
import urllib.parse
import urllib.request
from pathlib import Path

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; JPopHubBot/1.0)"
}
ROOT = Path(__file__).resolve().parent.parent

# Mapping of slug -> exact Wikimedia Commons file title
# These are the best freely-licensed images found for each artist.
ARTIST_FILES = {
    "sixtones": "File:SixTONES.png",
    "naniwa-danshi": "File:Naniwa Danshi.jpg",
    "be-first": "File:BE FIRST logo.jpg",  # only logo available on Commons
    "number-i": "File:Number i Logo.png",  # only logo available on Commons
    "ini": "File:INI in Thai 230318.jpg",
    "jo1": "File:JO1 at Beyond The Dark Limited Edition Bangkok.jpg",
    "perfume": "File:Perfume（パフューム）KKBOX 2014-02-22.jpg",
    "nogizaka46": "File:2019.01.26「第14回 KKBOX MUSIC AWARDS in Taiwan」乃木坂46 @台北小巨蛋 (46830410112).jpg",
    "sakurazaka46": "File:櫻坂46「SAKURAZAKA46 SPORTS FESTIVAL supported by AEON CARD」TOYOTA ARENA TOKYO 2026年1月30日の東京 202601301803 IMG 5936.jpg",
    "andteam": "File:2024-08-28 &TEAM fan event in Seoul 09.jpg",
    "yuri": "File:HK SYP Sai Ying Pun street wall posters mall singer 優里 YUURI Asia Tour 2025 August 2025 N13P 03.jpg",
    "tani-yuuki": "File:Tani Yuuki.jpg",
    "ikuta-lilas": "File:Ikura at YOASOBI London.jpg",
    "man-with-a-mission": "File:Japan Expo 13 - MAN WITH A MISSION - 2012-0705- P1400914.jpg",
    "ryokuoushoku-shakai": "File:Ryokuoushoku Shakai on SET News.jpg",
    "the-alfee": "File:THE ALFEE コンサ (48103490847).jpg",
    "southern-all-stars": "File:Southern All Stars, 2023.png",
    "keisuke-kuwata": "File:Kuwata Keisuke, 2022.png",
    "imase": "File:Imase 2023.jpg",
    # Logos for artists without freely-licensed photos on Commons
    "yorushika": "File:Yorushika Logo.jpg",
    # nabori and milet will be handled separately if no Commons file is found
}


def get_image_url(title, thumb_width=1200):
    url = "https://commons.wikimedia.org/w/api.php"
    params = {
        "action": "query",
        "titles": title,
        "prop": "imageinfo",
        "iiprop": "url|size",
        "iiurlwidth": str(thumb_width),
        "format": "json",
    }
    req = url + "?" + urllib.parse.urlencode(params)
    request = urllib.request.Request(req, headers=HEADERS)
    with urllib.request.urlopen(request, timeout=15) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    pages = data.get("query", {}).get("pages", {})
    for page in pages.values():
        if "imageinfo" in page and page["imageinfo"]:
            info = page["imageinfo"][0]
            url = info.get("thumburl") or info.get("url")
            w = info.get("thumbwidth", info.get("width", 0))
            h = info.get("thumbheight", info.get("height", 0))
            return url, w, h
    return None, 0, 0


def download(url, dest):
    request = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(request, timeout=30) as resp:
        data = resp.read()
    with open(dest, "wb") as f:
        f.write(data)
    return len(data)


def main():
    images_dir = ROOT / "images"
    public_dir = ROOT / "public" / "images"
    images_dir.mkdir(parents=True, exist_ok=True)
    public_dir.mkdir(parents=True, exist_ok=True)

    for slug, title in ARTIST_FILES.items():
        print(f"[ {slug} ] -> {title}")
        try:
            url, w, h = get_image_url(title)
            if not url:
                print(f"  ✗ could not get URL")
                continue
            ext = os.path.splitext(url)[1].lower()
            if ext not in [".jpg", ".jpeg", ".png", ".webp"]:
                ext = ".jpg"
            filename = f"{slug}{ext}"
            dest = images_dir / filename
            size = download(url, dest)
            public_dest = public_dir / filename
            with open(dest, "rb") as srcf, open(public_dest, "wb") as dstf:
                dstf.write(srcf.read())
            print(f"  ✓ {filename} ({w}x{h}, {size} bytes)")
        except Exception as e:
            print(f"  ✗ {e}")


if __name__ == "__main__":
    main()
