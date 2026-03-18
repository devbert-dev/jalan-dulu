import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateEventForm from '../components/CreateEventForm';

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('CreateEventForm — rendering', () => {
  it('renders the "Create Event" heading', () => {
    render(<CreateEventForm token="tok" onClose={() => {}} onSuccess={() => {}} />);
    expect(screen.getByText('Create Event')).toBeInTheDocument();
  });

  it('renders Event Title field', () => {
    render(<CreateEventForm token="tok" onClose={() => {}} onSuccess={() => {}} />);
    expect(screen.getByPlaceholderText(/Sunday Badminton Doubles/i)).toBeInTheDocument();
  });

  it('renders Category dropdown', () => {
    render(<CreateEventForm token="tok" onClose={() => {}} onSuccess={() => {}} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders Description textarea', () => {
    render(<CreateEventForm token="tok" onClose={() => {}} onSuccess={() => {}} />);
    expect(screen.getByPlaceholderText(/What can participants expect/i)).toBeInTheDocument();
  });

  it('renders Date field', () => {
    render(<CreateEventForm token="tok" onClose={() => {}} onSuccess={() => {}} />);
    // date input has no placeholder; find by type
    const dateInput = document.querySelector('input[type="date"]');
    expect(dateInput).toBeInTheDocument();
  });

  it('renders Time field', () => {
    render(<CreateEventForm token="tok" onClose={() => {}} onSuccess={() => {}} />);
    expect(screen.getByPlaceholderText('08:00–11:00 WIB')).toBeInTheDocument();
  });

  it('renders Location field', () => {
    render(<CreateEventForm token="tok" onClose={() => {}} onSuccess={() => {}} />);
    expect(screen.getByPlaceholderText(/GOR Senayan/i)).toBeInTheDocument();
  });

  it('renders Price field', () => {
    render(<CreateEventForm token="tok" onClose={() => {}} onSuccess={() => {}} />);
    expect(screen.getByPlaceholderText('0 for free')).toBeInTheDocument();
  });

  it('renders Female Slots input', () => {
    render(<CreateEventForm token="tok" onClose={() => {}} onSuccess={() => {}} />);
    const inputs = screen.getAllByPlaceholderText('e.g. 8');
    expect(inputs.length).toBeGreaterThanOrEqual(2);
  });

  it('renders ♀ Female Slots label', () => {
    render(<CreateEventForm token="tok" onClose={() => {}} onSuccess={() => {}} />);
    expect(screen.getByText(/♀ Female Slots/i)).toBeInTheDocument();
  });

  it('renders ♂ Male Slots label', () => {
    render(<CreateEventForm token="tok" onClose={() => {}} onSuccess={() => {}} />);
    expect(screen.getByText(/♂ Male Slots/i)).toBeInTheDocument();
  });

  it('renders Cancel button', () => {
    render(<CreateEventForm token="tok" onClose={() => {}} onSuccess={() => {}} />);
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
  });

  it('renders Create Event submit button', () => {
    render(<CreateEventForm token="tok" onClose={() => {}} onSuccess={() => {}} />);
    expect(screen.getByText('+ Create Event')).toBeInTheDocument();
  });

  it('submit button is disabled when form is empty', () => {
    render(<CreateEventForm token="tok" onClose={() => {}} onSuccess={() => {}} />);
    const btn = screen.getByText('+ Create Event');
    expect(btn).toBeDisabled();
  });

  it('renders the "hidden from public" privacy note when slots entered', async () => {
    render(<CreateEventForm token="tok" onClose={() => {}} onSuccess={() => {}} />);
    const slotInputs = screen.getAllByPlaceholderText('e.g. 8');
    await userEvent.type(slotInputs[0], '5');
    await userEvent.type(slotInputs[1], '5');
    expect(screen.getByText(/hidden from public/i)).toBeInTheDocument();
  });
});

describe('CreateEventForm — total slot counter', () => {
  it('shows total slots when both female and male slots entered', async () => {
    render(<CreateEventForm token="tok" onClose={() => {}} onSuccess={() => {}} />);
    const [femaleInput, maleInput] = screen.getAllByPlaceholderText('e.g. 8');
    await userEvent.type(femaleInput, '8');
    await userEvent.type(maleInput, '8');
    expect(screen.getByText('16 total slots')).toBeInTheDocument();
  });

  it('does not show total when both slots are empty', () => {
    render(<CreateEventForm token="tok" onClose={() => {}} onSuccess={() => {}} />);
    expect(screen.queryByText(/total slots/i)).not.toBeInTheDocument();
  });

  it('shows female and male slot counts in summary', async () => {
    render(<CreateEventForm token="tok" onClose={() => {}} onSuccess={() => {}} />);
    const [femaleInput, maleInput] = screen.getAllByPlaceholderText('e.g. 8');
    await userEvent.type(femaleInput, '6');
    await userEvent.type(maleInput, '4');
    expect(screen.getByText('10 total slots')).toBeInTheDocument();
  });
});

describe('CreateEventForm — submit button enablement', () => {
  async function fillRequiredFields() {
    const [femaleInput, maleInput] = screen.getAllByPlaceholderText('e.g. 8');
    await userEvent.type(screen.getByPlaceholderText(/Sunday Badminton Doubles/i), 'Test Event');
    fireEvent.change(document.querySelector('input[type="date"]'), {
      target: { value: '2025-06-01' },
    });
    await userEvent.type(femaleInput, '5');
    await userEvent.type(maleInput, '5');
  }

  it('enables submit button when title, date, and slots are filled', async () => {
    render(<CreateEventForm token="tok" onClose={() => {}} onSuccess={() => {}} />);
    await fillRequiredFields();
    await waitFor(() => {
      expect(screen.getByText('+ Create Event')).not.toBeDisabled();
    });
  });

  it('keeps submit disabled when title is missing', async () => {
    render(<CreateEventForm token="tok" onClose={() => {}} onSuccess={() => {}} />);
    const [femaleInput, maleInput] = screen.getAllByPlaceholderText('e.g. 8');
    fireEvent.change(document.querySelector('input[type="date"]'), {
      target: { value: '2025-06-01' },
    });
    await userEvent.type(femaleInput, '5');
    await userEvent.type(maleInput, '5');
    expect(screen.getByText('+ Create Event')).toBeDisabled();
  });

  it('keeps submit disabled when date is missing', async () => {
    render(<CreateEventForm token="tok" onClose={() => {}} onSuccess={() => {}} />);
    const [femaleInput, maleInput] = screen.getAllByPlaceholderText('e.g. 8');
    await userEvent.type(screen.getByPlaceholderText(/Sunday Badminton Doubles/i), 'Test Event');
    await userEvent.type(femaleInput, '5');
    await userEvent.type(maleInput, '5');
    expect(screen.getByText('+ Create Event')).toBeDisabled();
  });

  it('keeps submit disabled when female slots are 0', async () => {
    render(<CreateEventForm token="tok" onClose={() => {}} onSuccess={() => {}} />);
    const [, maleInput] = screen.getAllByPlaceholderText('e.g. 8');
    await userEvent.type(screen.getByPlaceholderText(/Sunday Badminton Doubles/i), 'Test Event');
    fireEvent.change(document.querySelector('input[type="date"]'), {
      target: { value: '2025-06-01' },
    });
    await userEvent.type(maleInput, '5');
    expect(screen.getByText('+ Create Event')).toBeDisabled();
  });
});

describe('CreateEventForm — API submission', () => {
  async function fillAndSubmit(onSuccess = () => {}) {
    render(<CreateEventForm token="tok123" onClose={() => {}} onSuccess={onSuccess} />);
    await userEvent.type(screen.getByPlaceholderText(/Sunday Badminton Doubles/i), 'My Event');
    fireEvent.change(document.querySelector('input[type="date"]'), {
      target: { value: '2025-06-15' },
    });
    const [femaleInput, maleInput] = screen.getAllByPlaceholderText('e.g. 8');
    await userEvent.type(femaleInput, '5');
    await userEvent.type(maleInput, '5');
    await userEvent.click(screen.getByText('+ Create Event'));
  }

  it('calls POST /events with Authorization header', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 10, title: 'My Event' }),
    });

    await fillAndSubmit();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/events'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({ Authorization: 'Bearer tok123' }),
        })
      );
    });
  });

  it('sends correct JSON body', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 10 }),
    });

    await fillAndSubmit();

    await waitFor(() => {
      const body = JSON.parse(global.fetch.mock.calls[0][1].body);
      expect(body.title).toBe('My Event');
      expect(body.date).toBe('2025-06-15');
      expect(body.female_slots).toBe(5);
      expect(body.male_slots).toBe(5);
    });
  });

  it('calls onSuccess with response data on success', async () => {
    const eventData = { id: 10, title: 'My Event' };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => eventData,
    });

    const onSuccess = jest.fn();
    await fillAndSubmit(onSuccess);

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith(eventData);
    });
  });

  it('shows error message when API returns error', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Title is required' }),
    });

    await fillAndSubmit();

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
    });
  });

  it('shows network error when fetch throws', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Offline'));

    await fillAndSubmit();

    await waitFor(() => {
      expect(screen.getByText(/Network error/i)).toBeInTheDocument();
    });
  });

  it('shows "Creating…" loading state while submitting', async () => {
    let resolve;
    global.fetch.mockReturnValueOnce(new Promise(r => { resolve = r; }));

    render(<CreateEventForm token="tok" onClose={() => {}} onSuccess={() => {}} />);
    await userEvent.type(screen.getByPlaceholderText(/Sunday Badminton Doubles/i), 'Loading Test');
    fireEvent.change(document.querySelector('input[type="date"]'), {
      target: { value: '2025-06-15' },
    });
    const [femaleInput, maleInput] = screen.getAllByPlaceholderText('e.g. 8');
    await userEvent.type(femaleInput, '5');
    await userEvent.type(maleInput, '5');
    await userEvent.click(screen.getByText('+ Create Event'));

    expect(screen.getByText('Creating…')).toBeInTheDocument();

    await act(async () => {
      resolve({ ok: true, json: async () => ({ id: 1 }) });
    });
  });
});

