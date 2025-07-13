from fastapi import FastAPI, Query
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import os
import re
from yt_dlp import YoutubeDL
from mutagen.id3 import ID3, APIC, TIT2, TPE1, TALB
from mutagen.mp3 import MP3
from mutagen.id3 import TRCK


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://krishanator.com"
        ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


DOWNLOADS_FOLDER = str(Path.home() / "Downloads")
os.makedirs(DOWNLOADS_FOLDER, exist_ok=True)

app.mount("/downloads", StaticFiles(directory=DOWNLOADS_FOLDER), name="downloads")

@app.get("/convert")
def convert_yt_to_mp3(url: str = Query(..., description="YouTube video URL")):
    try:
        ydl_opts = {
            'format': 'bestaudio/best',
            'outtmpl': f'{DOWNLOADS_FOLDER}/%(title).200s.%(ext)s',
            'cookiefile': 'youtube_cookies.txt',
            'writethumbnail': True,
            'postprocessors': [
                {'key': 'FFmpegExtractAudio', 'preferredcodec': 'mp3', 'preferredquality': '192'},
                {'key': 'EmbedThumbnail'},
                {'key': 'FFmpegMetadata'}
            ],
            'quiet': True,
        }

        with YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)

            title = info.get("track") or info.get("title", "Unknown Title")
            artist = info.get("artist") or info.get("creator") or info.get("uploader", "Unknown Artist")
            album = info.get("album") or "Unknown Album"

            if (not title or not artist) and "title" in info:
                match = re.match(r"(.*) - (.*)", info["title"])
                if match:
                    artist = artist or match.group(1).strip()
                    title = title or match.group(2).strip()

            base_filename = ydl.prepare_filename(info).rsplit('.', 1)[0]
            mp3_filename = base_filename + '.mp3'

        thumbnail_path = None
        for ext in ['jpg', 'webp', 'png']:
            candidate = f"{base_filename}.{ext}"
            if os.path.exists(candidate):
                thumbnail_path = candidate
                break

        audio = MP3(mp3_filename, ID3=ID3)
        try:
            audio.add_tags()
        except Exception:
            pass

        audio.tags.add(TIT2(encoding=3, text=title))
        audio.tags.add(TPE1(encoding=3, text=artist))
        audio.tags.add(TALB(encoding=3, text=album))
        audio.tags.add(TRCK(encoding=3, text='')) 


        if thumbnail_path:
            with open(thumbnail_path, 'rb') as img:
                audio.tags.add(APIC(
                    encoding=3,
                    mime='image/jpeg',
                    type=3,
                    desc='Cover',
                    data=img.read()
                ))

        audio.save()

        return JSONResponse({
            "message": "Download and tagging complete.",
            "file": os.path.basename(mp3_filename),
            "url": f"/downloads/{os.path.basename(mp3_filename)}"
        })

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
