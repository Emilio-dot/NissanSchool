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

function App() {
  return (
    <div className='App'>
      <Navbar />
      <Routes>
        <Route path="/Home" element={<Home/>} />
        <Route path="/Aging" element={<Aging />} />
        <Route path="/Inventory" element={<Inventory />} />
        <Route path="/Network" element={<Network />} />
        <Route path="/Operating" element={<Operating />} />
        <Route path="/Security" element={<Security />} />
      </Routes>
    </div>
  );
}

export default App;
