#!/usr/bin/env bash
set -euo pipefail

# stop.sh
# Stops any process listening on TCP/8080 and removes pid file created by run.sh
# Usage: ./stop.sh

cd "$(dirname "$0")"

echo "Stopping any process on port 8080..."
pids=$(lsof -ti tcp:8080 || true)
if [[ -n "$pids" ]]; then
  echo "Killing: $pids"
  kill -9 $pids || true
fi

PIDFILE=/tmp/portal-copa-8080.pid
if [[ -f "$PIDFILE" ]]; then
  pid=$(cat "$PIDFILE")
  if ps -p "$pid" > /dev/null 2>&1; then
    kill -9 "$pid" || true
  fi
  rm -f "$PIDFILE"
  echo "Removed pidfile $PIDFILE"
fi

echo "Stopped servers on port 8080."
