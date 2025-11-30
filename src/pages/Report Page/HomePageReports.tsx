import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HomePage: React.FC = () => {
  const reportTypes = [
    {
      type: 'crime',
      title: 'الجرائم والعنف',
      description: 'الإبلاغ عن السرقة، الاعتداء، السطو، وغيرها من الأنشطة الإجرامية',
      examples: 'سرقة، اعتداء، اقتحام...',
      icon: '🚨',
      color: 'bg-red-100',
      textColor: 'text-red-800',
    },
    {
      type: 'accident',
      title: 'الحوادث',
      description: 'الإبلاغ عن حوادث السيارات، حوادث العمل، الحرائق، والسقوط',
      examples: 'حادث سيارة، حريق، سقوط...',
      icon: '🚗',
      color: 'bg-blue-100',
      textColor: 'text-blue-800',
    },
    {
      type: 'health',
      title: 'الصحة العامة',
      description: 'الإبلاغ عن تفشي الأمراض، التلوث، والمخاطر الصحية',
      examples: 'مرض، تسمم غذائي، تلوث...',
      icon: '🦠',
      color: 'bg-green-100',
      textColor: 'text-green-800',
    },
    {
      type: 'missing',
      title: 'المفقودين',
      description: 'الإبلاغ عن الأشخاص المفقودين وتقديم التفاصيل للبحث عنهم',
      examples: 'طفل، مسن، سائح...',
      icon: '👤',
      color: 'bg-yellow-100',
      textColor: 'text-yellow-800',
    },
    {
      type: 'help',
      title: 'مساعدة عاجلة',
      description: 'طلب المساعدة الفورية للحالات الطبية الطارئة',
      examples: 'دم، دواء، إسعاف...',
      icon: '🆘',
      color: 'bg-purple-100',
      textColor: 'text-purple-800',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        type: "tween" as const,
      },
    },
    hover: {
      y: -10,
      transition: {
        duration: 0.2,
        type: "tween" as const,
      },
    },
  };

  return (
    <div className="min-h-screen py-12 px-4 my-20 bg-transparent" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">نظام الإبلاغ عن الطوارئ</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            أبلغ عن الحالات الطارئة بسرعة وكفاءة للحصول على المساعدة التي تحتاجها
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {reportTypes.map((report) => (
            <motion.div
              key={report.type}
              variants={cardVariants}
              whileHover="hover"
              className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer"
            >
              <Link to={`/report/${report.type}`} className="block h-full">
                <div className={`p-6 ${report.color}`}>
                  <div className="flex items-center mb-4">
                    <span className="text-3xl ml-3">{report.icon}</span>
                    <h2 className="text-xl font-bold">{report.title}</h2>
                  </div>
                  <p className="text-gray-700 mb-3">{report.description}</p>
                  <p className={`text-sm font-medium ${report.textColor}`}>
                    {report.examples}
                  </p>
                </div>
                <div className="p-4 bg-white">
                  <span className="text-red-600 font-medium flex items-center">
                    أبلغ الآن
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">كيف يعمل النظام</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-red-600">1</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">اختر نوع التقرير</h3>
              <p className="text-gray-600">اختر الفئة التي تناسب حالتك الطارئة بشكل أفضل</p>
            </div>
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-red-600">2</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">املأ التفاصيل</h3>
              <p className="text-gray-600">قدم جميع المعلومات الضرورية عن حالة الطوارئ</p>
            </div>
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-red-600">3</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">أرسل وتأكد</h3>
              <p className="text-gray-600">راجع تقريرك وأرسله لاتخاذ إجراء فوري</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;