"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Clock, Bus, Calendar } from "lucide-react";
import { fetchStats } from "./Fetching";
import { RouteSearchBox } from "@/components/RouteSearchBox";
import LiveDateTime from "@/components/LiveDateTime";
import NavBar from "@/components/Navbar/Navbar";
import { fetchBusRoutes } from "../NextBus/Fetching";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

type HourlyCount = {
  [key: string]: number;
};

type StatsData = {
  id: string;
  route_name: string;
  day_of_week: string;
  peak_hour: number;
  off_peak_hour: number;
  hourly_counts: HourlyCount;
};

const formatHourlyData = (hourlyData: HourlyCount) => {
  return Object.entries(hourlyData).map(([hour, count]) => ({
    hour: parseInt(hour),
    count: count,
  }));
};

const chartConfig = {
  busCount: {
    label: "Bus Count",
    color: "hsl(var(--chart-1))",
  },
};

const formatHour = (hour: number) => {
  const ampm = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;
  return `${formattedHour} ${ampm}`;
};

export default function StatsContent() {
  const [busRoutes, setBusRoutes] = useState<string[]>([]);
  const [routesLoading, setRoutesLoading] = useState(false);
  const [routesError, setRoutesError] = useState<string | null>(null);

  const [selectedRoute, setSelectedRoute] = useState("");
  const [stats, setStats] = useState<{ [key: string]: StatsData }>({});
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);

  const [selectedDay, setSelectedDay] = useState("");
  const [today] = useState(
    new Date().toLocaleDateString("en-US", { weekday: "long" })
  );

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
    const fetchHourlyStats = async () => {
      if (selectedRoute) {
        setStatsLoading(true);
        setStatsError(null);
        try {
          for (const day of daysOfWeek) {
            const data = await fetchStats(selectedRoute, day);
            setStats((prev) => ({ ...prev, [day]: data }));
          }
          setSelectedDay(today);
        } catch (error) {
          setStatsError("Failed to load bus stats");
          console.error("Error fetching bus stats:", error);
        } finally {
          setStatsLoading(false);
        }
      }
    };

    fetchHourlyStats();
  }, [selectedRoute, today]);

  const selectedDayData = useMemo(
    () => stats[selectedDay],
    [stats, selectedDay]
  );
  const formattedData = useMemo(
    () =>
      selectedDayData ? formatHourlyData(selectedDayData.hourly_counts) : [],
    [selectedDayData]
  );

  const totalBuses = useMemo(
    () => formattedData.reduce((sum, data) => sum + data.count, 0),
    [formattedData]
  );

  const weeklyData = useMemo(() => {
    return daysOfWeek.map((day) => {
      const dayData = stats[day];
      if (!dayData) return { day, totalBuses: 0 };
      const totalBuses = Object.values(dayData.hourly_counts).reduce(
        (sum, count) => sum + count,
        0
      );
      return { day, totalBuses };
    });
  }, [stats]);

  const bestWeekday = useMemo(() => {
    if (weeklyData.length === 0) return null;
    return weeklyData.reduce((best, current) =>
      current.totalBuses > best.totalBuses ? current : best
    );
  }, [weeklyData]);

  const peakHourInfo = useMemo(() => {
    if (!selectedDayData) return null;
    const peakHour = selectedDayData.peak_hour;
    const busCount = selectedDayData.hourly_counts[peakHour];
    return { hour: peakHour, count: busCount };
  }, [selectedDayData]);

  //suggestText
  const SuggestText = ({
    selectedDayData,
    bestWeekday,
    peakHourInfo,
  }: {
    selectedDayData: StatsData | null;
    bestWeekday: { day: string; totalBuses: number } | null;
    peakHourInfo: { hour: number; count: number } | null;
  }) => {
    if (!selectedDayData || !bestWeekday || !peakHourInfo) return <></>;

    return (
      <>
        <p className="text-sm sm:text-base">
          On <strong>{selectedDay}</strong> at around{" "}
          <strong>{formatHour(peakHourInfo.hour)}</strong>, there are typically{" "}
          <strong>{peakHourInfo.count}</strong> buses in service, which is the
          highest for the day.
          <br />
          <strong>{bestWeekday.day}</strong> has the highest bus frequency with{" "}
          <strong>{bestWeekday.totalBuses}</strong> buses running throughout the
          day. For the best chance of shorter wait times, consider traveling
          during these peak hours.
        </p>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-4 px-2 sm:py-8 sm:px-4 mt-8">
      <div className="max-w-5xl mx-auto">
        <NavBar currentPage="stats" />
        <div className="space-y-6 mt-6">
          <Card className="shadow-lg">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-2xl sm:text-3xl font-bold">
                Bus Route Insights
              </CardTitle>
              <CardDescription className="text-base sm:text-lg">
                Select a route to view detailed insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-4 sm:p-6">
              <LiveDateTime />
              <div className="flex flex-col items-center space-y-2 justify-center">
                <div className="w-full sm:max-w-fit">
                  <Label htmlFor="route" className="text-lg font-semibold mr-3">
                    Select Route :
                  </Label>
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
                <div className="flex items-center justify-center">
                  <Loader2 className="animate-spin mr-2" />
                  <p>Loading routes...</p>
                </div>
              )}
              {routesError && (
                <p className="text-destructive font-semibold">{routesError}</p>
              )}
            </CardContent>
          </Card>

          {selectedRoute && (
            <Card className="shadow-lg">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-2xl sm:text-3xl font-bold">
                  {selectedRoute} - Bus Flow
                </CardTitle>
                <CardDescription className="text-base sm:text-lg">
                  Daily and weekly bus statistics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-4 sm:p-6">
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map((day) => (
                    <Button
                      key={day}
                      variant={day === selectedDay ? "default" : "outline"}
                      onClick={() => setSelectedDay(day)}
                      className={`text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2 transition-all duration-200 ease-in-out hover:scale-105 ${
                        day === today
                          ? "ring-2 ring-indigo-600 dark:ring-indigo-400"
                          : ""
                      }`}
                    >
                      <span className="block sm:hidden">{day.slice(0, 3)}</span>
                      <span className="hidden sm:block">{day}</span>
                    </Button>
                  ))}
                </div>

                {statsLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="animate-spin mr-2" />
                    <p>Loading stats...</p>
                  </div>
                ) : statsError ? (
                  <p className="text-destructive font-semibold">{statsError}</p>
                ) : (
                  selectedDayData && (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Card>
                          <CardContent className="flex flex-col items-start p-4">
                            <div className="flex items-center mb-2">
                              <Clock className="h-5 w-5 text-primary mr-2" />
                              <p className="text-sm font-medium text-muted-foreground">
                                Peak Hour
                              </p>
                            </div>
                            <p className="text-lg sm:text-xl font-bold">
                              {formatHour(peakHourInfo?.hour || 0)}
                            </p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="flex flex-col items-start p-4">
                            <div className="flex items-center mb-2">
                              <Bus className="h-5 w-5 text-primary mr-2" />
                              <p className="text-sm font-medium text-muted-foreground">
                                Daily Buses
                              </p>
                            </div>
                            <p className="text-lg sm:text-xl font-bold">
                              {totalBuses}
                            </p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="flex flex-col items-start p-4">
                            <div className="flex items-center mb-2">
                              <Calendar className="h-5 w-5 text-primary mr-2" />
                              <p className="text-sm font-medium text-muted-foreground">
                                Peak Day
                              </p>
                            </div>
                            <p className="text-lg sm:text-xl font-bold">
                              {bestWeekday?.day}
                            </p>
                          </CardContent>
                        </Card>
                      </div>

                      <Card>
                        <CardHeader className="p-4">
                          <CardTitle className="text-xl sm:text-2xl">
                            Hourly Bus Distribution
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                          <ChartContainer
                            config={chartConfig}
                            className="h-[250px] sm:h-[350px] w-full"
                          >
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart
                                data={formattedData}
                                margin={{
                                  top: 10,
                                  right: 10,
                                  left: 0,
                                  bottom: 0,
                                }}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                  dataKey="hour"
                                  tickFormatter={(hour) => formatHour(hour)}
                                  interval="preserveStartEnd"
                                  tick={{ fontSize: 12 }}
                                />
                                <YAxis width={30} tick={{ fontSize: 12 }} />
                                <ChartTooltip
                                  content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                      return (
                                        <div className="bg-background border border-border p-2 rounded shadow">
                                          <p className="font-semibold">
                                            {formatHour(Number(label))}
                                          </p>
                                          <p>{`Buses: ${payload[0].value}`}</p>
                                        </div>
                                      );
                                    }
                                    return null;
                                  }}
                                />
                                <Area
                                  type="monotone"
                                  dataKey="count"
                                  stroke={`var(--color-busCount)`}
                                  fill={`var(--color-busCount)`}
                                  fillOpacity={0.2}
                                />
                              </AreaChart>
                            </ResponsiveContainer>
                          </ChartContainer>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="p-4">
                          <CardTitle className="text-xl sm:text-2xl">
                            Weekly Bus Distribution
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                          <ChartContainer
                            config={chartConfig}
                            className="h-[250px] sm:h-[350px] w-full"
                          >
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart
                                data={weeklyData}
                                margin={{
                                  top: 20,
                                  right: 10,
                                  left: 0,
                                  bottom: 0,
                                }}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                  dataKey="day"
                                  interval="preserveStartEnd"
                                  tick={{ fontSize: 12 }}
                                />
                                <YAxis width={30} tick={{ fontSize: 12 }} />
                                <ChartTooltip
                                  content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                      return (
                                        <div className="bg-background border border-border p-2 rounded shadow">
                                          <p>{`Buses: ${payload[0].value}`}</p>
                                        </div>
                                      );
                                    }
                                    return null;
                                  }}
                                />
                                <Line
                                  type="monotone"
                                  dataKey="totalBuses"
                                  stroke={`var(--color-busCount)`}
                                  strokeWidth={2}
                                  dot={{ r: 4, fill: `var(--color-busCount)` }}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </ChartContainer>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <SuggestText
                            selectedDayData={selectedDayData}
                            bestWeekday={bestWeekday}
                            peakHourInfo={peakHourInfo}
                          />
                        </CardContent>
                      </Card>
                    </>
                  )
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
