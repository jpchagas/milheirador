import React, { useEffect } from 'react';
import { cn } from "@/lib/utils";

// The AdSense script itself is loaded by index.html.
const AD_CLIENT = "ca-pub-9175151923356236";

const AD_SLOTS = {
  banner: "3249043428",
  content: "2488168086",
};

// One AdSense display unit; `slot` is a key of AD_SLOTS. A responsive unit picks its own
// size; otherwise `className` must give the unit its width and height.
const GoogleAds = ({ slot, responsive = true, className }) => {
  useEffect(() => {
    // Ask AdSense to fill this slot.
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Slot already filled (e.g. StrictMode double effect) or ads blocked.
    }
  }, []);

  return responsive ? (
    <ins className={cn("adsbygoogle block", className)}
      data-ad-client={AD_CLIENT}
      data-ad-slot={AD_SLOTS[slot]}
      data-ad-format="auto"
      data-full-width-responsive="true"></ins>
  ) : (
    <ins className={cn("adsbygoogle inline-block", className)}
      data-ad-client={AD_CLIENT}
      data-ad-slot={AD_SLOTS[slot]}></ins>
  );
};

export default GoogleAds;
