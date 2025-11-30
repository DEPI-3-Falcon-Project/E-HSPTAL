import React, { useState } from 'react';
import { Hospital, Stethoscope, Pill, Filter, ChevronDown } from 'lucide-react';
import MedicalCenterCard from './MedicalCenterCard';
import { MedicalCenter } from '../types';

interface MedicalResultsSectionProps {
  centers: MedicalCenter[];
  loading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

const MedicalResultsSection: React.FC<MedicalResultsSectionProps> = ({
  centers,
  loading = false,
  onLoadMore,
  hasMore = false
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'hospitals' | 'clinics' | 'pharmacies'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const getFilteredCenters = () => {
    if (selectedFilter === 'all') return centers;
    return centers.filter(center => {
      switch (selectedFilter) {
        case 'hospitals':
          return center.type === 'hospital';
        case 'clinics':
          return center.type === 'clinic';
        case 'pharmacies':
          return center.type === 'pharmacy';
        default:
          return true;
      }
    });
  };

  const getFilterCount = (type: string) => {
    if (type === 'all') return centers.length;
    return centers.filter(center => {
      switch (type) {
        case 'hospitals':
          return center.type === 'hospital';
        case 'clinics':
          return center.type === 'clinic';
        case 'pharmacies':
          return center.type === 'pharmacy';
        default:
          return false;
      }
    }).length;
  };

  const getFilterIcon = (type: string) => {
    switch (type) {
      case 'hospitals':
        return <Hospital className="w-4 h-4" />;
      case 'clinics':
        return <Stethoscope className="w-4 h-4" />;
      case 'pharmacies':
        return <Pill className="w-4 h-4" />;
      default:
        return <Filter className="w-4 h-4" />;
    }
  };

  const getFilterLabel = (type: string) => {
    switch (type) {
      case 'hospitals':
        return 'مستشفيات';
      case 'clinics':
        return 'مراكز طبية';
      case 'pharmacies':
        return 'صيدليات';
      default:
        return 'الكل';
    }
  };

  const filteredCenters = getFilteredCenters();

  return (
    <section id="search" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            أقرب المراكز الطبية لك
          </h2>
          <p className="text-gray-600">
            بناءً على موقعك الحالي - تم العثور على {centers.length} مركز طبي
          </p>
        </div>

        {/* Filters Section */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Filter className="w-5 h-5 text-red-600 mr-2" />
                تصنيف النتائج
              </h3>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
              >
                <span className="text-sm">عرض التصنيفات</span>
                <ChevronDown className={`w-4 h-4 mr-1 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { type: 'all', color: 'bg-gray-100 text-gray-800 hover:bg-gray-200' },
                  { type: 'hospitals', color: 'bg-red-100 text-red-800 hover:bg-red-200' },
                  { type: 'clinics', color: 'bg-blue-100 text-blue-800 hover:bg-blue-200' },
                  { type: 'pharmacies', color: 'bg-green-100 text-green-800 hover:bg-green-200' }
                ].map(({ type, color }) => (
                  <button
                    key={type}
                    onClick={() => setSelectedFilter(type as any)}
                    className={`flex items-center justify-center space-x-2 p-3 rounded-lg transition-colors ${
                      selectedFilter === type 
                        ? color.replace('hover:', '') 
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {getFilterIcon(type)}
                    <span className="text-sm font-medium">{getFilterLabel(type)}</span>
                    <span className="text-xs bg-white bg-opacity-50 px-2 py-1 rounded-full">
                      {getFilterCount(type)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">جاري تحميل النتائج...</p>
          </div>
        ) : filteredCenters.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredCenters.slice(0, 30).map((center) => (
                <MedicalCenterCard 
                  key={center._id} 
                  center={center} 
                  showDistance={true}
                />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && filteredCenters.length > 30 && (
              <div className="text-center">
                <button
                  onClick={onLoadMore}
                  className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl"
                >
                  تحميل المزيد ({filteredCenters.length - 30} نتيجة إضافية)
                </button>
              </div>
            )}

            {/* Results Info */}
            <div className="mt-8 bg-white rounded-lg p-6 shadow-lg">
              <div className="flex items-center justify-center mb-4">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                  <Hospital className="w-4 h-4 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  إحصائيات النتائج
                </h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {getFilterCount('hospitals')}
                  </div>
                  <div className="text-sm text-gray-600">مستشفيات</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {getFilterCount('clinics')}
                  </div>
                  <div className="text-sm text-gray-600">مراكز طبية</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {getFilterCount('pharmacies')}
                  </div>
                  <div className="text-sm text-gray-600">صيدليات</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {centers.length}
                  </div>
                  <div className="text-sm text-gray-600">إجمالي</div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Hospital className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              لم يتم العثور على نتائج
            </h3>
            <p className="text-gray-600">
              لم نتمكن من العثور على مراكز طبية في النطاق المحدد
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default MedicalResultsSection;
