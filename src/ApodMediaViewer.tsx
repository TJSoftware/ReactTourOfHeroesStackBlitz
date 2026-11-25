interface ApodMediaViewerProps {
  url?: string;
  title?: string;
  mediaType?: string;
}

export function ApodMediaViewer({ url, title = 'APOD media' }: ApodMediaViewerProps) {
  if (!url) {
    return <p>No media available.</p>;
  }

  // Strip any query string before checking the file extension
  const cleanUrl = url.split('?')[0];
  const isDirectVideo = /\.(mp4|webm|ogv)$/i.test(cleanUrl);
  const isEmbed = /(youtube\.com|youtube-nocookie\.com|youtu\.be|vimeo\.com)/i.test(url);

  if (isDirectVideo) {
    return <video src={url} controls style={{ maxWidth: '100%' }} />;
  }

  // Only frame known embed hosts; science.nasa.gov pages refuse to be framed
  if (isEmbed) {
    return (
      <iframe
        src={url}
        title={title}
        width="640"
        height="360"
        allowFullScreen
        style={{ border: 0, maxWidth: '100%' }}
      />
    );
  }

  return <img src={url} alt={title} style={{ maxWidth: '100%' }} />;
}
