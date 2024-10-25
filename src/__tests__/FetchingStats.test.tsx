import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchStats } from "../pages/Dashboard/Stats/FetchingStats";

describe("fetchStats", () => {
  const mockRoute = "route1";
  const mockDayOfWeek = "Monday";
  const mockBackendURL = "http://localhost:8000/";
  const mockResponseData = { key: "value" };

  beforeEach(() => {
    vi.resetAllMocks();
    // Assuming you want to set a mock environment variable
    // Note: this approach may vary depending on your environment setup
    import.meta.env.VITE_BACKEND_URL = mockBackendURL;
  });

  it("should fetch stats successfully", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponseData),
      })
    ) as unknown as typeof fetch; // Type assertion for compatibility

    const data = await fetchStats(mockRoute, mockDayOfWeek);
    expect(data).toEqual(mockResponseData);
    expect(fetch).toHaveBeenCalledWith(
      `${mockBackendURL}api/hourly_stats/${mockRoute}/${mockDayOfWeek}`
    );
  });

  it("should throw an error if response is not ok", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 404,
      })
    ) as unknown as typeof fetch; // Type assertion for compatibility

    await expect(fetchStats(mockRoute, mockDayOfWeek)).rejects.toThrow(
      "HTTP error! status: 404"
    );
    expect(fetch).toHaveBeenCalledWith(
      `${mockBackendURL}api/hourly_stats/${mockRoute}/${mockDayOfWeek}`
    );
  });

  it("should throw an error if fetch fails", async () => {
    const mockError = new Error("Network error");
    global.fetch = vi.fn(() =>
      Promise.reject(mockError)
    ) as unknown as typeof fetch; // Type assertion for compatibility

    await expect(fetchStats(mockRoute, mockDayOfWeek)).rejects.toThrow(
      "Network error"
    );
    expect(fetch).toHaveBeenCalledWith(
      `${mockBackendURL}api/hourly_stats/${mockRoute}/${mockDayOfWeek}`
    );
  });

  it("should return null if data is not an object", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve("invalid data"),
      })
    ) as unknown as typeof fetch; // Type assertion for compatibility

    const data = await fetchStats(mockRoute, mockDayOfWeek);
    expect(data).toBeNull();
    expect(fetch).toHaveBeenCalledWith(
      `${mockBackendURL}api/hourly_stats/${mockRoute}/${mockDayOfWeek}`
    );
  });
});
