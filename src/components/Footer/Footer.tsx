import React from 'react';
import './Footer.css';
import { assets } from '../../assets/assets';
import Logo from '../../../public/logoSVG';

const Footer: React.FC = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
          <Logo width={300} height={70} />
          <p>This website is only for my portfolio, it is not a real website.</p>
          <div className="footer-social-icons">
            <img src={assets.facebook_icon.src} alt="Facebook" />
            <img src={assets.twitter_icon.src} alt="Twitter" />
            <img src={assets.linkedin_icon.src} alt="LinkedIn" />
          </div>
        </div>
        <div className="footer-content-center">
          <h2>COMPANY</h2>
          <ul>
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>CONTACT US</h2>
          <ul>
            <li>+1-212-456-7890</li>
            <li>contact@yourdelivery.com</li>
          </ul>
        </div>
      </div>
      <hr />
      <p className='footer-copyright'>Copyright 2024 © yourdelivery.app - All rights reserved.</p>
    </div>
  );
}

export default Footer;
