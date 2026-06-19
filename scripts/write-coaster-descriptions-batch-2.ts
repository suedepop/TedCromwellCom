import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

const DESCRIPTIONS: Record<string, string> = {
  "chessington-world-of-adventures-rattlesnake":
    "Steel wild-mouse coaster at Chessington World of Adventures in Surrey, England, opened 1996. Built by Maurer Söhne. The classic wild-mouse switchback layout with single cars themed to a coiling snake. ~52 feet tall, top speed 28 mph.",
  "chessington-world-of-adventures-scorpion-express":
    "Steel family coaster at Chessington World of Adventures in Surrey, England, opened 1991 (originally as Runaway Train). Built by Mack Rides as a family mine-train coaster, themed to a runaway desert train. Retracked and rethemed as Scorpion Express in 2012.",
  "chessington-world-of-adventures-vampire":
    "Steel suspended coaster at Chessington World of Adventures in Surrey, England, opened 1990. Built by Arrow Dynamics — one of the few Arrow suspended coasters in Europe. Riders sit in suspended swinging cars that fly through trees and over a graveyard-themed section. 50 feet tall, top speed 45 mph.",
  "clementon-park-hell-cat":
    "Wooden coaster at Clementon Park in Clementon, New Jersey, originally opened in 2004 as Tsunami. Designed by The Gravity Group. 109 feet tall, top speed 50 mph. Renamed Hell Cat in 2007. Operated until the park's 2021 closure; the future of the coaster is uncertain.",
  "columbus-zoo-and-aquarium-sea-dragon":
    "Wooden coaster at the Columbus Zoo and Aquarium in Powell, Ohio. Originally built in 1956 as Sea Dragon at Wyandot Lake / Jungle Jack's Landing inside the zoo. Designed by John Allen of Philadelphia Toboggan Coasters. 35 feet tall, top speed 35 mph. One of the oldest operating coasters in the U.S.",
  "coney-beach-pleasure-park-mega-blitz":
    "Steel coaster at Coney Beach Pleasure Park in Porthcawl, Wales. A small-park steel installation at the Welsh seaside funfair.",
  "coney-beach-pleasure-park-nessi":
    "Junior steel coaster at Coney Beach Pleasure Park in Porthcawl, Wales — a Nessie / sea-serpent themed family coaster aimed at children.",
  "conneaut-lake-park-blue-streak":
    "Wooden coaster at Conneaut Lake Park in Conneaut Lake, Pennsylvania, opened 1937. Designed by Edward Vettel Sr. — one of the oldest operating wooden coasters in the United States. 78 feet tall, top speed 50 mph. Has operated intermittently through the park's various ownership crises; an American Coaster Enthusiasts Coaster Landmark.",
  "conneaut-lake-park-toboggan":
    "Steel kiddie coaster that operated at Conneaut Lake Park in Pennsylvania. A small portable Galaxi or Toboggan-style ride at the long-running but financially troubled lakeside park.",
  "delgrossos-amusement-park-crazy-mouse":
    "Steel wild-mouse coaster at DelGrosso's Amusement Park in Tipton, Pennsylvania. Built by Reverchon Industries (France) using their spinning wild-mouse design. The classic switchback layout with cars that spin freely during portions of the ride.",
  "delgrossos-amusement-park-wacky-worm":
    "Junior steel coaster at DelGrosso's Amusement Park in Tipton, Pennsylvania. A Wacky Worm — the figure-eight worm-themed family coaster common at small parks. About 14 feet tall.",
  "disney-california-adventure-park-goofys-sky-school":
    "Steel wild-mouse coaster at Disney California Adventure in Anaheim, California, opened 2001 as Mulholland Madness. Built by Mack Rides. Themed as Goofy's flight school since 2011, with cartoon-flight signage replacing the original LA freeway theme.",
  "disney-california-adventure-park-incredicoaster":
    "Steel launched coaster at Disney California Adventure in Anaheim, California, originally opened 2001 as California Screamin'. Built by Intamin. 122 feet tall, one inversion (a vertical loop themed as Mickey's silhouette), top speed 55 mph. Rethemed and rebranded as Incredicoaster for The Incredibles 2 in 2018.",
  "disneyland-big-thunder-mountain-railroad":
    "Steel mine-train coaster at Disneyland in Anaheim, California, opened 1979 — the original of the Big Thunder Mountain Railroad clones at multiple Disney parks. Built by Walt Disney Imagineering and Arrow Development. Themed to a runaway mine train in the American Southwest. ~104 feet of vertical drop spread across an elaborate Frontierland landscape.",
  "disneyland-chip-dales-gadget-coaster":
    "Junior steel coaster at Disneyland in Anaheim, California, opened 1993 (originally as Gadget's Go Coaster). Built by Vekoma. A small family coaster themed to Chip 'n Dale: Rescue Rangers in Mickey's Toontown, ~36 feet tall.",
  "disneyland-matterhorn-bobsleds-fantasyland-right":
    "Steel bobsled coaster at Disneyland in Anaheim, California, opened 1959. Designed by Arrow Development with Walt Disney Imagineering — the world's first tubular steel-tracked roller coaster. The Fantasyland (right) of two parallel tracks that wind through and around a 147-foot model of the Matterhorn mountain.",
  "disneyland-space-mountain-2005":
    "Steel indoor coaster at Disneyland in Anaheim, California, opened 1977 — the second Space Mountain after Walt Disney World's 1975 original. The 2005 reference is to a major track replacement and refurbishment that year. Built by Walt Disney Imagineering. A dark coaster experience inside a futuristic dome with starfield projections.",
  "disneyland-tianas-bayou-adventure":
    "Log flume / shoot-the-chute attraction at Disneyland in Anaheim, California, opened 2024 — a re-theming of the former Splash Mountain to The Princess and the Frog. Features a 52-foot drop. Listed in coaster databases as a coaster due to its drop and lift sections.",
  "dollywood-big-bear-mountain":
    "Steel family coaster at Dollywood in Pigeon Forge, Tennessee, opened 2023. Built by Vekoma using their Multi Launch Family Coaster model. Three launches, 66 feet tall, top speed 48 mph. Themed to a bear-tracking adventure with elaborate audio and visual effects.",
  "dollywood-blazing-fury":
    "Steel indoor dark-ride coaster at Dollywood in Pigeon Forge, Tennessee, opened 1978. Built by Arrow Development. Themed to escaping a burning frontier town; features animatronic show scenes and a final drop. A long-running classic dark coaster experience.",
  "dollywood-dragonflier":
    "Steel suspended family coaster at Dollywood in Pigeon Forge, Tennessee, opened 2019. Built by Vekoma using their Suspended Family Coaster model. A swinging-car layout themed to dragonflies in the Wildwood Grove area.",
  "dollywood-firechaser-express":
    "Steel family coaster at Dollywood in Pigeon Forge, Tennessee, opened 2014. Built by Gerstlauer. The world's first dual-launch family coaster — launches forward, then reverses through a second launch on the return. Themed to a fire-rescue mission.",
  "dollywood-lightning-rod-2021":
    "Wooden launched coaster at Dollywood in Pigeon Forge, Tennessee, opened 2016. Built by Rocky Mountain Construction — the world's first launched wooden coaster (originally with a hydraulic launch, retrofitted with an LSM launch for the 2021 season). 165 feet tall, 73 mph top speed.",
  "dollywood-mystery-mine-2020":
    "Steel indoor/outdoor coaster at Dollywood in Pigeon Forge, Tennessee, opened 2007. Built by Gerstlauer. 85 feet tall with two vertical lift hills and two beyond-vertical drops, including a 95-degree drop. Themed to an abandoned coal mine with extensive indoor show scenes.",
  "dollywood-sideshow-spin":
    "Steel spinning kiddie coaster at Dollywood in Pigeon Forge, Tennessee, opened 1999 in the Country Fair area. Built by Vekoma. A small family layout with rotating cars themed to circus sideshow.",
  "dollywood-tennessee-tornado":
    "Steel sit-down looping coaster at Dollywood in Pigeon Forge, Tennessee, opened 1999. Built by Arrow Dynamics — one of Arrow's final major coasters and notable for an unusually smooth ride for the manufacturer. 128 feet tall, three inversions, top speed 65 mph.",
  "dollywood-thunderhead":
    "Wooden coaster at Dollywood in Pigeon Forge, Tennessee, opened 2004. Designed by Great Coasters International. 100 feet tall, 3,230 feet long, top speed 55 mph. Multiple Golden Ticket Award wins for Best Wooden Coaster. Known for its station fly-through and tight twisting layout.",
  "dollywood-wild-eagle":
    "Steel wing coaster at Dollywood in Pigeon Forge, Tennessee, opened 2012. Built by Bolliger & Mabillard — the first wing coaster in the United States. 210 feet tall, 4 inversions, top speed 61 mph. Riders sit on the side of the train with nothing above or below them.",
  "dorney-park-wildwater-kingdom-dragon-coaster":
    "Junior steel coaster at Dorney Park in Allentown, Pennsylvania. A small family layout in the Camp Snoopy / Planet Snoopy area, themed to a friendly dragon.",
  "dorney-park-wildwater-kingdom-hydra-the-revenge":
    "Steel floorless coaster at Dorney Park in Allentown, Pennsylvania, opened 2005. Built by Bolliger & Mabillard. 95 feet tall, seven inversions including a unique pre-lift jojo roll, top speed 53 mph. Replaced the former Hercules wooden coaster on the same plot.",
  "dorney-park-wildwater-kingdom-laser":
    "Steel sit-down double-looping coaster that operated at Dorney Park in Allentown, Pennsylvania from 1986 to 2008. Built by Anton Schwarzkopf — originally at Six Flags Magic Mountain as Dragon Coaster. 90 feet tall, two vertical loops, top speed 50 mph.",
  "dorney-park-wildwater-kingdom-steel-force":
    "Steel hyper coaster at Dorney Park in Allentown, Pennsylvania, opened 1997. Built by Morgan Manufacturing. 200 feet tall, 205-foot drop, 1.5 miles of track, top speed 75 mph. At opening, the world's tallest and longest hyper coaster.",
  "dorney-park-wildwater-kingdom-talon":
    "Steel inverted coaster at Dorney Park in Allentown, Pennsylvania, opened 2001. Built by Bolliger & Mabillard. 135 feet tall, four inversions including a 98-foot vertical loop, top speed 58 mph. Subtitled \"The Grip of Fear.\"",
  "dorney-park-wildwater-kingdom-thunderhawk":
    "Wooden coaster at Dorney Park in Allentown, Pennsylvania, opened 1923. Designed by Herbert Schmeck of Philadelphia Toboggan Coasters. 80 feet tall, top speed 45 mph. One of the longest continuously operating wooden coasters in the United States and an American Coaster Enthusiasts Coaster Landmark.",
  "dorney-park-wildwater-kingdom-wild-mouse":
    "Steel wild-mouse coaster at Dorney Park in Allentown, Pennsylvania, opened 1999. Built by Maurer Söhne. The classic wild-mouse switchback layout with single cars.",
  "dorney-park-wildwater-kingdom-woodstock-express":
    "Junior wooden coaster at Dorney Park in Allentown, Pennsylvania. A small family-friendly out-and-back in the Planet Snoopy area, themed to Peanuts characters.",
  "drayton-manor-g-force":
    "Steel hairpin coaster at Drayton Manor in Tamworth, England, opened 2005. Built by Maurer Söhne using their X-Car model. 78 feet tall with a 95-degree drop, top speed 41 mph. One of the first Maurer X-Car installations.",
  "drayton-manor-jormungandr":
    "Steel family coaster at Drayton Manor in Tamworth, England. A compact installation themed to the Norse world-serpent.",
  "drayton-manor-shockwave":
    "Steel stand-up coaster at Drayton Manor in Tamworth, England, opened 1994. Built by Intamin. The UK's first stand-up coaster. Two inversions (vertical loop and a flat spin), top speed 47 mph.",
  "drayton-manor-super-dragon":
    "Family steel coaster at Drayton Manor in Tamworth, England. A small dragon-themed coaster in the Thomas Land children's area.",
  "energylandia-abyssus":
    "Steel sit-down looping coaster at Energylandia in Zator, Poland, opened 2021. Built by Vekoma. 125 feet tall, five inversions, top speed 56 mph. One of several major Vekoma installations at Europe's biggest theme park expansion of the late 2010s/early 2020s.",
  "energylandia-formua":
    "Steel multi-launch coaster at Energylandia in Zator, Poland, opened 2020. Built by Vekoma. Three launches, top speed 56 mph. Themed to Formula racing.",
  "energylandia-hyperion":
    "Steel mega coaster at Energylandia in Zator, Poland, opened 2018. Built by Intamin. 253 feet tall — the tallest coaster in Poland — with an 85-degree drop, top speed 88 mph. Among Europe's tallest coasters.",
  "energylandia-light-explorers":
    "Steel family coaster at Energylandia in Zator, Poland, opened 2022. Built by Vekoma. A small family layout aimed at younger riders in the Family Zone.",
  "energylandia-roller-coaster-mayan":
    "Steel family coaster at Energylandia in Zator, Poland. Themed to a Mayan jungle adventure with a winding layout suitable for family riders.",
  "energylandia-zadra":
    "Steel hybrid coaster at Energylandia in Zator, Poland, opened 2019. Built by Rocky Mountain Construction. 206 feet tall, 90-degree drop, three inversions including the world's longest barrel roll at the time of opening, top speed 75 mph. The first RMC outside North America.",
  "family-kingdom-amusement-park-log-flume":
    "Log flume / shoot-the-chute ride at Family Kingdom Amusement Park in Myrtle Beach, South Carolina. Listed in coaster databases due to its drop and lift sections.",
  "family-kingdom-amusement-park-swamp-fox":
    "Wooden coaster at Family Kingdom Amusement Park in Myrtle Beach, South Carolina, opened 1966 (originally as Hurricane). Designed by John Allen of Philadelphia Toboggan Coasters. 65 feet tall, top speed 50 mph. One of the longest-running seaside-park wood coasters in the U.S.",
  "family-kingdom-amusement-park-twist-n-shout":
    "Steel coaster at Family Kingdom Amusement Park in Myrtle Beach, South Carolina. A compact spinning or wild-mouse-style coaster installation at the seaside park.",
  "flamingo-land-corkscrew":
    "Steel coaster that operated at Flamingo Land in North Yorkshire, England. A classic Vekoma corkscrew installation with a vertical loop and a corkscrew. Common at smaller European parks.",
  "flamingo-land-dino-roller":
    "Junior steel coaster at Flamingo Land in North Yorkshire, England. A dinosaur-themed family layout aimed at young riders.",
  "flamingo-land-kumali":
    "Steel inverted coaster at Flamingo Land in North Yorkshire, England, opened 2006. Built by Vekoma using their Suspended Looping Coaster (SLC) model. 108 feet tall, five inversions, top speed 50 mph.",
  "flamingo-land-velocity":
    "Steel launched motorcycle coaster at Flamingo Land in North Yorkshire, England, opened 2005. Built by Vekoma using their Booster Bike model. Riders straddle motorcycle-style seats. ~50 feet tall, top speed 47 mph.",
  "flamingo-land-wild-mouse":
    "Steel wild-mouse coaster at Flamingo Land in North Yorkshire, England. The classic wild-mouse switchback layout with single cars.",
  "freestyle-music-park-hang-ten":
    "Junior steel coaster that operated at Freestyle Music Park (formerly Hard Rock Park) in Myrtle Beach, South Carolina, from 2008 to 2009. A small family-friendly installation at the short-lived music-themed park.",
  "freestyle-music-park-iron-horse":
    "Family steel coaster that operated at Freestyle Music Park in Myrtle Beach, South Carolina, from 2008 to 2009. A small family layout at the short-lived music-themed park that closed after just two seasons.",
  "freestyle-music-park-round-about":
    "Family steel coaster that operated at Freestyle Music Park in Myrtle Beach, South Carolina, from 2008 to 2009. A circular-themed family coaster installation at the short-lived park.",
  "freestyle-music-park-time-machine":
    "Steel coaster that operated at Freestyle Music Park (originally Hard Rock Park) in Myrtle Beach, South Carolina, from 2008 to 2009. The park closed after just two seasons due to financial difficulties; the coaster was relocated.",
  "fun-fore-all-family-entertainment-center-fiesta-express":
    "Junior steel kiddie coaster at Fun Fore All Family Entertainment Center in Cranberry Township, Pennsylvania. A small family layout at the family entertainment center.",
  "fun-spot-america-freedom-flyer":
    "Steel suspended family coaster at Fun Spot America in Orlando, Florida, opened 2013. Built by Vekoma using their Suspended Family Coaster model. A swinging-car layout, ~46 feet tall.",
  "fun-spot-america-mine-blower":
    "Wooden coaster at Fun Spot America in Kissimmee, Florida, opened 2017. Designed by The Gravity Group. 80 feet tall with a 90-degree first drop and one inversion (a barrel roll). Top speed 48 mph.",
  "fun-spot-america-white-lightning":
    "Wooden coaster at Fun Spot America in Orlando, Florida, opened 2013. Designed by Great Coasters International. 70 feet tall, top speed 44 mph. The first wooden coaster built in Florida in nearly 60 years.",
  "fun-spot-park-afterburner":
    "Junior steel coaster at Fun Spot Park in Angola, Indiana. A small family layout at the family entertainment center.",
  "fun-spot-park-zyklon":
    "Steel coaster at Fun Spot Park in Angola, Indiana. A compact German-style portable Zyklon coaster installation.",
  "funtown-pier-funtown-family-coaster":
    "Family steel coaster at Funtown Pier in Seaside Heights, New Jersey. A small kiddie layout at the Jersey Shore boardwalk park. The pier was severely damaged by Hurricane Sandy in 2012 and again by fire in 2013.",
  "funtown-pier-mighty-mouse":
    "Steel wild-mouse coaster at Funtown Pier in Seaside Heights, New Jersey. A classic compact wild-mouse layout. Operations were significantly affected by Hurricane Sandy and subsequent fires at the boardwalk.",
  "geauga-lake-wildwater-kingdom-beaver-land-mine-ride":
    "Steel mine-train family coaster that operated at Geauga Lake / Sea World Ohio in Aurora, Ohio. A family-friendly mine-themed layout at the long-running park that closed in 2007.",
  "geauga-lake-wildwater-kingdom-big-dipper":
    "Wooden coaster that operated at Geauga Lake in Aurora, Ohio, from 1925 to 2007. Designed by John Miller. 65 feet tall, top speed 40 mph. An American Coaster Enthusiasts Coaster Landmark. Sat dormant after the park closed; demolished in 2016.",
  "geauga-lake-wildwater-kingdom-corkscrew":
    "Steel multi-looping coaster that operated at Geauga Lake from 1978 to 2007. Built by Arrow Dynamics. A classic Arrow Corkscrew with a vertical loop and double corkscrews. Relocated after Geauga Lake's 2007 closure.",
  "geauga-lake-wildwater-kingdom-dominator":
    "Steel floorless coaster that operated at Six Flags Worlds of Adventure / Geauga Lake in Aurora, Ohio, from 2000 to 2007. Built by Bolliger & Mabillard. 145 feet tall, five inversions, top speed 65 mph. Relocated to Kings Dominion in 2008 where it still operates.",
  "geauga-lake-wildwater-kingdom-double-loop":
    "Steel double-looping coaster that operated at Geauga Lake from 1977 to 2007. Built by Arrow Dynamics — one of the earliest dual-loop coasters. 95 feet tall, two vertical loops, top speed 45 mph.",
  "geauga-lake-wildwater-kingdom-head-spin":
    "Steel boomerang shuttle coaster that operated at Geauga Lake from 1996 to 2007. Built by Vekoma. The classic Boomerang layout. Originally Boomerang at Six Flags Worlds of Adventure, later Head Spin.",
  "geauga-lake-wildwater-kingdom-raging-wolf-bobs":
    "Wooden coaster that operated at Geauga Lake from 1988 to 2007. Designed by Curtis D. Summers and Charles Dinn. A replica of the Coney Island Bobs layout. 80 feet tall, top speed 50 mph. Demolished after the park's closure.",
  "geauga-lake-wildwater-kingdom-steel-venom":
    "Steel impulse coaster that operated at Six Flags Worlds of Adventure / Geauga Lake from 2000 to 2007. Built by Intamin. 185 feet tall with twin vertical spikes, top speed 68 mph. Relocated to Dorney Park as Possessed (later renamed Steel Venom again).",
  "geauga-lake-wildwater-kingdom-thunderhawk":
    "Steel inverted coaster that operated at Geauga Lake from 2001 to 2007. Built by Vekoma using their Suspended Looping Coaster model. 110 feet tall, five inversions. Relocated to Michigan's Adventure after the 2007 park closure.",
  "geauga-lake-wildwater-kingdom-villain":
    "Wooden coaster that operated at Six Flags Worlds of Adventure / Geauga Lake from 2000 to 2007. Designed by Curtis D. Summers and built by Custom Coasters International. 120 feet tall, top speed 58 mph. Demolished after the park closure.",
  "geauga-lake-wildwater-kingdom-x-flight":
    "Steel flying coaster that operated at Six Flags Worlds of Adventure / Geauga Lake from 2001 to 2007. Built by Vekoma — one of the earliest flying coasters. Relocated to Kings Island as Firehawk after the 2007 park closure.",
  "great-yarmouth-pleasure-beach-big-apple":
    "Wacky Worm family coaster at Great Yarmouth Pleasure Beach in Norfolk, England. The classic apple-themed family coaster common at British seaside parks.",
  "great-yarmouth-pleasure-beach-roller-coaster":
    "Wooden coaster at Great Yarmouth Pleasure Beach in Norfolk, England, opened 1932. Designed by Erich Heidrich. 70 feet tall, top speed 40 mph. A side-friction wooden coaster — one of only a handful of operating side-friction coasters in the world. A historic seaside-park ride.",
  "hersheypark-candymonium":
    "Steel hyper coaster at Hersheypark in Hershey, Pennsylvania, opened 2020. Built by Bolliger & Mabillard. 210 feet tall with a 76-degree first drop, top speed 76 mph. Themed to Hershey's Kisses.",
  "hersheypark-coal-cracker":
    "Log flume / shoot-the-chute at Hersheypark in Hershey, Pennsylvania, opened 1973. Listed in coaster databases due to its lift hill and final drop, though it is technically a water ride.",
  "hersheypark-comet":
    "Wooden coaster at Hersheypark in Hershey, Pennsylvania, opened 1946. Designed by Herbert Schmeck of Philadelphia Toboggan Coasters. 84 feet tall, top speed 50 mph. An American Coaster Enthusiasts Coaster Landmark and a beloved classic of the park.",
  "hersheypark-fahrenheit":
    "Steel sit-down looping coaster at Hersheypark in Hershey, Pennsylvania, opened 2008. Built by Intamin. 121 feet tall with a 97-degree first drop (more than vertical), four inversions, top speed 58 mph.",
  "hersheypark-great-bear":
    "Steel inverted coaster at Hersheypark in Hershey, Pennsylvania, opened 1998. Built by Bolliger & Mabillard. 124 feet tall, four inversions including an Immelmann, top speed 58 mph. Routes through the park's existing landscape including over a creek.",
  "hersheypark-jolly-rancher-remix":
    "Steel shuttle coaster at Hersheypark in Hershey, Pennsylvania. Originally opened as Sidewinder in 1991 by Vekoma using their Boomerang model; rebranded as Jolly Rancher Remix in 2021 with candy theming and a virtual queue overlay.",
  "hersheypark-laff-trakk":
    "Steel spinning indoor coaster at Hersheypark in Hershey, Pennsylvania, opened 2015. Built by Maurer Söhne. The first indoor spinning coaster in the U.S. Themed to a circus funhouse with extensive lighting effects.",
  "hersheypark-lightning-racer-lightning":
    "Wooden dueling coaster at Hersheypark in Hershey, Pennsylvania, opened 2000. Designed by Great Coasters International. Two tracks (Lightning and Thunder) race in parallel. 90 feet tall, top speed 51 mph. This is the Lightning side.",
  "hersheypark-skyrush":
    "Steel hyper coaster at Hersheypark in Hershey, Pennsylvania, opened 2012. Built by Intamin. 200 feet tall with an 85-degree first drop, top speed 75 mph. Known for its aggressive forces and four-across winged seating.",
  "hersheypark-sooperdooperlooper":
    "Steel sit-down looping coaster at Hersheypark in Hershey, Pennsylvania, opened 1977. Built by Anton Schwarzkopf. The first looping coaster on the East Coast. 75 feet tall, one vertical loop, top speed 45 mph.",
  "hersheypark-storm-runner":
    "Steel hydraulic launch coaster at Hersheypark in Hershey, Pennsylvania, opened 2004. Built by Intamin. Launches from 0 to 72 mph in 2 seconds, climbs a 150-foot top hat, and includes three inversions.",
  "hersheypark-trailblazer":
    "Steel mine-train coaster at Hersheypark in Hershey, Pennsylvania, opened 1974. Built by Arrow Dynamics. 56 feet tall, top speed 39 mph. A family-friendly mine-train layout.",
  "hersheypark-wild-mouse":
    "Steel wild-mouse coaster at Hersheypark in Hershey, Pennsylvania, opened 1999. Built by Mack Rides. The classic wild-mouse switchback layout with single cars.",
  "hersheypark-wildcat":
    "Wooden coaster that operated at Hersheypark in Hershey, Pennsylvania, from 1996 to 2023. Designed by Mike Boodley and Great Coasters International — GCI's first coaster. 90 feet tall, top speed 50 mph. Reprofiled by Rocky Mountain Construction and reopened as Wildcat's Revenge in 2023.",
  "hersheypark-wildcats-revenge":
    "Steel hybrid coaster at Hersheypark in Hershey, Pennsylvania, opened 2023. Built by Rocky Mountain Construction on the wooden structure of the original Wildcat. 140 feet tall, four inversions including the world's longest underflip (180 degrees in 270 degrees of rotation), top speed 62 mph.",
  "holiday-world-howler":
    "Family steel coaster at Holiday World in Santa Claus, Indiana, opened 2004. Built by Zamperla — a small junior-coaster installation in the Holidog's FunTown family area.",
  "holiday-world-legend":
    "Wooden coaster at Holiday World in Santa Claus, Indiana, opened 2000. Designed by Custom Coasters International. 99 feet tall, top speed 55 mph. Themed to The Legend of Sleepy Hollow with a wooded course.",
  "holiday-world-raven":
    "Wooden coaster at Holiday World in Santa Claus, Indiana, opened 1995. Designed by Custom Coasters International. 86 feet tall, top speed 50 mph. Multiple Golden Ticket Award wins for Best Wooden Coaster in the late 1990s. Themed to Edgar Allan Poe's poem.",
  "holiday-world-thunderbird":
    "Steel launched wing coaster at Holiday World in Santa Claus, Indiana, opened 2015. Built by Bolliger & Mabillard. The first launched wing coaster in the U.S. Launches from 0 to 60 mph in 3.5 seconds, three inversions, top speed 60 mph.",
  "holiday-world-voyage":
    "Wooden coaster at Holiday World in Santa Claus, Indiana, opened 2006. Designed by The Gravity Group. 163 feet tall, 1.4 miles of track — one of the longest wood coasters in the world. Top speed 67 mph. Multiple Golden Ticket Award wins.",
  "indiana-beach-cornball-express":
    "Wooden coaster at Indiana Beach in Monticello, Indiana, opened 2001. Designed by Custom Coasters International. 67 feet tall, top speed 50 mph. A compact, twisting layout sandwiched into the small lakeside park.",
  "indiana-beach-galaxi":
    "Steel coaster at Indiana Beach in Monticello, Indiana. A classic portable-style Galaxi model — one of the German-built compact loop coasters common at small parks.",
  "indiana-beach-hoosier-hurricane":
    "Wooden coaster at Indiana Beach in Monticello, Indiana, opened 1994. Designed by Custom Coasters International. 80 feet tall, top speed 55 mph. Routes along the shore of Lake Shafer.",
  "indiana-beach-lost-coaster-of-superstition-mountain":
    "Wooden indoor/outdoor coaster at Indiana Beach in Monticello, Indiana, opened 2002. Designed by Custom Coasters International. A unique compact layout that runs partially indoors through a themed mountain structure. ~46 feet tall.",
  "indiana-beach-tigrr":
    "Steel coaster at Indiana Beach in Monticello, Indiana, opened 1985. Built by Hopkins Rides — a Jet Star-style portable loop coaster, common at fairs and smaller parks.",
  "jenkinsons-boardwalk-flitzer":
    "Steel coaster at Jenkinson's Boardwalk in Point Pleasant Beach, New Jersey, opened 1981. Built by Anton Schwarzkopf using his Flitzer (Galaxi) model. A compact portable layout common at boardwalk parks in the 1970s and 1980s.",
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
