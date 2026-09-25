---
sidebar_label: 301. Charted Design
---

# Charted Design

## Prerequisites

🚨 Did you set up `pnpm`? Are you on the right branch?

👉 [Initial Setup](./000-setup.md)

## Setup

```sh
pnpm cook start 301-charted-design
```

The starter has `angular-developer`. It does not have the Charted Coding skills, and it does not have a meal-plan design doc.

## 🎯 Goal

Install the Charted Coding skills and write the weekly meal plan design. The hard part is the testing strategy and the ordered PR plan, not the feature list. Do not implement the meal plan.

## 📝 Steps

#### 1. Install the Charted Coding skills.

```sh
npx skills add marmicode/skills --skill charted-design --skill charted-review --skill charted-scaffold --skill charted-red --skill charted-green --skill charted-continue
```

#### 2. Write the design.

```text
/charted-design Write the design for a weekly meal plan in Whiskmate.
```

#### 3. Stay on the document.

The design doc is the deliverable. Leave the meal-plan feature unimplemented.

#### 4. Check the two parts that are easy to rush.

- The testing strategy says how each behavior will be verified.
- The PR plan is an ordered list of small slices, not one late diff.
