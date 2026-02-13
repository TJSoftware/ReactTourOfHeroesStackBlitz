import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom'; // Add this
import { MessageProvider } from './MessageContext';
import { AppProvider } from './AppContext';
import Heroes from './Heroes';

describe('Heroes Component', () => {
  // Helper to wrap component with all necessary providers
  const renderWithProviders = (ui) => {
    return render(
      <MemoryRouter>
        <MessageProvider>
          <AppProvider>
            {ui}
          </AppProvider>
        </MessageProvider>
      </MemoryRouter>
    );
  };

  it('renders "My Heroes" title', () => {
    renderWithProviders(<Heroes />);
    expect(screen.getByText(/My Heroes/i)).toBeInTheDocument();
  });

  it('adds a new hero to the list', () => {
    renderWithProviders(<Heroes />);
    
    // Use getByLabelText if you have a label, or getByRole
    const input = screen.getByRole('textbox'); 
    const button = screen.getByText(/Add Hero/i);
    
    fireEvent.change(input, { target: { value: 'Space Man' } });
    fireEvent.click(button);
    
    expect(screen.getByText(/Space Man/i)).toBeInTheDocument();
  });
});