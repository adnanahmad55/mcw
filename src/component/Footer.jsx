import React, { useState } from "react";
import payment from '../assets/img/payment-img.8e4ddc9b.png'
import vendor from '../assets/img/vendor-img.413b6a29.png'
import license from '../assets/img/license-img-1.3b8a190e.png'
import license1 from '../assets/img/license-img-2.9a22b477.png'
import FooterNav from "./FooterNav";
import { useSelector } from "react-redux";

export default function Footer() {
    const { isLogin, username } = useSelector((state) => state.auth);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

    const toggleDescription = () => {
        setIsDescriptionExpanded(!isDescriptionExpanded);
    };

    return (
        <>
            {/* <footer className="bg-[#0f172a] text-center text-white py-8">
                <h2 className="text-lg font-bold">
                    <span className="text-white">AFFILIATE PROGRAM</span>
                </h2>
                
                <div className="flex justify-center">
                    <a href="https://ag.mcw88.bet/login  " className="mt-3 see-all-btn hover:underline">Join & Earn</a>
                </div>
                <h2 className="text-lg font-bold mt-6">
                    <span className="text-white">PAYMENT</span> METHOD
                </h2>

                <div className="flex justify-center">
                    <img src={payment} className="h-[38.4533px]" />
                </div>
                <h2 className="text-lg font-bold mt-6">
                    <span className="text-white">GAMES</span> PROVIDERS
                </h2>

                <div className="flex justify-center">
                    <img src={vendor} className="w-full" />
                </div>

                <div className="flex justify-center mt-6">
                    <img
                        src={license}
                        alt="Gaming Curacao"
                        className="h-10"
                    />

                </div>
                <div className="flex justify-center mt-6">
                    <img src={license1} className="h-[29px]" />
                </div>

                <p className="text-sm text-gray-400 mt-4">
                    Copyright © 2025 <span className="font-bold">757X.LIVE™</span>. All rights reserved.
                </p>
            </footer> */}

            <div className="footer-wrap ng-star-inserted">
              <footer className="footer">
                <div
                  className="footer-collapse__logo ng-star-inserted"
                  style={{
                    backgroundImage:
                      'url("/mcw/h5/assets/images/logo-horizontal.png  ")'
                  }}
                />
                <div className="footer-collapse ng-star-inserted">
                  
                  
                  <mcd-footer-description-inr-en className="ng-star-inserted" style={{}}>
                    <div className="footer-collapse__title ng-star-inserted">
                      Mega Casino World: Cricket Exchange &amp; Casino Sites in India
                    </div>
                    <div className={`ng-star-inserted ${isDescriptionExpanded ? 'footer-collapse__content--active' : 'footer-collapse__content'}`} 
                        //  style={{ display: isDescriptionExpanded ? 'block' : 'none' }}
                    >
                      <p>
                        The challenge of choosing the best betting site in India is made
                        more difficult for novices. There are many sites that offer you
                        bonus money if you register, but this does not make them better than
                        other casinos because it's only one factor among many others to
                        consider when looking at which gaming website will suit your needs
                        most effectively.
                      </p>
                      <br />
                      <p>
                        You can't afford to wager your money unless you're sure of the
                        website where it will go. The best gaming websites include Mega
                        Casino World, Crickex, BetVisa, Marvelbet, Addabet, Baji Live and
                        WinBDT among others but there are many more options available on our
                        list so make sure that any exchange or casino site meets all
                        regulations before making any deposit.
                      </p>
                      <br />
                      <p>
                        The increasing number of cyberbullies who use betting sites has made
                        it important for players to take security seriously. Make sure that
                        your information is securely protected and guarded before picking
                        any betting platform in India.
                      </p>
                      <br />
                      <p>
                        The licensing process is an essential part of running any casino,
                        and it's important for players to be aware that without these
                        licenses their gaming establishment will not meet standards. To keep
                        its authorization renewal requires rigorous requirements like
                        meeting certain criteria in order not only maintain but also
                        increase upon current levels by continuing with good practices
                        learned throughout years past.
                      </p>
                      <br />
                      <p>
                        There are now more banking options available in India than ever
                        before. All you need to do is find the one that works best for your
                        needs, whether it be through Electronic or over the counter Bank
                        Transfer. There are also banking apps that truly bring convenience
                        to all casino players such as UPI and Rupee-O or even Cryptocurrency
                        thru Binance or any Crypto platform they prefer.
                      </p>
                      <br />
                      <p>
                        The use of new technologies is serving to enhance the online gaming
                        experience and make it accessible in a way that doesn't require
                        qualification. Offshore casinos have expanded thanks largely due
                        this form transaction, which offers both privacy as well security
                        for gamers from Bangladesh who want access but aren't allowed by law
                        to prohibit them playing anyway!
                      </p>
                      <br />
                      <p>
                        The use of new technologies is serving to enhance the online gaming
                        experience and make it accessible in a way that doesn't require much
                        more qualifications. Offshore casinos have expanded thanks largely
                        due this form transaction, which offers both privacy as well
                        security for gamers from India who want access but aren't allowed by
                        law to prohibit them playing anyway.
                      </p>
                    </div>
                  </mcd-footer-description-inr-en>
                  
                  
                  <div className="footer-collapse__btn" onClick={toggleDescription}>
                    {isDescriptionExpanded ? "Show Less" : "Read More"}
                    <div
                      className={`footer-collapse__btn-arrow ${isDescriptionExpanded ? 'footer-collapse__btn-arrow--active' : ''}`}
                      style={{
                        maskImage:
                          'url("/mcw/h5/assets/images/icon-set/player/kyc/accordion-arrow.svg  ")',
                        transform: isDescriptionExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s ease'
                      }}
                    />
                  </div>
                </div>
                
                <div className="row">
                  <div className="footer__partners">
                    <h2 className="ng-star-inserted">Partners</h2>
                    <ul className="ng-star-inserted">
                      <li className="ng-star-inserted">
                        <img
                          alt="Atlético de Madrid"
                          src="/mcw/h5/assets/images/footer/partner/atletico-de-madrid.png  "
                          loading="lazy"
                        />
                        <strong>Atlético de Madrid</strong>
                        <p>Official Regional Partner</p>
                      </li>
                      
                      <li className="ng-star-inserted">
                        <img
                          alt="BUNDESLIGA"
                          src="/mcw/h5/assets/images/footer/partner/bundesliga.png  "
                          loading="lazy"
                        />
                        <strong>Bundesliga</strong>
                        <p>Regional Betting Partner - Asia</p>
                      </li>
                      
                      
                    </ul>
                    
                    
                  </div>
                  <div className="footer__ambassadors">
                    <h2 className="ng-star-inserted">Brand Ambassadors</h2>
                    <ul className="ng-star-inserted">
                      <li className="ng-star-inserted">
                        <img
                          alt="Anrich Nortje"
                          src="/mcw/h5/assets/images/footer/ambassador/anrich-nortje.png  "
                          loading="lazy"
                        />
                        <strong>Anrich Nortje</strong>
                        <p>South African Cricketer</p>
                      </li>
                      
                      
                    </ul>
                    
                    
                  </div>
                </div>
                <div className="row">
                  <mcd-icon-list _nghost-serverapp-c1907600589="" className="license">
                    <div
                      
                      className="license ng-star-inserted"
                    >
                      <h2 >Gaming License</h2>
                      <ul >
                        <li
                          
                          className="ng-star-inserted"
                        >
                          <img
                            
                            fetchpriority="low"
                            alt="license1"
                            src="/mcw/h5/assets/images/footer/white/license1.png  "
                            loading="lazy"
                            className="ng-star-inserted"
                            width={172}
                            height={56}
                            style={{ aspectRatio: "172 / 56" }}
                          />
                          
                          
                          
                          
                        </li>
                        
                        <li
                          
                          className="ng-star-inserted"
                        >
                          <img
                            
                            fetchpriority="low"
                            alt="anjouan-egaming"
                            src="/mcw/h5/assets/images/footer/white/gaming-license/anjouan-egaming.png  "
                            loading="lazy"
                            className="ng-star-inserted"
                            width={142}
                            height={60}
                            style={{ aspectRatio: "142 / 60" }}
                          />
                          
                          
                          
                          
                        </li>
                        
                        
                      </ul>
                    </div>
                    
                    
                    
                  </mcd-icon-list>
                  <mcd-icon-list _nghost-serverapp-c1907600589="">
                    
                    
                    
                  </mcd-icon-list>
                  <div className="footer__download ng-star-inserted">
                    <h2>APP Download</h2>
                    <a href="">
                      <img
                        alt="android-download"
                        src="/mcw/h5/assets/images/footer/app-download/android-download.svg  "
                        loading="lazy"
                      />
                    </a>
                  </div>
                  
                  <mcd-social-media-list _nghost-serverapp-c3151814184="">
                    
                    <div
                      _ngcontent-serverapp-c3151814184=""
                      className="footer-social ng-star-inserted"
                    >
                      <h2 _ngcontent-serverapp-c3151814184="">Community Websites</h2>
                      <ul _ngcontent-serverapp-c3151814184="">
                        <li
                          _ngcontent-serverapp-c3151814184=""
                          className="ng-star-inserted"
                        >
                          <a
                            _ngcontent-serverapp-c3151814184=""
                            target="_blank"
                            href=""
                            className="ng-star-inserted"
                          >
                            <img
                              _ngcontent-serverapp-c3151814184=""
                              alt="facebook"
                              fetchpriority="low"
                              src="/mcw/h5/assets/images/footer/socialicons/facebook.svg  "
                              loading="lazy"
                              width={22}
                              height={22}
                              style={{ aspectRatio: "22 / 22" }}
                            />
                          </a>
                          
                          
                        </li>
                        
                        <li
                          _ngcontent-serverapp-c3151814184=""
                          className="ng-star-inserted"
                        >
                          <a
                            _ngcontent-serverapp-c3151814184=""
                            target="_blank"
                            href=""
                            className="ng-star-inserted"
                          >
                            <img
                              _ngcontent-serverapp-c3151814184=""
                              alt="instagram"
                              fetchpriority="low"
                              src="/mcw/h5/assets/images/footer/socialicons/instagram.svg  "
                              loading="lazy"
                              width={22}
                              height={22}
                              style={{ aspectRatio: "22 / 22" }}
                            />
                          </a>
                          
                          
                        </li>
                        
                        
                      </ul>
                    </div>
                    
                    
                    
                    
                    
                  </mcd-social-media-list>
                </div>
                <div className="row">
                  <mcd-icon-list _nghost-serverapp-c1907600589="" className="pay">
                    <div
                      
                      className="pay ng-star-inserted"
                    >
                      <h2 >Payment Methods</h2>
                      <ul >
                        <li
                          
                          className="ng-star-inserted"
                        >
                          <img
                            
                            fetchpriority="low"
                            alt="pay16"
                            src="/mcw/h5/assets/images/footer/white/pay16.png  "
                            loading="lazy"
                            className="ng-star-inserted"
                            width={122}
                            height={45}
                            style={{ aspectRatio: "122 / 45" }}
                          />
                          
                          
                          
                          
                        </li>
                        
                        <li
                          
                          className="ng-star-inserted"
                        >
                          <img
                            
                            fetchpriority="low"
                            alt="pay17"
                            src="/mcw/h5/assets/images/footer/white/pay17.png  "
                            loading="lazy"
                            className="ng-star-inserted"
                            width={100}
                            height={30}
                            style={{ aspectRatio: "100 / 30" }}
                          />
                          
                          
                          
                          
                        </li>
                        
                        <li
                          
                          className="ng-star-inserted"
                        >
                          <img
                            
                            fetchpriority="low"
                            alt="pay18"
                            src="/mcw/h5/assets/images/footer/white/pay18.png  "
                            loading="lazy"
                            className="ng-star-inserted"
                            width={85}
                            height={30}
                            style={{ aspectRatio: "85 / 30" }}
                          />
                          
                          
                          
                          
                        </li>
                        
                        <li
                          
                          className="ng-star-inserted"
                        >
                          <img
                            
                            fetchpriority="low"
                            alt="pay48"
                            src="/mcw/h5/assets/images/footer/white/pay48.png  "
                            loading="lazy"
                            className="ng-star-inserted"
                            width={165}
                            height={30}
                            style={{ aspectRatio: "165 / 30" }}
                          />
                          
                          
                          
                          
                        </li>
                        
                        
                      </ul>
                    </div>
                    
                    
                    
                  </mcd-icon-list>
                </div>
                <div className="row">
                  <mcd-about-us _nghost-serverapp-c3419815403="" className="about-us">
                    <div
                      _ngcontent-serverapp-c3419815403=""
                      className="about-us ng-star-inserted"
                    >
                      <h2 _ngcontent-serverapp-c3419815403="">About Us</h2>
                      <ul _ngcontent-serverapp-c3419815403="">
                        <li
                          _ngcontent-serverapp-c3419815403=""
                          className="ng-star-inserted"
                        >
                          <a
                            _ngcontent-serverapp-c3419815403=""
                            target="_blank"
                            href=""
                            className="ng-star-inserted"
                          >
                            {" "}
                            Responsible Gaming{" "}
                          </a>
                          
                          
                        </li>
                        <li
                          _ngcontent-serverapp-c3419815403=""
                          className="ng-star-inserted"
                        >
                          <a
                            _ngcontent-serverapp-c3419815403=""
                            target="_blank"
                            href=""
                            className="ng-star-inserted"
                          >
                            {" "}
                            About Us{" "}
                          </a>
                          
                          
                        </li>
                        <li
                          _ngcontent-serverapp-c3419815403=""
                          className="ng-star-inserted"
                        >
                          <a
                            _ngcontent-serverapp-c3419815403=""
                            target="_blank"
                            href=""
                            className="ng-star-inserted"
                          >
                            {" "}
                            Security{" "}
                          </a>
                          
                          
                        </li>
                        <li
                          _ngcontent-serverapp-c3419815403=""
                          className="ng-star-inserted"
                        >
                          <a
                            _ngcontent-serverapp-c3419815403=""
                            target="_blank"
                            href=""
                            className="ng-star-inserted"
                          >
                            {" "}
                            Privacy Policy{" "}
                          </a>
                          
                          
                        </li>
                        <li
                          _ngcontent-serverapp-c3419815403=""
                          className="ng-star-inserted"
                        >
                          <a
                            _ngcontent-serverapp-c3419815403=""
                            target="_blank"
                            href=""
                            className="ng-star-inserted"
                          >
                            {" "}
                            FAQ{" "}
                          </a>
                          
                          
                        </li>
                        
                      </ul>
                    </div>
                    
                    
                    
                    
                  </mcd-about-us>
                </div>
                
                <div className="footer__copyrights">
                  <div className="footer__copyrights__info">
                    <span>© 2026 MCW Copyrights. All Rights Reserved </span>
                  </div>
                  <mcd-icon-list _nghost-serverapp-c1907600589="" className="safe">
                    <div
                      
                      className="safe ng-star-inserted"
                    >
                      <h2 >Responsible Gaming</h2>
                      <ul >
                        <li
                          
                          className="ng-star-inserted"
                        >
                          <a
                            
                            target="_blank"
                            href=""
                            className="ng-star-inserted"
                          >
                            <img
                              
                              alt="Betting Responsibility"
                              fetchpriority="low"
                              src="/mcw/h5/assets/images/footer/responsible-gaming/gamcare.svg  "
                              loading="lazy"
                            />
                          </a>
                          
                          
                          
                        </li>
                        
                        <li
                          
                          className="ng-star-inserted"
                        >
                          <a
                            
                            target="_blank"
                            href=""
                            className="ng-star-inserted"
                          >
                            <img
                              
                              alt="Betting Responsibility"
                              fetchpriority="low"
                              src="/mcw/h5/assets/images/footer/responsible-gaming/age-limit.svg  "
                              loading="lazy"
                            />
                          </a>
                          
                          
                          
                        </li>
                        
                        <li
                          
                          className="ng-star-inserted"
                        >
                          <img
                            
                            fetchpriority="low"
                            alt="regulations"
                            src="/mcw/h5/assets/images/footer/responsible-gaming/regulations.svg  "
                            loading="lazy"
                            className="ng-star-inserted"
                            width={150}
                            height={150}
                            style={{ aspectRatio: "150 / 150" }}
                          />
                          
                          
                          
                          
                        </li>
                        
                        
                      </ul>
                    </div>
                    
                    
                    
                  </mcd-icon-list>
                </div>
              </footer>
            </div>


        </>
    );
}