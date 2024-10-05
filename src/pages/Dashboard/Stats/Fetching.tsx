export async function fetchBusRoutes() {
  try {
    // const response = await fetch("http://localhost:8000/api/bus_routes/all");
    // if (!response.ok) {
    //   throw new Error(`HTTP error! status: ${response.status}`);
    // }
    // const data = await response.json();
    //console.log(data.route_names);
    const data = [
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
      "B8",
    ];
    //wait 2 seconds
    await new Promise((resolve) => setTimeout(resolve, 500));
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error; // Re-throw the error so that the caller can handle it.
  }
}

export async function fetchBusStops(route: string, direction: number) {
  try {
    // const response = await fetch(
    //   `http://localhost:8000/api/bus_routes/by-name/${route}/${direction}`
    // );
    // if (!response.ok) {
    //   throw new Error(`HTTP error! status: ${response.status}`);
    // }
    // const data = await response.json();
    console.log(route, direction);
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
        {
          id: "9MpoPNXhoPkllLNPPi6o",
          name: "FOSTER AV/E 18 ST",
          longitude: null,
          latitude: null,
        },
      ],
    };
    //wait 2 seconds
    await new Promise((resolve) => setTimeout(resolve, 500));
    return data.stops;
  } catch (error) {
    console.error("Error:", error);
    throw error; // Re-throw the error so that the caller can handle it.
  }
}

export async function fetchArrivalTime(
  direction: number,
  route: string,
  stop: string
) {
  try {
    const recordedTime = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " "); // Format as "YYYY-MM-DD HH:MM:SS"

    const response = await fetch(`http://localhost:8000/api/model/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recorded_time: recordedTime,
        direction_ref: direction,
        published_line_name: route,
        next_stop_point_name: stop,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    // console.log({
    //   recorded_time: recordedTime,
    //   direction_ref: direction,
    //   published_line_name: route,
    //   next_stop_point_name: stop,
    // });
    //console.log(data);
    if (data && typeof data.prediction === "number") {
      return data.prediction;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
