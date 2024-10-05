import { MapPinIcon } from "lucide-react";

interface RenderMapProps {
  selectedRoute: string;
  startStop: string;
  endStop: string;
}

const RenderMap = ({ selectedRoute, startStop, endStop }: RenderMapProps) => (
  <div className="bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-700 dark:to-purple-800 rounded-lg flex items-center justify-center text-white p-6 h-full min-h-[300px]">
    <div className="text-center">
      <MapPinIcon className="w-16 h-16 mx-auto mb-4" />
      <span className="text-xl font-semibold">
        {!selectedRoute && "Select a route"}
        {selectedRoute && !startStop && "Select your starting point"}
        {selectedRoute && startStop && !endStop && "Select your destination"}
        {selectedRoute && startStop && endStop && "Your journey is planned!"}
      </span>
    </div>
  </div>
);

export default RenderMap;
