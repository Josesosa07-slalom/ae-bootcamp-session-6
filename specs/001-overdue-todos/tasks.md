# Tasks: Overdue Todo Visual Indicator

**Input**: Design documents from `/specs/001-overdue-todos/`

**Prerequisites**: plan.md ✅ | spec.md ✅ | research.md ✅ | data-model.md ✅ | quickstart.md ✅

**Organization**: Tasks are grouped by user story to enable independent implementation and
testing of each story. All changes are isolated to `packages/frontend/` — no backend changes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Exact file paths are included in every description

## Path Conventions

All paths are relative to the repository root (`/workspaces/ae-bootcamp-session-6`).
Backend is unchanged — all tasks target `packages/frontend/`.

---

## Phase 1: Setup (Verify Baseline)

**Purpose**: Confirm the existing test suite is green before any changes are introduced.

- [ ] T001 Run existing frontend tests to confirm green baseline: `npm test --workspace=packages/frontend -- --watchAll=false`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add the CSS design token and badge styles that `TodoCard.js` will depend on. These
must be in place before any component work begins.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T002 Add `--color-warning` CSS token to `packages/frontend/src/styles/theme.css` — add `--color-warning: #b45309` under `:root` (light mode) and `--color-warning: #f59e0b` under `[data-theme="dark"]` (dark mode)
- [ ] T003 [P] Add `.todo-overdue-badge` CSS class to `packages/frontend/src/App.css` — `color: var(--color-warning); font-size: 12px; font-weight: 600; display: inline-flex; align-items: center; gap: 4px;`

**Checkpoint**: CSS token and badge styles are available — component implementation can now begin.

---

## Phase 3: User Story 1 — View Overdue Todos at a Glance (Priority: P1) 🎯 MVP

**Goal**: Incomplete todos with a due date strictly before today display a "⚠ Past Due" badge
inline near the due date. Non-overdue and no-due-date cards show nothing.

**Independent Test**: Load a todo list containing (a) an incomplete todo with yesterday's date,
(b) an incomplete todo due today, (c) an incomplete todo with no due date, and (d) a completed
todo with yesterday's date. Verify only (a) shows the badge.

### Tests for User Story 1 ⚠️

> **Write these tests FIRST and confirm they FAIL before implementing `isOverdue`.**

- [ ] T004 [P] [US1] Add `isOverdue` unit tests to `packages/frontend/src/components/__tests__/TodoCard.test.js` — use `jest.useFakeTimers()` / `jest.setSystemTime(new Date('2026-06-19'))` and cover: past due date shows badge, today's date shows no badge, future date shows no badge, null dueDate shows no badge (see research.md §3 for mock setup)

### Implementation for User Story 1

- [ ] T005 [US1] Export `isOverdue(dueDate, completed)` function from `packages/frontend/src/components/TodoCard.js` — implement local-date string comparison as specified in research.md §2 (return false if `!dueDate || completed`; build `todayStr` from local date parts; return `dueDate < todayStr`)
- [ ] T006 [US1] Add conditional overdue badge JSX to `packages/frontend/src/components/TodoCard.js` — render `<span className="todo-overdue-badge" aria-label="Past Due">⚠ Past Due</span>` immediately after the due date element when `isOverdue(todo.dueDate, todo.completed)` is true
- [ ] T007 [US1] Verify all US1 tests pass: `npm test --workspace=packages/frontend -- --watchAll=false`

**Checkpoint**: User Story 1 is fully functional — overdue badge appears for past-due incomplete todos only.

---

## Phase 4: User Story 2 — Completed Todos Are Never Shown as Overdue (Priority: P2)

**Goal**: A todo marked complete never displays the overdue badge, even if its due date is in the
past. The badge disappears immediately when a todo is marked complete (no page refresh).

**Independent Test**: Toggle a todo with yesterday's due date from incomplete to complete.
Verify the badge disappears immediately and does not reappear without a page refresh.

### Tests for User Story 2 ⚠️

> **Write these tests FIRST and confirm they FAIL (or that coverage is missing) before verifying.**

- [ ] T008 [P] [US2] Add completed-state badge suppression tests to `packages/frontend/src/components/__tests__/TodoCard.test.js` — assert no badge renders when `completed=true` and `dueDate` is yesterday; use fake timers from T004 setup
- [ ] T009 [US2] Add toggle-to-complete test to `packages/frontend/src/components/__tests__/TodoCard.test.js` — render an overdue todo, simulate marking it complete (update props), assert badge is no longer in the DOM (React derived-state — no separate implementation needed)

