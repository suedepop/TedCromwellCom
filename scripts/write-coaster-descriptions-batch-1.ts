import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

const DESCRIPTIONS: Record<string, string> = {
  "adventure-city-freeway-coaster":
    "Family steel coaster at Adventure City in Anaheim, California, opened 1994. Manufactured by Miler Coaster Company. A short, gentle car-themed ride built for the park's family audience — about 18 feet tall with a top speed near 18 mph. One of two coasters at the small Orange County park.",
  "adventure-city-tree-top-racers":
    "Family steel coaster at Adventure City in Anaheim, California. A small Wacky Worm-style figure-eight layout aimed at young riders. Roughly 14 feet tall, top speed around 17 mph.",
  "adventure-coast-southport-big-apple":
    "Wacky Worm family coaster at Adventure Coast Southport in Southport, England — the latter-day name for the former Pleasureland Southport. Built by Pinfari (Italy) in the apple-themed format common at British seaside parks. Small layout, approximately 16 feet tall.",
  "adventure-coast-southport-cyclone":
    "Wooden roller coaster at Pleasureland Southport (now Adventure Coast Southport) in England, opened 1937. Designed by Charles Paige; one of the UK's classic wooden out-and-back coasters. The park closed in 2006 and partially reopened later as Adventure Coast; the Cyclone was demolished in 2007.",
  "adventure-coast-southport-king-solomons-mines":
    "Family steel mine-train coaster at Adventure Coast Southport in Southport, England. A themed indoor/outdoor layout built for the park's family audience. The original Pleasureland Southport closed in 2006; the park later partially reopened under the Adventure Coast name.",
  "adventuredome-canyon-blaster":
    "Steel double-loop, double-corkscrew coaster at the Adventuredome (formerly MGM Grand Adventures' indoor park, then Circus Circus's indoor park) in Las Vegas, opened 1993. Built by Arrow Dynamics. Operates entirely indoors under the park's pink dome, roughly 60 feet tall with a top speed near 55 mph.",
  "adventuredome-el-loco":
    "Steel spinning/inverted-element coaster at the Adventuredome in Las Vegas, opened 2014. Built by S&S Worldwide using their El Loco model. Features a 1.5G negative-G drop and a barrel roll, packed into a compact indoor footprint.",
  "alton-towers-beastie":
    "Family steel coaster at Alton Towers in Staffordshire, England, opened 1991 (then known as the Beast). Built by Pinfari. A small kiddie figure-eight layout in the Cbeebies Land area, aimed at young children.",
  "alton-towers-galactica":
    "Steel flying coaster at Alton Towers in Staffordshire, England, opened 2002 as Air — the world's first Bolliger & Mabillard flying coaster. Riders are tilted face-down into the prone flying position before launch. Rebranded as Galactica in 2016 with a virtual-reality overlay (since removed). 65 feet tall, 2,800 feet long, top speed 47 mph.",
  "alton-towers-nemesis":
    "Steel inverted coaster at Alton Towers in Staffordshire, England, opened 1994. Built by Bolliger & Mabillard — Europe's first B&M inverted coaster and an enduring fixture of the British theme park scene. Carved into a rocky landscape due to local height restrictions, with a layout that wraps around exposed rock walls. 43 feet tall, 4 inversions, top speed 50 mph. Closed in 2022 for a complete track replacement and reopened as Nemesis Reborn in 2024.",
  "alton-towers-oblivion":
    "Steel dive coaster at Alton Towers in Staffordshire, England, opened 1998 — the world's first vertical-drop dive coaster, built by Bolliger & Mabillard. After a brief hold-and-release over the edge, riders drop 180 feet straight down (the second half of the drop is into an underground tunnel). Top speed 68 mph.",
  "alton-towers-rita":
    "Steel hydraulic launch coaster at Alton Towers in Staffordshire, England, opened 2005. Built by Intamin. Launches from 0 to 62 mph in 2.5 seconds through a low, twisting layout themed to drag-racing. Originally Rita: Queen of Speed, later just Rita.",
  "alton-towers-runaway-mine-train":
    "Steel mine-train coaster at Alton Towers in Staffordshire, England, opened 1992. Built by Vekoma. A modest family-friendly layout with a single lift hill and helices, themed to a runaway gold-rush train.",
  "alton-towers-spinball-whizzer":
    "Steel spinning coaster at Alton Towers in Staffordshire, England, opened 2004. Built by Maurer Söhne (model X-Car-style spinner). Cars rotate freely as they navigate a compact twisting course. Originally branded Spinball Whizzer, later Sonic Spinball during a brief 2010–2015 Sega tie-in.",
  "beech-bend-kentucky-rumbler":
    "Wooden out-and-back coaster at Beech Bend Park in Bowling Green, Kentucky, opened 2006. Designed by The Gravity Group. 96 feet tall with a 91-foot first drop, top speed around 53 mph. A classic mid-2000s revival wood coaster, well-regarded for its airtime.",
  "belmont-park-giant-dipper":
    "Wooden coaster at Belmont Park in San Diego, California, opened 1925. Designed by Frank Prior and Frederick Church. A surviving golden-age wooden coaster — listed on the U.S. National Register of Historic Places. 73 feet tall, top speed 48 mph. Closed in the 1970s and restored to operation in 1990 by the Save the Coaster Committee.",
  "busch-gardens-tampa-bay-air-grover":
    "Junior steel coaster at Busch Gardens Tampa Bay in Tampa, Florida, opened 2011. Built by Zierer (Tivoli-Medium model). Themed to Sesame Street's Grover; a family coaster in the Sesame Street Safari of Fun area.",
  "busch-gardens-tampa-bay-cheetah-hunt":
    "Steel triple-launch coaster at Busch Gardens Tampa Bay in Tampa, Florida, opened 2011. Built by Intamin using LSM launches. 4,400 feet of track — the longest at the park — winding through and over the Edge of Africa area. Top speed 60 mph.",
  "busch-gardens-tampa-bay-cobras-curse":
    "Steel spinning coaster at Busch Gardens Tampa Bay in Tampa, Florida, opened 2016. Built by Mack Rides. Features a vertical lift hill, a giant snake-themed animatronic, and four-seat spinning cars that freely rotate during portions of the layout.",
  "busch-gardens-tampa-bay-gwazi-tiger":
    "Wooden dueling coaster at Busch Gardens Tampa Bay, opened 1999. Built by Great Coasters International. Two tracks (Tiger and Lion) raced and crossed each other six times during the 7,000-foot dual layout. 90 feet tall, top speed 51 mph. Closed in 2015; the Tiger track was redesigned by Rocky Mountain Construction and reopened in 2022 as Iron Gwazi.",
  "busch-gardens-tampa-bay-iron-gwazi":
    "Steel hybrid coaster at Busch Gardens Tampa Bay, opened 2022. Built by Rocky Mountain Construction using the wooden structure of the original Gwazi Tiger track. North America's tallest hybrid coaster at 206 feet, with a 91-degree first drop, top speed 76 mph, and three inversions including a zero-G stall.",
  "busch-gardens-tampa-bay-kumba":
    "Steel sit-down looping coaster at Busch Gardens Tampa Bay, opened 1993. Built by Bolliger & Mabillard — one of the earliest B&M coasters in the U.S. 143 feet tall, 7 inversions including a 108-foot vertical loop, top speed 60 mph. Located in the Congo area.",
  "busch-gardens-tampa-bay-montu":
    "Steel inverted coaster at Busch Gardens Tampa Bay, opened 1996. Built by Bolliger & Mabillard. 150 feet tall, 7 inversions including an Immelmann, top speed 60 mph. Themed to ancient Egypt with extensive theming including a tomb-themed queue.",
  "busch-gardens-tampa-bay-phoenix-rising":
    "Steel inverted family coaster at Busch Gardens Tampa Bay, opened 2024. Built by Bolliger & Mabillard using their Surf Coaster model — riders sit on the side of the track on a swinging perch. 91 feet tall, top speed 44 mph.",
  "busch-gardens-tampa-bay-python":
    "Steel double-corkscrew coaster at Busch Gardens Tampa Bay, opened 1976. Built by Arrow Dynamics. 70 feet tall with two corkscrews, top speed 40 mph. One of the early Arrow Corkscrew installations. Closed in 2006 and demolished.",
  "busch-gardens-tampa-bay-sandserpent":
    "Family steel coaster at Busch Gardens Tampa Bay, opened 2004 in the Timbuktu area. Built by Mack Rides. A wild-mouse-style layout with switchbacks. Originally called Cheetah Chase; relocated and renamed Sand Serpent in 2008.",
  "busch-gardens-tampa-bay-scorpion":
    "Steel sit-down looping coaster at Busch Gardens Tampa Bay, opened 1980. Built by Anton Schwarzkopf — one of the early German-built loopers. 62 feet tall, one vertical loop, top speed 50 mph. Located in the Timbuktu area.",
  "busch-gardens-tampa-bay-sheikra":
    "Steel dive coaster at Busch Gardens Tampa Bay, opened 2005. Built by Bolliger & Mabillard. 200 feet tall with a 90-degree vertical first drop after a brief hold-and-release. Originally launched with floorless trains and received a floorless redesign in 2007. Top speed 70 mph.",
  "busch-gardens-tampa-bay-tigris":
    "Steel triple-launch shuttle coaster at Busch Gardens Tampa Bay, opened 2019. Built by Premier Rides using their Sky Rocket II model — a vertical spike with a beyond-vertical top hat. 150 feet tall, top speed 62 mph.",
  "busch-gardens-williamsburg-alpengeist":
    "Steel inverted coaster at Busch Gardens Williamsburg in Virginia, opened 1997. Built by Bolliger & Mabillard. 195 feet tall — for a time the world's tallest inverted coaster. Six inversions including a 106-foot vertical loop and a 170-foot drop, top speed 67 mph. Themed to a ski-lift gone wrong.",
  "busch-gardens-williamsburg-apollos-chariot":
    "Steel hyper coaster at Busch Gardens Williamsburg, opened 1999. Built by Bolliger & Mabillard — their first hypercoaster. 170 feet tall, 210-foot drop down a hillside, top speed 73 mph. Renowned for its sustained airtime moments.",
  "busch-gardens-williamsburg-big-bad-wolf":
    "Steel suspended swinging coaster at Busch Gardens Williamsburg, opened 1984. Built by Arrow Dynamics — one of the earliest Arrow suspended coasters. 99 feet tall, top speed 48 mph. Themed to a Bavarian village chase. Closed in 2009; the Verbolten coaster opened on the same plot in 2012.",
  "busch-gardens-williamsburg-griffon":
    "Steel dive coaster at Busch Gardens Williamsburg, opened 2007. Built by Bolliger & Mabillard. 205 feet tall with a 90-degree vertical drop and a floorless eight-across train — the first floorless dive coaster. Top speed 70 mph, two splashdowns.",
  "busch-gardens-williamsburg-grovers-alpine-express":
    "Junior steel coaster at Busch Gardens Williamsburg, opened 2010 in the Sesame Street Forest of Fun area. Built by Zierer. Themed to Grover; a small family layout aimed at young children.",
  "busch-gardens-williamsburg-invadr":
    "Wooden coaster at Busch Gardens Williamsburg, opened 2017. Built by Rocky Mountain Construction — RMC's first traditional wooden coaster after several years of steel-hybrid retrofits. 74 feet tall, top speed 48 mph. Themed to a Viking raid in the New France area.",
  "busch-gardens-williamsburg-loch-ness-monster":
    "Steel double-looping coaster at Busch Gardens Williamsburg, opened 1978. Built by Arrow Dynamics. Famous for its pair of interlocking vertical loops — a feature that remains rare and visually striking. 130 feet tall, top speed 60 mph. The oldest operating coaster at the park.",
  "busch-gardens-williamsburg-tempesto":
    "Steel triple-launch shuttle coaster at Busch Gardens Williamsburg, opened 2015. Built by Premier Rides using their Sky Rocket II model. 154 feet tall with a beyond-vertical top hat, top speed 63 mph.",
  "busch-gardens-williamsburg-verbolten":
    "Steel multi-launch family coaster at Busch Gardens Williamsburg, opened 2012. Built by Zierer. Built on the site of the former Big Bad Wolf, partially indoor with a themed dark-ride section and a final 88-foot drop. Top speed 53 mph.",
  "busch-gardens-williamsburg-wilde-maus":
    "Steel wild-mouse coaster that operated at Busch Gardens Williamsburg from 1996 to 2002. Built by Mack Rides. Featured the standard wild-mouse switchback layout with single cars. Relocated to other parks after its removal.",
  "camden-park-big-dipper":
    "Wooden coaster at Camden Park in Huntington, West Virginia, opened 1958. A small family-sized out-and-back layout, roughly 50 feet tall. One of two operating wood coasters at the long-running West Virginia park (along with the Lil' Dipper).",
  "camden-park-hawnted-house":
    "Indoor dark-ride coaster at Camden Park in Huntington, West Virginia. A small enclosed family coaster with haunted-house theming; one of the park's longstanding attractions.",
  "camden-park-lil-dipper":
    "Wooden junior coaster at Camden Park in Huntington, West Virginia, opened 1961. Designed by Herbert Schmeck. A small family-friendly layout that has operated alongside the park's larger Big Dipper for decades.",
  "camden-park-slingshot":
    "Steel coaster at Camden Park in Huntington, West Virginia, opened 2017. A compact junior-coaster installation aimed at filling out the small West Virginia park's coaster lineup.",
  "camden-park-thunderbolt-express":
    "Steel coaster at Camden Park in Huntington, West Virginia. A compact looping installation at the small family park.",
  "canadas-wonderland-backlot-stunt-coaster":
    "Steel launched coaster at Canada's Wonderland in Vaughan, Ontario, opened 2014 (originally as Italian Job Stunt Track in 2005). Built by Premier Rides. Themed to a Hollywood movie stunt sequence with three LIM launches and a fire-effect finale.",
  "canadas-wonderland-bat":
    "Steel boomerang shuttle coaster at Canada's Wonderland in Ontario, opened 1987. Built by Vekoma. The classic Boomerang layout — pulled backward up a tower, released through a cobra roll and vertical loop, then repeated in reverse. Originally called SkyRider, later Boomerang, and currently The Bat.",
  "canadas-wonderland-daredeviler":
    "Family steel coaster at Canada's Wonderland in Ontario. A small kiddie installation in the park's KidZville area.",
  "canadas-wonderland-dragon-fyre":
    "Steel quadruple-looping coaster at Canada's Wonderland in Ontario, opened 1981. Built by Arrow Dynamics — one of their early Arrow loopers. 70 feet tall, four inversions (two vertical loops and two corkscrews), top speed 55 mph. Originally Dragon Fire.",
  "canadas-wonderland-fly":
    "Steel wild-mouse coaster at Canada's Wonderland in Ontario, opened 2005. Built by Mack Rides. The classic Wild Mouse switchback layout with single rotating cars.",
  "canadas-wonderland-ghoster-coaster":
    "Junior wooden coaster at Canada's Wonderland in Ontario, opened 1981. A family layout built for the park's KidZville area. One of the longest-running junior wood coasters in Canada.",
  "canadas-wonderland-mighty-canadian-minebuster":
    "Wooden out-and-back coaster at Canada's Wonderland in Ontario, opened 1981 — the largest wood coaster at the park since its opening year. 90 feet tall, 3,828 feet long, top speed 56 mph.",
  "canadas-wonderland-silver-streak":
    "Steel suspended family coaster at Canada's Wonderland in Ontario, opened 1999. Built by Vekoma using their Junior Suspended model. A swinging-car layout aimed at families, with a modest 36-foot lift hill.",
  "canadas-wonderland-skyrider":
    "Steel stand-up coaster that operated at Canada's Wonderland from 1985 to 2014. Built by TOGO. The first stand-up coaster in North America. 88 feet tall, two inversions, top speed 50 mph. Removed and dismantled in 2014.",
  "canadas-wonderland-taxi-jam":
    "Junior steel coaster at Canada's Wonderland in Ontario, opened 1995. Built by Zamperla. A small kiddie figure-eight in the KidZville area.",
  "canadas-wonderland-thunder-run":
    "Family steel coaster at Canada's Wonderland in Ontario, opened 1981. Built by Mack Rides — a steel-tracked mine-train coaster that runs partially through an artificial mountain. One of the park's original opening-day attractions.",
  "canadas-wonderland-time-warp":
    "Family flying coaster that operated at Canada's Wonderland in Ontario from 2003 to 2018. Built by Zamperla using their Volare model — riders lie on their stomachs in a prone position. Known for an uncomfortable restraint design; replaced after a 15-year run.",
  "canadas-wonderland-vortex":
    "Steel suspended swinging coaster at Canada's Wonderland in Ontario, opened 1991. Built by Arrow Dynamics. 90 feet tall, top speed 50 mph. Closed at the end of 2019 due to structural fatigue and demolished.",
  "canadas-wonderland-wilde-beast":
    "Wooden coaster at Canada's Wonderland in Ontario, opened 1981. A traditional out-and-back layout, 78 feet tall, top speed 56 mph. One of the park's original opening-day wooden coasters.",
  "carowinds-afterburn":
    "Steel inverted coaster at Carowinds in Charlotte, North Carolina, opened 1999. Built by Bolliger & Mabillard. 113 feet tall, six inversions including a 102-foot vertical loop and a zero-G roll, top speed 62 mph. Originally Top Gun: The Jet Coaster; renamed Afterburn in 2008.",
  "carowinds-carolina-cyclone":
    "Steel multi-looping coaster at Carowinds in Charlotte, North Carolina, opened 1980. Built by Arrow Dynamics — the world's first coaster with four inversions (two vertical loops, two corkscrews). 95 feet tall, top speed 50 mph.",
  "carowinds-carolina-goldrusher":
    "Steel mine-train coaster at Carowinds in Charlotte, North Carolina, opened 1973 — one of the park's original opening-day attractions. Built by Arrow Dynamics. A family-friendly mine-train layout with a long, twisting course.",
  "carowinds-hurler":
    "Wooden coaster that operated at Carowinds in Charlotte, North Carolina from 1994 to 2015. Designed by International Coasters Inc. 83 feet tall, top speed 50 mph. Themed to the Wayne's World film. Rebuilt as the steel hybrid Twisted Timbers... no — actually rebuilt and rebranded; ultimately closed in 2015.",
  "carowinds-kiddy-hawk":
    "Junior steel coaster at Carowinds in Charlotte, North Carolina. A small family-coaster installation in the park's Planet Snoopy / kids' area.",
  "carowinds-nighthawk":
    "Steel flying coaster at Carowinds in Charlotte, North Carolina, originally opened at California's Great America in 2001 as Stealth — the first Vekoma flying coaster. Relocated to Carowinds in 2004 as BORG Assimilator, renamed Nighthawk in 2008. 115 feet tall, 4 inversions.",
  "carowinds-ricochet":
    "Steel wild-mouse coaster at Carowinds in Charlotte, North Carolina, opened 2002. Built by Mack Rides. The classic wild-mouse switchback layout with single cars, 46 feet tall.",
  "carowinds-thunder-road-right":
    "Wooden dueling coaster that operated at Carowinds in Charlotte, North Carolina from 1976 to 2015. Built by Philadelphia Toboggan Coasters. The right side of a dual mirrored layout that raced against an identical left-side track. 95 feet tall, top speed 58 mph. Demolished in 2016.",
  "carowinds-vortex":
    "Steel stand-up coaster at Carowinds in Charlotte, North Carolina, opened 1992. Built by Bolliger & Mabillard. 90 feet tall, two inversions (vertical loop and a flat spin), top speed 50 mph.",
  "carowinds-wilderness-run":
    "Junior steel coaster at Carowinds in Charlotte, North Carolina, opened 1973 as the Scooby-Doo / Lucy's Crabbie Cabbie among various renames. A family-coaster figure-eight that has operated under several themes over the park's history.",
  "carowinds-woodstock-express":
    "Junior wooden coaster at Carowinds in Charlotte, North Carolina, opened 1973. A small family-friendly out-and-back layout in the park's Planet Snoopy area. One of the park's original opening-day attractions.",
  "casino-pier-pirates-hideaway":
    "Family steel coaster at Casino Pier in Seaside Heights, New Jersey. A compact figure-eight aimed at young riders, part of the Jersey Shore boardwalk park's coaster lineup.",
  "casino-pier-star-jet":
    "Steel coaster at Casino Pier in Seaside Heights, New Jersey, originally opened 2002 over the Atlantic Ocean. A Zamperla-built sea-themed steel coaster that became iconic when Hurricane Sandy washed the coaster's structure into the ocean in 2012. A replacement, the Hydrus, opened on the rebuilt pier in 2017.",
  "casino-pier-wild-mouse":
    "Steel wild-mouse coaster at Casino Pier in Seaside Heights, New Jersey. The classic wild-mouse switchback layout with single cars, one of several coasters at the Jersey Shore boardwalk park.",
  "cedar-point-blue-streak":
    "Wooden coaster at Cedar Point in Sandusky, Ohio, opened 1964. Designed by John Allen of Philadelphia Toboggan Coasters. 78 feet tall, top speed 40 mph. The oldest operating coaster at Cedar Point and an American Coaster Enthusiasts Coaster Classic. Painted bright blue, the coaster sits along the lakefront at the park's entrance.",
  "cedar-point-cedar-creek-mine-ride":
    "Steel mine-train coaster at Cedar Point in Sandusky, Ohio, opened 1969. Built by Arrow Development. A 48-foot family-friendly layout themed to a creek-side mine. Pioneering Arrow mine-train design.",
  "cedar-point-corkscrew":
    "Steel multi-looping coaster at Cedar Point in Sandusky, Ohio, opened 1976. Built by Arrow Dynamics — the world's first coaster with three inversions (a vertical loop and two corkscrews). 85 feet tall, top speed 48 mph.",
  "cedar-point-demon-drop":
    "Steel freefall ride at Cedar Point in Sandusky, Ohio, opened 1983. Built by Intamin — an Intamin First Generation freefall (technically not a roller coaster but listed in coaster databases). Cars dropped 60 feet from a tower then transitioned to a horizontal sliding stop. Operated at Cedar Point until 2009; relocated to Dorney Park.",
  "cedar-point-disaster-transport":
    "Indoor bobsled coaster that operated at Cedar Point in Sandusky, Ohio from 1985 (as Avalanche Run, with no enclosure) to 2012, with the indoor enclosure added in 1990. Built by Intamin. A bobsled-style track inside a building with sci-fi space-shipping theming. Demolished to make room for GateKeeper.",
  "cedar-point-gatekeeper":
    "Steel wing coaster at Cedar Point in Sandusky, Ohio, opened 2013. Built by Bolliger & Mabillard. 170 feet tall with a 164-foot drop, six inversions including an over-the-front-gate keyhole element, top speed 67 mph. Located at the park's main entrance.",
  "cedar-point-gemini-blue":
    "Steel racing coaster at Cedar Point in Sandusky, Ohio, opened 1978. Built by Arrow Dynamics. The Blue side of a dueling pair (with Gemini Red) — 125 feet tall, two trains racing on parallel tracks, top speed 60 mph. For years held the record as the world's tallest roller coaster.",
  "cedar-point-iron-dragon":
    "Steel suspended swinging coaster at Cedar Point in Sandusky, Ohio, opened 1987. Built by Arrow Dynamics. 76 feet tall, top speed 40 mph. A family-friendly Arrow suspended coaster that swings through the trees and over a pond.",
  "cedar-point-magnum-xl-200":
    "Steel hyper coaster at Cedar Point in Sandusky, Ohio, opened 1989. Built by Arrow Dynamics — the world's first coaster to break 200 feet, a milestone that kicked off the modern hyper-coaster era. 205 feet tall, 195-foot drop, top speed 72 mph. Named a Roller Coaster Landmark by ACE.",
  "cedar-point-mantis":
    "Steel stand-up coaster that operated at Cedar Point in Sandusky, Ohio from 1996 to 2014 as Mantis. Built by Bolliger & Mabillard. 145 feet tall, four inversions, top speed 60 mph. Converted to a floorless coaster and reopened as Rougarou in 2015.",
  "cedar-point-maverick":
    "Steel launched coaster at Cedar Point in Sandusky, Ohio, opened 2007. Built by Intamin using LSM launches. 105 feet tall with a 95-degree first drop (more than vertical), two LSM launches, two inversions, top speed 70 mph. One of the most acclaimed coasters at the park.",
  "cedar-point-mean-streak":
    "Wooden coaster that operated at Cedar Point in Sandusky, Ohio from 1991 to 2016. Designed by Dinn Corporation and Curtis D. Summers. 161 feet tall, 5,427 feet long — at opening, the world's tallest wooden coaster. Rebuilt by Rocky Mountain Construction with steel I-Box track and reopened as Steel Vengeance in 2018.",
  "cedar-point-millennium-force":
    "Steel giga coaster at Cedar Point in Sandusky, Ohio, opened 2000. Built by Intamin — the world's first giga coaster, breaking the 300-foot barrier. 310 feet tall, 300-foot drop at 80 degrees, top speed 93 mph. Named to the Golden Ticket Awards' Top Steel Coaster list every year since 2001.",
  "cedar-point-raptor":
    "Steel inverted coaster at Cedar Point in Sandusky, Ohio, opened 1994. Built by Bolliger & Mabillard. 137 feet tall, six inversions, top speed 57 mph. At opening, the tallest, fastest, and longest inverted coaster in the world.",
  "cedar-point-rougarou":
    "Steel floorless coaster at Cedar Point in Sandusky, Ohio. Rebuilt from the former stand-up coaster Mantis and reopened in 2015. Built originally by Bolliger & Mabillard. 145 feet tall, four inversions, top speed 60 mph. Themed to a Cajun werewolf legend.",
  "cedar-point-sirens-curse":
    "Steel tilt coaster at Cedar Point in Sandusky, Ohio, opened 2025. Built by Intamin using a tilt-coaster mechanism — riders are tilted from horizontal to vertical at the top of the lift before plunging downward. The first Intamin tilt coaster.",
  "cedar-point-steel-vengeance":
    "Steel hybrid coaster at Cedar Point in Sandusky, Ohio, opened 2018. Built by Rocky Mountain Construction on the wooden structure of the former Mean Streak. 205 feet tall, 200-foot drop at 90 degrees, top speed 74 mph, four inversions including a stall. Multiple Golden Ticket Award wins; widely considered one of the world's best coasters.",
  "cedar-point-top-thrill-2":
    "Steel triple-launch coaster at Cedar Point in Sandusky, Ohio, opened in 2024 (after a year-plus rebuild). Built by Zamperla as a replacement for Top Thrill Dragster. 420 feet tall, top speed 120 mph, with both forward and reverse launches over a top hat. Operations were suspended shortly after opening due to mechanical issues and resumed in 2025.",
  "cedar-point-top-thrill-dragster":
    "Steel hydraulic launch coaster that operated at Cedar Point in Sandusky, Ohio from 2003 to 2021. Built by Intamin. 420 feet tall, top speed 120 mph from a 0–120 launch in under 4 seconds — at opening, the tallest and fastest coaster in the world. Closed after a 2021 incident; eventually rebuilt and reopened as Top Thrill 2 in 2024.",
  "cedar-point-valravn":
    "Steel dive coaster at Cedar Point in Sandusky, Ohio, opened 2016. Built by Bolliger & Mabillard. 223 feet tall, 214-foot drop at 90 degrees, three inversions, top speed 75 mph. At opening, the tallest, fastest, and longest dive coaster in the world.",
  "cedar-point-white-water-landing-with-hill":
    "Log flume / shoot-the-chute ride with a coaster hill section that operated at Cedar Point in Sandusky, Ohio from 1982 to 2005. Manufactured by O.D. Hopkins. Demolished to make room for the Maverick coaster.",
  "cedar-point-wicked-twister":
    "Steel impulse coaster that operated at Cedar Point in Sandusky, Ohio from 2002 to 2021. Built by Intamin. 215 feet tall — the tallest and fastest impulse coaster in the world during its operating run. A back-and-forth U-shaped track with twisting spikes at each end. Demolished in 2022.",
  "cedar-point-wild-mouse":
    "Steel wild-mouse coaster that operated at Cedar Point in Sandusky, Ohio from 1996 to 2003. Built by Mack Rides. Featured the standard wild-mouse switchback layout with single cars. Relocated after its Cedar Point run.",
  "cedar-point-wildcat":
    "Steel coaster that operated at Cedar Point in Sandusky, Ohio from 1970 to 2011. Built by Anton Schwarzkopf — a portable-style Wildcat model. Compact and tight, ~50 feet tall. Removed in 2011 after over 40 years of operation.",
  "cedar-point-wilderness-run":
    "Junior steel coaster at Cedar Point in Sandusky, Ohio, opened 1979 (as Jr. Gemini). Built by Intamin. A small family-friendly layout in the Camp Snoopy / Planet Snoopy area, ~19 feet tall.",
  "cedar-point-woodstock-express":
    "Junior wooden coaster at Cedar Point in Sandusky, Ohio, opened 1964 (originally as the Junior Coaster, later Jr. Coaster and then Woodstock Express). Built by Philadelphia Toboggan Coasters. A small family-friendly layout in the Planet Snoopy area.",
  "chessington-world-of-adventures-dragons-fury":
    "Steel spinning coaster at Chessington World of Adventures in Surrey, England, opened 2004. Built by Maurer Söhne. Cars rotate freely as they navigate a compact dragon-themed layout. 65 feet tall, top speed 38 mph.",
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
