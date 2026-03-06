import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const tabs = [
  "ALL",
  "Welcome Offer",
  "Slots",
  "Live Casino",
  "Sports",
  "Fishing",
  "Lottery",
  "Table",
  "Arcade",
  "Crash",
  "Other",
];

// Static fallback data
const staticPromotions = [
  {
    id: 197732,
    title: "FC Super Elements - Free Spin",
    subtitle: "Free Spin Frenzy",
    imageUrl: "/upload/h5Announcement/image_321778.jpg",
    time: "19/01/2026 10:00 ~ 26/01/2026 09:59",
    tag: null,
    buttons: ["Details"],
  },
  {
    id: 201058,
    title: "JILI Chicken Dash 10000 + Frog Dash ৳5,000 Daily Cashback",
    subtitle: "Daily Cashback",
    imageUrl: "/upload/h5Announcement/image_328194.jpg",
    time: "15/01/2026 00:00 ~ 01/01/2027 00:00",
    tag: null,
    buttons: ["Details"],
  },
  {
    id: 199357,
    title: "BPL 2026 TOURNAMENT GIVEAWAY up to 100,000,000 BDT GIVEAWAY",
    subtitle: "Tournament Giveaway",
    imageUrl: "/upload/h5Announcement/image_323635.jpg",
    time: "26/12/2025 00:00 ~ 23/01/2026 00:00",
    tag: null,
    buttons: ["Details"],
  },
  {
    id: 34221,
    title: "100% First Deposit Bonus ৳700",
    subtitle: "Welcome Offer",
    imageUrl: "/upload/h5Announcement/image_299176.jpg",
    time: "01/01/2024 00:00 ~ 01/01/2027 00:00",
    tag: "Bonus",
    buttons: ["Deposit", "Details"],
  },
  {
    id: 34220,
    title: "Special ৳300 First Deposit Bonus",
    subtitle: "Welcome Offer",
    imageUrl: "/upload/h5Announcement/image_299173.jpg",
    time: "01/01/2024 00:00 ~ 01/01/2027 00:00",
    tag: "Bonus",
    buttons: ["Deposit", "Details"],
  },
  {
    id: 181120,
    title: "Daily Free 5.0% Unlimited Bonus Deposit",
    subtitle: "Top-Up Reward",
    imageUrl: "/upload/h5Announcement/image_299164.jpg",
    time: "15/10/2025 00:00 ~ 01/01/2027 00:00",
    tag: null,
    buttons: ["Details"],
  },
  {
    id: 121505,
    title: "MCW Lucky Spin",
    subtitle: "Surprise Treat",
    imageUrl: "/upload/h5Announcement/image_299158.jpg",
    time: "10/02/2025 00:00 ~ 01/01/2027 00:00",
    tag: null,
    buttons: ["Details"],
  },
  {
    id: 64614,
    title: "MCW Exclusive Promo Code Giveaway",
    subtitle: "Surprise Giveaway",
    imageUrl: "/upload/h5Announcement/image_299152.jpg",
    time: "01/01/2024 00:00 ~ 01/01/2027 00:00",
    tag: null,
    buttons: ["Details"],
  },
  {
    id: 160459,
    title: "MCW Reward Bonus Blast",
    subtitle: "Bonus Blast",
    imageUrl: "/upload/h5Announcement/image_299146.jpg",
    time: "21/07/2025 00:00 ~ 01/01/2027 00:00",
    tag: null,
    buttons: ["Details"],
  },
  {
    id: 18669,
    title: "Sports 50% First Deposit Bonus ৳3,000",
    subtitle: "Welcome Offer",
    imageUrl: "/upload/h5Announcement/image_299140.jpg",
    time: "01/01/2024 00:00 ~ 01/01/2027 00:00",
    tag: "Bonus",
    buttons: ["Deposit", "Details"],
  },
];

