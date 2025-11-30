import { useEffect, useRef, useState } from "react";
import type { Case } from "../data/cases";

interface Props {
  item: Case;
  onOpen: () => void;
}

export default function Card({ item, onOpen }: Props) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`
        bg-white rounded-2xl shadow-md border-t-4 border-[#d62828]
        px-10 py-12 text-center flex flex-col items-center
        transition-all duration-700 ease-out
        hover:-translate-y-1 hover:shadow-lg hover:shadow-[rgba(255,1,1,0.34)] cursor-pointer hover:cursor-pointer
        ${isVisible ? "animate-fade-in" : "opacity-0 translate-y-8"}
      `}
    >
      <div className="flex justify-center items-center w-full mb-6">
        <img
          src={item.img}
          alt={item.title}
          className="h-[150px] w-[150px] p-2 object-contain"
        />
      </div>

      <h3 className="my-5 text-[#d62828] font-bold text-lg">{item.title}</h3>

      <p className="text-[15px] mb-6 text-[#444] px-2">{item.quick}</p>

      <button
        onClick={onOpen}
        className="
          bg-[#4d4a4a] text-white px-6 py-2.5 rounded-lg font-bold text-base cursor-pointer hover:cursor-pointer
          transition-colors duration-300
          hover:bg-[#d62828]
        "
      >
        التفاصيل
      </button>
    </div>
  );
}
