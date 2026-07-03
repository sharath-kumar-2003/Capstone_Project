import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Button, Input } from '../components';
import { useState } from 'react';
import { useForm } from "react-hook-form";
import Console from '../utils/console';
import axios from 'axios';
import { useAlert } from '../hooks/useAlert';
import { Alert } from '../components';
import { ShieldCheck } from 'lucide-react';

const allowedParams = ["user", "captain"];

function ResetPassword() {
    const [loading, setLoading] = useState(false);

    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const { userType } = useParams();
    const navigate = useNavigate();
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm();

    const { alert, showAlert, hideAlert } = useAlert();

    if (!allowedParams.includes(userType)) {
        return <Navigate to={'/not-found'} replace />
    }

    const resetPassword = async (data) => {
        if(data.password.length < 8 || data.confirmPassword.length < 8 ){
            showAlert("Incorrect Password Length", "Password must be at least 8 characters long", 'failure')
            return;
        }
        if (data.password !== data.confirmPassword) {
            showAlert("Passwords Mismatch", "The password and confirm password fields must be identical. Please re-enter them", 'failure')
            return;
        }
        try {
            setLoading(true)
            const response = await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/${userType}/reset-password`,
                {
                    token: token,
                    password: data.password
                }
            );
            showAlert('Password reset successfully!', response.data.message, 'success');
            Console.log(response);
            setTimeout(() => {
                navigate('/')
            }, 5000)
        } catch (error) {
            showAlert('Some error occured!', error.response.data.message, 'failure');
            setTimeout(() => {
                navigate('/' + userType + '/forgot-password')
            }, 5000);
            Console.log(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full h-dvh flex flex-col justify-between p-6 pt-8 bg-[#0A0A0A] text-white overflow-y-auto animate-fadeIn">
            <Alert
                heading={alert.heading}
                text={alert.text}
                isVisible={alert.isVisible}
                onClose={hideAlert}
                type={alert.type}
            />
            
            <div className="w-full max-w-sm mx-auto flex-1 flex flex-col justify-center">
                <header className="mb-6">
                    <h1 className="text-2xl font-bold text-white mb-2">Create New Password</h1>
                    <p className="text-sm text-[#8A8A8A] leading-relaxed">
                        Enter and confirm your new secure password below to regain full account access.
                    </p>
                </header>

                <div className="my-6 flex justify-center">
                    <div className="w-20 h-20 rounded-2xl bg-[#171717] border border-[#2A2A2A] flex items-center justify-center">
                        <ShieldCheck size={32} className="text-[#8A8A8A]" />
                    </div>
                </div>

                <section className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-5 shadow-xl">
                    <form onSubmit={handleSubmit(resetPassword)} className="space-y-4">
                        <Input
                            label={"New Password"}
                            type={"password"}
                            name={"password"}
                            placeholder="Min. 8 characters"
                            register={register}
                            error={errors.password}
                        />
                        <Input
                            label={"Confirm Password"}
                            type={"password"}
                            name={"confirmPassword"}
                            placeholder="Re-enter password"
                            register={register}
                            error={errors.confirmPassword}
                        />
                        <Button title={"Reset Password"} loading={loading} type="submit" />
                    </form>
                </section>
            </div>

            <p className="text-[10px] text-[#5E5E5E] text-center mt-6">
                After resetting, you will be redirected to the starting page to log in.
            </p>
        </div>
    )
}

export default ResetPassword