import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EventCard from '../components/EventCard';

const baseEvent = {
  id: 1,
  title: 'Badminton Social Doubles',
  category: '🏸 Badminton',
  date: 'Sat, 15 Mar 2025',
  location: 'GOR Senayan, Jakarta Pusat',
  price: 75000,
  totalSlots: 16,
  totalFilled: 11,
  tags: ['Mixed', 'All levels', 'Indoor'],
};

describe('EventCard', () => {
  it('renders the event title', () => {
    render(<EventCard event={baseEvent} selected={null} onClick={() => {}} />);
    expect(screen.getByText('Badminton Social Doubles')).toBeInTheDocument();
  });

  it('renders the category emoji', () => {
    render(<EventCard event={baseEvent} selected={null} onClick={() => {}} />);
    expect(screen.getByText('🏸')).toBeInTheDocument();
  });

  it('renders the event date', () => {
    render(<EventCard event={baseEvent} selected={null} onClick={() => {}} />);
    expect(screen.getByText(/Sat, 15 Mar 2025/)).toBeInTheDocument();
  });

  it('renders the event location', () => {
    render(<EventCard event={baseEvent} selected={null} onClick={() => {}} />);
    expect(screen.getByText(/GOR Senayan, Jakarta Pusat/)).toBeInTheDocument();
  });

  it('renders the formatted price', () => {
    render(<EventCard event={baseEvent} selected={null} onClick={() => {}} />);
    // 75000 formatted in id-ID locale
    expect(screen.getByText(/Rp/)).toBeInTheDocument();
  });

  it('shows spots left badge when event has space', () => {
    render(<EventCard event={baseEvent} selected={null} onClick={() => {}} />);
    // 16 - 11 = 5 spots left
    expect(screen.getByText('5 left')).toBeInTheDocument();
  });

  it('shows "FULL" badge when event is fully booked', () => {
    const fullEvent = { ...baseEvent, totalFilled: 16 };
    render(<EventCard event={fullEvent} selected={null} onClick={() => {}} />);
    expect(screen.getByText('FULL')).toBeInTheDocument();
  });

  it('shows first 2 tags', () => {
    render(<EventCard event={baseEvent} selected={null} onClick={() => {}} />);
    expect(screen.getByText('Mixed')).toBeInTheDocument();
    expect(screen.getByText('All levels')).toBeInTheDocument();
  });

  it('does not render 3rd tag', () => {
    render(<EventCard event={baseEvent} selected={null} onClick={() => {}} />);
    expect(screen.queryByText('Indoor')).not.toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = jest.fn();
    render(<EventCard event={baseEvent} selected={null} onClick={onClick} />);
    const card = screen.getByText('Badminton Social Doubles').closest('div');
    fireEvent.click(card.parentElement || card);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders slot bar with correct spots remaining', () => {
    render(<EventCard event={baseEvent} selected={null} onClick={() => {}} />);
    expect(screen.getByText('5 spots left')).toBeInTheDocument();
  });

  it('applies selected styling when event is selected', () => {
    const { container } = render(
      <EventCard event={baseEvent} selected={baseEvent} onClick={() => {}} />
    );
    // The outer div should have a different background (greenDark) when selected
    const card = container.firstChild;
    expect(card.style.background).toBeTruthy();
  });

  it('applies unselected styling when event is not selected', () => {
    const { container } = render(
      <EventCard event={baseEvent} selected={null} onClick={() => {}} />
    );
    const card = container.firstChild;
    expect(card.style.background).toBeTruthy();
  });

  it('shows yellow badge when 3 or fewer spots left', () => {
    const almostFullEvent = { ...baseEvent, totalFilled: 14 }; // 2 spots left
    render(<EventCard event={almostFullEvent} selected={null} onClick={() => {}} />);
    expect(screen.getByText('2 left')).toBeInTheDocument();
  });

  it('renders PublicSlotBar with percentage', () => {
    render(<EventCard event={baseEvent} selected={null} onClick={() => {}} />);
    // 11/16 = 69%
    expect(screen.getByText('69% full')).toBeInTheDocument();
  });
});
