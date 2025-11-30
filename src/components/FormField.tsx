import React from 'react';

interface FormFieldProps {
  label: string;
  type?: 'text' | 'email' | 'tel' | 'number' | 'textarea' | 'select' | 'file';
  value: string | number;
  onChange: (value: string | number) => void;
  options?: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
  className?: string;
  error?: string;
  showOtherField?: boolean;
  onOtherChange?: (value: string) => void;
  otherValue?: string;
  otherPlaceholder?: string;
  min?: string | number;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  options,
  required = false,
  placeholder,
  className = '',
  error,
  showOtherField = false,
  onOtherChange,
  otherValue = '',
  otherPlaceholder = 'Please specify',
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const newValue = type === 'number' ? Number(e.target.value) : e.target.value;
    onChange(newValue);
  };

  const inputClasses = `w-full border border-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${className} ${error ? 'border-red-500' : ''}`;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {type === 'textarea' ? (
        <textarea
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={inputClasses}
          rows={3}
        />
      ) : type === 'select' && options ? (
        <>
          <select
            value={value}
            onChange={handleChange}
            className={inputClasses}
          >
            <option value="">Select an option</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {showOtherField && onOtherChange && (
            <input
              type="text"
              value={otherValue}
              onChange={(e) => onOtherChange(e.target.value)}
              placeholder={otherPlaceholder}
              className={`${inputClasses} mt-2`}
            />
          )}
        </>
      ) : type === 'file' ? (
        <input
          type="file"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              onChange(e.target.files[0].name);
            }
          }}
          className={inputClasses}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={inputClasses}
        />
      )}
      
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
};

export default FormField;