import React from 'react';
import './Header.css';

const Header: React.FC = () => {
  return (
    <div className='header'>
      <div className="header-contents">
        <h2>Order your favorite food here</h2>
        <p>Choose from a diverse menu with a delicious variety of dishes made with the best ingredients, satisfy your cravings, and elevate your gastronomic experience, one delicious meal at a time.</p>
        <a href="#explore-menu"><button className='buttonwl'>View Menu</button></a>
      </div>
    </div>
  );
}

export default Header;
