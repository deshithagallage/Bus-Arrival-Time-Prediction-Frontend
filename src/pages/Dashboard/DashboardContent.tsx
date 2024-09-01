import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { MoonIcon, SunIcon, Loader2 } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { fetchBusRoutes, fetchBusStops } from "./Fetching";
import RenderMap from "./RenderMap";
import { RouteSearchBox } from "./RouteSearchBox";
import { StopSearchBox } from "./StopSearchBox";

export const DashboardContent = () => {
  const { theme, toggleTheme } = useTheme();
  const [busRoutes, setBusRoutes] = useState<string[]>([]);
  const [routesLoading, setRoutesLoading] = useState(false);
  const [routesError, setRoutesError] = useState<string | null>(null);

  const [selectedRoute, setSelectedRoute] = useState("");
  const [busStops, setBusStops] = useState<
    { id: string; name: string; longitude: null; latitude: null }[]
  >([]);
  const [stopsLoading, setStopsLoading] = useState(false);
  const [stopsError, setStopsError] = useState<string | null>(null);

  const [startStop, setStartStop] = useState("");
  const [endStop, setEndStop] = useState("");
  const [journeyDetails, setJourneyDetails] = useState<{
    arrivalTime: number;
    duration: number;
    endTime: number;
  } | null>(null);
  const [journeyLoading, setJourneyLoading] = useState(false);
  const [journeyError, setJourneyError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoutes = async () => {
      setRoutesLoading(true);
      setRoutesError(null);
      try {
        const data = await fetchBusRoutes();
        setBusRoutes(data);
      } catch (error) {
        setRoutesError("Failed to load bus routes");
        console.error("Error fetching bus routes:", error);
      } finally {
        setRoutesLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  const fetchBusArrivals = useCallback(async (route: string) => {
    setJourneyLoading(true);
    setJourneyError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const arrivalTime = Math.floor(Math.random() * 15) + 1;
      const duration = Math.floor(Math.random() * 30) + 15;
      const endTime = arrivalTime + duration;
      setJourneyDetails({ arrivalTime, duration, endTime });
    } catch (error) {
      setJourneyError("Failed to load journey details");
      console.error("Error fetching journey details:", error);
    } finally {
      setJourneyLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchStops = async () => {
      if (selectedRoute) {
        setStopsLoading(true);
        setStopsError(null);

        try {
          const data = await fetchBusStops(selectedRoute);
          setBusStops(data);
        } catch (error) {
          setStopsError("Failed to load bus stops");
          console.error("Error fetching bus stops:", error);
        } finally {
          setStopsLoading(false);
        }
      }
    };

    fetchStops();
  }, [selectedRoute]);

  useEffect(() => {
    if (startStop) {
      fetchBusArrivals(selectedRoute);
    }
  }, [startStop, selectedRoute, fetchBusArrivals]);

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
            <Card className="overflow-hidden dark:bg-gray-800 shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <Label
                    htmlFor="route"
                    className="text-lg font-semibold mb-2 lg:mb-0 dark:text-gray-200"
                  >
                    Select Route
                  </Label>
                  <div className="flex-grow lg:ml-4 lg:w-1/2">
                    <RouteSearchBox
                      placeholder="Select Route"
                      searchPlaceHolder="Search for route"
                      notFoundPlaceHolder="No routes found"
                      List={busRoutes}
                      value={selectedRoute}
                      setValue={setSelectedRoute}
                    />
                  </div>
                </div>
                {routesLoading && (
                  <div className="flex justify-center mt-4">
                    <Loader2 className="animate-spin text-gray-600 dark:text-gray-300" />
                    <p className="ml-2 text-gray-600 dark:text-gray-300">
                      Loading routes...
                    </p>
                  </div>
                )}
                {routesError && (
                  <p className="mt-4 text-red-500 font-semibold">
                    {routesError}
                  </p>
                )}
              </CardContent>
            </Card>
            {selectedRoute && (
              <Card className="dark:bg-gray-800 shadow-lg">
                <CardContent className="p-6 space-y-4">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <Label
                      htmlFor="startStop"
                      className="text-lg font-semibold mb-2 lg:mb-0 dark:text-gray-200"
                    >
                      Starting Point
                    </Label>
                    <div className="flex-grow lg:w-1/2">
                      <StopSearchBox
                        placeholder="Select starting point"
                        searchPlaceHolder="Search for stop"
                        notFoundPlaceHolder="No stops found"
                        stops={busStops}
                        value={startStop}
                        setValue={setStartStop}
                      />
                    </div>
                  </div>
                  {stopsLoading && (
                    <div className="flex justify-center mt-4">
                      <Loader2 className="animate-spin text-gray-600 dark:text-gray-300" />
                      <p className="ml-2 text-gray-600 dark:text-gray-300">
                        Loading stops...
                      </p>
                    </div>
                  )}
                  {stopsError && (
                    <p className="mt-4 text-red-500 font-semibold">
                      {stopsError}
                    </p>
                  )}
                  {startStop && (
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mt-4">
                      <Label
                        htmlFor="endStop"
                        className="text-lg font-semibold mb-2 lg:mb-0 dark:text-gray-200"
                      >
                        Destination
                      </Label>
                      <div className="flex-grow lg:w-1/2">
                        <StopSearchBox
                          placeholder="Select destination"
                          searchPlaceHolder="Search for stop"
                          notFoundPlaceHolder="No stops found"
                          stops={busStops}
                          value={endStop}
                          setValue={setEndStop}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            {(journeyDetails || journeyLoading) && (
              <Card className="dark:bg-gray-800 shadow-lg">
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                    Journey Details
                  </h3>
                  {journeyLoading ? (
                    <div className="flex justify-center mt-4">
                      <Loader2 className="animate-spin text-gray-600 dark:text-gray-300" />
                      <p className="ml-2 text-gray-600 dark:text-gray-300">
                        Loading journey details...
                      </p>
                    </div>
                  ) : journeyError ? (
                    <p className="mt-4 text-red-500 font-semibold">
                      {journeyError}
                    </p>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <span>Next Bus Arrival:</span>
                        <span>{journeyDetails?.arrivalTime} min</span>
                      </div>
                      {endStop && (
                        <>
                          <div className="flex items-center justify-between">
                            <span>Estimated Journey Duration:</span>
                            <span>{journeyDetails?.duration} min</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Estimated Arrival at Destination:</span>
                            <span>{journeyDetails?.endTime} min</span>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
          <div className="mt-6 lg:mt-0 lg:ml-8">
            <div className="h-full rounded-lg overflow-hidden shadow-lg">
              <RenderMap
                selectedRoute={selectedRoute}
                startStop={startStop}
                endStop={endStop}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
