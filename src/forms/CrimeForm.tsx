import React, { useState, useRef, useEffect } from "react";
import type { CrimeFormData, ReportData } from "../types";
import FormField from "../components/FormField";
import LocationInput from "../components/LocationInput";

interface CrimeFormProps {
  onSubmit: (data: ReportData) => void;
  onBack: () => void;
}

interface CrimeFormState {
  name: string;
  email: string;
  phone: string;
  location: string;
  description: string;
  crimeType: string;
  otherCrimeType: string;
  place: string;
  otherPlace: string;
  involvedCount: number;
  attachment: string;
}

// --- Reusable Custom Select Component ---
interface CustomSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[] | { category: string; items: { value: string; label: string }[] }[];
  placeholder?: string;
  error?: string;
  required?: boolean;
  showOtherField?: boolean;
  onOtherChange?: (value: string) => void;
  otherPlaceholder?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
  required,
  showOtherField,
  onOtherChange,
  otherPlaceholder,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedLabel = options.some(opt => 'items' in opt)
    ? options.flatMap(opt => 'items' in opt ? opt.items : []).find(item => item.value === value)?.label
    : (options as { value: string; label: string }[]).find(item => item.value === value)?.label;

  const isCategorized = options.length > 0 && 'items' in options[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div
        className={`w-full border ${
          error ? "border-red-500" : "border-gray-300"
        } bg-white rounded-lg px-4 py-2 flex justify-between items-center cursor-pointer focus-within:ring-2 focus-within:ring-red-500 focus-within:border-transparent transition-all`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`${!value ? "text-gray-400" : "text-gray-900"}`}>
          {selectedLabel || placeholder}
        </span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? "transform rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {isCategorized ? (
            (options as { category: string; items: { value: string; label: string }[] }[]).map((group, index) => (
              <div key={index}>
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50 sticky top-0">
                  {group.category}
                </div>
                {group.items.map((item) => (
                  <div
                    key={item.value}
                    className={`px-4 py-2 cursor-pointer hover:bg-red-50 ${value === item.value ? "bg-red-100 text-red-700" : ""}`}
                    onClick={() => {
                      onChange(item.value);
                      setIsOpen(false);
                    }}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            ))
          ) : (
            (options as { value: string; label: string }[]).map((item) => (
              <div
                key={item.value}
                className={`px-4 py-2 cursor-pointer hover:bg-red-50 ${value === item.value ? "bg-red-100 text-red-700" : ""}`}
                onClick={() => {
                  onChange(item.value);
                  setIsOpen(false);
                }}
              >
                {item.label}
              </div>
            ))
          )}
        </div>
      )}

      {showOtherField && value === "other" && (
        <input
          type="text"
          className="mt-2 w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
          placeholder={otherPlaceholder}
          onChange={(e) => onOtherChange?.(e.target.value)}
        />
      )}

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};


