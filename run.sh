#!/usr/bin/env bash
set -euo pipefail

# run.sh
# Kills any process listening on TCP/8080 and starts a background Python http.server
# Usage: ./run.sh

cd "$(dirname "$0")"

echo "Stopping any process on port 8080..."
pids=$(lsof -ti tcp:8080 || true)
if [[ -n "$pids" ]]; then
  echo "Killing: $pids"
  kill -9 $pids || true
  sleep 1
fi

LOG=/tmp/portal-copa-8080.log
PIDFILE=/tmp/portal-copa-8080.pid

echo "Starting http.server on port 8080 (logs -> $LOG)"
nohup python3 -m http.server 8080 --bind 127.0.0.1 >"$LOG" 2>&1 &
echo $! >"$PIDFILE"
echo "Started (pid $(cat $PIDFILE))."
