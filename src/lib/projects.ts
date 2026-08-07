export type ProjectSection = {
  heading: string;
  body?: string[];
  // "quote" renders as a centered pull-quote break instead of a normal
  // section. "challenges"/"insights" both render `cards` as a numbered
  // grid after any intro body copy — the same visual device, used for two
  // different narrative beats: distinct problems ("challenges") vs.
  // distinct things learned about the landscape before designing anything
  // ("insights") — surfacing several at once instead of one long paragraph.
  kind?: "quote" | "challenges" | "insights";
  quote?: string;
  cards?: { title: string; body: string }[];
  // Short label for the left-side section nav (CaseStudyNav). Non-quote
  // sections fall back to `heading` if omitted; quote sections are left
  // out of the nav entirely unless given one explicitly, so a plain pull
  // quote doesn't clutter the list.
  navLabel?: string;
  // Optional before/after chips rendered under the body copy, for making
  // a value proposition ("old mental model" → "new one") concrete.
  stateBefore?: string;
  stateAfter?: string;
};

export type ProjectMedia = {
  // "phone" = an actual UI screen recording, phone-framed, on the gray
  // stage. "context" = something that isn't a UI prototype at all (an
  // animatic, process footage), shown plainly and full-width with no
  // heading or caption of its own, so it reads as a different kind of
  // artifact rather than another screenshot. "image" = a static image
  // grid (non-video studies).
  kind: "phone" | "context" | "image";
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
  // A self-contained HTML page iframed over `cover` on the home page's
  // scroll-through, for projects whose cover is animated rather than a
  // still. `cover` stays the poster/fallback underneath it.
  coverHtml?: string;
  heroImage?: string;
  media?: ProjectMedia[];
  // Two prototype video clips shown upright and spaced apart in front of
  // the (blurred) cover photo on the home page's scroll-through project
  // reveal. Only set for projects where that reads well — not every cover
  // photo is a good blur backdrop, and not every project has spare clips.
  homePrototypes?: [
    { src: string; poster: string },
    { src: string; poster: string },
  ];
  sections: ProjectSection[];
};

