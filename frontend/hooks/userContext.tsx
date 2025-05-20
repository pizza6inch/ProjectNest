// contexts/DashboardStatsContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";

interface DashboardStats {
  userCount: number;
  projectCount: number;
  completedProjects: number;
  activeProjects: number;
  setStats: (stats: Partial<DashboardStats>) => void;
}

const DashboardStatsContext = createContext<DashboardStats | undefined>(undefined);

export const DashboardStatsProvider = ({ children }: { children: ReactNode }) => {
  const [stats, setStatsState] = useState<Omit<DashboardStats, "setStats">>({
    userCount: 0,
    projectCount: 0,
    completedProjects: 0,
    activeProjects: 0,
  });

  const setStats = (newStats: Partial<DashboardStats>) => {
    setStatsState((prev) => ({ ...prev, ...newStats }));
  };

  return <DashboardStatsContext.Provider value={{ ...stats, setStats }}>{children}</DashboardStatsContext.Provider>;
};

export const useDashboardStats = () => {
  const context = useContext(DashboardStatsContext);
  if (!context) {
    throw new Error("useDashboardStats must be used within a DashboardStatsProvider");
  }
  return context;
};
