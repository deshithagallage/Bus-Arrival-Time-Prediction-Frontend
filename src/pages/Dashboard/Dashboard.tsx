import { ThemeProvider } from "@/components/ThemeProvider";
import { DashboardContent } from "./DashboardContent";

export default function Dashboard() {
  return (
    <ThemeProvider>
      <DashboardContent />
    </ThemeProvider>
  );
}
