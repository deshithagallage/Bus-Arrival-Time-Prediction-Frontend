import { ThemeProvider } from "@/components/ThemeProvider";
import { NextBusContent } from "./NextBusContent";

export default function NextBus() {
  return (
    <ThemeProvider>
      <NextBusContent />
    </ThemeProvider>
  );
}
