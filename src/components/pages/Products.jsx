import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Versions from './Versions';
import Models from './Models';
import Location from './Location';
import Devices from './Devices';

import '../pages/Products.css';

const Products = () => {
  const [activeComponent, setActiveComponent] = useState('');

  const handleChange = (component) => {
    setActiveComponent(component);
  };

  return (
    <div>
      <div className='Top_Buttom'>
        <NavLink to="/Devices" className='Top_Buttom_Buttom' onClick={() => handleChange('Devices')}>Manage Devices</NavLink>
        <NavLink to="/versions" className='Top_Buttom_Buttom' onClick={() => handleChange('Versions')}>Manage Versions</NavLink>
        <NavLink to="/models" className='Top_Buttom_Buttom' onClick={() => handleChange('Models')}>Manage Models</NavLink>
        <NavLink to="/Location" className='Top_Buttom_Buttom' onClick={() => handleChange('Location')}>Manage Locations</NavLink>
      </div>
      

      {activeComponent === 'Devices' && <Devices />}
      {activeComponent === 'Versions' && <Versions />}
      {activeComponent === 'Models' && <Models />}
      {activeComponent === 'Location' && <Location />}
    </div>
  );
};

export default Products;
