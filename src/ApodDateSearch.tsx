import { useActionState } from 'react';
import { useMessages } from './MessageContext';
import { ApodMediaViewer } from './ApodMediaViewer';

// In a real world application, you would want to store your API key in an environment variable or a secure vault, not hard-coded in your source code. For demonstration purposes, it's included here directly.
const NASA_API_KEY = 'QdKv9PuSMawK6XR5ZVsMEUcaI0ewfgjlFzqaSwQ6';
const BASE_URL = 'https://api.nasa.gov/planetary/apod';

// 1. Define the shape of our Form State
export interface ApodSearchResult {
  title?: string;
  url?: string;
  explanation?: string;
  media_type?: string;
  error?: string | null;
}

// 3. Component Definition
export function ApodDateSearch() {
  const { add } = useMessages();

  // 2. Define the Action Function that executes on form submit
  async function fetchApodAction(
    _prevState: ApodSearchResult | null,
    formData: FormData
  ): Promise<ApodSearchResult | null> {
    const selectedDate = formData.get('apodDate') as string;

    if (!selectedDate) {
      return { error: 'Please pick a valid date.' };
    }

    try {
      const response = await fetch(
        `${BASE_URL}?api_key=${NASA_API_KEY}&date=${selectedDate}`
      );

      if (!response.ok) {
        const errData = await response.json();
        return { error: errData.msg || 'Failed to fetch APOD for that date.' };
      }

      const data = await response.json();
      add(`APOD: NASA astronomy picture of the day fetched for ${selectedDate}`);
      return data;
    } catch (err: any) {
      return { error: err.message || 'Network error occurred.' };
    }
  }

  // [state, formAction, isPending]
  const [state, formAction, isPending] = useActionState<ApodSearchResult | null, FormData>(
    fetchApodAction,
    null // Initial state
  );

  // Set max date limit to today
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="apod-search-container">
      <h3>Search APOD Archives by Date</h3>

      <form action={formAction} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input
          type="date"
          name="apodDate"
          max={today}
          required
          disabled={isPending}
          style={{ padding: '8px', fontSize: '1rem' }}
        />
        <button
          type="submit"
          disabled={isPending}
          style={{ padding: '8px 16px', fontSize: '1rem', cursor: isPending ? 'not-allowed' : 'pointer' }}
        >
          {isPending ? 'Fetching NASA...' : 'Search Date'}
        </button>
      </form>

      {/* Render Search Results using ApodMediaViewer */}
      {state && !state.error && state.url && (
        <div style={{ marginTop: '20px' }}>
          <h4>{state.title}</h4>

          <ApodMediaViewer
            url={state.url}
            title={state.title || 'APOD Image'}
            mediaType={state.media_type || 'image'}
          />

          <p style={{ fontSize: '0.9rem', marginTop: '10px' }}>{state.explanation}</p>
        </div>
      )}
    </div>
  );
}