import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button, Heading, Input } from "../components";
import axios from "axios";
import { useCaptain } from "../contexts/CaptainContext";
import { ArrowLeft, User } from "lucide-react";
import Console from "../utils/console";

function CaptainEditProfile() {
  const token = localStorage.getItem("token");
  const [responseError, setResponseError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const { captain } = useCaptain();

  const navigation = useNavigate();

  const updateUserProfile = async (data) => {
    const captainData = {
      fullname: {
        firstname: data.firstname,
        lastname: data.lastname,
      },
      phone: data.phone,
      vehicle: {
        color: data.color,
        number: data.number,
        capacity: data.capacity,
        type: data.type.toLowerCase(),
      },
    };
    Console.log(captainData);
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/captain/update`,
        { captainData },
        {
          headers: {
            token: token,
          },
        }
      );
      Console.log(response);
      navigation("/captain/home");
    } catch (error) {
      setResponseError(error.response.data[0].msg);
      Console.log(error.response);
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
        <header className="mb-6 flex justify-between items-center">
          <button
            onClick={() => navigation(-1)}
            className="flex items-center gap-2 text-xs font-semibold text-[#8A8A8A] hover:text-white transition-colors duration-200"
          >
            <ArrowLeft size={16} /> Back
          </button>
        </header>

        <Heading title={"Edit Profile"} />

        <div className="my-4 flex justify-center">
          <div className="w-16 h-16 rounded-full bg-[#171717] border border-[#2A2A2A] flex items-center justify-center">
            <User size={24} className="text-[#8A8A8A]" />
          </div>
        </div>

        <section className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-5 shadow-xl">
          <form onSubmit={handleSubmit(updateUserProfile)} className="space-y-4">
            <Input
              label={"Email (Cannot change)"}
              type={"email"}
              name={"email"}
              register={register}
              error={errors.email}
              defaultValue={captain.email}
              disabled={true}
            />
            <Input
              label={"Phone Number"}
              type={"number"}
              name={"phone"}
              register={register}
              error={errors.phone}
              defaultValue={captain.phone}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label={"First name"}
                name={"firstname"}
                register={register}
                error={errors.firstname}
                defaultValue={captain.fullname.firstname}
              />
              <Input
                label={"Last name"}
                name={"lastname"}
                register={register}
                error={errors.lastname}
                defaultValue={captain.fullname.lastname}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label={"Vehicle Colour"}
                name={"color"}
                register={register}
                error={errors.color}
                defaultValue={captain.vehicle.color}
              />
              <Input
                label={"Vehicle Capacity"}
                type={"number"}
                name={"capacity"}
                register={register}
                error={errors.capacity}
                defaultValue={captain.vehicle.capacity}
              />
            </div>
            <Input
              label={"Vehicle Number"}
              name={"number"}
              register={register}
              error={errors.number}
              defaultValue={captain.vehicle.number}
            />
            <Input
              label={"Vehicle Type"}
              type={"select"}
              options={["Car", "Bike", "Auto"]}
              name={"type"}
              register={register}
              error={errors.type}
              defaultValue={captain.vehicle.type}
            />
            {responseError && (
              <p className="text-xs text-center py-2 px-3 bg-[#1E1E1E] border border-[#2A2A2A] text-[#9A9A9A] rounded-xl font-medium animate-fadeIn">
                {responseError}
              </p>
            )}
            <Button
              title={"Update Profile"}
              loading={loading}
              type="submit"
              classes={"mt-4"}
            />
          </form>
        </section>
      </div>
    </div>
  );
}

export default CaptainEditProfile;
