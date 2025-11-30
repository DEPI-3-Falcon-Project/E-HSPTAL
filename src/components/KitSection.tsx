import bandage from "../assets/bandage.png";
import disinfect from "../assets/disinfect.png";
import handGloves from "../assets/hand-gloves.png";
import gauze from "../assets/gauze.png";
import surgicalScissors from "../assets/surgical-scissors.png";
import medical from "../assets/medical.png";
import medical1 from "../assets/medical1.png";
import firstAidKit from "../assets/first-aid-kit.gif";
import cottonBuds from "../assets/cotton-buds.png";

export default function KitSection() {
  const items = [
    { name: "بلاستر طبي", img: bandage },
    { name: "كحول مطهر", img: disinfect },
    { name: "قفازات طبية", img: handGloves },
    { name: "شاش معقم", img: gauze },
    { name: "مقص طبي", img: surgicalScissors },
    { name: "ميزان حرارة", img: medical },
    { name: "دفتر أرقام طوارئ", img: medical1 },
    { name: "قطن مبلل", img: cottonBuds },
  ];

  return (
    <section className="bg-white py-12 mt-10">
      <div className="flex justify-center items-center gap-3">
        <img
          src={firstAidKit}
          alt="logo"
          width={100}
        />
        <h2 className="text-4xl sm:text-3xl md:text-5xl font-bold text-[#d62828] mb-6 mt-4">
          حقيبة الإسعافات الأولية
        </h2>
      </div>
      <p className="mr-10 text-[#777] text-[1.2rem] md:text-[1rem] sm:text-[0.9rem] font-semibold">
        وجود حقيبة إسعافات أولية مجهّزة قد ينقذ حياة شخص في لحظة طارئة❤️.
      </p>

      <div className="container mx-auto px-10 mt-10">
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-4">
          {items.map((item) => (
            <div
              key={item.name}
              className="item bg-white p-4 rounded-2xl text-center font-bold border-t-4 border-[#d62828]
                       shadow-md transition-transform duration-600 ease-out hover:-translate-y-1 hover:shadow-[0_4px_15px_rgba(255,1,1,0.34)]"
            >
              <img
                src={item.img}
                alt={item.name}
                className="h-[150px] w-[150px] p-1 mx-auto"
              />
              <p className="font-bold my-6 text-[#d62828]">{item.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
