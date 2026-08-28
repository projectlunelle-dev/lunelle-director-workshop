export const ASSET = "/workshop";

export type CharacterId = "ryo" | "ren" | "natsuki" | "raina";

export type Relationship = {
  name: string;
  tag: string;
  detail: string;
  tone: string;
};

export type ProfileRow = {
  title: string;
  body: string;
};

export type Character = {
  id: CharacterId;
  name: string;
  role: string;
  image: string;
  profileImage: string;
  profileTag: string;
  kicker: string;
  scrapbook: { src: string; title: string; note: string }[];
  relationships: Relationship[];
  profile: ProfileRow[];
  lore: string;
  voice: string;
};

export const CHARACTER_NAMES: Record<CharacterId, string> = {
  ryo: "Ryo Kanzaki",
  ren: "Ren Tachibana",
  natsuki: "Natsuki Kirihara",
  raina: "Raina Kanzaki",
};

export const CHARACTERS: Character[] = [
  {
    id: "ryo",
    name: "Ryo Kanzaki",
    role: "Protagonist",
    image: `${ASSET}/ryo-current.jpg`,
    profileImage: `${ASSET}/ryo-current.jpg`,
    profileTag: "11 years old",
    kicker: "Quiet gravity.",
    scrapbook: [
      {
        src: `${ASSET}/ryo-profile.jpg`,
        title: "First spring",
        note: "A young Ryo beneath the blossoms.",
      },
    ],
    relationships: [
      {
        name: "Ren Tachibana",
        tag: "Oldest friend",
        detail:
          "Ren is the first person who keeps returning without demanding an explanation. Ryo trusts his presence before he trusts his words.",
        tone: "A bond built from patience, proximity, and what neither boy says aloud.",
      },
      {
        name: "Raina Kanzaki",
        tag: "Younger sister",
        detail:
          "Ryo is protective of Raina and quietly organizes his choices around keeping her safe. She sees more of his softness than he intends.",
        tone: "Family gravity; tender, watchful, and sometimes too heavy for either of them.",
      },
      {
        name: "Main character",
        tag: "New connection",
        detail:
          "The new girl enters the rhythm Ryo and Ren already share. Ryo notices how Ren notices her—and begins making room before he understands why.",
        tone: "An early trust that can grow through small, chosen acts of proximity.",
      },
      {
        name: "Natsuki Kirihara",
        tag: "Later arrival",
        detail:
          "Natsuki joins after the earliest circle has formed. Ryo remains difficult for him to read, which creates a guarded and unresolved tension.",
        tone: "Working direction; neither boy has decided what the other means yet.",
      },
    ],
    profile: [
      {
        title: "Core",
        body: "Observant and self-contained. He notices everything, speaks little, and carries more than he lets on.",
      },
      {
        title: "Motives",
        body: "To protect the people he cares about. To prove he is more than the shadow everyone expects him to be.",
      },
      {
        title: "Fears",
        body: "Being a burden. Losing control—and the only people who stay.",
      },
      {
        title: "Current State",
        body: "Holding himself together after something he cannot take back. Trying to choose a future he is allowed to want.",
      },
    ],
    lore: "The Kanzaki house sits a short walk from the seawall. Ryo learned early that quiet can be a kindness and a hiding place. He keeps a private inventory of the path: which stones hold heat after sunset, which gaps in the railing catch dropped things, which hours belong only to the tide.",
    voice: "Short sentences. He rarely explains. Silence does the work. When he does speak, it is specific—a name, a direction, a fact about the weather—never a speech.",
  },
  {
    id: "ren",
    name: "Ren Tachibana",
    role: "Second Lead",
    image: `${ASSET}/ren-current.jpg`,
    profileImage: `${ASSET}/ren-current.jpg`,
    profileTag: "11 years old",
    kicker: "The one who makes room.",
    scrapbook: [
      {
        src: `${ASSET}/ren.jpg`,
        title: "Seaside study",
        note: "An early workshop portrait.",
      },
    ],
    relationships: [
      {
        name: "Ryo Kanzaki",
        tag: "Oldest friend",
        detail:
          "Ren has learned to stay beside Ryo without forcing open every silence. He treats Ryo’s boundaries as something to understand, not defeat.",
        tone: "Steady friendship with a gentle push toward being known.",
      },
      {
        name: "Main character",
        tag: "New classmate",
        detail:
          "Ren notices the new girl first and naturally becomes the bridge between her and the existing rhythm of the group.",
        tone: "Open, welcoming, and shaped by Ren’s instinct to make room.",
      },
      {
        name: "Raina Kanzaki",
        tag: "Trusted friend",
        detail:
          "Raina’s camera project gives Ren a reason to show up, perform a little, and help hold the group together.",
        tone: "Easy affection with a shared love of collecting moments.",
      },
      {
        name: "Natsuki Kirihara",
        tag: "Unsettled connection",
        detail:
          "Natsuki’s later arrival challenges Ren’s instinct to smooth every edge. Ren wants to understand him without ignoring the harm he can cause.",
        tone: "Working direction; warmth meeting a person who does not yet know how to receive it.",
      },
    ],
    profile: [
      {
        title: "Core",
        body: "Warm, socially fluent, and a little theatrical. He notices first, then makes space, then pretends it was nothing.",
      },
      {
        title: "Motives",
        body: "Keep the group together. Be the bridge. Don’t let Ryo disappear into himself.",
      },
      {
        title: "Fears",
        body: "Being the only one trying. That his ease is mistaken for shallowness.",
      },
      {
        title: "Current State",
        body: "Already collecting a summer. Waiting for the new girl to look back, and for Ryo to stay.",
      },
    ],
    lore: "Ren’s family runs a small shop facing the station road. He treats every gathering like a production he is quietly stage-managing—who stands where, who gets the last ramune, who needs an exit that doesn’t look like an exit.",
    voice: "Talks with his hands. Offers nicknames, snacks, and second chances. When he is hurt, the performance gets brighter before it gets honest.",
  },
  {
    id: "natsuki",
    name: "Natsuki Kirihara",
    role: "Later Addition",
    image: `${ASSET}/natsuki-current.jpg`,
    profileImage: `${ASSET}/natsuki-current.jpg`,
    profileTag: "Joins later",
    kicker: "A polished arrival.",
    scrapbook: [
      {
        src: `${ASSET}/natsuki.jpg`,
        title: "Glasshouse light",
        note: "An early workshop portrait.",
      },
    ],
    relationships: [
      {
        name: "Ryo Kanzaki",
        tag: "Difficult to read",
        detail:
          "Ryo’s reserve leaves Natsuki without the reassurance or control he expects from other people. Their silences become charged before either names the tension.",
        tone: "Guarded; a mirror for Natsuki’s fear of being dismissed.",
      },
      {
        name: "Ren Tachibana",
        tag: "Social counterpoint",
        detail:
          "Ren’s ease with people is both disarming and threatening to Natsuki. Ren can see the gap between Natsuki’s sweetness and his insecurity.",
        tone: "A push-pull between genuine welcome and defensive performance.",
      },
      {
        name: "Raina Kanzaki",
        tag: "Observed by her",
        detail:
          "Raina notices Natsuki before she fully understands him. Her curiosity makes it harder for him to remain only an image from a safe distance.",
        tone: "Uneasy curiosity; she records what others overlook.",
      },
      {
        name: "Main character",
        tag: "Unfixed",
        detail:
          "The main character’s response to Natsuki remains intentionally open. Her presence can become comfort, challenge, or a boundary he cannot charm past.",
        tone: "Open variable for the director and player.",
      },
    ],
    profile: [
      {
        title: "Core",
        body: "Polished, performative, and hungry for a place that feels like it was always his.",
      },
      {
        title: "Motives",
        body: "To belong without being known too quickly. To be chosen rather than merely included.",
      },
      {
        title: "Fears",
        body: "Being dismissed. Being seen as the late arrival who doesn’t count.",
      },
      {
        title: "Current State",
        body: "Watching from the edge of a circle that formed without him, deciding whether to step in or stay beautiful at a distance.",
      },
    ],
    lore: "Natsuki arrives after the first summer has already named itself. He comes from a household that prizes presentation. The group reads as both invitation and test—proof that warmth can exist without him, which is the one thing he cannot easily forgive.",
    voice: "Sweet until it isn’t. He asks questions that sound like compliments. When cornered, he becomes precise, almost adult, then immediately regrets the tone.",
  },
  {
    id: "raina",
    name: "Raina Kanzaki",
    role: "Younger Sister",
    image: `${ASSET}/raina-current.jpg`,
    profileImage: `${ASSET}/raina-current.jpg`,
    profileTag: "10 years old",
    kicker: "She is already filming.",
    scrapbook: [
      {
        src: `${ASSET}/raina.jpg`,
        title: "Rainy evening",
        note: "An early workshop portrait.",
      },
    ],
    relationships: [
      {
        name: "Ryo Kanzaki",
        tag: "Older brother",
        detail:
          "Ryo is Raina’s safest landmark, even when his protectiveness becomes a wall between her and the truth. She knows when he is pretending not to hurt.",
        tone: "Deep sibling bond; protective, loving, and shaped by shared history.",
      },
      {
        name: "Ren Tachibana",
        tag: "Part of her circle",
        detail:
          "Ren treats Raina’s ideas seriously, which makes him an easy collaborator for her summer film and a steady presence around her brother.",
        tone: "Playful trust and the beginnings of a chosen-family rhythm.",
      },
      {
        name: "Main character",
        tag: "New subject and friend",
        detail:
          "Raina is drawn to the new girl as someone worth welcoming—and worth placing inside the film she is already imagining.",
        tone: "Creative invitation; affection expressed through inclusion.",
      },
      {
        name: "Natsuki Kirihara",
        tag: "A story to understand",
        detail:
          "Raina begins noticing Natsuki at the edges of the group. She is curious about the person beneath the polished surface, but not blind to what feels wrong.",
        tone: "Observant, cautious, and unresolved.",
      },
    ],
    profile: [
      {
        title: "Core",
        body: "Curious, camera-first, younger and sharper than the boys expect. She collects people the way she collects light.",
      },
      {
        title: "Motives",
        body: "To make a film of this summer. To keep her brother close without trapping him.",
      },
      {
        title: "Fears",
        body: "That Ryo’s protectiveness will hide the truth from her. That the camera will make her a spectator in her own life.",
      },
      {
        title: "Current State",
        body: "Collecting the group through a lens she is still learning to hold—and already using it to ask the questions no one else will.",
      },
    ],
    lore: "Raina’s camera is slightly too large for her hands. She tapes notes to the strap: who stood where, what the sky was doing, whether Ryo smiled with his eyes. The summer film is less a project than a way of keeping everyone in the same frame.",
    voice: "Direct, a little bossy, unexpectedly lyrical when she talks about pictures. She names things. She asks ‘can I film that?’ the way other children ask ‘can I come too?’",
  },
];

