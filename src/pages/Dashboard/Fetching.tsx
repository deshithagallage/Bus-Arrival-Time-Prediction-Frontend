export async function fetchBusRoutes() {
  try {
    // const response = await fetch("http://localhost:8000/api/bus_routes/all");
    // if (!response.ok) {
    //   throw new Error(`HTTP error! status: ${response.status}`);
    // }
    // const data = await response.json();
    //console.log(data.route_names);
    const data = ["b10", "b11", "b12", "b13", "b14", "b15", "b17"];
    //wait 2 seconds
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error; // Re-throw the error so that the caller can handle it.
  }
}

export async function fetchBusStops(route: string) {
  try {
    // const response = await fetch(
    //   `http://localhost:5000/api/bus_stops/${routeName}`
    // );
    // if (!response.ok) {
    //   throw new Error(`HTTP error! status: ${response.status}`);
    // }
    // const data = await response.json();
    console.log(route);
    const data = {
      stops: [
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
      ],
    };
    //wait 2 seconds
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return data.stops;
  } catch (error) {
    console.error("Error:", error);
    throw error; // Re-throw the error so that the caller can handle it.
  }
}
