import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { fetchArrivalTime, fetchBusRoutes, fetchBusStops } from "./Fetching";
import RenderMap from "./RenderMap";
import { RouteSearchBox } from "../../../components/RouteSearchBox";
import { StopSearchBox } from "../../../components/StopSearchBox";
import ArrivalTimeText from "./ArrivalTimeText";
import LiveDateTime from "../../../components/LiveDateTime";
import NavBar from "@/components/Navbar/Navbar";

export const NextBusContent = () => {
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
        setJourneyDetails(null);

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
        //const endTime = await fetchArrivalTime(time, selectedRoute, endStop);
        const endTime = time + Math.random() * 6 + 1;

        setJourneyDetails({
          arrivalTime: time,
          duration: endTime - time,
          endTime,
        });
        return;
      } else {
        const duration = Math.floor(Math.random() * (6 - 1 + 1)) + 1;
        setJourneyDetails({
          arrivalTime: time,
          duration: duration,
          endTime: time + duration,
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
      fetchBusArrivals(true);
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
    <div className="min-h-screen bg-background text-foreground py-4 px-2 sm:py-8 sm:px-4 mt-16">
      <div className="max-w-7xl mx-auto">
        <NavBar currentPage="next-bus" />
        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
          <div className="space-y-6">
            <Card className="overflow-hidden shadow-lg">
              <CardContent className="p-6">
                <LiveDateTime />
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
              <Card className=" shadow-lg">
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
                          stops={busStops.filter(
                            (stop) => stop.name !== startStop
                          )}
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
                        <span>
                          <strong>Next Bus Arrival:</strong>
                        </span>
                        <ArrivalTimeText
                          time={journeyDetails?.arrivalTime}
                          colour={true}
                        />
                      </div>
                      {endStop && (
                        <>
                          <div className="flex items-center justify-between">
                            <span>
                              <strong>Estimated Journey Duration:</strong>
                            </span>
                            <ArrivalTimeText
                              time={journeyDetails?.duration}
                              isDuration={true}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span>
                              <strong>Estimated Arrival at Destination:</strong>
                            </span>
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
