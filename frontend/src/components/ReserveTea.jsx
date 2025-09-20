import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText, ScrollTrigger } from "gsap/all";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const ReserveTea = () => {
  const container = useRef();
  const imageRef = useRef();
  const textRef = useRef();

  useGSAP(() => {
    // Image animation - slides in from left (-100px) to final position
    gsap.from(imageRef.current, {
      x: -100,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: container.current,
        start: "top 70%",
        toggleActions: "play none none none"
      }
    });

    // Text animation - staggered fade up
    const split = new SplitText(".reserve-text p:not(.italic-text)", {
      type: "lines",
    });

    gsap.from(split.lines, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: textRef.current,
        start: "top 80%",
        toggleActions: "play none none none"
      }
    });

    // Special animation for italic text
    gsap.from(".italic-text", {
      y: 30,
      opacity: 0,
      duration: 1,
      delay: 0.3,
      ease: "power2.out",
      scrollTrigger: {
        trigger: textRef.current,
        start: "top 80%",
        toggleActions: "play none none none"
      }
    });

  }, { scope: container });

  return (
    <section 
      ref={container}
      className="relative py-20 bg-white bg-opacity-70 overflow-hidden mt-10"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Image on the left */}
          <div 
            ref={imageRef}
            className="reserve-image md:w-1/2 transform translate-x-0 will-change-transform ml-50"
          >
            <img 
              src="/images/teareserve.png"
              alt="85 Reserve Tea"
              className="w-full max-w-[400px] h-auto max-h-[400px] object-cover rounded-lg shadow-lg  "
            />
          </div>
          
          {/* Text content on the right */}
          <div 
            ref={textRef}
            className="reserve-text md:w-1/2 text-black mr-80 mt-8"
          >
            <h2 className="text-4xl font-bold mb-2 font-ibarra">85 Reserve</h2>
            <p className="italic text-xl mb-6 font-ibarra">Small batch luxury artisanal tea</p>
            
            <p className="mb-6 font-jost">
              The finest handpicked and small batch teas celebrate 1985, the year that the world's most experienced tea 
              maker, Merrill J. Fernando, founded Dilmah. Every Dilmah 85 Reserve Tea and Infusion has been hand
               selected and crafted by Merrill J. Fernando, the master tea maker himself, to bring a taste of luxury and
             indulgence to the everyday.
            </p>
            
            <div className="my-8 italic-text text-center md:text-left font-jost">
              <p>Small batch luxury artisanal tea,</p>
              <p>-- for real tea people --</p>
            </div>
            
            <button className="mt-6 px-8 py-3 bg-black text-white hover:bg-gray-800 transition-colors rounded-lg font-ibarra">
              EXPLORE
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReserveTea;