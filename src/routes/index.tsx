import { createFileRoute } from "@tanstack/react-router";
import { WorkshopApp } from "@/components/workshop/app";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <WorkshopApp />;
}
