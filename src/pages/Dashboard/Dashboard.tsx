"use client";

import { useState, useEffect } from "react";
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

// Updated stops data
const busStops = [
  {
    id: "OuEr6xNuxEfZoAKxIAdr",
    name: "AV X/MC DONALD AV",
    longitude: null,
    latitude: null,
  },
  {
    id: "tNhr0PPoAz7A4kjMopvo",
    name: "ORIENTAL BL/HASTINGS ST",
    longitude: null,
    latitude: null,
  },
  {
    id: "MRVpJcrYsNCJehdsKs0f",
    name: "5 AV/86 ST",
    longitude: null,
    latitude: null,
  },
  {
    id: "W2SyXVFVSzsPWzbjaV54",
    name: "86 ST/11 AV",
    longitude: null,
    latitude: null,
  },
  {
    id: "9bZC4Xesrmx0ofEv9YMN",
    name: "86 ST/STILLWELL AV",
    longitude: null,
    latitude: null,
  },
  {
    id: "PBpgKCwlIXaUsesNXYlI",
    name: "BRIGHTON BEACH AV/CORBIN PL",
    longitude: null,
    latitude: null,
  },
  {
    id: "zI9aOXKQU7jgCDUdQ2Sf",
    name: "86 ST/20 AV",
    longitude: null,
    latitude: null,
  },
  {
    id: "tjS0Q0MRhQR8dKo4fBSP",
    name: "BRIGHTON BEACH AV/BRIGHTON 14 ST",
    longitude: null,
    latitude: null,
  },
  {
    id: "98Is7rsiyIp1QOgszSEo",
    name: "86 ST/NEW UTRECHT AV",
    longitude: null,
    latitude: null,
  },
  {
    id: "9MpoPNXhoSKllLNPPi6o",
    name: "87 ST/4 Av",
    longitude: null,
    latitude: null,
  },
];

// Updated routes data
const busRoutes = [
  "Q112",
  "Q103",
  "Q110",
  "M50",
  "Q53",
  "QM31",
  "Q65",
  "B84",
  "X2",
  "Bx36",
  "X14",
  "B49",
  "Q16",
  "Q113",
  "S98",
  "B1",
  "X19",
  "Q26",
  "X8",
  "Bx46",
  "Q67",
  "Q72",
];

function DashboardContent() {
  const { theme, toggleTheme } = useTheme();

  const [selectedRoute, setSelectedRoute] = useState("");
  const [startStop, setStartStop] = useState("");
  const [endStop, setEndStop] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [busArrivals, setBusArrivals] = useState<{ [key: string]: number }>({});
  const [journeyDetails, setJourneyDetails] = useState<{
    arrivalTime: number;
    duration: number;
    endTime: number;
  } | null>(null);

  useEffect(() => {
    if (selectedRoute) {
      // Simulate fetching bus arrivals data with a delay
      const fetchBusArrivals = async () => {
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
        setBusArrivals({ [selectedRoute]: Math.floor(Math.random() * 15) + 1 });
      };

      fetchBusArrivals();
    }
  }, [selectedRoute]);

  useEffect(() => {
    if (startStop && selectedRoute) {
      // Simulate fetching journey details with a delay
      const fetchJourneyDetails = async () => {
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

        const arrivalTime = busArrivals[selectedRoute];
        const duration = Math.floor(Math.random() * 30) + 15;
        const endTime = arrivalTime + duration;
        setJourneyDetails({ arrivalTime, duration, endTime });
      };

      fetchJourneyDetails();
    } else {
      setJourneyDetails(null);
    }
  }, [startStop, selectedRoute, busArrivals]);

  const filteredRoutes = busRoutes.filter((route) =>
    route.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderMap = () => (
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
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  <Input
                    id="route"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                    placeholder="Search for route"
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
                    <Select
                      value={startStop}
                      onValueChange={(value) => {
                        setStartStop(value);
                        setEndStop("");
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select starting point" />
                      </SelectTrigger>
                      <SelectContent>
                        {busStops.map((stop) => (
                          <SelectItem key={stop.id} value={stop.id}>
                            {stop.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {startStop && (
                    <div>
                      <Label
                        htmlFor="endStop"
                        className="text-lg font-semibold mb-2 block dark:text-gray-200"
                      >
                        Destination
                      </Label>
                      <Select
                        value={endStop}
                        onValueChange={(value) => setEndStop(value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select destination" />
                        </SelectTrigger>
                        <SelectContent>
                          {busStops
                            .filter((stop) => stop.id !== startStop)
                            .map((stop) => (
                              <SelectItem key={stop.id} value={stop.id}>
                                {stop.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
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
