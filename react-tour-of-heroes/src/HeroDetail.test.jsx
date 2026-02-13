import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { MessageProvider } from './MessageContext';
import { AppProvider } from './AppContext';
import HeroDetail from './HeroDetail';

describe('HeroDetail Component', () => {
  const renderDetail = (id) => render(
    <MemoryRouter initialEntries={[`/detail/${id}`]}>
      <MessageProvider>
        <AppProvider>
          <Routes>
            <Route path="/detail/:heroId" element={<HeroDetail />} />
          </Routes>
        </AppProvider>
      </MessageProvider>
    </MemoryRouter>
  );

  it('renders the details for hero #12', async () => {
    renderDetail(12);

    // We wait for the heading to appear. 
    // Since your HTML shows "DR. NICE Details", we match "DR. NICE"
    const heading = await screen.findByRole('heading', { 
      level: 2, 
      name: /DR. NICE/i 
    });

    expect(heading).toBeInTheDocument();
    
    // Checking the input value specifically for "Dr. Nice"
    const input = screen.getByDisplayValue('Dr. Nice');
    expect(input).toBeInTheDocument();
  });

  it('updates the name and triggers save logic', async () => {
    renderDetail(12);
    const input = await screen.findByRole('textbox');
    
    fireEvent.change(input, { target: { value: 'New Narco' } });
    expect(input.value).toBe('New Narco');
    
    const saveBtn = screen.getByText(/save/i);
    fireEvent.click(saveBtn);
    // Navigation/Save logic would happen here
  });
});