export default function Promotions() {
  const [activeTab, setActiveTab] = useState("ALL");
  const [promotions, setPromotions] = useState(staticPromotions);
  const [loading, setLoading] = useState(true);
  
  const authData = JSON.parse(localStorage.getItem("auth"));
  const token = authData?.token;
  
  const navigate = useNavigate();

  const fetchPromotions = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_PROMOTION_API}/promotion/get-all-active-promotion?operator_code=${import.meta.env.VITE_APP_OPERATOR_ID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res?.data?.status) {
        const apiPromotions = res.data.data.promotions.map(promo => ({
          id: promo._id,
          title: promo.title,
          subtitle: promo.subtitle || promo.category,
          imageUrl: `${import.meta.env.VITE_APP_API_BASE_URL}banner-uploads/promotion-banner/${promo.offer_image}` || promo.imageUrl,
          time: `${new Date(promo.start_time).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' })} 00:00 ~ ${new Date(promo.end_time).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' })} 23:59`,
          tag: promo.bonus_code ? "Bonus" : promo.tag,
          buttons: promo.bonus_code ? ["Deposit", "Details"] : ["Details"],
        }));
        
        setPromotions(apiPromotions);
      } else {
        // Use static data if API returns no status
        setPromotions(staticPromotions);
      }
    } catch (err) {
      console.error("Promotion fetch error:", err);
      // Use static data if API fails
      setPromotions(staticPromotions);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  return (
    <div className="promotion">
      <header className="header-inner-promotion ng-tns-c1648710364-103 ng-star-inserted">
        <div className="header-left-btn-group promotion ng-tns-c1648710364-103">
          <div className="page-main-close ng-tns-c1648710364-103" onClick={() => navigate('/')}></div>

          <div className="header-title ng-tns-c1648710364-103">
            <p className="ng-tns-c1648710364-103">Promotion</p>
          </div>
        </div>
      </header>

      <div className="ng-tns-c1648710364-103 ng-tns-c2733227891-104 mt-16">
        <div className="ng-tns-c2733227891-104 row-reverse">
          <div className="ng-tns-c2733227891-104 tab search-tab">
            <ul className="item-ani ng-tns-c2733227891-104">
              {tabs.map((tab) => (
                <li
                  key={tab}
                  type={tab === "ALL" ? "new-promotions" : undefined}
                  className={`ng-tns-c2733227891-104 ${
                    tab === activeTab ? "active" : ""
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  <label className="ng-tns-c2733227891-104">{tab}</label>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="searchpage ng-tns-c2733227891-104">
          <div className="search-top-info ng-tns-c2733227891-104">
            <div
              className="back ng-tns-c2733227891-104"
              style={{
                maskImage:
                  'url("/mcw/h5/assets/images/icon-set/icon-arrow-type01.svg")',
              }}
            >
              Back
            </div>

            <input
              type="text"
              className="ng-tns-c2733227891-104"
              placeholder="Promotion Filter"
            />

            <div
              className="icon-search ng-tns-c2733227891-104"
              style={{
                maskImage:
                  'url("/mcw/h5/assets/images/icon-set/icon-search-type01.svg")',
              }}
            />
          </div>

          <div className="searchpage-main ng-tns-c2733227891-104" />

          <div className="searchpage-bar ng-tns-c2733227891-104">
            <div className="button btn-primary ng-tns-c2733227891-104">
              Confirm
            </div>
          </div>
        </div>
      </div>

      <form className="promotion-main promo-code-form" noValidate>
        <div className="input-group">
          <input
            type="text"
            maxLength={30}
            placeholder="Promo Code"
            autoComplete="off"
            className="password"
          />
          <div className="promo-code-add-btn">Add</div>
        </div>
      </form>

      <div>
        <div className="promotion-main promotion-main-scroll-wrapper">
          {loading ? (
            <div className="loading">Loading promotions...</div>
          ) : promotions.length > 0 ? (
            promotions.map((promo) => (
              <div key={promo.id} className="promotion-box promotion-toggle">
                <div className="pic">
                  <img src={promo.imageUrl} alt={promo.title} loading="lazy" />
                  {promo.tag && <div className={`promotion-box__tag tag--${promo.tag.toLowerCase()}`}>{promo.tag}</div>}
                </div>
                <div className="promotion-box-inner content-style">
                  <div className="text-main">
                    <h3>{promo.title}</h3>
                    <p>{promo.subtitle}</p>
                  </div>
                  <div className="times">
                    <i style={{ maskImage: 'url("/mcw/h5/assets/images/icon-set/icon-clock.svg")' }} />
                    <span>{promo.time}</span>
                  </div>
                  <div className="button-box">
                    {promo.buttons.map((btn) => (
                      <div key={btn} className={`button btn-${btn.toLowerCase()} button__${btn.toLowerCase()}`}>
                        <span>{btn}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-promotions"></div>
          )}
          <div className="prompt">－end of page－</div>
        </div>
      </div>
    </div>
  );
}