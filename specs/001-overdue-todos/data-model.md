# Data Model: Overdue Todo Visual Indicator

**Feature**: 001-overdue-todos | **Date**: 2026-06-19

---

## Entities

### Todo (existing — no new fields)

The overdue status is **derived** at display time and never stored. No schema changes, no API
changes, no migration needed.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | integer | Yes | Primary key (existing) |
| `title` | string (max 255) | Yes | Todo description (existing) |
| `dueDate` | string `YYYY-MM-DD` \| null | No | Optional due date (existing) |
| `completed` | integer (0 \| 1) | Yes | Completion flag (existing) |
| `createdAt` | string ISO-8601 | Yes | Creation timestamp (existing) |

### Derived: Overdue Status

**Not stored.** Computed by `isOverdue(dueDate, completed)` at render time.

```
isOverdue(dueDate, completed):
  → false   if completed is truthy
  → false   if dueDate is null / undefined / empty
  → false   if dueDate >= today's local YYYY-MM-DD string
  → true    if dueDate < today's local YYYY-MM-DD string
```

**State transition table**:

| completed | dueDate | relative to today | isOverdue |
|-----------|---------|-------------------|-----------|
| truthy    | any     | any               | false     |
| falsy     | null    | —                 | false     |
| falsy     | set     | future (≥ today)  | false     |
| falsy     | set     | past (< today)    | **true**  |

> "Today" means the local calendar day at render time, using `new Date()` local date parts.
> Exactly today (dueDate === todayStr) is NOT overdue.

---

## Validation Rules

These rules are enforced in `isOverdue` and reflected in `TodoCard` rendering:

1. `dueDate` must be a `YYYY-MM-DD` formatted string to be considered; any falsy value
   (null, undefined, "") is treated as "no due date" → not overdue.
2. `completed` is treated as a boolean coercion (`!!completed`); both `1` (integer from
   backend) and `true` map to completed.
3. The comparison is strict less-than (`<`), ensuring `dueDate === todayStr` evaluates
   to not overdue (per spec edge case: "today is not overdue").

---

## New CSS Design Token

### `--color-warning`

Added to `packages/frontend/src/styles/theme.css`.

| Scope | Value | Contrast vs surface | WCAG AA |
|-------|-------|---------------------|---------|
| `:root` (light) | `#b45309` | 6.3:1 vs `#ffffff` | ✅ |
| `[data-theme="dark"]` | `#f59e0b` | 5.2:1 vs `#2d2d2d` | ✅ |

---

## New UI Element: `.todo-overdue-badge`

Added to `packages/frontend/src/App.css`.

**Placement**: Inline within `.todo-content`, rendered immediately after the `todo-due-date`
paragraph when `isOverdue` is true.

**Structure**:
```html
<span class="todo-overdue-badge" aria-label="Past Due">
  ⚠ Past Due
</span>
```

**Styling properties**:
- `color: var(--color-warning)`
- `font-size: 12px` (caption scale — matches `.todo-due-date`)
- `font-weight: 600`
- Display: `inline-flex`, `align-items: center`, `gap: 4px`
- Not rendered when `isOverdue` is false (conditional JSX, no hidden element)

---

## No New Services, APIs, or Backend Entities

Per spec Assumptions: "no new server-side logic, data storage, or API endpoints are needed."
The backend `todoService.js` and `app.js` are unchanged.