describe('CreateEventForm — modal interactions', () => {
  it('calls onClose when Cancel button is clicked', async () => {
    const onClose = jest.fn();
    render(<CreateEventForm token="tok" onClose={onClose} onSuccess={() => {}} />);
    await userEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when ✕ button is clicked', async () => {
    const onClose = jest.fn();
    render(<CreateEventForm token="tok" onClose={onClose} onSuccess={() => {}} />);
    await userEvent.click(screen.getByText('✕'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when overlay background is clicked', async () => {
    const onClose = jest.fn();
    const { container } = render(<CreateEventForm token="tok" onClose={onClose} onSuccess={() => {}} />);
    // Click the outermost overlay div directly
    const overlay = container.firstChild;
    fireEvent.click(overlay, { target: overlay });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does NOT call onClose when modal content is clicked', async () => {
    const onClose = jest.fn();
    render(<CreateEventForm token="tok" onClose={onClose} onSuccess={() => {}} />);
    await userEvent.click(screen.getByText('Create Event'));
    expect(onClose).not.toHaveBeenCalled();
  });
});

describe('CreateEventForm — category dropdown', () => {
  it('defaults to Badminton category', () => {
    render(<CreateEventForm token="tok" onClose={() => {}} onSuccess={() => {}} />);
    const select = screen.getByRole('combobox');
    expect(select.value).toBe('🏸 Badminton');
  });

  it('allows selecting a different category', async () => {
    render(<CreateEventForm token="tok" onClose={() => {}} onSuccess={() => {}} />);
    const select = screen.getByRole('combobox');
    await userEvent.selectOptions(select, '🧘 Yoga');
    expect(select.value).toBe('🧘 Yoga');
  });

  it('renders all available categories in dropdown', () => {
    render(<CreateEventForm token="tok" onClose={() => {}} onSuccess={() => {}} />);
    const select = screen.getByRole('combobox');
    const options = Array.from(select.options).map(o => o.value);
    expect(options).toContain('🏸 Badminton');
    expect(options).toContain('🧘 Yoga');
    expect(options).toContain('📸 Photography');
  });
});
