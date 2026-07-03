import { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  ChevronUp,
  Clock,
  CreditCard,
  MapPin
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function RideHistory() {
  const navigation = useNavigate();
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [user, setUser] = useState(userData.data);

  function classifyAndSortRides(rides) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // Helper function to check if a date is today
    const isToday = (date) =>
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate();

    // Helper function to check if a date is yesterday
    const isYesterday = (date) =>
      date.getFullYear() === yesterday.getFullYear() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getDate() === yesterday.getDate();

    // Helper function to sort rides by date (recent to oldest)
    const sortByDate = (rides) =>
      rides.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Arrays to hold classified rides
    const todayRides = [];
    const yesterdayRides = [];
    const earlierRides = [];

    // Classify rides
    rides.forEach((ride) => {
      const createdDate = new Date(ride.createdAt);
      if (isToday(createdDate)) {
        todayRides.push(ride);
      } else if (isYesterday(createdDate)) {
        yesterdayRides.push(ride);
      } else {
        earlierRides.push(ride);
      }
    });

    // Return sorted arrays
    return {
      today: sortByDate(todayRides),
      yesterday: sortByDate(yesterdayRides),
      earlier: sortByDate(earlierRides),
    };
  }

  return (
    <div className="w-full h-dvh flex flex-col p-5 bg-[#0A0A0A] text-white overflow-hidden animate-fadeIn">
      <header className="flex items-center gap-3 mb-6">
        <ArrowLeft
          strokeWidth={2}
          className="cursor-pointer text-[#8A8A8A] hover:text-white transition-colors duration-200"
          onClick={() => navigation(-1)}
        />
        <h1 className="text-2xl font-bold text-white tracking-tight">History</h1>
      </header>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        <details open className="group">
          <summary className="flex items-center justify-between cursor-pointer text-[#CFCFCF] font-semibold py-2 select-none">
            <span>Today</span>
            <ChevronUp className="w-4 h-4 transition-transform duration-300 group-open:rotate-180 text-[#8A8A8A]" />
          </summary>
          <div className="space-y-3 mt-2">
            {classifyAndSortRides(user.rides).today.length > 0 ? (
              classifyAndSortRides(user.rides).today.map((ride) => {
                return <Ride ride={ride} key={ride._id} />;
              })
            ) : (
              <h1 className="text-xs text-center text-[#5E5E5E] py-4 bg-[#111111] border border-[#2A2A2A] rounded-xl">
                No rides found
              </h1>
            )}
          </div>
        </details>

        <details open className="group">
          <summary className="flex items-center justify-between cursor-pointer text-[#CFCFCF] font-semibold py-2 select-none">
            <span>Yesterday</span>
            <ChevronUp className="w-4 h-4 transition-transform duration-300 group-open:rotate-180 text-[#8A8A8A]" />
          </summary>
          <div className="space-y-3 mt-2">
            {classifyAndSortRides(user.rides).yesterday.length > 0 ? (
              classifyAndSortRides(user.rides).yesterday.map((ride) => {
                return <Ride ride={ride} key={ride._id} />;
              })
            ) : (
              <h1 className="text-xs text-center text-[#5E5E5E] py-4 bg-[#111111] border border-[#2A2A2A] rounded-xl">
                No rides found
              </h1>
            )}
          </div>
        </details>

        <details open className="group">
          <summary className="flex items-center justify-between cursor-pointer text-[#CFCFCF] font-semibold py-2 select-none">
            <span>Earlier</span>
            <ChevronUp className="w-4 h-4 transition-transform duration-300 group-open:rotate-180 text-[#8A8A8A]" />
          </summary>
          <div className="space-y-3 mt-2">
            {classifyAndSortRides(user.rides).earlier.length > 0 ? (
              classifyAndSortRides(user.rides).earlier.map((ride) => {
                return <Ride ride={ride} key={ride._id} />;
              })
            ) : (
              <h1 className="text-xs text-center text-[#5E5E5E] py-4 bg-[#111111] border border-[#2A2A2A] rounded-xl">
                No rides found
              </h1>
            )}
          </div>
        </details>
      </div>
    </div>
  );
}

export const Ride = ({ ride }) => {
  function formatDate(inputDate) {
    const date = new Date(inputDate);

    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month}, ${year}`;
  }

  function formatTime(inputDate) {
    const date = new Date(inputDate);

    // Extract hours and minutes
    let hours = date.getHours();
    const minutes = date.getMinutes();

    // Determine AM/PM
    const period = hours >= 12 ? "PM" : "AM";

    // Convert hours to 12-hour format
    hours = hours % 12 || 12; // Convert 0 to 12 for midnight

    // Format minutes to always show two digits
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    // Return the formatted time
    return `${hours}:${formattedMinutes} ${period}`;
  }

  return (
    <div className="w-full p-4 border border-[#2A2A2A] bg-[#171717] rounded-xl hover:border-white transition-all duration-200 cursor-pointer relative animate-scaleIn">
      <div className="flex flex-wrap gap-x-4 gap-y-2 justify-between border-b border-[#303030] pb-3 mb-3">
        <div className="flex gap-4">
          <h1 className="text-xs flex gap-1.5 items-center font-semibold text-white">
            <Calendar size={13} className="text-[#8A8A8A]" />
            {formatDate(ride.createdAt)}
          </h1>

          <h1 className="text-xs flex gap-1.5 items-center font-semibold text-[#CFCFCF]">
            <Clock size={13} className="text-[#8A8A8A]" /> 
            {formatTime(ride.createdAt)}
          </h1>
        </div>
        <h1 className="text-xs flex gap-1.5 items-center font-bold text-white">
          <CreditCard size={13} className="text-[#8A8A8A]" />
          ₹ {ride.fare}
        </h1>
      </div>

      <div className="w-full items-center truncate">
        <div className="flex items-center relative w-full h-fit">
          <div className="h-10 w-[2px] flex flex-col items-center justify-between bg-[#303030] absolute left-2">
            <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
            <div className="w-1.5 h-1.5 rounded-sm bg-[#8A8A8A]"></div>
          </div>
          <div className="ml-7 truncate w-full space-y-1">
            <h1 className="text-xs truncate text-[#CFCFCF]" title={ride.pickup}>
              {ride.pickup}
            </h1>
            <h1 className="text-xs truncate text-[#8A8A8A]" title={ride.destination}>
              {ride.destination}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RideHistory;
