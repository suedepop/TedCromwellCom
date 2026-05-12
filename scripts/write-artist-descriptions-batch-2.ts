import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

const DESCRIPTIONS: Record<string, string> = {
  "mr-bungle":
    "American experimental rock band formed in Eureka, California in 1985 by vocalist Mike Patton (later of Faith No More), guitarist Trey Spruance, and saxophonist Bär McKinnon, with bassist Trevor Dunn and drummer Danny Heifetz. Known for genre-collision compositions spanning ska, jazz, klezmer, death metal, surf, and lounge.\n\nThree studio albums during the original run: the self-titled debut (1991), *Disco Volante* (1995), and *California* (1999). The band reunited in 2020 with a lineup including Anthrax's Scott Ian and Slayer's Dave Lombardo to re-record the band's 1986 thrash-metal demo as *The Raging Wrath of the Easter Bunny* (2020).",

  "reverend-horton-heat":
    "American psychobilly trio formed in Dallas, Texas in 1985. Lineup of Jim Heath (vocals/guitar, the \"Reverend\"), Jimbo Wallace (bass), and various drummers — most notably Scott Churilla (1995-2013) and Arjuna \"RJ\" Contreras (2017-present). The band's sound fuses rockabilly, surf, punk, and country.\n\nTwelve studio albums on labels including Sub Pop, Interscope, and Yep Roc — among them *Smoke 'em If You Got 'em* (1991), *Liquor in the Front* (1994), *Lucky 7* (2002), and *Whole New Life* (2018). The band has toured continuously since its formation.",

  "robert-gordon":
    "American singer (1947-2022) associated with the late-1970s rockabilly revival. After fronting NYC punk band Tuff Darts, he launched a solo career in 1977 with a self-titled album backed by guitar legend Link Wray.\n\nHis RCA Records run (1977-1981) produced five solo albums, including *Fresh Fish Special* (1978), *Rock Billy Boogie* (1979), and *Are You Gonna Be the One* (1981). Guitarist Chris Spedding replaced Wray for the later albums. Gordon's revivalist approach was an influence on the early-'80s rockabilly scene (Stray Cats, the Blasters).",

  "rusted-root":
    "American jam band formed in Pittsburgh, Pennsylvania in 1990. Co-founders Michael Glabicki (vocals/guitar) and John Buynak (percussion/woodwinds) anchored a multi-instrumental lineup mixing folk, world music, and rock.\n\nTheir second album *When I Woke* (1994) sold over 3 million copies on the strength of \"Send Me On My Way,\" later featured in films like *Matilda* and *Ice Age*. Subsequent releases — *Remember* (1996), *Rusted Root* (1998), *Welcome to My Party* (2002), *The Movement* (2012) — did not match the commercial peak. The band has been on hiatus since 2017.",

  "stray-cats":
    "American rockabilly revival trio formed in Massapequa, New York in 1979 by Brian Setzer (vocals/guitar), Lee Rocker (Leon Drucker, bass), and Slim Jim Phantom (Jim McDonnell, drums). After early rejection in the US, the band relocated to London in 1980 and broke through on the UK rockabilly revival scene.\n\nTheir first two UK albums were repackaged for the US as *Built for Speed* (1982), which produced \"Rock This Town\" and \"Stray Cat Strut.\" The band split in 1984 after *Rant n' Rave with the Stray Cats* (1983). They have reunited multiple times since; Setzer has continued in his Brian Setzer Orchestra and as a solo artist.",

  "the-cars":
    "American new wave band formed in Boston in 1976. Lineup: Ric Ocasek (vocals/rhythm guitar), Benjamin Orr (vocals/bass), Elliot Easton (lead guitar), Greg Hawkes (keyboards), and David Robinson (drums). Pioneers of merging power-pop hooks with synthesizer-driven new wave production.\n\nReleased six studio albums between 1978 and 1987, including the self-titled debut (1978), *Candy-O* (1979), *Shake It Up* (1981), and *Heartbeat City* (1984). The band dissolved in 1988. Orr died in 2000. The surviving members reunited (with Todd Rundgren replacing Orr on vocals) as the New Cars and later released *Move Like This* (2011) as the Cars. Ocasek died in 2019. Inducted into the Rock and Roll Hall of Fame in 2018.",

  "the-clash":
    "English rock band formed in London in 1976. Classic lineup: Joe Strummer (vocals/rhythm guitar), Mick Jones (lead guitar/vocals), Paul Simonon (bass), and Topper Headon (drums, 1977-1982). Among the most acclaimed bands of the original British punk era; their fusion of punk, reggae, dub, ska, and rockabilly broadened the genre's musical palette.\n\nSix studio albums in eight years: *The Clash* (1977), *Give 'Em Enough Rope* (1978), the double *London Calling* (1979), the triple *Sandinista!* (1980), *Combat Rock* (1982), and *Cut the Crap* (1985). Internal conflicts and lineup changes — Headon out in 1982, Jones out in 1983 — fractured the band. Strummer died in 2002. Inducted into the Rock and Roll Hall of Fame in 2003.",

  "the-mr-t-experience":
    "American pop-punk band formed in Berkeley, California in 1985 by Dr. Frank (Frank Portman, vocals/guitar). Long associated with Lookout! Records during the label's 1990s heyday alongside Green Day, Operation Ivy, and Screeching Weasel.\n\nTwelve studio albums between 1986 and 2020. Best-known releases include *Our Bodies, Our Selves* (1993), *Love Is Dead* (1996), and *Revenge Is Sweet, and So Are You* (1997). Portman has been the band's only continuous member and is also a young-adult novelist (*King Dork*, 2006).",

  "weezer":
    "American alternative rock band formed in Los Angeles in 1992. Founding lineup: Rivers Cuomo (vocals/guitar), Patrick Wilson (drums), Matt Sharp (bass), and Jason Cropper (guitar, replaced by Brian Bell before the debut). Sharp departed in 1998; Scott Shriner replaced him in 2001.\n\nTheir 1994 self-titled debut (the \"Blue Album,\" produced by the Cars' Ric Ocasek) sold over 3 million copies on the strength of singles \"Buddy Holly,\" \"Undone — The Sweater Song,\" and \"Say It Ain't So.\" Subsequent releases include *Pinkerton* (1996), the second self-titled \"Green Album\" (2001), and a long, prolific catalog through *SZNZ: Winter* (2022). Sixteen studio albums total.",

  "x":
    "American punk rock band formed in Los Angeles in 1977. Lineup: Exene Cervenka (vocals), John Doe (vocals/bass), Billy Zoom (guitar), and D.J. Bonebrake (drums). One of the foundational LA punk acts; distinguished by Cervenka and Doe's interlocking vocal harmonies and Zoom's rockabilly-influenced guitar.\n\nThe Doors' Ray Manzarek produced the band's first four albums: *Los Angeles* (1980), *Wild Gift* (1981), *Under the Big Black Sun* (1982), and *More Fun in the New World* (1983). Zoom left in 1985; the band continued through the 1990s with various guitarists before the original lineup reunited in 1998. The original four-piece released *Alphabetland* (2020) and *Smoke & Fiction* (2024) — the latter described as their final album.",

  "zao":
    "American Christian metalcore band formed in Parkersburg, West Virginia in 1993. Long history of lineup changes — guitarist Scott Mellinger and drummer Jeff Gretz are the longest-serving members. Vocalist Daniel Weyandt joined in 1998 and has been the band's most identifiable voice since.\n\nNotable releases include *Where Blood and Fire Bring Rest* (1998), *Liberate Te Ex Inferis* (1999), the self-titled 2001 album, *Awake?* (2009), and *The Crimson Corridor* (2021). Twelve studio albums total; active in some form since 1993.",

  "all":
    "American punk rock band formed in Lomita, California in 1987 by the surviving members of Descendents — Bill Stevenson (drums), Karl Alvarez (bass), and Stephen Egerton (guitar) — after vocalist Milo Aukerman returned to school. The band has cycled through three primary vocalists: Dave Smalley (1987-1988), Scott Reynolds (1988-1993), and Chad Price (1993-2000).\n\nEight studio albums between 1988 and 2000, including *Allroy's Revenge* (1988), *Allroy Saves* (1990), *Mass Nerder* (1998), and *Problematic* (2000). The band shares members and management with Descendents and frequently tours alongside them. ALL has not released a studio album since 2000.",

  "boston":
    "American rock band formed in Boston (the city) in 1976. Founder Tom Scholz wrote and produced most of the material in his home studio; the recording lineup typically expanded for live performance. Vocalist Brad Delp was the band's most-identifiable voice from 1976 until his death in 2007.\n\nTheir 1976 self-titled debut sold over 17 million copies, making it one of the best-selling debuts in US history. Subsequent releases include *Don't Look Back* (1978), *Third Stage* (1986, including \"Amanda\"), *Walk On* (1994), and *Life, Love & Hope* (2013). Six studio albums in nearly 40 years — Scholz's perfectionism dictates extended gaps between releases.",

  "cheap-trick":
    "American rock band formed in Rockford, Illinois in 1973. Classic lineup: Robin Zander (vocals), Rick Nielsen (guitar), Tom Petersson (bass), and Bun E. Carlos (drums). Nielsen and Petersson have been continuous since the band's formation; Carlos's regular touring ended in 2010, replaced by Nielsen's son Daxx.\n\nTheir 1979 live album *Cheap Trick at Budokan* — recorded in Tokyo, originally released as a Japan-only import that became a US smash — turned the band into international stars and produced their breakthrough single \"I Want You to Want Me.\" Twenty studio albums total. Inducted into the Rock and Roll Hall of Fame in 2016.",

  "circle-jerks":
    "American hardcore punk band formed in Los Angeles in 1979 by vocalist Keith Morris (formerly of Black Flag) and guitarist Greg Hetson (later of Bad Religion). Foundational to the early Los Angeles hardcore scene alongside Black Flag, the Germs, and X.\n\nSix studio albums between 1980 and 1995, including *Group Sex* (1980), *Wild in the Streets* (1982), and *Wonderful* (1985). The band broke up in 1995; reformed in 2001 and again in 2019. Active intermittently into the 2020s.",

  "clutch":
    "American rock band formed in Germantown, Maryland in 1991. Stable lineup of Neil Fallon (vocals), Tim Sult (guitar), Dan Maines (bass), and Jean-Paul Gaster (drums) has been intact since the band's formation — exceptionally rare in rock.\n\nThirteen studio albums between 1993 and 2022. Key releases include the self-titled second album (1995), *Blast Tyrant* (2004), *From Beale Street to Oblivion* (2007), *Earth Rocker* (2013), and *Psychic Warfare* (2015). Released primarily on the band's own Weathermaker Music label since 2008.",

  "david-bowie":
    "English musician (1947-2016) widely considered one of the most influential artists in popular music history. Born David Robert Jones in Brixton, London; adopted the stage name Bowie in 1965 to avoid confusion with the Monkees' Davy Jones.\n\nReleased 27 studio albums between 1967 and 2016. Distinguished by persistent reinvention — Ziggy Stardust, the Thin White Duke, the Berlin Trilogy ambient phase, the *Let's Dance* (1983) commercial peak, the experimental late-period *Outside* (1995) and *Earthling* (1997). Final album *Blackstar* (2016) was released two days before his death from cancer. Inducted into the Rock and Roll Hall of Fame in 1996.",

  "debbie-gibson":
    "American pop singer-songwriter born August 31, 1970, in Brooklyn, New York. At 16, became the youngest artist ever to write, produce, and perform a Billboard #1 single (\"Foolish Beat,\" 1988).\n\nReleased ten studio albums between *Out of the Blue* (1987) and *The Body Remembers* (2021). Commercial peak years 1987-1989 produced the singles \"Only in My Dreams,\" \"Shake Your Love,\" \"Out of the Blue,\" \"Foolish Beat,\" \"Lost in Your Eyes,\" and \"Electric Youth.\" After the peak, transitioned to Broadway (*Les Misérables*, *Beauty and the Beast*, *Cabaret*) and television. Continues to record and tour.",

  "dwarves":
    "American hardcore punk band formed in Highland Park, Illinois in 1983 (originally as Suburban Nightmare). Vocalist Blag Dahlia (Paul Cafaro) has been the band's only continuous member. The band relocated to San Francisco in the late 1980s and has been associated with the West Coast scuzz-punk scene since.\n\nTwelve studio albums starting with *Horror Stories* (1986). Best-known releases include *Blood Guts & Pussy* (1990) and *Sugarfix* (1993), both released on Sub Pop. The band is also known for provocative stage shows and album artwork. Active continuously.",

  "electric-light-orchestra":
    "English rock band formed in Birmingham in 1970 by Jeff Lynne, Roy Wood, and Bev Bevan. Wood departed in 1972; Lynne assumed primary creative control. The band's signature sound combined Beatles-influenced melody, classical strings, and emerging synthesizer technology.\n\nThirteen studio albums under the original ELO banner between 1971 and 1986. Commercial peak releases included *A New World Record* (1976), *Out of the Blue* (1977, a double LP), *Discovery* (1979), and *Time* (1981). After a long hiatus, Lynne revived the project as Jeff Lynne's ELO starting with *Zoom* (2001). Inducted into the Rock and Roll Hall of Fame in 2017.",

  "elvis-costello":
    "English singer-songwriter born Declan MacManus in 1954. Solo career as a working artist since 1977; one of the most prolific and stylistically restless songwriters of the post-punk era. Frequently performs with the Attractions (1977-1986) or the Imposters (2002-present).\n\nReleased over 30 studio albums spanning new wave (*My Aim Is True*, 1977; *This Year's Model*, 1978), country (*Almost Blue*, 1981), orchestral pop (*North*, 2003), and collaborations across genres — including with Burt Bacharach (*Painted from Memory*, 1998), Allen Toussaint (*The River in Reverse*, 2006), and the Roots (*Wise Up Ghost*, 2013). Inducted into the Rock and Roll Hall of Fame in 2003.",

  "face-to-face":
    "American punk rock band formed in Victorville, California in 1991. Long-running lineup centered on vocalist/guitarist Trever Keith. Style draws from melodic hardcore, post-hardcore, and pop-punk.\n\nNine studio albums between 1992 and 2024. Best-known releases include *Don't Turn Away* (1992), *Big Choice* (1995), and the self-titled fourth album (1996, featuring \"Disconnected\"). After a 2004 breakup, the band reunited in 2008 and has remained active since.",

  "fishbone":
    "American rock band formed in Los Angeles in 1979. Long-running lineup centered on vocalist Angelo Moore and bassist Norwood Fisher. Genre-fluid sound combining ska, punk, funk, metal, and soul; a foundational influence on subsequent ska-punk, rap-rock, and alternative-rock acts.\n\nReleased ten studio albums starting with *In Your Face* (1986). Critical peak: *Truth and Soul* (1988) and *The Reality of My Surroundings* (1991). The 2010 documentary *Everyday Sunshine: The Story of Fishbone* chronicled the band's history and influence. Continuously active.",

  "go-gos":
    "American rock band formed in Los Angeles in 1978. Lineup: Belinda Carlisle (vocals), Charlotte Caffey (lead guitar/keyboards), Jane Wiedlin (rhythm guitar/vocals), Kathy Valentine (bass, joined 1981), and Gina Schock (drums). The first all-female band who wrote and performed their own songs to reach #1 on the Billboard 200.\n\nThe debut *Beauty and the Beat* (1981) topped the US chart for six weeks. Subsequent releases: *Vacation* (1982), *Talk Show* (1984), and the reunion album *God Bless the Go-Go's* (2001). The band disbanded in 1985 and has reunited periodically since. Inducted into the Rock and Roll Hall of Fame in 2021.",

  "goldfinger":
    "American ska-punk band formed in Los Angeles in 1994. Founded by vocalist/guitarist John Feldmann. Long-running lineup also included Charlie Paulson (guitar) and Darrin Pfeiffer (drums). Active continuously, though largely as a Feldmann vehicle in later years.\n\nSeven studio albums starting with the self-titled debut (1996). Best-known singles include \"Here in Your Bedroom\" and \"Mable\" from the debut, and \"99 Red Balloons\" (Nena cover) from *Stomping Ground* (2000). Feldmann transitioned to a high-profile production and A&R career (Blink-182, 5 Seconds of Summer, the Used).",

  "green-day":
    "American rock band formed in East Bay, California in 1986. Original lineup: Billie Joe Armstrong (vocals/guitar), Mike Dirnt (bass/vocals), and John Kiffmeyer (drums). Drummer Tré Cool replaced Kiffmeyer in 1990. Initially associated with the Berkeley Lookout! Records scene before signing to Reprise.\n\nThe major-label debut *Dookie* (1994) sold over 20 million copies worldwide and brought punk rock to mainstream radio. Their concept album *American Idiot* (2004) revitalized the band's commercial profile and spawned a Broadway musical. Fifteen studio albums total. Inducted into the Rock and Roll Hall of Fame in 2015.",

  "juliana-hatfield":
    "American singer-songwriter born July 27, 1967, in Wiscasset, Maine. First gained attention as a member of the Blake Babies (1986-1991), later with the Juliana Hatfield Three (1992-1995), and as a solo artist since 1992.\n\nReleased over 20 solo studio albums and EPs. Best-known releases: *Hey Babe* (1992), *Become What You Are* (1993, as the Juliana Hatfield Three), and *Bed* (1998). Also a member of supergroup the Lemonheads (1993-1994) and Some Girls (2003-2007). Recent work includes tribute albums to Olivia Newton-John (2018) and the Police (2019).",

  "kansas":
    "American progressive rock band formed in Topeka, Kansas in 1973. Classic lineup: Steve Walsh (vocals/keyboards), Robby Steinhardt (vocals/violin), Kerry Livgren (guitar/keyboards), Rich Williams (guitar), Dave Hope (bass), and Phil Ehart (drums). Distinguished by Steinhardt's violin and the band's blend of American hard rock with British prog influences.\n\nSixteen studio albums starting with the 1974 self-titled debut. Commercial peak: *Leftoverture* (1976, featuring \"Carry On Wayward Son\") and *Point of Know Return* (1977, featuring \"Dust in the Wind\"). Multiple lineup changes since the 1980s; Williams and Ehart are the only continuous members. Steinhardt died in 2021.",

  "killswitch-engage":
    "American metalcore band formed in Westfield, Massachusetts in 1999 by guitarist Adam Dutkiewicz (later moved to producer), guitarist Joel Stroetzel, and others. Vocalist Jesse Leach (1999-2002, 2012-present) and Howard Jones (2002-2012) have been the band's two primary singers.\n\nNine studio albums including *Alive or Just Breathing* (2002), the breakthrough self-titled second album (2004), *As Daylight Dies* (2006), *Disarm the Descent* (2013), and *Atonement* (2019). Considered foundational to the \"New Wave of American Heavy Metal\" alongside Lamb of God and Shadows Fall.",

  "king-diamond":
    "Danish heavy metal singer (born Kim Bendix Petersen, 1956) and the band of the same name. Initially fronted Mercyful Fate (1981-1985, reunions thereafter) before launching the solo band project in 1985. Known for theatrical horror-themed concept albums and a distinctive falsetto vocal style with corpse-paint stage presentation.\n\nThirteen studio albums under the King Diamond name including *Abigail* (1987), *Them* (1988), *Conspiracy* (1989), and *The Eye* (1990). Guitarist Andy LaRocque has been the band's longest-serving member since 1985. The band has been on production hiatus since *Give Me Your Soul... Please* (2007) but continues to tour.",

  "kmfdm":
    "German industrial rock band formed in Paris in 1984 by Sascha Konietzko. Founding member En Esch and later collaborator Günter Schulz were long-term contributors. The band's name is an acronym for \"Kein Mehrheit Für Die Mitleid\" — deliberately ungrammatical German often translated as \"no pity for the majority.\"\n\nReleased 23 studio albums starting with *Opium* (1984). Konietzko has been the band's only continuous member. Active continuously aside from a 1999-2002 hiatus. Best-known releases include *Nihil* (1995), *Symbols* (1997), and *WWIII* (2003).",

  "korn":
    "American nu-metal band formed in Bakersfield, California in 1993. Founding lineup: Jonathan Davis (vocals), James \"Munky\" Shaffer (guitar), Brian \"Head\" Welch (guitar, 1993-2005, 2013-present), Reginald \"Fieldy\" Arvizu (bass), and David Silveria (drums, replaced by Ray Luzier in 2009). Pioneers of nu-metal alongside Limp Bizkit and Deftones.\n\nThe 1994 self-titled debut sold over 2 million copies. Subsequent peaks: *Life Is Peachy* (1996), *Follow the Leader* (1998), and *Issues* (1999). Fifteen studio albums total. Davis has continued as the band's vocalist throughout; Welch's 2005 departure (related to his Christian conversion) and 2013 return were widely covered.",

  "lagwagon":
    "American punk rock band formed in Goleta, California in 1989. Classic lineup: Joey Cape (vocals), Chris Flippin (guitar), Chris Rest (guitar, 1995-present), Joe Raposo (bass), and Dave Raun (drums, 1996-present). Closely associated with Fat Wreck Chords; Cape also fronts Bad Astronaut and Me First and the Gimme Gimmes.\n\nNine studio albums including *Trashed* (1994), *Hoss* (1995), *Double Plaidinum* (1997), *Let's Talk About Feelings* (1998), and *Railer* (2019). Drummer Derrick Plourde died in 2005; the band's *Resolve* (2005) was a tribute to him.",

  "poison":
    "American glam metal band formed in Mechanicsburg, Pennsylvania in 1983. Classic lineup: Bret Michaels (vocals), C.C. DeVille (guitar), Bobby Dall (bass), and Rikki Rockett (drums). The lineup was largely stable except for a brief Richie Kotzen era (1991-1993).\n\nTheir 1986 debut *Look What the Cat Dragged In* and 1988 follow-up *Open Up and Say... Ahh!* both sold multi-platinum; the *Flesh & Blood* album (1990) and singles \"Every Rose Has Its Thorn\" and \"Nothin' but a Good Time\" became signature tracks. Seven studio albums total. Michaels later starred in *Rock of Love* on VH1 (2007-2009).",

  "quicksand":
    "American post-hardcore band formed in New York City in 1990. Vocalist/guitarist Walter Schreifels (formerly of Gorilla Biscuits) has been the band's primary creative force throughout. Lineup also includes guitarist Tom Capone, bassist Sergio Vega, and drummer Alan Cage.\n\nFive studio albums between 1991 and 2024: *Quicksand* EP (1991), *Slip* (1993), *Manic Compression* (1995), *Interiors* (2017), and *Distant Populations* (2021). Disbanded in 1995 after *Manic Compression*; reunited in 2012 and have remained active since.",

  "reel-big-fish":
    "American ska-punk band formed in Huntington Beach, California in 1991. Vocalist/guitarist Aaron Barrett has been the band's only continuous member. Long-time horn section included Scott Klopfenstein (trumpet, 1994-2009) and Dan Regan (trombone, 1994-2010).\n\nTheir 1996 album *Turn the Radio Off* (featuring \"Sell Out\") was a commercial breakthrough during the late-1990s third-wave ska revival. Subsequent releases include *Why Do They Rock So Hard?* (1998), *Cheer Up!* (2002), and *Candy Coated Fury* (2012). Eight studio albums total; the band has toured almost continuously since 1991.",

  "skid-row":
    "American heavy metal band formed in Toms River, New Jersey in 1986. Original lineup: Sebastian Bach (vocals, 1987-1996), Dave \"Snake\" Sabo (guitar), Scotti Hill (guitar), Rachel Bolan (bass), and Rob Affuso (drums). Vocalists since Bach include Johnny Solinger (1999-2015), ZP Theart (2016-2022), and Erik Grönwall (2022-2024).\n\nTheir 1989 self-titled debut sold over 5 million copies in the US. Follow-up *Slave to the Grind* (1991) debuted at #1 on the Billboard 200. *Subhuman Race* (1995) was the final album with Bach. The band has continued with *Thickskin* (2003), *Revolutions per Minute* (2006), and *The Gang's All Here* (2022).",

  "steel-panther":
    "American comedy glam metal band formed in Los Angeles in 2000 (originally as Metal Skool). Lineup: Michael Starr (vocals), Satchel (guitar), Stix Zadinia (drums), and Lexxi Foxx (bass). The band's act parodies the 1980s LA hair-metal scene with exaggerated lyrics and stage presentation.\n\nFive studio albums including *Feel the Steel* (2009), *Balls Out* (2011), and *Heavy Metal Rules* (2019). The band has been a successful live touring act despite limited radio play. Foxx departed in 2021; replaced by Spyder.",

  "stevie-wonder":
    "American singer-songwriter and multi-instrumentalist (born Stevland Hardaway Morris, 1950). Signed to Motown's Tamla label at age 11 in 1961 as \"Little Stevie Wonder\"; has been with the label ever since.\n\nHis \"classic period\" (1972-1976) produced *Music of My Mind* (1972), *Talking Book* (1972), *Innervisions* (1973), *Fulfillingness' First Finale* (1974), and the double album *Songs in the Key of Life* (1976). Won Album of the Year three times in four years. Continued releasing albums through *A Time to Love* (2005) and singles thereafter. Twenty-five Grammy Awards — the most for any solo artist. Inducted into the Rock and Roll Hall of Fame in 1989.",

  "ted-nugent":
    "American rock guitarist and vocalist born December 13, 1948, in Redford, Michigan. First gained prominence as guitarist for the Amboy Dukes (1965-1975) before launching a solo career.\n\nEleven solo studio albums starting with the self-titled 1975 debut. Commercial peak: *Free-for-All* (1976), *Cat Scratch Fever* (1977), and the live *Double Live Gonzo!* (1978). Also fronted the supergroup Damn Yankees (1989-1996, with Tommy Shaw of Styx and Jack Blades of Night Ranger). Known for outspoken political commentary and a high-profile hunting/firearms advocacy career.",

  "the-dead-milkmen":
    "American punk rock band formed in Philadelphia in 1983. Lineup: Rodney Anonymous (vocals), Joe Jack Talcum (guitar/vocals), Dave Blood (bass, 1983-2004), and Dean Clean (drums). Known for satirical lyrics and lo-fi production aesthetic.\n\nTheir 1988 single \"Punk Rock Girl\" from *Beelzebubba* became their best-known song. Eight studio albums including *Big Lizard in My Backyard* (1985), *Bucky Fellini* (1987), and *Metaphysical Graffiti* (1990). The band split in 1995; bassist Dave Blood died in 2004. Reunited in 2008 and has continued with bassist Dan Stevens.",

  "the-donnas":
    "American rock band formed in Palo Alto, California in 1993 as Ragady Anne when the four members were 13 years old. Lineup: Brett Anderson (vocals, also called Donna A.), Allison Robertson (guitar/Donna R.), Maya Ford (bass/Donna F.), and Torry Castellano (drums/Donna C.).\n\nSeven studio albums between 1997 and 2007 including *American Teenage Rock 'n' Roll Machine* (1998), *Get Skintight* (1999), and the major-label breakthrough *Spend the Night* (2002, featuring \"Take It Off\"). Castellano left in 2009 due to tendinitis; the band entered a long hiatus. Released a final single in 2019.",

  "the-police":
    "English rock band formed in London in 1977. Trio of Sting (Gordon Sumner, vocals/bass), Andy Summers (guitar), and Stewart Copeland (drums). One of the most commercially successful acts of the new wave era; their reggae- and jazz-influenced sound was a defining feature.\n\nFive studio albums in five years: *Outlandos d'Amour* (1978), *Reggatta de Blanc* (1979), *Zenyatta Mondatta* (1980), *Ghost in the Machine* (1981), and *Synchronicity* (1983). The band disbanded in 1986; Sting launched a successful solo career. The original trio reunited for a 2007-2008 world tour. Inducted into the Rock and Roll Hall of Fame in 2003.",

  "hd-pe":
    "American rap rock band formed in Huntington Beach, California in 1994 by vocalist Jared Gomes (Paulie). The name stands for \"Hed Planetary Evolution.\" Long-running lineup typically includes Gomes plus rotating contributors.\n\nTwelve studio albums including the self-titled debut (1997), *Broke* (2000), and *Blackout* (2003). The band's punk-rap-metal hybrid was contemporary with Korn, Limp Bizkit, and Deftones. Released primarily on Jive in the late 1990s and on Suburban Noize from the mid-2000s onward.",

  "a-tribe-called-quest":
    "American hip-hop group formed in Queens, New York in 1985. Lineup: Q-Tip (Kamaal Ibn John Fareed), Phife Dawg (Malik Taylor, 1985-2016), Ali Shaheed Muhammad (DJ), and Jarobi White (1985-1991, 2006-2016). Among the foundational acts of the Native Tongues collective alongside De La Soul.\n\nFive studio albums between 1990 and 1998: *People's Instinctive Travels and the Paths of Rhythm* (1990), *The Low End Theory* (1991), *Midnight Marauders* (1993), *Beats, Rhymes and Life* (1996), and *The Love Movement* (1998). Phife Dawg died in 2016 from complications of diabetes. The posthumous *We Got It from Here... Thank You 4 Your Service* (2016) was the band's final release.",

  "anthrax":
    "American thrash metal band formed in New York City in 1981. Long-running lineup centered on guitarist Scott Ian and drummer Charlie Benante. Primary vocalists have been Joey Belladonna (1984-1992, 2005-present) and John Bush (1992-2005).\n\nOne of the \"Big Four\" thrash bands alongside Metallica, Megadeth, and Slayer. Eleven studio albums including *Spreading the Disease* (1985), *Among the Living* (1987), *State of Euphoria* (1988), and *Persistence of Time* (1990). Notable 1991 single \"Bring the Noise\" (with Public Enemy) helped pioneer the rap-metal hybrid.",

  "billy-idol":
    "English rock singer (born William Broad, 1955). Fronted the punk band Generation X (1976-1981) before launching a solo career. The solo project was developed with guitarist Steve Stevens, his longest-serving collaborator.\n\nReleased ten solo studio albums starting with the 1982 self-titled debut. Commercial peak: *Rebel Yell* (1983) and *Whiplash Smile* (1986) — singles included \"White Wedding,\" \"Rebel Yell,\" \"Eyes Without a Face,\" \"To Be a Lover,\" and \"Mony Mony.\" After a serious 1990 motorcycle accident and substance abuse, Idol's late-career output has included *Devil's Playground* (2005), *Kings & Queens of the Underground* (2014), and *The Cage* (2022).",

  "billy-joel":
    "American singer-songwriter and pianist born May 9, 1949, in The Bronx, New York. One of the best-selling recording artists in US history with over 150 million albums sold worldwide.\n\nThirteen studio albums between *Cold Spring Harbor* (1971) and *River of Dreams* (1993). After 1993, Joel stopped recording original pop albums but has continued to tour extensively, performing residencies at Madison Square Garden (2014-2024) and various venues worldwide. Commercial peak releases: *The Stranger* (1977), *52nd Street* (1978), *Glass Houses* (1980), *An Innocent Man* (1983), and *Storm Front* (1989). Inducted into the Rock and Roll Hall of Fame in 1999.",

  "biohazard":
    "American hardcore band formed in Brooklyn, New York in 1987. Lineup: Evan Seinfeld (vocals/bass, 1987-2011), Billy Graziadei (vocals/guitar), Bobby Hambel (guitar, 1987-1996, 2008-present), and Danny Schuler (drums). Considered foundational to the late-1980s \"crossover\" between hardcore punk and heavy metal.\n\nTheir 1992 album *Urban Discipline* on Roadrunner Records broke the band commercially. Subsequent releases include *State of the World Address* (1994), *Mata Leão* (1996), and *No Holds Barred* (1997). Seinfeld departed in 2011 and rejoined for a 2024 reunion that produced the band's most recent album.",

  "blues-traveler":
    "American jam band formed in Princeton, New Jersey in 1987. Lineup: John Popper (vocals/harmonica), Chan Kinchla (guitar), and Brendan Hill (drums), with longtime bassist Bobby Sheehan (1987-1999) and his replacement Tad Kinchla (1999-present). Founding member of the H.O.R.D.E. (Horizons of Rock Developing Everywhere) touring festival.\n\nFourteen studio albums starting with the 1990 self-titled debut. Commercial breakthrough came with *Four* (1994), featuring \"Run-Around\" and \"Hook.\" Subsequent releases include *Straight On Till Morning* (1997) and *Bridge* (2001). Sheehan died of an overdose in 1999. Continuously active.",

  "cinderella":
    "American glam metal band formed in Philadelphia in 1983. Lineup: Tom Keifer (vocals/guitar), Eric Brittingham (bass), Jeff LaBar (guitar), and Fred Coury (drums). Distinguished from peers by their bluesier, more roots-rock-oriented sound — particularly evident from *Long Cold Winter* (1988) onward.\n\nFour studio albums between 1986 and 1994: *Night Songs*, *Long Cold Winter*, *Heartbreak Station*, and *Still Climbing*. Singer Keifer's recurring vocal cord problems limited the band's output after the early 1990s. Last toured in 2014; LaBar died in 2021.",

  "crack-the-sky":
    "American progressive rock band formed in Weirton, West Virginia in 1975. Vocalist/guitarist John Palumbo has been the band's primary creative force throughout the band's many lineup configurations. Initially based in Baltimore; the band has long held an outsized cult following in the Mid-Atlantic region despite limited national success.\n\nSixteen studio albums starting with the self-titled debut (1975). Best-known releases include *Animal Notes* (1976), *Safety in Numbers* (1977), and *Live Sky* (1978). The band has been active intermittently across five decades; recent releases include *Tribes* (2018) and *Between the Cracks* (2020).",

  "dave-matthews-band":
    "American jam band formed in Charlottesville, Virginia in 1991. Lineup: Dave Matthews (vocals/guitar), Stefan Lessard (bass), Carter Beauford (drums), Boyd Tinsley (violin, 1991-2018), LeRoi Moore (saxophone, 1991-2008), and Jeff Coffin (saxophone, 2008-present). Among the most commercially successful American touring bands of the late 1990s and 2000s.\n\nTen studio albums starting with *Under the Table and Dreaming* (1994). Multi-platinum commercial peak through *Crash* (1996), *Before These Crowded Streets* (1998), *Everyday* (2001), and *Busted Stuff* (2002). Moore died from a 2008 ATV accident. The band releases live recordings from every concert, a practice maintained since 1997.",

  "dead-company":
    "American rock band formed in 2015. Lineup: Bob Weir (guitar/vocals, formerly of the Grateful Dead), Mickey Hart and Bill Kreutzmann (drums, also formerly of the Grateful Dead), Oteil Burbridge (bass), Jeff Chimenti (keyboards), and John Mayer (guitar/vocals).\n\nThe band performs Grateful Dead material across extended touring schedules — including arena and stadium runs. After a 2023 \"final tour,\" the band began a long-term Las Vegas residency at the Sphere in 2024.",

  "devo":
    "American new wave band formed in Akron, Ohio in 1973. Lineup centered on brothers Mark Mothersbaugh (vocals/keyboards) and Bob Mothersbaugh (guitar), and brothers Gerald Casale (bass/vocals) and Bob Casale (guitar/keyboards). The band's name shorthands their thematic concept of \"de-evolution\" — society regressing rather than progressing.\n\nEight studio albums between 1978 and 2010. Commercial peak: *Freedom of Choice* (1980), which produced their best-known single \"Whip It.\" Subsequent releases include *New Traditionalists* (1981), *Oh, No! It's Devo* (1982), and the reunion album *Something for Everybody* (2010). Bob Casale died in 2014. Mark Mothersbaugh has had a long second career composing for film, television, and games.",

  "dinosaur-jr":
    "American alternative rock band formed in Amherst, Massachusetts in 1984. Original lineup: J Mascis (vocals/guitar), Lou Barlow (bass), and Murph (Patrick Murphy, drums). Foundational to the development of indie rock and an influence on the early-1990s alternative explosion.\n\nThe band's first three albums — *Dinosaur* (1985), *You're Living All Over Me* (1987), and *Bug* (1988) — defined the original sound. Barlow was fired in 1989 (he founded Sebadoh shortly after); the band continued as a Mascis-led vehicle through the 1990s. The original three reunited in 2005 and have released six additional albums together. Twelve studio albums total.",

  "dio":
    "American heavy metal band formed in Los Angeles in 1982 by vocalist Ronnie James Dio after his departure from Black Sabbath. Long-running lineup centered on Dio (until his death in 2010), guitarist Vivian Campbell (1982-1986), and drummer Vinny Appice (intermittently throughout the band's history).\n\nTen studio albums between *Holy Diver* (1983) and *Master of the Moon* (2004). *Holy Diver* and *The Last in Line* (1984) are the band's most celebrated releases. Dio died of stomach cancer in 2010; the band has been formally dissolved since.",

  "earth-wind-fire":
    "American R&B band formed in Chicago in 1969 by Maurice White. Long-running lineup featured Maurice's brother Verdine White on bass, Philip Bailey (vocals), Ralph Johnson (drums), and a rotating brass section. The band fused jazz, soul, funk, R&B, and pop with elaborate stage productions.\n\nTwenty studio albums between 1970 and 2013. Commercial peak: *That's the Way of the World* (1975), *Gratitude* (1975), *Spirit* (1976), *All 'n All* (1977), and *I Am* (1979). Maurice White retired from touring in the 1990s due to Parkinson's disease and died in 2016. Inducted into the Rock and Roll Hall of Fame in 2000.",

  "faith-no-more":
    "American rock band formed in San Francisco in 1979 (originally as Faith. No Man). Lineup: Mike Patton (vocals, 1989-1998, 2009-present), Roddy Bottum (keyboards), Billy Gould (bass), Mike Bordin (drums), and Jon Hudson (guitar, since 1996). Mike Patton replaced original vocalist Chuck Mosley in 1989.\n\nSeven studio albums total. Their breakthrough came with *The Real Thing* (1989), featuring \"Epic.\" Subsequent peaks: *Angel Dust* (1992), *King for a Day, Fool for a Lifetime* (1995), and *Album of the Year* (1997). The band broke up in 1998 and reunited in 2009; *Sol Invictus* (2015) is their most recent album.",
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
