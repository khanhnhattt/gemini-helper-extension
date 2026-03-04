Gemini Helper Extension
=======================

A cross-platform browser extension built with **WXT** and **Vue 3** that acts as a small helper on Google Gemini for a better workflow.

### Features

- **Archived Chat**: Add Archive feature for Gemini to prevent delete to organize sidebar

In Progress:

- **Chat Sorting**: Add options to sort chats instead of default by recently use
- **Improved Shortcut**: Improve shortcuts system on Gemini

### Scripts

- **Development (Chromium)**: `pnpm dev`
- **Development (Firefox)**: `pnpm dev:firefox`
- **Build (Chromium)**: `pnpm build`
- **Build (Firefox)**: `pnpm build:firefox`
- **Create release zip (Chromium)**: `pnpm zip`
- **Create release zip (Firefox)**: `pnpm zip:firefox`

### Getting Started

1. Install dependencies: `pnpm install`
2. Start dev mode: `pnpm dev`
3. Load the generated extension from the `.output` directory into your browser's extension page

### Tech Stack

- WXT (browser extension framework)
- Vue 3 + TypeScript
- pnpm v10+ (Package Management)

### Further Notes
- After finishing first development cycle, looking to publish extension on Chrome, Firefox and (hopefully) Safari