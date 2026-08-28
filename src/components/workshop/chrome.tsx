import type { ReactNode } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Feather,
  House,
  Sparkles,
  Users,
} from "lucide-react";
import type { ScreenId } from "@/lib/workshop/data";

export function Palette() {
  return (
    <div className="palette" aria-label="Story palette">
      <i className="swatch blush" />
      <i className="swatch lavender" />
      <i className="swatch periwinkle" />
      <i className="swatch mist" />
    </div>
  );
}

export function Ornament() {
  return (
    <div className="ornament" aria-hidden="true">
      <span />
      <Sparkles size={15} />
      <span />
    </div>
  );
}

export function PageHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <header className="page-heading">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <Palette />
      <Ornament />
    </header>
  );
}

export function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button className="back-button" onClick={onClick} aria-label="Back">
      <ArrowLeft />
    </button>
  );
}

const NAV = [
  { key: "home", label: "Home", icon: House, screen: "home" as ScreenId },
  {
    key: "workshop",
    label: "Workshop",
    icon: Feather,
    screen: "configure" as ScreenId,
  },
  {
    key: "characters",
    label: "Characters",
    icon: Users,
    screen: "characters" as ScreenId,
  },
  {
    key: "timeline",
    label: "Timeline",
    icon: CalendarDays,
    screen: "timeline" as ScreenId,
  },
];

export function BottomNav({
  active,
  onNavigate,
}: {
  active: "home" | "workshop" | "characters" | "timeline";
  onNavigate: (screen: ScreenId) => void;
}) {
  return (
    <nav className="bottom-nav" aria-label="Director Workshop navigation">
      {NAV.map(({ key, label, icon: Icon, screen }) => (
        <button
          key={key}
          className={active === key ? "active" : ""}
          onClick={() => onNavigate(screen)}
          aria-current={active === key ? "page" : undefined}
        >
          <Icon />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}

export function Screen({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}) {
  return <main className={`screen ${className}`}>{children}</main>;
}
