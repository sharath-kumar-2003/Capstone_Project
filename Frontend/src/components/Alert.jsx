import { useEffect, useState } from "react";
import Button from "./Button";

export const Alert = ({ heading, text, isVisible, onClose, type }) => {
    const [shouldRender, setShouldRender] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const status = {
        success: "bg-white text-[#0A0A0A] hover:bg-[#E5E5E5]",
        failure: "bg-[#303030] text-white hover:bg-[#404040]"
    }

    useEffect(() => {
        if (isVisible) {
            setShouldRender(true);
            setTimeout(() => setIsAnimating(true), 10);
        } else {
            setIsAnimating(false);
            setTimeout(() => setShouldRender(false), 300);
        }
    }, [isVisible]);

    if (!shouldRender) return null;

    return (
        <div className={`fixed inset-0 text-center w-full min-h-dvh flex justify-center items-center z-50 backdrop-blur-sm transition-all duration-300 ${isAnimating ? 'bg-black/70' : 'bg-black/0'}`}>
            <div className={`w-4/5 max-w-sm p-6 pt-8 bg-[#171717] border border-[#2A2A2A] rounded-2xl shadow-2xl transition-all duration-300 transform ${isAnimating ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
                <h1 className='font-semibold text-base text-white'>{heading}</h1>
                <p className='text-sm font-normal text-[#8A8A8A] mt-4 mb-7 text-pretty leading-relaxed'>{text}</p>
                <Button
                    title={"Okay"}
                    fun={onClose}
                    classes={type && status[type] ? status[type] : "bg-white text-[#0A0A0A] hover:bg-[#E5E5E5]"}
                />
            </div>
        </div>
    );
};