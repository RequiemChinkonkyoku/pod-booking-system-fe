import React from "react";
import Hero from "../components/Hero";
import CarouselPod from "../components/CarousePod";
import Footer from "../components/Footer";
import ReviewsSection from "../components/ReviewsSection";

const HomePage = () => {
  return (
    <>
      <Hero />
      <CarouselPod />
      <ReviewsSection />
      <Footer />
    </>
  );
};

export default HomePage;
