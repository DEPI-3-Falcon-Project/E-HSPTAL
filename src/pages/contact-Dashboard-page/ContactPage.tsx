import React, { useState, useEffect, Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  FaHospitalAlt,
  FaAmbulance,
  FaShieldAlt,
  FaFireExtinguisher,
  FaCarCrash,
  FaPhone,
  FaMapMarkerAlt,
  FaDirections,
  FaExclamationTriangle,
  FaQuestionCircle,
  FaLightbulb,
  FaCloudUploadAlt,
  FaPaperPlane,
  FaTimes,
  FaCheckCircle,
  FaExclamationCircle,
  FaChevronDown,
} from "react-icons/fa";
import {
  ProblemReport,
  EmergencyCenter,
  Suggestion,
  ProblemType,
  ContactType,
} from "../../types";

const ContactPage: React.FC = () => {
  const [problemForm, setProblemForm] = useState<ProblemReport>({
    fullName: "",
    contactType: "email",
    contact: "",
    problemType: "website",
    description: "",
  });
  const [selectedProblemType, setSelectedProblemType] =
    useState<ProblemType | null>(null);
  const [contactValidation, setContactValidation] = useState<{
    isValid: boolean;
    message: string;
  }>({ isValid: false, message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showEmergencySuggestion, setShowEmergencySuggestion] = useState(false);
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [suggestionForm, setSuggestionForm] = useState<Suggestion>({
    type: "hospital",
    title: "",
    details: "",
    location: "",
  });
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentPreview, setAttachmentPreview] = useState<string>("");

  const problemTypes = [
    {
      type: "website" as ProblemType,
      icon: FaHospitalAlt,
      label: "مشكلة في الموقع",
    },
    {
      type: "emergency" as ProblemType,
      icon: FaExclamationCircle,
      label: "مشكلة طارئة",
    },
    { type: "other" as ProblemType, icon: FaQuestionCircle, label: "أخرى" },
  ];

  const emergencyCenters: EmergencyCenter[] = [
    {
      name: "مستشفى القصر العيني",
      type: "مستشفى",
      distance: "2.5 كم",
      time: "8 دقائق",
      phone: "0223654321",
    },
    {
      name: "نقطة إسعاف التحرير",
      type: "إسعاف",
      distance: "1.2 كم",
      time: "4 دقائق",
      phone: "123",
    },
    {
      name: "قسم شرطة قصر النيل",
      type: "شرطة",
      distance: "0.8 كم",
      time: "3 دقائق",
      phone: "122",
    },
  ];

  const faqItems = [
    {
      question: "إزاي أبلغ عن مشكلة بسرعة؟",
      answer:
        "يمكنك الإبلاغ عن أي مشكلة من خلال ملء النموذج أعلاه. اختر نوع المشكلة، اكتب وصفاً مختصراً، وأرفق صورة إذا أردت. سنتواصل معك فوراً.",
      icon: FaExclamationTriangle,
    },
    {
      question: "إزاي أشارك موقعي مع فريق الطوارئ؟",
      answer:
        "عند الإبلاغ عن مشكلة طارئة، الموقع سيطلب إذنك لتحديد موقعك الحالي. يمكنك أيضاً مشاركة الموقع عبر WhatsApp أو إرسال رابط الموقع مباشرة.",
      icon: FaMapMarkerAlt,
    },
    {
      question: "إزاي أستخدم الموقع لأول مرة؟",
      answer:
        'الموقع سهل الاستخدام! ابدأ من الصفحة الرئيسية للبحث عن المستشفيات، أو استخدم صفحة "اتصل بنا" للإبلاغ عن المشاكل أو الحصول على أرقام الطوارئ.',
      icon: FaQuestionCircle,
    },
    {
      question: "أعمل إيه لو الموقع مش قادر يحدد موقعي؟",
      answer:
        "تأكد من تفعيل خدمة الموقع في المتصفح. إذا لم تنجح، يمكنك كتابة عنوانك يدوياً في نموذج الإبلاغ أو البحث عن أقرب مستشفى بالاسم.",
      icon: FaMapMarkerAlt,
    },
  ];

  const suggestionTypes = [
    {
      type: "hospital" as const,
      icon: FaHospitalAlt,
      title: "إضافة مستشفى جديد",
      description: "اقترح إضافة مستشفى أو مركز طبي في منطقتك",
    },
    {
      type: "ambulance" as const,
      icon: FaAmbulance,
      title: "نقطة إسعاف جديدة",
      description: "اقترح إضافة نقطة إسعاف في منطقة تحتاج تغطية",
    },
    {
      type: "improvement" as const,
      icon: FaLightbulb,
      title: "تحسين الموقع",
      description: "اقترح ميزة جديدة أو تحسين في واجهة الموقع",
    },
  ];

  useEffect(() => {
    // Request location permission
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          // Location obtained but not stored
        },
        () => {
          console.log("Location access denied or unavailable");
        }
      );
    }
  }, []);

  const validateContactInput = (value: string, type: ContactType) => {
    if (!value) return { isValid: false, message: "" };

    if (type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValid = emailRegex.test(value);
      return {
        isValid,
        message: isValid
          ? "بريد إلكتروني صحيح"
          : "بريد إلكتروني غير صحيح (مثال: user@example.com)",
      };
    } else if (type === "phone") {
      const cleanPhone = value.replace(/[\s\-\(\)]/g, "");
      const phoneRegex = /^(\+20|0)?1[0-9]{9}$|^\+[1-9]\d{1,14}$/;
      const isValid = phoneRegex.test(cleanPhone);

      if (isValid) {
        const phoneDigits = cleanPhone.replace(/^(\+20|0)?/, "");
        const hasRepeatedDigits = /^(.)\1{6,}$/.test(phoneDigits);
        if (hasRepeatedDigits) {
          return {
            isValid: false,
            message: "رقم الهاتف لا يمكن أن يكون أرقام متكررة",
          };
        }
        if (phoneDigits.length < 10) {
          return {
            isValid: false,
            message: "رقم الهاتف قصير جداً (على الأقل 10 أرقام)",
          };
        }
        return { isValid: true, message: "رقم هاتف صحيح" };
      }
      return {
        isValid: false,
        message: "رقم هاتف غير صحيح (مثال: 01012345678 أو +201012345678)",
      };
    }

    return { isValid: false, message: "" };
  };

  const handleFileSelect = (file: File | null) => {
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      showAlert(
        "نوع الملف غير مدعوم. الأنواع المسموحة: صور، PDF، Word، Excel، نصوص",
        "error"
      );
      return;
    }

    if (file.size > maxSize) {
      showAlert("حجم الملف يتجاوز 10MB", "error");
      return;
    }

    setAttachment(file);
    setAttachmentPreview(file.name);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const clearAttachment = () => {
    setAttachment(null);
    setAttachmentPreview("");
    const fileInput = document.getElementById("attachment") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleContactTypeChange = (type: ContactType) => {
    setProblemForm({ ...problemForm, contactType: type, contact: "" });
    setContactValidation({ isValid: false, message: "" });
  };

  const handleContactInputChange = (value: string) => {
    setProblemForm({ ...problemForm, contact: value });
    const validation = validateContactInput(value, problemForm.contactType);
    setContactValidation(validation);
  };

  const handleProblemTypeSelect = (type: ProblemType) => {
    setSelectedProblemType(type);
    setProblemForm({ ...problemForm, problemType: type });

    if (type === "emergency") {
      setShowEmergencySuggestion(true);
    } else {
      setShowEmergencySuggestion(false);
    }
  };

  const handleSubmitProblem = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !problemForm.fullName ||
      !problemForm.contact ||
      !problemForm.description ||
      !selectedProblemType
    ) {
      showAlert("يرجى ملء جميع الحقول المطلوبة", "error");
      return;
    }

    if (!contactValidation.isValid) {
      showAlert("يرجى إدخال معلومات التواصل الصحيحة", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      // تحويل البيانات إلى نموذج FormData لإرسال الملف
      const formData = new FormData();
      formData.append("name", problemForm.fullName);
      formData.append(
        "email",
        problemForm.contactType === "email" ? problemForm.contact : ""
      );
      formData.append(
        "phone",
        problemForm.contactType === "phone" ? problemForm.contact : ""
      );
      formData.append("contactType", problemForm.contactType);

      const problemTypeLabels: Record<ProblemType, string> = {
        website: "مشكلة في الموقع",
        emergency: "مشكلة طارئة",
        other: "أخرى",
      };

      formData.append(
        "subject",
        `${problemTypeLabels[selectedProblemType!]} - ${problemForm.fullName}`
      );
      formData.append("message", problemForm.description);

      // Add file if exists
      if (attachment) {
        formData.append("attachment", attachment);
      }

      const response = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "حدث خطأ في إرسال الرسالة");
      }

      setIsSubmitting(false);
      setShowSuccessModal(true);
      setProblemForm({
        fullName: "",
        contactType: "email",
        contact: "",
        problemType: "website",
        description: "",
      });
      setSelectedProblemType(null);
      setShowEmergencySuggestion(false);
      setContactValidation({ isValid: false, message: "" });
      clearAttachment();
    } catch (error: any) {
      setIsSubmitting(false);
      showAlert(
        error.message || "حدث خطأ في إرسال الرسالة. يرجى المحاولة مرة أخرى",
        "error"
      );
    }
  };

  const handleSuggestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!suggestionForm.title || !suggestionForm.details) {
      showAlert("يرجى ملء جميع الحقول المطلوبة", "error");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      showAlert(
        "تم إرسال اقتراحك بنجاح! شكراً لمساهمتك في تطوير الموقع",
        "success"
      );
      setSuggestionForm({
        type: "hospital",
        title: "",
        details: "",
        location: "",
      });
      setShowFeedbackForm(false);
    }, 2000);
  };

  const showAlert = (
    message: string,
    type: "success" | "error" | "info" = "info"
  ) => {
    // Create alert element
    const alert = document.createElement("div");
    alert.className = `fixed top-24 right-5 z-50 max-w-md p-4 rounded-lg shadow-lg animate-slide-in-right`;

    const colors = {
      success: "bg-green-100 text-green-800 border border-green-200",
      error: "bg-red-100 text-red-800 border border-red-200",
      info: "bg-blue-100 text-blue-800 border border-blue-200",
    };

    alert.innerHTML = `
      <div class="flex items-center gap-3">
        <FaCheckCircle class="text-xl" />
        <span class="flex-1">${message}</span>
        <button onclick="this.parentElement.parentElement.remove()" class="text-gray-400 hover:text-gray-600">
          <FaTimes />
        </button>
      </div>
    `;

    alert.className += ` ${colors[type]}`;

    document.body.appendChild(alert);

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (alert.parentElement) {
        alert.remove();
      }
    }, 5000);
  };

  const getDirections = (locationName: string) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      locationName
    )}`;
    window.open(url, "_blank");
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-linear-to-r from-red-600 to-red-700 text-white py-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-full bg-red-600/10"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-5 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-shadow-lg">
            اتصل بنا
          </h1>
          <p className="text-xl mb-8 opacity-90">
            نحن هنا لمساعدتك في أي وقت - أبلغ عن مشكلة أو احصل على المساعدة
            الطارئة
          </p>

          {/* Emergency Quick Access */}
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="tel:123"
              className="flex justify-center items-center gap-2 bg-opacity-20 text-white border-2 border-white border-opacity-30 px-4 py-3 rounded-full font-medium transition-all duration-300 w-[165px] hover:bg-white hover:text-red-600 hover:-translate-y-0.5 hover:cursor-pointer"
            >
              <FaAmbulance className="text-xl" />
              <span>إسعاف 123</span>
            </a>
            <a
              href="tel:122"
              className="flex justify-center items-center gap-2 bg-opacity-20 text-white border-2 border-white border-opacity-30 px-4 py-3 rounded-full font-medium transition-all duration-300 w-[165px] hover:bg-white hover:text-red-600 hover:-translate-y-0.5 hover:cursor-pointer"
            >
              <FaShieldAlt className="text-xl" />
              <span>شرطة 122</span>
            </a>
            <a
              href="tel:180"
              className="flex justify-center items-center gap-2 bg-opacity-20 text-white border-2 border-white border-opacity-30 px-4 py-3 rounded-full font-medium transition-all duration-300 w-[165px] hover:bg-white hover:text-red-600 hover:-translate-y-0.5 hover:cursor-pointer"
            >
              <FaFireExtinguisher className="text-xl" />
              <span>حريق 180</span>
            </a>
          </div>
        </div>
      </section>

      {/* Problem Report Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-5">
          <div className="text-center mb-12">
            <h2 className="text-red-600 text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
              <FaExclamationTriangle className="text-red-600" />
              الإبلاغ عن مشكلة
            </h2>
            <p className="text-gray-600 text-lg">
              أبلغنا عن أي مشكلة تواجهها وسنتواصل معك فوراً
            </p>
          </div>

          <form
            onSubmit={handleSubmitProblem}
            className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  الاسم بالكامل *
                </label>
                <input
                  type="text"
                  value={problemForm.fullName}
                  onChange={(e) =>
                    setProblemForm({ ...problemForm, fullName: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-600 focus:outline-none focus:shadow-none transition-all duration-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  نوع التواصل *
                </label>
                <Menu as="div" className="relative w-full text-right">
                  <Menu.Button className="inline-flex w-full justify-between items-center gap-x-1.5 rounded-xl bg-white px-4 py-3 text-sm font-medium text-gray-700 border-2 border-gray-200 hover:cursor-pointer hover:border-gray-300 transition-all duration-300 focus:border-red-600 focus:outline-none">
                    {problemForm.contactType === "email"
                      ? "البريد الإلكتروني"
                      : "رقم الهاتف"}
                    <FaChevronDown
                      className="h-4 w-4 text-gray-500"
                      aria-hidden="true"
                    />
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-full origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => handleContactTypeChange("email")}
                              className={`${
                                active
                                  ? "bg-red-50 text-red-600"
                                  : "text-gray-700"
                              } block w-full px-4 py-3 text-right text-sm`}
                            >
                              البريد الإلكتروني
                            </button>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => handleContactTypeChange("phone")}
                              className={`${
                                active
                                  ? "bg-red-50 text-red-600"
                                  : "text-gray-700"
                              } block w-full px-4 py-3 text-right text-sm`}
                            >
                              رقم الهاتف
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>

            {problemForm.contactType && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {problemForm.contactType === "email"
                    ? "البريد الإلكتروني *"
                    : "رقم الهاتف *"}
                </label>
                <input
                  type={problemForm.contactType === "email" ? "email" : "tel"}
                  value={problemForm.contact}
                  onChange={(e) => handleContactInputChange(e.target.value)}
                  placeholder={
                    problemForm.contactType === "email"
                      ? "example@email.com"
                      : "01xxxxxxxxx أو +20xxxxxxxxxx"
                  }
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:shadow-none transition-all duration-300 ${
                    contactValidation.isValid
                      ? "border-green-500 bg-green-50"
                      : contactValidation.message && !contactValidation.isValid
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 focus:border-red-600"
                  }`}
                  required
                />
                {contactValidation.message && (
                  <div
                    className={`mt-2 text-sm flex items-center gap-2 ${
                      contactValidation.isValid
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {contactValidation.isValid ? (
                      <FaCheckCircle />
                    ) : (
                      <FaExclamationCircle />
                    )}
                    {contactValidation.message}
                  </div>
                )}
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                نوع المشكلة *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {problemTypes.map((type) => (
                  <div
                    key={type.type}
                    onClick={() => handleProblemTypeSelect(type.type)}
                    className={`flex flex-col items-center p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:-translate-y-1 ${
                      selectedProblemType === type.type
                        ? "border-red-600 bg-red-50 text-red-600"
                        : "border-gray-200 bg-gray-50 hover:border-gray-300"
                    }`}
                  >
                    <type.icon className="text-3xl mb-3" />
                    <span className="font-semibold text-center">
                      {type.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                وصف المشكلة *
              </label>
              <textarea
                value={problemForm.description}
                onChange={(e) =>
                  setProblemForm({
                    ...problemForm,
                    description: e.target.value,
                  })
                }
                rows={4}
                placeholder="اكتب وصفاً مختصراً للمشكلة..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-600 focus:outline-none focus:shadow-none transition-all duration-300 resize-none"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                رفع صورة أو ملف (اختياري)
              </label>
              <input
                type="file"
                className="hidden"
                id="attachment"
                accept="image/*,.pdf,.doc,.docx,.txt,.xls,.xlsx"
                onChange={handleFileInputChange}
              />
              <label htmlFor="attachment" className="block cursor-pointer">
                <div
                  className="border-2 border-dashed border-red-600 rounded-xl p-8 text-center bg-red-50 hover:bg-red-100 transition-all duration-300"
                  onDrop={handleFileDrop}
                  onDragOver={handleDragOver}
                >
                  <FaCloudUploadAlt className="text-3xl text-red-600 mx-auto mb-3" />
                  <span className="text-gray-600 font-medium block mb-2">
                    اختر ملف أو اسحبه هنا
                  </span>
                  <span className="text-xs text-gray-500">
                    الأنواع المدعومة: صور، PDF، Word، Excel، نصوص (أقصى حجم:
                    10MB)
                  </span>
                </div>
              </label>

              {attachmentPreview && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="text-green-600" />
                    <span className="text-green-800 font-medium">
                      {attachmentPreview}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={clearAttachment}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    <FaTimes />
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-linear-to-r from-red-600 to-red-700 text-white py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:cursor-pointer hover:-translate-y-1 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
                <div className="loading"></div>
              ) : (
                <>
                  <FaPaperPlane />
                  إرسال المشكلة
                </>
              )}
            </button>
          </form>

          {/* Emergency Suggestion */}
          {showEmergencySuggestion && (
            <div className="mt-8 p-6 bg-linear-to-r from-yellow-50 to-orange-50 rounded-2xl border-l-4 border-orange-500">
              <h3 className="text-xl font-bold text-orange-800 mb-4 flex items-center gap-2">
                <FaMapMarkerAlt />
                أقرب مراكز الطوارئ
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {emergencyCenters.map((center, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-xl shadow-md"
                  >
                    <h4 className="font-semibold text-gray-800 mb-2">
                      {center.name}
                    </h4>
                    <p className="text-sm text-gray-600 mb-3 flex items-center gap-2">
                      <FaMapMarkerAlt />
                      {center.distance} - {center.time}
                    </p>
                    <div className="flex gap-2">
                      <a
                        href={`tel:${center.phone}`}
                        className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
                      >
                        <FaPhone />
                        اتصال
                      </a>
                      <button
                        onClick={() => getDirections(center.name)}
                        className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                      >
                        <FaDirections />
                        الاتجاهات
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Emergency Numbers Section */}
      <section className="py-16 bg-linear-to-br from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-12">
            <h2 className="text-red-600 text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
              <FaPhone />
              أرقام الطوارئ السريعة
            </h2>
            <p className="text-gray-600 text-lg">اتصل مباشرة بخدمات الطوارئ</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                icon: FaAmbulance,
                title: "الإسعاف",
                number: "123",
                color: "red",
                href: "tel:123",
              },
              {
                icon: FaShieldAlt,
                title: "الشرطة",
                number: "122",
                color: "blue",
                href: "tel:122",
              },
              {
                icon: FaFireExtinguisher,
                title: "الحماية المدنية",
                number: "180",
                color: "orange",
                href: "tel:180",
              },
              {
                icon: FaCarCrash,
                title: "المرور",
                number: "128",
                color: "green",
                href: "tel:128",
              },
            ].map((service, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-t-4 border-red-600"
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center text-white text-2xl bg-linear-to-r from-red-600 to-red-700">
                  <service.icon />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {service.title}
                </h3>
                <div className="text-3xl font-bold text-red-600 mb-4">
                  {service.number}
                </div>
                <div className="space-y-2">
                  <a
                    href={service.href}
                    className="block w-full bg-red-600 text-white py-2 rounded-full font-semibold hover:bg-red-700 transition-colors"
                  >
                    <FaPhone className="inline ml-2" />
                    اتصال فوري
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-5">
          <div className="text-center mb-12">
            <h2 className="text-red-600 text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
              <FaQuestionCircle />
              الأسئلة الشائعة
            </h2>
            <p className="text-gray-600 text-lg">
              إجابات على أكثر الأسئلة شيوعاً حول استخدام الموقع
            </p>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div
                  onClick={() =>
                    setActiveFAQ(activeFAQ === index ? null : index)
                  }
                  className="p-6 cursor-pointer flex items-center gap-4 bg-white hover:bg-red-50 transition-all duration-300"
                >
                  <item.icon className="text-red-600 text-xl" />
                  <span className="flex-1 font-semibold text-gray-800">
                    {item.question}
                  </span>
                  <FaChevronDown
                    className={`text-gray-400 transition-transform duration-300 ${
                      activeFAQ === index ? "rotate-180" : ""
                    }`}
                  />
                </div>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    activeFAQ === index
                      ? "max-h-40 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="p-6 bg-gray-50">
                    <p className="text-gray-600 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Suggestions Section */}
      <section className="py-16 bg-linear-to-br from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-12">
            <h2 className=" text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
              <FaLightbulb />
              الاقتراحات والتحسينات
            </h2>
            <p className="text-gray-600 text-lg">
              ساعدنا في تطوير الموقع بأفكارك واقتراحاتك
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {suggestionTypes.map((type, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-t-4 border-red-600 h-full flex flex-col"
              >
                <type.icon className="text-4xl text-red-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {type.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {type.description}
                </p>
                <button
                  onClick={() => {
                    setSuggestionForm({ ...suggestionForm, type: type.type });
                    setShowFeedbackForm(true);
                  }}
                  className="mt-auto bg-linear-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 hover:cursor-pointer hover:-translate-y-1"
                >
                  اقتراح
                </button>
              </div>
            ))}
          </div>

          {/* Feedback Form */}
          {showFeedbackForm && (
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                شاركنا اقتراحك
              </h3>
              <form onSubmit={handleSuggestionSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    عنوان الاقتراح
                  </label>
                  <input
                    type="text"
                    value={suggestionForm.title}
                    onChange={(e) =>
                      setSuggestionForm({
                        ...suggestionForm,
                        title: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-600 focus:outline-none focus:shadow-none transition-all duration-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    تفاصيل الاقتراح
                  </label>
                  <textarea
                    value={suggestionForm.details}
                    onChange={(e) =>
                      setSuggestionForm({
                        ...suggestionForm,
                        details: e.target.value,
                      })
                    }
                    rows={4}
                    placeholder="اكتب تفاصيل اقتراحك هنا..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-600 focus:outline-none focus:shadow-none transition-all duration-300 resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    الموقع (إذا كان مرتبطاً بمكان معين)
                  </label>
                  <input
                    type="text"
                    value={suggestionForm.location}
                    onChange={(e) =>
                      setSuggestionForm({
                        ...suggestionForm,
                        location: e.target.value,
                      })
                    }
                    placeholder="مثال: شارع التحرير، وسط البلد"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-600 focus:outline-none focus:shadow-none transition-all duration-300"
                  />
                </div>

                <div className="flex gap-4 justify-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-linear-to-r from-red-600 to-red-700 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 hover:-translate-y-1 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-3"
                  >
                    {isSubmitting ? (
                      <div className="loading"></div>
                    ) : (
                      <>
                        <FaPaperPlane />
                        إرسال الاقتراح
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowFeedbackForm(false)}
                    className="bg-gray-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-600 transition-all duration-300 hover:-translate-y-1 flex items-center gap-3"
                  >
                    <FaTimes />
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl animate-modal-slide-in">
            <div className="bg-linear-to-r from-red-500 to-red-600 text-white p-6 rounded-t-2xl text-center">
              <FaCheckCircle className="text-4xl mx-auto mb-2" />
              <h3 className="text-xl font-bold">تم الإرسال بنجاح</h3>
            </div>
            <div className="p-6 text-center">
              <p className="text-gray-700">
                تم إرسال المشكلة، هنتواصل معاك فوراً
              </p>
            </div>
            <div className="p-6 text-center">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="bg-linear-to-r from-red-500 to-red-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                حسناً
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default ContactPage;
