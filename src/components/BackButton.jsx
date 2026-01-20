import { MoveLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BackButton = ({ className = "", label = "Back" }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className={`group flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white transition-all duration-300 ${className}`}
    >
      <MoveLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
};

export default BackButton;
