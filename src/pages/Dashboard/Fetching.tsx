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

export async function fetchBusStops(routeName: string) {
  try {
    const response = await fetch(
      `http://localhost:5000/api/bus_stops/${routeName}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error; // Re-throw the error so that the caller can handle it.
  }
}
