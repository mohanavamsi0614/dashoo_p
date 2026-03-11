import { MoveLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BackButton = ({ className = "", label = "Back" }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className={`group flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-black text-black hover:bg-black hover:text-white transition-colors duration-200 shadow-[2px_2px_0_0_#000] uppercase font-bold text-xs tracking-wider ${className}`}
    >
      <MoveLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
      <span>{label}</span>
    </button>
  );
};

export default BackButton;
