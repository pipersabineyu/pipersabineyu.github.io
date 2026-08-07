export type Experiment = {
  title: string;
  src: string;
  // Most of these prototypes draw their own phone bezel already. This one
  // doesn't (it's just the screen), so PrototypeFrame draws a matching
  // bezel around it so all four look like the same kind of artifact.
  drawBezel?: boolean;
};

// Interactive HTML prototypes shown in the home page's "Prototyping
// Experiments" section — quick standalone explorations that don't warrant
// a full case study, unlike the projects covered in the hero scroll-through.
export const experiments: Experiment[] = [
  {
    title: "Pack outfits for a trip guaranteed to fit your suitcase",
    src: "/experiments/fits-reel.html",
    drawBezel: true,
  },
  {
    title: "Experience the weather",
    src: "/experiments/curtains-with-weather.html",
  },
  {
    title: "Get indoor directions to your car from Uber",
    src: "/experiments/uber-indoor-directions.html",
  },
  {
    title: "Remind yourself to respond to messages later",
    src: "/experiments/apple-messages-for-later.html",
  },
];
