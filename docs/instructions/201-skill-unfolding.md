---
sidebar_label: 201. Skill Unfolding
---

# Skill Unfolding

## Prerequisites

🚨 Did you set up `pnpm`? Are you on the right branch?

👉 [Initial Setup](./000-setup.md)

## Setup

```sh
pnpm cook start 201-skill-unfolding
```

A skill is a map. The same prompt, with and without `angular-developer`, should change which skill files get read.

## 🎯 Goal

Guard the admin route twice. Round 1 has no skill installed. Round 2 uses `angular-developer`. Note which skill reference files the agent opened.

## 📝 Steps

### Round 1

#### 1. Confirm no skill is installed at the workspace root.

Do not copy a solution workspace.

#### 2. Paste this prompt.

```text
Add a user service that tells if the user is admin and loads the information from local storage.
However you want, doesn't matter.
We'll implement this later, and there are no formats for local storage yet.
It checks the user roles and sees if there's admin in the user roles.
Create a guard and apply it to the admin route so that users cannot visit the admin page if they don't have the admin role.
```

#### 3. Note which files the agent read, if any.

### Round 2

#### 1. Reset the app if the first attempt left messy code.

Start the exercise again, or return the app folder to a clean state, before you install the skill.

```sh
pnpm cook start 201-skill-unfolding
```

#### 2. Install `angular-developer`.

```sh
npx skills add angular/skills
```

#### 3. Paste the same prompt.

#### 4. Note which skill reference files the agent opened.

Compare the transcript with round 1.
