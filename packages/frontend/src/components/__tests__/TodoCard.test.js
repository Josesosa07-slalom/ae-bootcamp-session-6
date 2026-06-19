import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TodoCard, { isOverdue } from '../TodoCard';

describe('TodoCard Component', () => {
  const mockTodo = {
    id: 1,
    title: 'Test Todo',
    dueDate: '2025-12-25',
    completed: 0,
    createdAt: '2025-11-01T00:00:00Z'
  };

  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render todo title and due date', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByText(/December 25, 2025/)).toBeInTheDocument();
  });

  it('should render unchecked checkbox when todo is incomplete', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('should render checked checkbox when todo is complete', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('should call onToggle when checkbox is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(mockHandlers.onToggle).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should show edit button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    expect(editButton).toBeInTheDocument();
  });

  it('should show delete button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    expect(deleteButton).toBeInTheDocument();
  });

  it('should call onDelete when delete button is clicked and confirmed', () => {
    window.confirm = jest.fn(() => true);
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    fireEvent.click(deleteButton);
    
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should enter edit mode when edit button is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    fireEvent.click(editButton);
    
    expect(screen.getByDisplayValue('Test Todo')).toBeInTheDocument();
  });

  it('should apply completed class when todo is completed', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    const { container } = render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    const card = container.querySelector('.todo-card');
    expect(card).toHaveClass('completed');
  });

  it('should not render due date when dueDate is null', () => {
    const todoNoDate = { ...mockTodo, dueDate: null };
    render(<TodoCard todo={todoNoDate} {...mockHandlers} isLoading={false} />);
    
    expect(screen.queryByText(/Due:/)).not.toBeInTheDocument();
  });
});

// ── US1: isOverdue unit tests ─────────────────────────────────────────────────
describe('isOverdue()', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-06-19')); // "today" = 2026-06-19
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns true for an incomplete todo with yesterday\'s date', () => {
    expect(isOverdue('2026-06-18', 0)).toBe(true);
  });

  it('returns false for an incomplete todo due today', () => {
    expect(isOverdue('2026-06-19', 0)).toBe(false);
  });

  it('returns false for an incomplete todo with a future date', () => {
    expect(isOverdue('2026-06-20', 0)).toBe(false);
  });

  it('returns false when dueDate is null', () => {
    expect(isOverdue(null, 0)).toBe(false);
  });

  it('returns false when dueDate is undefined', () => {
    expect(isOverdue(undefined, 0)).toBe(false);
  });
});

// ── US1: overdue badge rendering ─────────────────────────────────────────────
describe('TodoCard overdue badge (US1)', () => {
  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-06-19'));
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('shows the overdue badge for an incomplete past-due todo', () => {
    const todo = { id: 1, title: 'Past Due', dueDate: '2026-06-18', completed: 0 };
    render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);
    expect(screen.getByLabelText('Past Due')).toBeInTheDocument();
  });

  it('does not show the badge for an incomplete todo due today', () => {
    const todo = { id: 2, title: 'Due Today', dueDate: '2026-06-19', completed: 0 };
    render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);
    expect(screen.queryByLabelText('Past Due')).not.toBeInTheDocument();
  });

  it('does not show the badge for an incomplete todo with no due date', () => {
    const todo = { id: 3, title: 'No Date', dueDate: null, completed: 0 };
    render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);
    expect(screen.queryByLabelText('Past Due')).not.toBeInTheDocument();
  });

  it('does not show the badge for a completed todo with a past due date', () => {
    const todo = { id: 4, title: 'Done', dueDate: '2026-06-18', completed: 1 };
    render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);
    expect(screen.queryByLabelText('Past Due')).not.toBeInTheDocument();
  });
});

// ── US2: badge suppression for completed todos ────────────────────────────────
describe('TodoCard overdue badge suppression (US2)', () => {
  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-06-19'));
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('does not render badge when completed=true even if dueDate is yesterday', () => {
    const todo = { id: 5, title: 'Completed Overdue', dueDate: '2026-06-18', completed: 1 };
    render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);
    expect(screen.queryByLabelText('Past Due')).not.toBeInTheDocument();
  });

  it('badge disappears when todo transitions from incomplete to complete', () => {
    const overdueTodo = { id: 6, title: 'Overdue', dueDate: '2026-06-18', completed: 0 };
    const { rerender } = render(<TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />);
    expect(screen.getByLabelText('Past Due')).toBeInTheDocument();

    const completedTodo = { ...overdueTodo, completed: 1 };
    rerender(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    expect(screen.queryByLabelText('Past Due')).not.toBeInTheDocument();
  });
});

// ── US3: badge updates when dueDate prop changes ──────────────────────────────
describe('TodoCard overdue badge updates on dueDate change (US3)', () => {
  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-06-19'));
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('badge appears when dueDate is updated to a past date', () => {
    const todo = { id: 7, title: 'Future Todo', dueDate: '2026-06-20', completed: 0 };
    const { rerender } = render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);
    expect(screen.queryByLabelText('Past Due')).not.toBeInTheDocument();

    const overdueTodo = { ...todo, dueDate: '2026-06-18' };
    rerender(<TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />);
    expect(screen.getByLabelText('Past Due')).toBeInTheDocument();
  });

  it('badge disappears when dueDate is updated to a future date', () => {
    const todo = { id: 8, title: 'Past Due Todo', dueDate: '2026-06-18', completed: 0 };
    const { rerender } = render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);
    expect(screen.getByLabelText('Past Due')).toBeInTheDocument();

    const futureTodo = { ...todo, dueDate: '2026-06-20' };
    rerender(<TodoCard todo={futureTodo} {...mockHandlers} isLoading={false} />);
    expect(screen.queryByLabelText('Past Due')).not.toBeInTheDocument();
  });
});
