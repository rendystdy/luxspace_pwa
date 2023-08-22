import React, {useState, useEffect} from 'react';

import {
  BrowserRouter,
  Route,
  Routes
} from "react-router-dom";

import Header from './components/Header';
import Hero from './components/Hero';
import Browse from './components/Browse';
import Arrived from './components/Arrived';
import Clients from './components/Clients';
import AsideMenu from './components/AsideMenu';
import Footer from './components/Footer';
import Offline from './components/Offline';
import Splash from './pages/Splash';
import Profile from './pages/Profile';

function Home() {
  const [items, setItems] = useState([]);
  const [offlineStatus, setOfflineStatus] = useState(!navigator.onLine);
  const [isLoading, setIsLoading] = useState(true);

  const handleOfflineStatus = () => {
    setOfflineStatus(!navigator.onLine);
  }

  useEffect(() => {
    (async () => {
      const response = await fetch('https://bwacharity.fly.dev/items', {
        headers: {
          "Content-Type": "application/json",
          "accept": "application/json",
        }
      })
      const {nodes} = await response.json();
      setItems(nodes);

      if (!document.querySelector('script[src="/carousel.js"]')) {
        const script = document.createElement("script");
  
        script.src = '/carousel.js';
        script.async = false;
        document.body.appendChild(script);
      }

    })();

    handleOfflineStatus()

    window.addEventListener('online', handleOfflineStatus);
    window.addEventListener('offline', handleOfflineStatus);

    setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => {
      window.removeEventListener('online', handleOfflineStatus);
      window.removeEventListener('offline', handleOfflineStatus);
    }

  }, [offlineStatus]);


  return (
    <div>
    {isLoading ? <Splash /> : 
    (
      <>
      {offlineStatus && <Offline />}
        <Header />
        <Hero />
        <Browse />
        <Arrived items={items} />
        <Clients />
        <AsideMenu />
        <Footer />
      </>
    )}
    </div>
  );
}


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>
    </BrowserRouter>
  )
};
