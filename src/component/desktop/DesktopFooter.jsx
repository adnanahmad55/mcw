import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProviderSlider from '../ProviderSlider';

export default function DesktopFooter() {
  const { t } = useTranslation();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  return (
    <footer className="dt-footer">
      {/* Game Providers */}
      <div className="dt-footer__section">
        <h3 className="dt-footer__heading">Game Providers</h3>
        <ProviderSlider />
      </div>

      {/* Partners + Ambassadors */}
      <div className="dt-footer__section dt-footer__row-2col">
        <div className="dt-footer__partners">
          <h3 className="dt-footer__heading">Partners</h3>
          <ul className="dt-footer__partner-list">
            <li>
              <img src="/mcw/h5/assets/images/footer/partner/atletico-de-madrid.png" alt="Atlético de Madrid" loading="lazy" />
              <strong>Atlético de Madrid</strong>
              <p>Official Regional Partner</p>
            </li>
            <li>
              <img src="/mcw/h5/assets/images/footer/partner/bundesliga.png" alt="Bundesliga" loading="lazy" />
              <strong>Bundesliga</strong>
              <p>Regional Betting Partner - Asia</p>
            </li>
          </ul>
        </div>
        <div className="dt-footer__ambassadors">
          <h3 className="dt-footer__heading">Brand Ambassadors</h3>
          <ul className="dt-footer__partner-list">
            <li>
              <img src="/mcw/h5/assets/images/footer/ambassador/anrich-nortje.png" alt="Anrich Nortje" loading="lazy" />
              <strong>Anrich Nortje</strong>
              <p>South African Cricketer</p>
            </li>
          </ul>
        </div>
      </div>

      {/* License + Download */}
      <div className="dt-footer__section dt-footer__row-multi">
        <div className="dt-footer__license">
          <h3 className="dt-footer__heading">Gaming License</h3>
          <div className="dt-footer__icon-row">
            <img src="/mcw/h5/assets/images/footer/white/license1.png" alt="License" loading="lazy" />
            <img src="/mcw/h5/assets/images/footer/white/gaming-license/anjouan-egaming.png" alt="Anjouan" loading="lazy" />
          </div>
        </div>
        <div className="dt-footer__download">
          <h3 className="dt-footer__heading">APP Download</h3>
          <a href="#">
            <img src="/mcw/h5/assets/images/footer/app-download/android-download.svg" alt="Download" loading="lazy" />
          </a>
        </div>
        <div className="dt-footer__social">
          <h3 className="dt-footer__heading">Community Websites</h3>
          <div className="dt-footer__icon-row">
            <a href="#" target="_blank" rel="noreferrer">
              <img src="/mcw/h5/assets/images/footer/socialicons/facebook.svg" alt="Facebook" loading="lazy" />
            </a>
            <a href="#" target="_blank" rel="noreferrer">
              <img src="/mcw/h5/assets/images/footer/socialicons/instagram.svg" alt="Instagram" loading="lazy" />
            </a>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="dt-footer__section">
        <h3 className="dt-footer__heading">Payment Methods</h3>
        <div className="dt-footer__icon-row">
          <img src="/mcw/h5/assets/images/footer/white/pay16.png" alt="pay16" loading="lazy" />
          <img src="/mcw/h5/assets/images/footer/white/pay17.png" alt="pay17" loading="lazy" />
          <img src="/mcw/h5/assets/images/footer/white/pay18.png" alt="pay18" loading="lazy" />
          <img src="/mcw/h5/assets/images/footer/white/pay48.png" alt="pay48" loading="lazy" />
        </div>
      </div>

      {/* About Us links */}
      <div className="dt-footer__section dt-footer__links">
        <a href="#">Responsible Gaming</a>
        <a href="#">About Us</a>
        <a href="#">Security</a>
        <a href="#">Privacy Policy</a>
        <a href="#">FAQ</a>
      </div>

      {/* Copyright + Responsible Gaming badges */}
      <div className="dt-footer__section dt-footer__copyright">
        <span>© 2026 MCW Copyrights. All Rights Reserved</span>
        <div className="dt-footer__badges">
          <img src="/mcw/h5/assets/images/footer/responsible-gaming/gamcare.svg" alt="Gamcare" loading="lazy" />
          <img src="/mcw/h5/assets/images/footer/responsible-gaming/age-limit.svg" alt="Age Limit" loading="lazy" />
          <img src="/mcw/h5/assets/images/footer/responsible-gaming/regulations.svg" alt="Regulations" loading="lazy" />
        </div>
      </div>
    </footer>
  );
}
