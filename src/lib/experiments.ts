export type Experiment = {
  title: string;
  src: string;
};

// Interactive HTML prototypes shown in the home page's "Prototyping
// Experiments" section — quick standalone explorations that don't warrant
// a full case study, unlike the projects covered in the hero scroll-through.
export const experiments: Experiment[] = [
  {
    title: "Experience the weather",
    src: "/experiments/curtains-with-weather.html",
  },
  {
    title: "Remind yourself to respond to messages later",
    src: "/experiments/apple-messages-for-later.html",
  },
  {
    title: "Get indoor directions to your car from Uber",
    src: "/experiments/uber-indoor-directions.html",
  },
];
