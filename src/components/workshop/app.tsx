import { useEffect, useMemo, useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import {
  ArrowRight,
  Bookmark,
  BookOpen,
  CalendarDays,
  ChevronDown,
  Clock,
  Feather,
  Flower2,
  Heart,
  Lightbulb,
  MapPin,
  Menu,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
  Undo2,
  Users,
} from "lucide-react";
import { continueScene } from "@/lib/workshop/continue-scene";
import {
  ASSET,
  CHARACTERS,
  SCENE_IDEAS,
  SETTINGS,
  TIMELINE_EVENTS,
  TIMELINES,
  characterById,
  type Character,
  type CharacterId,
  type SceneConfig,
  type ScreenId,
} from "@/lib/workshop/data";
import {
  createSession,
  currentBeat,
  filterArchive,
  goBack,
  inspirePrompt,
  jumpScreen,
  makeContinuation,
  memoryBeats,
  openArchiveScene,
  patchConfig,
  pushScreen,
  selectCharacter,
  type AppState,
  type SceneSession,
  INITIAL_STATE,
} from "@/lib/workshop/session";
import {
  BackButton,
  BottomNav,
  Ornament,
  PageHeading,
  Palette,
  Screen,
} from "./chrome";

const PROFILE_ICONS = [Sparkles, Flower2, Heart, Feather] as const;

function LibrariesScreen({
  openStory,
  openWorkspace,
  onNavigate,
}: {
  openStory: () => void;
  openWorkspace: () => void;
  onNavigate: (screen: ScreenId) => void;
}) {
  return (
    <>
      <Screen className="libraries-screen">
        <PageHeading title="Story Libraries" subtitle="Choose a world to enter." />
        <button className="story-library-card taped-card" onClick={openStory}>
          <img src={`${ASSET}/story-cover.jpg`} alt="Story #001 seaside cast" />
          <div className="story-copy">
            <h2>Story #001</h2>
            <p className="caps">Romance · Slice of Life</p>
            <div className="avatar-row" aria-label="Four characters">
              {CHARACTERS.map((c) => (
                <img key={c.id} src={c.image} alt="" />
              ))}
            </div>
            <p className="counts">
              <Sparkles /> 12 scenes · 4 characters
            </p>
          </div>
          <Flower2 className="card-flower" aria-hidden="true" />
        </button>
        <button className="new-library" disabled title="New story libraries are coming soon">
          <Sparkles />
          <Plus /> New Story Library <Sparkles />
        </button>
        <section className="continue-block">
          <p className="section-label">Continue Working</p>
          <button className="continue-card" onClick={openWorkspace}>
            <img src={`${ASSET}/scene-art.jpg`} alt="Ren and Ryo at the seaside" />
            <span>
              Ren & Ryo —<br />
              First Encounter
            </span>
            <ArrowRight />
          </button>
        </section>
      </Screen>
      <BottomNav active="home" onNavigate={onNavigate} />
    </>
  );
}

function HomeScreen({ onNavigate }: { onNavigate: (screen: ScreenId) => void }) {
  const items = [
    { title: "Workshop", meta: "Outline · Scenes · Notes", icon: Feather, screen: "configure" as ScreenId },
    { title: "Characters", meta: "Profiles · Relationships · Arcs", icon: Users, screen: "characters" as ScreenId },
    { title: "Timelines", meta: "Events · Milestones · History", icon: Clock, screen: "timeline" as ScreenId },
    { title: "Scene Archive", meta: "All Scenes · Drafts · Ideas", icon: BookOpen, screen: "archive" as ScreenId },
  ];
  return (
    <>
      <Screen className="home-screen">
        <header className="story-hero">
          <div className="story-kicker">
            Project Lunelle
            <br />
            <span>Director's Room</span>
          </div>
          <div className="palette-wrap">
            <Palette />
            <span>Story Palette</span>
          </div>
          <h1>Story #001</h1>
          <p>
            Kanagawa, before
            <br />
            everything changed.
          </p>
          <img src={`${ASSET}/home-hero.jpg`} alt="Story #001 character collage above the seaside" />
        </header>
        <section className="director-menu" aria-label="Story sections">
          {items.map(({ title, meta, icon: Icon, screen }) => (
            <button key={title} onClick={() => onNavigate(screen)}>
              <Icon />
              <span>
                <strong>{title}</strong>
                <small>{meta}</small>
              </span>
              <ArrowRight />
            </button>
          ))}
        </section>
        <button className="home-continue" onClick={() => onNavigate("workspace")}>
          <img src={`${ASSET}/scene-art.jpg`} alt="Ren and Ryo scene" />
          <span>
            <small>Continue Scene</small>
            <strong>Ren & Ryo — First Encounter</strong>
            <em>Draft · 8 minutes ago</em>
          </span>
          <ArrowRight />
        </button>
      </Screen>
      <BottomNav active="home" onNavigate={onNavigate} />
    </>
  );
}

function CharactersScreen({
  onNavigate,
  onSelectCharacter,
}: {
  onNavigate: (screen: ScreenId) => void;
  onSelectCharacter: (id: CharacterId) => void;
}) {
  const [query, setQuery] = useState("");
  const list = useMemo(
    () => CHARACTERS.filter((c) => c.name.toLowerCase().includes(query.toLowerCase())),
    [query],
  );
  return (
    <>
      <Screen className="characters-screen">
        <PageHeading title="Characters" subtitle="The people who make this world move." />
        <div className="character-tools">
          <label>
            <Search />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search characters" />
          </label>
          <span className="filter-label">All characters</span>
        </div>
        <div className="character-grid">
          {list.map((c) => (
            <button key={c.id} className="character-card" onClick={() => onSelectCharacter(c.id)}>
              <img src={c.image} alt={c.name} />
              <span>
                <strong>{c.name}</strong>
                <small>
                  <Sparkles /> {c.role}
                </small>
              </span>
            </button>
          ))}
        </div>
        <button className="add-character" disabled title="Character creation is coming soon">
          <Plus /> Add Character <Flower2 />
        </button>
      </Screen>
      <BottomNav active="characters" onNavigate={onNavigate} />
    </>
  );
}

function ProfileScreen({
  character,
  onBack,
  onNavigate,
}: {
  character: Character;
  onBack: () => void;
  onNavigate: (screen: ScreenId) => void;
}) {
  const isRyo = character.id === "ryo";
  return (
    <>
      <Screen className="profile-screen">
        <BackButton onClick={onBack} />
        <header>
          <h1>{character.name}</h1>
          <p>{isRyo ? "Quiet gravity." : character.role}</p>
          <Ornament />
        </header>
        <div className="tag-row">
          <span>{character.profileTag}</span>
          <span>{character.role}</span>
          <span>Story #001</span>
        </div>
        <div className="profile-portrait taped-card">
          <img src={character.profileImage} alt={character.name} />
        </div>
        <Tabs.Root defaultValue="profile" className="atelier-tabs">
          <Tabs.List data-slot="tabs-list">
            <Tabs.Trigger value="profile" data-slot="tabs-trigger">Profile</Tabs.Trigger>
            <Tabs.Trigger value="relationships" data-slot="tabs-trigger">Relationships</Tabs.Trigger>
            <Tabs.Trigger value="lore" data-slot="tabs-trigger">Lore</Tabs.Trigger>
            <Tabs.Trigger value="voice" data-slot="tabs-trigger">Voice</Tabs.Trigger>
            <Tabs.Trigger value="scrapbook" data-slot="tabs-trigger">Scrapbook</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="profile" className="profile-rows">
            {isRyo ? (
              character.profile.map((row, i) => {
                const Icon = PROFILE_ICONS[i] ?? Sparkles;
                return (
                  <article key={row.title}>
                    <div>
                      <Icon />
                      <strong>{row.title}</strong>
                    </div>
                    <p>{row.body}</p>
                  </article>
                );
              })
            ) : (
              <article>
                <div>
                  <Sparkles />
                  <strong>Working Profile</strong>
                </div>
                <p>{character.name}'s detailed profile will be added during the character-content pass.</p>
              </article>
            )}
          </Tabs.Content>
          <Tabs.Content value="relationships" className="relationship-list">
            {character.relationships.map((rel) => (
              <article key={rel.name} className="relationship-card">
                <div className="relationship-card-heading">
                  <span>{rel.tag}</span>
                  <strong>{rel.name}</strong>
                </div>
                <p>{rel.detail}</p>
                <em>{rel.tone}</em>
              </article>
            ))}
          </Tabs.Content>
          <Tabs.Content value="lore" className="tab-note">
            Canon and working lore will appear here in a later system pass.
          </Tabs.Content>
          <Tabs.Content value="voice" className="tab-note">
            Voice configuration for {character.name} is not connected yet.
          </Tabs.Content>
          <Tabs.Content value="scrapbook" className="scrapbook-tab">
            <header>
              <Bookmark />
              <div>
                <p>Scrapbook</p>
                <h2>Moments kept close</h2>
              </div>
            </header>
            <p className="scrapbook-intro">
              A home for snapshots, scene stills, reference portraits, and the small images that make {character.name.split(" ")[0]} feel lived in.
            </p>
            <div className="scrapbook-grid">
              {character.scrapbook.map((shot) => (
                <figure key={shot.src}>
                  <img src={shot.src} alt={shot.title} />
                  <figcaption>
                    <strong>{shot.title}</strong>
                    <span>{shot.note}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </Tabs.Content>
        </Tabs.Root>
        <button className="edit-profile" disabled title="Profile editing is coming soon">
          <Pencil /> Edit Profile
        </button>
      </Screen>
      <BottomNav active="characters" onNavigate={onNavigate} />
    </>
  );
}
