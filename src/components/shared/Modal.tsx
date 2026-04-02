import { X } from "lucide-react";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal = ({ title, onClose, children }: ModalProps) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative bg-card rounded-xl w-[500px] max-h-[80vh] overflow-hidden shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="bg-crm-blue px-5 py-3 flex items-center justify-between">
          <h3 className="text-primary-foreground font-semibold text-sm">{title}</h3>
          <button onClick={onClose} className="text-primary-foreground/80 hover:text-primary-foreground">
            <X size={18} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
