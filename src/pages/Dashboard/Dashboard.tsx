import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPinIcon, SearchIcon, XIcon, MoonIcon, SunIcon } from "lucide-react";
import { ThemeProvider, useTheme } from "@/components/ThemeProvider";

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

function DashboardContent() {
  const { theme, toggleTheme } = useTheme();

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
    <div className="bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-700 dark:to-purple-800 rounded-lg flex items-center justify-center text-white p-6 h-full min-h-[300px]">
      <div className="text-center">
        <MapPinIcon className="w-16 h-16 mx-auto mb-4" />
        <span className="text-xl font-semibold">
          {/* ... (keep the existing content) */}
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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Bus Arrival Time
          </h1>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
          >
            {theme === "light" ? (
              <MoonIcon className="h-[1.2rem] w-[1.2rem]" />
            ) : (
              <SunIcon className="h-[1.2rem] w-[1.2rem]" />
            )}
          </Button>
        </div>
        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
          <div className="space-y-6">
            <Card className="overflow-hidden dark:bg-gray-800">
              <CardContent className="p-6">
                <Label
                  htmlFor="startStop"
                  className="text-lg font-semibold mb-2 block dark:text-gray-200"
                >
                  Starting Point
                </Label>
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  <Input
                    id="startStop"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
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
                  <ul className="mt-2 bg-white dark:bg-gray-700 rounded-md shadow-lg overflow-hidden">
                    {filteredStops.map((stop) => (
                      <li
                        key={stop.id}
                        className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition duration-150 ease-in-out"
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
              <Card className="dark:bg-gray-800">
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label className="text-lg font-semibold mb-2 block dark:text-gray-200">
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
                          className={`justify-between h-auto py-2 ${
                            selectedBus === busId
                              ? "bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
                              : "bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                          }`}
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
                      className="text-lg font-semibold mb-2 block dark:text-gray-200"
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
                      className="w-full mt-1 border-2 border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
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
              <Card className="dark:bg-gray-800">
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
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
            <div className="h-full">{renderMap()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <ThemeProvider>
      <DashboardContent />
    </ThemeProvider>
  );
}
