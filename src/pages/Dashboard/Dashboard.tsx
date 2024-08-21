import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPinIcon, SearchIcon, XIcon } from "lucide-react";

// Simulated data (Replace with fetch calls to your API)
const busStops = [
  { id: "1", name: "Central Station" },
  { id: "2", name: "Market Street" },
  { id: "3", name: "University Campus" },
  { id: "4", name: "Shopping Mall" },
  { id: "5", name: "Riverside Park" },
];

const busRoutes = [
  { id: "101", name: "Express 101", stops: ["1", "2", "4"] },
  { id: "202", name: "Local 202", stops: ["1", "2", "3", "4", "5"] },
  { id: "303", name: "Rapid 303", stops: ["1", "3", "5"] },
];

export default function Dashboard() {
  const [startStop, setStartStop] = useState<string>("");
  const [endStop, setEndStop] = useState<string>("");
  const [selectedBus, setSelectedBus] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [busArrivals, setBusArrivals] = useState<{ [key: string]: number }>({});
  const [journeyDetails, setJourneyDetails] = useState<{
    arrivalTime: number;
    duration: number;
    endTime: number;
  } | null>(null);

  useEffect(() => {
    if (startStop) {
      // Simulate fetching bus arrivals data with a delay
      const fetchBusArrivals = async () => {
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

        const arrivals = busRoutes.reduce((acc, route) => {
          if (route.stops.includes(startStop)) {
            acc[route.id] = Math.floor(Math.random() * 15) + 1;
          }
          return acc;
        }, {} as { [key: string]: number });

        setBusArrivals(arrivals);
      };

      fetchBusArrivals();
    }
  }, [startStop]);

  useEffect(() => {
    if (startStop && selectedBus && endStop) {
      // Simulate fetching journey details with a delay
      const fetchJourneyDetails = async () => {
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

        const arrivalTime = busArrivals[selectedBus];
        const duration = Math.floor(Math.random() * 30) + 15;
        const endTime = arrivalTime + duration;
        setJourneyDetails({ arrivalTime, duration, endTime });
      };

      fetchJourneyDetails();
    } else {
      setJourneyDetails(null);
    }
  }, [startStop, selectedBus, endStop, busArrivals]);

  const filteredStops = busStops.filter((stop) =>
    stop.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const availableBuses = Object.keys(busArrivals);

  const availableEndStops = selectedBus
    ? busRoutes
        .find((route) => route.id === selectedBus)
        ?.stops.filter((stop) => stop !== startStop) || []
    : busStops.filter((stop) => stop.id !== startStop).map((stop) => stop.id);

  const renderMap = () => (
    <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white p-6 h-full min-h-[300px]">
      <div className="text-center">
        <MapPinIcon className="w-16 h-16 mx-auto mb-4" />
        <span className="text-xl font-semibold">
          {!startStop && "Select your starting point"}
          {startStop &&
            !selectedBus &&
            !endStop &&
            "Choose your bus or destination"}
          {startStop && selectedBus && !endStop && "Select your destination"}
          {startStop && !selectedBus && endStop && "Choose your bus"}
          {startStop && selectedBus && endStop && "Your journey is planned!"}
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Bus Arrival Time
        </h1>
        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <Label
                  htmlFor="startStop"
                  className="text-lg font-semibold mb-2 block"
                >
                  Starting Point
                </Label>
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    id="startStop"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Search for starting point"
                  />
                  {searchTerm && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() => setSearchTerm("")}
                    >
                      <XIcon className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {searchTerm && (
                  <ul className="mt-2 bg-white rounded-md shadow-lg overflow-hidden">
                    {filteredStops.map((stop) => (
                      <li
                        key={stop.id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition duration-150 ease-in-out"
                        onClick={() => {
                          setStartStop(stop.id);
                          setSearchTerm("");
                          setSelectedBus("");
                          setEndStop("");
                        }}
                      >
                        {stop.name}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
            {startStop && (
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label className="text-lg font-semibold mb-2 block">
                      Select Your Bus
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {availableBuses.map((busId) => (
                        <Button
                          key={busId}
                          variant={
                            selectedBus === busId ? "default" : "outline"
                          }
                          onClick={() => {
                            setSelectedBus(busId);
                            setEndStop("");
                          }}
                          className="justify-between h-auto py-2"
                        >
                          <span>
                            {
                              busRoutes.find((route) => route.id === busId)
                                ?.name
                            }
                          </span>
                          <span className="text-sm">
                            {busArrivals[busId]} min
                          </span>
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label
                      htmlFor="endStop"
                      className="text-lg font-semibold mb-2 block"
                    >
                      Destination
                    </Label>
                    <select
                      id="endStop"
                      value={endStop}
                      onChange={(e) => {
                        setEndStop(e.target.value);
                        if (!selectedBus) {
                          const possibleBuses = busRoutes.filter(
                            (route) =>
                              route.stops.includes(startStop) &&
                              route.stops.includes(e.target.value)
                          );
                          if (possibleBuses.length > 0) {
                            setSelectedBus(possibleBuses[0].id);
                          }
                        }
                      }}
                      className="w-full mt-1 border-2 border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select destination</option>
                      {availableEndStops.map((stopId) => {
                        const stop = busStops.find((s) => s.id === stopId);
                        return (
                          <option key={stopId} value={stopId}>
                            {stop?.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </CardContent>
              </Card>
            )}
            {journeyDetails && (
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Journey Details
                  </h3>
                  <div className="flex items-center justify-between">
                    <span>Arrival Time:</span>
                    <span>{journeyDetails.arrivalTime} min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Duration:</span>
                    <span>{journeyDetails.duration} min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>End Time:</span>
                    <span>{journeyDetails.endTime} min</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          <div className="mt-6 lg:mt-0 lg:ml-8">
            <div className="h-full">
              {renderMap()}
              {/* Here you could also include a component for the map,
which would be updated based on the selected stops. */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
