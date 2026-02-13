import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { MessageProvider } from './MessageContext';
import { AppProvider } from './AppContext';
import Dashboard from './Dashboard';

describe('Dashboard Component', () => {
  const renderDashboard = () => render(
    <MemoryRouter>
      <MessageProvider>
        <AppProvider>
          <Dashboard />
        </AppProvider>
      </MessageProvider>
    </MemoryRouter>
  );

  it('renders "Top Heroes" heading', () => {
    renderDashboard();
    expect(screen.getByText(/Top Heroes/i)).toBeInTheDocument();
  });

  it('renders the search component', () => {
    renderDashboard();
    expect(screen.getByLabelText(/Hero Search/i)).toBeInTheDocument();
  });
});