FROM oven/bun:1-debian

# ffmpeg: stickers, GIFs and merging YouTube audio/video tracks
RUN apt-get update \
    && apt-get install -y --no-install-recommends ffmpeg ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /nezuko

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

COPY . .

ENV NODE_ENV=production
EXPOSE 8080
CMD ["bun", "run", "src/index.ts"]
