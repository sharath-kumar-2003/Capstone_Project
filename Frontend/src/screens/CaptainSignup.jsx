import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button, Heading, Input } from "../components";
import axios from "axios";
import { ArrowLeft, ChevronRight, Car } from "lucide-react";
import Console from "../utils/console";

function CaptainSignup() {
  const [responseError, setResponseError] = useState("");
  const [showVehiclePanel, setShowVehiclePanel] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const navigation = useNavigate();
  const signupCaptain = async (data) => {

    const captainData = {
      fullname: {
        firstname: data.firstname,
        lastname: data.lastname,
      },
      email: data.email,
      password: data.password,
      phone: data.phone,
      vehicle: {
        color: data.color,
        number: data.number,
        capacity: data.capacity,
        type: data.type,
      },
    };
    Console.log(captainData);

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/captain/register`,
        captainData
      );
      Console.log(response);
      localStorage.setItem("token", response.data.token);
      navigation("/captain/home");
    } catch (error) {
      setResponseError(
        error.response.data[0]?.msg || error.response.data.message
      );
      setShowVehiclePanel(false);
      Console.log(error);
    } finally {
      setLoading(false);
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
          <Heading title={"Register as Captain"} />
          <p className="text-sm font-normal leading-relaxed text-[#8A8A8A]">
            {!showVehiclePanel 
              ? "Step 1 of 2: Set up your personal account details." 
              : "Step 2 of 2: Configure your vehicle details."}
          </p>
        </header>

        <section className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-5 shadow-xl">
          <form onSubmit={handleSubmit(signupCaptain)} className="space-y-4">
            {!showVehiclePanel && (
              <div className="space-y-4 animate-scaleIn">
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label={"First name"}
                    name={"firstname"}
                    placeholder="First name"
                    register={register}
                    error={errors.firstname}
                  />
                  <Input
                    label={"Last name"}
                    name={"lastname"}
                    placeholder="Last name"
                    register={register}
                    error={errors.lastname}
                  />
                </div>
                <Input
                  label={"Phone Number"}
                  type={"number"}
                  name={"phone"}
                  placeholder="Phone number"
                  register={register}
                  error={errors.phone}
                />
                <Input
                  label={"Email"}
                  type={"email"}
                  name={"email"}
                  placeholder="name@example.com"
                  register={register}
                  error={errors.email}
                />
                <Input
                  label={"Password"}
                  type={"password"}
                  name={"password"}
                  placeholder="Create password"
                  register={register}
                  error={errors.password}
                />
                {responseError && (
                  <p className="text-xs text-center py-2 px-3 bg-[#1E1E1E] border border-[#2A2A2A] text-[#9A9A9A] rounded-xl font-medium animate-fadeIn">
                    {responseError}
                  </p>
                )}
                <button
                  type="button"
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-[14px] bg-white px-4 text-sm font-semibold text-[#0A0A0A] transition duration-200 hover:bg-[#E5E5E5] active:bg-[#CFCFCF]"
                  onClick={() => {
                    setShowVehiclePanel(true);
                  }}
                >
                  Continue <ChevronRight size={16} />
                </button>
              </div>
            )}

            {showVehiclePanel && (
              <div className="space-y-4 animate-scaleIn">
                <button
                  type="button"
                  onClick={() => {
                    setShowVehiclePanel(false);
                  }}
                  className="flex items-center gap-2 text-xs font-semibold text-[#8A8A8A] hover:text-white transition-colors duration-200 mb-2"
                >
                  <ArrowLeft size={14} /> Back to details
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label={"Vehicle Colour"}
                    name={"color"}
                    placeholder="e.g. Black"
                    register={register}
                    error={errors.color}
                  />
                  <Input
                    label={"Capacity"}
                    type={"number"}
                    name={"capacity"}
                    placeholder="e.g. 4"
                    register={register}
                    error={errors.capacity}
                  />
                </div>
                <Input
                  label={"Vehicle Plate Number"}
                  name={"number"}
                  placeholder="e.g. AB12CD3456"
                  register={register}
                  error={errors.number}
                />
                <Input
                  label={"Vehicle Type"}
                  type={"select"}
                  options={["Car", "Bike", "Auto"]}
                  name={"type"}
                  register={register}
                  error={errors.type}
                />

                {responseError && (
                  <p className="text-xs text-center py-2 px-3 bg-[#1E1E1E] border border-[#2A2A2A] text-[#9A9A9A] rounded-xl font-medium animate-fadeIn">
                    {responseError}
                  </p>
                )}
                <Button title={"Complete Sign Up"} loading={loading} type="submit" />
              </div>
            )}
          </form>

          <p className="text-xs font-normal text-center mt-5 text-[#8A8A8A]">
            Already have an account?{" "}
            <Link to={"/captain/login"} className="font-semibold text-white hover:underline">
              Login
            </Link>
          </p>
        </section>
      </div>

      <div className="w-full max-w-sm mx-auto mt-6">
        <Button
          type={"link"}
          path={"/signup"}
          title={"Sign Up as User"}
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

export default CaptainSignup;
