import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button, Heading, Input } from "../components";
import axios from "axios";
import Console from "../utils/console";
import { KeyRound } from "lucide-react";

function CaptainLogin() {
  const [responseError, setResponseError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const navigation = useNavigate();

  const loginCaptain = async (data) => {
    if (data.email.trim() !== "" && data.password.trim() !== "") {
      try {
        setLoading(true)
        const response = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/captain/login`,
          data
        );
        Console.log(response);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userData", JSON.stringify({
          type: "captain",
          data: response.data.captain,
        }));
        navigation("/captain/home");
      } catch (error) {
        setResponseError(error.response.data.message);
        Console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setResponseError("");
    }, 5000);
  }, [responseError]);

  return (
    <div className="w-full h-dvh flex flex-col justify-between p-6 pt-8 bg-[#0A0A0A] text-white overflow-y-auto animate-fadeIn">
      <div className="w-full max-w-sm mx-auto flex-1 flex flex-col justify-center">
        <header className="mb-6">
          <div className="mb-6 text-xl font-extrabold tracking-tight text-white">
            QuickRide
          </div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-[#8A8A8A]">
            Captain Portal
          </p>
          <Heading title={"Welcome Back"} />
          <p className="text-sm font-normal leading-relaxed text-[#8A8A8A]">
            Sign in to start receiving rides and managing your earnings.
          </p>
        </header>

        <section className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-5 shadow-xl">
          <form onSubmit={handleSubmit(loginCaptain)} className="space-y-4">
            <Input
              label={"Email Address"}
              type={"email"}
              name={"email"}
              placeholder="name@example.com"
              register={register}
              error={errors.email}
            />
            <div>
              <Input
                label={"Password"}
                type={"password"}
                name={"password"}
                placeholder="Enter password"
                register={register}
                error={errors.password}
              />
              <div className="flex justify-end mt-2">
                <Link 
                  to="/captain/forgot-password" 
                  className="text-xs font-semibold text-[#CFCFCF] hover:text-white transition-colors duration-200 flex items-center gap-1"
                >
                  <KeyRound size={12} />
                  Forgot Password?
                </Link>
              </div>
            </div>

            {responseError && (
              <p className="text-xs text-center py-2 px-3 bg-[#1E1E1E] border border-[#2A2A2A] text-[#9A9A9A] rounded-xl font-medium animate-fadeIn">
                {responseError}
              </p>
            )}

            <Button title={"Login as Captain"} loading={loading} type="submit" />
          </form>

          <p className="text-xs font-normal text-center mt-5 text-[#8A8A8A]">
            Don't have an account?{" "}
            <Link to={"/captain/signup"} className="font-semibold text-white hover:underline">
              Sign up
            </Link>
          </p>
        </section>
      </div>

      <div className="w-full max-w-sm mx-auto mt-6">
        <Button
          type={"link"}
          path={"/login"}
          title={"Login as User"}
          classes={"bg-[#171717] border border-[#2A2A2A] text-[#CFCFCF] hover:bg-[#252525] hover:text-white transition-colors duration-200"}
        />
        <p className="text-[10px] font-normal text-[#5E5E5E] text-center mt-5 leading-normal">
          This site is protected by reCAPTCHA and the Google{" "}
          <span className="underline">Privacy Policy</span> and{" "}
          <span className="underline">Terms of Service</span> apply.
        </p>
      </div>
    </div>
  );
}

export default CaptainLogin;
