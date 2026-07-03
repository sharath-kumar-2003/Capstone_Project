import {
  CreditCard,
  MapPinMinus,
  MapPinPlus,
  PhoneCall,
  SendHorizontal,
} from "lucide-react";
import Button from "./Button";

function NewRide({
  rideData,
  otp,
  setOtp,
  showBtn,
  showPanel,
  setShowPanel,
  showPreviousPanel,
  loading,
  acceptRide,
  endRide,
  verifyOTP,
  error,
}) {
  const ignoreRide = () => {
    setShowPanel(false);
    showPreviousPanel(true);
  };

  return (
    <>
      <div
        className={`${
          showPanel ? "bottom-0" : "-bottom-[60%]"
        } transition-all duration-500 absolute bg-[#111111] border-t border-[#2A2A2A] w-full rounded-t-2xl p-4 pt-0`}
      >
        <div>
          <div className="flex justify-between items-center pb-4 pt-3">
            <div className="flex items-center gap-3">
              <div className="my-1 select-none rounded-full w-10 h-10 bg-[#252525] border border-[#2A2A2A] flex items-center justify-center">
                <h1 className="text-sm font-bold text-white">
                  {rideData?.user?.fullname?.firstname[0]}
                  {rideData?.user?.fullname?.lastname[0]}
                </h1>
              </div>

              <div>
                <h1 className="text-base font-semibold leading-6 text-white">
                  {rideData?.user?.fullname?.firstname}{" "}
                  {rideData?.user?.fullname?.lastname}
                </h1>
                <p className="text-xs text-[#8A8A8A]">
                  {rideData?.user?.phone || rideData?.user?.email}
                </p>
              </div>
            </div>

            <div className="text-right">
              <h1 className="font-bold text-lg text-white">₹ {rideData?.fare}</h1>
              <p className="text-xs text-[#8A8A8A]">
                {(Number(rideData?.distance?.toFixed(2)) / 1000)?.toFixed(1)} Km
              </p>
            </div>
          </div>

          {/* Message and call */}
          {showBtn != "accept" && (
            <div className="flex gap-2 mb-3">
              <Button
                type={"link"}
                path={`/captain/chat/${rideData?._id}`}
                title={"Send a message..."}
                icon={<SendHorizontal strokeWidth={1.5} size={16} />}
                classes={"bg-[#171717] border border-[#2A2A2A] font-medium text-sm text-[#CFCFCF] hover:bg-[#252525]"}
              />
              <div className="flex items-center justify-center w-14 rounded-xl bg-[#171717] border border-[#2A2A2A] hover:bg-[#252525] transition-colors duration-200">
                <a href={"tel:" + rideData?.user?.phone}>
                  <PhoneCall size={16} strokeWidth={2} className="text-white" />
                </a>
              </div>
            </div>
          )}

          <div className="space-y-0">
            {/* Pickup Location */}
            <div className="flex items-center gap-3 border-t border-[#2A2A2A] py-3 px-2">
              <MapPinMinus size={18} className="text-[#8A8A8A] flex-shrink-0" />
              <div>
                <h1 className="text-base font-semibold leading-5 text-white">
                  {rideData.pickup.split(", ")[0]}
                </h1>
                <div className="flex">
                  <p className="text-xs text-[#8A8A8A] inline">
                    {rideData.pickup.split(", ").map((location, index) => {
                      if (index > 0) {
                        return (
                          <span key={index}>
                            {location}
                            {index < rideData.pickup.split(", ").length - 1 &&
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
                  {rideData.destination.split(", ")[0]}
                </h1>
                <div className="flex">
                  <p className="text-xs text-[#8A8A8A] inline">
                    {rideData.destination.split(", ").map((location, index) => {
                      if (index > 0) {
                        return (
                          <span key={index}>
                            {location}
                            {index <
                              rideData.destination.split(", ").length - 1 &&
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
                  ₹ {rideData.fare}
                </h1>
                <p className="text-xs text-[#8A8A8A]">Cash</p>
              </div>
            </div>
          </div>

          {showBtn == "accept" ? (
            <div className="flex gap-2 mt-2">
              <Button
                title={"Ignore"}
                loading={loading}
                fun={ignoreRide}
                classes={"bg-[#171717] border border-[#2A2A2A] text-white hover:bg-[#252525]"}
              />
              <Button title={"Accept"} fun={acceptRide} loading={loading} />
            </div>
          ) : showBtn == "otp" ? (
            <div className="mt-2">
              <input
                type="number"
                minLength={6}
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder={"Enter OTP"}
                className="w-full bg-[#171717] border border-[#2A2A2A] px-4 py-3 rounded-[14px] outline-none text-sm text-white placeholder:text-[#5E5E5E] transition-all duration-200 focus:border-white focus:shadow-[0_0_0_3px_rgba(255,255,255,0.06)] mb-2"
              />
              {error && (
                <p className="text-[#9A9A9A] text-xs mb-2 text-center">{error}</p>
              )}
              <Button title={"Verify OTP"} loading={loading} fun={verifyOTP} />{" "}
            </div>
          ) : (
            <div className="mt-2">
              <Button
                title={"End Ride"}
                fun={endRide}
                loading={loading}
                classes={"bg-white text-[#0A0A0A] hover:bg-[#E5E5E5]"}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default NewRide;
