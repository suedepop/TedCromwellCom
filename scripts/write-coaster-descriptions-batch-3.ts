import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

const DESCRIPTIONS: Record<string, string> = {
  "joyland-childrens-fun-park-snails":
    "Junior steel coaster at Joyland Children's Fun Park in Great Yarmouth, England. A small Snails-themed family layout aimed at very young riders at this children-focused seaside park.",
  "joyland-childrens-fun-park-spook-express":
    "Junior steel coaster at Joyland Children's Fun Park in Great Yarmouth, England. A small haunted-house themed family coaster at this UK seaside children's park.",
  "joyland-childrens-fun-park-tyrolean-tubtwist":
    "Family steel coaster at Joyland Children's Fun Park in Great Yarmouth, England. A small Alpine-themed family ride aimed at children at this UK seaside children's park.",
  "kennywood-dipper":
    "Wooden coaster at Kennywood in West Mifflin, Pennsylvania, opened 1923. Designed by John Miller. A small classic family-friendly out-and-back, ~35 feet tall. One of the oldest operating coasters at Kennywood and an American Coaster Enthusiasts Coaster Classic.",
  "kennywood-exterminator":
    "Steel spinning indoor coaster at Kennywood in West Mifflin, Pennsylvania, opened 1999. Built by Reverchon Industries. A wild-mouse-style spinner inside a dark themed building, with rat-themed decor and effects.",
  "kennywood-jack-rabbit":
    "Wooden coaster at Kennywood in West Mifflin, Pennsylvania, opened 1920. Designed by John Miller. 41 feet tall, top speed 45 mph. One of the oldest operating coasters in the world, known for its double-down element. An American Coaster Enthusiasts Coaster Landmark.",
  "kennywood-laser-loop":
    "Steel shuttle coaster that operated at Kennywood in West Mifflin, Pennsylvania, from 1980 to 1991. Built by Anton Schwarzkopf — a Flashback / Laser Loop shuttle layout that propelled riders forward through a single vertical loop and back. Relocated after its Kennywood run.",
  "kennywood-lil-phantom":
    "Junior steel coaster at Kennywood in West Mifflin, Pennsylvania. A small family layout themed as a baby-sibling of the park's marquee Phantom's Revenge.",
  "kennywood-log-jammer":
    "Log flume / shoot-the-chute that operated at Kennywood in West Mifflin, Pennsylvania, from 1975 to 2017. Listed in coaster databases due to its lift hill and final drop, though it is technically a water ride. Demolished to make way for the Steel Curtain coaster.",
  "kennywood-phantoms-revenge":
    "Steel hyper coaster at Kennywood in West Mifflin, Pennsylvania, originally opened in 1991 as Steel Phantom. Built by Arrow Dynamics. Reworked by Morgan Manufacturing and reopened as Phantom's Revenge in 2001. 160 feet tall with a 232-foot second drop that drops well below the lift, top speed 85 mph.",
  "kennywood-racer-lifthill-left":
    "Wooden racing coaster at Kennywood in West Mifflin, Pennsylvania, opened 1927. Designed by John Miller. A continuous-track Möbius-loop layout — riders go up the left lift hill, around the course, and finish on the right side. 50 feet tall, top speed 40 mph. An American Coaster Enthusiasts Coaster Landmark.",
  "kennywood-sky-rocket":
    "Steel launched coaster at Kennywood in West Mifflin, Pennsylvania, opened 2010. Built by Premier Rides — the first Premier Sky Rocket installation. Launches from 0 to 50 mph in 3 seconds through a 95-foot vertical-spike top hat with a beyond-vertical drop, then continues through a double-corkscrew finale.",
  "kennywood-steel-curtain":
    "Steel sit-down looping coaster at Kennywood in West Mifflin, Pennsylvania, opened 2019. Built by S&S Worldwide. 220 feet tall — Pennsylvania's tallest coaster — with nine inversions (a world record for North American coasters), top speed 75 mph. Themed to the Pittsburgh Steelers' legendary 1970s defensive line.",
  "kennywood-thunderbolt":
    "Wooden coaster at Kennywood in West Mifflin, Pennsylvania, opened 1924 (substantially rebuilt 1968). Designed by John Miller; rebuilt by Andy Vettel. 70 feet tall, top speed 55 mph. Notable for using the natural terrain so that the largest drops come at the END of the ride. An American Coaster Enthusiasts Coaster Landmark.",
  "kentucky-kingdom-chang":
    "Steel stand-up coaster that operated at Six Flags Kentucky Kingdom in Louisville, Kentucky, from 1997 to 2009. Built by Bolliger & Mabillard. 144 feet tall, five inversions, top speed 63 mph. At opening, the world's tallest, fastest, and longest stand-up coaster. Relocated to Six Flags Great America as the inverted coaster Maxx Force... no — actually relocated and reopened at Six Flags Great Adventure as Green Lantern in 2011.",
  "kentucky-kingdom-greezed-lightnin":
    "Steel shuttle coaster that operated at Kentucky Kingdom in Louisville, Kentucky, from 1990 to 2009. Built by Anton Schwarzkopf — a Flashback / Laser Loop shuttle layout. Originally at Six Flags Magic Mountain in 1978 as the Sarajevo Bobsled (renamed several times), it moved to Kentucky Kingdom in 1990.",
  "kentucky-kingdom-hollyhock-and-roll":
    "Junior steel coaster at Kentucky Kingdom in Louisville, Kentucky, opened 2025. A family-friendly installation in the park's children's area.",
  "kentucky-kingdom-road-runner-express":
    "Junior steel coaster at Kentucky Kingdom in Louisville, Kentucky, opened 1995. A family-friendly mine-train-style layout in the park's kids' area. Themed to Looney Tunes Road Runner during the Six Flags era; rebranded after the park's independent reopening in 2014.",
  "kentucky-kingdom-t3":
    "Steel inverted coaster at Kentucky Kingdom in Louisville, Kentucky, opened 1995. Built by Vekoma using their Suspended Looping Coaster (SLC) model. 102 feet tall, five inversions, top speed 50 mph. Originally Thrill Train / T2; renamed T3 (Terror To The Third Power) after retracking for the park's 2014 reopening.",
  "kentucky-kingdom-twisted-twins-stella":
    "Wooden dueling coaster that operated at Kentucky Kingdom in Louisville, Kentucky, from 1998 to 2007 and again in 2014. Designed by Custom Coasters International. Two dueling tracks (Stella and Lola). 95 feet tall, top speed 50 mph. Demolished after the park's 2009 closure period; never fully reopened.",
  "kentucky-kingdom-wind-chaser":
    "Steel kiddie coaster at Kentucky Kingdom in Louisville, Kentucky, opened 2025. A small family-friendly installation in the park's children's area.",
  "kentucky-kingdom-woodland-run":
    "Junior steel coaster at Kentucky Kingdom in Louisville, Kentucky. A small family-coaster installation in the park's kids' area, themed to a forest setting.",
  "kings-dominion-anaconda":
    "Steel sit-down looping coaster at Kings Dominion in Doswell, Virginia, opened 1991. Built by Arrow Dynamics. 128 feet tall, four inversions including a unique underwater tunnel before the second loop, top speed 50 mph.",
  "kings-dominion-apple-zapple":
    "Steel coaster at Kings Dominion in Doswell, Virginia, opened 2008. Originally at Geauga Lake as Beast (1976) and Z-Force (1985) before relocations. Compact looping layout in the Planet Snoopy / Candy Apple Grove area.",
  "kings-dominion-backlot-stunt-coaster":
    "Steel launched coaster at Kings Dominion in Doswell, Virginia, opened 2006 (originally as Italian Job: Stunt Track). Built by Premier Rides. Three LIM launches and a fire-effect finale themed to a Hollywood stunt sequence.",
  "kings-dominion-dominator":
    "Steel floorless coaster at Kings Dominion in Doswell, Virginia, opened 2008 — relocated from Geauga Lake / Six Flags Worlds of Adventure where it operated from 2000 to 2007. Built by Bolliger & Mabillard. 157 feet tall, five inversions, top speed 65 mph.",
  "kings-dominion-flight-of-fear":
    "Steel indoor launched coaster at Kings Dominion in Doswell, Virginia, opened 1996. Built by Premier Rides — among the first LIM-launch coasters. Indoor twisting layout with four inversions inside a UFO-themed building.",
  "kings-dominion-great-pumpkin-coaster":
    "Junior steel coaster at Kings Dominion in Doswell, Virginia. A small family layout in the Planet Snoopy area, themed to Peanuts' Great Pumpkin.",
  "kings-dominion-grizzly":
    "Wooden coaster at Kings Dominion in Doswell, Virginia, opened 1982. Designed by William Cobb. 87 feet tall, top speed 50 mph. A heavily forested out-and-back layout that runs through the woods, with most of the track hidden from view.",
  "kings-dominion-hurler":
    "Wooden coaster at Kings Dominion in Doswell, Virginia, opened 1994. Designed by International Coasters Inc. 83 feet tall, top speed 50 mph. Themed to the Wayne's World film alongside its sister coaster at Carowinds.",
  "kings-dominion-hypersonic-xlc":
    "Steel air-launched coaster that operated at Kings Dominion in Doswell, Virginia, from 2001 to 2007. Built by S&S Worldwide. 165 feet tall with a 90-degree vertical drop, top speed 80 mph — the world's first compressed-air-launch coaster. Removed due to high maintenance demands.",
  "kings-dominion-pantherian":
    "Steel coaster at Kings Dominion in Doswell, Virginia, opened 2024. Built by Vekoma. Replaces the former Volcano: The Blast Coaster's plot. A modern launched looping layout, themed to a panther.",
  "kings-dominion-racer-75-north":
    "Wooden racing coaster at Kings Dominion in Doswell, Virginia, opened 1975. Designed by John Allen of Philadelphia Toboggan Coasters. Two parallel tracks (north and south) race over a 90-foot lift hill. 90 feet tall, top speed 50 mph. An American Coaster Enthusiasts Coaster Landmark.",
  "kings-dominion-reptilian":
    "Steel coaster at Kings Dominion in Doswell, Virginia. Relocated from Geauga Lake. A compact installation with reptile-themed branding.",
  "kings-dominion-shockwave":
    "Steel stand-up coaster that operated at Kings Dominion in Doswell, Virginia, from 1986 to 2015. Built by TOGO. 95 feet tall, one inversion (a vertical loop), top speed 50 mph. Removed in 2015 after a 29-year run.",
  "kings-dominion-volcano-the-blast-coaster":
    "Steel launched inverted coaster that operated at Kings Dominion in Doswell, Virginia, from 1998 to 2018. Built by Intamin. 155 feet tall, four inversions, top speed 70 mph. Launched riders out of a re-themed volcano (formerly Smurf Mountain). Closed in 2018 due to mechanical wear; demolished in 2020.",
  "kings-dominion-woodstock-express":
    "Junior wooden coaster at Kings Dominion in Doswell, Virginia, opened 1975 (as Scooby-Doo's Ghoster Coaster). A family-friendly layout in the Planet Snoopy area. One of the park's original opening-day coasters.",
  "kings-island-adventure-express":
    "Steel mine-train coaster at Kings Island in Mason, Ohio, opened 1991. Built by Arrow Dynamics. A family-friendly mine-train layout with extensive Indiana-Jones-style theming and animatronics.",
  "kings-island-banshee":
    "Steel inverted coaster at Kings Island in Mason, Ohio, opened 2014. Built by Bolliger & Mabillard. 167 feet tall, seven inversions — the world's longest inverted coaster at 4,124 feet. Top speed 68 mph.",
  "kings-island-bat":
    "Steel suspended swinging coaster at Kings Island in Mason, Ohio, opened 1993 as Top Gun. Built by Arrow Dynamics. 78 feet tall, top speed 51 mph. Renamed Flight Deck in 2008, then The Bat in 2014.",
  "kings-island-beast":
    "Wooden coaster at Kings Island in Mason, Ohio, opened 1979. Designed by Charles Dinn and the park's in-house team. 7,359 feet long — the world's longest wooden coaster since opening, an enduring record. Top speed 65 mph. Two lift hills and a long, terrain-following layout through the woods.",
  "kings-island-diamondback":
    "Steel hyper coaster at Kings Island in Mason, Ohio, opened 2009. Built by Bolliger & Mabillard. 230 feet tall, 215-foot drop, top speed 80 mph. Best known for its sequence of camelback airtime hills.",
  "kings-island-flight-of-fear":
    "Steel indoor launched coaster at Kings Island in Mason, Ohio, opened 1996. Built by Premier Rides — sister installation to the one at Kings Dominion. Indoor twisting layout with four inversions inside a UFO-themed building.",
  "kings-island-great-pumpkin-coaster":
    "Junior steel coaster at Kings Island in Mason, Ohio. A small family layout in the Planet Snoopy area, themed to Peanuts' Great Pumpkin.",
  "kings-island-invertigo":
    "Steel inverted boomerang shuttle coaster at Kings Island in Mason, Ohio, opened 1999. Built by Vekoma. Riders sit face-to-face in suspended cars that are pulled backward up a tower, released through a cobra roll and vertical loop, then repeated in reverse. 138 feet tall, top speed 50 mph.",
  "kings-island-king-cobra":
    "Steel stand-up coaster that operated at Kings Island in Mason, Ohio, from 1984 to 2001. Built by TOGO — the first modern stand-up coaster. 95 feet tall, one inversion, top speed 50 mph. Closed after rider complaints about discomfort and structural fatigue.",
  "kings-island-mystic-timbers":
    "Wooden coaster at Kings Island in Mason, Ohio, opened 2017. Designed by Great Coasters International. 109 feet tall, 3,265 feet long, top speed 53 mph. Themed to a remote shed at a logging mill with an indoor pre-show finale.",
  "kings-island-orion":
    "Steel giga coaster at Kings Island in Mason, Ohio, opened 2020. Built by Bolliger & Mabillard. 287 feet tall — the eighth giga coaster in the world — with a 300-foot drop, top speed 91 mph.",
  "kings-island-queen-city-stunt-coaster":
    "Steel launched coaster at Kings Island in Mason, Ohio, opened 2006 (originally as Backlot Stunt Coaster). Built by Premier Rides. Three LIM launches and a fire-effect finale, themed to a Hollywood stunt sequence. Rebranded as Queen City Stunt Coaster in 2025.",
  "kings-island-racer-blue":
    "Wooden racing coaster at Kings Island in Mason, Ohio, opened 1972. Designed by John Allen of Philadelphia Toboggan Coasters. Two parallel tracks race over an 88-foot lift hill. Top speed 53 mph. The Blue side of the dual layout. An American Coaster Enthusiasts Coaster Landmark.",
  "kings-island-son-of-beast-2006":
    "Wooden looping coaster that operated at Kings Island in Mason, Ohio, from 2000 to 2009. Designed by Roller Coaster Corporation of America. 218 feet tall, 6,251 feet long — the world's only wooden looping coaster of its era. Top speed 78 mph. The 2006 reference is to the year the loop was removed after a 2006 incident. Demolished in 2012.",
  "kings-island-vortex":
    "Steel multi-looping coaster that operated at Kings Island in Mason, Ohio, from 1987 to 2019. Built by Arrow Dynamics. 148 feet tall, six inversions, top speed 55 mph. At opening, the world's tallest looping coaster.",
  "kings-island-woodstock-express":
    "Junior wooden coaster at Kings Island in Mason, Ohio, opened 1972 (as Scooby Doo's Ghoster Coaster, later Beastie). A small family-friendly layout in the Planet Snoopy area. One of the park's original opening-day attractions.",
  "kings-island-woodstocks-air-rail":
    "Steel family roller-skater coaster at Kings Island in Mason, Ohio, in the Planet Snoopy area. A small overhead family coaster aimed at young riders.",
  "knoebels-amusement-resort-black-diamond":
    "Indoor dark-ride coaster at Knoebels Amusement Resort in Elysburg, Pennsylvania, opened 2011. Originally at Morey's Piers as Golden Nugget Mine Ride (1960); relocated to Knoebels and re-themed. Family-friendly themed dark experience.",
  "knoebels-amusement-resort-flying-turns":
    "Wooden bobsled coaster at Knoebels Amusement Resort in Elysburg, Pennsylvania, opened 2013. The world's first newly-built bobsled-style wooden coaster since the 1930s. Trains slide through a wooden trough with no fixed track — relying on momentum to navigate banked turns. ~45 feet tall.",
  "knoebels-amusement-resort-high-speed-thrill-coaster":
    "Steel kiddie coaster at Knoebels Amusement Resort in Elysburg, Pennsylvania, opened 1955. Built by the Allan Herschell Company. A small family-friendly layout. Among the oldest operating coasters at the park.",
  "knoebels-amusement-resort-impulse":
    "Steel sit-down looping coaster at Knoebels Amusement Resort in Elysburg, Pennsylvania, opened 2015. Built by Zierer. 98 feet tall with a beyond-vertical first drop, three inversions, top speed 45 mph.",
  "knoebels-amusement-resort-kozmos-kurves":
    "Junior steel coaster at Knoebels Amusement Resort in Elysburg, Pennsylvania. A small family layout aimed at young riders in the park's kids' area.",
  "knoebels-amusement-resort-phoenix":
    "Wooden coaster at Knoebels Amusement Resort in Elysburg, Pennsylvania, opened 1985 — relocated from San Antonio's Playland Park (1947). Designed by Herbert Schmeck of Philadelphia Toboggan Coasters. 78 feet tall, top speed 45 mph. Multiple Golden Ticket Award wins for Best Wooden Coaster. An American Coaster Enthusiasts Coaster Landmark.",
  "knoebels-amusement-resort-twister":
    "Wooden coaster at Knoebels Amusement Resort in Elysburg, Pennsylvania, opened 1999. Designed by John Fetterman with elements based on Mister Twister at Elitch Gardens. 102 feet tall, top speed 50 mph. Highly regarded among wood-coaster enthusiasts.",
  "knoebels-amusement-resort-whirlwind":
    "Steel coaster that operated at Knoebels Amusement Resort in Elysburg, Pennsylvania, from 1984 to 2004. Originally at Playland in Rye, New York as Wild Mouse. Compact double-corkscrew layout, ~50 feet tall.",
  "knotts-berry-farm-boomerang":
    "Steel boomerang shuttle coaster at Knott's Berry Farm in Buena Park, California, opened 1990. Built by Vekoma. The classic Boomerang layout — pulled backward up a tower, released through a cobra roll and vertical loop, then repeated in reverse. Originally Boomerang, briefly the Boomerang Coast to Coaster, currently Coast Rider's neighbor.",
  "knotts-berry-farm-ghostrider":
    "Wooden coaster at Knott's Berry Farm in Buena Park, California, opened 1998. Designed by Custom Coasters International. 118 feet tall, 4,533 feet long — one of the longest wooden coasters in the West. Top speed 56 mph. Reprofiled by Great Coasters International in 2016 for a smoother ride.",
  "knotts-berry-farm-jaguar":
    "Steel family coaster at Knott's Berry Farm in Buena Park, California, opened 1995. Built by Zierer using their Tivoli-Large model. A long, gentle layout that weaves around and through other Fiesta Village attractions. 60 feet tall, top speed 35 mph.",
  "knotts-berry-farm-montezoomas-revenge":
    "Steel shuttle coaster at Knott's Berry Farm in Buena Park, California, opened 1978. Built by Anton Schwarzkopf using his Shuttle Loop model. A launched-shuttle coaster with a vertical loop and twin vertical spikes. Top speed 55 mph. Reopened in 2024 after a refurbishment as Montezooma: The Forbidden Fortress.",
  "knotts-berry-farm-pony-express":
    "Steel motorcycle-style launched family coaster at Knott's Berry Farm in Buena Park, California, opened 2008. Built by Zamperla. Riders sit on individual horse-shaped saddles. 33 feet tall, top speed 38 mph.",
  "knotts-berry-farm-sierra-sidewinder":
    "Steel spinning coaster at Knott's Berry Farm in Buena Park, California, opened 2007. Built by Mack Rides. Cars rotate freely as they navigate a layout through the Camp Snoopy / Mystery Lodge area. 51 feet tall.",
  "knotts-berry-farm-silver-bullet":
    "Steel inverted coaster at Knott's Berry Farm in Buena Park, California, opened 2004. Built by Bolliger & Mabillard. 146 feet tall, six inversions, top speed 55 mph. Routes over the park's Calico River Rapids.",
  "knotts-berry-farm-timberline-twister":
    "Junior steel coaster that operated at Knott's Berry Farm in Buena Park, California, from 1985 to 2013. Built by Intamin using their Junior Coaster model. A small family layout in the Camp Snoopy area, ~21 feet tall.",
  "knotts-berry-farm-xcelerator":
    "Steel hydraulic launch coaster at Knott's Berry Farm in Buena Park, California, opened 2002. Built by Intamin. Launches from 0 to 82 mph in 2.3 seconds through a 205-foot top hat. Themed to 1950s hot-rod culture.",
  "knuckleheads-bowling-family-entertainment-miner-mike":
    "Junior steel coaster at Knucklehead's Bowling & Family Entertainment Center in Wisconsin Dells, Wisconsin. A small family Miner Mike-style layout common at indoor family entertainment centers.",
  "lake-compounce-boulder-dash":
    "Wooden coaster at Lake Compounce in Bristol, Connecticut, opened 2000. Designed by Custom Coasters International. Built into a wooded hillside, top speed 65 mph. Multiple Golden Ticket Award wins for Best Wooden Coaster. Known for its terrain-following layout.",
  "lake-compounce-wildcat":
    "Wooden coaster at Lake Compounce in Bristol, Connecticut, opened 1927. Designed by Herbert Schmeck of Philadelphia Toboggan Coasters. 85 feet tall, top speed 48 mph. One of the oldest operating wooden coasters in the United States. An American Coaster Enthusiasts Coaster Landmark.",
  "lake-compounce-zoomerang":
    "Steel boomerang shuttle coaster at Lake Compounce in Bristol, Connecticut, opened 2007. Built by Vekoma. The classic Boomerang layout.",
  "lake-winnepesaukah-cannon-ball":
    "Wooden coaster at Lake Winnepesaukah in Rossville, Georgia, opened 1967. Designed by John Allen of Philadelphia Toboggan Coasters. 70 feet tall, top speed 45 mph. A classic out-and-back layout, one of the longest-running rides at the Georgia/Tennessee border lakeside park.",
  "lake-winnepesaukah-wacky-worm":
    "Wacky Worm family coaster at Lake Winnepesaukah in Rossville, Georgia. The classic apple/caterpillar-themed family coaster common at smaller parks.",
  "lake-winnepesaukah-wild-lightnin":
    "Steel kiddie coaster at Lake Winnepesaukah in Rossville, Georgia. A small family-friendly layout.",
  "lakemont-park-leap-the-dips":
    "Wooden coaster at Lakemont Park in Altoona, Pennsylvania, opened 1902. Designed by E. Joy Morris. 41 feet tall, top speed 10 mph — the world's oldest operating roller coaster. A side-friction layout (one of the few remaining). A National Historic Landmark and an American Coaster Enthusiasts Coaster Landmark.",
  "lakemont-park-skyliner":
    "Wooden coaster at Lakemont Park in Altoona, Pennsylvania, opened 1987 — relocated from Roseland Park in Canandaigua, New York where it operated from 1960 to 1985. Designed by Herbert Schmeck of Philadelphia Toboggan Coasters. 50 feet tall, top speed 40 mph.",
  "lakemont-park-toboggan":
    "Steel kiddie coaster at Lakemont Park in Altoona, Pennsylvania. A classic portable Toboggan-style ride at the small Pennsylvania park.",
  "legoland-california-coastersaurus":
    "Junior wooden coaster at Legoland California in Carlsbad, California, opened 1999. Designed by Custom Coasters International. ~38 feet tall, top speed 21 mph. Themed to a dinosaur park in the Dino Island area.",
  "legoland-california-dragon":
    "Steel family coaster at Legoland California in Carlsbad, California, opened 1999. Built by Mack Rides. Themed to a dragon in the Castle Hill area. Combines a dark-ride section with an outdoor coaster layout. ~35 feet tall.",
  "legoland-california-technic-coaster":
    "Steel family coaster at Legoland California in Carlsbad, California, opened 2018 as Lego Technic Coaster. Built by Zierer using their Force model. ~50 feet tall, top speed 32 mph.",
  "legoland-florida-coastersaurus":
    "Junior wooden coaster at Legoland Florida in Winter Haven, Florida, opened 2011 — originally built in 1958 as the Triple Hurricane at Cypress Gardens (the predecessor park on the same site). Designed by Herbert Schmeck. The oldest wooden coaster in Florida.",
  "legoland-florida-dragon":
    "Steel family coaster at Legoland Florida in Winter Haven, Florida, opened 2011. Built by Mack Rides. Themed to a dragon in the Castle Hill area, combining a dark-ride section with an outdoor coaster layout. Mirror of the Legoland California version.",
  "legoland-florida-fiesta-express":
    "Junior steel kiddie coaster at Legoland Florida in Winter Haven, Florida. A small family-friendly figure-eight aimed at very young riders.",
  "legoland-florida-flying-school":
    "Steel inverted family coaster at Legoland Florida in Winter Haven, Florida, opened 2011. Built by Vekoma using their Junior Inverted Coaster model. Originally Quest for Chi at the predecessor park; rebranded.",
  "legoland-florida-galaxy-spin":
    "Steel spinning coaster at Legoland Florida in Winter Haven, Florida. Cars rotate freely through a compact themed layout. Family-friendly.",
  "legoland-florida-great-lego-race":
    "Steel coaster at Legoland Florida in Winter Haven, Florida, originally built as Project X at Cypress Gardens. Rebranded as the Great Lego Race in 2018 with virtual-reality overlay (since removed).",
  "legoland-florida-okeechobee-rampage":
    "Wooden coaster at Legoland Florida in Winter Haven, Florida — opened 2011 as Lake Okeechobee Rampage. Operated previously at Cypress Gardens. A family-friendly out-and-back layout.",
  "legoland-florida-starliner":
    "Wooden coaster that operated at Legoland Florida in Winter Haven, Florida, originally built in 1963 as Starliner at Miracle Strip Park, Panama City Beach. Relocated to Cypress Gardens and then to Legoland Florida. ~70 feet tall, top speed 50 mph.",
  "lightwater-valley-caterpillar":
    "Junior steel coaster at Lightwater Valley in North Stainley, England. A small family-friendly Caterpillar-themed layout aimed at young riders.",
  "lightwater-valley-grizzly-bear":
    "Junior steel coaster at Lightwater Valley in North Stainley, England. A small family-friendly bear-themed layout aimed at young riders.",
  "lightwater-valley-ladybird":
    "Junior steel coaster at Lightwater Valley in North Stainley, England. A small family-friendly Ladybird-themed layout aimed at young riders.",
  "lightwater-valley-raptor-attack":
    "Steel coaster at Lightwater Valley in North Stainley, England, opened 1980 as Rat. Designed by Big Dipper specialist Tom Rolfe. Largely underground for an indoor dark-ride feel. Rebranded with raptor / dinosaur theming.",
  "lightwater-valley-twister":
    "Steel coaster at Lightwater Valley in North Stainley, England. A compact looping installation that operated as the park transitioned from a thrill park to a family park.",
  "lightwater-valley-ultimate":
    "Steel coaster at Lightwater Valley in North Stainley, England, opened 1991. Designed by Big Dipper specialist Don Rosser. 7,442 feet long — for decades the world's longest roller coaster. Built into the park's existing terrain with a long terrain-following layout through woodland. Closed 2019; demolished 2022 as the park downsized to a family focus.",
  "luna-park-cyclone":
    "Wooden coaster at Luna Park in Coney Island, Brooklyn, New York, opened 1927. Designed by Vernon Keenan. 85 feet tall, top speed 60 mph. The famed Coney Island Cyclone — a National Historic Landmark and one of the most iconic wooden coasters in the world. An American Coaster Enthusiasts Coaster Landmark.",
  "mt-olympus-water-theme-park-cyclops":
    "Wooden coaster at Mt. Olympus Water & Theme Park in Wisconsin Dells, Wisconsin, opened 1995. Designed by Custom Coasters International. 90 feet tall, top speed 50 mph. Greek-mythology theming alongside the park's other Olympus-themed coasters.",
  "mt-olympus-water-theme-park-dive-to-atlantis":
    "Shoot-the-chute / hybrid coaster at Mt. Olympus Water & Theme Park in Wisconsin Dells, Wisconsin. Listed in coaster databases due to its lift hill and drop. Atlantis-themed.",
  "mt-olympus-water-theme-park-hades":
    "Wooden coaster at Mt. Olympus Water & Theme Park in Wisconsin Dells, Wisconsin, originally opened 2005, with a major retracking in 2009 as Hades 360. Designed by The Gravity Group. Features the world's first 360-degree wood-coaster barrel roll. 136 feet tall, top speed 70 mph.",
  "mt-olympus-water-theme-park-opa":
    "Steel coaster at Mt. Olympus Water & Theme Park in Wisconsin Dells, Wisconsin. A modest installation themed to a Greek 'Opa!' celebration.",
  "mt-olympus-water-theme-park-pegasus":
    "Wooden coaster at Mt. Olympus Water & Theme Park in Wisconsin Dells, Wisconsin, opened 1995. Designed by Custom Coasters International. 80 feet tall, top speed 50 mph. A family-friendly out-and-back themed to the winged horse of Greek mythology.",
  "mt-olympus-water-theme-park-zeus":
    "Wooden coaster at Mt. Olympus Water & Theme Park in Wisconsin Dells, Wisconsin, opened 1996. Designed by Custom Coasters International. 90 feet tall, top speed 51 mph. Greek-mythology theming alongside the park's other Olympus-themed coasters.",
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
