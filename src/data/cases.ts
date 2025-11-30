export interface Case {
  id: string;
  title: string;
  quick: string;
  steps: string;
  img: string;
}

import bone from "../assets/bone.png";
import cutInjury from "../assets/cut injury2.png";
import headInjury from "../assets/head injury2.png";
import dizzy from "../assets/dizzy.png";
import burn from "../assets/burn2.png";
import heartAttack from "../assets/heart-attack.png";
import difficultyBreathing from "../assets/difficulty-breathing.png";
import dust from "../assets/dust.png";
import biting from "../assets/biting.png";
import sick from "../assets/sick.png";
import fall from "../assets/fall.png";
import sick1 from "../assets/sick (1).png";
import fireExtinguisher from "../assets/fire-extinguisher.png";
import bloodLoss from "../assets/blood loss2.png";
import danger from "../assets/danger.png";

export const cases: Case[] = [
  {
    id: "fracture",
    title: "كسور",
    quick: "ثبّت الطرف المصاب.",
    steps: "1. ثبّت الكسر.<br>2. لا تحرك الطرف.<br>3. توجه للطبيب.",
    img: bone,
  },
  {
    id: "wounds",
    title: "جروح ونزيف",
    quick: "اضغط على مكان النزيف.",
    steps: "1. ضع قطعة قماش.<br>2. اضغط بقوة.<br>3. اطلب المساعدة.",
    img: cutInjury,
  },
  {
    id: "head",
    title: "سقوط أو إصابة بالرأس",
    quick: "ثبّت الرأس.",
    steps: "1. اجعل المصاب مستلقي.<br>2. راقب الوعي.<br>3. توجه للطبيب.",
    img: headInjury,
  },
  {
    id: "faint",
    title: "إغماء",
    quick: "ضع الشخص مستلقيًا وارفع رجليه.",
    steps: "1. ضع على ظهره.<br>2. ارفع رجليه.<br>3. راقب التنفس.",
    img: dizzy,
  },
  {
    id: "burn",
    title: "حروق",
    quick: "ضع تحت ماء بارد.",
    steps: "1. اغسل بالماء البارد.<br>2. لا دهون.<br>3. غطِ الحرق.",
    img: burn,
  },
  {
    id: "heart",
    title: "أزمة قلبية",
    quick: "اطلب الإسعاف فورًا.",
    steps: "1. اتصل بالإسعاف.<br>2. اجعل المريض مرتاح.<br>3. أعطه دواءه.",
    img: heartAttack,
  },
  {
    id: "breathing",
    title: "صعوبة في التنفس",
    quick: "اجعله يجلس معتدلاً.",
    steps: "1. اجعله يجلس.<br>2. ساعده.<br>3. اطلب المساعدة.",
    img: difficultyBreathing,
  },
  {
    id: "insect",
    title: "لدغات حشرات",
    quick: "اغسل المكان جيدًا.",
    steps: "1. اغسل.<br>2. ضع كمادات.<br>3. راقب الحساسية.",
    img: dust,
  },
  {
    id: "animal",
    title: "لدغات حيوانات",
    quick: "اغسل مكان العضة.",
    steps: "1. اغسل.<br>2. اعقم.<br>3. توجه للطبيب.",
    img: biting,
  },
  {
    id: "poison",
    title: "تسمم غذائي",
    quick: "لا تجبر على التقيؤ.",
    steps: "1. اجعله يستريح.<br>2. لا تجبر على التقيؤ.<br>3. اطلب المساعدة.",
    img: sick,
  },
  {
    id: "minor-injury",
    title: "سقوط أو إصابة بسيطة",
    quick: "نظف الجرح.",
    steps: "1. نظف.<br>2. ضع ضماد.<br>3. راقب الحالة.",
    img: fall,
  },
  {
    id: "fever",
    title: "حرارة مرتفعة",
    quick: "استخدم كمادات باردة.",
    steps: "1. ضع كمادات.<br>2. أخفف الملابس.<br>3. اعطِ مشروبات.",
    img: sick1,
  },
  {
    id: "fire",
    title: "إطفاء الحريق الصغير",
    quick: "استخدم مطفأة صغيرة.",
    steps: "1. ابتعد عن النار.<br>2. استخدم المطفأة.<br>3. اتصل بالطوارئ.",
    img: fireExtinguisher,
  },
  {
    id: "severe-bleeding",
    title: "النزيف الشديد",
    quick: "اضغط بقوة.",
    steps: "1. ضع قطعة قماش.<br>2. اضغط.<br>3. اطلب المساعدة.",
    img: bloodLoss,
  },
  {
    id: "gas-poison",
    title: "التسمم بالغاز",
    quick: "اترك المكان.",
    steps: "1. اخرج من المكان.<br>2. اتصل بالطوارئ.<br>3. راقب التنفس.",
    img: danger,
  },
];
