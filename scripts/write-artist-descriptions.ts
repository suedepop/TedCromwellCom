import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

/**
 * Apply neutral-encyclopedic artist descriptions in batch.
 * Idempotent: skips any artist that already has a non-empty description
 * unless --force is passed.
 *   --dry-run : preview only
 *   --force   : overwrite existing descriptions
 */

const DESCRIPTIONS: Record<string, string> = {
  "deep-purple":
    "English rock band formed in Hertford in 1968. The Mark I lineup paired Ritchie Blackmore (guitar) and Jon Lord (organ) with Rod Evans (vocals), Nick Simper (bass), and Ian Paice (drums). Often cited alongside Black Sabbath and Led Zeppelin as a foundational hard-rock and proto-heavy-metal act, and once recognized by Guinness as the loudest band in the world (1972).\n\nThe Mark II lineup (1969-1973), with Ian Gillan and Roger Glover replacing Evans and Simper, produced the band's commercial peak — *In Rock* (1970), *Fireball* (1971), *Machine Head* (1972), and the live double LP *Made in Japan* (1972). \"Smoke on the Water\" remains their most-recognized track. Subsequent Mark III (Coverdale/Hughes) and Mark IV (Tommy Bolin) lineups led to a 1976 breakup; the Mark II reunion in 1984 produced *Perfect Strangers*. The band has remained active in some form continuously since.",

  "ramones":
    "American punk rock band formed in Forest Hills, Queens in 1974. Original lineup: Joey Ramone (vocals), Johnny Ramone (guitar), Dee Dee Ramone (bass), Tommy Ramone (drums); all members adopted the surname Ramone. Widely credited with codifying the American punk template — short songs, fast tempos, distorted guitar, minimal solos.\n\nTheir 1976 self-titled debut was recorded in February of that year for $6,400. Subsequent albums *Leave Home* (1977), *Rocket to Russia* (1977), and *Road to Ruin* (1978) refined the formula. The band toured almost continuously through 1996, releasing 14 studio albums total. The original four members all died between 2001 and 2014. Inducted into the Rock and Roll Hall of Fame in 2002.",

  "acdc":
    "Australian hard rock band formed in Sydney in 1973 by brothers Malcolm and Angus Young. After early lineup changes, the classic Bon Scott era (1974-1980) included Phil Rudd (drums) and Cliff Williams (bass). Vocalist Bon Scott died in February 1980; Brian Johnson joined within months.\n\nThe Johnson-era debut, *Back in Black* (1980), has sold an estimated 50 million copies worldwide and is among the best-selling albums of all time. Bon Scott-era highlights include *Highway to Hell* (1979), *Powerage* (1978), and *Let There Be Rock* (1977). Malcolm Young died in 2017; nephew Stevie Young replaced him. Seventeen studio albums released as of 2020's *Power Up*.",

  "iron-maiden":
    "English heavy metal band formed in Leyton, East London in 1975 by bassist Steve Harris. One of the defining acts of the New Wave of British Heavy Metal (NWOBHM). The longtime lineup of Harris, Bruce Dickinson (vocals), Dave Murray and Adrian Smith (guitars), Janick Gers (third guitar, since 1990), and Nicko McBrain (drums) has been remarkably stable since 1990.\n\nThe Bruce Dickinson-fronted 1980s run — *The Number of the Beast* (1982), *Piece of Mind* (1983), *Powerslave* (1984), the live *Live After Death* (1985), *Somewhere in Time* (1986), and *Seventh Son of a Seventh Son* (1988) — established the band as one of the genre's leading acts. Mascot Eddie has appeared on every album cover. Seventeen studio albums released through 2021's *Senjutsu*.",

  "black-sabbath":
    "English heavy metal band formed in Birmingham in 1968 by Tony Iommi (guitar), Geezer Butler (bass), Bill Ward (drums), and Ozzy Osbourne (vocals). Widely credited with inventing heavy metal as a distinct genre.\n\nThe original Osbourne-fronted lineup released eight studio albums between 1970 and 1978 — including *Black Sabbath* (1970), *Paranoid* (1970), and *Master of Reality* (1971). Osbourne was fired in 1979; Ronnie James Dio fronted the band for *Heaven and Hell* (1980) and *Mob Rules* (1981). The band cycled through several singers (Ian Gillan, Glenn Hughes, Tony Martin) through the 1980s and 1990s. The original lineup reunited for *13* (2013), the band's first US #1 album. Final tour wrapped in 2017.",

  "nofx":
    "American punk rock band formed in Los Angeles in 1983 by Fat Mike (Michael Burkett, vocals/bass) and Eric Rea (Eric Melvin, guitar). Drummer Erik Sandin joined in 1983; guitarist El Hefe (Aaron Abeyta) added in 1991. The band released 14 studio albums on Fat Wreck Chords, the independent label Fat Mike co-founded; they never signed to a major.\n\nTheir commercial peak came with *Punk in Drublic* (1994), which sold over a million copies worldwide. Subsequent albums — *So Long and Thanks for All the Shoes* (1997), *The Decline* (1999), *War on Errorism* (2003), *Wolves in Wolves' Clothing* (2006) — sustained the band's underground influence. The band performed their final shows in 2024.",

  "alice-cooper":
    "Both a band (1968-1975) and a solo artist (1975-present). The band Alice Cooper formed in Phoenix, Arizona in 1964 (initially as the Earwigs) with Vincent Furnier (vocals), Glen Buxton (guitar), Michael Bruce (guitar), Dennis Dunaway (bass), and Neal Smith (drums). Furnier eventually adopted the name Alice Cooper as his own.\n\nThe band's commercial peak ran from *Killer* (1971) through *Billion Dollar Babies* (1973), produced by Bob Ezrin. Furnier launched his solo career with *Welcome to My Nightmare* (1975) and continued with theatrical hard-rock releases — *From the Inside* (1978), *Trash* (1989), *The Last Temptation* (1994), and *Brutal Planet* (2000). Theatrical staging — guillotines, snakes, electric chairs — remains his trademark. Alice Cooper (the band) was inducted into the Rock and Roll Hall of Fame in 2011.",

  "judas-priest":
    "English heavy metal band formed in Birmingham in 1969. Singer Rob Halford joined in 1973 and has fronted the band continuously except for a 1992-2003 hiatus. The twin-guitar attack of K.K. Downing and Glenn Tipton (1974-2011) became their defining sound. Critical to the development of heavy metal as a distinct genre and visual identity (leather, studs, motorcycles).\n\nTheir commercial breakthrough came with *British Steel* (1980); subsequent albums *Screaming for Vengeance* (1982), *Defenders of the Faith* (1984), and *Painkiller* (1990) cemented their status. K.K. Downing departed in 2011; Richie Faulkner replaced him. Eighteen studio albums total. Inducted into the Rock and Roll Hall of Fame in 2022.",

  "rush":
    "Canadian power trio formed in Toronto in 1968. The classic lineup of Geddy Lee (bass, vocals, keyboards), Alex Lifeson (guitar), and Neil Peart (drums, lyrics) coalesced in 1974 and remained intact until Peart's retirement in 2015. Peart died in January 2020.\n\nThe band released 19 studio albums, with peaks including *2112* (1976), *A Farewell to Kings* (1977), *Permanent Waves* (1980), *Moving Pictures* (1981, their best-selling), and *Power Windows* (1985). Their progressive-rock approach — odd time signatures, conceptual lyrics, technical proficiency — earned a deeply devoted fanbase. Inducted into the Rock and Roll Hall of Fame in 2013.",

  "they-might-be-giants":
    "American alternative rock duo (later expanded to a full band) formed in Brooklyn, New York in 1982 by John Flansburgh (vocals, guitar) and John Linnell (vocals, accordion, keyboards). Early output, including the *Dial-A-Song* phone-line release mechanism, established a quirky, lyrically dense pop-rock aesthetic. Backing musicians solidified into a full band by *John Henry* (1994).\n\nTheir commercial peak came with *Flood* (1990), which produced the singles \"Birdhouse in Your Soul\" and \"Istanbul (Not Constantinople).\" The band has released 23 studio albums spanning adult and children's records — earning two Grammy Awards for *Here Come the ABCs* (2005) and the *Boss of Me* theme to *Malcolm in the Middle*. Active continuously since 1982.",

  "bad-religion":
    "American punk rock band formed in Los Angeles in 1980. Founding members included Greg Graffin (vocals), Brett Gurewitz (guitar), Jay Bentley (bass), and Jay Ziskrout (drums). Pioneers of melodic hardcore punk; Gurewitz founded Epitaph Records to release the band's debut.\n\nThe band's identity is built around dense, intellectual lyrics (Graffin holds a PhD in zoology), three-part vocal harmonies, and direct political commentary. *Suffer* (1988) is widely cited as a foundational text of the genre. Subsequent peaks: *No Control* (1989), *Against the Grain* (1990), *Generator* (1992), *Recipe for Hate* (1993), and the major-label *Stranger Than Fiction* (1994). Seventeen studio albums total.",

  "aerosmith":
    "American rock band formed in Boston in 1970. Original lineup: Steven Tyler (vocals), Joe Perry (lead guitar), Brad Whitford (rhythm guitar), Tom Hamilton (bass), and Joey Kramer (drums). Initial commercial success came with *Toys in the Attic* (1975) and *Rocks* (1976).\n\nSubstance abuse and lineup tension led to Perry's 1979 departure and a creative slump. The 1984 reunion of the original lineup and 1986 collaboration with Run-DMC on \"Walk This Way\" launched a sustained late-career renaissance: *Permanent Vacation* (1987), *Pump* (1989), and *Get a Grip* (1993) all sold multi-platinum. Inducted into the Rock and Roll Hall of Fame in 2001. Steven Tyler's 2024 vocal injury led to the band's retirement from touring.",

  "rainbow":
    "British-American hard rock band formed in 1975 by guitarist Ritchie Blackmore after his departure from Deep Purple. Multiple lineup changes were a defining feature; vocalists included Ronnie James Dio (1975-1979), Graham Bonnet (1979-1980), and Joe Lynn Turner (1980-1984).\n\nThe Dio era produced the band's most-celebrated work: *Ritchie Blackmore's Rainbow* (1975), *Rising* (1976), and *Long Live Rock 'n' Roll* (1978). The Turner era pivoted toward radio-friendly AOR, producing the band's commercial breakthroughs: *Difficult to Cure* (1981) and *Straight Between the Eyes* (1982). Blackmore disbanded Rainbow in 1984 to rejoin Deep Purple; brief reunions occurred in 1995 and 2015.",

  "kiss":
    "American hard rock band formed in New York City in 1973 by Paul Stanley (rhythm guitar/vocals), Gene Simmons (bass/vocals), Ace Frehley (lead guitar), and Peter Criss (drums). Distinguished by face paint, elaborate costumes, and pyrotechnic stage shows. Each member's persona — the Demon, the Starchild, the Spaceman, the Catman — became an iconic visual identity.\n\nTheir commercial breakthrough came with the live double album *Alive!* (1975). Subsequent peak releases include *Destroyer* (1976) and *Dynasty* (1979). The original lineup splintered through the early 1980s; the band performed without makeup from 1983-1996. The classic four-member lineup reunited in costume from 1996-2002, then reverted to a Stanley/Simmons-led configuration. Inducted into the Rock and Roll Hall of Fame in 2014. Final tour ended December 2023.",

  "van-halen":
    "American hard rock band formed in Pasadena, California in 1972 by brothers Eddie Van Halen (guitar) and Alex Van Halen (drums). Original lineup completed by Michael Anthony (bass) and David Lee Roth (vocals). Their 1978 self-titled debut introduced Eddie's two-handed tapping technique on \"Eruption,\" fundamentally reshaping rock guitar.\n\nThe Roth-era run produced six albums from *Van Halen* (1978) through *1984*. After Roth's 1985 departure, Sammy Hagar fronted the band through four #1 albums: *5150* (1986), *OU812* (1988), *For Unlawful Carnal Knowledge* (1991), and *Balance* (1995). Hagar's exit was followed by Gary Cherone's brief tenure, then a Roth reunion (2007-2020). Eddie Van Halen died in October 2020. Inducted into the Rock and Roll Hall of Fame in 2007.",

  "pennywise":
    "American punk rock band formed in Hermosa Beach, California in 1988. Original lineup: Jim Lindberg (vocals), Fletcher Dragge (guitar), Jason Thirsk (bass), and Byron McMackin (drums). Signed to Epitaph Records with their 1991 self-titled debut. Pioneers of the South Bay skate-punk sound alongside Bad Religion and the Offspring.\n\nKey releases: *Unknown Road* (1993), *About Time* (1995), *Full Circle* (1997). Bassist Jason Thirsk died in 1996; Randy Bradbury replaced him. \"Bro Hymn\" became a signature track and a recurring sports-stadium anthem. Lindberg departed in 2009 (replaced by Zoli Téglás of Ignite) and rejoined in 2012. Thirteen studio albums total.",

  "the-sword":
    "American heavy metal band formed in Austin, Texas in 2003. Lineup: J.D. Cronise (vocals/guitar), Kyle Shutt (guitar), Bryan Richie (bass), with various drummers (Trivett Wingo, Jimmy Vela, Kevin Fender). Distinguished by retro-doom-metal influence and progressive song structures.\n\nFive studio albums between 2006 and 2018: *Age of Winters*, *Gods of the Earth*, *Warp Riders*, *Apocryphon*, *High Country*, and *Used Future*. Toured extensively with Metallica during the *World Magnetic* tour (2008-2010). The band went on indefinite hiatus in 2018 and returned briefly for the *Conquest of Kingdoms* compilation in 2020.",

  "the-who":
    "English rock band formed in London in 1964. Classic lineup: Roger Daltrey (vocals), Pete Townshend (guitar), John Entwistle (bass), and Keith Moon (drums). Among the most influential rock acts of the 1960s and 1970s; pioneered the rock opera (*Tommy*, 1969; *Quadrophenia*, 1973) and Townshend's signature \"windmill\" guitar performance style.\n\nKey albums: *My Generation* (1965), *Tommy* (1969), *Live at Leeds* (1970), *Who's Next* (1971), *Quadrophenia* (1973). Moon died in 1978; the band continued briefly with Kenney Jones before disbanding in 1983. Reunited intermittently through the 1980s-1990s. Entwistle died in 2002. Townshend and Daltrey have toured as The Who since. Inducted into the Rock and Roll Hall of Fame in 1990.",

  "descendents":
    "American punk rock band formed in Manhattan Beach, California in 1977 by Frank Navetta (guitar), Tony Lombardo (bass), and Bill Stevenson (drums). Singer Milo Aukerman joined in 1980, giving the band its longtime visual identity. Pioneers of pop-punk and \"nerdcore\" — short, fast, melodic songs about adolescence, love, and food.\n\nEight studio albums between 1982 and 2021. Aukerman regularly departed for academic pursuits (he holds a PhD in biochemistry); during his absences, the remaining members performed as ALL with various vocalists. Key albums: *Milo Goes to College* (1982), *I Don't Want to Grow Up* (1985), *All* (1987), *Everything Sucks* (1996), *Cool to Be You* (2004), *Hypercaffium Spazzinate* (2016).",

  "led-zeppelin":
    "English rock band formed in London in 1968 by guitarist Jimmy Page after the breakup of the Yardbirds. Lineup: Robert Plant (vocals), Page (guitar), John Paul Jones (bass/keyboards), and John Bonham (drums). Among the most commercially successful and influential rock bands of all time, with sales exceeding 200 million albums.\n\nReleased eight studio albums in eight years: *Led Zeppelin* (1969), *II* (1969), *III* (1970), the untitled fourth album (1971, often called *IV* or *ZoSo*), *Houses of the Holy* (1973), *Physical Graffiti* (1975), *Presence* (1976), and *In Through the Out Door* (1979). Bonham died in September 1980; the band disbanded shortly after. Reunited briefly for the 2007 Ahmet Ertegun Tribute Concert with Bonham's son Jason on drums. Inducted into the Rock and Roll Hall of Fame in 1995.",

  "metallica":
    "American heavy metal band formed in Los Angeles in 1981 by drummer Lars Ulrich and guitarist James Hetfield. Joined by guitarist Kirk Hammett (1983, replacing Dave Mustaine) and bassist Cliff Burton (1982). Foundational to thrash metal alongside Slayer, Megadeth, and Anthrax (the \"Big Four\").\n\nBurton died in a 1986 tour bus accident; replaced by Jason Newsted (1986-2001) and then Robert Trujillo (2003-present). Albums: *Kill 'Em All* (1983), *Ride the Lightning* (1984), *Master of Puppets* (1986), *...And Justice for All* (1988), and the eponymous \"Black Album\" (1991, the band's commercial breakthrough; over 30 million copies sold). Subsequent releases include *Load* (1996), *St. Anger* (2003), *Death Magnetic* (2008), *Hardwired... to Self-Destruct* (2016), and *72 Seasons* (2023). Inducted into the Rock and Roll Hall of Fame in 2009.",

  "slayer":
    "American thrash metal band formed in Huntington Park, California in 1981 by guitarists Kerry King and Jeff Hanneman, vocalist/bassist Tom Araya, and drummer Dave Lombardo. Among the foundational thrash metal bands of the 1980s.\n\nTwelve studio albums between 1983 and 2015. *Reign in Blood* (1986) is widely considered one of the genre's most influential records. Subsequent peaks: *South of Heaven* (1988) and *Seasons in the Abyss* (1990). Hanneman died in 2013 from liver failure; replaced by Gary Holt of Exodus. Final farewell tour concluded in November 2019. The band has reunited briefly for select festival appearances since 2024.",

  "zz-top":
    "American rock trio formed in Houston, Texas in 1969. Lineup of Billy Gibbons (guitar/vocals), Dusty Hill (bass/vocals), and Frank Beard (drums) remained intact for over 50 years until Hill's death in 2021. Distinguished by Texas blues-rock roots and (after 1979) the matching beards of Gibbons and Hill — Beard, ironically, sported only a mustache.\n\nThe 1973 album *Tres Hombres* delivered their first hit (\"La Grange\"). The band's commercial peak came with the synthesizer-heavy *Eliminator* (1983) and *Afterburner* (1985), driven by MTV-rotation videos featuring custom hot rods. Fifteen studio albums total. Inducted into the Rock and Roll Hall of Fame in 2004. Hill was replaced by longtime guitar tech Elwood Francis in 2021.",

  "me-first-and-the-gimme-gimmes":
    "American punk rock cover band formed in San Francisco in 1995. Lineup drawn from members of NOFX (Fat Mike, bass), Lagwagon (Joey Cape, vocals; Dave Raun, drums), and Foo Fighters/No Use for a Name (Chris Shiflett, guitar; Spike Slawson, vocals). Each album covers a single genre or era of pop/standards.\n\nThemed releases include *Have a Ball* (1997, '70s soft rock), *Are a Drag* (1999, Broadway), *Blow in the Wind* (2001, '60s folk-rock), *Take a Break* (2003, R&B), *Love Their Country* (2006, country), and *Are We Not Men? We Are Diva!* (2014). Active intermittently; Slawson has been the band's only constant vocalist.",

  "ozzy-osbourne":
    "English heavy metal vocalist; solo career launched in 1979 after his firing from Black Sabbath. Originally backed by guitarist Randy Rhoads (1979-1982), bassist Bob Daisley, and drummer Lee Kerslake. Rhoads died in a 1982 plane crash; subsequent guitarists include Jake E. Lee, Zakk Wylde (longest tenure), and Gus G.\n\nThirteen studio albums between *Blizzard of Ozz* (1980) and *Patient Number 9* (2022, Grammy-winning). Best-selling solo work includes *Diary of a Madman* (1981), *No More Tears* (1991), and *Ozzmosis* (1995). Founded the Ozzfest touring festival in 1996. The MTV reality show *The Osbournes* (2002-2005) reintroduced him to a mainstream audience. Inducted into the Rock and Roll Hall of Fame as a solo artist in 2024 (Black Sabbath was inducted in 2006). Died July 2025 at age 76.",

  "sick-of-it-all":
    "American hardcore band formed in Queens, New York in 1986 by brothers Lou Koller (vocals) and Pete Koller (guitar). Lineup completed by Armand Majidi (drums) and Craig Setari (bass). Among the longest-running and most stable acts in hardcore; the four members have been consistent since 1991.\n\nTwelve studio albums starting with *Blood, Sweat and No Tears* (1989). Mainstream-era major label tenure on East West produced *Scratch the Surface* (1994) and *Built to Last* (1997). Returned to independent labels for the rest of their catalog. Continuously active, regularly touring.",

  "bit-brigade":
    "American instrumental band based in Athens, Georgia. Performs the soundtracks of vintage NES, SNES, and Sega Genesis video games while a player completes a real-time speedrun of the corresponding game. Performances have included full-game runs of *The Legend of Zelda*, *Mega Man 2*, *Mega Man 3*, *Castlevania*, *Contra*, *Metroid*, and *DuckTales*.\n\nThe instrumental band — typically a five- or six-piece — releases studio recordings of these performances, with a soundtrack album dedicated to each game. The format combines progressive-rock musicianship with the unpredictability of live speedrunning.",

  "bon-jovi":
    "American rock band formed in Sayreville, New Jersey in 1983 by vocalist Jon Bon Jovi. Classic lineup completed by Richie Sambora (lead guitar, 1983-2013), David Bryan (keyboards), Tico Torres (drums), and Alec John Such (bass, 1983-1994).\n\nTheir breakthrough came with *Slippery When Wet* (1986), the first hard-rock album to spawn three top-10 singles (\"You Give Love a Bad Name,\" \"Livin' on a Prayer,\" \"Wanted Dead or Alive\"). Subsequent peaks: *New Jersey* (1988), *Keep the Faith* (1992), and *These Days* (1995). Sambora left in 2013; replaced by Phil X. Inducted into the Rock and Roll Hall of Fame in 2018. Sixteen studio albums total.",

  "deftones":
    "American alternative metal band formed in Sacramento, California in 1988 by vocalist Chino Moreno, guitarist Stephen Carpenter, bassist Chi Cheng, and drummer Abe Cunningham. Frank Delgado joined as turntablist/keyboardist in 1999. Often associated with the late-1990s nu-metal wave but typically distinguished by atmospheric arrangements and Moreno's range across screaming and melodic vocals.\n\nCheng was injured in a 2008 car accident, fell into a coma, and died in 2013. Sergio Vega filled in until 2021; Fred Sablan currently handles bass duties. Ten studio albums including *White Pony* (2000), *Diamond Eyes* (2010), and *Ohms* (2020). Continuously active.",

  "groovie-ghoulies":
    "American pop-punk band formed in Sacramento, California in 1986 by Kepi Ghoulie (vocals, bass) and Roach (guitar). Drummer Wendy Powell joined in 1996. Distinguished by horror-movie themes, '60s pop melodies, and Ramones-influenced song structures.\n\nEight studio albums between 1989 and 2007 — including *Born in the Basement* (1994), *Re-Animation Festival* (1997), *Travels with My Amp* (2000), and *Go! Stories* (2002). Released primarily on Lookout! Records during the label's 1990s-2000s heyday. The band dissolved in 2007. Kepi Ghoulie continues as a solo artist.",

  "huey-lewis-and-the-news":
    "American pop rock band formed in San Francisco in 1979 by vocalist Huey Lewis (Hugh Cregg III). Lineup of Lewis, guitarists Chris Hayes and Johnny Colla, bassist Mario Cipollina, keyboardist Sean Hopper, and drummer Bill Gibson stayed largely intact for decades.\n\nThe 1983 album *Sports* sold over 7 million copies in the US and produced four top-10 singles (\"Heart and Soul,\" \"I Want a New Drug,\" \"The Heart of Rock & Roll,\" \"If This Is It\"). \"The Power of Love\" from *Back to the Future* (1985) was their first #1. *Fore!* (1986) continued the commercial run with \"Stuck with You\" and \"Hip to Be Square.\" Lewis revealed Ménière's disease in 2018, ending touring. Eleven studio albums total.",

  "rancid":
    "American punk rock band formed in Berkeley, California in 1991 by former Operation Ivy members Tim Armstrong (vocals/guitar) and Matt Freeman (bass). Lars Frederiksen (vocals/guitar) joined in 1993; Branden Steineckert replaced original drummer Brett Reed in 2006.\n\nTheir breakthrough came with *...And Out Come the Wolves* (1995), which produced \"Time Bomb,\" \"Ruby Soho,\" and \"Roots Radicals.\" Other notable releases include *Let's Go* (1994), *Life Won't Wait* (1998), and *Indestructible* (2003). Released primarily on Hellcat Records (Tim Armstrong's Epitaph imprint). Ten studio albums total.",

  "the-beatles":
    "English rock band formed in Liverpool in 1960. Final lineup: John Lennon (vocals/guitar), Paul McCartney (vocals/bass), George Harrison (vocals/lead guitar), and Ringo Starr (drums, joined 1962, replacing Pete Best). The most commercially successful and culturally influential band in popular music history; estimated sales exceed 600 million units worldwide.\n\nActive 1960-1970. Released 12 studio albums on Parlophone/Apple, plus singles, EPs, and posthumous compilations. The band dissolved in April 1970 amid creative and personal tensions. Lennon was murdered in December 1980; Harrison died of cancer in November 2001. The 2023 release \"Now and Then,\" reconstructed using Lennon vocals and AI separation technology, became the band's first new single in over 25 years.",

  "the-blasters":
    "American roots-rock band formed in Downey, California in 1979 by brothers Phil Alvin (vocals) and Dave Alvin (guitar). Lineup completed by John Bazz (bass), Bill Bateman (drums), and saxophonist Lee Allen. Distinguished by their fusion of rockabilly, blues, country, R&B, and punk-era energy — central to the Los Angeles \"American\" or \"rebel rock\" scene alongside X and Los Lobos.\n\nThe band's classic albums *American Music* (1980), *The Blasters* (1981), *Non Fiction* (1983), and *Hard Line* (1985) earned critical acclaim despite limited commercial success. Dave Alvin departed in 1986 for a solo career; the band has continued in various lineups. Reunited in 2003 for *Trouble Bound* and have toured intermittently since.",

  "the-cult":
    "British rock band formed in Bradford in 1983, evolving from frontman Ian Astbury's earlier group Southern Death Cult. Lineup centered on Astbury (vocals) and guitarist Billy Duffy. Multiple bassists and drummers across the years.\n\nThe band's style shifted from gothic post-punk on *Dreamtime* (1984) to anthemic hard rock on *Love* (1985) and *Electric* (1987, produced by Rick Rubin). *Sonic Temple* (1989) became their commercial peak. Dissolved in 1995 after *The Cult* (1994); reformed in 1999. Ten studio albums total. Astbury also briefly fronted the surviving members of the Doors in the early 2000s.",

  "the-dickies":
    "American punk band formed in San Fernando Valley, California in 1977 by guitarist Stan Lee and vocalist Leonard Graves Phillips. Notable for their rapid tempos, bubblegum-pop melodies, and a steady stream of cover songs (including the *Banana Splits* theme, Black Sabbath's \"Paranoid,\" and the *Killer Klowns from Outer Space* theme).\n\nTheir 1979 debut *The Incredible Shrinking Dickies* and 1979's *Dawn of the Dickies* defined the formula. Active intermittently across five decades, with recurring lineup changes around the Lee/Phillips core. Eight studio albums plus EPs and singles. Phillips died in 2024.",

  "the-mighty-mighty-bosstones":
    "American ska-punk band formed in Boston in 1983. Long-running lineup centered on vocalist Dicky Barrett, bassist Joe Gittleman, and saxophonist Tim \"Johnny Vegas\" Burton. Pioneers of \"ska-core\" — the fusion of ska's brass and offbeat rhythms with hardcore punk's tempo and aggression.\n\nTheir commercial peak came with *Let's Face It* (1997), which produced the single \"The Impression That I Get\" (top-30 in the US). Subsequent releases include *Pay Attention* (2000), *A Jackknife to a Swan* (2002), and *Pin Points and Gin Joints* (2009). The band dissolved in January 2022.",

  "the-queers":
    "American pop-punk band formed in Portsmouth, New Hampshire in 1981 by vocalist/guitarist Joe Queer (Joe King). Style draws heavily from the Ramones, '60s girl groups, and the Beach Boys.\n\nActive for over four decades with continuously rotating lineups. Best-known releases include *Grow Up* (1990), *Love Songs for the Retarded* (1993), *Don't Back Down* (1996), and *Punk Rock Confidential* (1998). Released on Lookout!, Hopeless, and Asian Man Records. Twelve studio albums total. King is the only continuous member.",

  "beastie-boys":
    "American hip-hop group formed in New York City in 1979 as a hardcore punk band, transitioning to hip-hop in 1983-1984. Final lineup: Mike D (Michael Diamond), Ad-Rock (Adam Horovitz), and MCA (Adam Yauch). The first commercially successful hip-hop group with three white MCs.\n\n*Licensed to Ill* (1986) was the first rap album to reach #1 on the Billboard 200. The pivot to sample-heavy production on *Paul's Boutique* (1989) was a critical landmark; subsequent albums *Check Your Head* (1992), *Ill Communication* (1994), and *Hello Nasty* (1998) cemented their status as rap-rock fusion pioneers. MCA died of cancer in 2012, ending the group. Inducted into the Rock and Roll Hall of Fame in 2012.",

  "bruce-springsteen":
    "American rock musician born September 23, 1949, in Long Branch, New Jersey. Solo artist and longtime leader of the E Street Band (Garry Tallent, Max Weinberg, Roy Bittan, Steven Van Zandt, Nils Lofgren, Patti Scialfa, and the late Clarence Clemons and Danny Federici).\n\nReleased 21 studio albums between *Greetings from Asbury Park, N.J.* (1973) and *Letter to You* (2020). Commercial breakthrough came with *Born to Run* (1975); commercial peak with *Born in the U.S.A.* (1984), the best-selling album of his career (over 30 million copies). Other key works include *Darkness on the Edge of Town* (1978), *The River* (1980), *Nebraska* (1982), *Tunnel of Love* (1987), *The Rising* (2002), and *Wrecking Ball* (2012). Inducted into the Rock and Roll Hall of Fame in 1999.",

  "chicago":
    "American rock band formed in Chicago, Illinois in 1967 (originally as Chicago Transit Authority). Best known for their fusion of rock, jazz, R&B, and pop with prominent horns. Lineup has included Robert Lamm (keyboards/vocals), Peter Cetera (bass/vocals, 1967-1985), Terry Kath (guitar, died 1978), and a long-running brass section (Lee Loughnane, James Pankow, Walter Parazaider).\n\nReleased 38 studio albums. Their early commercial peak ran from *Chicago II* (1970) through *Chicago X* (1976), including hits \"25 or 6 to 4,\" \"Saturday in the Park,\" and \"If You Leave Me Now.\" Cetera-led ballads dominated the 1980s — \"Hard to Say I'm Sorry,\" \"You're the Inspiration,\" \"Look Away.\" Inducted into the Rock and Roll Hall of Fame in 2016. Continuously touring since 1967.",

  "def-leppard":
    "English hard rock band formed in Sheffield in 1977. Classic lineup: Joe Elliott (vocals), Steve Clark and Phil Collen (guitars), Rick Savage (bass), and Rick Allen (drums). Allen continued playing after losing his left arm in a 1984 car accident, using a custom electronic kit.\n\nProducer Mutt Lange shaped their commercial peak: *High 'n' Dry* (1981), *Pyromania* (1983, 10 million US sales), *Hysteria* (1987, 12 million US sales). Steve Clark died in 1991 of an accidental overdose; Vivian Campbell joined in 1992. Twelve studio albums total. Inducted into the Rock and Roll Hall of Fame in 2019.",

  "dokken":
    "American hard rock band formed in Los Angeles in 1976. Long-running creative tension between vocalist Don Dokken and guitarist George Lynch defined the band's classic-era sound. Lineup also included Jeff Pilson (bass) and Mick Brown (drums).\n\nCommercial peak came with *Tooth and Nail* (1984), *Under Lock and Key* (1985), and *Back for the Attack* (1987). Lynch left in 1988; the band dissolved and reunited several times, with Lynch in and out across various reunions. Twelve studio albums total. Don Dokken has fronted the band almost continuously since the 1990s, with Lynch operating the side project Lynch Mob.",

  "duran-duran":
    "English new wave band formed in Birmingham in 1978. Classic lineup: Simon Le Bon (vocals), Nick Rhodes (keyboards), John Taylor (bass), Andy Taylor (guitar), and Roger Taylor (drums). Pioneers of MTV-era visual pop and the \"New Romantic\" movement.\n\nCommercial peak came with *Rio* (1982) and *Seven and the Ragged Tiger* (1983), producing singles \"Hungry Like the Wolf,\" \"Rio,\" \"Save a Prayer,\" and \"Union of the Snake.\" After the original lineup splintered in 1985 (with Andy and Roger Taylor branching to the Power Station and Arcadia side projects), the band continued in various configurations. Sixteen studio albums total. Inducted into the Rock and Roll Hall of Fame in 2022.",

  "elvis-costello-and-the-attractions":
    "English rock band fronted by Elvis Costello (born Declan MacManus, 1954). The Attractions — Steve Nieve (keyboards), Bruce Thomas (bass), and Pete Thomas (drums) — backed Costello from 1977 to 1986, returning intermittently for later projects.\n\nCostello's first three albums with the Attractions — *This Year's Model* (1978), *Armed Forces* (1979), and *Get Happy!!* (1980) — are widely considered foundational to British new wave songwriting. The partnership produced 11 studio albums; the relationship between Costello and bassist Bruce Thomas eventually became too strained to continue. Costello has since released over 30 solo and collaborative albums in styles ranging from country to chamber pop to opera.",

  "ho":
    "American hardcore band formed in New York City in 1995 by Toby Morse (vocals), Todd Morse (guitar), Adam Blake (bass), and Eric Rice (drums). Toby Morse had previously worked as a roadie for Sick of It All; the band emerged from the same NYHC scene.\n\nBest known for melodic hardcore with positive, \"youth crew\"-influenced lyrical themes — drug-free messaging is a recurring focus. Six studio albums between 1996 and 2015, including *F.T.T.W.* (1999) and *Go* (2001). Continuously active despite long gaps between releases.",

  "hepcat":
    "American ska band formed in Los Angeles in 1989. Distinguished by their adherence to traditional Jamaican ska and rocksteady styles rather than the punk-influenced \"third-wave\" sound dominant in the US during the same era. Lineup includes vocalists Greg Lee and Alex Désert plus a horns-heavy backing band.\n\nFive studio albums between 1993 and 2016, including *Out of Nowhere* (1993), *Scientific* (1996), *Right on Time* (1998), and *Push 'n Shove* (2000). Toured extensively with the Hellcat Records roster (Rancid, the Slackers, the Aggrolites). Désert is also a working actor (the *High Fidelity* TV series, *Becker*).",

  "less-than-jake":
    "American ska-punk band formed in Gainesville, Florida in 1992. Long-running lineup of Chris DeMakes (vocals/guitar), Roger Lima (vocals/bass), Vinnie Fiorello (drums, 1992-2018), JR Wasilewski (saxophone), and Buddy Schaub (trombone). One of the central acts of late-1990s third-wave ska.\n\nTwelve studio albums. Their breakthrough came with *Losing Streak* (1996) and *Hello Rockview* (1998). Subsequent peaks include *Borders & Boundaries* (2000) and *Anthem* (2003). Released primarily on Capitol, Asian Man, Sire, and the band's own Sleep It Off Records. Fiorello departed in 2018; replaced by Matt Yonker.",

  "madonna":
    "American singer, songwriter, actress, and entrepreneur (Madonna Louise Ciccone, born August 16, 1958, in Bay City, Michigan). One of the best-selling recording artists of all time according to multiple industry tallies (Guinness, Billboard).\n\nReleased 14 studio albums starting with *Madonna* (1983). Commercial peak years included *Like a Virgin* (1984), *True Blue* (1986), *Like a Prayer* (1989), *Erotica* (1992), and *Ray of Light* (1998). Visual reinvention has been a defining feature of her career — each album cycle accompanied by a distinct aesthetic. Inducted into the Rock and Roll Hall of Fame in 2008.",
};

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const force = process.argv.includes("--force");
  const { containers } = await import("../lib/cosmos");
  const { getStoredArtist } = await import("../lib/artists");

  let written = 0;
  let skipped = 0;
  let missing = 0;

  for (const [slug, description] of Object.entries(DESCRIPTIONS)) {
    const existing = await getStoredArtist(slug);
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
    await containers.artists.item(slug, slug).replace(updated);
    console.log(`✓ ${slug}: ${description.length} chars`);
    written += 1;
  }

  console.log(`\nDone. written=${written} skipped=${skipped} missing=${missing}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
