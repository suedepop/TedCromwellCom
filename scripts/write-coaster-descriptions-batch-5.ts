import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

const DESCRIPTIONS: Record<string, string> = {
  "six-flags-new-england-batman-the-dark-knight":
    "Steel floorless coaster at Six Flags New England in Agawam, Massachusetts, opened 2002 as Batman: The Dark Knight. Built by Bolliger & Mabillard. 117 feet tall, five inversions, top speed 55 mph.",
  "six-flags-new-england-catwoman-whip":
    "Junior steel coaster at Six Flags New England in Agawam, Massachusetts. A small family-friendly layout in the DC Super Hero Adventures area.",
  "six-flags-new-england-cyclone":
    "Wooden coaster that operated at Six Flags New England in Agawam, Massachusetts, from 1983 to 2006 as Cyclone. Designed by William Cobb based on the layout of the Coney Island Cyclone. 107 feet tall, top speed 60 mph. Heavily modified and reopened as Wicked Cyclone (an RMC steel hybrid) in 2015.",
  "six-flags-new-england-flashback":
    "Steel shuttle coaster that operated at Six Flags New England in Agawam, Massachusetts. Built by Vekoma using their Boomerang model. The classic Boomerang layout. Removed in 2006 after a 14-year run.",
  "six-flags-new-england-pandemonium":
    "Steel spinning coaster at Six Flags New England in Agawam, Massachusetts, opened 2005. Built by Gerstlauer using their Spinning Coaster model. Cars rotate freely through a compact layout. Originally Pandemonium, has been rebranded as Catwoman: The Caped Crusader and other names over the years.",
  "six-flags-new-england-riddler-revenge":
    "Steel coaster at Six Flags New England in Agawam, Massachusetts. Built by Premier Rides — a Sky Rocket II / Sky Loop model with a beyond-vertical top hat. Themed to The Riddler.",
  "six-flags-new-england-superman-the-ride":
    "Steel hyper coaster at Six Flags New England in Agawam, Massachusetts, opened 2000. Built by Intamin. 208 feet tall with a 221-foot drop into a tunnel, top speed 77 mph. Multiple Golden Ticket Awards for #1 Steel Coaster in the mid-2000s. Originally Superman: Ride of Steel; renamed Bizarro 2009–2015, then back to Superman the Ride.",
  "six-flags-new-england-thunderbolt":
    "Wooden coaster at Six Flags New England in Agawam, Massachusetts, opened 1941. Designed by Herbert Schmeck of Philadelphia Toboggan Coasters. 70 feet tall, top speed 45 mph. A long-running classic of the New England theme-park scene; an American Coaster Enthusiasts Coaster Classic.",
  "six-flags-over-georgia-batman-the-ride":
    "Steel inverted coaster at Six Flags Over Georgia in Austell, Georgia, opened 1997. Built by Bolliger & Mabillard. A clone of the original Batman the Ride at Six Flags Great America. 105 feet tall, five inversions, top speed 50 mph.",
  "six-flags-over-georgia-dahlonega-mine-train":
    "Steel mine-train coaster at Six Flags Over Georgia in Austell, Georgia, opened 1967 — one of the park's original opening-day attractions. Built by Arrow Development. A family-friendly mine-train layout themed to a Georgia gold-rush mine.",
  "six-flags-over-georgia-georgia-cyclone":
    "Wooden coaster that operated at Six Flags Over Georgia from 1990 to 2017. Designed by Curtis D. Summers. 95 feet tall, top speed 50 mph. Based on the layout of the Coney Island Cyclone. Reprofiled by Rocky Mountain Construction and reopened as Twisted Cyclone in 2018.",
  "six-flags-over-georgia-georgia-scorcher":
    "Steel stand-up coaster at Six Flags Over Georgia in Austell, Georgia, opened 1999. Built by Bolliger & Mabillard. 107 feet tall, two inversions, top speed 54 mph. One of the later stand-up coaster installations.",
  "six-flags-over-georgia-goliath":
    "Steel hyper coaster at Six Flags Over Georgia in Austell, Georgia, opened 2006. Built by Bolliger & Mabillard. 200 feet tall, 175-foot drop, top speed 70 mph. Best known for its sequence of camelback airtime hills.",
  "six-flags-over-georgia-great-american-scream-machine":
    "Wooden racing coaster at Six Flags Over Georgia in Austell, Georgia, opened 1973. Designed by John Allen of Philadelphia Toboggan Coasters. 105 feet tall, top speed 57 mph. Two parallel tracks race. An American Coaster Enthusiasts Coaster Landmark.",
  "six-flags-over-georgia-joker-funhouse-coaster":
    "Steel family coaster at Six Flags Over Georgia in Austell, Georgia. A small junior layout in the DC Super Friends area, themed to the Joker.",
  "six-flags-over-georgia-riddler-mindbender":
    "Steel multi-looping coaster at Six Flags Over Georgia in Austell, Georgia, opened 1978 as Mindbender. Built by Anton Schwarzkopf. 80 feet tall, three inversions, top speed 50 mph. At opening, the world's first triple-loop coaster. Rebranded as Riddler Mindbender with The Riddler theming.",
  "six-flags-over-georgia-superman-ultimate-flight":
    "Steel flying coaster at Six Flags Over Georgia in Austell, Georgia, opened 2002. Built by Bolliger & Mabillard. 109 feet tall, one inversion (a pretzel loop), top speed 51 mph. Riders fly in face-down position. Sister installation to the Six Flags Great Adventure and Six Flags Great America versions.",
  "six-flags-over-texas-batman-the-ride":
    "Steel inverted coaster at Six Flags Over Texas in Arlington, Texas, opened 1999. Built by Bolliger & Mabillard. A clone of the original Batman the Ride at Six Flags Great America. 105 feet tall, five inversions, top speed 50 mph.",
  "six-flags-over-texas-judge-roy-scream":
    "Wooden coaster at Six Flags Over Texas in Arlington, Texas, opened 1980. Designed by William Cobb. 71 feet tall, top speed 53 mph. A classic out-and-back layout themed to Judge Roy Bean.",
  "six-flags-over-texas-mini-mine-train":
    "Junior steel coaster at Six Flags Over Texas in Arlington, Texas, opened 1969. Built by Arrow Development — one of the longest-running family mine-train coasters in the world. A small family-friendly mine-themed layout.",
  "six-flags-over-texas-runaway-mine-train":
    "Steel mine-train coaster at Six Flags Over Texas in Arlington, Texas, opened 1966 — the world's first themed mine-train roller coaster. Built by Arrow Development. A family-friendly layout that pioneered the mine-train genre.",
  "six-flags-over-texas-runaway-mountain":
    "Steel indoor coaster at Six Flags Over Texas in Arlington, Texas, opened 1996. Built by Premier Rides. A family-friendly dark coaster experience inside a themed mountain structure.",
  "six-flags-over-texas-texas-giant":
    "Wooden coaster that operated at Six Flags Over Texas in Arlington, Texas, from 1990 to 2009. Designed by Curtis D. Summers. 143 feet tall, top speed 62 mph. At opening, the world's tallest and longest wooden coaster. Reprofiled by Rocky Mountain Construction with I-Box steel track and reopened as New Texas Giant in 2011.",
  "south-pier-crazy-mouse":
    "Steel spinning wild-mouse coaster at South Pier in Blackpool, England. Built by Reverchon Industries. Cars rotate freely through a compact wild-mouse switchback layout.",
  "strickers-grove-teddy-bear":
    "Junior wooden coaster at Stricker's Grove in Ross, Ohio, originally built in 1947 at LeSourdsville Lake. Relocated to Stricker's Grove in 1992. ~30 feet tall, top speed 25 mph. A classic small-park family coaster.",
  "strickers-grove-tornado":
    "Wooden coaster at Stricker's Grove in Ross, Ohio, opened 1992 (using parts from earlier coasters). Designed by John Allen and Charles Dinn. 63 feet tall, top speed 45 mph. The park is only open to the public on a handful of days per year, making this a rarely-ridden classic.",
  "sylvan-beach-amusement-park-galaxi":
    "Steel coaster at Sylvan Beach Amusement Park in Sylvan Beach, New York. A classic portable Galaxi-style ride — one of the German-built compact loop coasters common at small lakeside parks.",
  "thorpe-park-colossus":
    "Steel sit-down looping coaster at Thorpe Park in Surrey, England, opened 2002. Built by Intamin. 100 feet tall, ten inversions (a world record at opening), top speed 45 mph. The UK's first ten-inversion coaster.",
  "thorpe-park-nemesis-inferno":
    "Steel inverted coaster at Thorpe Park in Surrey, England, opened 2003. Built by Bolliger & Mabillard. 95 feet tall, four inversions, top speed 50 mph. Volcano-themed sibling to Alton Towers' Nemesis.",
  "thorpe-park-stealth":
    "Steel hydraulic launch coaster at Thorpe Park in Surrey, England, opened 2006. Built by Intamin. Launches from 0 to 80 mph in 1.8 seconds through a 205-foot vertical top hat. Top speed 80 mph. The UK's tallest coaster at opening.",
  "thorpe-park-walking-dead-the-ride":
    "Steel sit-down looping coaster at Thorpe Park in Surrey, England, originally opened 1993 as X. Built by Vekoma. Rebranded multiple times — X, X: No Way Out (backward indoor in the dark), and most recently The Walking Dead — The Ride with extensive zombie theming added.",
  "timber-falls-adventure-park-avalanche":
    "Wooden coaster at Timber Falls Adventure Park in Wisconsin Dells, Wisconsin, opened 2002. Designed by Custom Coasters International. 96 feet tall, top speed 50 mph. A compact heavily-twisting layout at the small Wisconsin Dells park.",
  "universal-epic-universe-curse-of-the-werewolf":
    "Steel spinning launched coaster at Universal Epic Universe in Orlando, Florida, opened 2025. Built by Maurer Söhne — a spinning launched layout themed to a werewolf chase in Universal's Dark Universe land.",
  "universal-epic-universe-hiccups-wing-gliders":
    "Steel family launched coaster at Universal Epic Universe in Orlando, Florida, opened 2025. Built by Intamin. Themed to How to Train Your Dragon in the Isle of Berk land.",
  "universal-epic-universe-mine-cart-madness":
    "Steel family launched coaster at Universal Epic Universe in Orlando, Florida, opened 2025. Built by Intamin. Themed to Donkey Kong in the Super Nintendo World land — riders simulate riding minecarts through Donkey Kong Country.",
  "universal-epic-universe-stardust-racers-photonyellow":
    "Steel dual-launched racing coaster at Universal Epic Universe in Orlando, Florida, opened 2025. Built by Mack Rides. 133 feet tall, top speed 62 mph. Two trains (Photon/Yellow and Pulsar/Blue) launch simultaneously and interact throughout the layout.",
  "universal-studios-florida-harry-potter-and-the-escape-from-gringotts":
    "Steel indoor coaster / dark-ride hybrid at Universal Studios Florida in Orlando, opened 2014. Built by Intamin. A heavily-themed Harry Potter experience combining a coaster ride with extensive 3D projection, animatronic, and physical theming. Located in The Wizarding World of Harry Potter — Diagon Alley.",
  "universal-studios-florida-hollywood-rip-ride-rockit":
    "Steel launched coaster at Universal Studios Florida in Orlando, opened 2009. Built by Maurer Söhne. 167 feet tall with a 90-degree vertical lift, top speed 65 mph. Riders select their own music for the ride through onboard speakers.",
  "universal-studios-florida-revenge-of-the-mummy":
    "Steel indoor launched coaster at Universal Studios Florida in Orlando, opened 2004. Built by Premier Rides. A dark-ride coaster hybrid with extensive theming, animatronics, and fire effects throughout the indoor layout. Themed to The Mummy films.",
  "universal-studios-florida-trolls-trollercoaster":
    "Junior steel family coaster at Universal Studios Florida in Orlando, opened 2025. A small family-friendly layout in the Dreamworks Land area, themed to the Trolls films.",
  "universal-studios-hollywood-revenge-of-the-mummy-the-ride":
    "Steel indoor launched coaster at Universal Studios Hollywood in Universal City, California, opened 2004. Built by Premier Rides. Sister installation to the Florida version. A dark-ride coaster hybrid with extensive theming and special effects.",
  "universals-islands-of-adventure-dragon-challenge-hungarian-horntail":
    "Steel inverted dueling coaster that operated at Universal's Islands of Adventure in Orlando from 1999 to 2017 (renamed Dragon Challenge in 2010 from Dueling Dragons). Built by Bolliger & Mabillard. The Hungarian Horntail (formerly Fire) side of two interlocking tracks. 125 feet tall, five inversions. Closed to make room for Hagrid's Magical Creatures Motorbike Adventure.",
  "universals-islands-of-adventure-dudley-do-rights-ripsaw-falls":
    "Log flume / shoot-the-chute ride at Universal's Islands of Adventure in Orlando, opened 1999. Built by Mack Rides. Themed to the Dudley Do-Right cartoons. Listed in coaster databases due to its lift hill and drops.",
  "universals-islands-of-adventure-flight-of-the-hippogriff":
    "Junior steel coaster at Universal's Islands of Adventure in Orlando, opened 1999 (originally as Flying Unicorn). Built by Vekoma. Rebranded for The Wizarding World of Harry Potter in 2010. A small family-friendly layout themed to Hippogriff riding lessons.",
  "universals-islands-of-adventure-hagrids-magical-creatures-motorbike-adventure":
    "Steel multi-launched family coaster at Universal's Islands of Adventure in Orlando, opened 2019. Built by Intamin. Seven launches including a backward launch and a vertical-spike drop. Heavily themed to Hagrid's lessons in the Forbidden Forest. Riders straddle motorcycle-style seats.",
  "universals-islands-of-adventure-incredible-hulk-2015":
    "Steel launched looping coaster that operated at Universal's Islands of Adventure from 1999 to 2015 as the original Incredible Hulk Coaster. Built by Bolliger & Mabillard. 110 feet tall, seven inversions, top speed 67 mph. Closed in 2015 for a comprehensive track replacement and reopened in 2016.",
  "universals-islands-of-adventure-incredible-hulk-2016":
    "Steel launched looping coaster at Universal's Islands of Adventure in Orlando, originally opened 1999, reopened 2016 after a comprehensive track replacement. Built by Bolliger & Mabillard. 110 feet tall, seven inversions, top speed 67 mph. The launch climbs at 40 mph through a tunnel before reaching the first drop.",
  "universals-islands-of-adventure-pteranodon-flyers":
    "Steel suspended family coaster at Universal's Islands of Adventure in Orlando, opened 1999. Built by Setpoint USA. A small swinging-car overhead coaster in the Jurassic Park area, restricted to families with young children.",
  "universals-islands-of-adventure-the-high-in-the-sky-seuss-trolley-train-ride-green-left-track":
    "Steel family coaster at Universal's Islands of Adventure in Orlando, opened 2006. Built by Mack Rides. A gentle elevated layout in the Seuss Landing area — riders board trolleys that travel around the area. The Green (left) track.",
  "universals-islands-of-adventure-the-high-in-the-sky-seuss-trolley-train-ride-purple-right-track":
    "Steel family coaster at Universal's Islands of Adventure in Orlando, opened 2006. Built by Mack Rides. The Purple (right) track of the dual-track Seuss trolley layout.",
  "universals-islands-of-adventure-velocicoaster":
    "Steel multi-launched looping coaster at Universal's Islands of Adventure in Orlando, opened 2021. Built by Intamin. 155 feet tall, four inversions, top speed 70 mph. Themed to a Jurassic World velociraptor enclosure, with an 80-degree top hat. Multiple Golden Ticket Award wins for #1 Steel Coaster.",
  "waldameer-comet":
    "Wooden coaster at Waldameer Park in Erie, Pennsylvania, opened 1951. Designed by Herbert Schmeck of Philadelphia Toboggan Coasters. 25 feet tall — a classic compact family-sized wooden coaster. An American Coaster Enthusiasts Coaster Classic.",
  "waldameer-ravine-flyer-3":
    "Steel kiddie coaster at Waldameer Park in Erie, Pennsylvania, opened 2010. A small family-friendly layout that complements the park's marquee Ravine Flyer II wooden coaster.",
  "waldameer-ravine-flyer-ii":
    "Wooden coaster at Waldameer Park in Erie, Pennsylvania, opened 2008. Designed by The Gravity Group. 105 feet tall, top speed 57 mph. A reconstruction of the historic 1938 Ravine Flyer that operated at the park until 1938. Routes through a wooded ravine. Multiple Golden Ticket Award wins for Best Wooden Coaster.",
  "waldameer-steel-dragon":
    "Steel coaster at Waldameer Park in Erie, Pennsylvania, opened 1979. A compact family-friendly layout with a single lift hill and a winding course.",
  "walt-disney-world-disneys-animal-kingdom-expedition-everest":
    "Steel mine-train coaster at Disney's Animal Kingdom in Lake Buena Vista, Florida, opened 2006. Designed by Walt Disney Imagineering and Vekoma. 199 feet tall — the tallest coaster at Walt Disney World — with a forward launch, a backward section, and a final 80-foot drop. Top speed 50 mph. Themed to a Himalayan railway encounter with the Yeti.",
  "walt-disney-world-disneys-animal-kingdom-primeval-whirl-left":
    "Steel spinning coaster that operated at Disney's Animal Kingdom in Lake Buena Vista, Florida, from 2002 to 2020. Built by Reverchon Industries. A wild-mouse-style layout with cars that spin freely. The Left track of a dual layout. Demolished in 2020.",
  "walt-disney-world-disneys-animal-kingdom-primeval-whirl-right":
    "Steel spinning coaster that operated at Disney's Animal Kingdom in Lake Buena Vista, Florida, from 2002 to 2020. The Right track of a dual mirrored layout. Built by Reverchon Industries. Demolished in 2020.",
  "walt-disney-world-disneys-hollywood-studios-rock-n-roller-coaster-starring-the-muppets":
    "Steel launched indoor coaster at Disney's Hollywood Studios in Lake Buena Vista, Florida, opened 1999 (originally Rock 'n' Roller Coaster Starring Aerosmith; rethemed to the Muppets in 2025). Built by Vekoma. Launches from 0 to 57 mph in 2.8 seconds, three inversions, indoor LA-themed layout.",
  "walt-disney-world-disneys-hollywood-studios-slinky-dog-dash":
    "Steel family launched coaster at Disney's Hollywood Studios in Lake Buena Vista, Florida, opened 2018. Built by Mack Rides. Themed to Slinky Dog from Toy Story in the Toy Story Land area. Two launches, 39 feet tall, top speed 39 mph.",
  "walt-disney-world-epcot-guardians-of-the-galaxy-cosmic-rewind":
    "Steel launched omnicoaster at Epcot in Lake Buena Vista, Florida, opened 2022. Built by Vekoma — the world's first reverse-launch coaster with rotating vehicles that face the action during key moments. Themed to the Guardians of the Galaxy in a large indoor enclosed space-themed building. Top speed 60 mph.",
  "walt-disney-world-magic-kingdom-barnstormer":
    "Junior steel coaster at the Magic Kingdom in Lake Buena Vista, Florida, opened 1996 (originally as the Barnstormer at Goofy's Wiseacre Farm). Built by Vekoma. A small family-friendly layout in Storybook Circus, ~25 feet tall.",
  "walt-disney-world-magic-kingdom-big-thunder-mountain-railroad-2025":
    "Steel mine-train coaster at the Magic Kingdom in Lake Buena Vista, Florida, opened 1980 — the second Big Thunder Mountain Railroad after Disneyland's 1979 original. The 2025 reference is to a major track replacement and refurbishment that year. Themed to a runaway gold-rush mine train in Frontierland.",
  "walt-disney-world-magic-kingdom-seven-dwarfs-mine-train":
    "Steel family coaster at the Magic Kingdom in Lake Buena Vista, Florida, opened 2014. Built by Vekoma. Notable for its swinging trains — each car rocks back and forth as it navigates turns. Themed to the dwarfs' mine from Snow White and the Seven Dwarfs in Fantasyland.",
  "walt-disney-world-magic-kingdom-space-mountain-right-omega":
    "Steel indoor coaster at the Magic Kingdom in Lake Buena Vista, Florida, opened 1975. Designed by Walt Disney Imagineering — the world's first indoor roller coaster. A dark coaster experience inside a futuristic dome with starfield projections. The Omega (right) track of two parallel tracks.",
  "walt-disney-world-magic-kingdom-tianas-bayou-adventure":
    "Log flume / shoot-the-chute attraction at the Magic Kingdom in Lake Buena Vista, Florida, opened 2024 — a re-theming of the former Splash Mountain to The Princess and the Frog. Listed in coaster databases due to its lift hill and final drop.",
  "wild-adventures-boomerang":
    "Steel boomerang shuttle coaster at Wild Adventures in Valdosta, Georgia. Built by Vekoma. The classic Boomerang layout.",
  "wild-adventures-cheetah":
    "Wooden coaster at Wild Adventures in Valdosta, Georgia, opened 2001. Designed by Roller Coaster Corporation of America. ~89 feet tall, top speed 50 mph.",
  "wild-adventures-gold-rush":
    "Steel mine-train family coaster at Wild Adventures in Valdosta, Georgia. A family-friendly mine-themed layout.",
  "wild-adventures-marsh-mayhem":
    "Junior steel coaster at Wild Adventures in Valdosta, Georgia. A small family-friendly layout aimed at young riders.",
  "wild-adventures-outpost-express":
    "Family steel coaster at Wild Adventures in Valdosta, Georgia. A small mine-train-style or family layout.",
  "wild-adventures-tiger-terror":
    "Steel inverted coaster at Wild Adventures in Valdosta, Georgia. Built by Vekoma using their Suspended Looping Coaster (SLC) model. 110 feet tall, five inversions.",
  "wild-adventures-twisted-typhoon":
    "Steel coaster at Wild Adventures in Valdosta, Georgia. A compact installation at the southern Georgia park.",
  "williams-grove-amusement-park-cyclone":
    "Wooden coaster that operated at Williams Grove Amusement Park in Mechanicsburg, Pennsylvania from 1933 to 2005. Designed by Herbert Schmeck of Philadelphia Toboggan Coasters. The park closed in 2005 and the coaster sat dormant; eventually demolished.",
  "williams-grove-amusement-park-wildcat":
    "Steel coaster that operated at Williams Grove Amusement Park in Mechanicsburg, Pennsylvania before the park's 2005 closure. A small portable-style coaster at the long-running but ultimately shuttered Pennsylvania park.",
  "wonderpark-boa-squeeze":
    "Junior steel coaster at Wonderpark (formerly Coney Island) in Cincinnati, Ohio. A small family-friendly layout in the small Ohio family park.",
};

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const force = process.argv.includes("--force");
  const { containers } = await import("../lib/cosmos");
  const { getCoaster } = await import("../lib/coasters");

  let written = 0;
  let skipped = 0;
  let missing = 0;

  for (const [slug, description] of Object.entries(DESCRIPTIONS)) {
    const existing = await getCoaster(slug);
    if (!existing) {
      console.log(`✗ ${slug}: no stored doc found`);
      missing += 1;
      continue;
    }
    if (existing.description && !force) {
      console.log(`↷ ${slug}: already has description — skipping`);
      skipped += 1;
      continue;
    }
    if (dryRun) {
      console.log(`◌ ${slug}: would write ${description.length} chars`);
      written += 1;
      continue;
    }
    const updated = {
      ...existing,
      description,
      updatedAt: new Date().toISOString(),
    };
    await containers.coasters.item(slug, slug).replace(updated);
    console.log(`✓ ${slug}: ${description.length} chars`);
    written += 1;
  }

  console.log(`\nDone. written=${written} skipped=${skipped} missing=${missing}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
