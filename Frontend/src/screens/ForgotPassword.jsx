import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { Button, Input } from '../components';
import { useState } from 'react';
import { useForm } from "react-hook-form";
import Console from '../utils/console';
import axios from 'axios';
import useCooldownTimer from '../hooks/useCooldownTimer';
import { ArrowLeft, Mail } from 'lucide-react';
import { useAlert } from '../hooks/useAlert';
import { Alert } from '../components';

const allowedParams = ["user", "captain"];

function ForgotPassword() {
    const [loading, setLoading] = useState(false);
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm();

    const navigation = useNavigate();
    const { userType } = useParams();
    const { alert, showAlert, hideAlert } = useAlert();
    const { timeLeft, isActive, startCooldown } = useCooldownTimer(60000, 'forgot-password-cooldown');

    if (!allowedParams.includes(userType)) {
        return <Navigate to={'/not-found'} replace />
    }

    const forgotPassword = async (data) => {
        if (data.email.trim() !== "") {
            try {
                setLoading(true);
                const response = await axios.post(
                    `${import.meta.env.VITE_SERVER_URL}/mail/${userType}/reset-password`,
                    data
                );
                Console.log(response);
                showAlert('Reset Link Sent', 'Please check your inbox and click on the received link to reset the password', 'success');
                startCooldown();

            } catch (error) {
                showAlert('Some error occured', error.response.data.message, 'failure');
                Console.log(error.response.data.message);
            } finally {
                setLoading(false);
            }
        }
    }

    const getButtonTitle = () => {
        if (isActive) {
            return `Wait ${timeLeft}s`;
        }
        return "Send Reset Link";
    };

    return (
        <div className="w-full h-dvh flex flex-col justify-between p-6 pt-8 bg-[#0A0A0A] text-white animate-fadeIn">
            <Alert
                heading={alert.heading}
                text={alert.text}
                isVisible={alert.isVisible}
                onClose={hideAlert}
                type={alert.type}
            />
            
            <div className="w-full max-w-sm mx-auto flex-1 flex flex-col justify-center">
                <header className="mb-6">
                    <button
                        onClick={() => navigation(-1)}
                        className="mb-6 flex items-center gap-2 text-xs font-semibold text-[#8A8A8A] hover:text-white transition-colors duration-200"
                    >
                        <ArrowLeft size={16} /> Back
                    </button>
                    <h1 className="text-2xl font-bold text-white mb-2">Forgot Password</h1>
                    <p className="text-sm text-[#8A8A8A] leading-relaxed">
                        Enter your registered email below and we will send you a link to reset your password.
                    </p>
                </header>

                <div className="my-6 flex justify-center">
                    <div className="w-20 h-20 rounded-2xl bg-[#171717] border border-[#2A2A2A] flex items-center justify-center">
                        <Mail size={32} className="text-[#8A8A8A]" />
                    </div>
                </div>

                <section className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-5 shadow-xl">
                    <form onSubmit={handleSubmit(forgotPassword)} className="space-y-4">
                        <Input
                            placeholder={"name@example.com"}
                            type={"email"}
                            name={"email"}
                            label={"Email Address"}
                            register={register}
                            error={errors.email}
                        />

                        <Button
                            title={getButtonTitle()}
                            loading={loading}
                            loadingMessage={"Sending..."}
                            type="submit"
                            disabled={loading || isActive}
                        />
                    </form>
                </section>
            </div>
            
            <p className="text-[10px] text-[#5E5E5E] text-center mt-6">
                Make sure you have access to this email address to retrieve your account.
            </p>
        </div>
    )
}

export default ForgotPassword