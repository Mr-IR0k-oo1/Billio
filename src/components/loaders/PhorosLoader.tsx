"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import "./PhorosLoader.css";

export default function PhorosLoader({
  onComplete,
}: {
  onComplete?: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const letters = gsap.utils.toArray<HTMLElement>(".letter");
      const phi = document.querySelector<HTMLElement>(".letter.phi");

      /* Initial state */
      gsap.set(letters, {
        opacity: 0,
        scale: 1.8,
        z: -320,
        rotateX: 12,
        rotateY: -6,
      });

      if (phi) {
        gsap.set(phi, {
          scale: 2.1,
          z: -420,
        });
      }

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      /* Φ leads */
      tl.to(phi, {
        opacity: 1,
        scale: 1,
        z: 0,
        rotateX: 0,
        rotateY: 0,
        duration: 0.9,
      });

      /* Remaining letters follow */
      tl.to(
        letters.filter((l) => l !== phi),
        {
          opacity: 1,
          scale: 1,
          z: 0,
          rotateX: 0,
          rotateY: 0,
          duration: 0.8,
          stagger: 0.1,
        },
        "-=0.4"
      );

      /* Hold – system stable */
      tl.to({}, { duration: 0.4 });

      /* Collapse inward */
      tl.to(letters, {
        scale: 0.85,
        opacity: 0,
        duration: 0.5,
        stagger: {
          each: 0.06,
          from: "center",
        },
      });

      /* Exit */
      tl.to(
        containerRef.current,
        {
          opacity: 0,
          duration: 0.4,
          ease: "power2.inOut",
          onComplete: () => onComplete?.(),
        },
        "-=0.2"
      );
    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div className="phoros-wrapper" ref={containerRef}>
      <div className="phoros-word">
        <span className="letter phi">Φ</span>
        <span className="letter">ό</span>
        <span className="letter">ρ</span>
        <span className="letter">ο</span>
        <span className="letter">ς</span>
      </div>
    </div>
  );
}
