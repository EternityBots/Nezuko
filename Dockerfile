FROM oven/bun:1-debian

# ffmpeg: stickers, GIFs and merging YouTube audio/video tracks
RUN apt-get update \
    && apt-get install -y --no-install-recommends ffmpeg ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# yt-dlp: fallback YouTube downloader (standalone build, no Python needed)
ADD --chmod=755 https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux /usr/local/bin/yt-dlp

WORKDIR /nezuko

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

COPY . .

ENV NODE_ENV=production
EXPOSE 8080
CMD ["bun", "run", "src/index.ts"]
