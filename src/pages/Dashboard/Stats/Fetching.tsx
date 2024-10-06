export async function fetchStats(route: string, day_of_week: string) {
  try {
    const response = await fetch(
      `http://localhost:8000/api/hourly_stats/${route}/${day_of_week}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (data && typeof data === "object") {
      return data;
    } else {
      return null;
    }
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
