import { useActionState, useEffect, useRef, startTransition } from 'react';
import { useMessages } from './MessageContext';
import { ApodMediaViewer } from './ApodMediaViewer';

// In a real world application, you would want to store your API key in an environment variable or a secure vault, not hard-coded in your source code. For demonstration purposes, it's included here directly.
const NASA_API_KEY = 'QdKv9PuSMawK6XR5ZVsMEUcaI0ewfgjlFzqaSwQ6';
const BASE_URL = 'https://science.nasa.gov/wp-json/wp/v2/apod-basic';

// The first APOD was published on 1995-06-16
const FIRST_APOD_DATE = '1995-06-16';

// 1. Define the shape of our Form State
export interface ApodSearchResult {
  title?: string;
  url?: string; // playable/displayable media URL (image, .mp4, or embed)
  explanation?: string; // HTML string from NASA
  media_type?: string; // 'image' | 'video'
  credit?: string;
  permalink?: string; // NASA page for this APOD
  error?: string | null;
}

// Local (not UTC) YYYY-MM-DD, so the "today" default doesn't jump a day in the evening
function toLocalISODate(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// The new endpoint addresses a single day by path as YYMMDD: 2026-11-25 -> 261125
// (the "date" query parameter is ignored, which is why you kept getting today's entry)
function toYYMMDD(isoDate: string): string {
  return isoDate.slice(2).replace(/-/g, '');
}

// The new endpoint's "url" is the NASA *page* link, not the media.
// - Images: "hdurl" is the image file.
// - Videos: "hdurl" is only a poster; the real video lives inside "basic_html"
//   as <video><source src="...mp4"> (or an <iframe> for YouTube/Vimeo days).
function resolveMedia(data: any): { url?: string; mediaType: string } {
  const poster: string | undefined = data.hdurl;

  if (data.media_type === 'video' && data.basic_html) {
    const doc = new DOMParser().parseFromString(data.basic_html, 'text/html');

    const videoSrc =
      doc.querySelector('video source')?.getAttribute('src') ||
      doc.querySelector('video')?.getAttribute('src');
    if (videoSrc) return { url: videoSrc, mediaType: 'video' };

    const iframeSrc = doc.querySelector('iframe')?.getAttribute('src');
    if (iframeSrc) return { url: iframeSrc, mediaType: 'video' };

    // No playable video found: fall back to the poster image
    return { url: poster, mediaType: 'image' };
  }

  return { url: poster, mediaType: 'image' };
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

    if (!selectedDate || !/^\d{4}-\d{2}-\d{2}$/.test(selectedDate)) {
      return { error: 'Please pick a valid date.' };
    }

    // One day = /apod-basic/YYMMDD
    const params = new URLSearchParams();
    if (NASA_API_KEY) params.set('api_key', NASA_API_KEY);
    const query = params.toString();
    const requestUrl = `${BASE_URL}/${toYYMMDD(selectedDate)}${query ? `?${query}` : ''}`;

    try {
      console.log('APOD request:', requestUrl);
      const response = await fetch(requestUrl, { cache: 'no-store' });

      // Read as text first so HTML or empty error bodies don't throw in .json()
      const text = await response.text();
      console.log('APOD status:', response.status);

      if (response.status === 404) {
        return { error: `No APOD found for ${selectedDate}.` };
      }

      if (!response.ok) {
        console.error('APOD error body:', text.slice(0, 500));
        let message = `Request failed (${response.status}).`;
        try {
          const errData = JSON.parse(text);
          message = errData.message || errData.msg || message; // WordPress uses "message"
        } catch {
          /* body wasn't JSON, keep the default message */
        }
        return { error: message };
      }

      const json = JSON.parse(text);

      // Handle either a single object or an array of entries
      const data = Array.isArray(json) ? json[0] : json;

      if (!data) {
        return { error: `No APOD found for ${selectedDate}.` };
      }

      // Warn if the endpoint returned a different day than we asked for
      if (data.date && data.date !== selectedDate) {
        console.warn(`APOD: asked for ${selectedDate} but got ${data.date}`);
      }

      const { url, mediaType } = resolveMedia(data);
      console.log('APOD resolved media:', { url, mediaType });

      if (!url) {
        return {
          title: data.title,
          explanation: data.explanation,
          credit: data.credit || data.copyright,
          permalink: data.permalink,
          error: 'This entry has no displayable media.',
        };
      }

      add(`APOD: NASA astronomy picture of the day fetched for ${selectedDate}`);

      return {
        title: data.title,
        url,
        media_type: mediaType,
        explanation: data.explanation,
        credit: data.credit || data.copyright,
        permalink: data.permalink,
      };
    } catch (err: any) {
      console.error('APOD fetch error:', err);
      return { error: err.message || 'Network error occurred.' };
    }
  }

  // [state, formAction, isPending]
  const [state, formAction, isPending] = useActionState<ApodSearchResult | null, FormData>(
    fetchApodAction,
    null // Initial state
  );

  // Max date is today (local); the date input also defaults to today
  const today = toLocalISODate();

  // Load today's APOD automatically on first render
  const didAutoLoad = useRef(false);
  useEffect(() => {
    if (didAutoLoad.current) return; // guards against React StrictMode's double effect run
    didAutoLoad.current = true;

    const formData = new FormData();
    formData.set('apodDate', today);
    startTransition(() => {
      formAction(formData);
    });
  }, [formAction, today]);

  return (
    <div className="apod-search-container">
      <h3>Search APOD Archives by Date</h3>

      <form action={formAction} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input
          type="date"
          name="apodDate"
          defaultValue={today}
          min={FIRST_APOD_DATE}
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

      {/* Show errors so a failed search isn't just a blank page */}
      {state?.error && (
        <p role="alert" style={{ color: 'crimson', marginTop: '12px' }}>
          {state.error}
        </p>
      )}

      {/* Render Search Results using ApodMediaViewer */}
      {state && !state.error && state.url && (
        <div style={{ marginTop: '20px' }}>
          <h4>{state.title}</h4>

          <ApodMediaViewer
            url={state.url}
            title={state.title || 'APOD Image'}
            mediaType={state.media_type || 'image'}
          />

          {state.credit && (
            <p style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '8px' }}>{state.credit}</p>
          )}

          {/* NASA's explanation is HTML (links, <strong>), so render it as HTML */}
          {state.explanation && (
            <div
              style={{ fontSize: '0.9rem', marginTop: '10px' }}
              dangerouslySetInnerHTML={{ __html: state.explanation }}
            />
          )}

          {state.permalink && (
            <p style={{ fontSize: '0.9rem' }}>
              <a href={state.permalink} target="_blank" rel="noreferrer">
                View on NASA
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
}



// import { useActionState } from 'react';
// import { useMessages } from './MessageContext';
// import { ApodMediaViewer } from './ApodMediaViewer';

// // In a real world application, you would want to store your API key in an environment variable or a secure vault, not hard-coded in your source code. For demonstration purposes, it's included here directly.
// const NASA_API_KEY = 'QdKv9PuSMawK6XR5ZVsMEUcaI0ewfgjlFzqaSwQ6';
// const BASE_URL = 'https://science.nasa.gov/wp-json/wp/v2/apod-basic';

// // 1. Define the shape of our Form State
// export interface ApodSearchResult {
//   title?: string;
//   url?: string;
//   explanation?: string;
//   media_type?: string;
//   error?: string | null;
// }

// // 3. Component Definition
// export function ApodDateSearch() {
//   const { add } = useMessages();

//   // 2. Define the Action Function that executes on form submit
//   async function fetchApodAction(
//     _prevState: ApodSearchResult | null,
//     formData: FormData
//   ): Promise<ApodSearchResult | null> {
//     const selectedDate = formData.get('apodDate') as string;

//     if (!selectedDate) {
//       return { error: 'Please pick a valid date.' };
//     }

//     try {
//       const response = await fetch(
//         `${BASE_URL}?api_key=${NASA_API_KEY}&date=${selectedDate}`
//       );

//       if (!response.ok) {
//         const errData = await response.json();
//         return { error: errData.msg || 'Failed to fetch APOD for that date.' };
//       }

//       const data = await response.json();
//       add(`APOD: NASA astronomy picture of the day fetched for ${selectedDate}`);
//       return data;
//     } catch (err: any) {
//       return { error: err.message || 'Network error occurred.' };
//     }
//   }

//   // [state, formAction, isPending]
//   const [state, formAction, isPending] = useActionState<ApodSearchResult | null, FormData>(
//     fetchApodAction,
//     null // Initial state
//   );

//   // Set max date limit to today
//   const today = new Date().toISOString().split('T')[0];

//   return (
//     <div className="apod-search-container">
//       <h3>Search APOD Archives by Date</h3>

//       <form action={formAction} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
//         <input
//           type="date"
//           name="apodDate"
//           max={today}
//           required
//           disabled={isPending}
//           style={{ padding: '8px', fontSize: '1rem' }}
//         />
//         <button
//           type="submit"
//           disabled={isPending}
//           style={{ padding: '8px 16px', fontSize: '1rem', cursor: isPending ? 'not-allowed' : 'pointer' }}
//         >
//           {isPending ? 'Fetching NASA...' : 'Search Date'}
//         </button>
//       </form>

//       {/* Render Search Results using ApodMediaViewer */}
//       {state && !state.error && state.url && (
//         <div style={{ marginTop: '20px' }}>
//           <h4>{state.title}</h4>

//           <ApodMediaViewer
//             url={state.url}
//             title={state.title || 'APOD Image'}
//             mediaType={state.media_type || 'image'}
//           />

//           <p style={{ fontSize: '0.9rem', marginTop: '10px' }}>{state.explanation}</p>
//         </div>
//       )}
//     </div>
//   );
// }