export type ArchiveItem = {
  id: string;
  status: string;
  filter: "drafts" | "saved" | "ideas";
  title: string;
  meta: string;
  image: string;
  available: boolean;
};

export const ARCHIVE: ArchiveItem[] = [
  {
    id: "first-encounter",
    status: "Draft",
    filter: "drafts",
    title: "Ren & Ryo — First Encounter",
    meta: "Childhood · Seaside path",
    image: `${ASSET}/scene-art.jpg`,
    available: true,
  },
  {
    id: "lost-camera",
    status: "Saved",
    filter: "saved",
    title: "The Lost Camera",
    meta: "First summer · Story #001",
    image: `${ASSET}/idea-camera.jpg`,
    available: false,
  },
  {
    id: "waiting-out-rain",
    status: "Idea",
    filter: "ideas",
    title: "Waiting Out the Rain",
    meta: "Unscheduled · Story #001",
    image: `${ASSET}/idea-rain.jpg`,
    available: false,
  },
];

export const SCENE_IDEAS: { title: string; image: string }[] = [
  { title: "The Lost Camera", image: `${ASSET}/idea-camera.jpg` },
  { title: "A Dare at the Seawall", image: `${ASSET}/idea-seawall.jpg` },
  { title: "Waiting Out the Rain", image: `${ASSET}/idea-rain.jpg` },
];

