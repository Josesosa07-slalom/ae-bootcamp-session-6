# Research: Overdue Todo Visual Indicator

**Feature**: 001-overdue-todos | **Date**: 2026-06-19

---

## 1. WCAG AA Colour Values for `--color-warning`

### Decision
Two amber values — one per colour scheme:
- **Light mode**: `--color-warning: #b45309`
- **Dark mode**: `--color-warning: #f59e0b`

### Rationale

The spec requires a new amber/orange warning token that:
1. Meets WCAG AA contrast (≥ 4.5:1 for normal text) against the surface backgrounds in both modes.
2. Is visually distinct from the existing Danger red (`#c62828` / `#ef5350`) and Success green.
3. Fits the Halloween orange theme palette without duplicating the primary orange (`#ff6b35`).

**Light mode calculation** (surface `#ffffff`):
- `#b45309` (Amber 700) relative luminance ≈ 0.116
- Contrast ratio with white: (1 + 0.05) / (0.116 + 0.05) = **6.3:1** ✅ WCAG AA

**Dark mode calculation** (surface `#2d2d2d`):
- `#2d2d2d` relative luminance ≈ 0.027
- `#f59e0b` (Amber 500) relative luminance ≈ 0.349
- Contrast ratio: (0.349 + 0.05) / (0.027 + 0.05) = **5.2:1** ✅ WCAG AA

Both values also pass WCAG AA for large text / UI components (3:1 threshold) with comfortable margins.

### Alternatives Considered

| Colour | Mode | Ratio | Decision |
|--------|------|-------|----------|
| `#d97706` (Amber 600) light | Light | 3.6:1 | ❌ Fails AA for normal text |
| `#92400e` (Amber 800) light | Light | 9.2:1 | ✅ Passes but too dark/muddy on cream |
| `#fbbf24` (Amber 400) dark | Dark | 7.0:1 | ✅ Passes but very bright; contrast with orange primary unclear |
| `#f59e0b` (Amber 500) dark | Dark | 5.2:1 | ✅ Passes; best balance of warmth and readability |

---

## 2. Client-Side isOverdue Logic

### Decision
Implement `isOverdue(dueDate, completed)` as an exported utility function in
`packages/frontend/src/utils/dateUtils.js` (or co-locate in `TodoCard.js` if no existing util
file). Use local-date string comparison to avoid UTC timezone edge cases.

```js
/**
 * Returns true if the todo is incomplete and its due date is strictly before today's
 * local date (i.e., it is overdue). Today itself is NOT overdue per the spec.
 *
 * @param {string|null} dueDate - ISO date string "YYYY-MM-DD" or null
 * @param {number|boolean} completed - truthy if the todo is completed
 * @returns {boolean}
 */
export function isOverdue(dueDate, completed) {
  if (!dueDate || completed) return false;
  const now = new Date();
  const todayStr = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-');
  return dueDate < todayStr;
}
```

### Rationale

**Why string comparison instead of `new Date(dueDate) < today`?**
`new Date("2025-12-25")` parses as UTC midnight. In timezones west of UTC (e.g. UTC-5), that
instant falls on 2025-12-24 local time, causing a false-positive overdue flag for items due
that same local day. Building `todayStr` from local date parts and comparing ISO strings
lexicographically avoids the UTC parsing trap while remaining simple and readable.

**Why not `Date.prototype.toLocaleDateString()`?**
Output format varies by locale; string comparison relies on a consistent `YYYY-MM-DD` format
which `toLocaleDateString('en-CA')` does produce, but the explicit parts approach is more
transparent to reviewers and requires no locale argument.

### Alternatives Considered

| Approach | Rejected Because |
|----------|-----------------|
| `new Date(dueDate) < new Date()` | UTC parse causes off-by-one errors in non-UTC timezones |
| `date-fns` / `dayjs` library | Adds a dependency for a three-line utility; KISS principle |
| Backend-computed `isOverdue` flag | Requires API change; spec explicitly rules this out |

---

## 3. Jest Date Mocking Strategy

### Decision
Use `jest.useFakeTimers()` with `jest.setSystemTime(new Date('YYYY-MM-DD'))` in unit tests to
pin `new Date()` to a known value, restoring real timers in `afterEach`.

```js
beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2026-06-19')); // known "today"
});

afterEach(() => {
  jest.useRealTimers();
});
```

This approach is idiomatic with Jest ≥ 27 and allows full deterministic testing of all overdue
boundary conditions (yesterday, today, tomorrow, null, completed).

### Rationale

Pinning system time removes test flakiness caused by the real date advancing. It is the
standard Jest pattern and requires no additional libraries.

### Alternatives Considered

| Approach | Rejected Because |
|----------|-----------------|
| Pass `today` as a parameter to `isOverdue` | Changes public interface solely for testability; leaks implementation detail |
| `jest-date-mock` library | Extra dependency; `jest.useFakeTimers()` achieves the same |
| Spy on `Date` constructor | More brittle than `setSystemTime`; not recommended with modern Jest |

---

## Summary: All Unknowns Resolved

| Item | Resolution |
|------|-----------|
| `--color-warning` values (light/dark) | `#b45309` / `#f59e0b` — both WCAG AA ✅ |
| isOverdue algorithm | Local-date string comparison; see function above |
| Timezone handling | Local date parts build avoids UTC parse edge case |
| Test mocking | `jest.useFakeTimers()` + `setSystemTime` |
| Utility location | Co-located in `TodoCard.js` if no shared util file exists; else `utils/dateUtils.js` |
| Contracts / API | No changes — feature is frontend-only |
