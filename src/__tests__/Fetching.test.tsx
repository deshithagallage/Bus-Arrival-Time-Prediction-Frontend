import { expect, test } from "vitest";
import {
  fetchBusRoutes,
  fetchBusStops,
} from "@/pages/Dashboard/NextBus/Fetching";

test("fetchBusRoutes", async () => {
  const data = await fetchBusRoutes();
  expect(data).toEqual([
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
  ]);
});

test("fetchBusStops", async () => {
  const route = "Q112";
  const direction = 1;
  const data = await fetchBusStops(route, direction);
  expect(data).toEqual([
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
  ]);
});
