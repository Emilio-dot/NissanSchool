import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import backgroundImage from '../assets/img/logotype.png';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Navbar.css';

const Navbar = () => {
  const [show, setShow] = useState(false);

  const toggleSidebar = () => {
    setShow(!show);
  };
  
  return (
    <main className={show ? 'space-toggle' : null}>
      <header className={`header ${show ? 'space-toggle' : null}`}>
        <div className='header-toggle' onClick={() => setShow(!show)}>
          <i className={`fas fa-bars ${show ? 'fa-solid fa-xmark' : null}`}></i>
        </div>
      </header>

      <aside className={`sidebar ${show ? 'show' : null}`}>
      <img className='logo' src={backgroundImage} width="95%" height="auto" alt=""/>
        <nav className='nav'>
          <div>
            <NavLink to='/' className='nav-logo'>
              <i className={`fas fa-home-alt nav-logo-icon`}></i>
              <span className='nav-logo-name'>Homepage</span>
            </NavLink>

            
            <div className='nav-list'>
              <NavLink to='/aging' className='nav-logo'>
                <i className='fas fa-tachometer-alt nav-logo-icon'></i>
                <span className='nav-link-name'>Aging</span>
              </NavLink>
              <NavLink to='/network' className='nav-logo'>
                <i className='fas fa-rss nav-logo-icon'></i>
                <span className='nav-link-name'>Network</span>
              </NavLink>
              <NavLink to='/inventory' className='nav-logo'>
                <i className='fas fa-add nav-logo-icon'></i>
                <span className='nav-link-name'>Inventory</span>
              </NavLink>
              <NavLink to='/operating' className='nav-logo'>
                <i className='fa-brands fa-windows nav-logo-icon'></i>
                <span className='nav-link-name'>Op. System</span>
              </NavLink>
              <NavLink to='/security' className='nav-logo'>
                <i className='fa-solid fa-lock nav-logo-icon'></i>
                <span className='nav-link-name'>Security</span>
              </NavLink>
              <NavLink to='/Products' className='nav-logo'>
                <i className='fas fa-plus-minus nav-logo-icon'></i>
                <span className='nav-link-name'>Manage Product</span>
              </NavLink>
            </div>
          </div>
        </nav>
      </aside>
      
    </main>
  );
};

export default Navbar;
