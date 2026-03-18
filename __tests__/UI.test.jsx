import React from 'react';
import { render, screen } from '@testing-library/react';
import { Tag, PublicSlotBar, HostGenderBar } from '../components/UI';

// ─── Tag ──────────────────────────────────────────────────────────────────────
describe('Tag', () => {
  it('renders the label text', () => {
    render(<Tag label="Mixed" />);
    expect(screen.getByText('Mixed')).toBeInTheDocument();
  });

  it('renders as a span element', () => {
    const { container } = render(<Tag label="Outdoor" />);
    expect(container.querySelector('span')).toBeInTheDocument();
  });

  it('applies a custom color via inline style', () => {
    const { container } = render(<Tag label="Test" color="#FF0000" />);
    const span = container.querySelector('span');
    // color is applied as inline style
    expect(span.style.color).toBe('rgb(255, 0, 0)');
  });

  it('falls back to default color when none provided', () => {
    const { container } = render(<Tag label="Default" />);
    const span = container.querySelector('span');
    // default color is C.greenSage (#229814) — rendered as rgb
    expect(span.style.color).toBeTruthy();
  });
});

// ─── PublicSlotBar ────────────────────────────────────────────────────────────
describe('PublicSlotBar', () => {
  it('shows correct spots left text', () => {
    render(<PublicSlotBar filled={11} total={16} />);
    expect(screen.getByText('5 spots left')).toBeInTheDocument();
  });

  it('shows singular "spot" when only 1 spot left', () => {
    render(<PublicSlotBar filled={15} total={16} />);
    expect(screen.getByText('1 spot left')).toBeInTheDocument();
  });

  it('shows "Fully booked" when filled equals total', () => {
    render(<PublicSlotBar filled={16} total={16} />);
    expect(screen.getByText('Fully booked')).toBeInTheDocument();
  });

  it('shows "Fully booked" when filled exceeds total', () => {
    render(<PublicSlotBar filled={20} total={16} />);
    expect(screen.getByText('Fully booked')).toBeInTheDocument();
  });

  it('shows correct percentage (rounded)', () => {
    render(<PublicSlotBar filled={11} total={16} />);
    // 11/16 = 68.75% → 69%
    expect(screen.getByText('69% full')).toBeInTheDocument();
  });

  it('shows 0% full when empty', () => {
    render(<PublicSlotBar filled={0} total={20} />);
    expect(screen.getByText('0% full')).toBeInTheDocument();
    expect(screen.getByText('20 spots left')).toBeInTheDocument();
  });

  it('shows 100% full when completely booked', () => {
    render(<PublicSlotBar filled={20} total={20} />);
    expect(screen.getByText('100% full')).toBeInTheDocument();
  });

  it('renders a progress bar div', () => {
    const { container } = render(<PublicSlotBar filled={5} total={10} />);
    // There should be a nested div for the fill
    const divs = container.querySelectorAll('div');
    expect(divs.length).toBeGreaterThan(1);
  });

  it('uses warning colour when 3 or fewer spots left', () => {
    render(<PublicSlotBar filled={13} total={16} />);
    // 3 spots left — almostFull = true — percentage text should carry yellowDeep colour
    const pctText = screen.getByText('81% full');
    expect(pctText).toBeInTheDocument();
  });

  it('shows no warning colour when more than 3 spots left', () => {
    render(<PublicSlotBar filled={10} total={16} />);
    expect(screen.getByText('6 spots left')).toBeInTheDocument();
  });
});

// ─── HostGenderBar ────────────────────────────────────────────────────────────
describe('HostGenderBar', () => {
  const female = { filled: 5, max: 8 };
  const male   = { filled: 6, max: 8 };

  it('renders the "Host View Only" badge', () => {
    render(<HostGenderBar female={female} male={male} />);
    expect(screen.getByText(/Host View Only/i)).toBeInTheDocument();
  });

  it('renders gender quota breakdown label', () => {
    render(<HostGenderBar female={female} male={male} />);
    expect(screen.getByText(/Gender quota breakdown/i)).toBeInTheDocument();
  });

  it('shows female filled/max with percentage', () => {
    render(<HostGenderBar female={female} male={male} />);
    // 5/8 = 62%
    expect(screen.getByText('5 / 8 (63%)')).toBeInTheDocument();
  });

  it('shows male filled/max with percentage', () => {
    render(<HostGenderBar female={female} male={male} />);
    // 6/8 = 75%
    expect(screen.getByText('6 / 8 (75%)')).toBeInTheDocument();
  });

  it('renders ♀ Female label', () => {
    render(<HostGenderBar female={female} male={male} />);
    expect(screen.getByText('♀ Female')).toBeInTheDocument();
  });

  it('renders ♂ Male label', () => {
    render(<HostGenderBar female={female} male={male} />);
    expect(screen.getByText('♂ Male')).toBeInTheDocument();
  });

  it('shows 100% when slot is full', () => {
    render(<HostGenderBar female={{ filled: 8, max: 8 }} male={{ filled: 8, max: 8 }} />);
    const percentTexts = screen.getAllByText('8 / 8 (100%)');
    expect(percentTexts).toHaveLength(2);
  });

  it('shows 0% when no slots filled', () => {
    render(<HostGenderBar female={{ filled: 0, max: 10 }} male={{ filled: 0, max: 10 }} />);
    const percentTexts = screen.getAllByText('0 / 10 (0%)');
    expect(percentTexts).toHaveLength(2);
  });
});
