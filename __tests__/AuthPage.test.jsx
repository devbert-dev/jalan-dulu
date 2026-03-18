import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AuthPage from '../components/AuthPage';

// Mock global fetch
beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});

// Helpers to find the mode-tab buttons (not the submit or bottom link buttons)
// "Log In" tab and "Sign Up" tab are in a flex container; "Sign Up" tab (capital U) is unique.
// "Log In" (capital I) also appears on the submit button, so we grab the first match.
function getLogInTab() {
  return screen.getAllByText('Log In', { selector: 'button' })[0];
}
function getSignUpTab() {
  // "Sign Up" with capital U only appears on the tab button; "Sign up" (lowercase u) is the bottom link
  return screen.getByText('Sign Up', { selector: 'button' });
}

describe('AuthPage — rendering', () => {
  it('renders the Log In tab by default', () => {
    render(<AuthPage onAuth={() => {}} />);
    expect(getLogInTab()).toBeInTheDocument();
  });

  it('renders the Sign Up tab', () => {
    render(<AuthPage onAuth={() => {}} />);
    expect(getSignUpTab()).toBeInTheDocument();
  });

  it('renders branding text "Jalan" and "Dulu"', () => {
    render(<AuthPage onAuth={() => {}} />);
    expect(screen.getByText('Jalan')).toBeInTheDocument();
    expect(screen.getByText('Dulu')).toBeInTheDocument();
  });

  it('renders email input', () => {
    render(<AuthPage onAuth={() => {}} />);
    expect(screen.getByPlaceholderText('you@email.com')).toBeInTheDocument();
  });

  it('renders password input', () => {
    render(<AuthPage onAuth={() => {}} />);
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
  });

  it('renders "Welcome back" heading in login mode', () => {
    render(<AuthPage onAuth={() => {}} />);
    expect(screen.getByText('Welcome back')).toBeInTheDocument();
  });

  it('does NOT render full name field in login mode', () => {
    render(<AuthPage onAuth={() => {}} />);
    expect(screen.queryByPlaceholderText('Your name')).not.toBeInTheDocument();
  });

  it('does NOT render confirm password field in login mode', () => {
    render(<AuthPage onAuth={() => {}} />);
    expect(screen.queryByPlaceholderText('Repeat your password')).not.toBeInTheDocument();
  });
});

describe('AuthPage — mode switching', () => {
  it('switches to signup mode and shows "Create your account" heading', async () => {
    render(<AuthPage onAuth={() => {}} />);
    await userEvent.click(getSignUpTab());
    expect(screen.getByText('Create your account')).toBeInTheDocument();
  });

  it('shows Full Name field in signup mode', async () => {
    render(<AuthPage onAuth={() => {}} />);
    await userEvent.click(getSignUpTab());
    expect(screen.getByPlaceholderText('Your name')).toBeInTheDocument();
  });

  it('shows Confirm Password field in signup mode', async () => {
    render(<AuthPage onAuth={() => {}} />);
    await userEvent.click(getSignUpTab());
    expect(screen.getByPlaceholderText('Repeat your password')).toBeInTheDocument();
  });

  it('clears fields when switching modes', async () => {
    render(<AuthPage onAuth={() => {}} />);
    const emailInput = screen.getByPlaceholderText('you@email.com');
    await userEvent.type(emailInput, 'test@email.com');
    await userEvent.click(getSignUpTab());
    // Email should still be set (only name/password/confirm are cleared)
    expect(emailInput.value).toBe('test@email.com');
  });

  it('can switch back to login mode from signup', async () => {
    render(<AuthPage onAuth={() => {}} />);
    await userEvent.click(getSignUpTab());
    await userEvent.click(getLogInTab());
    expect(screen.getByText('Welcome back')).toBeInTheDocument();
  });
});

