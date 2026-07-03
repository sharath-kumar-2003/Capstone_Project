import { MapPin } from "lucide-react";
import Console from "../utils/console";

const locationSuggestions = [
  { name: "Central Park", location: "New York, NY, USA" },
  { name: "Eiffel Tower", location: "Paris, France" },
  { name: "Marina Bay Sands", location: "Singapore" },
  { name: "Burj Khalifa", location: "Dubai, UAE" },
  { name: "Sydney Opera House", location: "Sydney, Australia" },
  { name: "Golden Gate Bridge", location: "San Francisco, CA, USA" },
  { name: "Taj Mahal", location: "Agra, India" },
  { name: "Great Wall", location: "Beijing, China" },
  { name: "Niagara Falls", location: "Ontario, Canada" },
  { name: "Colosseum", location: "Rome, Italy" },
];
function LocationSuggestions({
  suggestions = [],
  setSuggestions,
  setPickupLocation,
  setDestinationLocation,
  input,
}) {
  return (
    <div className="animate-fadeIn">
      {suggestions.map((suggestion, index) => (
        <div
          onClick={() => {
            Console.log(suggestion);
            if (input == "pickup") {
              setPickupLocation(suggestion);
              setSuggestions([]);
            }
            if (input == "destination") {
              setDestinationLocation(suggestion);
              setSuggestions([]);
            }
          }}
          key={index}
          className="cursor-pointer flex items-center gap-3 border-b border-[#2A2A2A] last:border-b-0 py-3 hover:bg-[#252525] rounded-lg px-2 transition-colors duration-200"
        >
          <div className="bg-[#1E1E1E] border border-[#2A2A2A] p-2 rounded-full flex-shrink-0">
            <MapPin size={16} className="text-[#8A8A8A]" />
          </div>
          <div>
            <h2 className="text-sm font-medium text-white">{suggestion}</h2>
          </div>
        </div>
      ))}
    </div>
  );
}

export default LocationSuggestions;