**Checkpoint**: User Stories 1 AND 2 are independently testable and passing.

---

## Phase 5: User Story 3 — Overdue State Reflects Updated Due Dates (Priority: P3)

**Goal**: Editing a todo's due date causes the overdue indicator to update immediately. Setting a
future date removes the badge; setting a past date adds it.

**Independent Test**: Render a non-overdue todo, update its `dueDate` prop to yesterday, verify
the badge appears. Then update `dueDate` to tomorrow and verify the badge disappears.

### Tests for User Story 3 ⚠️

> **Write these tests FIRST and confirm they FAIL (or that coverage is missing) before verifying.**

- [ ] T010 [US3] Add due-date-edit badge update tests to `packages/frontend/src/components/__tests__/TodoCard.test.js` — render a non-overdue todo and re-render with a past `dueDate` (badge appears); then re-render with a future `dueDate` (badge disappears) — React re-render covers this; no additional implementation needed

**Checkpoint**: All three user stories are independently functional and fully tested.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validate quality, accessibility, and coverage across all user stories.

- [ ] T011 [P] Run ESLint on changed frontend files: `npx eslint packages/frontend/src/components/TodoCard.js packages/frontend/src/styles/theme.css` — fix any reported issues
- [ ] T012 Verify Jest coverage remains ≥ 80%: `npm test --workspace=packages/frontend -- --watchAll=false --coverage` — check the coverage summary
- [ ] T013 Run all quickstart.md validation scenarios manually (or via automated test run) — confirm all six scenarios from `specs/001-overdue-todos/quickstart.md` produce the expected results, including the accessibility spot-check (aria-label present, ≥ 4.5:1 contrast in both modes)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately.
- **Foundational (Phase 2)**: Depends on Phase 1 — BLOCKS all user story work.
- **User Stories (Phases 3–5)**: All depend on Foundational phase completion.
  - Stories can proceed in priority order (US1 → US2 → US3) or in parallel if staffed.
  - US1 (Phase 3) must be complete before US2 and US3 (those phases build on the isOverdue logic introduced in US1).
- **Polish (Phase 6)**: Depends on all user stories being complete.

### User Story Dependencies

- **US1 (P1)**: Can start after Phase 2. No dependencies on other stories. Introduces `isOverdue` + badge JSX.
- **US2 (P2)**: Can start after Phase 2. Depends on US1 for the badge rendering logic already being present.
- **US3 (P3)**: Can start after Phase 2. Depends on US1 for the badge rendering logic already being present.

### Within Each User Story

1. Tests MUST be written and confirmed to FAIL before implementation (TDD — constitution Principle II).
2. CSS token and styles (Phase 2) before component changes (Phase 3).
3. `isOverdue` function (T005) before badge JSX (T006).
4. All story tests must pass before moving to next phase.

### Parallel Opportunities

- **T002 and T003** (Phase 2): Can run in parallel (different files).
- **T004 and T003** (Phase 3 / Phase 2): T004 test writing can begin in parallel with T003 once T002 is done.
- **T008 and T009** within Phase 4 can start in parallel with each other.
- **T011 and T012** (Phase 6): Can run in parallel.

---

## Parallel Example: User Story 1

When working as a team, Phase 3 can be split:

```
Developer A:                      Developer B:
─────────────────────────         ─────────────────────────
T004 Write isOverdue tests        (wait for T004 to fail first)
T005 Implement isOverdue()        T003 Add badge CSS to App.css
T006 Add badge JSX to TodoCard    
T007 Run tests → green            
```

After Phase 2 completes:
- Developer A owns T005 + T006 (logic + JSX)
- Developer B owns T003 (styles) in parallel
- Both converge at T007 (verify tests pass)

---

## Implementation Strategy

### MVP Scope (Recommended first delivery)

Complete **Phase 1 + Phase 2 + Phase 3** (T001–T007). This delivers the full visible feature:
the "⚠ Past Due" badge on overdue incomplete todos. User Stories 2 and 3 are inherently
correct because of how `isOverdue` is implemented, but explicit test coverage for those
scenarios is deferred to Phases 4–5.

### Incremental Delivery

1. **Sprint 1 (MVP)**: T001 → T007 — feature visible in production.
2. **Sprint 2**: T008 → T010 — full test coverage for edge cases.
3. **Sprint 3**: T011 → T013 — quality gate and sign-off.
