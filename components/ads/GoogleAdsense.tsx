'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface GoogleAdProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'banner' | 'leaderboard' | 'skyscraper';
  fullWidthResponsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function GoogleAd({ 
  adSlot, 
  adFormat = 'auto',
  fullWidthResponsive = true,
  className = '',
  style = {}
}: GoogleAdProps) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID;

  useEffect(() => {
    if (typeof window !== 'undefined' && clientId) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error('AdSense error:', error);
      }
    }
  }, [clientId]);

  if (!clientId) {
    // Show placeholder in development
    return (
      <div 
        className={`bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-500 ${className}`}
        style={{ minHeight: '250px', ...style }}
      >
        <div className="text-center">
          <div className="text-sm">Anuncio AdSense</div>
          <div className="text-xs opacity-60">Slot: {adSlot}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`ad-container ${className}`} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={clientId}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive}
      />
    </div>
  );
}

// Predefined ad components for common placements
export function HeaderAd() {
  return (
    <GoogleAd
      adSlot="1234567890" // Replace with your actual slot ID
      adFormat="banner"
      className="w-full mb-4"
      style={{ minHeight: '90px' }}
    />
  );
}

export function SidebarAd() {
  return (
    <GoogleAd
      adSlot="1234567891" // Replace with your actual slot ID
      adFormat="rectangle"
      className="w-full mb-6"
      style={{ minHeight: '250px' }}
    />
  );
}

export function InContentAd() {
  return (
    <GoogleAd
      adSlot="1234567892" // Replace with your actual slot ID
      adFormat="rectangle"
      className="w-full my-8 mx-auto max-w-md"
      style={{ minHeight: '250px' }}
    />
  );
}

export function FooterAd() {
  return (
    <GoogleAd
      adSlot="1234567893" // Replace with your actual slot ID
      adFormat="leaderboard"
      className="w-full mt-8"
      style={{ minHeight: '90px' }}
    />
  );
}

// Mobile-optimized ad
export function MobileAd() {
  return (
    <div className="block md:hidden">
      <GoogleAd
        adSlot="1234567894" // Replace with your actual slot ID
        adFormat="banner"
        className="w-full my-4"
        style={{ minHeight: '50px' }}
      />
    </div>
  );
}

// Desktop-optimized ad
export function DesktopAd() {
  return (
    <div className="hidden md:block">
      <GoogleAd
        adSlot="1234567895" // Replace with your actual slot ID
        adFormat="leaderboard"
        className="w-full my-6"
        style={{ minHeight: '90px' }}
      />
    </div>
  );
}