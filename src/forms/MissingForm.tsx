import React, { useState, useRef, useEffect } from "react";
import type { MissingFormData, ReportData } from "../types";
import FormField from "../components/FormField";
import LocationInput from "../components/LocationInput";

interface MissingFormProps {
  onSubmit: (data: ReportData) => void;
  onBack: () => void;
}

interface MissingFormState {
  name: string;
  email: string;
  phone: string;
  location: string;
  description: string;
  missingName: string;
  age: string;
  gender: string;
  lastSeenPlace: string;
  photo: string;
  caregiverName: string;
  caregiverContact: string;
}

// --- Custom Select Component (نفس المكون من المثال السابق) ---
interface CustomSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[] | { category: string; items: { value: string; label: string }[] }[];
  placeholder?: string;
  error?: string;
  required?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
  required,
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

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};


const MissingForm: React.FC<MissingFormProps> = ({ onSubmit, onBack }) => {
  const [formData, setFormData] = useState<MissingFormState>({
    name: "",
    email: "",
    phone: "",
    location: "",
    description: "",
    missingName: "",
    age: "",
    gender: "",
    lastSeenPlace: "",
    photo: "",
    caregiverName: "",
    caregiverContact: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    phone: "",
  });

  const handleChange = (
    field: keyof MissingFormState,
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

    // Validate email and phone
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

    // Create MissingFormData object from form state
    const missingData: MissingFormData = {
      missingName: formData.missingName,
      age: formData.age,
      gender: formData.gender,
      lastSeenPlace: formData.lastSeenPlace,
      photo: formData.photo || undefined,
      caregiverName: formData.caregiverName || undefined,
      caregiverContact: formData.caregiverContact || undefined,
    };

    const reportData: ReportData = {
      name: formData.name,
      contact: `${formData.email}, ${formData.phone}`,
      location: formData.location,
      description: formData.description,
      type: "missing",
      extras: missingData,
    };

    onSubmit(reportData);
  };

  const genderOptions = [
    { value: "male", label: "ذكر" },
    { value: "female", label: "أنثى" },
    { value: "other", label: "أخرى" },
    { value: "prefer_not_to_say", label: "أفضل عدم الإفصاح" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
      <FormField
        label="اسمك الكامل"
        value={formData.name}
        onChange={(value) => handleChange("name", value)}
        required
        placeholder="أدخل اسمك الكامل"
      />

      <FormField
        label="بريدك الإلكتروني"
        type="email"
        value={formData.email}
        onChange={(value) => handleChange("email", value)}
        required
        placeholder="أدخل بريدك الإلكتروني"
        error={errors.email}
      />

      <FormField
        label="رقم هاتفك"
        value={formData.phone}
        onChange={(value) => handleChange("phone", value)}
        required
        placeholder="أدخل رقم هاتفك"
        error={errors.phone}
      />

      <FormField
        label="اسم الشخص المفقود"
        value={formData.missingName}
        onChange={(value) => handleChange("missingName", value)}
        required
        placeholder="أدخل اسم الشخص المفقود"
      />

      <FormField
        label="العمر"
        type="number"
        value={formData.age}
        onChange={(value) => handleChange("age", value)}
        required
        placeholder="أدخل العمر"
        min="0"
      />

      {/* Using the new CustomSelect component for Gender */}
      <CustomSelect
        label="الجنس"
        value={formData.gender}
        onChange={(value) => handleChange("gender", value)}
        options={genderOptions}
        required
        placeholder="اختر الجنس"
      />

      <FormField
        label="آخر مكان تمت رؤيته فيه"
        value={formData.lastSeenPlace}
        onChange={(value) => handleChange("lastSeenPlace", value)}
        required
        placeholder="أين شوهد الشخص آخر مرة؟"
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
        placeholder="قدم تفاصيل عن الشخص، الملابس، وقت الاختفاء، إلخ."
      />

      <FormField
        label="صورة (اختياري)"
        type="file"
        value={formData.photo}
        onChange={(value) => handleChange("photo", value)}
      />

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          معلومات ولي الأمر أو الوصي
        </h3>

        <FormField
          label="اسم ولي الأمر/الوصي"
          value={formData.caregiverName}
          onChange={(value) => handleChange("caregiverName", value)}
          placeholder="أدخل اسم ولي الأمر  أو الوصي"
        />

        <FormField
          label="بيانات الاتصال بولي الأمر/الوصي"
          value={formData.caregiverContact}
          onChange={(value) => handleChange("caregiverContact", value)}
          placeholder="رقم هاتف أو بريد إلكتروني  ولي الأمر أو الوصي"
        />
      </div>

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

export default MissingForm;