export const TIMELINES = [
  "Childhood · First Meeting",
  "First Summer · The Camera",
] as const;

export const SETTINGS = [
  "Seaside path · Late afternoon",
  "School rooftop · After class",
] as const;

export const TIMELINE_EVENTS = [
  {
    era: "Childhood",
    title: "First Meeting",
    body: "Ren and Ryo meet near the seaside path.",
  },
  {
    era: "First Summer",
    title: "The Camera",
    body: "Raina begins collecting the group through her film project.",
  },
  {
    era: "Later",
    title: "Natsuki Joins",
    body: "Natsuki enters the group after its earliest formation.",
  },
];

export type ScreenId =
  | "libraries"
  | "home"
  | "characters"
  | "profile"
  | "configure"
  | "workspace"
  | "timeline"
  | "archive";

export const SCREENS: ScreenId[] = [
  "libraries",
  "home",
  "characters",
  "profile",
  "configure",
  "workspace",
  "timeline",
  "archive",
];

export type SceneConfig = {
  cast: CharacterId[];
  timeline: string;
  setting: string;
  premise: string;
};

export const DEFAULT_CONFIG: SceneConfig = {
  cast: ["ryo", "ren"],
  timeline: "Childhood · First Meeting",
  setting: "Seaside path · Late afternoon",
  premise: "The Lost Camera",
};

export function characterById(id: string): Character {
  return CHARACTERS.find((c) => c.id === id) ?? CHARACTERS[0];
}

export function formatCast(ids: string[]): string {
  const names = ids
    .map((id) => CHARACTER_NAMES[id as CharacterId])
    .filter(Boolean);
  if (names.length <= 1) return names[0] ?? "the selected cast";
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names.at(-1)}`;
}
