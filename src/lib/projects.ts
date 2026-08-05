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
  // animatic, process footage) — shown plainly, full-width, under its own
  // heading, so it reads as a different kind of artifact rather than
  // another screenshot. "image" = a static image grid (non-video studies).
  kind: "phone" | "context" | "image";
  src: string;
  poster?: string;
  caption?: string;
  // Heading shown directly above a "context" video — since it often
  // attaches after a quote-kind section (which has no visible heading of
  // its own), the video needs one that isn't borrowed from a section.
  heading?: string;
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
      "Turning messy footage and half-formed ideas into a finished story, by letting people edit the script instead of the timeline.",
    timeframe: "Summer – Fall 2025",
    team: "Justin Kim, Amy La, Maya P.",
    role: "Prototyping, System Design, Visual Design, Gen AI",
    tools: "Figma, ProtoPie, LottieLab, Gen AI tools",
    tags: ["Prototyping", "GenAI", "System Design"],
    cover: "/media/home/stitch-ai.jpg",
    media: [
      {
        kind: "context",
        src: "/media/stitch-ai/animatic.mp4",
        poster: "/media/stitch-ai/animatic.jpg",
        heading: "Sketching the hypothesis by hand",
        caption:
          "An animatic we sketched to pressure-test the hypothesis before writing a line of code.",
        after: "The hypothesis",
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
        heading: "The hypothesis",
        navLabel: "Hypothesis",
        kind: "quote",
        quote: "The barrier isn't editing. It's storytelling.",
      },
      {
        heading: "The solution",
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
          "Turning idle time into moments of music creation. The gaps between activities, waiting on a bus, pacing a room, are where songwriting ideas actually show up. Most tools assume you're already sitting down to “make music.”",
        ],
      },
      {
        heading: "Design decisions",
        body: [
          "A punch-in recording system lets people lay down multiple short takes over the same beat, so they can review rhythm, pacing, and word placement side by side without overplanning any single take.",
          "Lightweight rhyme suggestions step in only when someone's stuck, easing the bottleneck of lyric-writing without ever writing the line for them.",
          "The goal is a usable first draft, not a final one. The whole system is tuned for rapid iteration over perfection, so people can tell which takes “felt right” without re-listening to everything from scratch, and revisit past versions, compare changes, and move forward without second-guessing.",
        ],
      },
      {
        heading: "Reflection",
        body: [
          "By limiting where and how AI intervened, the product actually felt more creative, not less. And because nothing in the system felt permanent, people were more willing to experiment. Reversibility did more for creative confidence than any feature did.",
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
