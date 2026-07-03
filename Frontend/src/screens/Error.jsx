import { Button } from "../components";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const Error = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full h-dvh flex items-center justify-center text-center p-6 bg-[#0A0A0A] text-white animate-fadeIn">
      <div className="max-w-sm w-full">
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 rounded-2xl bg-[#171717] border border-[#2A2A2A] flex items-center justify-center">
            <AlertTriangle size={36} className="text-[#9A9A9A]" />
          </div>
        </div>
        
        <h1 className="text-5xl font-extrabold text-white tracking-tight mb-2">404</h1>
        <h2 className="text-xl font-bold text-[#CFCFCF] mb-4">Page Not Found</h2>
        <p className="text-sm text-[#8A8A8A] mb-8 leading-relaxed">
          The page you are looking for does not exist, has been removed, or has had its name changed.
        </p>
        
        <Button
          title="Go Back Home"
          fun={() => navigate("/")}
        />
      </div>
    </div>
  );
};

export default Error;