const CrimeForm: React.FC<CrimeFormProps> = ({ onSubmit, onBack }) => {
  const [formData, setFormData] = useState<CrimeFormState>({
    name: "",
    email: "",
    phone: "",
    location: "",
    description: "",
    crimeType: "",
    otherCrimeType: "",
    place: "",
    otherPlace: "",
    involvedCount: 0,
    attachment: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    phone: "",
  });

  const handleChange = (
    field: keyof CrimeFormState,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone: string) => {
    const re = /^[\d\s\-\+\(\)]+$/;
    return re.test(phone) && phone.replace(/\D/g, "").length >= 10;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const emailError = !validateEmail(formData.email)
      ? "الرجاء إدخال بريد إلكتروني صحيح"
      : "";
    const phoneError = !validatePhone(formData.phone)
      ? "الرجاء إدخال رقم هاتف صحيح"
      : "";

    setErrors({ email: emailError, phone: phoneError });

    if (emailError || phoneError) {
      return;
    }

    const crimeData: CrimeFormData = {
      crimeType:
        formData.crimeType === "other"
          ? formData.otherCrimeType
          : formData.crimeType,
      place: formData.place === "other" ? formData.otherPlace : formData.place,
      involvedCount: formData.involvedCount,
      attachment: formData.attachment || undefined,
    };

    const reportData: ReportData = {
      name: formData.name,
      contact: `${formData.email}, ${formData.phone}`,
      location: formData.location,
      description: formData.description,
      type: "crime",
      extras: crimeData,
    };

    onSubmit(reportData);
  };

  // Categorized Crime Options
  const crimeOptions = [
    {
      category: "جرائم العنف",
      items: [
        { value: "assault", label: "اعتداء" },
        { value: "domestic_violence", label: "عنف أسري" },
        { value: "sexual_assault", label: "اعتداء جنسي" },
        { value: "physical_abuse", label: "إساءة بدنية" },
      ],
    },
    {
      category: "جرائم ضد فئات معينة",
      items: [
        { value: "child_abuse", label: "إساءة معاملة الأطفال" },
        { value: "elder_abuse", label: "إساءة معاملة كبار السن" },
      ],
    },
    {
      category: "جرائم خطيرة",
      items: [
        { value: "stabbing", label: "طعن" },
        { value: "gunshot_wound", label: "إصابة طلق ناري" },
        { value: "poisoning", label: "تسمم" },
      ],
    },
    {
      category: "أخرى",
      items: [{ value: "other", label: "أخرى" }],
    },
  ];

  // Categorized Place Options
  const placeOptions = [
    {
      category: "أماكن عامة",
      items: [
        { value: "street", label: "الشارع" },
        { value: "park", label: "حديقة" },
      ],
    },
    {
      category: "مؤسسات",
      items: [
        { value: "school", label: "مدرسة" },
        { value: "hospital", label: "مستشفى" },
        { value: "workplace", label: "مكان العمل" },
      ],
    },
    {
      category: "أخرى",
      items: [
        { value: "home", label: "المنزل" },
        { value: "other", label: "أخرى" },
      ],
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
      <FormField
        label="الاسم الكامل"
        value={formData.name}
        onChange={(value) => handleChange("name", value)}
        required
        placeholder="أدخل اسمك الكامل"
      />

      <FormField
        label="البريد الإلكتروني"
        type="email"
        value={formData.email}
        onChange={(value) => handleChange("email", value)}
        required
        placeholder="أدخل بريدك الإلكتروني"
        error={errors.email}
      />

      <FormField
        label="رقم الهاتف"
        value={formData.phone}
        onChange={(value) => handleChange("phone", value)}
        required
        placeholder="أدخل رقم هاتفك"
        error={errors.phone}
      />

      <LocationInput
        value={formData.location}
        onChange={(value) => handleChange("location", value)}
      />

      <FormField
        label="الوصف"
        type="textarea"
        value={formData.description}
        onChange={(value) => handleChange("description", value)}
        required
        placeholder="صف الحادث بالتفصيل"
      />

      {/* Using the new CustomSelect component for Crime Type */}
      <CustomSelect
        label="نوع الجريمة"
        value={formData.crimeType}
        onChange={(value) => handleChange("crimeType", value)}
        options={crimeOptions}
        required
        showOtherField={formData.crimeType === "other"}
        onOtherChange={(value) => handleChange("otherCrimeType", value)}
        otherPlaceholder="يرجى تحديد نوع الجريمة"
      />

      {/* Using the new CustomSelect component for Place */}
      <CustomSelect
        label="مكان الحادث"
        value={formData.place}
        onChange={(value) => handleChange("place", value)}
        options={placeOptions}
        required
        showOtherField={formData.place === "other"}
        onOtherChange={(value) => handleChange("otherPlace", value)}
        otherPlaceholder="يرجى تحديد مكان الحادث"
      />

      <FormField
        label="عدد الأشخاص المتورطين"
        type="number"
        value={formData.involvedCount}
        onChange={(value) => handleChange("involvedCount", value)}
        min="0"
      />

      <FormField
        label="مرفق (اختياري)"
        type="file"
        value={formData.attachment}
        onChange={(value) => handleChange("attachment", value)}
      />

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-xl font-medium hover:bg-gray-300 transition-colors"
        >
          العودة
        </button>

        <button
          type="submit"
          className="flex-1 bg-red-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-red-700 transition-colors"
        >
          إرسال البلاغ
        </button>
      </div>
    </form>
  );
};

export default CrimeForm;