import React, { useEffect } from 'react';

const AD_CLIENT = "ca-pub-XXXXXXXXXXXXXXX";
const SCRIPT_ID = "adsbygoogle-script";

const GoogleAds = () => {
  useEffect(() => {
    // Every ad slot renders this component, but the AdSense script must load only once.
    if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CLIENT}`;
      script.async = true;
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
    }
    // Ask AdSense to fill this slot.
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Slot already filled (e.g. StrictMode double effect) or ads blocked.
    }
  }, []);

  return (
    <div>
      <ins className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={AD_CLIENT}
        data-ad-slot="1234567890"
        data-ad-format="auto"
        data-full-width-responsive="true"></ins>
    </div>
  );
};

export default GoogleAds;
