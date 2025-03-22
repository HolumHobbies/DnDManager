import type { Meta, StoryObj } from '@storybook/react';
import { CharacterCard } from './character-card';
import { action } from '@storybook/addon-actions';

// Mock next/link for Storybook
jest.mock('next/link', () => {
  return ({ href, children }: { href: string; children: React.ReactNode }) => {
    return <a href={href}>{children}</a>;
  };
});

const meta: Meta<typeof CharacterCard> = {
  title: 'Character/CharacterCard',
  component: CharacterCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onDelete: { action: 'deleted' },
  },
};

export default meta;
type Story = StoryObj<typeof CharacterCard>;

// Base character data
const baseCharacter = {
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

export const Default: Story = {
  args: {
    character: baseCharacter,
  },
};

export const WithDeleteButton: Story = {
  args: {
    character: baseCharacter,
    onDelete: action('character deleted'),
  },
};

export const LowHealth: Story = {
  args: {
    character: {
      ...baseCharacter,
      hitPoints: 15,
    },
  },
};

export const Wizard: Story = {
  args: {
    character: {
      ...baseCharacter,
      name: 'Gandalf',
      race: 'Human',
      class: 'Wizard',
      strength: 10,
      dexterity: 14,
      constitution: 12,
      intelligence: 20,
      wisdom: 18,
      charisma: 16,
      spells: 'Fireball, Magic Missile, Shield',
    },
  },
};

export const WithLongNotes: Story = {
  args: {
    character: {
      ...baseCharacter,
      notes: 'This is a very long note that should be truncated. '.repeat(10),
    },
  },
};