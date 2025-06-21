import React, { useEffect } from 'react';

const GoogleAds = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
    script.async = true;
    script.setAttribute("data-ad-client", "ca-pub-XXXXXXXXXXXXXXX");
    document.body.appendChild(script);
  }, []);

  return (
    <div className="my-3">
      <ins className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXX"
        data-ad-slot="1234567890"
        data-ad-format="auto"
        data-full-width-responsive="true"></ins>
    </div>
  );
};

export default GoogleAds;
