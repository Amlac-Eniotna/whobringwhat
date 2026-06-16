"use client";

import Script from "next/script";
import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const AD_CLIENT = "ca-pub-3926875591519363";

export function AdSense() {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense n'est pas encore disponible (bloqueur de pub, hors ligne…)
    }
  }, []);

  return (
    <div className="w-full text-center">
      <Script
        id="adsbygoogle-init"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CLIENT}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      {/* quiramenequoi */}
      <ins
        className="adsbygoogle"
        style={{ display: "inline-block", width: 320, height: 110 }}
        data-ad-client={AD_CLIENT}
        data-ad-slot="4134829897"
      />
    </div>
  );
}
