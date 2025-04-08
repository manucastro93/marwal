#!/bin/sh
echo "=== DEBUG ==="
pwd
ls -la
ls -la dist/
vite preview --host 0.0.0.0 --port $PORT