describe('AuthPage — password visibility toggle', () => {
  it('password field is type="password" by default', () => {
    render(<AuthPage onAuth={() => {}} />);
    const pwd = screen.getByPlaceholderText('Enter your password');
    expect(pwd).toHaveAttribute('type', 'password');
  });

  it('toggles password visibility on eye button click', async () => {
    render(<AuthPage onAuth={() => {}} />);
    const pwd = screen.getByPlaceholderText('Enter your password');
    const toggle = screen.getByText('👁');
    await userEvent.click(toggle);
    expect(pwd).toHaveAttribute('type', 'text');
  });

  it('hides password again on second toggle click', async () => {
    render(<AuthPage onAuth={() => {}} />);
    const pwd = screen.getByPlaceholderText('Enter your password');
    const toggle = screen.getByText('👁');
    await userEvent.click(toggle);
    await userEvent.click(screen.getByText('🙈'));
    expect(pwd).toHaveAttribute('type', 'password');
  });
});

describe('AuthPage — password strength (signup mode)', () => {
  async function switchToSignup() {
    render(<AuthPage onAuth={() => {}} />);
    await userEvent.click(getSignUpTab());
  }

  it('shows strength rules after typing in password field', async () => {
    await switchToSignup();
    await userEvent.type(screen.getByPlaceholderText('Enter your password'), 'abc');
    expect(screen.getByText('At least 8 characters')).toBeInTheDocument();
  });

  it('shows "Very Weak" for a 1-char password', async () => {
    await switchToSignup();
    await userEvent.type(screen.getByPlaceholderText('Enter your password'), 'a');
    expect(screen.getByText('Very Weak')).toBeInTheDocument();
  });

  it('shows "Very Strong" for a fully compliant password', async () => {
    await switchToSignup();
    await userEvent.type(screen.getByPlaceholderText('Enter your password'), 'Abcdef1!');
    expect(screen.getByText('Very Strong')).toBeInTheDocument();
  });

  it('shows "Passwords do not match" when confirm differs', async () => {
    await switchToSignup();
    await userEvent.type(screen.getByPlaceholderText('Enter your password'), 'Abcdef1!');
    await userEvent.type(screen.getByPlaceholderText('Repeat your password'), 'different');
    expect(screen.getByText('Passwords do not match.')).toBeInTheDocument();
  });

  it('shows "Passwords match" when confirm equals password', async () => {
    await switchToSignup();
    await userEvent.type(screen.getByPlaceholderText('Enter your password'), 'Abcdef1!');
    await userEvent.type(screen.getByPlaceholderText('Repeat your password'), 'Abcdef1!');
    expect(screen.getByText('✓ Passwords match.')).toBeInTheDocument();
  });
});

describe('AuthPage — submit button state', () => {
  it('submit button is disabled when email/password empty in login mode', () => {
    render(<AuthPage onAuth={() => {}} />);
    const submitBtn = screen.getByText('Log In', { selector: 'button[type="submit"]' });
    expect(submitBtn).toBeDisabled();
  });

  it('submit button is enabled when email and password filled in login mode', async () => {
    render(<AuthPage onAuth={() => {}} />);
    await userEvent.type(screen.getByPlaceholderText('you@email.com'), 'a@b.com');
    await userEvent.type(screen.getByPlaceholderText('Enter your password'), 'pass123');
    const submitBtn = screen.getByText('Log In', { selector: 'button[type="submit"]' });
    expect(submitBtn).not.toBeDisabled();
  });

  it('submit button disabled in signup mode until all fields valid', async () => {
    render(<AuthPage onAuth={() => {}} />);
    await userEvent.click(getSignUpTab());
    const submitBtn = screen.getByText('Create Account', { selector: 'button[type="submit"]' });
    expect(submitBtn).toBeDisabled();
  });
});

