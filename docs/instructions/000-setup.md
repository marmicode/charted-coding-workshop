# Setup

## 📦 Install stuff

### Install git `>= 2.23`

https://git-scm.com/downloads

:::warning
Make sure to pick a git version `>= 2.23`
:::

### Install NodeJS `>=24.0.0`

:::warning
Make sure to pick a NodeJS version `>=24.0.0`
:::

https://nodejs.org/en/download

### Install pnpm

https://pnpm.io/installation

## 📥 Retrieve source code and install dependencies

```sh
git clone https://github.com/marmicode/charted-coding-workshop.git

cd charted-coding-workshop

pnpm install
```

## ⌨️ Cook CLI

The cook CLI allows you to cook exercises:

- select an exercise from a list
- go to the solution

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

## 🤖 Agentic Tutor

Whenever you need help, you can ask the agentic tutor for a hint.

You can use the `/next-hint` skill to get a hint for the current exercise.
