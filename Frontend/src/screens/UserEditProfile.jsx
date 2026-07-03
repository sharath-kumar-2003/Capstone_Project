import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button, Heading, Input } from "../components";
import axios from "axios";
import { useUser } from "../contexts/UserContext";
import { ArrowLeft, User } from "lucide-react";
import Console from "../utils/console";
import { useAlert } from "../hooks/useAlert";
import { Alert } from "../components";

function UserEditProfile() {
  const token = localStorage.getItem("token");
  const [responseError, setResponseError] = useState("");
  const [loading, setLoading] = useState(false);
  const { alert, showAlert, hideAlert } = useAlert();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const { user } = useUser();

  const navigation = useNavigate();

  const updateUserProfile = async (data) => {
    const userData = {
      fullname: {
        firstname: data.firstname,
        lastname: data.lastname,
      },
      phone: data.phone,
    };
    Console.log(userData);
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/user/update`,
        userData,
        {
          headers: {
            token: token,
          },
        }
      );
      Console.log(response);
      showAlert('Edit Successful', 'Your profile details has been successfully updated', 'success');

      setTimeout(() => {
        navigation("/home");
      }, 5000)
    } catch (error) {
      showAlert('Some Error occured', error.response.data[0].msg, 'failure');

      Console.log(error.response);
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
      <Alert
        heading={alert.heading}
        text={alert.text}
        isVisible={alert.isVisible}
        onClose={hideAlert}
        type={alert.type}
      />
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

        <div className="my-6 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-[#171717] border border-[#2A2A2A] flex items-center justify-center">
            <User size={32} className="text-[#8A8A8A]" />
          </div>
        </div>

        <section className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-5 shadow-xl">
          <form onSubmit={handleSubmit(updateUserProfile)} className="space-y-4">
            <Input
              label={"Email Address (Cannot change)"}
              type={"email"}
              name={"email"}
              register={register}
              error={errors.email}
              defaultValue={user.email}
              disabled={true}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label={"First name"}
                name={"firstname"}
                register={register}
                error={errors.firstname}
                defaultValue={user.fullname.firstname}
              />
              <Input
                label={"Last name"}
                name={"lastname"}
                register={register}
                error={errors.lastname}
                defaultValue={user.fullname.lastname}
              />
            </div>
            <Input
              label={"Phone Number"}
              type={"number"}
              name={"phone"}
              register={register}
              error={errors.phone}
              defaultValue={user.phone}
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

export default UserEditProfile;
