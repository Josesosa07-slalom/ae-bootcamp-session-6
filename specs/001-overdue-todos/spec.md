# Feature Specification: Overdue Todo Visual Indicator

**Feature Branch**: `001-overdue-todos`

**Created**: 2026-06-19

**Status**: Draft

**Input**: User description: "Support for Overdue Todo Items — Users need a clear, visual way to identify which todos have not been completed by their due date."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Overdue Todos at a Glance (Priority: P1)

A user opens their todo list and immediately identifies which incomplete tasks are past their due
date without having to manually compare each due date against today's date. Overdue items appear
visually distinct from on-time and completed items.

**Why this priority**: This is the core value of the feature — the ability to instantly recognise
overdue items is the primary user need. All other scenarios build on this foundation.

**Independent Test**: Can be fully tested by loading a todo list that contains at least one
incomplete todo with a past due date and confirming a visible overdue indicator is displayed on
that card and not on non-overdue cards.

**Acceptance Scenarios**:

1. **Given** a todo is incomplete and its due date is before today's date,
   **When** the user views the todo list,
   **Then** that todo card displays a visible overdue indicator — an icon paired with a "Past Due"
   text label, displayed inline near the due date.

2. **Given** a todo is incomplete and its due date is today or in the future,
   **When** the user views the todo list,
   **Then** that todo card does NOT display an overdue indicator.

3. **Given** a todo has no due date set,
   **When** the user views the todo list,
   **Then** that todo card does NOT display an overdue indicator.

---

### User Story 2 - Completed Todos Are Never Shown as Overdue (Priority: P2)

A user marks a previously overdue todo as complete. The overdue indicator disappears immediately,
making it clear the task is done and no longer requiring attention.

**Why this priority**: Without this behaviour, the overdue indicator would create confusion and
false urgency for tasks the user has already addressed.

**Independent Test**: Can be fully tested by toggling a todo with a past due date from incomplete
to complete and verifying the overdue indicator is removed.

**Acceptance Scenarios**:

1. **Given** a todo is marked complete and its due date is before today's date,
   **When** the user views the todo list,
   **Then** the todo card does NOT display an overdue indicator.

2. **Given** an incomplete todo with a past due date is showing an overdue indicator,
   **When** the user marks it as complete,
   **Then** the overdue indicator disappears immediately without a page refresh.

---

### User Story 3 - Overdue State Reflects Updated Due Dates (Priority: P3)

A user edits a todo's due date. If the new date is in the future the overdue indicator disappears;
if the new date is in the past the indicator appears.

**Why this priority**: Ensures consistency between the stored due date and the visual state. Users
who adjust deadlines expect the UI to reflect the change immediately.

**Independent Test**: Can be fully tested by editing an overdue todo's due date to tomorrow and
verifying the overdue indicator is removed, then setting it to yesterday and verifying it reappears.

**Acceptance Scenarios**:

1. **Given** an overdue todo is displaying the indicator,
   **When** the user edits the due date to a future date,
   **Then** the overdue indicator disappears immediately.

2. **Given** a non-overdue todo with a future due date,
   **When** the user edits the due date to a past date,
   **Then** the overdue indicator appears immediately.

---

### Edge Cases

- What happens when a todo's due date is exactly today? → Today's date is NOT considered overdue;
  overdue means strictly before today (past midnight of the current day).
- What happens when a todo has no due date and the user edits it to add a past due date? → The
  overdue indicator appears immediately after saving.
- How does the system handle timezone differences? → The comparison uses the client's local date
  (same as the date displayed to the user), ensuring consistency between what the user sees and
  what the system flags.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST display a visible overdue indicator on any todo card that is both
  incomplete and has a due date strictly before today's local date.
- **FR-002**: The system MUST NOT display an overdue indicator on todo cards that are marked as
  complete, regardless of their due date.
- **FR-003**: The system MUST NOT display an overdue indicator on todo cards that have no due
  date set.
- **FR-004**: The system MUST NOT display an overdue indicator on todo cards whose due date is
  today or in the future.
- **FR-005**: The overdue indicator MUST update immediately (without a page refresh) when a
  todo's completion status or due date changes.
- **FR-006**: The overdue indicator MUST be visually distinct from the completed state indicator
  and must not be confused with the existing delete (danger) or success colour states.
- **FR-007**: The overdue indicator MUST meet WCAG AA colour contrast requirements in both
  light mode and dark mode.
- **FR-008**: The overdue indicator MUST include a non-colour cue — specifically, a "Past Due"
  text label — so that users with colour vision deficiencies can identify overdue items.
- **FR-009**: The overdue indicator MUST be consistent with the existing Halloween design theme
  colour palette and spacing conventions, using a new amber/orange warning colour token
  (e.g., `--color-warning`) that is distinct from the existing Danger and Success entries.

### Key Entities

- **Todo**: An existing entity with `title`, `dueDate` (optional date), and `completed` (boolean)
  fields. No new fields are required; overdue status is derived at display time by comparing
  `dueDate` to today's local date.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can identify all overdue todos in their list without reading individual due
  dates — confirmed by task observation (users point to overdue items correctly ≥ 95% of the time).
- **SC-002**: The overdue indicator appears within the same render cycle as the todo list loads;
  no additional user action is required.
- **SC-003**: When a todo's status or due date is changed, the overdue indicator updates
  immediately — users do not need to refresh the page.
- **SC-004**: Colour contrast of the overdue indicator against its background meets WCAG AA ratio
  (4.5:1 for normal text, 3:1 for large text/UI components) in both light and dark modes.
- **SC-005**: The overdue indicator is identifiable independently of colour — users with colour
  vision deficiencies can distinguish overdue items via a secondary cue (label, icon, or pattern).

## Assumptions

- Todos already have an optional due date field (`dueDate`); no new backend fields or API changes
  are required to support this feature.
- "Overdue" is defined as: incomplete AND `dueDate` is strictly before today's local calendar
  date (i.e., due yesterday or earlier). A todo due today is not overdue.
- The overdue calculation is performed on the client side using the user's local date, matching
  the date shown to the user in the due date field.
- The feature is purely a visual enhancement; no new server-side logic, data storage, or API
  endpoints are needed.
- A new amber/orange warning colour token (e.g., `--color-warning`) will be added to the
  Halloween design theme for the overdue indicator, deliberately distinct from the existing
  Danger (red) and Success (green) entries to satisfy FR-006. It MUST meet the WCAG AA
  contrast ratio in both light and dark modes.
- Completed todos that are past their due date represent finished work and should not surface
  as overdue in any view.

## Clarifications

### Session 2026-06-19

- Q: What should be the primary visual form of the overdue indicator on the todo card? → A: Icon + text label inline near the due date
- Q: What text label should the overdue indicator display alongside the icon? → A: "Past Due"
- Q: What color approach should be used for the overdue indicator? → A: New amber/orange CSS token (e.g., `--color-warning`) distinct from Danger red
