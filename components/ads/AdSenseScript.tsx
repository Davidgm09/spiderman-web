'use client';

import Script from 'next/script';

export function AdSenseScript() {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID;

  if (!clientId) {
    return null;
  }

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
      onLoad={() => {
        console.log('✅ Google AdSense script loaded');
      }}
      onError={(error) => {
        console.error('❌ Google AdSense script failed to load:', error);
      }}
    />
  );
}