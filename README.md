# Food Market Web App

[![Netlify Status](https://api.netlify.com/api/v1/badges/e06a2847-65e4-4d6a-8b97-b38da37a32d2/deploy-status)](https://app.netlify.com/sites/food-market-web-app/deploys)
[![Astro Studio](https://github.com/vc-summer-2024-captstone-web/food-market-web-app/actions/workflows/astro-studio.yml/badge.svg?branch=master)](https://github.com/vc-summer-2024-captstone-web/food-market-web-app/actions/workflows/astro-studio.yml)
[![CodeQL](https://github.com/vc-summer-2024-captstone-web/food-market-web-app/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/vc-summer-2024-captstone-web/food-market-web-app/actions/workflows/github-code-scanning/codeql)
[![Prettier Code Formatter](https://github.com/vc-summer-2024-captstone-web/food-market-web-app/actions/workflows/prettier-format.yml/badge.svg)](https://github.com/vc-summer-2024-captstone-web/food-market-web-app/actions/workflows/prettier-format.yml)

## 🚀 Quick start

1. **Use correct node version**

   ```sh
   nvm use
   ```

   If you don't have the correct node version installed, you can install it by running the following command:

   ```sh
   nvm install
   ```
   then rerun:

   ```sh
   nvm use
   ```

   > Note: This will install the node version specified in the `.nvmrc` file

   NVM for Mac/Linux/WSL: https://github.com/nvm-sh/nvm

   NVM for Windows: https://github.com/coreybutler/nvm-windows

2. **Install dependencies**
   ```sh
   npm install
   ```
   Also make sure you have the netlify-cli installed by running the following command:
   ```sh
   npm install -g netlify-cli
   ```

3. **Start the development server**
   ```sh
   npm run dev
   ```
   or if you want to start the development server with the netlify functions:
   ```sh
    npm run dev:netlify
    ```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                                     |
|:--------------------------|:-----------------------------------------------------------|
| `npm install`             | Installs dependencies                                      |
| `npm run dev`             | Starts local dev server at `localhost:4321`                |
| `npm run dev:netlify`     | Run a local dev server in a netlify like environment       |
| `npm run build`           | Build production site to `./dist/`                         |
| `npm run build:remote`    | Build production site and production database to `./dist/` |
| `npm run build:netlify`   | Build production in a netlify like environment             |
| `npm run preview`         | Preview your build locally, before deploying               |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check`           |
| `npm run astro -- --help` | Get help using the Astro CLI                               |
| `npm run format`          | Run prettier formatter                                     |
| `npm run lint`            | Run prettier and astro linters                             |

## 📁 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   └── Card.astro
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
