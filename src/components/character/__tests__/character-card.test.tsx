import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CharacterCard } from '../character-card';

// Mock the next/link component
jest.mock('next/link', () => {
  return ({ href, children }: { href: string; children: React.ReactNode }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock character data
const mockCharacter = {
  id: '1',
  name: 'Aragorn',
  race: 'Human',
  class: 'Ranger',
  level: 10,
  strength: 16,
  dexterity: 18,
  constitution: 14,
  intelligence: 12,
  wisdom: 16,
  charisma: 14,
  hitPoints: 75,
  maxHitPoints: 85,
  armorClass: 16,
  background: 'Outlander',
  alignment: 'Chaotic Good',
  experience: 48000,
  proficiencies: 'Swords, Bows, Survival',
  equipment: 'Longsword, Bow, Ranger Cloak',
  spells: null,
  features: 'Favored Enemy, Natural Explorer',
  notes: 'Heir to the throne of Gondor',
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-01-02'),
  userId: 'user1',
  campaignId: null
};

describe('CharacterCard Component', () => {
  it('renders character information correctly', () => {
    render(<CharacterCard character={mockCharacter} />);
    
    // Check character name and basic info
    expect(screen.getByText('Aragorn')).toBeInTheDocument();
    expect(screen.getByText('Level 10 Human Ranger')).toBeInTheDocument();
    
    // Check ability scores and modifiers
    expect(screen.getByText('STR')).toBeInTheDocument();
    // Use getAllByText since there are multiple elements with the same text
    expect(screen.getAllByText('16')[0]).toBeInTheDocument();
    expect(screen.getAllByText('+3')[0]).toBeInTheDocument(); // STR modifier
    
    // Check HP and AC
    expect(screen.getByText('HP')).toBeInTheDocument();
    expect(screen.getByText('75/85')).toBeInTheDocument();
    expect(screen.getByText('AC')).toBeInTheDocument();
    
    // Check notes
    expect(screen.getByText('Heir to the throne of Gondor')).toBeInTheDocument();
    
    // Check buttons
    expect(screen.getByRole('button', { name: /view/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked', async () => {
    const handleDelete = jest.fn();
    render(<CharacterCard character={mockCharacter} onDelete={handleDelete} />);
    
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    expect(deleteButton).toBeInTheDocument();
    
    await userEvent.click(deleteButton);
    expect(handleDelete).toHaveBeenCalledWith(mockCharacter.id);
  });

  it('does not show delete button when onDelete is not provided', () => {
    render(<CharacterCard character={mockCharacter} />);
    
    expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
  });

  it('truncates long notes', () => {
    const characterWithLongNotes = {
      ...mockCharacter,
      notes: 'This is a very long note that should be truncated. '.repeat(10)
    };
    
    render(<CharacterCard character={characterWithLongNotes} />);
    
    // The note should be truncated with "..."
    expect(screen.getByText(/This is a very long note.*\.\.\./)).toBeInTheDocument();
  });

  it('displays the last updated date', () => {
    render(<CharacterCard character={mockCharacter} />);
    
    // Check for the formatted date (Jan 2, 2023)
    expect(screen.getByText(/Last updated:/)).toBeInTheDocument();
  });
});