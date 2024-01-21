import { Route, Routes } from 'react-router-dom';
import './App.css';
import './components/Navbar.css'
import Navbar from './components/Navbar';
import Home from './components/pages/Home';
import Aging from './components/pages/Aging';
import Inventory from './components/pages/Inventory';
import Network from './components/pages/Network';
import Operating from './components/pages/Operating';
import Security from './components/pages/Security';
import Products from './components/pages/Products';
import Versions from './components/pages/Versions';
import Models from './components/pages/Models';
import Location from './components/pages/Location';
import Devices from './components/pages/Devices';
import axios from 'axios';


axios.defaults.baseURL = 'http://localhost:4000';


function App() {
  return (
    <div className='App'>
      <Navbar />
      <Routes>
        <Route path="/Devices" element={<Devices/>} />
        <Route path="/Home" element={<Home/>} />
        <Route path="/Aging" element={<Aging />} />
        <Route path="/Inventory" element={<Inventory />} />
        <Route path="/Network" element={<Network />} />
        <Route path="/Operating" element={<Operating />} />
        <Route path="/Security" element={<Security />} />
        <Route path="/Products" element={<Products />} />
        <Route path="/Versions" element={<Versions />} />
        <Route path="/Models" element={<Models />} />
        <Route path="/Location" element={<Location />} />
      </Routes>
    </div>
  );
}

export default App;