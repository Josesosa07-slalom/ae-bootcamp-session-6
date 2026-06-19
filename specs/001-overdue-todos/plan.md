# Implementation Plan: Overdue Todo Visual Indicator

**Branch**: `001-overdue-todos` | **Date**: 2026-06-19 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-overdue-todos/spec.md`

## Summary

Add a client-side overdue indicator to the `TodoCard` component that displays a "Past Due" text
label (with icon) inline near the due date whenever a todo is incomplete and its `dueDate` is
strictly before today's local calendar date. The indicator is implemented as a pure derived-state
UI enhancement — no backend changes, no new data fields. A new amber/orange CSS token
(`--color-warning`) is added to the Halloween theme to satisfy WCAG AA contrast in both
light and dark modes, keeping it visually distinct from the existing Danger (red) and
Success (green) tokens.

## Technical Context

**Language/Version**: JavaScript (React 18, Node.js 16+)

**Primary Dependencies**: React (functional components + hooks), Jest, React Testing Library,
ESLint

**Storage**: N/A — overdue status is derived at render time from existing `dueDate` and
`completed` fields; no new backend fields or API endpoints needed

**Testing**: Jest + React Testing Library (frontend); Jest (backend — no changes)

**Target Platform**: Web browser (desktop-first, responsive breakpoints per UI guidelines)

**Project Type**: Web application — npm workspaces monorepo (`packages/frontend` +
`packages/backend`)

**Performance Goals**: Overdue indicator renders within the same cycle as the todo list (SC-002);
updates immediately when `completed` or `dueDate` changes (SC-003)

**Constraints**: WCAG AA colour contrast (4.5:1 for text, 3:1 for UI components) in light and
dark modes; Jest coverage ≥ 80%; ESLint passing before merge

**Scale/Scope**: Single-user todo app (~10–50 items); frontend-only change

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Code Quality & Simplicity | ✅ PASS | isOverdue is a single-responsibility pure function; no duplication |
| II. Test-First Development | ✅ PASS | Unit tests required for isOverdue util + TodoCard overdue rendering |
| III. Functional Minimalism | ✅ PASS | Spec-driven; no scope creep; no out-of-scope features added |
| IV. Accessible & Themed UI | ✅ PASS | `--color-warning` token verified WCAG AA in both modes (see research.md); `aria-label` on icon |
| V. Monorepo Discipline | ✅ PASS | Change is isolated to `packages/frontend/`; no cross-package hacks |

**Post-design re-check**: ✅ PASS — design artifacts confirm no constitution violations.

## Project Structure

### Documentation (this feature)

```text
specs/001-overdue-todos/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks — NOT created by /speckit.plan)
```

Note: No `contracts/` directory — the feature makes no changes to the backend REST API.

### Source Code (repository root)

```text
packages/frontend/
├── src/
│   ├── components/
│   │   ├── TodoCard.js            # ADD: isOverdue() derived logic + indicator JSX
│   │   └── __tests__/
│   │       └── TodoCard.test.js   # ADD: overdue indicator test cases
│   └── styles/
│       └── theme.css              # ADD: --color-warning token (light + dark)
└── App.css                        # ADD: .todo-overdue-badge styles

packages/backend/                  # No changes
```

**Structure Decision**: Web application (frontend + backend monorepo). This feature touches
only `packages/frontend/` — no backend, no shared packages, no new files beyond test additions.
