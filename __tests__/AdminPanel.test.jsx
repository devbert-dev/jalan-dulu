import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminPanel from '../components/AdminPanel';

const mockUsers = [
  {
    id: 1,
    full_name: 'Alice Admin',
    email: 'alice@example.com',
    role: 'admin',
    created_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 2,
    full_name: 'Bob Host',
    email: 'bob@example.com',
    role: 'host',
    created_at: '2024-02-20T12:00:00Z',
  },
  {
    id: 3,
    full_name: null,
    email: 'carol@example.com',
    role: 'user',
    created_at: '2024-03-10T08:00:00Z',
  },
];

beforeEach(() => {
  global.fetch = jest.fn();
  global.confirm = jest.fn(() => true); // auto-confirm dialogs
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('AdminPanel — initial load', () => {
  it('shows loading state while fetching', () => {
    global.fetch.mockReturnValueOnce(new Promise(() => {})); // never resolves
    render(<AdminPanel token="test-token" />);
    expect(screen.getByText('Loading users…')).toBeInTheDocument();
  });

  it('renders page heading "User Management"', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => mockUsers,
    });
    render(<AdminPanel token="test-token" />);
    expect(screen.getByText('User Management')).toBeInTheDocument();
  });

  it('renders warning banner about role changes', async () => {
    global.fetch.mockResolvedValueOnce({ json: async () => mockUsers });
    render(<AdminPanel token="test-token" />);
    expect(screen.getByText(/Role changes take effect/i)).toBeInTheDocument();
  });

  it('fetches users from /admin/users with Bearer token', async () => {
    global.fetch.mockResolvedValueOnce({ json: async () => mockUsers });
    render(<AdminPanel token="abc123" />);
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/admin/users'),
        expect.objectContaining({
          headers: expect.objectContaining({ Authorization: 'Bearer abc123' }),
        })
      );
    });
  });

  it('renders user list after successful fetch', async () => {
    global.fetch.mockResolvedValueOnce({ json: async () => mockUsers });
    render(<AdminPanel token="test-token" />);
    await waitFor(() => {
      expect(screen.getByText('Alice Admin')).toBeInTheDocument();
      expect(screen.getByText('Bob Host')).toBeInTheDocument();
    });
  });

  it('renders email addresses for each user', async () => {
    global.fetch.mockResolvedValueOnce({ json: async () => mockUsers });
    render(<AdminPanel token="test-token" />);
    await waitFor(() => {
      expect(screen.getByText('alice@example.com')).toBeInTheDocument();
      expect(screen.getByText('bob@example.com')).toBeInTheDocument();
    });
  });

  it('renders "—" for users with no full_name', async () => {
    global.fetch.mockResolvedValueOnce({ json: async () => mockUsers });
    render(<AdminPanel token="test-token" />);
    await waitFor(() => {
      expect(screen.getByText('—')).toBeInTheDocument();
    });
  });

  it('renders avatar initials for each user', async () => {
    global.fetch.mockResolvedValueOnce({ json: async () => mockUsers });
    render(<AdminPanel token="test-token" />);
    await waitFor(() => {
      expect(screen.getByText('A')).toBeInTheDocument(); // Alice → A
      expect(screen.getByText('B')).toBeInTheDocument(); // Bob → B
      expect(screen.getByText('C')).toBeInTheDocument(); // carol (no name) → C from email
    });
  });

  it('shows error when API returns error field', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ error: 'Unauthorized' }),
    });
    render(<AdminPanel token="bad-token" />);
    await waitFor(() => {
      expect(screen.getByText('Unauthorized')).toBeInTheDocument();
    });
  });

  it('shows network error when fetch throws', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));
    render(<AdminPanel token="test-token" />);
    await waitFor(() => {
      expect(screen.getByText(/Failed to load users/i)).toBeInTheDocument();
    });
  });

  it('shows "No users found" when list is empty', async () => {
    global.fetch.mockResolvedValueOnce({ json: async () => [] });
    render(<AdminPanel token="test-token" />);
    await waitFor(() => {
      expect(screen.getByText('No users found.')).toBeInTheDocument();
    });
  });

  it('renders role dropdowns for each user', async () => {
    global.fetch.mockResolvedValueOnce({ json: async () => mockUsers });
    render(<AdminPanel token="test-token" />);
    await waitFor(() => {
      const selects = screen.getAllByRole('combobox');
      expect(selects).toHaveLength(3);
    });
  });

  it('renders Remove button for each user', async () => {
    global.fetch.mockResolvedValueOnce({ json: async () => mockUsers });
    render(<AdminPanel token="test-token" />);
    await waitFor(() => {
      const buttons = screen.getAllByText('Remove');
      expect(buttons).toHaveLength(3);
    });
  });
});

