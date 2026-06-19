# Quickstart: Validate Overdue Todo Visual Indicator

**Feature**: 001-overdue-todos | **Date**: 2026-06-19

This guide describes how to run and validate the overdue indicator feature once implemented.
For entity definitions see [data-model.md](data-model.md). For design decisions see
[research.md](research.md).

---

## Prerequisites

- Node.js ≥ 16, npm ≥ 7 installed
- Run from the repository root: `/workspaces/ae-bootcamp-session-6`

---

## Setup

```bash
# Install all workspace dependencies
npm install

# Start backend (port 3001 by default)
npm run start --workspace=packages/backend &

# Start frontend dev server (port 3000 by default)
npm run start --workspace=packages/frontend
```

Open `http://localhost:3000` in a browser.

---

## Validation Scenarios

### Scenario 1 — Overdue indicator appears on past-due incomplete todo

1. Add a todo with a due date of **yesterday** (e.g. 2026-06-18 if today is 2026-06-19).
2. Leave it incomplete.

**Expected**: The todo card shows a "⚠ Past Due" badge in amber/orange, inline below the due
date. The badge is visible in both light and dark modes.

---

### Scenario 2 — No indicator on due-today todo

1. Add a todo with a due date of **today** (2026-06-19).
2. Leave it incomplete.

**Expected**: No "Past Due" badge. The due date is displayed normally.

---

### Scenario 3 — No indicator on future todo

1. Add a todo with a due date of **tomorrow** (2026-06-20).
2. Leave it incomplete.

**Expected**: No "Past Due" badge.

---

### Scenario 4 — No indicator on todo with no due date

1. Add a todo with no due date.

**Expected**: No due date text and no "Past Due" badge.

---

### Scenario 5 — Completed past-due todo shows no indicator

1. Add a todo with a due date of yesterday; leave it incomplete → badge appears.
2. Click the checkbox to mark it as complete.

**Expected**: The "Past Due" badge disappears immediately (no page refresh needed). The title
gains a strikethrough (existing completed styling).

---

### Scenario 6 — Editing due date updates indicator immediately

1. Add a todo with a future due date → no badge.
2. Edit the due date to yesterday.

**Expected**: After saving, the badge appears immediately.

3. Edit the due date back to tomorrow.

**Expected**: After saving, the badge disappears immediately.

---

## Running Automated Tests

```bash
# Run frontend unit tests
npm test --workspace=packages/frontend -- --watchAll=false

# Run all tests across the monorepo
npm test
```

**Expected**: All existing tests pass; new `TodoCard` overdue test cases pass; coverage
remains ≥ 80%.

---

## Accessibility Spot-Check

1. Open browser DevTools → Accessibility panel (or use Lighthouse).
2. Inspect the "Past Due" badge element.

**Expected**:
- The badge has an `aria-label="Past Due"` attribute.
- Colour contrast tool shows ≥ 4.5:1 for badge text against its background in both light and
  dark modes (see [research.md](research.md#1-wcag-aa-colour-values-for---color-warning) for
  exact contrast ratios).

---

## Done / Pass Criteria

All six validation scenarios above produce the expected result, automated tests pass, and the
accessibility spot-check confirms WCAG AA compliance.
