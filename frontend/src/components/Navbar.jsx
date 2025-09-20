import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Link } from "react-router-dom";
import { navLinks } from "../../constants/index.js";

const Navbar = () => {
  useGSAP(() => {
    const navTween = gsap.timeline({
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "+=200",
        scrub: true,
      },
    });

    navTween.fromTo(
      "nav",
      { backgroundColor: "transparent", backdropFilter: "blur(0px)" },
      {
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        backdropFilter: "blur(10px)",
        duration: 1,
        ease: "power1.inOut",
      }
    );
  });

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-8 py-4 flex items-center justify-between">
      {/* Left side: Logo + Nav links + Login */}
      <div className="flex items-center gap-8">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-2">
          <img src="/images/logo.png" alt="logo" className="h-10 w-auto" />
          <p className="text-[#185519] font-bold text-lg">ZenTea</p>
        </a>

        {/* Nav Links */}
        <ul className="flex gap-6 text-white font-medium">
          {navLinks.map((link) => (
            <li key={link.id}>
              {link.id === "contact" ? (
                <Link
                  to="/contact-us"
                  className="hover:text-[#7ed957] transition-colors duration-300"
                >
                  {link.title}
                </Link>
              ) : (
                <a
                  href={`#${link.id}`}
                  className="hover:text-[#7ed957] transition-colors duration-300"
                >
                  {link.title}
                </a>
              )}
            </li>

          ))}
        </ul>

        {/* Login Button */}
        <a
          href="/login"
          className="px-4 py-2 rounded-xl border border-[#7ed957] text-[#7ed957] hover:bg-[#7ed957] hover:text-black transition-all duration-300"
        >
          Login
        </a>
      </div>

      {/* Right side: Signup Button */}
      <a
        href="/signup"
        className="px-4 py-2 rounded-xl bg-[#7ed957] text-black font-semibold hover:bg-[#5ab143] transition-all duration-300"
      >
        SignUp
      </a>
    </nav>
  );
};

export default Navbar;
