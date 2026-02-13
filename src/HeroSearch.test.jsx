import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { MessageProvider } from './MessageContext';
import { AppProvider } from './AppContext';
import HeroSearch from './HeroSearch';

describe('HeroSearch Component', () => {
  it('shows results when typing a matching name', async () => {
    render(
      <MemoryRouter>
        <MessageProvider>
          <AppProvider>
            <HeroSearch />
          </AppProvider>
        </MessageProvider>
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/Search for a hero.../i);
    fireEvent.change(input, { target: { value: 'Magneta' } });

    // Use findByText to wait for the debounce timer
    const result = await screen.findByText('Magneta');
    expect(result).toBeInTheDocument();
  });
});