import React from 'react';

const PopularGames = () => {
  const games = [
    {
      id: 1,
      title: "Lucky Jaguar 500",
      image: "/upload/game/AWCV2_JILI/JILI-SLOT-160.webp",
      alt: "Lucky Jaguar 500"
    },
    {
      id: 2,
      title: "Super Ace Speed Exclusive",
      image: "/upload/game/AWCV2_JILI/JILI-SLOT-151.png",
      alt: "Super Ace Speed Exclusive"
    },
    {
      id: 3,
      title: "Super Ace Deluxe",
      image: "/upload/game/AWCV2_JILI/JILI-SLOT-102.png",
      alt: "Super Ace Deluxe"
    },
    {
      id: 4,
      title: "Fortune Gems 2",
      image: "/upload/game/AWCV2_JILI/JILI-SLOT-076.png",
      alt: "Fortune Gems 2"
    },
    {
      id: 5,
      title: "Super Ace Speed",
      image: "/upload/game/AWCV2_JILI/JILI-SLOT-142.png",
      alt: "Super Ace Speed"
    },
    {
      id: 6,
      title: "Boxing King",
      image: "/upload/game/AWCV2_JILI/JILI-SLOT-031.png",
      alt: "Boxing King"
    }
  ];

  return (
    <div className="recommend-main games-main" style={{
      display: 'flex',
      overflowX: 'auto',
      gap: '15px',
      padding: '10px 5px',
      scrollbarWidth: 'none', // For Firefox
      msOverflowStyle: 'none', // For IE and Edge
      WebkitOverflowScrolling: 'touch', // For iOS Safari
    }}>
      {/* Hide scrollbar for Webkit browsers */}
      <style jsx>{`
        .recommend-main::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      
      {games.map((game) => (
        <div 
          key={game.id} 
          className="games-box bg-secondaryColor" 
          style={{
            flex: '0 0 210px', // Fixed width of 210px
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.03)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
          }}
        >
          <div className="pic" style={{
            width: '100%',
            height: 'auto',
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px',
            overflow: 'hidden',
          }}>
            <a 
              href="#" 
              style={{
                display: 'block',
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <img 
                src={game.image} 
                alt={game.alt} 
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  objectFit: 'cover',
                }} 
                loading="lazy" 
              />
            </a>
          </div>
          <div className="text" style={{
            padding: '10px',
            textAlign: 'left',
          }}>
            <h3 style={{
              margin: '0',
              fontSize: '16px',
              fontWeight: '500',
              color: '#fff',
              lineHeight: '1.4',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {game.title}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PopularGames;