describe('AdminPanel — role change', () => {
  it('calls PATCH /admin/users/:id/role on dropdown change', async () => {
    global.fetch
      .mockResolvedValueOnce({ json: async () => mockUsers }) // initial load
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...mockUsers[1], role: 'user' }),
      });

    render(<AdminPanel token="tok" />);
    await waitFor(() => screen.getByText('Bob Host'));

    const selects = screen.getAllByRole('combobox');
    // Bob is index 1, change from host to user
    await userEvent.selectOptions(selects[1], 'user');

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/admin/users/2/role'),
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ role: 'user' }),
        })
      );
    });
  });

  it('updates the displayed role after successful PATCH', async () => {
    global.fetch
      .mockResolvedValueOnce({ json: async () => mockUsers })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...mockUsers[1], role: 'user' }),
      });

    render(<AdminPanel token="tok" />);
    await waitFor(() => screen.getByText('Bob Host'));

    const selects = screen.getAllByRole('combobox');
    await userEvent.selectOptions(selects[1], 'user');

    await waitFor(() => {
      expect(selects[1].value).toBe('user');
    });
  });

  it('shows error when role PATCH fails', async () => {
    global.fetch
      .mockResolvedValueOnce({ json: async () => mockUsers })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Permission denied' }),
      });

    render(<AdminPanel token="tok" />);
    await waitFor(() => screen.getByText('Bob Host'));

    const selects = screen.getAllByRole('combobox');
    await userEvent.selectOptions(selects[1], 'admin');

    await waitFor(() => {
      expect(screen.getByText('Permission denied')).toBeInTheDocument();
    });
  });

  it('shows network error when role PATCH throws', async () => {
    global.fetch
      .mockResolvedValueOnce({ json: async () => mockUsers })
      .mockRejectedValueOnce(new Error('Network'));

    render(<AdminPanel token="tok" />);
    await waitFor(() => screen.getByText('Bob Host'));

    const selects = screen.getAllByRole('combobox');
    await userEvent.selectOptions(selects[1], 'admin');

    await waitFor(() => {
      expect(screen.getByText(/Network error while updating role/i)).toBeInTheDocument();
    });
  });
});

describe('AdminPanel — delete user', () => {
  it('calls DELETE /admin/users/:id when Remove clicked and confirmed', async () => {
    global.fetch
      .mockResolvedValueOnce({ json: async () => mockUsers })
      .mockResolvedValueOnce({ ok: true });

    render(<AdminPanel token="tok" />);
    await waitFor(() => screen.getAllByText('Remove'));

    const removeButtons = screen.getAllByText('Remove');
    await userEvent.click(removeButtons[0]); // Remove Alice

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/admin/users/1'),
        expect.objectContaining({ method: 'DELETE' })
      );
    });
  });

  it('removes user from the list after successful delete', async () => {
    global.fetch
      .mockResolvedValueOnce({ json: async () => mockUsers })
      .mockResolvedValueOnce({ ok: true });

    render(<AdminPanel token="tok" />);
    await waitFor(() => screen.getByText('Alice Admin'));

    await userEvent.click(screen.getAllByText('Remove')[0]);

    await waitFor(() => {
      expect(screen.queryByText('Alice Admin')).not.toBeInTheDocument();
    });
  });

  it('does NOT delete when confirm dialog is cancelled', async () => {
    global.confirm.mockReturnValueOnce(false);
    global.fetch.mockResolvedValueOnce({ json: async () => mockUsers });

    render(<AdminPanel token="tok" />);
    await waitFor(() => screen.getAllByText('Remove'));

    await userEvent.click(screen.getAllByText('Remove')[0]);

    // fetch should only have been called once (for initial load)
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Alice Admin')).toBeInTheDocument();
  });

  it('shows error when DELETE fails', async () => {
    global.fetch
      .mockResolvedValueOnce({ json: async () => mockUsers })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Cannot delete admin' }),
      });

    render(<AdminPanel token="tok" />);
    await waitFor(() => screen.getAllByText('Remove'));

    await userEvent.click(screen.getAllByText('Remove')[0]);

    await waitFor(() => {
      expect(screen.getByText('Cannot delete admin')).toBeInTheDocument();
    });
  });

  it('dismisses error when ✕ button clicked', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ error: 'Unauthorized' }),
    });

    render(<AdminPanel token="bad" />);
    await waitFor(() => screen.getByText('Unauthorized'));

    await userEvent.click(screen.getByText('✕'));
    expect(screen.queryByText('Unauthorized')).not.toBeInTheDocument();
  });
});

describe('AdminPanel — column headers', () => {
  it('shows column headers when users are loaded', async () => {
    global.fetch.mockResolvedValueOnce({ json: async () => mockUsers });
    render(<AdminPanel token="tok" />);
    await waitFor(() => {
      // 'User' also appears as a <option> value in dropdowns, so scope to div
      expect(screen.getByText('User', { selector: 'div' })).toBeInTheDocument();
      expect(screen.getByText('Joined')).toBeInTheDocument();
      expect(screen.getByText('Role')).toBeInTheDocument();
    });
  });

  it('does NOT show column headers when list is empty', async () => {
    global.fetch.mockResolvedValueOnce({ json: async () => [] });
    render(<AdminPanel token="tok" />);
    await waitFor(() => screen.getByText('No users found.'));
    expect(screen.queryByText('User')).not.toBeInTheDocument();
  });
});
