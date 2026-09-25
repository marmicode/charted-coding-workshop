# Setup

## 📦 Install stuff

### Install git `>= 2.23`

https://git-scm.com/downloads

:::warning
Make sure to pick a git version `>= 2.23`
:::

### Install NodeJS `>=22.12.0`

:::warning
Make sure to pick a NodeJS version `>=22.12.0`
:::

https://nodejs.org/en/download

### Install pnpm

https://pnpm.io/installation

```sh
corepack enable
```

or if you are using [Volta](https://volta.sh/)

```sh
volta install pnpm
```

## 📥 Retrieve source code and install dependencies

```sh
git clone https://github.com/marmicode/charted-coding-workshop.git

cd charted-coding-workshop

pnpm install
```

## ⌨️ Cook CLI

`pnpm cook` checks out one exercise on a `cooking` branch. It copies that exercise workspace onto the repo root and leaves the app at `apps/whiskmate`.

```sh
pnpm cook
```

Or start a specific exercise:

```sh
pnpm cook start 101-review-fatigue
```

:::warning
Starting an exercise replaces local changes after you confirm, and it removes the other exercise apps from the working tree. Your work for the current exercise stays on the `cooking` branch until you start another one.
:::

Serve the focused app with:

```sh
npx nx serve
```

## 📖 These instructions

From the repo root:

```sh
cd docs

pnpm start
```
