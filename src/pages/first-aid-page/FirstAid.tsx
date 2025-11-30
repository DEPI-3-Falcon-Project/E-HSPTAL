import { useState } from "react";
import Filters from "../../components/Filters";
import Card from "../../components/Card";
import Modal from "../../components/Modal";
import KitSection from "../../components/KitSection";
import EmergencySection from "../../components/EmergencySection";
import EmergencyButton from "../../components/EmergencyButton";
import { cases } from "../../data/cases";
import "./first-aid.css";

export default function FirstAid() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("");
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(8);

  const filteredCases = cases.filter((item) => {
    const matchSearch = item.title.includes(search);
    const matchSelect = selected ? item.id === selected : true;
    return matchSearch && matchSelect;
  });

  const visibleCases = filteredCases.slice(0, visibleCount);

  const activeCase = cases.find((c) => c.id === selectedCase);

  const handleShowMore = () => {
    setVisibleCount(filteredCases.length);
  };

  return (
    <main className="text-center min-h-screen pt-20">
      <Filters
        search={search}
        setSearch={setSearch}
        selected={selected}
        setSelected={setSelected}
      />

      <section className="container mx-auto px-10">
        <div className="grid gap-4 px-4 pb-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleCases.map((item) => (
            <Card
              key={item.id}
              item={item}
              onOpen={() => setSelectedCase(item.id)}
            />
          ))}
        </div>

        {visibleCount < filteredCases.length && (
          <div className="text-center mb-10">
            <button
              onClick={handleShowMore}
              className="bg-[#4d4a4a] text-white px-6 py-3 rounded-lg font-semibold text-lg cursor-pointer transition-all duration-500 ease-in-out hover:bg-[#d62828] hover:scale-105 hover:shadow-lg"
            >
              عرض المزيد
            </button>
          </div>
        )}
      </section>

      {activeCase && (
        <Modal item={activeCase} onClose={() => setSelectedCase(null)} />
      )}

      <KitSection />
      <EmergencySection />
      <EmergencyButton />
    </main>
  );
}
