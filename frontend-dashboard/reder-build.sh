#!/bin/sh
# Elimina cualquier rastro de pnpm
rm -rf pnpm-lock.yaml node_modules

# Instala dependencias con npm
npm install

# Construye el proyecto
npm run build