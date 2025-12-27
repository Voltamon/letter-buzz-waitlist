import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const Navbar = () => {
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(logoRef.current, {
        opacity: 0,
        x: -30,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.2,
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <nav className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-center">
        <div ref={logoRef} className="flex items-center gap-2">
          <img src="/logo.png" alt="LetterBuzz Logo" className="w-8 h-8" />
          <span className="font-semibold text-base sm:text-lg tracking-tight">LetterBuzz</span>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
