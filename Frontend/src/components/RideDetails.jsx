import {
  CreditCard,
  MapPinMinus,
  MapPinPlus,
  PhoneCall,
  SendHorizontal,
} from "lucide-react";
import Button from "./Button";

function RideDetails({
  pickupLocation,
  destinationLocation,
  selectedVehicle,
  fare,
  showPanel,
  setShowPanel,
  showPreviousPanel,
  createRide,
  cancelRide,
  loading,
  rideCreated,
  confirmedRideData,
}) {
  return (
    <>
      <div
        className={`${
          showPanel ? "bottom-0" : "-bottom-[60%]"
        } transition-all duration-500 absolute bg-[#111111] border-t border-[#2A2A2A] w-full rounded-t-2xl p-4 pt-2`}
      >
        <div>
          {rideCreated && !confirmedRideData && (
            <>
              <h1 className="text-center text-[#CFCFCF] text-sm py-2">Looking for nearby drivers</h1>
              <div className="overflow-y-hidden py-1 pb-3">
                <div className="h-[2px] rounded-full bg-white animate-pulse-bar origin-left"></div>
              </div>
            </>
          )}
          <div
            className={`flex ${
              confirmedRideData ? " justify-between " : " justify-center "
            } pt-2 pb-4`}
          >
            <div>
              <img
                src={
                  selectedVehicle == "car"
                    ? "/car.png"
                    : `/${selectedVehicle}.webp`
                }
                className={`${confirmedRideData ? " h-20" : " h-12 "} brightness-150 mix-blend-luminosity`}
              />
            </div>

            {confirmedRideData?._id && (
              <div className="leading-4 text-right">
                <h1 className="text-sm text-[#CFCFCF]">
                  {confirmedRideData?.captain?.fullname?.firstname}{" "}
                  {confirmedRideData?.captain?.fullname?.lastname}
                </h1>
                <h1 className="font-semibold text-white">
                  {confirmedRideData?.captain?.vehicle?.number}
                </h1>
                <h1 className="capitalize text-xs text-[#8A8A8A]">
                  {" "}
                  {confirmedRideData?.captain?.vehicle?.color}{" "}
                  {confirmedRideData?.captain?.vehicle?.type}
                </h1>
                <span className="mt-2 inline-block bg-white text-[#0A0A0A] px-3 py-1.5 rounded-lg font-bold text-sm tracking-wider">
                  OTP: {confirmedRideData?.otp}
                </span>
              </div>
            )}
          </div>
          {confirmedRideData?._id && (
            <div className="flex gap-2 mb-3">
              <Button
                type={"link"}
                path={`/user/chat/${confirmedRideData?._id}`}
                title={"Send a message..."}
                icon={<SendHorizontal strokeWidth={1.5} size={16} />}
                classes={"bg-[#171717] border border-[#2A2A2A] font-medium text-sm text-[#CFCFCF] hover:bg-[#252525]"}
              />
              <div className="flex items-center justify-center w-14 rounded-xl bg-[#171717] border border-[#2A2A2A] hover:bg-[#252525] transition-colors duration-200">
                <a href={"tel:" + confirmedRideData?.captain?.phone}>
                  <PhoneCall size={16} strokeWidth={2} className="text-white" />
                </a>
              </div>
            </div>
          )}
          <div className="mb-3 space-y-0">
            {/* Pickup Location */}
            <div className="flex items-center gap-3 border-t border-[#2A2A2A] py-3 px-2">
              <MapPinMinus size={18} className="text-[#8A8A8A] flex-shrink-0" />
              <div>
                <h1 className="text-base font-semibold leading-5 text-white">
                  {pickupLocation.split(", ")[0]}
                </h1>
                <div className="flex">
                  <p className="text-xs text-[#8A8A8A] inline">
                    {pickupLocation.split(", ").map((location, index) => {
                      if (index > 0) {
                        return (
                          <span key={index}>
                            {location}
                            {index < pickupLocation.split(", ").length - 1 &&
                              ", "}
                          </span>
                        );
                      }
                      return null;
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Destination Location */}
            <div className="flex items-center gap-3 border-t border-[#2A2A2A] py-3 px-2">
              <MapPinPlus size={18} className="text-[#8A8A8A] flex-shrink-0" />
              <div>
                <h1 className="text-base font-semibold leading-5 text-white">
                  {destinationLocation.split(", ")[0]}
                </h1>
                <div className="flex">
                  <p className="text-xs text-[#8A8A8A] inline">
                    {destinationLocation.split(", ").map((location, index) => {
                      if (index > 0) {
                        return (
                          <span key={index}>
                            {location}
                            {index <
                              destinationLocation.split(", ").length - 1 &&
                              ", "}
                          </span>
                        );
                      }
                      return null;
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Fare */}
            <div className="flex items-center gap-3 border-t border-[#2A2A2A] py-3 px-2">
              <CreditCard size={18} className="text-[#8A8A8A] flex-shrink-0" />
              <div>
                <h1 className="text-base font-semibold leading-6 text-white">
                  ₹ {fare[selectedVehicle]}
                </h1>
                <p className="text-xs text-[#8A8A8A]">Cash</p>
              </div>
            </div>
          </div>
          {rideCreated || confirmedRideData ? (
            <Button
              title={"Cancel Ride"}
              loading={loading}
              classes={"bg-[#1E1E1E] border border-[#2A2A2A] text-white hover:bg-[#303030]"}
              fun={cancelRide}
            />
          ) : (
            <Button title={"Confirm Ride"} fun={createRide} loading={loading} />
          )}
        </div>
      </div>
    </>
  );
}

export default RideDetails;
