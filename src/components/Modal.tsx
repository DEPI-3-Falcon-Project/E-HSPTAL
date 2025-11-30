import type { Case } from "../data/cases";

interface Props {
  item: Case;
  onClose: () => void;
}

export default function Modal({ item, onClose }: Props) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-white p-6 rounded-2xl w-11/12 md:w-1/2 relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-3 left-3 text-gray-500 text-xl cursor-pointer hover:cursor-pointer"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold text-red-600 mb-2">{item.title}</h2>
        <p
          className="text-gray-800 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: item.steps }}
        />
      </div>
    </div>
  );
}
