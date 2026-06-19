<!--
SYNC IMPACT REPORT
==================
Version change: (unversioned template) → 1.0.0
Added sections:
  - Core Principles (I–V): derived from docs/
  - Technology Standards: from docs/project-overview.md
  - Development Workflow: from docs/coding-guidelines.md + docs/testing-guidelines.md
  - Governance
Modified principles: N/A (initial fill)
Removed sections: N/A (initial fill)
Templates reviewed:
  - .specify/templates/plan-template.md ✅ Constitution Check section present; no stale references
  - .specify/templates/spec-template.md ✅ No principle references requiring update
  - .specify/templates/tasks-template.md ✅ Task categories align with principles
  - .specify/templates/checklist-template.md ✅ No stale references
Deferred TODOs: none
-->

# Todo App Constitution

## Core Principles

### I. Code Quality & Simplicity (NON-NEGOTIABLE)

All code MUST follow SOLID, DRY, and KISS principles as defined in `docs/coding-guidelines.md`.

- Every module, component, and function MUST have a single, well-defined responsibility (SRP).
- Common logic MUST be extracted into shared utilities or components; duplication is not permitted.
- Solutions MUST favour the simplest correct implementation; complexity requires explicit justification.
- Naming MUST follow project conventions: `camelCase` for variables/functions, `PascalCase` for
  React components and classes, `UPPER_SNAKE_CASE` for constants.
- All code MUST pass ESLint without errors before merging. Warnings MUST be addressed unless
  explicitly documented with a reason.
- Error handling MUST be present at every async boundary with meaningful, user-facing messages.

**Rationale**: Consistent, readable code reduces onboarding friction and long-term maintenance cost.
Enforcing linting and naming rules through tooling removes subjective debate from code review.

### II. Test-First Development (NON-NEGOTIABLE)

Automated tests MUST accompany every feature and bug fix.

- Target code coverage is **80 %** or higher across all packages (measured by Jest).
- Unit tests MUST be written for all components, utility functions, and service layers.
- Integration tests MUST cover component interactions and frontend-to-backend API communication.
- Tests MUST be independent: each test sets up its own data, cleans up after itself, and shares
  no state with other tests.
- External dependencies (API calls, timers, storage) MUST be mocked in unit tests.
- Test files MUST live in `__tests__/` directories co-located with source files and follow the
  naming convention `{filename}.test.js`.
- Test names MUST describe the expected behaviour, not the implementation detail.

**Rationale**: A high-coverage, isolated test suite is the primary safety net against regressions
and is the executable documentation of the system's intended behaviour.

### III. Functional Minimalism

The application MUST implement only the features described in `docs/functional-requirements.md`.

- Supported operations: create, view, update status, edit title/due date, and delete todos.
- All state changes MUST be persisted immediately to the backend; no optimistic-only updates
  without backend confirmation.
- Features explicitly listed as out-of-scope (filtering, search, multi-user, authentication,
  undo/redo, bulk operations) MUST NOT be added without a formal requirement change.
- New functionality requires an updated spec before implementation begins.

**Rationale**: Scope creep degrades focus and quality. A minimal, working product delivered on
time is more valuable than a feature-rich product that is incomplete or fragile.

### IV. Accessible & Themed UI

The UI MUST comply with WCAG AA accessibility standards and the Halloween design theme defined
in `docs/ui-guidelines.md`.

- All interactive elements MUST be keyboard accessible with visible focus indicators.
- Color contrast MUST meet WCAG AA ratios for both light and dark modes.
- Icon buttons MUST have descriptive `aria-label` or `title` attributes.
- The colour palette, 8 px spacing grid, and typography scale defined in `docs/ui-guidelines.md`
  MUST be followed; deviations require documented justification.
- Dark/light mode MUST be supported; user preference MUST be persisted in `localStorage` and
  default to the OS system preference.
- Layout MUST be desktop-first with the responsive breakpoints specified in the UI guidelines.

**Rationale**: Accessibility is a baseline quality requirement, not an add-on. The Halloween
theme is the agreed design identity of the project and must remain consistent.

### V. Monorepo Discipline

The project MUST be maintained as an npm workspaces monorepo with a clean separation of concerns
between packages.

- `packages/frontend/` contains the React application only.
- `packages/backend/` contains the Express.js API only.
- Cross-package dependencies MUST be declared via `package.json` workspace references; no
  direct path hacks.
- Root-level scripts (`npm run start`, `npm test`) MUST remain functional and cover all packages.
- Node.js v16+ and npm v7+ are the minimum supported runtime versions.

**Rationale**: A disciplined monorepo structure enables independent iteration on frontend and
backend while sharing tooling and CI configuration.

## Technology Standards

- **Frontend**: React (functional components with hooks), CSS for styling, Jest + React Testing
  Library for tests.
- **Backend**: Node.js, Express.js, Jest for tests.
- **Linting**: ESLint MUST be configured and passing in both packages.
- **Code formatting**: 2-space indentation, LF line endings, no trailing whitespace, lines ≤ 100
  characters for code.
- **No database schema changes** beyond basic todo storage are permitted without a new spec.

## Development Workflow

- Features MUST start from a specification before implementation.
- All PRs MUST pass ESLint and the full test suite (≥ 80 % coverage) to merge.
- Linting errors MUST be resolved; warnings MUST be addressed or documented before merging.
- New components MUST follow the import-order convention: external libraries → internal modules →
  styles, each group separated by a blank line.
- Comments MUST explain *why*, not *what*; outdated comments MUST be removed.

## Governance

This constitution supersedes all other informal practices. Amendments require:

1. A documented rationale explaining the change and its impact.
2. Version increment following semantic versioning:
   - **MAJOR**: Backward-incompatible principle removal or redefinition.
   - **MINOR**: New principle or section added, or material expansion of existing guidance.
   - **PATCH**: Clarifications, wording fixes, or non-semantic refinements.
3. Propagation review across all `.specify/templates/` files to ensure alignment.
4. All PRs and reviews MUST verify compliance with the principles in this document.

For runtime development guidance, refer to `docs/` (coding, testing, UI, and functional
requirements files) and the Copilot instructions at `.github/copilot-instructions.md`.

**Version**: 1.0.0 | **Ratified**: 2026-06-19 | **Last Amended**: 2026-06-19
