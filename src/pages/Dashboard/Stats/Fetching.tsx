export async function fetchStats(route: string, day_of_week: string) {
  try {
    //backend URL
    const backendURL =
      import.meta.env.VITE_BACKEND_URL || "http://localhost:8000/";
    const response = await fetch(
      `${backendURL}api/hourly_stats/${route}/${day_of_week}`
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
