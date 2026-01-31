import { Navigation } from "@/types"

export const navLinks: Navigation = {
  data: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Features",
      href: "/#features",
    },
    {
      title: "Overview",
      href: "/#overview",
    },
    {
      title: "Dashboard",
      href: "/dashboard",
    },
  ],
}

export const dashboardLinks: Navigation = {
  data: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: "dashboard",
    },
    {
      title: "Rotinas",
      href: "/routines",
      icon: "clock",
    },
    {
      title: "Hábitos",
      href: "/habits",
      icon: "check",
    },
    {
      title: "Dieta",
      href: "/diet",
      icon: "utensils",
    },
    {
      title: "Activities",
      href: "/dashboard/activities",
      icon: "activity",
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: "settings",
    },
  ],
}
