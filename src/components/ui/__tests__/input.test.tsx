import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '../input';

describe('Input Component', () => {
  it('renders correctly with default props', () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('flex h-10 w-full rounded-md border');
  });

  it('applies additional className when provided', () => {
    render(<Input className="custom-class" placeholder="Enter text" />);
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toHaveClass('custom-class');
  });

  it('handles user input correctly', async () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText('Enter text');
    
    await userEvent.type(input, 'Hello, world!');
    expect(input).toHaveValue('Hello, world!');
  });

  it('displays error message when error prop is provided', () => {
    render(<Input placeholder="Enter text" error="This field is required" />);
    
    const errorMessage = screen.getByText('This field is required');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass('text-red-500');
    
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toHaveClass('border-red-500');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} placeholder="Enter text" />);
    
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('INPUT');
  });

  it('passes additional props to the input element', () => {
    render(
      <Input 
        placeholder="Enter text" 
        id="test-input"
        name="test"
        maxLength={10}
        required
      />
    );
    
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toHaveAttribute('id', 'test-input');
    expect(input).toHaveAttribute('name', 'test');
    expect(input).toHaveAttribute('maxLength', '10');
    expect(input).toHaveAttribute('required');
  });

  it('handles disabled state correctly', () => {
    render(<Input placeholder="Enter text" disabled />);
    
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('disabled:opacity-50');
  });
});