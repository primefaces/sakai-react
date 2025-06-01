"use client";

import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import CounterBanner from "./CounterBanner";
import Link from "next/link";
import { faClock, faVideo,} from "@fortawesome/free-solid-svg-icons";
import MyFontAwesome from "./MyFontAwesome";
import VideoPlay from "./VideoPlay";
import Image from "next/image";

export default function HomeClient() {
  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <div className="bg-[#F5F5F5] z-[1] py-[50px] relative">
      <div className="w-full">
        <div className="flex flex-column md:flex-row items-center justify-between">
          <div className="lg:w-1/2">
            <div className="text-[16px] text-[var(--mainColor)] block mb-[15px]">
              <div className="relative">
                <Image 
                  src={'/img/shape1.png'} 
                  width={60} 
                  height={60} 
                  data-aos="fade-up"
                  data-aos-delay="900"
                  data-aos-duration="1000"
                  data-aos-once="true"
                  alt=""
                  className="hidden lg:block absolute top-[-100px] left-[-10px] animateContent"/>
                <span
                  data-aos="fade-up"
                  data-aos-delay="900"
                  data-aos-duration="1000"
                  data-aos-once="true"
                >
                  ЫҢГАЙЛУУ ОКУУ ҮЧҮН ОНЛАЙН МЕЙКИНДИК
                </span>
              </div>
                <h1
                  data-aos="fade-down"
                  data-aos-delay="900"
                  data-aos-duration="1000"
                  data-aos-once="true"
                  className="text-[30px] sm:text-[50px]"
                >
                  Аралыктан окутуу порталына кош келиңиз!
                </h1>
              <div
                data-aos="fade-up"
                data-aos-delay="900"
                data-aos-duration="1000"
                data-aos-once="true"
              >
                {" "}
                Университеттин онлайн билим берүү жаатындагы долбоорлорун
                бириктирүүдөбүз:
                <ul className="m-4">
                  <li>ачык онлайн курстар</li>
                  <li>жогорку билим берүү программалары</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2">
            <div className="banner-img" data-speed="0.05" data-revert="true">
              
              <div className="relative text-[14px]">
                <div className="bg-shape -z-10">
                  <img
                    src="/layout/images/home-banner-phone.png"
                    data-aos="fade-down"
                    data-aos-delay="900"
                    data-aos-duration="1000"
                    data-aos-once="true"
                    className="absolute -z-10 w-20rem sm:w-full"
                    alt="Shape"
                  />
                </div>

                <img
                  src="/layout/images/man.png"
                  data-aos="fade-up"
                  data-aos-delay="900"
                  data-aos-duration="1000"
                  data-aos-once="true"
                  alt="Пользователь"
                  className="w-full z-10"
                />

                <div
                  className="hidden sm:block absolute top-4 left-[-20px] animateContent"
                  data-aos="fade-down"
                  data-aos-delay="900"
                  data-aos-duration="1000"
                  data-aos-once="true"
                >
                  <img src="/img/shape.png" className="z-[-10]" alt="Shape" />
                </div>

                <div
                  className="hidden sm:block absolute top-4 right-0 animateContent"
                  data-aos="fade-up"
                  data-aos-delay="900"
                  data-aos-duration="1000"
                  data-aos-once="true"
                >
                  <img src="/img/shape2.png" alt="Shape" />
                </div>

                <div
                  className="absolute animateFaster z-20"
                  // data-aos="fade-up"
                  // data-aos-delay="900"
                  // data-aos-duration="1000"
                  // data-aos-once="true"
                >
                  <div className="bg-red-500 p-2 sm:p-4">
                    <span className="text-[var(--titleColor)] sm:text-[16px]">13000</span>
                    <p className="text-[12px] sm:text-[16px]">lorem</p>
                  </div>
                </div>

                <div
                  className="absolute bottom-[40%] right-0 animateFaster"
                  data-aos="fade-down"
                  data-aos-delay="900"
                  data-aos-duration="1000"
                  data-aos-once="true"
                >
                  <div className="bg-white p-2 sm:p-4">
                    <span className="text-[var(--titleColor)] sm:text-[16px]">Куттуктайбыз!</span>
                    <p className="text-[12px] sm:text-[16px]">Сиздин кабыл алуу ийгиликтүү аяктады</p>
                  </div>
                </div>

                <div
                  className="absolute bottom-[4%] animateFaster"
                  data-aos="fade-up"
                  data-aos-delay="900"
                  data-aos-duration="1000"
                  data-aos-once="true"
                > 
                  <div className="bg-white p-2 sm:p-4">
                    <span className="text-[var(--titleColor)] sm:text-[16px]">User experience className</span>
                    <p className="text-[12px] sm:text-[16px]">Today at 12.00 PM</p>
                  </div>
                  <a href="signup.html" className="">
                    Join now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
