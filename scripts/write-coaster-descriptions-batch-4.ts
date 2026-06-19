import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

const DESCRIPTIONS: Record<string, string> = {
  "myrtle-beach-grand-prix-crazy-mouse":
    "Steel spinning wild-mouse coaster at Myrtle Beach Grand Prix in Myrtle Beach, South Carolina. Built by Reverchon Industries. Compact switchback layout with cars that spin freely during portions of the ride.",
  "myrtle-beach-grand-prix-wacky-worm":
    "Junior steel coaster at Myrtle Beach Grand Prix in Myrtle Beach, South Carolina. A small worm-themed family coaster aimed at very young riders.",
  "myrtle-beach-pavilion-corkscrew":
    "Steel multi-looping coaster that operated at Myrtle Beach Pavilion in Myrtle Beach, South Carolina, before the park's 2006 closure. Built by Arrow Dynamics. A classic Arrow Corkscrew layout with a vertical loop and double corkscrews. Relocated after the park closed.",
  "myrtle-beach-pavilion-hurricane":
    "Wooden coaster that operated at Myrtle Beach Pavilion in Myrtle Beach, South Carolina from 2000 to 2006. Designed by Custom Coasters International. 101 feet tall, top speed 55 mph. Demolished after the park closed in 2006.",
  "myrtle-beach-pavilion-little-eagle":
    "Junior steel coaster that operated at Myrtle Beach Pavilion in Myrtle Beach, South Carolina before the park's 2006 closure. A small family-friendly figure-eight layout in the children's area.",
  "myrtle-beach-pavilion-mad-mouse":
    "Steel wild-mouse coaster that operated at Myrtle Beach Pavilion in Myrtle Beach, South Carolina. A classic compact wild-mouse switchback layout. Relocated after the park's 2006 closure.",
  "new-york-new-york-hotel-casino-big-apple-coaster":
    "Steel sit-down looping coaster at the New York-New York Hotel & Casino on the Las Vegas Strip, opened 1997. Built by TOGO. 203 feet tall, two inversions including a heartline twist-and-dive, top speed 67 mph. Wraps around the casino's NYC-skyline-themed exterior. Originally Manhattan Express, renamed Roller Coaster, then Big Apple Coaster.",
  "niagara-amusement-park-splash-world-crazy-mouse":
    "Steel spinning wild-mouse coaster at Niagara Amusement Park & Splash World in Grand Island, New York (formerly Fantasy Island). Compact switchback layout with cars that spin freely. The park closed in 2019.",
  "niagara-amusement-park-splash-world-silver-comet":
    "Wooden coaster that operated at Niagara Amusement Park & Splash World (formerly Fantasy Island) in Grand Island, New York from 1999 to 2019. Designed by Custom Coasters International. 95 feet tall, top speed 50 mph. Sat dormant after the park's closure.",
  "oakwood-theme-park-megafobia":
    "Wooden coaster at Oakwood Theme Park in Narberth, Wales, opened 1996. Designed by Custom Coasters International. 89 feet tall, top speed 50 mph. The UK's first major modern wood coaster and a longtime fan favorite of British wood-coaster enthusiasts.",
  "oakwood-theme-park-speed-no-limits":
    "Steel sit-down looping coaster at Oakwood Theme Park in Narberth, Wales, opened 2006. Built by Gerstlauer using their Eurofighter model. 100 feet tall with a 97-degree first drop (more than vertical), four inversions, top speed 60 mph.",
  "oakwood-theme-park-treetops-rollercoaster":
    "Steel family coaster at Oakwood Theme Park in Narberth, Wales. A small junior layout aimed at families.",
  "playland-park-dragon-coaster":
    "Wooden coaster at Playland Park in Rye, New York, opened 1929. Designed by Frederick Church. 75 feet tall, top speed 45 mph. Themed to a dragon — riders pass through a dragon's mouth on the ride. A National Historic Landmark and an American Coaster Enthusiasts Coaster Landmark.",
  "playland-park-family-flyer":
    "Junior steel coaster at Playland Park in Rye, New York. A small family-friendly layout aimed at young riders at the historic Westchester County park.",
  "playland-park-super-flight":
    "Steel coaster at Playland Park in Rye, New York. A modest installation in the park's adult-ride section.",
  "pleasure-beach-resort-avalanche":
    "Steel bobsled coaster at Blackpool Pleasure Beach in Lancashire, England, opened 1988. Built by Mack Rides. Trains slide through a half-pipe-style channel with no fixed track, themed to an alpine bobsled run. ~84 feet tall, top speed 40 mph.",
  "pleasure-beach-resort-big-dipper":
    "Wooden coaster at Blackpool Pleasure Beach in Lancashire, England, opened 1923. Designed by John Miller. 65 feet tall, top speed 40 mph. One of the oldest operating wooden coasters in the UK. Listed Grade-II in the National Heritage List for England.",
  "pleasure-beach-resort-big-one":
    "Steel hyper coaster at Blackpool Pleasure Beach in Lancashire, England, opened 1994. Built by Arrow Dynamics. 235 feet tall, 205-foot drop, top speed 74 mph. At opening, the world's tallest and fastest roller coaster. Often called The Pepsi Max Big One (its full name during a sponsorship era).",
  "pleasure-beach-resort-blue-flyer":
    "Junior wooden coaster at Blackpool Pleasure Beach in Lancashire, England, opened 1934 (rebuilt 1995). A small family-friendly out-and-back layout in the Beaver Creek area, aimed at young riders.",
  "pleasure-beach-resort-circus-clown":
    "Junior steel coaster at Blackpool Pleasure Beach in Lancashire, England. A small Wacky Worm-style family layout in the Nickelodeon Land area, themed to clowns.",
  "pleasure-beach-resort-grand-national-lifthill-left":
    "Wooden Möbius-loop racing coaster at Blackpool Pleasure Beach in Lancashire, England, opened 1935. Designed by Charles Paige. 62 feet tall, top speed 40 mph. Two cars race on parallel tracks that intertwine — leave the station on the left lift hill and return on the right (Möbius-loop layout). Listed Grade-II.",
  "pleasure-beach-resort-nickelodeon-streak":
    "Wooden coaster at Blackpool Pleasure Beach in Lancashire, England, opened 1933 as Roller Coaster. Designed by Charles Paige. 41 feet tall, top speed 35 mph. Rebranded as the Nickelodeon Streak during the Nickelodeon Land era.",
  "pleasure-beach-resort-revolution":
    "Steel shuttle coaster at Blackpool Pleasure Beach in Lancashire, England, opened 1979. Built by Anton Schwarzkopf using his Looping Star shuttle model — the UK's first modern looping coaster. 70 feet tall, one vertical loop, top speed 45 mph. Riders go through the loop twice — once forward and once in reverse.",
  "pleasure-beach-resort-space-invader-2":
    "Indoor steel family coaster at Blackpool Pleasure Beach in Lancashire, England, opened 1984 as Space Invader. A spinning-car indoor coaster experience with extensive lighting effects, refurbished and relaunched as Space Invader 2.",
  "pleasure-beach-resort-steeplechase-green":
    "Steel horse-themed racing coaster at Blackpool Pleasure Beach in Lancashire, England, opened 1977. Built by Arrow Development. The world's only operating Steeplechase coaster — riders straddle horse-shaped cars on three parallel tracks themed to a horse race. 30 feet tall, top speed 30 mph. The Green track of three.",
  "pleasure-beach-resort-steeplechase-yellow":
    "Steel horse-themed racing coaster at Blackpool Pleasure Beach in Lancashire, England, opened 1977. Built by Arrow Development. The Yellow track of three parallel horse-race tracks. 30 feet tall, top speed 30 mph.",
  "pleasure-beach-resort-wild-mouse":
    "Wooden wild-mouse coaster that operated at Blackpool Pleasure Beach from 1958 to 2017. Designed by Frank Fred Bolinger. One of the few wooden wild-mouse coasters in the world. 50 feet tall, top speed 28 mph. Demolished in 2017.",
  "pleasurewood-hills-cannonball-express":
    "Family steel coaster at Pleasurewood Hills in Lowestoft, England. A small mine-train-style coaster themed to a cannonball-firing train at the British seaside park.",
  "pleasurewood-hills-egg-spress":
    "Junior steel coaster at Pleasurewood Hills in Lowestoft, England. A small Wacky Worm-style family coaster, themed to eggs.",
  "seabreeze-bobsleds":
    "Steel bobsled coaster at Seabreeze Amusement Park in Rochester, New York. A compact bobsled layout at the long-running Lake Ontario lakeside park.",
  "seabreeze-jack-rabbit":
    "Wooden coaster at Seabreeze Amusement Park in Rochester, New York, opened 1920. Designed by John Miller and Harry Baker. 75 feet tall, top speed 42 mph. The fourth-oldest operating roller coaster in the world. An American Coaster Enthusiasts Coaster Landmark.",
  "seabreeze-whirlwind":
    "Steel spinning coaster at Seabreeze Amusement Park in Rochester, New York, opened 2006. Built by Maurer Söhne. Cars rotate freely as they navigate a compact twisting layout.",
  "seaworld-orlando-ice-breaker":
    "Steel multi-launch coaster at SeaWorld Orlando, opened 2022. Built by Premier Rides. Four launches including a backward launch, a 93-foot beyond-vertical top hat with a 100-degree drop, top speed 52 mph.",
  "seaworld-orlando-journey-to-atlantis":
    "Shoot-the-chute / hybrid coaster at SeaWorld Orlando, opened 1998. Built by Mack Rides. Combines an indoor dark-ride section with two outdoor water drops and a brief outdoor coaster section. Themed to a journey to the lost city of Atlantis.",
  "seaworld-orlando-kraken":
    "Steel floorless coaster at SeaWorld Orlando, opened 2000. Built by Bolliger & Mabillard. 149 feet tall, seven inversions, top speed 65 mph. The first floorless coaster in Florida. Themed to Poseidon's sea monster.",
  "seaworld-orlando-mako":
    "Steel hyper coaster at SeaWorld Orlando, opened 2016. Built by Bolliger & Mabillard. 200 feet tall, 200-foot drop, top speed 73 mph. Florida's tallest, fastest, and longest coaster at opening. Themed to a mako shark.",
  "seaworld-orlando-manta":
    "Steel flying coaster at SeaWorld Orlando, opened 2009. Built by Bolliger & Mabillard. 140 feet tall, four inversions, top speed 56 mph. Riders are tilted into a face-down flying position before launch. Themed to a manta ray with an aquarium pre-show.",
  "seaworld-orlando-super-grovers-box-car-derby":
    "Junior steel coaster at SeaWorld Orlando in the Sesame Street area, opened 2022. A small family-friendly layout themed to Grover's box-car race.",
  "seaworld-san-antonio-great-white":
    "Steel inverted coaster at SeaWorld San Antonio in San Antonio, Texas, opened 1997. Built by Bolliger & Mabillard. 90 feet tall, five inversions, top speed 52 mph. The first inverted coaster in Texas. Themed to a great white shark.",
  "seaworld-san-antonio-steel-eel":
    "Steel hyper coaster at SeaWorld San Antonio in San Antonio, Texas, opened 1999. Built by Morgan Manufacturing. 150 feet tall, top speed 65 mph. Themed to a steel eel with a primarily out-and-back airtime-focused layout.",
  "seaworld-san-diego-journey-to-atlantis":
    "Shoot-the-chute / hybrid coaster at SeaWorld San Diego, opened 2004. Built by Mack Rides. Combines a brief outdoor coaster section with a 60-foot water drop. Sister installation to the Orlando version.",
  "sesame-place-vapor-trail":
    "Family steel coaster at Sesame Place in Langhorne, Pennsylvania, opened 1997. Built by Zierer using their Tivoli-Large model. A gentle multi-loop layout aimed at families. ~40 feet tall, top speed 30 mph.",
  "six-flags-america-batwing":
    "Steel flying coaster at Six Flags America in Largo, Maryland, opened 2001. Built by Vekoma — the first commercial Vekoma flying coaster. 115 feet tall, five inversions, top speed 50 mph. Riders are tilted into a face-down flying position.",
  "six-flags-america-jokers-jinx":
    "Steel indoor launched coaster at Six Flags America in Largo, Maryland, opened 1999. Built by Premier Rides — sister installation to Flight of Fear at Kings Dominion and Kings Island. Indoor twisting layout with four inversions, opened up to outdoor viewing in 2006.",
  "six-flags-america-professor-screamores-skywinder":
    "Steel inverted coaster at Six Flags America in Largo, Maryland — formerly Apocalypse, originally Skull Mountain at other parks. Built by Vekoma using their Suspended Looping Coaster (SLC) model. 110 feet tall, five inversions.",
  "six-flags-america-roar":
    "Wooden coaster at Six Flags America in Largo, Maryland, opened 1999. Designed by Great Coasters International. 90 feet tall, top speed 50 mph. A heavily-twisting layout. Closed in 2024 alongside several other coasters as part of the park's announced closure / sale.",
  "six-flags-america-superman-ride-of-steel":
    "Steel hyper coaster at Six Flags America in Largo, Maryland, opened 2000. Built by Intamin — sister installation to Six Flags Darien Lake's Ride of Steel. 200 feet tall with a 205-foot drop, top speed 73 mph.",
  "six-flags-america-two-face-the-flip-side":
    "Steel inverted boomerang shuttle coaster that operated at Six Flags America in Largo, Maryland from 1999 to 2007. Built by Vekoma. Riders sat face-to-face in suspended cars that were pulled backward, released through a cobra roll and vertical loop, then repeated in reverse. 138 feet tall.",
  "six-flags-america-wild-one":
    "Wooden coaster at Six Flags America in Largo, Maryland, originally built in 1917 as Giant Coaster at Paragon Park in Massachusetts. Relocated and renamed Wild One in 1986. 98 feet tall, top speed 53 mph. An American Coaster Enthusiasts Coaster Landmark.",
  "six-flags-darien-lake-boomerang":
    "Steel boomerang shuttle coaster at Six Flags Darien Lake in Darien Center, New York, opened 1997. Built by Vekoma. The classic Boomerang layout.",
  "six-flags-darien-lake-hoot-n-holler":
    "Junior steel coaster at Six Flags Darien Lake in Darien Center, New York. A small family-friendly layout in the park's kids' area.",
  "six-flags-darien-lake-mind-eraser":
    "Steel inverted coaster at Six Flags Darien Lake in Darien Center, New York, opened 2001. Built by Vekoma using their Suspended Looping Coaster (SLC) model. 110 feet tall, five inversions, top speed 50 mph.",
  "six-flags-darien-lake-predator":
    "Wooden coaster at Six Flags Darien Lake in Darien Center, New York, opened 1990. Designed by Curtis D. Summers and Charles Dinn. 95 feet tall, top speed 50 mph.",
  "six-flags-darien-lake-ride-of-steel":
    "Steel hyper coaster at Six Flags Darien Lake in Darien Center, New York, opened 1999. Built by Intamin — the first of three sister installations (with Six Flags America and Six Flags New England). 208 feet tall, 205-foot drop, top speed 73 mph.",
  "six-flags-darien-lake-viper":
    "Steel sit-down looping coaster at Six Flags Darien Lake in Darien Center, New York, opened 1982. Built by Arrow Dynamics. 121 feet tall, five inversions, top speed 50 mph. At opening, the world's first coaster with five inversions.",
  "six-flags-fiesta-texas-batgirl-coaster-chase":
    "Steel coaster at Six Flags Fiesta Texas in San Antonio, Texas. A compact installation themed to Batgirl in the DC Universe area.",
  "six-flags-fiesta-texas-boomerang-coast-to-coaster":
    "Steel boomerang shuttle coaster at Six Flags Fiesta Texas in San Antonio, Texas. Built by Vekoma. The classic Boomerang layout — sister installation to the dozens of Vekoma Boomerangs operating worldwide.",
  "six-flags-fiesta-texas-poltergeist":
    "Steel indoor launched coaster at Six Flags Fiesta Texas in San Antonio, Texas, opened 1999. Built by Premier Rides. Sister installation to Joker's Jinx at Six Flags America. Indoor twisting layout with four inversions.",
  "six-flags-fiesta-texas-road-runner-express":
    "Steel mine-train family coaster at Six Flags Fiesta Texas in San Antonio, Texas, opened 1992 (as part of the park's opening lineup). A family-friendly mine-train layout themed to Looney Tunes' Road Runner.",
  "six-flags-fiesta-texas-superman-krypton-coaster":
    "Steel floorless coaster at Six Flags Fiesta Texas in San Antonio, Texas, opened 2000. Built by Bolliger & Mabillard. 168 feet tall, six inversions including a 145-foot vertical loop — the world's tallest vertical loop on a floorless coaster. Top speed 70 mph.",
  "six-flags-great-adventure-batman-the-ride":
    "Steel inverted coaster at Six Flags Great Adventure in Jackson, New Jersey, opened 1993. Built by Bolliger & Mabillard. 105 feet tall, five inversions, top speed 50 mph. A clone of the original Batman the Ride at Six Flags Great America (1992).",
  "six-flags-great-adventure-dark-knight":
    "Steel indoor wild-mouse coaster at Six Flags Great Adventure in Jackson, New Jersey, opened 2008. Built by Mack Rides. Themed to The Dark Knight film with extensive indoor show scenes and animatronics.",
  "six-flags-great-adventure-el-toro":
    "Wooden coaster at Six Flags Great Adventure in Jackson, New Jersey, opened 2006. Built by Intamin Plug-and-Play using prefabricated wooden track. 188 feet tall with a 76-degree first drop, top speed 70 mph. Multiple Golden Ticket Award wins for Best Wooden Coaster.",
  "six-flags-great-adventure-great-american-scream-machine":
    "Steel multi-looping coaster that operated at Six Flags Great Adventure from 1989 to 2010. Built by Arrow Dynamics. 173 feet tall, seven inversions, top speed 68 mph. At opening, the world's tallest and fastest looping coaster.",
  "six-flags-great-adventure-green-lantern":
    "Steel stand-up coaster at Six Flags Great Adventure in Jackson, New Jersey, opened 2011 — relocated from Six Flags Kentucky Kingdom where it operated as Chang from 1997 to 2009. Built by Bolliger & Mabillard. 154 feet tall, five inversions, top speed 63 mph.",
  "six-flags-great-adventure-harley-quinn-crazy-train":
    "Steel family coaster at Six Flags Great Adventure in Jackson, New Jersey. A small family-friendly layout themed to Harley Quinn.",
  "six-flags-great-adventure-kingda-ka":
    "Steel hydraulic launch coaster that operated at Six Flags Great Adventure in Jackson, New Jersey, from 2005 to 2024. Built by Intamin. 456 feet tall, top speed 128 mph from a 0–128 launch in 3.5 seconds. The world's tallest roller coaster for its entire 19-year operating run. Closed in 2024 along with several other Six Flags Great Adventure rides.",
  "six-flags-great-adventure-medusa":
    "Steel floorless coaster at Six Flags Great Adventure in Jackson, New Jersey, opened 1999. Built by Bolliger & Mabillard — the world's first floorless coaster. 142 feet tall, seven inversions, top speed 61 mph.",
  "six-flags-great-adventure-nitro":
    "Steel hyper coaster at Six Flags Great Adventure in Jackson, New Jersey, opened 2001. Built by Bolliger & Mabillard. 230 feet tall, 215-foot drop, top speed 80 mph. Best known for its sequence of camelback airtime hills.",
  "six-flags-great-adventure-rolling-thunder-right":
    "Wooden racing coaster that operated at Six Flags Great Adventure in Jackson, New Jersey, from 1979 to 2013. Built by William Cobb. Two parallel tracks raced over a 96-foot lift hill. Top speed 56 mph. Demolished in 2014; replaced by El Diablo flat ride and Cyborg.",
  "six-flags-great-adventure-runaway-mine-train":
    "Steel mine-train coaster at Six Flags Great Adventure in Jackson, New Jersey, opened 1975. Built by Arrow Dynamics — one of the park's original attractions. A family-friendly mine-themed layout.",
  "six-flags-great-adventure-skull-mountain":
    "Steel indoor coaster at Six Flags Great Adventure in Jackson, New Jersey, opened 1996. Built by Intamin. A family-friendly dark coaster experience inside a skull-shaped mountain structure.",
  "six-flags-great-adventure-superman-ultimate-flight":
    "Steel flying coaster at Six Flags Great Adventure in Jackson, New Jersey, opened 2003. Built by Bolliger & Mabillard. 109 feet tall, one inversion (a pretzel loop), top speed 51 mph. Riders fly in face-down position. Sister installation to the Six Flags Over Georgia and Six Flags Great America versions.",
  "six-flags-great-america-american-eagle-red":
    "Wooden racing coaster at Six Flags Great America in Gurnee, Illinois, opened 1981. Designed by Curtis D. Summers and Charles Dinn. 127 feet tall, top speed 66 mph. Two parallel tracks (Red and Blue) race. The Red track of the pair. An American Coaster Enthusiasts Coaster Landmark.",
  "six-flags-great-america-batman-the-ride":
    "Steel inverted coaster at Six Flags Great America in Gurnee, Illinois, opened 1992. Built by Bolliger & Mabillard — the world's first inverted coaster. 105 feet tall, five inversions, top speed 50 mph. The original of countless Batman the Ride clones at Six Flags parks.",
  "six-flags-great-america-demon":
    "Steel multi-looping coaster at Six Flags Great America in Gurnee, Illinois, opened 1976 (as Turn of the Century). Built by Arrow Dynamics. 100 feet tall, four inversions, top speed 45 mph. Originally a single-loop Arrow Looper; expanded to four inversions and rethemed as Demon in 1980.",
  "six-flags-great-america-dj-vu":
    "Steel inverted boomerang shuttle coaster that operated at Six Flags Great America from 2001 to 2007. Built by Vekoma. 196 feet tall, three inversions, top speed 65 mph. Relocated to Six Flags New England as Goliath.",
  "six-flags-great-america-flash-vertical-velocity":
    "Steel impulse coaster at Six Flags Great America in Gurnee, Illinois, opened 2001 as Vertical Velocity. Built by Intamin. 185 feet tall with vertical twisting spikes, top speed 70 mph. Rebranded as Flash: Vertical Velocity in 2023.",
  "six-flags-great-america-iron-wolf":
    "Steel stand-up coaster that operated at Six Flags Great America from 1990 to 2011. Built by Bolliger & Mabillard — the world's first B&M coaster. 100 feet tall, two inversions, top speed 55 mph. Relocated to Six Flags America as Apocalypse in 2012.",
  "six-flags-great-america-ragin-cajun":
    "Steel spinning coaster that operated at Six Flags Great America from 2003 to 2011. Built by Reverchon Industries. Cars rotated freely through a compact wild-mouse-style layout. Originally Pandemonium at Six Flags Magic Mountain; relocated multiple times.",
  "six-flags-great-america-raging-bull":
    "Steel hyper coaster at Six Flags Great America in Gurnee, Illinois, opened 1999. Built by Bolliger & Mabillard. 202 feet tall, top speed 73 mph. One of B&M's earliest hyper coasters, with a twisting layout that includes a unique spiraling first drop.",
  "six-flags-great-america-superman-ultimate-flight":
    "Steel flying coaster at Six Flags Great America in Gurnee, Illinois, opened 2003. Built by Bolliger & Mabillard. Sister installation to the Six Flags Great Adventure and Six Flags Over Georgia versions. 109 feet tall, one inversion, top speed 51 mph.",
  "six-flags-great-america-viper":
    "Wooden coaster at Six Flags Great America in Gurnee, Illinois, opened 1995. Designed by the park's in-house engineering team based on the Coney Island Cyclone. 100 feet tall, top speed 50 mph.",
  "six-flags-great-america-whizzer":
    "Steel coaster at Six Flags Great America in Gurnee, Illinois, opened 1976 (as Willard's Whizzer). Built by Anton Schwarzkopf using his Speedracer / Jumbo Jet model. 70 feet tall, top speed 42 mph. An American Coaster Enthusiasts Coaster Landmark and one of the park's original opening-day attractions.",
  "six-flags-great-escape-alpine-bobsled":
    "Steel bobsled coaster at Six Flags Great Escape in Queensbury, New York, opened 1998 — relocated from Six Flags Great America where it operated from 1984 to 1996. Built by Intamin.",
  "six-flags-great-escape-canyon-blaster":
    "Junior wooden coaster at Six Flags Great Escape in Queensbury, New York. A small family-friendly mine-train-style layout aimed at families.",
  "six-flags-great-escape-comet":
    "Wooden coaster at Six Flags Great Escape in Queensbury, New York, opened 1948 (relocated in 1994 from Crystal Beach Park in Ontario, Canada). Designed by Herbert Schmeck of Philadelphia Toboggan Coasters. 95 feet tall, top speed 50 mph. An American Coaster Enthusiasts Coaster Landmark.",
  "six-flags-great-escape-flashback":
    "Steel boomerang shuttle coaster at Six Flags Great Escape in Queensbury, New York. Built by Vekoma. The classic Boomerang layout.",
  "six-flags-great-escape-frankies-mine-train":
    "Junior steel coaster at Six Flags Great Escape in Queensbury, New York. A small mine-train-style family layout in the children's area.",
  "six-flags-great-escape-steamin-demon":
    "Steel coaster at Six Flags Great Escape in Queensbury, New York, opened 1984. Built by Arrow Dynamics — a corkscrew model with two inversions. ~70 feet tall, top speed 45 mph.",
  "six-flags-magic-mountain-batman-the-ride":
    "Steel inverted coaster at Six Flags Magic Mountain in Valencia, California, opened 1994. Built by Bolliger & Mabillard. A clone of the original Batman the Ride at Six Flags Great America. 105 feet tall, five inversions, top speed 50 mph.",
  "six-flags-magic-mountain-canyon-blaster":
    "Steel family coaster at Six Flags Magic Mountain in Valencia, California. A small mine-train-style family layout in Bugs Bunny World.",
  "six-flags-magic-mountain-colossus-red":
    "Wooden racing coaster that operated at Six Flags Magic Mountain in Valencia, California, from 1978 to 2014. Designed by William Cobb. 125 feet tall, top speed 62 mph. Two parallel tracks. Reprofiled by Rocky Mountain Construction with steel I-Box track and reopened as Twisted Colossus in 2015.",
  "six-flags-magic-mountain-dj-vu":
    "Steel inverted boomerang shuttle coaster that operated at Six Flags Magic Mountain from 2001 to 2011. Built by Vekoma. 196 feet tall, three inversions, top speed 65 mph. Relocated to Six Flags New England as Goliath... no — actually relocated to Silverwood Theme Park in 2013 as Aftershock.",
  "six-flags-magic-mountain-gold-rusher":
    "Steel mine-train coaster at Six Flags Magic Mountain in Valencia, California, opened 1971 — one of the park's original opening-day attractions. Built by Arrow Development. A family-friendly mine-train layout, 53 feet tall.",
  "six-flags-magic-mountain-goliath":
    "Steel hyper coaster at Six Flags Magic Mountain in Valencia, California, opened 2000. Built by Giovanola — one of only a handful of Giovanola coasters in the world. 235 feet tall, 255-foot drop into a tunnel, top speed 85 mph.",
  "six-flags-magic-mountain-great-american-revolution":
    "Steel sit-down looping coaster at Six Flags Magic Mountain in Valencia, California, opened 1976. Built by Anton Schwarzkopf — the world's first modern looping coaster with a clothoid (teardrop-shaped) vertical loop. 113 feet tall, top speed 55 mph. An American Coaster Enthusiasts Coaster Landmark.",
  "six-flags-magic-mountain-ninja":
    "Steel suspended swinging coaster at Six Flags Magic Mountain in Valencia, California, opened 1988. Built by Arrow Dynamics. 80 feet tall, top speed 55 mph. The first Arrow suspended coaster on the West Coast.",
  "six-flags-magic-mountain-psyclone":
    "Wooden coaster that operated at Six Flags Magic Mountain in Valencia, California, from 1991 to 2006. Designed by William Cobb. 95 feet tall, top speed 50 mph. Based on the layout of the Coney Island Cyclone. Demolished in 2007.",
  "six-flags-magic-mountain-riddlers-revenge":
    "Steel stand-up coaster at Six Flags Magic Mountain in Valencia, California, opened 1998. Built by Bolliger & Mabillard. 156 feet tall, six inversions, 4,370 feet long, top speed 65 mph. The tallest, fastest, and longest stand-up coaster in the world.",
  "six-flags-magic-mountain-scream":
    "Steel floorless coaster at Six Flags Magic Mountain in Valencia, California, opened 2003. Built by Bolliger & Mabillard. 150 feet tall, seven inversions, top speed 63 mph. Notable for being built on top of an existing parking lot — the white parking-stripe paint is still visible beneath the track.",
  "six-flags-magic-mountain-superman-escape-from-krypton-right":
    "Steel reverse-launched shuttle coaster at Six Flags Magic Mountain in Valencia, California, opened 1997 as Superman: The Escape — the world's first coaster to break 100 mph. Built by Intamin. 415 feet tall, top speed 104 mph. Modified to launch backward in 2011 and renamed Superman: Escape from Krypton. The right track of two parallel tracks.",
  "six-flags-magic-mountain-tatsu":
    "Steel flying coaster at Six Flags Magic Mountain in Valencia, California, opened 2006. Built by Bolliger & Mabillard. 170 feet tall — the world's tallest flying coaster — four inversions including a pretzel loop, top speed 62 mph.",
  "six-flags-magic-mountain-viper":
    "Steel multi-looping coaster at Six Flags Magic Mountain in Valencia, California, opened 1990. Built by Arrow Dynamics. 188 feet tall, seven inversions, top speed 70 mph. At opening, the world's tallest and fastest looping coaster.",
  "six-flags-magic-mountain-x2":
    "Steel 4D coaster at Six Flags Magic Mountain in Valencia, California, opened 2002 as X (rebuilt and reopened as X2 in 2008). Built by Arrow Dynamics — the world's first 4D coaster with seats that rotate 360 degrees forward and backward independently of the track. 175 feet tall, six inversions, top speed 76 mph.",
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
