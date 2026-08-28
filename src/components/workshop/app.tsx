import { useEffect, useMemo, useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import {
  ArrowRight,
  Bookmark,
  BookOpen,
  CalendarDays,
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
  X,
} from "lucide-react";
import { continueScene } from "@/lib/workshop/continue-scene";
import {
  ASSET,
  CHARACTERS,
  MOODS,
  SCENE_IDEAS,
  SETTINGS,
  TIMELINE_EVENTS,
  TIMELINES,
  characterById,
  ideaImage,
  type ArchiveItem,
  type Character,
  type CharacterId,
  type SceneConfig,
  type ScreenId,
} from "@/lib/workshop/data";
import {
  createSession,
  currentBeat,
  filterArchive,
  findArchiveItem,
  goBack,
  inspirePrompt,
  jumpScreen,
  loadPersisted,
  makeContinuation,
  makeSavedScene,
  memoryBeats,
  openArchiveScene,
  patchConfig,
  pushScreen,
  savePersisted,
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
        <button
          className="new-library"
          disabled
          title="New story libraries are coming soon"
        >
          <Sparkles />
          <Plus /> New Story Library <Sparkles />
        </button>
        <section className="continue-block">
          <p className="section-label">Continue Working</p>
          <button className="continue-card" onClick={openWorkspace}>
            <img src={`${ASSET}/scene-art.jpg`} alt="Ren and Ryo at the seaside" />
            <span>
              Ren & Ryo —
              <br />
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
          <img
            src={`${ASSET}/home-hero.jpg`}
            alt="Story #001 character collage above the seaside"
          />
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
    () =>
      CHARACTERS.filter((c) =>
        c.name.toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  );
  return (
    <>
      <Screen className="characters-screen">
        <PageHeading
          title="Characters"
          subtitle="The people who make this world move."
        />
        <div className="character-tools">
          <label>
            <Search />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search characters"
            />
          </label>
          <span className="filter-label">All characters</span>
        </div>
        <div className="character-grid">
          {list.map((c) => (
            <button
              key={c.id}
              className="character-card"
              onClick={() => onSelectCharacter(c.id)}
            >
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
        <button
          className="add-character"
          disabled
          title="Character creation is coming soon"
        >
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
  return (
    <>
      <Screen className="profile-screen">
        <BackButton onClick={onBack} />
        <header>
          <h1>{character.name}</h1>
          <p>{character.kicker}</p>
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
            <Tabs.Trigger value="profile" data-slot="tabs-trigger">
              Profile
            </Tabs.Trigger>
            <Tabs.Trigger value="relationships" data-slot="tabs-trigger">
              Relationships
            </Tabs.Trigger>
            <Tabs.Trigger value="lore" data-slot="tabs-trigger">
              Lore
            </Tabs.Trigger>
            <Tabs.Trigger value="voice" data-slot="tabs-trigger">
              Voice
            </Tabs.Trigger>
            <Tabs.Trigger value="scrapbook" data-slot="tabs-trigger">
              Scrapbook
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="profile" className="profile-rows">
            {character.profile.map((row, i) => {
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
            })}
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
          <Tabs.Content value="lore" className="tab-prose">
            <p className="section-label">Working lore</p>
            <p>{character.lore}</p>
          </Tabs.Content>
          <Tabs.Content value="voice" className="tab-prose">
            <p className="section-label">How they speak</p>
            <p>{character.voice}</p>
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
              Snapshots, scene stills, and the small images that make{" "}
              {character.name.split(" ")[0]} feel lived in.
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
        <button
          className="edit-profile"
          disabled
          title="Profile editing is coming soon"
        >
          <Pencil /> Edit Profile
        </button>
      </Screen>
      <BottomNav active="characters" onNavigate={onNavigate} />
    </>
  );
}

function ChoiceList({
  label,
  icon: Icon,
  options,
  value,
  onChange,
}: {
  label: string;
  icon: typeof CalendarDays;
  options: readonly string[];
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <fieldset className="choice-list">
      <legend>
        <Icon />
        {label}
      </legend>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          className={value === option ? "selected" : ""}
          aria-pressed={value === option}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </fieldset>
  );
}

function ConfigureScreen({
  config,
  onChange,
  begin,
  onNavigate,
}: {
  config: SceneConfig;
  onChange: (patch: Partial<SceneConfig>) => void;
  begin: () => void;
  onNavigate: (screen: ScreenId) => void;
}) {
  const [panel, setPanel] = useState<"cast" | "when" | "premise">("cast");
  const present = config.cast
    .map((id) => CHARACTERS.find((c) => c.id === id))
    .filter(Boolean) as Character[];
  return (
    <>
      <Screen className="configure-screen">
        <PageHeading
          title="Configure Scene"
          subtitle="Choose who enters, when, and why."
        />
        <div className="config-tabs" role="tablist" aria-label="Scene setup">
          <button
            type="button"
            role="tab"
            aria-selected={panel === "cast"}
            className={panel === "cast" ? "active" : ""}
            onClick={() => setPanel("cast")}
          >
            Cast
          </button>
          <span className="config-dot" aria-hidden="true">
            ✦
          </span>
          <button
            type="button"
            role="tab"
            aria-selected={panel === "when"}
            className={panel === "when" ? "active" : ""}
            onClick={() => setPanel("when")}
          >
            Timeline
          </button>
          <span className="config-dot" aria-hidden="true">
            ✦
          </span>
          <button
            type="button"
            role="tab"
            aria-selected={panel === "premise"}
            className={panel === "premise" ? "active" : ""}
            onClick={() => setPanel("premise")}
          >
            Premise
          </button>
        </div>
        {panel === "cast" ? (
          <>
            <p className="section-label">Who's here</p>
            <div className="cast-row">
              {present.map((person) => (
                <figure key={person.id}>
                  <img src={person.image} alt={person.name} />
                  <figcaption>{person.name.split(" ")[0]}</figcaption>
                  <button
                    onClick={() =>
                      config.cast.length > 1 &&
                      onChange({
                        cast: config.cast.filter((id) => id !== person.id),
                      })
                    }
                    aria-label={`Remove ${person.name}`}
                  >
                    ×
                  </button>
                </figure>
              ))}
              <button
                className="add-cast"
                onClick={() => {
                  const next = CHARACTERS.find((c) => !config.cast.includes(c.id));
                  if (next) onChange({ cast: [...config.cast, next.id] });
                }}
                disabled={config.cast.length >= CHARACTERS.length}
              >
                <Plus />
                <span>Add</span>
              </button>
            </div>
          </>
        ) : null}
        {panel === "when" ? (
          <div className="when-panel">
            <ChoiceList
              label="Timeline"
              icon={CalendarDays}
              options={TIMELINES}
              value={config.timeline}
              onChange={(timeline) => onChange({ timeline })}
            />
            <ChoiceList
              label="Setting"
              icon={MapPin}
              options={SETTINGS}
              value={config.setting}
              onChange={(setting) => onChange({ setting })}
            />
            <ChoiceList
              label="Mood"
              icon={Heart}
              options={MOODS}
              value={config.mood}
              onChange={(mood) => onChange({ mood })}
            />
          </div>
        ) : null}
        {panel === "premise" ? (
          <section className="ideas">
            <p className="section-label">Scene Ideas</p>
            {SCENE_IDEAS.map((idea) => (
              <button
                key={idea.title}
                className={config.premise === idea.title ? "selected" : ""}
                onClick={() => onChange({ premise: idea.title })}
              >
                <img src={idea.image} alt="" />
                <strong>{idea.title}</strong>
                <Sparkles />
              </button>
            ))}
            <label className="premise-field">
              <Pencil />
              <input
                value={config.premise}
                onChange={(e) => onChange({ premise: e.target.value })}
                placeholder="Add a custom premise"
              />
            </label>
          </section>
        ) : null}
        <button className="begin-scene" onClick={begin}>
          <Sparkles /> Begin Scene
        </button>
      </Screen>
      <BottomNav active="workshop" onNavigate={onNavigate} />
    </>
  );
}

function WorkspaceScreen({
  session,
  onSessionChange,
  onBack,
  onNavigate,
  onSave,
  saved,
}: {
  session: SceneSession;
  onSessionChange: (next: SceneSession) => void;
  onBack: () => void;
  onNavigate: (screen: ScreenId) => void;
  onSave: (excerpt: string) => void;
  saved: boolean;
}) {
  const { config, history, directorInstruction, notes } = session;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const entries = history.current();
  const beat = currentBeat(config, entries);
  const memory = memoryBeats(config, entries);

  useEffect(() => {
    const last = document.querySelector(".notebook-entry:last-of-type");
    last?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [entries.length]);
  const last = entries.at(-1);
  const continuations = entries.filter((e) => e.kind === "continuation").length;
  const canReroll = last?.kind === "continuation";
  const status = busy ? "Writing continuation…" : "Ready for your direction";
  const present = config.cast
    .map((id) => CHARACTERS.find((c) => c.id === id))
    .filter(Boolean) as Character[];
  const title = config.premise || "Untitled Scene";
  const still = ideaImage(title);
  const moodParts = (config.mood || "Nervous · Hopeful").split(" · ");

  const applyHistory = (
    nextHistory: SceneSession["history"],
    instruction = directorInstruction,
  ) =>
    onSessionChange({
      ...session,
      history: nextHistory,
      directorInstruction: instruction,
    });

  const write = async (instruction: string, mode: "append" | "reroll") => {
    setBusy(true);
    setError("");
    try {
      const result = await continueScene({
        data: {
          config,
          entries: entries.map((e) => ({ label: e.label, text: e.text })),
          instruction,
        },
      });
      if (!result.ok) throw new Error(result.error);
      const n =
        mode === "reroll"
          ? (last?.revision ?? continuations) + 1
          : continuations + 1;
      const entry = makeContinuation(instruction, result.text, n);
      applyHistory(
        mode === "reroll" ? history.reroll(entry) : history.generate(entry),
        mode === "append" ? "" : directorInstruction,
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to continue this scene right now.",
      );
    } finally {
      setBusy(false);
    }
  };

  const excerpt =
    entries.filter((e) => e.kind === "continuation").at(-1)?.text ||
    entries.at(-1)?.text ||
    title;

  return (
    <>
      <Screen className="workspace-screen">
        <header className="workspace-title">
          <BackButton onClick={onBack} />
          <div>
            <h1>
              {title} <Sparkles />
            </h1>
            <p>Story #001</p>
          </div>
          <div className="scene-menu-wrap">
            <button
              type="button"
              className="scene-menu-btn"
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              aria-label="Scene menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X /> : <Menu />}
            </button>
            {menuOpen ? (
              <div className="scene-menu" role="menu">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    onSave(excerpt);
                    setMenuOpen(false);
                  }}
                >
                  {saved ? "Saved to archive" : "Save to archive"}
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    onNavigate("configure");
                  }}
                >
                  Edit configuration
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    onBack();
                  }}
                >
                  Leave scene
                </button>
              </div>
            ) : null}
          </div>
        </header>
        <Tabs.Root defaultValue="scene" className="atelier-tabs workspace-tabs">
          <Tabs.List data-slot="tabs-list">
            <Tabs.Trigger value="scene" data-slot="tabs-trigger">
              Scene
            </Tabs.Trigger>
            <Tabs.Trigger value="notes" data-slot="tabs-trigger">
              Notes
            </Tabs.Trigger>
            <Tabs.Trigger value="history" data-slot="tabs-trigger">
              History
            </Tabs.Trigger>
            <Tabs.Trigger value="visuals" data-slot="tabs-trigger">
              Visuals
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="scene">
            <div className="scene-visual taped-card">
              <img src={still} alt="Configured scene" />
              <span>••••</span>
            </div>
            <section className="scene-summary">
              <div>
                <small>Cast</small>
                <span className="mini-cast">
                  {present.map((p) => (
                    <img key={p.id} src={p.image} alt={p.name} />
                  ))}
                  <button
                    type="button"
                    className="mini-cast-add"
                    onClick={() => onNavigate("configure")}
                    aria-label="Edit cast"
                  >
                    <Plus />
                  </button>
                </span>
              </div>
              <div>
                <small>Timeline</small>
                <strong>
                  {config.timeline.split(" · ").map((part, i) => (
                    <span key={part}>
                      {i > 0 ? <br /> : null}
                      {part}
                    </span>
                  ))}
                </strong>
              </div>
              <div>
                <small>Setting</small>
                <strong>
                  {config.setting.split(" · ").map((part, i) => (
                    <span key={part}>
                      {i > 0 ? <br /> : null}
                      {part}
                    </span>
                  ))}
                </strong>
              </div>
              <div>
                <small>Mood</small>
                <strong>
                  {moodParts.map((part, i) => (
                    <span key={part}>
                      {i > 0 ? <br /> : null}
                      {part}
                    </span>
                  ))}
                </strong>
              </div>
            </section>
            <article className="notebook">
              <p className="section-label">
                Scene in Progress <Sparkles />
              </p>
              {entries.length ? (
                entries.map((entry) => (
                  <div className="notebook-entry" key={entry.id}>
                    <span>{entry.label}</span>
                    <p>{entry.text}</p>
                  </div>
                ))
              ) : (
                <p className="empty-scene">
                  No scene entries yet. Generate a continuation from the
                  configuration above.
                </p>
              )}
              <small>{beat.stepLabel}</small>
            </article>
          </Tabs.Content>
          <Tabs.Content value="notes" className="notes-tab">
            <p className="section-label">Director notes</p>
            <p className="tab-lede">
              Private to this scene. They stay on this device and do not go to
              the Scene Writer unless you paste them into a direction.
            </p>
            <textarea
              value={notes}
              onChange={(e) =>
                onSessionChange({ ...session, notes: e.target.value })
              }
              placeholder="What should stay true in the next beat? A gesture, a silence, a line you do not want to lose…"
            />
          </Tabs.Content>
          <Tabs.Content value="history" className="history-tab">
            <p className="section-label">This draft</p>
            <ol className="history-list">
              {entries.map((entry) => (
                <li key={entry.id}>
                  <small>{entry.label}</small>
                  {entry.instruction ? (
                    <em>Director: {entry.instruction}</em>
                  ) : null}
                  <p>{entry.text}</p>
                </li>
              ))}
            </ol>
            <p className="tab-lede">
              Undo and reroll live in the action bar. History is kept for this
              session.
            </p>
          </Tabs.Content>
          <Tabs.Content value="visuals" className="visuals-tab">
            <p className="section-label">Working stills</p>
            <div className="visuals-grid">
              <figure>
                <img src={still} alt="" />
                <figcaption>
                  <strong>{title}</strong>
                  <span>{config.setting}</span>
                </figcaption>
              </figure>
              {present.map((person) => (
                <figure key={person.id}>
                  <img src={person.image} alt={person.name} />
                  <figcaption>
                    <strong>{person.name.split(" ")[0]}</strong>
                    <span>{person.role}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </Tabs.Content>
        </Tabs.Root>
        <section className="scene-writer" aria-label="Scene Writer agent">
          <span className="scene-writer-mark">
            <Feather />
          </span>
          <div>
            <small>Scene Writer</small>
            <strong>{status}</strong>
            <p>
              Open-ended continuation · Uses the active scene and your
              direction.
            </p>
          </div>
          <Sparkles aria-hidden="true" />
        </section>
        <label className="director-input">
          <Feather />
          <span>
            <small>Director · Your Next Move</small>
            <textarea
              value={directorInstruction}
              disabled={busy}
              onChange={(e) =>
                onSessionChange({
                  ...session,
                  directorInstruction: e.target.value,
                })
              }
              placeholder="What do you want to say or do? Write a line of dialogue or a direction…"
            />
          </span>
          <Sparkles />
        </label>
        {error ? (
          <p className="generation-error" role="alert">
            {error}
          </p>
        ) : null}
        <div className="scene-actions">
          <button
            onClick={() => applyHistory(history.undo())}
            disabled={!entries.length || busy}
          >
            <Undo2 /> Undo
          </button>
          <button
            onClick={() =>
              write(
                directorInstruction.trim() || inspirePrompt(config, entries),
                "append",
              )
            }
            disabled={busy}
          >
            <Sparkles /> {busy ? "Writing…" : "Generate"}
          </button>
          <button
            onClick={() => {
              if (last?.kind === "continuation") {
                write(
                  last.instruction ||
                    directorInstruction.trim() ||
                    inspirePrompt(config, entries),
                  "reroll",
                );
              }
            }}
            disabled={!canReroll || busy}
          >
            <RotateCcw /> Reroll
          </button>
          <button
            disabled={busy}
            onClick={() =>
              onSessionChange({
                ...session,
                directorInstruction: inspirePrompt(config, entries),
              })
            }
          >
            <Lightbulb /> Inspire
          </button>
        </div>
        <section className="memory-beat">
          <div>
            <h2>
              <Bookmark /> Scene Memory
            </h2>
            <ul>
              {memory.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2>
              <Sparkles /> Current Beat
            </h2>
            <strong>{beat.title}</strong>
            <p>{beat.description}</p>
            <small>{beat.stepLabel}</small>
          </div>
        </section>
      </Screen>
      <BottomNav active="workshop" onNavigate={onNavigate} />
    </>
  );
}

function TimelineScreen({
  onBack,
  onNavigate,
}: {
  onBack: () => void;
  onNavigate: (screen: ScreenId) => void;
}) {
  return (
    <>
      <Screen className="timeline-screen">
        <BackButton onClick={onBack} />
        <PageHeading
          title="Timelines"
          subtitle="Events, milestones, and history."
        />
        <div className="timeline-line">
          {TIMELINE_EVENTS.map((event, i) => (
            <article key={event.title}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              <div>
                <small>{event.era}</small>
                <h2>{event.title}</h2>
                <p>{event.body}</p>
              </div>
            </article>
          ))}
        </div>
        <button
          className="timeline-placeholder"
          disabled
          title="Timeline editing is coming soon"
        >
          <Plus /> Add Timeline Event
        </button>
      </Screen>
      <BottomNav active="timeline" onNavigate={onNavigate} />
    </>
  );
}

function ArchiveScreen({
  onBack,
  onNavigate,
  onOpenScene,
  extra,
}: {
  onBack: () => void;
  onNavigate: (screen: ScreenId) => void;
  onOpenScene: (id: string) => void;
  extra: ArchiveItem[];
}) {
  const [filter, setFilter] = useState("all");
  const items = filterArchive(filter, extra);
  return (
    <>
      <Screen className="archive-screen">
        <BackButton onClick={onBack} />
        <PageHeading
          title="Scene Archive"
          subtitle="Saved scenes, drafts, and ideas."
        />
        <div className="archive-filters">
          {[
            { id: "all", label: "All Scenes" },
            { id: "drafts", label: "Drafts" },
            { id: "saved", label: "Saved" },
            { id: "ideas", label: "Ideas" },
          ].map((tab) => (
            <button
              key={tab.id}
              className={filter === tab.id ? "active" : ""}
              aria-pressed={filter === tab.id}
              onClick={() => setFilter(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="archive-list">
          {items.length ? (
            items.map((item) => (
              <button
                key={item.id}
                aria-label={`Open ${item.title}`}
                onClick={() => onOpenScene(item.id)}
              >
                <img src={item.image} alt="" />
                <span>
                  <small>{item.status}</small>
                  <strong>{item.title}</strong>
                  <em>{item.excerpt || item.meta}</em>
                </span>
                <ArrowRight />
              </button>
            ))
          ) : (
            <p className="empty-archive">Nothing filed under this shelf yet.</p>
          )}
        </div>
        <button
          className="timeline-placeholder"
          onClick={() => onNavigate("configure")}
        >
          <Plus /> New Scene
        </button>
      </Screen>
      <BottomNav active="home" onNavigate={onNavigate} />
    </>
  );
}

export function WorkshopApp() {
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [session, setSession] = useState(() =>
    createSession(INITIAL_STATE.sceneConfig),
  );
  const [savedArchive, setSavedArchive] = useState<ArchiveItem[]>([]);
  const [notesByScene, setNotesByScene] = useState<Record<string, string>>({});
  const [justSaved, setJustSaved] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const persisted = loadPersisted();
    if (persisted) {
      setState((s) => ({
        ...s,
        sceneConfig: persisted.sceneConfig,
      }));
      setSavedArchive(persisted.savedArchive);
      setNotesByScene(persisted.notesByScene);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    savePersisted({
      sceneConfig: state.sceneConfig,
      savedArchive,
      notesByScene,
    });
  }, [hydrated, state.sceneConfig, savedArchive, notesByScene]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [state.screen]);

  const push = (screen: ScreenId) => setState((s) => pushScreen(s, screen));
  const jump = (screen: ScreenId) => setState((s) => jumpScreen(s, screen));
  const pickCharacter = (id: CharacterId) =>
    setState((s) => selectCharacter(s, id));
  const openScene = (id: string) => {
    const scene = findArchiveItem(id, savedArchive);
    if (!scene) return;
    const config = scene.config;
    setJustSaved(false);
    setSession(createSession(config, notesByScene[id] ?? scene.excerpt ?? ""));
    setState((s) => openArchiveScene(s, id, savedArchive));
  };
  const changeConfig = (patch: Partial<SceneConfig>) =>
    setState((s) => patchConfig(s, patch));
  const begin = () => {
    setJustSaved(false);
    setSession(
      createSession(
        state.sceneConfig,
        notesByScene[state.sceneConfig.premise] ?? "",
      ),
    );
    setState((s) => pushScreen(s, "workspace"));
  };
  const back = () =>
    setState((s) => (s.stack.length ? goBack(s) : pushScreen(s, "home")));
  const character = characterById(state.selectedCharacterId);
  const saveScene = (excerpt: string) => {
    const item = makeSavedScene(session.config, excerpt);
    setSavedArchive((list) => [item, ...list]);
    setNotesByScene((map) => ({ ...map, [item.id]: session.notes }));
    setJustSaved(true);
  };
  const updateSession = (next: SceneSession) => {
    setSession(next);
    setNotesByScene((map) => ({
      ...map,
      [next.config.premise || "untitled"]: next.notes,
    }));
  };

  if (state.screen === "libraries") {
    return (
      <LibrariesScreen
        openStory={() => jump("home")}
        openWorkspace={() => {
          setSession(
            createSession(
              state.sceneConfig,
              notesByScene[state.sceneConfig.premise] ?? "",
            ),
          );
          push("workspace");
        }}
        onNavigate={jump}
      />
    );
  }
  if (state.screen === "home") {
    return <HomeScreen onNavigate={jump} />;
  }
  if (state.screen === "characters") {
    return (
      <CharactersScreen onNavigate={jump} onSelectCharacter={pickCharacter} />
    );
  }
  if (state.screen === "profile") {
    return (
      <ProfileScreen character={character} onBack={back} onNavigate={jump} />
    );
  }
  if (state.screen === "configure") {
    return (
      <ConfigureScreen
        config={state.sceneConfig}
        onChange={changeConfig}
        begin={begin}
        onNavigate={jump}
      />
    );
  }
  if (state.screen === "workspace") {
    return (
      <WorkspaceScreen
        session={session}
        onSessionChange={updateSession}
        onBack={back}
        onNavigate={jump}
        onSave={saveScene}
        saved={justSaved}
      />
    );
  }
  if (state.screen === "timeline") {
    return <TimelineScreen onBack={back} onNavigate={jump} />;
  }
  return (
    <ArchiveScreen
      onBack={back}
      onNavigate={jump}
      onOpenScene={openScene}
      extra={savedArchive}
    />
  );
}
