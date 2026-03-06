import React, { useState } from 'react';

const ProviderSlider = () => {
  const [isHovered, setIsHovered] = useState(false);

  // Extract provider logos from the HTML structure
  const providers = [
    { id: 1, name: "provider-awcmjili", src: "/mcw/h5/assets/images/brand/white/provider-awcmjili.png?v=1768297059401" },
    { id: 2, name: "provider-evo", src: "/mcw/h5/assets/images/brand/white/provider-evo.png?v=1768297059401" },
    { id: 3, name: "provider-jdbaspribe", src: "/mcw/h5/assets/images/brand/white/provider-jdbaspribe.png?v=1768297059401" },
    { id: 4, name: "provider-pg", src: "/mcw/h5/assets/images/brand/white/provider-pg.png?v=1768297059401" },
    { id: 5, name: "provider-awcmsexy", src: "/mcw/h5/assets/images/brand/white/provider-awcmsexy.png?v=1768297059401" },
    { id: 6, name: "provider-awcmkm", src: "/mcw/h5/assets/images/brand/white/provider-awcmkm.png?v=1768297059401" },
    { id: 7, name: "provider-jdb", src: "/mcw/h5/assets/images/brand/white/provider-jdb.png?v=1768297059401" },
    { id: 8, name: "provider-awcmfc", src: "/mcw/h5/assets/images/brand/white/provider-awcmfc.png?v=1768297059401" },
    { id: 9, name: "provider-awcmyesbingo", src: "/mcw/h5/assets/images/brand/white/provider-awcmyesbingo.png?v=1768297059401" },
    { id: 10, name: "provider-awcmladyluck", src: "/mcw/h5/assets/images/brand/white/provider-awcmladyluck.png?v=1768297059401" },
    { id: 11, name: "provider-awcmpp", src: "/mcw/h5/assets/images/brand/white/provider-awcmpp.png?v=1768297059401" },
    { id: 12, name: "provider-awcmsg", src: "/mcw/h5/assets/images/brand/white/provider-awcmsg.png?v=1768297059401" },
    { id: 13, name: "provider-awcmfastspin", src: "/mcw/h5/assets/images/brand/white/provider-awcmfastspin.png?v=1768297059401" },
    { id: 14, name: "provider-saba", src: "/mcw/h5/assets/images/brand/white/provider-saba.png?v=1768297059401" },
    { id: 15, name: "icon-sbtech", src: "/mcw/h5/assets/images/icon-set/sports-icon/icon-sbtech.svg?v=1768297059401" },
    { id: 16, name: "icon-sbov2", src: "/mcw/h5/assets/images/icon-set/sports-icon/icon-sbov2.svg?v=1768297059401" },
    { id: 17, name: "icon-horsebook", src: "/mcw/h5/assets/images/icon-set/sports-icon/icon-horsebook.svg?v=1768297059401" },
    { id: 18, name: "provider-nextspin", src: "/mcw/h5/assets/images/brand/white/provider-nextspin.png?v=1768297059401" },
    { id: 19, name: "provider-cq9", src: "/mcw/h5/assets/images/brand/white/provider-cq9.png?v=1768297059401" },
    { id: 20, name: "provider-awcmp8", src: "/mcw/h5/assets/images/brand/white/provider-awcmp8.png?v=1768297059401" },
    { id: 21, name: "provider-awcmrt", src: "/mcw/h5/assets/images/brand/white/provider-awcmrt.png?v=1768297059401" },
    { id: 22, name: "provider-awcmpt", src: "/mcw/h5/assets/images/brand/white/provider-awcmpt.png?v=1768297059401" },
    { id: 23, name: "provider-rich88", src: "/mcw/h5/assets/images/brand/white/provider-rich88.png?v=1768297059401" },
    { id: 24, name: "provider-ka", src: "/mcw/h5/assets/images/brand/white/provider-ka.png?v=1768297059401" },
    { id: 25, name: "provider-worldmatch", src: "/mcw/h5/assets/images/brand/white/provider-worldmatch.png?v=1768297059401" },
    { id: 26, name: "provider-netent", src: "/mcw/h5/assets/images/brand/white/provider-netent.png?v=1768297059401" },
    { id: 27, name: "provider-awcmdg", src: "/mcw/h5/assets/images/brand/white/provider-awcmdg.png?v=1768297059401" },
    { id: 28, name: "provider-png", src: "/mcw/h5/assets/images/brand/white/provider-png.png?v=1768297059401" },
    { id: 29, name: "provider-joker", src: "/mcw/h5/assets/images/brand/white/provider-joker.png?v=1768297059401" },
    { id: 30, name: "provider-ugv3", src: "/mcw/h5/assets/images/brand/white/provider-ugv3.png?v=1768297059401" },
    { id: 31, name: "provider-mg", src: "/mcw/h5/assets/images/brand/white/provider-mg.png?v=1768297059401" },
    { id: 32, name: "provider-bpoker", src: "/mcw/h5/assets/images/brand/white/provider-bpoker.png?v=1768297059401" },
    { id: 33, name: "provider-awcmyl", src: "/mcw/h5/assets/images/brand/white/provider-awcmyl.png?v=1768297059401" },
    { id: 34, name: "provider-awcmhotroad", src: "/mcw/h5/assets/images/brand/white/provider-awcmhotroad.png?v=1768297059401" },
    { id: 35, name: "provider-awcmiloveu", src: "/mcw/h5/assets/images/brand/white/provider-awcmiloveu.png?v=1768297059401" }
  ];

  // Duplicate the providers array to create seamless looping effect
  const duplicatedProviders = [...providers, ...providers];

  return (
    <div className="icon-marquee" style={{ width: '100%' }}>
      <div 
        className="icon-marquee__container"
        style={{
          overflow: 'hidden',
          width: '100%',
          position: 'relative',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="marquee-content"
          style={{
            display: 'flex',
            animation: `marquee-scroll 10s linear infinite`,
            animationPlayState: isHovered ? 'paused' : 'running',
            width: `${duplicatedProviders.length * 100 / providers.length}%`, // Adjust width based on duplication
          }}
        >
          {duplicatedProviders.map((provider, index) => (
            <div
              key={`${provider.id}-${index}`}
              className="marquee-item"
              style={{
                flex: '0 0 auto',
                padding: '0 25px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minWidth: '120px', // Set a minimum width for each item
              }}
            >
              <img
                src={provider.src}
                alt={provider.name}
                style={{
                  maxWidth: '100%',
                  maxHeight: '50px', // Adjust max height as needed
                  objectFit: 'contain',
                  transition: 'filter 0.3s ease',
                }}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee-scroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};

export default ProviderSlider;