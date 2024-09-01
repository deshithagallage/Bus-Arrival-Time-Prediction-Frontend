import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { MoonIcon, SunIcon, Loader2 } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { fetchArrivalTime, fetchBusRoutes, fetchBusStops } from "./Fetching";
import RenderMap from "./RenderMap";
import { RouteSearchBox } from "./RouteSearchBox";
import { StopSearchBox } from "./StopSearchBox";
import ArrivalTimeText from "./ArrivalTimeText";

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

  useEffect(() => {
    const fetchStops = async () => {
      if (selectedRoute) {
        setStopsLoading(true);
        setStopsError(null);
        //clear
        setStartStop("");
        setEndStop("");

        try {
          const data = await fetchBusStops(selectedRoute, 0);
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

  const fetchBusArrivals = async (bothStartStop = false) => {
    setJourneyLoading(true);
    try {
      const time = await fetchArrivalTime(0, selectedRoute, startStop);
      if (bothStartStop) {
        const endTime = await fetchArrivalTime(time, selectedRoute, endStop);
        setJourneyDetails({
          arrivalTime: time,
          duration: endTime - time,
          endTime,
        });
        return;
      } else {
        setJourneyDetails({
          arrivalTime: time,
          duration: 0,
          endTime: 0,
        });
      }
    } catch (error) {
      setJourneyError("Failed to load journey details");
      console.error("Error fetching journey details:", error);
    } finally {
      setJourneyLoading(false);
    }
  };

  useEffect(() => {
    if (startStop && endStop) {
      fetchBusArrivals();
    }
  }, [endStop]);

  useEffect(() => {
    if (endStop) {
      //clear
      setJourneyDetails(null);
    }
    if (startStop) {
      fetchBusArrivals();
    }
  }, [startStop]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-row items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Bus Arrival Time
          </h1>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full mt-4 sm:mt-0 ml-0 sm:ml-4"
          >
            {theme === "light" ? (
              <MoonIcon className="h-[1.1rem] w-[1.1rem]" />
            ) : (
              <SunIcon className="h-[1.1rem] w-[1.1rem]" />
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
                  <div className="w-full sm:max-w-fit">
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
                    <div className="w-full sm:max-w-fit">
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
                      <div className="w-full sm:max-w-fit">
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
                        <ArrivalTimeText
                          time={journeyDetails?.arrivalTime}
                          colour={true}
                        />
                      </div>
                      {endStop && (
                        <>
                          <div className="flex items-center justify-between">
                            <span>Estimated Journey Duration:</span>
                            <ArrivalTimeText
                              time={journeyDetails?.duration}
                              isDuration={true}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Estimated Arrival at Destination:</span>
                            <ArrivalTimeText time={journeyDetails?.endTime} />
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
            <div className="h-[300px] sm:h-[400px] lg:h-[500px] rounded-lg overflow-hidden shadow-lg">
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
