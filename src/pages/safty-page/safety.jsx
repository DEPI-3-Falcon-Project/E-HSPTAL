import { useEffect, useState } from "react";
import'./safety.css'
function Safety() {
  const STORAGE_KEY = "daily_challenge_state";
  const REFRESH_HOURS = 24;
  const MAX_POINTS = 100;

   const challenges = {
    home: [
      { title: "أطفئ جميع الأجهزة غير المستخدمة قبل النوم.", icon: "../../../src/assets/002-eco-house.png" },
      { title: "ضع وردة أو رائحة جميلة لتجديد طاقة البيت.", icon: "../../../src/assets/042-flower-pot.png" },
      { title: "افتح النوافذ 15 دقيقة يوميًا للتهوية.", icon: "../../../src/assets/043-window.png" },
      { title: "رتّب السرير فور الاستيقاظ.", icon: "../../../src/assets/029-room-service.png" },
      { title: "خصص سلة لإعادة التدوير أو جمع البلاستيك.", icon: "../../../src/assets/045-waste-bin.png" },
      { title: "رتّب أغراضك بطريقة تمنع الفوضى أو التعثر.", icon: "../../../src/assets/047-data-cleaning.png" },
      { title: "تأكد من أن مطفأة الحريق تعمل.", icon: "../../../src/assets/005-fire-extinguisher.png" },
      { title: "ضع أدوات الإسعاف في مكان يسهل الوصول إليه.", icon: "../../../src/assets/032-first-aid-kit.png" },
    ],
    road: [
      { title: "اربط حزام الأمان دائمًا قبل التحرك.", icon: "../../../src/assets/018-seat.png" },
      { title: "استخدم ممر المشاة فقط.", icon: "../../../src/assets/020-crosswalk.png" },
      { title: "لا تستخدم الهاتف أثناء المشي أو القيادة.", icon: "../../../src/assets/014-avoid-distraction.png" },
      { title: "احترم إشارة المرور مهما كانت الظروف.", icon: "../../../src/assets/019-traffic-light.png" },
      { title: "افحص ضغط اطار السيارة.", icon: "../../../src/assets/036-tire-pressure.png" },
      { title: "لا تتجاوز السرعة المحددة.", icon: "../../../src/assets/008-limit-1.png" },
      { title: "ساعد شخصًا في عبور الطريق بأمان.", icon: "../../../src/assets/021-students.png" },
      { title: "حافظ علي مسافة الأمان.", icon: "../../../src/assets/031-distance.png" },
    ],
    family: [
      { title: "شارك في عمل منزلي بسيط لمساعدة الآخرين.", icon: "../../../src/assets/052-help.png" },
      { title: "اقضِ وقتًا مع طفلك.", icon: "../../../src/assets/054-care.png" },
      { title: "تناول وجبة جماعية بدون تلفاز أو جوال.", icon: "../../../src/assets/056-food.png" },
      { title: "اتصل بصديق قديم.", icon: "../../../src/assets/053-phone-call.png" },
      { title: "ساعد فى نظافة المنزل.", icon: "../../../src/assets/006-clean.png" },
      { title: "لا ترفع صوتك اليوم داخل المنزل.", icon: "../../../src/assets/marketing.png" },
      { title: "نظّم جلسة عائلية.", icon: "../../../src/assets/057-family-1.png" },
      { title: "ابتسم في وجه كل شخص تقابله من عائلتك.", icon: "../../../src/assets/055-smile.png" },
    ],
    faith: [
      { title: "صلِّ الصلوات الخمس في وقتها.", icon: "../../../src/assets/026-prayer.png" },
      { title: "اقرأ وردًا من القرآن.", icon: "../../../src/assets/025-quran.png" },
      { title: "تصدّق ولو بشيء بسيط جدًا.", icon: "../../../src/assets/052-help.png" },
      { title: "استغفر الله 100 مرة خلال اليوم.", icon: "../../../src/assets/058-japa-mala.png" },
      { title: "استيقظ لصلاة الفجر اليوم.", icon: "../../../src/assets/059-prayer-1.png" },
      { title: "اذكر الله قبل النوم بـ “سبحان الله – الحمد لله – الله أكبر”.", icon: "../../../src/assets/039-praying.png" },
      { title: "ادعُ لشخص غائب عنك بخير.", icon: "../../../src/assets/024-pray.png" },
      { title: "سامح شخصًا في قلبك حتى لو لم يعتذر.", icon: "../../../src/assets/054-care.png" },
    ],
    health: [
      { title: "اشرب 8 أكواب ماء.", icon: "../../../src/assets/001-drink-water.png" },
      { title: "نام 8 ساعات متواصلة بانتظام.", icon: "../../../src/assets/011-fatigue.png" },
      { title: "امشِ 20 دقيقة متواصلة.", icon: "../../../src/assets/051-walking.png" },
      { title: "امتنع عن الأكل قبل النوم بساعتين.", icon: "../../../src/assets/048-stop-eating.png" },
      { title: "ابتعد عن الشاشات ساعة قبل النوم.", icon: "../../../src/assets/014-avoid-distraction.png" },
      { title: "خذ 10 دقائق راحة من الشاشات كل ساعتين.", icon: "../../../src/assets/050-seconds.png" },
      { title: "اجلس بطريقة صحيحة أثناء العمل أو الدراسة.", icon: "../../../src/assets/049-chair.png" },
      { title: "مارس تمارين التمدد 5 دقائق صباحًا ومساءً.", icon: "../../../src/assets/015-triangle-1.png" },
    ],
  };

  const [state, setState] = useState(() => loadState());

  const [sectionsVisibility, setSectionsVisibility] = useState({
    home: false,
    road: false,
    family: false,
    faith: false,
    health: false,
  });

  function loadState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return { completed: {}, points: 0, lastReset: Date.now() };
    return JSON.parse(saved);
  }

  function saveState(newState) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  }

  useEffect(() => {
    const now = Date.now();
    if (now - state.lastReset > REFRESH_HOURS * 60 * 60 * 1000) {
      const resetState = { completed: {}, points: 0, lastReset: now };
      setState(resetState);
      saveState(resetState);
    }
  }, []);

  function toggleComplete(title) {
    const done = !!state.completed[title];
    const newState = { ...state, completed: { ...state.completed } };

    if (done) {
      delete newState.completed[title];
      newState.points = Math.max(0, newState.points - 10);
    } else {
      if (newState.points < MAX_POINTS) newState.points += 10;
      newState.completed[title] = true;
    }
    setState(newState);
    saveState(newState);
  }

  const ChallengeSection = ({ section, showAll, onToggleShow }) => {
    const allChallenges = challenges[section];
    // تم حذف const [showAll, setShowAll] = useState(false);
    const list = showAll ? allChallenges : allChallenges.slice(0, 4);

    const sectionNames = {
      home: "المنزل",
      road: "الطريق",
      family: "الأسرة",
      faith: "العبادات",
      health: "الصحة",
    };

    const sectionDesc = {
      home: "حافظ على بيت آمن، منظم، ومريح",
      road: "هدفك توصل بأمان، مش بسرعة",
      family: "أسرتك هي الأمان",
      faith: "غذاء الروح أهم من غذاء الجسد",
      health: "صحتك رأس مالك",
    };

    return (
      <section id={`${section}-section`} className="mb-8">
        <h3 className="mb-3 text-center text-2xl font-bold">تحديات {sectionNames[section]}</h3>
        <h6 className="mb-4 text-center text-sm text-gray-600">{sectionDesc[section]}</h6>

        <div className="grid mb-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {list.map((ch, i) => (
            <div key={i} className="bg-white card text-center justify-content-center shadow-md p-5 rounded-2xl flex flex-col justify-between h-full">
              <div>
                <img src={ch.icon} alt="" className="w-16 h-16 mx-auto mb-3" />
                <h6 className="text-sm font-semibold leading-tight">{ch.title}</h6>
              </div>
              
               
              <button
                className={`btn mt-4 py-2 px-4 rounded-xl text-sm text-white ${
               state.completed[ch.title] ? "completed" : ""
               }`}
               onClick={() => toggleComplete(ch.title)}
               >
                {state.completed[ch.title] ? "تم الإتمام" : "تم"}
               </button>

            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            className="my-5 mb-10 py-3 px-6 btn-more text-white rounded-xl"
            onClick={() => onToggleShow(section)} // نمرر اسم القسم لتحديث حالته
          >
            {showAll ? "عرض أقل" : "عرض المزيد"}
          </button>
        </div>
      </section>
    );
  };

  const handleToggleSection = (sectionName) => {
    setSectionsVisibility(prevState => ({
      ...prevState,
      [sectionName]: !prevState[sectionName]
    }));
  };

  return (
    <div className="w-full px-4 md:px-12 lg:px-24" dir="rtl" lang="ar">
      <nav className="py-6 mb-8 mt-20  rounded-2xl px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="navbar-brand text-3xl font-bold ">التحديات اليومية</h1>

          <ul className=" flex flex-wrap justify-center gap-6 text-lg mt-3">
            <li><a className="nav-link " href="#home">المنزل</a></li>
            <li><a className="nav-link" href="#road">الطريق</a></li>
            <li><a className="nav-link" href="#family">الأسرة</a></li>
            <li><a className="nav-link" href="#faith">العبادات</a></li>
            <li><a className="nav-link" href="#health">الصحة</a></li>
          </ul>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto text-center mb-10">
        <h4 className="text-xl poin font-bold">
          إجمالي النقاط: <span>{state.points}</span> / {MAX_POINTS}
        </h4>

        <div className="w-full  progress rounded h-4 mt-3 overflow-hidden">
          <div
            className="h-4 rounded transition-all duration-300"
            style={{ width: `${(state.points / MAX_POINTS) * 100}%`, backgroundColor: '#10b981' }}
          ></div>
        </div>
      </div>

      <div id="home"><ChallengeSection section="home" showAll={sectionsVisibility.home} onToggleShow={handleToggleSection} /></div>
      <div className="my-10 border-t"></div>

      <div id="road"><ChallengeSection section="road" showAll={sectionsVisibility.road} onToggleShow={handleToggleSection} /></div>
      <div className="my-10 border-t"></div>

      <div id="family"><ChallengeSection section="family" showAll={sectionsVisibility.family} onToggleShow={handleToggleSection} /></div>
      <div className="my-10 border-t"></div>

      <div id="faith"><ChallengeSection section="faith" showAll={sectionsVisibility.faith} onToggleShow={handleToggleSection} /></div>
      <div className="my-10 border-t"></div>

      <div id="health"><ChallengeSection section="health" showAll={sectionsVisibility.health} onToggleShow={handleToggleSection} /></div>
      <div className="my-10 border-t"></div>

      
      <div className="max-w-5xl mx-auto text-center my-8">
        {/* ... (باقي كود المصادر لم يتغير) */}
      </div>
    </div>
  );
}

export default Safety;