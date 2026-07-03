import { ChevronDown } from "lucide-react";

const vehicles = [
  {
    id: 1,
    name: "Car",
    description: "Affordable, compact rides",
    type: "car",
    image: "car.png",
    price: 193.8,
  },
  {
    id: 2,
    name: "Bike",
    description: "Affordable, motorcycle rides",
    type: "bike",
    image: "bike.webp",
    price: 254.7,
  },
  {
    id: 3,
    name: "Auto",
    description: "Affordable, auto rides",
    type: "auto",
    image: "auto.webp",
    price: 200.0,
  },
];

function SelectVehicle({
  selectedVehicle,
  showPanel,
  setShowPanel,
  showPreviousPanel,
  showNextPanel,
  fare,
}) {
  return (
    <>
      <div
        className={`${showPanel ? "bottom-0" : "-bottom-[60%]"} transition-all duration-500 absolute bg-[#111111] border-t border-[#2A2A2A] w-full rounded-t-2xl p-4 pt-0`}
      >
        <div
          onClick={() => {
            setShowPanel(false);
            showPreviousPanel(true);
          }}
          className="flex justify-center py-3 pb-4 cursor-pointer"
        >
          <ChevronDown strokeWidth={2} className="text-[#5E5E5E]" size={20} />
        </div>
        <div className="space-y-2">
          {vehicles.map((vehicle, index) => (
            <Vehicle
              key={vehicle.id}
              vehicle={vehicle}
              fare={fare}
              selectedVehicle={selectedVehicle}
              setShowPanel={setShowPanel}
              showNextPanel={showNextPanel}
            />
          ))}
        </div>
      </div>
    </>
  );
}

const Vehicle = ({
  vehicle,
  selectedVehicle,
  fare,
  setShowPanel,
  showNextPanel,
}) => {
  return (
    <div
      onClick={() => {
        selectedVehicle(vehicle.type);
        setShowPanel(false);
        showNextPanel(true);
      }}
      className="cursor-pointer flex items-center w-full rounded-xl border border-[#2A2A2A] transition-all duration-200 bg-[#171717] hover:border-white hover:bg-[#1E1E1E] overflow-hidden"
    >
      <div className="py-3 pl-2">
        <img
          src={`/${vehicle.image}`}
          className="w-24 scale-75 mix-blend-luminosity brightness-150"
        />
      </div>
      <div className="h-full w-full">
        <h1 className="text-base font-semibold leading-6 text-white">{vehicle.name}</h1>
        <p className="text-xs text-[#8A8A8A]">{vehicle.description}</p>
      </div>
      <div className="h-12 w-28 flex items-center justify-end pr-4">
        <h3 className="font-semibold text-white">₹ {fare[vehicle.type]}</h3>
      </div>
    </div>
  );
};
export default SelectVehicle;
