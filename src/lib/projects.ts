export type ProjectSection = {
  heading: string;
  body: string[];
};

export type ProjectMedia = {
  kind: "phone" | "image";
  src: string;
  poster?: string;
  caption?: string;
  after: string;
};

export type Project = {
  slug: string;
  title: string;
  company: string;
  blurb: string;
  timeframe: string;
  team?: string;
  role: string;
  tools?: string;
  tags: string[];
  nda?: boolean;
  cover: string;
  heroImage?: string;
  media?: ProjectMedia[];
  sections: ProjectSection[];
};

export const projects: Project[] = [
  {
    slug: "stitch-ai",
    title: "Simplifying Vlog Creation",
    company: "Stitch AI",
    blurb:
      "Turning messy footage and half-formed ideas into a finished story — by letting people edit the script, not the timeline.",
    timeframe: "Summer – Fall 2025",
    team: "Justin Kim, Amy La, Maya P.",
    role: "Prototyping, System Design, Visual Design, Gen AI",
    tools: "Figma, ProtoPie, LottieLab, Gen AI tools",
    tags: ["Prototyping", "GenAI", "System Design"],
    cover: "/media/home/stitch-ai.jpg",
    media: [
      {
        kind: "phone",
        src: "/media/stitch-ai/clip-1-onboarding.mp4",
        poster: "/media/stitch-ai/clip-1-onboarding.jpg",
        caption: "“What story should we tell?” — dump in notes, media, and messy ideas.",
        after: "The idea",
      },
      {
        kind: "phone",
        src: "/media/stitch-ai/clip-2-generate.mp4",
        poster: "/media/stitch-ai/clip-2-generate.jpg",
        caption: "Choosing a direction and generating a first script.",
        after: "Design decisions",
      },
      {
        kind: "phone",
        src: "/media/stitch-ai/clip-3-edit.mp4",
        poster: "/media/stitch-ai/clip-3-edit.jpg",
        caption: "Editing the story by editing the script, not a timeline.",
        after: "Design decisions",
      },
    ],
    sections: [
      {
        heading: "The problem",
        body: [
          "Beginners struggle to tell stories from their moments. Everyone captures footage — photos, videos, voice notes — but for a first-time creator, the barrier was never the editing.",
          "“The problem isn't editing, the problem is they don't have a story.”",
        ],
      },
      {
        heading: "The idea",
        body: [
          "Stitch lets you dump all your ideas — notes, moments, media, and messy thoughts — and generates a script from them.",
          "From there, you edit your video by editing the script, instead of wrangling an intimidating timeline. And the tool is built to work with the footage you already have, not to demand reshoots.",
        ],
      },
      {
        heading: "What made it hard",
        body: [
          "Three things kept surfacing in testing: people never have enough B-roll and can't reshoot a moment that's already passed; creators don't trust AI-generated content that feels generic or inauthentic; and when the creative task feels endless, beginners just give up before finishing.",
        ],
      },
      {
        heading: "Design decisions",
        body: [
          "Narrative A-roll, not B-roll: users film themselves reading or reacting to their own script, so a single narrative clip becomes the backbone of the story — which quietly removes the pressure to have “enough footage.”",
          "A brainstorm room gives structure without taking away control: it suggests a direction while leaving the user free to override it.",
          "AI is scoped tightly — it operates directly on the user's own media and words, turning an overwhelming task into a handful of manageable steps, like photo-to-video generation and batch script edits.",
        ],
      },
      {
        heading: "What I took away",
        body: [
          "Two lessons stuck with me: keep async collaboration succinct so the team doesn't lose the thread between sessions, and when you're pitching a GenAI feature, establish credibility on feasibility early — before the room starts asking whether it's actually possible to ship.",
        ],
      },
    ],
  },
  {
    slug: "idle-songwriting",
    title: "Idle Songwriting",
    company: "[untitled]",
    blurb:
      "A five-day concept turning dead time between activities into small, low-pressure moments of songwriting.",
    timeframe: "Fall 2025",
    team: "Justin Kim, Amy La, Maya P.",
    role: "Prototyping, Interaction Design, Motion Design",
    tools: "Figma, ProtoPie, LottieLab",
    tags: ["Interaction Design", "Motion", "Prototyping"],
    cover: "/media/home/idle-songwriting.jpg",
    media: [
      {
        kind: "phone",
        src: "/media/idle-songwriting/clip-1-punchin.mp4",
        poster: "/media/idle-songwriting/clip-1-punchin.jpg",
        caption: "Punch-in recording: lay down short takes over the same beat.",
        after: "Design decisions",
      },
      {
        kind: "phone",
        src: "/media/idle-songwriting/clip-2-rhyme.mp4",
        poster: "/media/idle-songwriting/clip-2-rhyme.jpg",
        caption: "Rhyme suggestions step in only when you're stuck.",
        after: "Design decisions",
      },
    ],
    sections: [
      {
        heading: "Context",
        body: [
          "A five-day design competition, presented to industry designers from Apple, Notion, Meta, Google Creative Lab, and Figma.",
        ],
      },
      {
        heading: "The problem",
        body: [
          "Turning idle time into moments of music creation — the gaps between activities, waiting on a bus, pacing a room, are where songwriting ideas actually show up. Most tools assume you're already sitting down to “make music.”",
        ],
      },
      {
        heading: "Design decisions",
        body: [
          "A punch-in recording system lets people lay down multiple short takes over the same beat, so they can review rhythm, pacing, and word placement side by side without overplanning any single take.",
          "Lightweight rhyme suggestions step in only when someone's stuck, easing the bottleneck of lyric-writing without ever writing the line for them.",
          "The goal is a usable first draft, not a final one — the whole system is tuned for rapid iteration over perfection, so people can tell which takes “felt right” without re-listening to everything from scratch, and revisit past versions, compare changes, and move forward without second-guessing.",
        ],
      },
      {
        heading: "Reflection",
        body: [
          "By limiting where and how AI intervened, the product actually felt more creative, not less. And because nothing in the system felt permanent, people were more willing to experiment — reversibility did more for creative confidence than any feature did.",
        ],
      },
    ],
  },
  {
    slug: "notability",
    title: "Collaborative Notetaking, Classrooms",
    company: "Notability / Ginger Labs",
    blurb:
      "Rethinking Notability as a shared classroom workspace — not just a place to take notes alone.",
    timeframe: "Fall 2025",
    team: "Ashley Kwak, Angela Luo, Mindy Tsai, Maple Leung",
    role: "Product Management, Interaction Design, Prototyping",
    tags: ["Product Management", "Interaction Design"],
    nda: true,
    cover: "/media/home/notability.jpg",
    media: [
      {
        kind: "image",
        src: "/media/notability/mockup.jpg",
        caption:
          "One of the only visuals I can share publicly — the rest is under NDA.",
        after: "The opportunity",
      },
    ],
    sections: [
      {
        heading: "The problem",
        body: [
          "Learning is social, notes are not. Notetaking tools are designed for individual use, even though learning in classrooms is collaborative and guided — which leaves teachers without visibility into student thinking, and students without shared understanding.",
        ],
      },
      {
        heading: "The opportunity",
        body: [
          "Notes as a shared classroom workspace: Notability could become the central learning surface of the classroom by enabling shared, real-time interaction, where teachers can guide learning and students can build understanding together.",
          "AI represents a fundamental shift here — from tools that store information to systems that understand and respond to learning, surfacing patterns, highlighting gaps in understanding, and adapting content in real time.",
        ],
      },
    ],
  },
  {
    slug: "handshake",
    title: "Insights for Student Projects",
    company: "Handshake",
    blurb:
      "Moving recruitment beyond resumes — helping employers see how students actually think, build, and grow.",
    timeframe: "Spring 2025",
    team: "Aashna Patel, Ashley Canizalez, Grace Zhang, Madison Lee",
    role: "Product Design, Prototyping, UXR",
    tags: ["Product Design", "UXR", "Prototyping"],
    nda: true,
    cover: "/media/home/handshake.jpg",
    heroImage: "/media/handshake/wordmark.jpg",
    sections: [
      {
        heading: "The problem",
        body: [
          "Recruitment relies too heavily on titles and bullet points. Current profiles flatten students into roles and lists, even though employers increasingly care about growth, collaboration, and real problem-solving.",
        ],
      },
      {
        heading: "The opportunity",
        body: [
          "Handshake can redefine how young talent is understood through projects — moving beyond static resumes to highlight how students learn, build, and contribute.",
        ],
      },
    ],
  },
  {
    slug: "digital-pool",
    title: "Design System, Components",
    company: "Digital Pool",
    blurb:
      "Standardizing a fragmented design system across iOS and web — starting with the platform's most reused component.",
    timeframe: "Summer 2024",
    team: "Piper Yu, Alexis Gu, Emily Tsai, Christopher Clark, 2 frontend developers",
    role: "Visual Design, Design Systems",
    tags: ["Design Systems", "Visual Design"],
    cover: "/media/home/digital-pool.jpg",
    heroImage: "/media/digital-pool/hero-phones.jpg",
    media: [
      {
        kind: "image",
        src: "/media/digital-pool/typography.jpg",
        caption: "Standardizing type across iOS and web.",
        after: "The problem",
      },
      {
        kind: "image",
        src: "/media/digital-pool/color-system.jpg",
        caption: "A unified color system for a growing platform.",
        after: "The problem",
      },
      {
        kind: "image",
        src: "/media/digital-pool/tournament-card.jpg",
        caption: "Tournament card iterations — solving for height and data variance.",
        after: "Where I focused: the tournament card",
      },
      {
        kind: "image",
        src: "/media/digital-pool/component-map.jpg",
        caption: "Mapping components to how they're actually used across the platform.",
        after: "Where I focused: the tournament card",
      },
    ],
    sections: [
      {
        heading: "The problem",
        body: [
          "Digital Pool's design system wasn't cohesive. The task: standardize typography and create reusable components across iOS and web.",
        ],
      },
      {
        heading: "Where I focused: the tournament card",
        body: [
          "The tournament card was by far the most reused component on Digital Pool's platform, which made it a high priority to explore how it could function at scale and accommodate a wide range of data and data types.",
          "Two problems kept showing up: it was too tall to scale across many tournaments, and it broke under real data and content variation.",
        ],
      },
      {
        heading: "Outcome",
        body: [
          "A consistent visual foundation for a growing platform with 45,000+ tournaments — unified components and styles across the platform, making the product easier to use and easier to build.",
        ],
      },
    ],
  },
];

export const getProject = (slug: string) =>
  projects.find((p) => p.slug === slug);