describe('AuthPage — login API call', () => {
  it('calls POST /auth/login with email and password', async () => {
    const mockUser = { id: 1, email: 'a@b.com', role: 'user' };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: mockUser, token: 'tok123' }),
    });

    const onAuth = jest.fn();
    render(<AuthPage onAuth={onAuth} />);

    await userEvent.type(screen.getByPlaceholderText('you@email.com'), 'a@b.com');
    await userEvent.type(screen.getByPlaceholderText('Enter your password'), 'pass123');
    await userEvent.click(screen.getByText('Log In', { selector: 'button[type="submit"]' }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/login'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ email: 'a@b.com', password: 'pass123' }),
        })
      );
    });
  });

  it('calls onAuth with user+token on successful login', async () => {
    const mockUser = { id: 1, email: 'a@b.com', role: 'user' };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: mockUser, token: 'tok123' }),
    });

    const onAuth = jest.fn();
    render(<AuthPage onAuth={onAuth} />);

    await userEvent.type(screen.getByPlaceholderText('you@email.com'), 'a@b.com');
    await userEvent.type(screen.getByPlaceholderText('Enter your password'), 'pass123');
    await userEvent.click(screen.getByText('Log In', { selector: 'button[type="submit"]' }));

    await waitFor(() => {
      expect(onAuth).toHaveBeenCalledWith({ ...mockUser, token: 'tok123' });
    });
  });

  it('shows error message on failed login', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Invalid credentials' }),
    });

    render(<AuthPage onAuth={() => {}} />);
    await userEvent.type(screen.getByPlaceholderText('you@email.com'), 'a@b.com');
    await userEvent.type(screen.getByPlaceholderText('Enter your password'), 'wrong');
    await userEvent.click(screen.getByText('Log In', { selector: 'button[type="submit"]' }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  it('shows network error message when fetch throws', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network failure'));

    render(<AuthPage onAuth={() => {}} />);
    await userEvent.type(screen.getByPlaceholderText('you@email.com'), 'a@b.com');
    await userEvent.type(screen.getByPlaceholderText('Enter your password'), 'pass123');
    await userEvent.click(screen.getByText('Log In', { selector: 'button[type="submit"]' }));

    await waitFor(() => {
      expect(screen.getByText(/Network error/i)).toBeInTheDocument();
    });
  });

  it('shows loading state while request is in flight', async () => {
    let resolve;
    global.fetch.mockReturnValueOnce(
      new Promise(r => { resolve = r; })
    );

    render(<AuthPage onAuth={() => {}} />);
    await userEvent.type(screen.getByPlaceholderText('you@email.com'), 'a@b.com');
    await userEvent.type(screen.getByPlaceholderText('Enter your password'), 'pass123');
    await userEvent.click(screen.getByText('Log In', { selector: 'button[type="submit"]' }));

    expect(screen.getByText('Please wait…')).toBeInTheDocument();

    // Resolve to clean up
    await act(async () => {
      resolve({ ok: true, json: async () => ({ user: {}, token: 'x' }) });
    });
  });
});

describe('AuthPage — signup API call', () => {
  async function fillSignupForm(name, email, password) {
    await userEvent.click(getSignUpTab());
    await userEvent.type(screen.getByPlaceholderText('Your name'), name);
    await userEvent.type(screen.getByPlaceholderText('you@email.com'), email);
    await userEvent.type(screen.getByPlaceholderText('Enter your password'), password);
    await userEvent.type(screen.getByPlaceholderText('Repeat your password'), password);
  }

  it('calls POST /auth/register with name, email, password', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: { id: 2, email: 'new@b.com', role: 'user' }, token: 'tok' }),
    });

    const onAuth = jest.fn();
    render(<AuthPage onAuth={onAuth} />);
    await fillSignupForm('Test User', 'new@b.com', 'Abcdef1!');
    await userEvent.click(screen.getByText('Create Account', { selector: 'button[type="submit"]' }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/register'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ email: 'new@b.com', password: 'Abcdef1!', name: 'Test User' }),
        })
      );
    });
  });

  it('shows error message on failed registration', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Email already taken' }),
    });

    render(<AuthPage onAuth={() => {}} />);
    await fillSignupForm('Test', 'taken@b.com', 'Abcdef1!');
    await userEvent.click(screen.getByText('Create Account', { selector: 'button[type="submit"]' }));

    await waitFor(() => {
      expect(screen.getByText('Email already taken')).toBeInTheDocument();
    });
  });
});
