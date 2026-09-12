#!/bin/bash

# Change to the "common" directory and run "pnpm run pub"
cd common/
pnpm run pub

# Go back to the parent directory
cd ..

# Install dependencies in all workspaces (pnpm will handle workspace protocol automatically)
# This updates all services to use the newly published version
pnpm install