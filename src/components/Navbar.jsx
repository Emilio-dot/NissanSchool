import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import backgroundImage from '../assets/img/logotype.png'
import './Navbar.css';


const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  

  return (
    
    <nav>
      <li><NavLink to="/" className='title'><img src={backgroundImage} width="15%" height="auto" alt="" /></NavLink></li>
      <div className="menu" onClick={() => setMenuOpen(!menuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <ul className={menuOpen ? "open" : ""}>
        <li><NavLink to="/Aging">Aging</NavLink></li>
        <li><NavLink to="/Network">Network</NavLink></li>
        <li><NavLink to="/Inventory">Inventory</NavLink></li>
        <li><NavLink to="/Operating">Operating System</NavLink></li>
        <li><NavLink to="/Security">Security</NavLink></li>
      </ul>
    </nav>
  );
}

export default Navbar;
