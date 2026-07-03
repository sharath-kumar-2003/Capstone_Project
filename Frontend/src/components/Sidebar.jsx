import { useEffect, useState } from "react";

import { ChevronRight, CircleUserRound, History, KeyRound, Menu, X, LogOut } from "lucide-react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Console from "../utils/console";

function Sidebar() {
  const token = localStorage.getItem("token");
  const [showSidebar, setShowSidebar] = useState(false);

  const [newUser, setNewUser] = useState({});

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    setNewUser(userData);
  }, []);

  const navigate = useNavigate();

  const logout = async () => {
    try {
      await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/${newUser.type}/logout`,
        {
          headers: {
            token: token,
          },
        }
      );

      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      localStorage.removeItem("messages");
      localStorage.removeItem("rideDetails");
      localStorage.removeItem("panelDetails");
      localStorage.removeItem("showPanel");
      localStorage.removeItem("showBtn");
      navigate("/");
    } catch (error) {
      Console.log("Error getting logged out", error);
    }
  };
  return (
    <>
      <div
        className="m-3 mt-4 absolute right-0 top-0 z-20 cursor-pointer bg-[#171717] border border-[#2A2A2A] p-2 rounded-xl text-white hover:bg-[#252525] transition-colors duration-200"
        onClick={() => {
          setShowSidebar(!showSidebar);
        }}
      >
        {showSidebar ? <X size={20} /> : <Menu size={20} />}
      </div>

      {/* Sidebar Component */}
      <div
        className={`${showSidebar ? " left-0 " : " -left-[100%] "
          } z-10 duration-300 ease-in-out absolute w-full h-dvh bottom-0 bg-[#0A0A0A] p-5 pt-6 flex flex-col justify-between`}
      >
        <div className="select-none">
          <h1 className="relative text-2xl font-bold text-white mb-2">Profile</h1>
          <div className="w-full h-px bg-[#2A2A2A] mb-6"></div>

          <div className="mt-4 mb-6">
            <div className="my-3 rounded-full w-20 h-20 bg-[#252525] border border-[#2A2A2A] mx-auto flex items-center justify-center">
              <h1 className="text-3xl font-bold text-white">
                {newUser?.data?.fullname?.firstname[0]}
                {newUser?.data?.fullname?.lastname[0]}
              </h1>
            </div>
            <h1 className="text-center font-semibold text-xl text-white mt-3">
              {newUser?.data?.fullname?.firstname}{" "}
              {newUser?.data?.fullname?.lastname}
            </h1>
            <h1 className="mt-1 text-center text-[#8A8A8A] text-sm">
              {newUser?.data?.email}
            </h1>
          </div>

          <div className="space-y-1">
            <Link
              to={`/${newUser?.type}/edit-profile`}
              className="flex items-center justify-between py-4 cursor-pointer hover:bg-[#171717] rounded-xl px-4 transition-colors duration-200"
            >
              <div className="flex gap-3 items-center">
                <CircleUserRound size={20} className="text-[#8A8A8A]" /> <h1 className="text-white text-sm font-medium">Edit Profile</h1>
              </div>
              <div>
                <ChevronRight size={18} className="text-[#5E5E5E]" />
              </div>
            </Link>

            <Link
              to={`/${newUser?.type}/rides`}
              className="flex items-center justify-between py-4 cursor-pointer hover:bg-[#171717] rounded-xl px-4 transition-colors duration-200"
            >
              <div className="flex gap-3 items-center">
                <History size={20} className="text-[#8A8A8A]" /> <h1 className="text-white text-sm font-medium">Ride History</h1>
              </div>
              <div>
                <ChevronRight size={18} className="text-[#5E5E5E]" />
              </div>
            </Link>

            <Link
              to={`/${newUser?.type}/reset-password?token=${token}`}
              className="flex items-center justify-between py-4 cursor-pointer hover:bg-[#171717] rounded-xl px-4 transition-colors duration-200"
            >
              <div className="flex gap-3 items-center">
                <KeyRound size={20} className="text-[#8A8A8A]" /> <h1 className="text-white text-sm font-medium">Change Password</h1>
              </div>
              <div>
                <ChevronRight size={18} className="text-[#5E5E5E]" />
              </div>
            </Link>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex justify-center items-center gap-2 py-3.5 px-5 font-semibold text-sm w-full rounded-[14px] cursor-pointer transition-all duration-200 ease-in-out bg-[#1E1E1E] border border-[#2A2A2A] text-white hover:bg-[#252525]"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </>
  );
}

export default Sidebar;
