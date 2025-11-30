import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import type { ReportData } from "../../types";
import CrimeForm from "../../forms/CrimeForm";
import AccidentForm from "../../forms/AccidentForm";
import HealthForm from "../../forms/HealthForm";
import MissingForm from "../../forms/MissingForm";
import HelpForm from "../../forms/HelpForm";
import ConfirmModal from "../../components/ConfirmModal";
import { toBibtex } from "../../utils/bibtex";

const ReportFormPage: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);

  const pageVariants = {
    initial: { opacity: 0, x: 20 }, // Adjusted for RTL
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -20 }, // Adjusted for RTL
  };

  const pageTransition = {
    type: "tween" as const,
    ease: "anticipate" as const,
    duration: 0.5,
  };

  const getFormTitle = () => {
    switch (type) {
      case "crime":
        return "بلاغ ⬅ جريمة وعنف";
      case "accident":
        return "بلاغ ⬅ حادث";
      case "health":
        return "بلاغ ⬅ صحة عامة";
      case "missing":
        return "بلاغ ⬅ شخص مفقود";
      case "help":
        return "بلاغ ⬅ مساعدة عاجلة";
      default:
        return "بلاغ طارئ";
    }
  };

  const handleBack = () => {
    navigate("/report");
  };

  const handleSubmit = (data: ReportData) => {
    setReportData(data);
    setIsModalOpen(true);
  };

  const handleConfirm = (data: ReportData) => {
    const bibtex = toBibtex(data);
    console.log("BibTeX format:", bibtex);
    // In a real app, you would send this to your backend
    alert("تم إرسال البلاغ بنجاح!");
    setIsModalOpen(false);
    navigate("/report");
  };

  const handleEdit = () => {
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const renderForm = () => {
    switch (type) {
      case "crime":
        return <CrimeForm onSubmit={handleSubmit} onBack={handleBack} />;
      case "accident":
        return <AccidentForm onSubmit={handleSubmit} onBack={handleBack} />;
      case "health":
        return <HealthForm onSubmit={handleSubmit} onBack={handleBack} />;
      case "missing":
        return <MissingForm onSubmit={handleSubmit} onBack={handleBack} />;
      case "help":
        return <HelpForm onSubmit={handleSubmit} onBack={handleBack} />;
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              نوع بلاغ غير صالح
            </h2>
            <button
              onClick={handleBack}
              className="bg-red-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              العودة للرئيسية
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen py-8 my-20 px-4 bg-transparent" dir="rtl">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
        >
          <div className="bg-white/25 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex items-center mb-6">
              <button
                onClick={handleBack}
                className="ml-4 text-gray-500 hover:text-gray-700" // Changed mr-4 to ml-4
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 transform scale-x-[-1]" // Flipped the icon
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                {getFormTitle()}
              </h1>
            </div>

            {renderForm()}
          </div>
        </motion.div>

        {reportData && (
          <ConfirmModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onEdit={handleEdit}
            onConfirm={handleConfirm}
            data={reportData}
          />
        )}
      </div>
    </div>
  );
};

export default ReportFormPage;