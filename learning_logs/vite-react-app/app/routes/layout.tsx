import type { Route } from "./+types/home";
import { Outlet } from "react-router";
import Navigation from "~/components/NavLink";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Layout() {
  return (
    <div className="flex flex-col h-screen">
      <Navigation/>
      
      <main className="flex-1 overflow-auto flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