export const projects: Project[] = [
  {
    slug: "stitch-ai",
    title: "Simplifying Vlog Creation",
    company: "Stitch AI",
    blurb:
      "Turning messy footage and half-formed ideas into a finished story, by letting people edit the script instead of the timeline.",
    timeframe: "Summer – Fall 2025",
    team: "Justin Kim, Amy La, Maya P.",
    role: "Prototyping, System Design, Visual Design, Gen AI",
    tools: "Figma, ProtoPie, LottieLab, Gen AI tools",
    tags: ["Prototyping", "GenAI", "System Design"],
    cover: "/media/home/stitch-ai.jpg",
    homePrototypes: [
      { src: "/media/stitch-ai/concept-dump.mp4", poster: "/media/stitch-ai/concept-dump.jpg" },
      { src: "/media/stitch-ai/ai-feature.mp4", poster: "/media/stitch-ai/ai-feature.jpg" },
    ],
    media: [
      {
        kind: "context",
        src: "/media/stitch-ai/animatic.mp4",
        poster: "/media/stitch-ai/animatic.jpg",
        after: "We hypothesize the barrier isn't editing, it's storytelling.",
      },
      {
        kind: "phone",
        src: "/media/stitch-ai/dump-media-a.mp4",
        poster: "/media/stitch-ai/dump-media-a.jpg",
        caption: "Dump in photos and video, in whatever order they actually happened.",
        after: "Dumping whatever you've got for the problem of the blank page",
      },
      {
        kind: "phone",
        src: "/media/stitch-ai/dump-media-b.mp4",
        poster: "/media/stitch-ai/dump-media-b.jpg",
        caption: "Or just type. Nothing has to be photographed to count.",
        after: "Dumping whatever you've got for the problem of the blank page",
      },
      {
        kind: "phone",
        src: "/media/stitch-ai/concept-dump.mp4",
        poster: "/media/stitch-ai/concept-dump.jpg",
        caption: "A voice note about a trip becomes the raw material for a script.",
        after: "Talking it out for the problem of losing detail",
      },
      {
        kind: "phone",
        src: "/media/stitch-ai/brainstorm-a.mp4",
        poster: "/media/stitch-ai/brainstorm-a.jpg",
        caption: "The brainstorm room turns rambling into a structured note.",
        after: "Talking it out for the problem of losing detail",
      },
      {
        kind: "phone",
        src: "/media/stitch-ai/brainstorm-b.mp4",
        poster: "/media/stitch-ai/brainstorm-b.jpg",
        caption: "Recording the narration that becomes the story's backbone.",
        after: "A-roll for the problem of not enough footage",
      },
      {
        kind: "phone",
        src: "/media/stitch-ai/edge-case.mp4",
        poster: "/media/stitch-ai/edge-case.jpg",
        caption: "Not enough footage for a scene, filled in with a photo, scene by scene.",
        after: "A-roll for the problem of not enough footage",
      },
      {
        kind: "phone",
        src: "/media/stitch-ai/edit-script.mp4",
        poster: "/media/stitch-ai/edit-script.jpg",
        caption: "Editing the story by editing a sentence, not hunting down a clip.",
        after: "Editing a sentence for the problem of editing a timeline",
      },
      {
        kind: "phone",
        src: "/media/stitch-ai/ai-feature.mp4",
        poster: "/media/stitch-ai/ai-feature.jpg",
        caption: "The script it wrote, next to the exact photos it wrote from.",
        after: "Editing a sentence for the problem of editing a timeline",
      },
      {
        kind: "phone",
        src: "/media/stitch-ai/hero-loop.mp4",
        poster: "/media/stitch-ai/hero-loop.jpg",
        caption: "The finished story: scenes you can still scrub through and rearrange.",
        after: "What I took away",
      },
    ],
    sections: [
      {
        heading: "The problem",
        navLabel: "Problem",
        body: [
          "Beginners struggle to tell stories from their moments. Everyone captures footage: photos, videos, voice notes. But for a first-time creator, the barrier was never the editing.",
        ],
      },
      {
        heading: "What similar apps already tried",
        navLabel: "Competitors",
        kind: "insights",
        body: [
          "Before designing anything, we looked at what similar apps and competitors were already doing, and where each attempt stopped short.",
        ],
        cards: [
          {
            title: "Apps like TikTok and Instagram tried to simplify the editing timeline",
            body: "We found most video-storytelling apps try to simplify by stripping down the UI for simplicity.",
          },
          {
            title: "Emerging AI video editors focused solely on automating editing",
            body: "Automation helped with cuts and clips, but left the process of storytelling to the user.",
          },
          {
            title: "The best videos weren't based on editing skills. They were based on the story",
            body: "What matters at the core of a video isn't the flashy edits or camera equipment. It was the story.",
          },
        ],
      },
      {
        heading: "We hypothesize the barrier isn't editing, it's storytelling.",
        navLabel: "Hypothesis",
      },
      {
        heading: "Script-first media, not editing tools",
        navLabel: "Solution",
        body: [
          "Edit your video by letting AI edit the script. Dump in everything you have, get a script back, and shape the story by rewriting it instead of wrestling with a timeline.",
        ],
        stateBefore: "An intimidating timeline, built for editors.",
        stateAfter: "A script anyone can read, rewrite, and understand.",
      },
      {
        heading: "Dumping whatever you've got for the problem of the blank page",
        navLabel: "Media dump",
        body: [
          "Writing a script from nothing is the hardest part, so we never ask for one. Photos, video, or plain typed notes: none of it has to be curated first. AI turns whatever you dump in into a first script, then you pick a direction from there.",
        ],
      },
      {
        heading: "Talking it out for the problem of losing detail",
        navLabel: "Talking it out",
        body: [
          "People surfaced far more detail rambling out loud than typing a note, so the brainstorm room lets you just talk. AI asks the follow-up questions a blank text field never would, then turns the conversation into a structured script.",
        ],
      },
      {
        heading: "A-roll for the problem of not enough footage",
        navLabel: "A-roll",
        body: [
          "The question that kept coming up in testing: what if you don't have enough footage? Our answer was A-roll: record yourself reading or reacting to the script, and that single clip becomes the story's backbone.",
          "We'd assumed every line of narration needed its own matching footage. A-roll broke that assumption. The story could carry itself, and existing photos and video became optional support instead of a requirement.",
        ],
      },
      {
        heading: "Editing a sentence for the problem of editing a timeline",
        navLabel: "Script editing",
        body: [
          "This is a storytelling tool before it's an editing tool, so editing had to happen at the level of a sentence, not a frame. Rewrite a line and the video follows. No timeline, no clips to hunt down.",
          "AI stays scoped to exactly what you gave it: generating video from your own photos, batch-editing your own script, rather than inventing anything from nothing.",
        ],
      },
      {
        heading: "What I took away",
        navLabel: "Reflection",
        body: [
          "Two lessons stuck with me: keep async collaboration succinct so the team doesn't lose the thread between sessions, and when you're pitching a GenAI feature, establish credibility on feasibility early, before the room starts asking whether it's actually possible to ship.",
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
    homePrototypes: [
      { src: "/media/idle-songwriting/clip-1-punchin.mp4", poster: "/media/idle-songwriting/clip-1-punchin.jpg" },
      { src: "/media/idle-songwriting/clip-2-rhyme.mp4", poster: "/media/idle-songwriting/clip-2-rhyme.jpg" },
    ],
    media: [
      {
        kind: "phone",
        src: "/media/idle-songwriting/clip-1-punchin.mp4",
        poster: "/media/idle-songwriting/clip-1-punchin.jpg",
        caption: "Screen 01: hold to loop a section, then record over it.",
        after: "User records lyrics over the loop",
      },
      {
        kind: "phone",
        src: "/media/idle-songwriting/clip-2-rhyme.mp4",
        poster: "/media/idle-songwriting/clip-2-rhyme.jpg",
        caption: "Screen 02: the loop becomes temporary generated lyrics.",
        after: "User generates lyrics based on the loop",
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
        navLabel: "Problem",
        body: [
          "“The finished product of an album is flawless. But the process of making an album? Broken.”",
          "The gaps between activities, waiting on a bus, pacing a room, are where songwriting ideas actually show up. Most tools assume you're already sitting down to “make music,” and reach for AI that substitutes in for the creative work instead of supporting it.",
        ],
      },
      {
        heading: "What 15+ artists told us",
        navLabel: "Research",
        kind: "insights",
        body: [
          "We interviewed and tested with over 15 working artists, musicians, and songwriters before designing anything. “It's more about finding a rhythm than the lyrics themselves,” one songwriter told us, a line that stuck with us through the rest of the project.",
        ],
        cards: [
          {
            title: "Quick bursts of inspiration end up in disorganized apps",
            body: "Ideas surfaced between activities and got scattered across notes apps and voice memos never built for songwriting.",
          },
          {
            title: "Artists don't want “one-prompt” AI",
            body: "Generating a full song end-to-end felt like the AI was writing it instead of them.",
          },
          {
            title: "Artists don't “write” lyrics, they punch in",
            body: "Lyrics came from laying down short takes over a beat and revising them, not composing line by line on a blank page.",
          },
        ],
      },
      {
        heading: "Generate temporary lyrics, keep a permanent flow.",
        navLabel: "Hypothesis",
      },
      {
        heading: "AI that supports creation, not substitutes for it",
        navLabel: "Solution",
        body: [
          "The app fills idle moments with malleable lyric ideas artists can punch in, test, and refine later: temporary lyrics generated over a loop, while the artist's own flow stays permanent. Here's the key flow.",
        ],
        stateBefore: "A blank page, or an AI that writes the whole song for you.",
        stateAfter: "Temporary lyrics you punch in, test, and refine yourself.",
      },
      {
        heading: "User records lyrics over the loop",
        navLabel: "Screen 01",
        body: [
          "The user holds to loop a section of the song, so that part now repeats over and over.",
          "They can sing, freestyle, or even mumble over the looped section, capturing an idea in the moment instead of stopping to write it down first.",
        ],
      },
      {
        heading: "User generates lyrics based on the loop",
        navLabel: "Screen 02",
        body: [
          "Once a take is recorded, the app turns the loop into temporary generated lyric suggestions, letting the artist stay in the flow of making music instead of stopping to write.",
          "They can view rhyming options and alternate lines from the AI, then tweak or record again using those as a starting point.",
        ],
      },
      {
        heading: "User adjusts generative lyrics",
        navLabel: "Screen 03",
        body: [
          "From there, the artist keeps shaping the take: swapping in a different rhyme, rerecording a line, or building on a suggestion until it feels like theirs, not the AI's.",
        ],
      },
      {
        heading: "What I took away",
        navLabel: "Reflection",
        body: [
          "The whole system is tuned for rapid iteration over perfection, so people could tell which takes “felt right” without re-listening to everything from scratch, and revisit past versions without second-guessing.",
          "“Designing in theory never works.” By limiting where and how AI intervened, the product actually felt more creative, not less. And because nothing in the system felt permanent, people were more willing to experiment. Reversibility did more for creative confidence than any feature did.",
        ],
      },
    ],
  },
  {
    slug: "notability",
    title: "Collaborative Notetaking, Classrooms",
    company: "Notability / Ginger Labs",
    blurb:
      "Rethinking Notability as a shared classroom workspace, not just a place to take notes alone.",
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
          "One of the only visuals I can share publicly. The rest is under NDA.",
        after: "The opportunity",
      },
    ],
    sections: [
      {
        heading: "The problem",
        body: [
          "Learning is social, notes are not. Notetaking tools are designed for individual use, even though learning in classrooms is collaborative and guided, which leaves teachers without visibility into student thinking, and students without shared understanding.",
        ],
      },
      {
        heading: "The opportunity",
        body: [
          "Notes as a shared classroom workspace: Notability could become the central learning surface of the classroom by enabling shared, real-time interaction, where teachers can guide learning and students can build understanding together.",
          "AI represents a fundamental shift here: from tools that store information to systems that understand and respond to learning, surfacing patterns, highlighting gaps in understanding, and adapting content in real time.",
        ],
      },
    ],
  },
  {
    slug: "handshake",
    title: "Insights for Student Projects",
    company: "Handshake",
    blurb:
      "Moving recruitment beyond resumes, helping employers see how students actually think, build, and grow.",
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
          "Handshake can redefine how young talent is understood through projects, moving beyond static resumes to highlight how students learn, build, and contribute.",
        ],
      },
    ],
  },
  {
    slug: "digital-pool",
    title: "Design System, Components",
    company: "Digital Pool",
    blurb:
      "Standardizing a fragmented design system across iOS and web, starting with the platform's most reused component.",
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
        caption: "Tournament card iterations, solving for height and data variance.",
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
        navLabel: "Focus",
        body: [
          "The tournament card was by far the most reused component on Digital Pool's platform, which made it a high priority to explore how it could function at scale and accommodate a wide range of data and data types.",
          "Two problems kept showing up: it was too tall to scale across many tournaments, and it broke under real data and content variation.",
        ],
      },
      {
        heading: "Outcome",
        body: [
          "A consistent visual foundation for a growing platform with 45,000+ tournaments: unified components and styles across the platform, making the product easier to use and easier to build.",
        ],
      },
    ],
  },
];

export const getProject = (slug: string) =>
  projects.find((p) => p.slug === slug);
