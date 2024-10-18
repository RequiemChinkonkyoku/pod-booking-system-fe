import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "../css/Carousel.css";
import BenefitIcon from "./BenefitIcon";

const carouselItems = [
  {
    title: "Book Your Pod Today!",
    description: "Enjoy a quiet space for your work or relaxation.",
    image:
      "https://th.bing.com/th/id/OIP.dox3Z-0mZc27LuwpVi2HigHaEK?rs=1&pid=ImgDetMain",
    benefits: [
      "Strong Wi-Fi",
      "Climate Control",
      "24/7 Access",
      "Secure Space",
    ],
  },
  {
    title: "Comfortable and Convenient",
    description: "Pods equipped with everything you need to stay productive.",
    image:
      "https://akm-img-a-in.tosshub.com/businesstoday/images/story/202111/podrooms-sixteen_nine.jpeg?size=948:533",
    benefits: [
      "Ergonomic Design",
      "Power Outlets",
      "Noise Cancellation",
      "Adjustable Lighting",
    ],
  },
  {
    title: "Ideal for Meetings",
    description: "Private and soundproof, perfect for your important calls.",
    image:
      "https://jyuhotels.com/upload/images/homepages/slides/16867966421681186260.JPG",
    benefits: ["Video Conferencing", "Whiteboard", "Screen Sharing", "Privacy"],
  },
  {
    title: "Flexible Booking Options",
    description: "Choose hourly or daily rates to fit your schedule.",
    image:
      "https://i.pinimg.com/originals/6d/c1/80/6dc18064f8f07a4fdeca4778d6cae1d4.jpg",
    benefits: [
      "Hourly Rates",
      "Daily Packages",
      "Monthly Plans",
      "Easy Booking",
    ],
  },
];

export default function CarouselPod() {
  return (
    <div className="carousel-container">
      <h1 className="home-title1">Modern POD for Working</h1>
      <div className="carousel-row">
        <Swiper
          slidesPerView={1}
          spaceBetween={30}
          loop={true}
          pagination={{
            clickable: true,
          }}
          breakpoints={{
            900: {
              slidesPerView: 2,
            },
            1200: {
              slidesPerView: 2,
            },
          }}
          className="mySwiper"
        >
          {carouselItems.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="carousel-item1">
                <div className="carousel-item-inner1">
                  <div className="carousel-header1">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="carousel-image"
                  />
                  <div className="carousel-content">
                    <div className="carousel-benefits">
                      {item.benefits.map((benefit, idx) => (
                        <div key={idx} className="benefit-item">
                          <BenefitIcon benefit={benefit} />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                    <button className="cta-button">Book Now</button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
