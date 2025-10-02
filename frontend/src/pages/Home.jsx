import React from 'react';
//import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import Security from '../components/Security';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <>
      {/* <Navbar /> */}
      <Hero />
      <Features />
      <HowItWorks />
      <Security />
      <Footer />
    </>
  );
};

export default Home;
