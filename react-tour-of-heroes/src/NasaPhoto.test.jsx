import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import NasaPhoto from './NasaPhoto';
import { MessageProvider } from './MessageContext';

// Mock the global fetch
global.fetch = vi.fn();

describe('NasaPhoto Component', () => {
  it('renders loading state then the photo title', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        title: 'Starry Night',
        url: 'https://example.com/starry.jpg',
        explanation: 'A beautiful galaxy.'
      }),
    });

    render(
      <MessageProvider>
        <NasaPhoto />
      </MessageProvider>
    );
    
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    
    const title = await screen.findByText('Starry Night');
    expect(title).toBeInTheDocument();
  });
});