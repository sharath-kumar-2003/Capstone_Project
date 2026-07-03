import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import {
  GetStarted,
  UserLogin,
  CaptainLogin,
  UserHomeScreen,
  CaptainHomeScreen,
  UserProtectedWrapper,
  CaptainProtectedWrapper,
  UserSignup,
  CaptainSignup,
  RideHistory,
  UserEditProfile,
  CaptainEditProfile,
  Error,
  ChatScreen,
  ResetPassword,
  ForgotPassword
} from "./screens/";
import { logger } from "./utils/logger";
import { SocketDataContext } from "./contexts/SocketContext";
import { useEffect, useContext } from "react";
import { ChevronLeft, Trash2 } from "lucide-react";

function App() {
  return (
    <div className="w-full h-dvh flex items-center bg-[#0A0A0A]">
      <div className="relative w-full sm:min-w-96 sm:w-96 h-full bg-[#0A0A0A] overflow-hidden">
        {/* Force Reset Button to clear data */}
        <div className="absolute top-36 -right-11 opacity-20 hover:opacity-100 z-50 flex items-center p-1 PL-0 gap-1 bg-[#171717] border border-[#2A2A2A] hover:-translate-x-11 rounded-l-md transition-all duration-300">
          <ChevronLeft className="text-[#8A8A8A]" />
          <button className="flex justify-center items-center w-10 h-10 rounded-lg border border-[#2A2A2A] bg-[#1E1E1E] text-[#9A9A9A] hover:bg-[#252525] transition-colors duration-200" onClick={() => {
            alert("This will clear all your data and log you out to fix the app in case it got corrupted. Please confirm to proceed.");
            const confirmation = confirm("Are you sure you want to reset the app?")

            if (confirmation === true) {
              localStorage.clear();
              window.location.reload();
            }
          }}>
            <Trash2 strokeWidth={1.8} width={18} />
          </button>
        </div>

        <BrowserRouter>
          <LoggingWrapper />
          <Routes>
            <Route path="/" element={<GetStarted />} />
            <Route
              path="/home"
              element={
                <UserProtectedWrapper>
                  <UserHomeScreen />
                </UserProtectedWrapper>
              }
            />
            <Route path="/login" element={<UserLogin />} />
            <Route path="/signup" element={<UserSignup />} />
            <Route
              path="/user/edit-profile"
              element={
                <UserProtectedWrapper>
                  <UserEditProfile />
                </UserProtectedWrapper>
              }
            />
            <Route
              path="/user/rides"
              element={
                <UserProtectedWrapper>
                  <RideHistory />
                </UserProtectedWrapper>
              }
            />

            <Route
              path="/captain/home"
              element={
                <CaptainProtectedWrapper>
                  <CaptainHomeScreen />
                </CaptainProtectedWrapper>
              }
            />
            <Route path="/captain/login" element={<CaptainLogin />} />
            <Route path="/captain/signup" element={<CaptainSignup />} />
            <Route
              path="/captain/edit-profile"
              element={
                <CaptainProtectedWrapper>
                  <CaptainEditProfile />
                </CaptainProtectedWrapper>
              }
            />
            <Route
              path="/captain/rides"
              element={
                <CaptainProtectedWrapper>
                  <RideHistory />
                </CaptainProtectedWrapper>
              }
            />
            <Route path="/:userType/chat/:rideId" element={<ChatScreen />} />
            <Route path="/:userType/forgot-password/" element={<ForgotPassword />} />
            <Route path="/:userType/reset-password/" element={<ResetPassword />} />

            <Route path="*" element={<Error />} />
          </Routes>
        </BrowserRouter>
      </div>
      <div className="hidden sm:block w-full h-full bg-[#0A0A0A] overflow-hidden select-none border-l border-[#2A2A2A]">
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center animate-fadeIn">
            <h1 className="text-5xl font-bold text-white tracking-tight mb-3">QuickRide</h1>
            <p className="text-[#8A8A8A] text-sm font-normal tracking-wide">Premium ride booking experience</p>
            <div className="mt-8 flex justify-center gap-6">
              <div className="w-px h-12 bg-[#2A2A2A]"></div>
              <div className="text-left">
                <p className="text-xs text-[#5E5E5E] uppercase tracking-widest font-semibold">Reliable</p>
                <p className="text-xs text-[#8A8A8A] mt-1">City rides</p>
              </div>
              <div className="w-px h-12 bg-[#2A2A2A]"></div>
              <div className="text-left">
                <p className="text-xs text-[#5E5E5E] uppercase tracking-widest font-semibold">Real-time</p>
                <p className="text-xs text-[#8A8A8A] mt-1">Tracking</p>
              </div>
              <div className="w-px h-12 bg-[#2A2A2A]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

function LoggingWrapper() {
  const location = useLocation();
  const { socket } = useContext(SocketDataContext);

  useEffect(() => {
    if (socket) {
      logger(socket);
    }
  }, [location.pathname, location.search]);
  return null;
}