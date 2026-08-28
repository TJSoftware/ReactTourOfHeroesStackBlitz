import { useRef } from 'react';

interface MediaViewerProps {
  url: string;
  title: string;
  mediaType: 'image' | 'video' | string;
}

export function ApodMediaViewer({ url, title, mediaType }: MediaViewerProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Helper to check if URL is a direct video stream (.mp4, .webm)
  const isDirectVideo = url.match(/\.(mp4|webm|ogv)$/i);

  const handleToggleFullscreen = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        containerRef.current.requestFullscreen().catch((err) => {
          console.error(`Fullscreen error: ${err.message}`);
        });
      }
    }
  };

  const handleInspectResolution = () => {
    if (imageRef.current) {
      const { naturalWidth, naturalHeight } = imageRef.current;
      alert(`Original Image Dimensions: ${naturalWidth}px × ${naturalHeight}px`);
    }
  };

  return (
    <div className="media-viewer-container" style={{ textAlign: 'center', margin: '20px 0' }}>
      <div 
        ref={containerRef} 
        style={{ background: '#000', padding: '10px', borderRadius: '8px', position: 'relative' }}
      >
        {mediaType === 'video' ? (
          isDirectVideo ? (
            /* 1. Direct MP4 / WebM video files */
            <video
              ref={videoRef}
              controls
              src={url}
              style={{ maxWidth: '100%', maxHeight: '450px' }}
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            /* 2. Embedded video players (YouTube, Vimeo, etc.) */
            <iframe
              title={title}
              src={url}
              style={{ width: '100%', height: '450px', border: 'none' }}
              allowFullScreen
            />
          )
        ) : (
          /* 3. Static Images */
          <img
            ref={imageRef}
            src={url}
            alt={title}
            style={{ maxWidth: '100%', maxHeight: '600px', objectFit: 'contain' }}
          />
        )}
      </div>

      <div style={{ marginTop: '10px', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button onClick={handleToggleFullscreen} style={{ padding: '8px 12px', cursor: 'pointer' }}>
          📺 Toggle Fullscreen
        </button>

        {mediaType === 'image' && (
          <button onClick={handleInspectResolution} style={{ padding: '8px 12px', cursor: 'pointer' }}>
            🔍 Inspect Resolution
          </button>
        )}

        {/* Fallback link if iframe embedding is blocked by X-Frame-Options */}
        {mediaType === 'video' && !isDirectVideo && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ padding: '8px 12px', background: '#333', color: '#fff', textDecoration: 'none', borderRadius: '4px' }}
          >
            🔗 Open Video in New Tab
          </a>
        )}
      </div>
    </div>
  );
}