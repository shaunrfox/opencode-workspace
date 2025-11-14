# OpenCode Setup Documentation

## Installation

OpenCode was installed on November 14, 2025 using Homebrew.

### Installation Method
- Primary: `brew install opencode`
- Fallback: `curl -fsSL https://opencode.ai/install.sh | bash` (script unavailable - 404 error)

### Verification
- Version: 1.0.65
- Location: /opt/homebrew/bin/opencode
- Installation successful via Homebrew

### Dependencies Installed
The following dependencies were automatically installed:
- Node.js (v25.2.0) - Required runtime
- brotli, c-ares, icu4c@78 - Compression and networking libraries
- libnghttp2, libnghttp3, libngtcp2 - HTTP/2 and HTTP/3 support
- ca-certificates, openssl@3 - SSL/TLS support
- libuv, uvwasi, simdjson - Core Node.js dependencies
- readline, sqlite, lz4, xz, zstd - Supporting libraries

### Installation Notes
- OpenCode is available in Homebrew core repository
- The official install script at https://opencode.ai/install.sh returned 404
- Homebrew installation completed successfully with all dependencies
- Total installation size: ~85MB for OpenCode + dependencies

## Next Steps
1. Configure OpenCode with Ollama backend
2. Set up model profiles
3. Test integration with local LLM models
