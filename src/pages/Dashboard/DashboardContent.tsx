"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPinIcon, SearchIcon, XIcon, MoonIcon, SunIcon } from "lucide-react";
import { ThemeProvider, useTheme } from "@/components/ThemeProvider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchBusRoutes } from "./Fetching";
import RenderMap from "./RenderMap";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { RouteSearchBox } from "./RouteSearchBox";
import { StopSearchBox } from "./StopSearchBox";

const busStops = [
  { id: "OuEr6xNuxEfZoAKxIAdr", name: "AV X/MC DONALD AV" },
  { id: "tNhr0PPoAz7A4kjMopvo", name: "ORIENTAL BL/HASTINGS ST" },
  { id: "MRVpJcrYsNCJehdsKs0f", name: "5 AV/86 ST" },
  { id: "W2SyXVFVSzsPWzbjaV54", name: "86 ST/11 AV" },
  { id: "9bZC4Xesrmx0ofEv9YMN", name: "86 ST/STILLWELL AV" },
  { id: "PBpgKCwlIXaUsesNXYlI", name: "BRIGHTON BEACH AV/CORBIN PL" },
  { id: "zI9aOXKQU7jgCDUdQ2Sf", name: "86 ST/20 AV" },
  { id: "tjS0Q0MRhQR8dKo4fBSP", name: "BRIGHTON BEACH AV/BRIGHTON 14 ST" },
  { id: "98Is7rsiyIp1QOgszSEo", name: "86 ST/NEW UTRECHT AV" },
  { id: "9MpoPNXhoSKllLNPPi6o", name: "87 ST/4 Av" },
];

export const DashboardContent = () => {
  const { theme, toggleTheme } = useTheme();
  const [busRoutes, setBusRoutes] = useState<string[]>([]);
  const [filteredRoutes, setFilteredRoutes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoute, setSelectedRoute] = useState("");
  const [startStop, setStartStop] = useState("");
  const [endStop, setEndStop] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [journeyDetails, setJourneyDetails] = useState<{
    arrivalTime: number;
    duration: number;
    endTime: number;
  } | null>(null);

  useEffect(() => {
    const fetchRoutes = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchBusRoutes();
        setBusRoutes(data);
      } catch (error) {
        setError("Failed to load bus routes");
        console.error("Error fetching bus routes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  const fetchBusArrivals = useCallback(async (route: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const arrivalTime = Math.floor(Math.random() * 15) + 1;
    const duration = Math.floor(Math.random() * 30) + 15;
    const endTime = arrivalTime + duration;
    setJourneyDetails({ arrivalTime, duration, endTime });
  }, []);

  useEffect(() => {
    if (selectedRoute) {
      fetchBusArrivals(selectedRoute);
    } else {
      setJourneyDetails(null);
    }
  }, [selectedRoute, startStop, fetchBusArrivals]);

  useEffect(() => {
    //if busroutes are available and it is an array
    if (!Array.isArray(busRoutes) || busRoutes.length === 0) return;
    //filter the busroutes based on the search term
    const filteredRoutes = busRoutes.filter((route) =>
      route.toLowerCase().includes(searchTerm.toLowerCase())
    );
    //set the filtered routes
    setFilteredRoutes(filteredRoutes);
  }, [busRoutes, searchTerm]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

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
                  htmlFor="route"
                  className="text-lg font-semibold mb-2 block dark:text-gray-200"
                >
                  Select Route
                </Label>
                <RouteSearchBox
                  placeholder="Select Route"
                  searchPlaceHolder="Search for route"
                  notFoundPlaceHolder="No routes found"
                  List={busRoutes}
                  value={selectedRoute}
                  setValue={setSelectedRoute}
                />

                {loading && <p>Loading routes...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {searchTerm && filteredRoutes.length > 0 && (
                  <ul className="mt-2 bg-white dark:bg-gray-700 rounded-md shadow-lg overflow-hidden">
                    {filteredRoutes.map((route) => (
                      <li
                        key={route}
                        className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition duration-150 ease-in-out"
                        onClick={() => {
                          setSelectedRoute(route);
                          setSearchTerm("");
                          setStartStop("");
                          setEndStop("");
                        }}
                      >
                        {route}
                      </li>
                    ))}
                  </ul>
                )}
                {searchTerm && filteredRoutes.length === 0 && (
                  <p className="mt-2 text-gray-500 dark:text-gray-400">
                    No routes found
                  </p>
                )}
              </CardContent>
            </Card>
            {selectedRoute && (
              <Card className="dark:bg-gray-800">
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label
                      htmlFor="startStop"
                      className="text-lg font-semibold mb-2 block dark:text-gray-200"
                    >
                      Starting Point
                    </Label>
                    <StopSearchBox
                      placeholder="Select starting point"
                      searchPlaceHolder="Search for stop"
                      notFoundPlaceHolder="No stops found"
                      stops={busStops}
                      value={startStop}
                      setValue={setStartStop}
                    />
                  </div>
                  {startStop && (
                    <div>
                      <Label
                        htmlFor="endStop"
                        className="text-lg font-semibold mb-2 block dark:text-gray-200"
                      >
                        Destination
                      </Label>
                      <StopSearchBox
                        placeholder="Select destination"
                        searchPlaceHolder="Search for stop"
                        notFoundPlaceHolder="No stops found"
                        stops={busStops}
                        value={endStop}
                        setValue={setEndStop}
                      />
                    </div>
                  )}
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
                    <span>Next Bus Arrival:</span>
                    <span>{journeyDetails.arrivalTime} min</span>
                  </div>
                  {endStop && (
                    <>
                      <div className="flex items-center justify-between">
                        <span>Estimated Journey Duration:</span>
                        <span>{journeyDetails.duration} min</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Estimated Arrival at Destination:</span>
                        <span>{journeyDetails.endTime} min</span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
          <div className="mt-6 lg:mt-0 lg:ml-8">
            <div className="h-full">
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
