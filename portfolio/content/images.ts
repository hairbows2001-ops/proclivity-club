// Every image used on the site, with its real pixel size and alt text.
// Images are cropped from the portfolio pages and are shown no larger than
// their native size (see components/ImageRow.tsx).

export type Img = { src: string; alt: string; width: number; height: number };

const img = (name: string, width: number, height: number, alt: string): Img => ({
  src: `/images/${name}.webp`,
  width,
  height,
  alt,
});

export const images = {
  portrait: img("portrait", 360, 442, "Close-up portrait of Maha Fatima resting her face on her hand, wearing a gold and pearl earring."),

  // HEWN
  hewnHero: img("hewn-hero", 1365, 768, "HEWN campaign image: oak and black ash fitness weights arranged on a stone ledge in warm light, with the line “Objects for movement.”"),
  hewnLogo: img("hewn-logo", 558, 558, "The HEWN wordmark in black on bone, above the line “Sculptural objects for strength and balance. Estd 2026.”"),
  hewnConstruct: img("hewn-construct", 378, 168, "Construction grid for the HEWN wordmark, showing its proportions."),
  hewnPalette: img("hewn-palette", 681, 165, "HEWN colour palette: Black Ash, Bone, Sand, Oak, Sage and Slate, with colour values."),
  hewnApplications: img("hewn-applications", 748, 108, "HEWN identity applied to a business card, swing tag, signage, water bottle, shipping box and an embossed monogram."),
  hewnOak: img("hewn-oak", 903, 725, "The Oak Collection: six sculptural oak objects — ring bell, arc bell, club, push-up bars, flow blocks and oak stand."),
  hewnBlackAsh: img("hewn-blackash", 789, 559, "The Black Ash Collection: four dark sculptural dumbbells — arch, torus, prism and cylinder."),
  hewnPackaging: img("hewn-packaging", 1050, 698, "HEWN packaging sequence laid flat: kraft box, sleeve, foam insert, dust bag, kettlebell, care guide and certificate of authenticity."),
  hewnGrain: img("hewn-grain", 244, 698, "Close-up of pale, flowing wood grain."),
  hewnWood: img("hewn-wood", 399, 735, "Close-up of rich oak wood grain."),
  hewnProduct: img("hewn-product", 486, 727, "HEWN e-commerce product page for the 16 lb oak kettlebell, with gallery, details and related products."),
  hewnPopup: img("hewn-popup", 1365, 768, "Exterior of a HEWN pop-up exhibition on a city street, with stone walls, a tree and sculptural weights on plinths."),
  hewnInterior: img("hewn-interior", 1365, 768, "Interior of the HEWN pop-up: oak and black weights displayed on stone plinths under track lighting."),

  // Compass
  compassHero: img("compass-hero", 1365, 768, "Compass logo, a soft four-point star inside a glowing circle, with the line “Guiding your health. Every day.” on deep green."),
  compassLogo: img("compass-logo", 450, 345, "The Compass logo in sage green on cream: a four-point star framed by four arcs, above the wordmark and tagline."),
  compassApp: img("compass-app", 1365, 768, "Two Compass mobile screens: a home dashboard showing “Mom — All clear” with check-in, medication and appointment cards, and a shared appointments calendar."),
  compassWeb: img("compass-web", 1365, 768, "Compass website hero, “Know what matters. A calmer way to stay connected.”, beside translucent dashboard cards for check-ins, medication, care circle and appointments."),

  // Gallery 188
  g188Hall: img("g188-hall", 737, 700, "A bright gallery hall with a glass roof, concrete columns and a single large painting on the far wall."),
  g188Viewer: img("g188-viewer", 519, 768, "A visitor standing in front of a large abstract painting in black and cream."),
  g188World1: img("g188-world-1", 227, 257, "Close-up of a painted face among leaves."),
  g188World2: img("g188-world-2", 226, 257, "Visitors walking through a hall hung with translucent fabric."),
  g188World3: img("g188-world-3", 227, 257, "An artist crouched on a studio floor, mixing paint."),
  g188World4: img("g188-world-4", 227, 257, "Technicians installing a large painting from a ladder."),
  g188World5: img("g188-world-5", 226, 257, "A crowd talking at an evening gallery opening."),
  g188Feed: img("g188-feed", 626, 625, "A nine-post Instagram grid for Gallery 188 mixing gallery photography with type-led posts such as “You don’t need an art degree to have an opinion.”"),
  g188Post1: img("g188-post-1", 630, 256, "Three-slide carousel: “Why does this feel uncomfortable?”, “Before reading the artist statement, notice where your eye goes first.” and “There is no wrong answer.”"),
  g188Post2: img("g188-post-2", 264, 331, "Post: two technicians hanging a painting, captioned “48 hours before opening”."),
  g188Post3: img("g188-post-3", 264, 331, "Post: an artist in the studio above the question “What are you thinking about when nobody is asking about your work?”"),
  g188Campaign: img("g188-campaign", 1227, 306, "“Don’t just look.” campaign across an exhibition poster, Instagram post, story, reel and digital invitation."),
  g188Closing: img("g188-closing", 540, 768, "Two visitors walking through a gallery, one pointing towards a sculpture."),
};
