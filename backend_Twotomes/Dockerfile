FROM mcr.microsoft.com/devcontainers/python:3.12-bookworm

# Install system packages
RUN apt-get update && apt-get install -y \
  fonts-ipafont-gothic \
  && rm -rf /var/lib/apt/lists/*

# Install python package
RUN pip install --no-cache-dir \
  fastapi \
  "uvicorn[standard]" \
  pillow \
  && rm -rf /root/.cache

WORKDIR /app
