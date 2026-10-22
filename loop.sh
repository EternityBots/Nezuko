#!/usr/bin/env bash
# Restarts the bot if it exits. Prefer a process manager (Docker restart policy, pm2, systemd) in production.
while true
do
    bun run src/index.ts
    echo "Bot exited, restarting in 5 seconds..."
    sleep 5
done
