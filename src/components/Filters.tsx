import { useState } from "react";

interface Props {
  search: string;
  setSearch: (v: string) => void;
  selected: string;
  setSelected: (v: string) => void;
}

export default function Filters({
  search,
  setSearch,
  selected,
  setSelected,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const groups = [
    {
      label: "إصابات وحوادث",
      options: [
        { value: "fracture", label: "كسور" },
        { value: "wounds", label: "جروح ونزيف" },
        { value: "burn", label: "حروق" },
        { value: "head", label: "إصابة بالرأس" },
      ],
    },
    {
      label: "حوادث صحية مفاجئة",
      options: [
        { value: "faint", label: "إغماء" },
        { value: "heart", label: "أزمة قلبية" },
        { value: "breathing", label: "صعوبة في التنفس" },
      ],
    },
    {
      label: "لدغات أو تسمم",
      options: [
        { value: "insect", label: "لدغات حشرات" },
        { value: "animal", label: "لدغات حيوانات" },
        { value: "poison", label: "تسمم غذائي أو كيميائي" },
      ],
    },
    {
      label: "حالات الأطفال",
      options: [
        { value: "minor-injury", label: "سقوط أو إصابة بسيطة" },
        { value: "fever", label: "حرارة مرتفعة" },
      ],
    },
    {
      label: "حالات الطوارئ العامة",
      options: [
        { value: "fire", label: "إطفاء الحريق الصغير" },
        { value: "severe-bleeding", label: "النزيف الشديد" },
        { value: "gas-poison", label: "التسمم بالغاز" },
      ],
    },
  ];

  const currentLabel =
    groups.flatMap((g) => g.options).find((o) => o.value === selected)?.label ||
    "-- كل الحالات --";
  return (
    <section className="my-8 text-center">
      <input
        type="text"
        placeholder="ابحث عن حالة (مثال: نزيف)"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-1/2 p-4 text-[16px] rounded-[15px] border-2 border-gray-300 outline-none transition duration-200 ease-in-out focus:border-red-500 focus:shadow-[0_3px_13px_rgba(255,1,1,0.34)]"
      />

      <div className="list flex justify-center items-center flex-wrap gap-2 mt-4">
        <p className="my-4 text-[1.2rem] font-semibold">اختر من القائمة</p>
        <div className="relative m-1 inline-block text-left">
          <button
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            className="inline-flex items-center gap-x-1.5 rounded-[15px] bg-white px-3 py-3 text-sm font-semibold text-gray-800 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 cursor-pointer hover:cursor-pointer"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
          >
            <span className="min-w-40 text-right">{currentLabel}</span>
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
              className="-mr-1 h-5 w-5 text-gray-500"
            >
              <path
                d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                clipRule="evenodd"
                fillRule="evenodd"
              />
            </svg>
          </button>
          {isOpen && (
            <div
              className="absolute left-0 z-20 mt-2 w-64 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 transition transform"
              role="listbox"
            >
              <button
                className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer hover:cursor-pointer"
                onClick={() => {
                  setSelected("");
                  setIsOpen(false);
                }}
                role="option"
                aria-selected={selected === ""}
              >
                -- كل الحالات --
              </button>
              {groups.map((group) => (
                <div key={group.label} className="py-1">
                  <div className="px-4 pb-1 text-[12px] font-semibold text-gray-400">
                    {group.label}
                  </div>
                  {group.options.map((opt) => (
                    <button
                      key={opt.value}
                      className={`block w-full text-right px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer hover:cursor-pointer ${
                        selected === opt.value
                          ? "text-red-600 font-semibold"
                          : "text-gray-700"
                      }`}
                      onClick={() => {
                        setSelected(opt.value);
                        setIsOpen(false);
                      }}
                      role="option"
                      aria-selected={selected === opt.value}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
