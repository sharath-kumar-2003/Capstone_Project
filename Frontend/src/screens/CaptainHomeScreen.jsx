import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useCaptain } from "../contexts/CaptainContext";
import { Phone, User, Landmark, Route, AlertCircle } from "lucide-react";
import { SocketDataContext } from "../contexts/SocketContext";
import { NewRide, Sidebar, LiveMap } from "../components";
import Console from "../utils/console";

// We no longer need the iframe URL builder

import { useAlert } from "../hooks/useAlert";
import { Alert } from "../components";

const defaultRideData = {
  user: {
    fullname: {
      firstname: "No",
      lastname: "User",
    },
    _id: "",
    email: "example@gmail.com",
    rides: [],
  },
  pickup: "Place, City, State, Country",
  destination: "Place, City, State, Country",
  fare: 0,
  vehicle: "car",
  status: "pending",
  duration: 0,
  distance: 0,
  _id: "123456789012345678901234",
};

function CaptainHomeScreen() {
  const token = localStorage.getItem("token");

  const { captain } = useCaptain();
  const { socket } = useContext(SocketDataContext);
  const [loading, setLoading] = useState(false);
  const { alert, showAlert, hideAlert } = useAlert();

  const [riderLocation, setRiderLocation] = useState({
    ltd: null,
    lng: null,
  });
  const [mapLocation, setMapLocation] = useState([null, null]); // Array for [lat, lng]
  const [routeGeometry, setRouteGeometry] = useState(null);
  const [earnings, setEarnings] = useState({
    total: 0,
    today: 0,
  });

  const [rides, setRides] = useState({
    accepted: 0,
    cancelled: 0,
    distanceTravelled: 0,
  });
  const [newRide, setNewRide] = useState(
    JSON.parse(localStorage.getItem("rideDetails")) || defaultRideData
  );

  const [otp, setOtp] = useState("");
  const [messages, setMessages] = useState(
    JSON.parse(localStorage.getItem("messages")) || []
  );
  const [error, setError] = useState("");

  // Panels
  const [showCaptainDetailsPanel, setShowCaptainDetailsPanel] = useState(true);
  const [showNewRidePanel, setShowNewRidePanel] = useState(
    JSON.parse(localStorage.getItem("showPanel")) || false
  );
  const [showBtn, setShowBtn] = useState(
    JSON.parse(localStorage.getItem("showBtn")) || "accept"
  );

  const acceptRide = async () => {
    try {
      if (newRide._id != "") {
        setLoading(true);
        const response = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/ride/confirm`,
          { rideId: newRide._id },
          {
            headers: {
              token: token,
            },
          }
        );
        setLoading(false);
        setShowBtn("otp");
        if (riderLocation.ltd && riderLocation.lng) {
          setMapLocation([riderLocation.ltd, riderLocation.lng]);
          fetchRouteGeometry(`${riderLocation.ltd},${riderLocation.lng}`, newRide.pickup);
        }
        Console.log(response);
      }
    } catch (error) {
      setLoading(false);
      showAlert('Some error occured', error.response.data.message, 'failure');
      Console.log(error.response);
      setTimeout(() => {
        clearRideData();
      }, 1000);
    }
  };

  const verifyOTP = async () => {
    try {
      if (newRide._id != "" && otp.length == 6) {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/ride/start-ride?rideId=${newRide._id}&otp=${otp}`,
          {
            headers: {
              token: token,
            },
          }
        );
        if (riderLocation.ltd && riderLocation.lng) {
          setMapLocation([riderLocation.ltd, riderLocation.lng]);
          fetchRouteGeometry(`${riderLocation.ltd},${riderLocation.lng}`, newRide.destination);
        }
        setShowBtn("end-ride");
        setLoading(false);
        Console.log(response);
      }
    } catch (err) {
      setLoading(false);
      setError("Invalid OTP");
      Console.log(err);
    }
  };

  const fetchRouteGeometry = async (origin, destination) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/maps/get-distance-time?origin=${origin}&destination=${destination}`,
        { headers: { token: token } }
      );
      if (response.data && response.data.geometry) {
        setRouteGeometry(response.data.geometry);
      }
    } catch (err) {
      Console.error("Could not fetch route geometry:", err);
    }
  };



  const endRide = async () => {
    try {
      if (newRide._id != "") {
        setLoading(true);
        await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/ride/end-ride`,
          {
            rideId: newRide._id,
          },
          {
            headers: {
              token: token,
            },
          }
        );
        if (riderLocation.ltd && riderLocation.lng) {
          setMapLocation([riderLocation.ltd, riderLocation.lng]);
        }
        setRouteGeometry(null);
        setShowBtn("accept");
        setLoading(false);
        setShowCaptainDetailsPanel(true);
        setShowNewRidePanel(false);
        setNewRide(defaultRideData);
        localStorage.removeItem("rideDetails");
        localStorage.removeItem("showPanel");
      }
    } catch (err) {
      setLoading(false);
      Console.log(err);
    }
  };

  const updateLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Console.log(position);
          setRiderLocation({
            ltd: position.coords.latitude,
            lng: position.coords.longitude,
          });

          setMapLocation([position.coords.latitude, position.coords.longitude]);
          socket.emit("update-location-captain", {
            userId: captain._id,
            location: {
              ltd: position.coords.latitude,
              lng: position.coords.longitude,
            },
          });
        },
        (error) => {
          console.error("Error fetching position:", error);
          switch (error.code) {
            case error.PERMISSION_DENIED:
              console.error("User denied the request for Geolocation.");
              break;
            case error.POSITION_UNAVAILABLE:
              console.error("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              console.error("The request to get user location timed out.");
              break;
            default:
              console.error("An unknown error occurred.");
          }
        }
      );
    }
  };

  const clearRideData = () => {
    setShowBtn("accept");
    setLoading(false);
    setShowCaptainDetailsPanel(true);
    setShowNewRidePanel(false);
    setNewRide(defaultRideData);
    localStorage.removeItem("rideDetails");
    localStorage.removeItem("showPanel");
  }

  useEffect(() => {
    if (captain._id) {
      socket.emit("join", {
        userId: captain._id,
        userType: "captain",
      });

      // const locationInterval = setInterval(updateLocation, 10000);
      updateLocation(); // IMP: Call this function to update location
    }

    socket.on("new-ride", (data) => {
      Console.log("New Ride available:", data);
      setShowBtn("accept");
      setNewRide(data);
      setShowNewRidePanel(true);
    });

    socket.on("ride-cancelled", (data) => {
      Console.log("Ride cancelled", data);
      updateLocation();
      clearRideData();
    });
  }, [captain]);

  useEffect(() => {
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    socket.emit("join-room", newRide._id);

    socket.on("receiveMessage", async (msg) => {
      // Console.log("Received message: ", msg);
      setMessages((prev) => [...prev, { msg, by: "other" }]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [newRide]);

  useEffect(() => {
    localStorage.setItem("rideDetails", JSON.stringify(newRide));
  }, [newRide]);

  useEffect(() => {
    localStorage.setItem("showPanel", JSON.stringify(showNewRidePanel));
    localStorage.setItem("showBtn", JSON.stringify(showBtn));
  }, [showNewRidePanel, showBtn]);

  const calculateEarnings = () => {
    let Totalearnings = 0;
    let Todaysearning = 0;

    let acceptedRides = 0;
    let cancelledRides = 0;

    let distanceTravelled = 0;

    const today = new Date();
    const todayWithoutTime = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    captain.rides.forEach((ride) => {
      if (ride.status == "completed") {
        acceptedRides++;
        distanceTravelled += ride.distance;
      }
      if (ride.status == "cancelled") cancelledRides++;

      Totalearnings += ride.fare;
      const rideDate = new Date(ride.updatedAt);

      const rideDateWithoutTime = new Date(
        rideDate.getFullYear(),
        rideDate.getMonth(),
        rideDate.getDate()
      );

      if (
        rideDateWithoutTime.getTime() === todayWithoutTime.getTime() &&
        ride.status === "completed"
      ) {
        Todaysearning += ride.fare;
      }
    });

    setEarnings({ total: Totalearnings, today: Todaysearning });
    setRides({
      accepted: acceptedRides,
      cancelled: cancelledRides,
      distanceTravelled: Math.round(distanceTravelled / 1000),
    });
  };

  useEffect(() => {
    calculateEarnings();
  }, [captain]);

  useEffect(() => {
    if (mapLocation.ltd && mapLocation.lng) {
      Console.log(mapLocation);
    }
  }, [mapLocation]);

  useEffect(() => {
    if (socket.id) Console.log("socket id:", socket.id);
  }, [socket.id]);

  return (
    <div
      className="relative w-full h-dvh bg-contain bg-[#0A0A0A]"

    >
      <Alert
        heading={alert.heading}
        text={alert.text}
        isVisible={alert.isVisible}
        onClose={hideAlert}
        type={alert.type}
      />
      <Sidebar />
      <div className="absolute w-full h-[120vh] z-0">
        <LiveMap geometry={routeGeometry} defaultLocation={mapLocation} />
      </div>

      <div className="flex flex-col justify-end h-screen absolute top-0 w-full pointer-events-none z-10">
        {showCaptainDetailsPanel && (
          <div className="pointer-events-auto absolute bottom-0 flex flex-col justify-start p-5 gap-3 rounded-t-2xl bg-[#111111] border-t border-[#2A2A2A] h-fit w-full shadow-2xl animate-slideUp">
            {/* Driver details */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="select-none rounded-full w-10 h-10 bg-[#252525] border border-[#2A2A2A] flex items-center justify-center">
                  <h1 className="text-sm font-bold text-white">
                    {captain?.fullname?.firstname[0]}
                    {captain?.fullname?.lastname[0]}
                  </h1>
                </div>

                <div>
                  <h1 className="text-base font-semibold leading-5 text-white">
                    {captain?.fullname?.firstname} {captain?.fullname?.lastname}
                  </h1>
                  <p className="text-xs flex items-center gap-1 text-[#8A8A8A]">
                    <Phone size={12} />
                    {captain?.phone}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs text-[#8A8A8A]">Today's Earnings</p>
                <h1 className="font-bold text-lg text-white">₹ {earnings.today}</h1>
              </div>
            </div>

            {/* Ride details */}
            <div className="grid grid-cols-3 gap-2 py-4 px-2 rounded-xl bg-[#171717] border border-[#2A2A2A]">
              <div className="flex flex-col items-center border-r border-[#2A2A2A]">
                <h1 className="mb-0.5 text-lg font-bold text-white">{rides?.accepted}</h1>
                <p className="text-[10px] text-[#8A8A8A] text-center uppercase tracking-wider font-semibold">
                  Accepted
                </p>
              </div>
              <div className="flex flex-col items-center border-r border-[#2A2A2A]">
                <h1 className="mb-0.5 text-lg font-bold text-white">{rides?.distanceTravelled}</h1>
                <p className="text-[10px] text-[#8A8A8A] text-center uppercase tracking-wider font-semibold">
                  Km Done
                </p>
              </div>
              <div className="flex flex-col items-center">
                <h1 className="mb-0.5 text-lg font-bold text-white">{rides?.cancelled}</h1>
                <p className="text-[10px] text-[#8A8A8A] text-center uppercase tracking-wider font-semibold">
                  Cancelled
                </p>
              </div>
            </div>

            {/* Car details */}
            <div className="flex justify-between border border-[#2A2A2A] items-center pl-4 py-2 bg-[#171717] rounded-xl">
              <div>
                <h1 className="text-base font-bold leading-5 text-white tracking-wide">
                  {captain?.vehicle?.number}
                </h1>
                <p className="text-xs text-[#8A8A8A] flex items-center gap-1 mt-0.5">
                  {captain?.vehicle?.color} | <User size={12} /> {captain?.vehicle?.capacity}
                </p>
              </div>

              <img
                className="rounded-full h-14 scale-x-[-1] brightness-125 mix-blend-luminosity pr-2"
                src={
                  captain?.vehicle?.type == "car"
                    ? "/car.png"
                    : `/${captain.vehicle.type}.webp`
                }
                alt="Driver vehicle"
              />
            </div>
          </div>
        )}

        <NewRide
          rideData={newRide}
          otp={otp}
          setOtp={setOtp}
          showBtn={showBtn}
          showPanel={showNewRidePanel}
          setShowPanel={setShowNewRidePanel}
          showPreviousPanel={setShowCaptainDetailsPanel}
          loading={loading}
          acceptRide={acceptRide}
          verifyOTP={verifyOTP}
          endRide={endRide}
          error={error}
        />
      </div>

    </div>
  );
}

export default CaptainHomeScreen;
