import React from 'react';
//import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import Security from '../components/Security';
import Footer from '../components/Footer';
import Pricing from '../components/Pricing';

const Home = () => {
  return (
    <>
      {/* <Navbar /> */}
      <Hero />
      <Features />
      <HowItWorks />
      <Security />
      <Pricing/>
      <Footer />
    </>
  );
};

export default Home;
