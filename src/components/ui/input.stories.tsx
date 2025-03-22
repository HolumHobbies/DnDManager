import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './input';

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'number', 'tel', 'url'],
    },
    disabled: {
      control: 'boolean',
    },
    error: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text here',
  },
};

export const WithLabel: Story = {
  render: (args) => (
    <div className="space-y-2">
      <label htmlFor="input" className="text-sm font-medium">
        Label
      </label>
      <Input id="input" {...args} />
    </div>
  ),
  args: {
    placeholder: 'Enter text here',
  },
};

export const WithError: Story = {
  args: {
    placeholder: 'Enter text here',
    error: 'This field is required',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
  },
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter password',
  },
};

export const Number: Story = {
  args: {
    type: 'number',
    placeholder: 'Enter number',
  },
};

export const WithValue: Story = {
  args: {
    value: 'Prefilled value',
    placeholder: 'Enter text here',
  },
};