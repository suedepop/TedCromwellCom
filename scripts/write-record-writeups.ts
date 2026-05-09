import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

const WRITEUPS: Record<string, string> = {
  // ─── They Might Be Giants ────────────────────────────────────────────────
  "14429297":
    "The Pink Album. The debut, the one with the cover that looks like the back of a cassette tape. \"Don't Let's Start\" is the calling card, but the whole record is a manifesto: nineteen tracks averaging two minutes apiece, drum machine and accordion and Flansburgh's overdriven Casio guitar, a sensibility fully formed on day one. \"Put Your Hand Inside the Puppet Head,\" \"She's an Angel,\" \"Number Three,\" \"Youth Culture Killed My Dog\" — Brooklyn art-school New York at its most charming.",
  "12570332":
    "The album where they figured out they could write actual hits without giving up any of the strangeness. \"Ana Ng\" alone — that descending guitar riff, the lyric about a person on the opposite side of the earth — earns the record's reputation, but \"They'll Need a Crane,\" \"Purple Toupee,\" and \"Where Your Eyes Don't Go\" are nearly as good. Named for the Massachusetts town the Johns grew up in. The Bar/None pressing that cracked them onto college radio in earnest.",
  "16176945":
    "Their commercial peak and the album that made them more than a college-radio cult act. *Flood* is dense, tuneful, and weirder than the singles let on — \"Birdhouse in Your Soul\" and \"Istanbul (Not Constantinople)\" are the obvious entry points, but the real character lives in the deep cuts: the apocalyptic ennui of \"Dead,\" the vengeful \"Your Racist Friend,\" the sub-90-second sketches like \"Minimum Wage\" and \"Hot Cha.\" Nineteen tracks, almost no filler — the rare best-selling album that's also the best argument for the band.",
  "5645215":
    "Their fourth album, conceived around the idea of being NASA's official band on a mission that never flew. The conceit yields \"Fingertips,\" a 21-segment suite of song fragments meant to be played on shuffle — still one of the funniest, smartest things they've done. The rest sits comfortably in their late-Elektra prime: \"The Statue Got Me High,\" \"The Guitar (The Lion Sleeps Tonight),\" \"Dinner Bell,\" \"I Palindrome I.\" Tight, weird, melodic, no fat.",
  "4814649":
    "TMBG's first record with a live band — drums, bass, the whole apparatus, swapping the lo-fi drum-machine intimacy of the early albums for something messier and louder. Twenty tracks crammed into an hour, which is a lot of TMBG to absorb in one sitting; the highs (\"Snail Shell,\" \"Spy,\" \"Subliminal,\" \"AKA Driver\") justify the sprawl. Often dismissed as the album where they stopped sounding like themselves — but listened to with fresh ears it sounds like a band figuring out who they are with new tools.",
  "22069372":
    "Released September 11, 2001 — release-day press essentially evaporated, and the record never quite got its due. Which is a shame, because *Mink Car* is one of their most consistent late-period albums: \"Bangs,\" \"Man, It's So Loud in Here,\" \"Mink Car,\" \"Older,\" \"Drink!\" Cleaner production than the Elektra years, but the songwriting is sharp throughout. The album that ended their cult-act era and ushered in everything afterward — the kid records, the Disney soundtracks, the proper-band-for-life phase.",
  "13522694":
    "A non-album 7\" from the *I Like Fun* era, proof that the Dial-A-Song machinery never really stopped. \"The Communists Have the Music\" is a paranoid, fanged little earworm — Linnell at his most acid-tongued — backed with the dreamier, Flansburgh-led \"I've Been Seeing Things.\" Limited single, the kind of release that exists mostly so completists like us can chase it down.",

  // ─── Iron Maiden ─────────────────────────────────────────────────────────
  "5494729":
    "The debut, Di'Anno on vocals, recorded fast and cheap with Will Malone barely producing. Rougher and more punk-adjacent than anything that followed — \"Prowler,\" \"Phantom of the Opera,\" \"Running Free,\" the title track. Eddie's first cover. The sound of NWOBHM forming itself in real time.",
  "10616059":
    "Di'Anno's last with the band and Martin Birch's first as producer — the moment the trademark Maiden sound starts to lock in. Heavier, tighter, twin-guitar attack now front and center. \"Wrathchild,\" \"Murders in the Rue Morgue,\" the title track. A transitional record that's better than its reputation.",
  "11510382":
    "Bruce Dickinson's debut and the album that broke Maiden worldwide. \"Run to the Hills,\" \"The Number of the Beast,\" \"Hallowed Be Thy Name\" — three of the greatest metal songs ever recorded, stacked on the same record. This is the 1986 repress; the music is non-negotiable canon.",
  "1456569":
    "Bruce's second, Nicko McBrain's first, and the first album with the classic five-man lineup that would define the rest of the decade. \"The Trooper,\" \"Flight of Icarus,\" \"Revelations,\" \"Where Eagles Dare.\" Tighter and more confident than *Beast* — the band knowing exactly what they are.",
  "2589019":
    "The peak. Egyptian theme, monster cover art, and one of the great consecutive runs in any genre: \"Aces High,\" \"2 Minutes to Midnight,\" the title track, and the 13-minute \"Rime of the Ancient Mariner\" closing things out. The World Slavery Tour that followed nearly broke them — worth it.",
  "1430648":
    "The greatest live metal album ever made. Recorded at Long Beach Arena and Hammersmith on the back end of the *Powerslave* tour, when Maiden was the biggest metal band in the world and playing like it. Double LP of nothing but bangers, sequenced perfectly. Definitive.",
  "2830552":
    "First album with guitar synthesizers — a controversial move at the time, totally vindicated since. \"Wasted Years,\" \"Stranger in a Strange Land,\" \"Caught Somewhere in Time.\" The opening synth swell has been imitated forever; nothing has matched it. Club Edition pressing.",
  "1763028":
    "Concept album about a child with second sight, peak prog-Maiden, and the band's last great record of the '80s. \"The Evil That Men Do,\" \"Can I Play with Madness,\" \"Infinite Dreams,\" \"The Clairvoyant\" — and the 10-minute title track that ties the whole thing together.",
  "1887636":
    "Live soundtrack to the *Flight 666* documentary about the Somewhere Back in Time world tour, when Maiden flew themselves around the planet on Bruce's 757. Picture disc, limited edition — the kind of object that exists for the sleeve as much as the playback.",
  "6359040":
    "7\" reissue of the 1980 single — Eddie's first appearance on a record sleeve, and the song that introduced the world to Iron Maiden. A piece of NWOBHM origin myth pressed back to vinyl.",
  "10621127":
    "The 15th studio album, sprawling and proggy, the kind of late-period Maiden that rewards a patient listen. \"El Dorado,\" \"Coming Home,\" and the 11-minute \"When the Wild Wind Blows\" — Steve Harris in full grand-narrative mode.",
  "20093719":
    "Seventeenth studio album, an 82-minute Japanese-themed double LP with the longest songs of their career. \"The Writing on the Wall,\" \"Lost in a Lost World,\" \"Hell on Earth\" — the sound of a band 45 years deep refusing to coast. The fact that this album exists at all is a small miracle.",
  "17050182":
    "The 2021 remastered reissue of the 1980 debut — same songs, sharper sound, fresh vinyl. For when the original pressing is too precious to put on the turntable.",

  // ─── NOFX ────────────────────────────────────────────────────────────────
  "763062":
    "NOFX's Epitaph debut and the moment they started sounding like NOFX — fast, snotty, melodic, smarter than they let on. \"Stickin' In My Eye,\" \"Soul Doubt,\" \"Bob,\" \"Liza and Louise.\" The Mos Eisley cantina cover art. The album where the band's whole personality assembled itself.",
  "419987":
    "The masterpiece. The album that made NOFX one of the biggest underground bands of the '90s and arguably *defined* skate-punk for a generation. \"Linoleum,\" \"Leave It Alone,\" \"The Brews,\" \"Don't Call Me White,\" \"Perfect Government\" — eighteen songs, almost all of them great. Gold record without ever leaving Epitaph.",
  "6682080":
    "First live album, recorded at the Palace in Hollywood right after *Punk in Drublic* broke. Loud, sloppy, profane, fast — the band at its swaggering peak, between songs as much as during them.",
  "435142":
    "7\" EP with the most NOFX title imaginable. Three songs, a few minutes long, exactly what it needs to be.",
  "9243216":
    "7\" reissue of one of their most controversial cuts (originally on *White Trash*) — exactly the sort of release that rewards owning the artifact more than streaming it.",
  "20440801":
    "Their third album, the one right before they figured everything out — rawer and looser than what came after, but with \"Green Corn,\" \"Just the Flu,\" and \"Cheese/Where's My Slice?\" already showing the songwriting that would carry the next decade. 2021 reissue pressing.",
  "23603759":
    "An 18-minute single-song EP — political, sprawling, melodic, and unlike anything else in their catalog. The ambition is the point: NOFX showing they could write a punk-rock symphony without embarrassing themselves. 2021 reissue.",
  "15724771":
    "*The Decline* performed in full at Red Rocks, with horns. As good a flex as a band like NOFX has ever attempted, and they pull it off.",
  "17672086":
    "Originally conceived as a double album, cut down after all the chaos around it — the title is the joke. One of the late-era NOFX records, punchy and nervous, with the band already mid-dismantle.",
  "24382763":
    "The 2022 reissue. Same songs, fresh vinyl — *White Trash* in rotation-ready form for when the original pressing has earned a rest.",

  // ─── Bad Religion ────────────────────────────────────────────────────────
  "25175854":
    "The debut. Recorded by teenagers, self-released on the brand-new Epitaph label, a foundational document of LA hardcore. \"Voice of God Is Government,\" \"Damned to Be Free,\" \"We're Only Gonna Die.\" Crude but the songwriting instincts are already there. 2022 reissue.",
  "20869819":
    "The comeback after the *Into the Unknown* disaster, and the album that more or less invented melodic hardcore as a viable subgenre. Fifteen songs in twenty-six minutes — every one sharp, every one angry, \"1000 More Fools\" and \"You Are (The Government)\" anchoring side one. Reissue pressing.",
  "14061165":
    "Their fifth album and probably their most concentrated. \"21st Century (Digital Boy)\" is the calling card, but \"American Jesus,\" \"Modern Man,\" \"Anesthesia,\" and \"Get Off\" all do work. The exact intersection of speed, melody, and Greg Graffin's vocabulary that made them famous.",
  "20970490":
    "The seventh album, last before the major-label move. Crisper, slightly slower, with \"Modern Day Catastrophists,\" \"Struck a Nerve,\" and the original \"American Jesus\" (with the Eddie Vedder cameo on the chorus). The transition record. 2021 reissue.",
  "12333331":
    "Major-label debut on Atlantic, glossier production, and the closest they ever came to a proper hit single — the title track, \"Infected,\" and a rerecorded \"21st Century (Digital Boy).\" Tim Armstrong shouts on \"Television.\" A polarizing record at the time; the songs hold up better than the controversy.",
  "24506660":
    "The sixth album, often the one fans pick when they want to argue. Title track is a slow burn — unusual for them — and the rest is \"Atomic Garden,\" \"No Direction,\" \"Two Babies in the Dark.\" A more spacious record than what surrounds it.",
  "11917507":
    "Brian Baker's debut on guitar (Brett out, Minor Threat in) and a tighter, glossier version of the band. \"Punk Rock Song,\" \"A Walk,\" \"Pity the Dead.\" Underrated mostly for being the post-classic-lineup record everyone wrote off at the time.",
  "14236642":
    "Anti-war album written and released into the teeth of the Iraq invasion. Brett back, Greg furious, \"Los Angeles Is Burning\" and \"Sinister Rouge\" delivering some of their most direct political writing in decades.",
  "501525":
    "The reunion record — Brett Gurewitz back in the band after a decade out, the major-label era over, Bad Religion sounding like themselves again for the first time since 1993. \"Sorrow,\" \"Supersonic,\" \"Broken.\" A return-to-form that actually meant it.",

  // ─── KISS ────────────────────────────────────────────────────────────────
  "4530023":
    "The album that turned KISS from a struggling theatrical curiosity into the biggest band in America. Released at the lowest point of their career and saved everything — overdubbed, debated to death, none of it matters. \"Rock and Roll All Nite,\" \"Strutter,\" \"Deuce,\" \"Black Diamond\" — the studio versions ceased being canonical the moment this came out.",
  "702514":
    "Fifth studio album, recorded right after *Destroyer* — a return to grit after the Bob Ezrin polish. \"Calling Dr. Love,\" \"Hard Luck Woman,\" \"I Want You,\" \"Makin' Love.\" Leaner, hookier, exactly the right move at the right time.",
  "2422619":
    "Boxset compilation of the first three studio albums (*KISS*, *Hotter Than Hell*, *Dressed to Kill*) packaged together with bonus inserts and trading cards. The classic band-as-cartoon-merch artifact, the kind of thing only KISS would have done in 1976.",
  "5894228":
    "The follow-up live album — one disc each of new and old, plus a fourth side of new studio material recorded with Eddie Kramer. \"Detroit Rock City,\" \"Love Gun,\" \"Christine Sixteen,\" \"I Stole Your Love.\" Less mythic than *Alive!*, still essential.",
  "8327562":
    "Sixth album, the last with all four originals before the wheels started coming off. The title track is one of the band's signature songs; \"Christine Sixteen\" is uncomfortable in retrospect; \"Shock Me\" is Ace Frehley's first lead vocal and one of the best songs he ever sang.",
  "4320781":
    "The disco one. \"I Was Made for Lovin' You\" is the calling card — proof the band would chase any trend it scented — and \"Sure Know Something\" backs it up. Studio-band-only by this point, with Anton Fig drumming most of it instead of Peter Criss. Polarizing, weird, kind of great.",

  // ─── Ramones ─────────────────────────────────────────────────────────────
  "4467344":
    "The fourteen-song detonation that started everything — recorded for $6,400, released February 1976, twenty-nine minutes long, no song over two and a half. \"Blitzkrieg Bop,\" \"Beat on the Brat,\" \"Now I Wanna Sniff Some Glue,\" \"Judy Is a Punk.\" Year zero of punk rock, full stop.",
  "11533894":
    "The 2018 remaster of the 1976 debut — same fourteen songs, same twenty-nine minutes, sharper-cut vinyl. The original is the historical document; this one is the copy you actually drop the needle on.",
  "663086":
    "The second album, six months after the debut — same formula, slightly bigger production, slightly weirder corners. \"Glad to See You Go,\" \"I Remember You,\" \"Pinhead,\" \"Suzy Is a Headbanger.\" Also famous for the \"Carbona Not Glue\" controversy that got the record pulled and re-pressed.",
  "11533914":
    "The 2018 remaster, with \"Carbona Not Glue\" restored where it belonged. The way *Leave Home* was supposed to sound from the start.",
  "8776614":
    "The third album in eighteen months and arguably the best of the early run — the songwriting peaks, the Beach Boys melodies surface, the production finally catches up to the material. \"Sheena Is a Punk Rocker,\" \"Rockaway Beach,\" \"Teenage Lobotomy,\" \"Cretin Hop,\" a perfect cover of \"Do You Wanna Dance.\" The Ramones at the absolute top of their craft.",
  "21807712":
    "The 2022 reissue — limited pressing, fresh vinyl, the masterpiece in a more available format. If you only own one Ramones reissue, make it this one.",
  "394419":
    "Tommy gone, Marky in on drums, the songs slowing down a fraction — the album that introduced \"I Wanna Be Sedated\" to the world, plus \"I Just Want to Have Something to Do,\" \"Don't Come Close,\" and the cover of \"Needles and Pins.\" End of the original era; the fall from greatness starts subtly here.",
  "9999217":
    "The 2001 reissue pressing of *Road to Ruin*. \"I Wanna Be Sedated\" needs no introduction — this is the way to put it on at home.",
  "888102":
    "The double live album recorded New Year's Eve 1977 at the Rainbow in London — twenty-eight songs in fifty-three minutes, the whole early catalog blazed through with no breaks longer than a held-out \"1-2-3-4.\" Argued by some to be the best live punk album ever made.",
  "5245789":
    "The Phil Spector album. Wall of Sound meets Queens — \"Do You Remember Rock 'n' Roll Radio?\" and \"Baby, I Love You\" point in different directions and nothing quite resolves. The biggest commercial moment of their career and the source of their longest-running lineup tensions. Listenable, weird, doesn't quite know what it is.",
  "9299568":
    "Graham Gouldman of 10cc producing, the songwriting credits getting murkier (Joey vs. Dee Dee), and a proper attempt at radio-pop sheen. \"We Want the Airwaves,\" \"The KKK Took My Baby Away,\" \"She's a Sensation.\" Polarizing then, much better-loved now — the last sincere attempt at outright pop.",
  "26838215":
    "The 2023 RSD release of Ed Stasium's original New York mixes of *Pleasant Dreams* — closer to what the band actually wanted before Gouldman polished it. Roughly the same record, made of slightly different parts. Worthwhile if *Pleasant Dreams* matters to you at all.",
  "7928158":
    "A return to harder-edged punk after the *Pleasant Dreams* pop experiment — Ritchie Cordell and Glen Kolotkin producing. \"Psycho Therapy,\" \"Time Has Come Today,\" \"Outsider,\" \"Little Bit O' Soul.\" The forgotten middle Ramones record; better than its reputation, with one foot already pointing toward the heavier '80s material.",
  "1174636":
    "Tommy back on production, Richie Ramone in on drums, and the band sounding hungry again for the first time since *Road to Ruin*. \"Mama's Boy,\" \"Wart Hog,\" \"Howling at the Moon.\" A genuine late-period high point — the album that proved they could still make a great Ramones record on demand.",
  "1878868":
    "The 12\" promo single from *Too Tough to Die*. Eurythmics' Dave Stewart produced \"Howling at the Moon\" — a left-field choice that produced one of the late catalog's most distinctive singles.",
  "7626173":
    "Mid-'80s Ramones, Jean Beauvoir producing, \"Bonzo Goes to Bitburg\" in the middle of it — Joey's anti-Reagan blast over a Beauvoir hook. \"Something to Believe In,\" \"My Brain Is Hanging Upside Down (Bonzo Goes to Bitburg).\" Inconsistent record with two genuinely great songs near the front.",
  "427786":
    "Daniel Rey producing, the band openly cynical about the music industry by this point, and the songwriting starting to thin — but \"I Wanna Live\" and \"Garden of Serenity\" are two more late-period gems. The one before *Brain Drain*; effectively the start of the long fade.",
  "883615":
    "A 2004 vinyl release of a January 1978 NYC show — the band touring *Rocket to Russia* in their hometown. Raw, fast, charging through the early catalog at full speed.",
  "19514578":
    "July 8, 1980 broadcast from the Capitol Theatre in Sydney — the *End of the Century* tour. Numbered RSD pressing. A captured moment from the brief window when they were also a chart band.",
  "22212301":
    "The middle period in one box — *Pleasant Dreams* through *Brain Drain*. The era nobody talks about as much as the early run, but the era where the band proved they could *keep* making Ramones records when most punk bands were already done.",
  "32430621":
    "A 2024 RSD greatest-hits comp on vinyl — every song you'd put on a CD-R for somebody who'd never heard them. Not the deep listen, but a perfect object.",
  "30458978":
    "The 1975 demos that got them signed to Sire — earlier, rougher takes of debut-album material plus a few things that didn't make the cut. The closest you can get to standing in the rehearsal room before everything exploded.",

  // ─── The Clash ───────────────────────────────────────────────────────────
  "18138571":
    "The 1979 US version of the 1977 debut — substituted tracklist (the American label decided the UK version wasn't for them), added singles like \"I Fought the Law\" and \"Complete Control.\" Heretical to UK purists, beloved by everyone who came up on it stateside. \"White Riot,\" \"Garageland,\" \"Career Opportunities.\" Either version is one of the great debuts in rock.",
  "2739895":
    "The second album, Sandy Pearlman producing, much glossier than the debut — the major-label arrival as a kind of negotiated peace. \"Safe European Home,\" \"Tommy Gun,\" \"Stay Free,\" \"English Civil War.\" The transitional album; the band still working out how to be on a big label without sounding like they sold out.",
  "8871771":
    "The masterpiece. Nineteen songs, sixty-five minutes, every genre the band had been quietly absorbing — rockabilly, ska, jazz, soul, reggae, R&B — pulled into one impossibly cohesive sequence. \"London Calling,\" \"Spanish Bombs,\" \"Lost in the Supermarket,\" \"Train in Vain,\" \"Clampdown,\" \"The Guns of Brixton.\" A statement so total it makes everything before and after look like preamble.",
  "468059":
    "Triple LP, thirty-six tracks, six sides, a deliberate provocation released at single-LP price so the label couldn't turn it down. Sprawling, indulgent, brilliant in patches and self-defeating in others — \"The Magnificent Seven,\" \"Police on My Back,\" \"The Call Up,\" \"Washington Bullets.\" The album where the Clash decide to be every band they've ever loved, all at once.",
  "1321434":
    "The biggest commercial moment and the beginning of the end. \"Should I Stay or Should I Go\" and \"Rock the Casbah\" carried the album to multi-platinum, but the band was actively splintering — Topper out, Mick soon to follow. Underrated as an album because the singles dominate the conversation. \"Straight to Hell,\" \"Know Your Rights.\" Their last great record.",
  "19520938":
    "A 2021 RSD release pulling together unreleased *Sandinista!*-era recordings and Joe Strummer interviews. A document from inside the most chaotic creative period of the band — best appreciated by people who already know *Sandinista!* by heart.",

  // ─── AC/DC ───────────────────────────────────────────────────────────────
  "8438885":
    "The album that made AC/DC the biggest rock band in the world — recorded in the immediate aftermath of Bon Scott's death, with Brian Johnson making his debut. Mutt Lange producing, every song chiseled to a point. \"Hells Bells,\" \"Shoot to Thrill,\" \"You Shook Me All Night Long,\" the title track. Fifty million copies sold and counting. Whatever Bon was on the previous record, this is the band's other peak — different singer, same lightning.",
  "368690":
    "The international compilation that introduced AC/DC to the world outside Australia — pulled from their first two Aussie LPs, sequenced for maximum impact. \"It's a Long Way to the Top (If You Wanna Rock 'n' Roll)\" leads off, complete with bagpipes, and the rest is \"T.N.T.,\" \"The Jack,\" \"Live Wire.\" The greatest hits an Australian bar band ever played.",
  "5018666":
    "The album where AC/DC became AC/DC — heavier, faster, less blues-rock and more pure AC/DC. The title track is a six-minute origin myth set to power chords; \"Whole Lotta Rosie\" is the song people scream the loudest at every show. Phil Rudd's drums never sat better in a mix.",
  "3832775":
    "The fans' AC/DC album — the one nobody outside the cult talks about and the one cult members will defend to the death. Mark Evans out, Cliff Williams in on bass, the band leaner and meaner. \"Riff Raff,\" \"Sin City,\" \"Down Payment Blues,\" \"Rock 'n' Roll Damnation.\" Bon at his most quotable.",
  "7347888":
    "The live album that locked in their reputation — Glasgow Apollo, the band on the road behind *Powerage*, eight songs of total annihilation. \"Riff Raff\" alone justifies the record. Bon Scott's last live album; you can hear why nobody could replace him by replacing him.",
  "15366483":
    "Mutt Lange's first AC/DC record — the production tightens, the songs sharpen, the band breaks worldwide. \"Highway to Hell,\" \"Girls Got Rhythm,\" \"Touch Too Much,\" \"Night Prowler.\" The album that made the bigger thing about to happen *possible*. Bon Scott's last record before he died, six months later.",
  "17737000":
    "Originally an Australia-only release in 1976; the US didn't get it until after Bon's death, by which point the band was already huge. \"Dirty Deeds Done Dirt Cheap,\" \"Big Balls,\" \"Problem Child,\" \"Ride On.\" The deepest of the early Bon catalog — the one with the riffs that never made it onto rotation but should have.",
  "10003567":
    "The album they made because *Back in Black* was impossible to follow up. Mutt Lange producing again, cannons firing on the title track, every song trying to be as monumental as the moment. \"Let's Get It Up,\" \"Inject the Venom,\" \"C.O.D.\" Less spontaneous than *Back in Black* but the title track alone is a stadium ritual unto itself.",
  "8073576":
    "The band self-producing, deliberately stripping back the polish of *For Those About to Rock*. Phil Rudd out at the end, the production deliberately rough. \"Guns for Hire,\" \"Nervous Shakedown,\" the title track. Underrated and overlooked — the back-to-basics record made when nobody wanted basics.",
  "6229218":
    "A US-only EP comp of early-Bon Australian-only material — five songs, including \"Jailbreak\" itself. The kind of release that exists because there were old Bon Scott vocals lying around and a market hungry for them.",
  "14678101":
    "The band on the bottom of their commercial trough, self-produced again, fighting industry pressure and their own boredom. The title track has a riff that holds up; the rest is uneven. The sound of AC/DC making a record because that's what AC/DC does.",
  "5439427":
    "Soundtrack to Stephen King's *Maximum Overdrive* — half new songs, half catalog cuts, anchored by the title track and \"Who Made Who\" the song. The first sign that AC/DC could still write a hit when motivated; a setup for the late-'80s comeback.",
  "4689111":
    "Harry Vanda and George Young (Angus and Malcolm's older brother) producing again, like the old days. \"Heatseeker\" and \"That's the Way I Wanna Rock 'n' Roll\" pointed back toward the Bon-era spirit. Underrated; the album that quietly set up *The Razors Edge*.",
  "30135854":
    "The big comeback. \"Thunderstruck\" — that opening single-string riff burning before the whole band drops in — and \"Moneytalks,\" \"Are You Ready,\" the title track. Mike Fraser producing, the songs back at *Highway to Hell* level. The album that made AC/DC arena-ready again for the '90s.",
  "16212602":
    "The reunion album — Brian Johnson's voice back, Phil Rudd back on drums, Cliff Williams back, Stevie Young in for Malcolm using riffs Malcolm wrote before his death. \"Shot in the Dark,\" \"Realize,\" \"Demon Fire.\" Improbable, dignified, very AC/DC.",

  // ─── Black Sabbath ───────────────────────────────────────────────────────
  "5573604":
    "The album that invented heavy metal. Six songs, recorded in two days, opening with thunder and church bells and the slowed-down minor-third tritone that everything else here followed from. \"Black Sabbath,\" \"N.I.B.,\" \"Wicked World,\" \"The Wizard.\" *Rolling Stone* hated it; everything that mattered came after it.",
  "9731515":
    "The big one — the album with \"Paranoid,\" \"Iron Man,\" and \"War Pigs\" all on the same side. Thirteen-year-olds have been ruining their parents' Sundays with this record for fifty-five years. Recorded in five days. \"Planet Caravan\" and \"Hand of Doom\" prove the band could do more than crush.",
  "9348509":
    "The album where Iommi tunes down to C♯ — and the entire history of doom and stoner metal follows. \"Sweet Leaf,\" \"Children of the Grave,\" \"Into the Void,\" \"Lord of This World.\" The riffs have weight you can feel in your chest. Bound to be the album every younger heavier band has been ripping off since 1971.",
  "3099654":
    "The cocaine album, dedicated in the liner notes to \"the great COKE-Cola Company of Los Angeles.\" \"Snowblind,\" \"Changes,\" \"Supernaut,\" \"Tomorrow's Dream.\" Looser and stranger than the first three, but with songs that travel — \"Changes\" later got a country cover from Charles Bradley, and \"Supernaut\" is one of the funkiest things they ever did.",
  "13600935":
    "The peak of the original lineup — Rick Wakeman guesting on keys, the songs more ambitious, the playing tighter. Title track, \"A National Acrobat,\" \"Sabbra Cadabra,\" \"Killing Yourself to Live.\" Last great record before the chemicals started winning.",
  "380907":
    "The lawsuit album — the band locked in litigation with their old manager, the songs angrier and louder for it. \"Hole in the Sky,\" \"Symptom of the Universe\" (the song that arguably invented thrash metal), \"Megalomania.\" The last truly heavy record of the original run.",
  "7542421":
    "The pivot away from heavy — keyboards, ballads, Bill Ward singing lead on \"It's Alright.\" \"Back Street Kids,\" \"You Won't Change Me,\" \"Dirty Women.\" Polarizing then, kinder to it now. The sound of a band trying to figure out what to do post-doom; some of it works.",
  "8042562":
    "Ozzy's last album with the original band, the lineup actively falling apart in the studio. The title track is a great single; the rest is uneven, with prog and jazz-fusion experiments that nobody quite committed to. The end of an era — Ozzy out, Dio in, the next chapter to come.",
  "10109284":
    "The double-LP greatest-hits compilation pulled together by Warner Bros. — every essential cut from *Black Sabbath* through *Sabotage*. The classic \"first Sabbath record\" for a generation of high schoolers who didn't know to start with the studio albums.",
  "7078192":
    "Ronnie James Dio's debut and the album that resurrected the band. Different singer, different songwriting, but the riffs as heavy as ever. \"Neon Knights,\" \"Children of the Sea,\" the title track, \"Die Young.\" A reinvention so successful it spawned a whole second canon.",
  "380418":
    "Dio's second, Vinny Appice in for Bill Ward on drums. \"The Sign of the Southern Cross,\" \"Falling Off the Edge of the World,\" the title track. Less of a revelation than *Heaven and Hell* but a tighter, leaner record. Half this catalog was written for *Heavy Metal* the movie.",
  "1167520":
    "Dio-era live double LP, recorded on the *Mob Rules* tour, with both eras of the catalog represented — \"War Pigs\" and \"Iron Man\" alongside \"Heaven and Hell\" and \"Children of the Sea.\" The album that essentially ended the Dio era; the band split right after over disputed mixes of this very record.",
  "10427925":
    "Ian Gillan of Deep Purple on vocals, Bev Bevan of ELO on drums. The lineup nobody asked for and the album that's somehow brilliant in spite of itself. \"Disturbing the Priest,\" \"Trashed,\" \"Zero the Hero.\" The cover art alone earns the record's cult status.",
  "9040413":
    "Originally a Tony Iommi solo album, repackaged as Black Sabbath under label pressure — Glenn Hughes singing on most of it. \"In for the Kill,\" \"No Stranger to Love.\" More melodic and less doomy; nobody at the time knew what to do with it.",
  "7190174":
    "Tony Martin's debut as the Sabbath singer, after a few records of revolving-door lineups. \"The Shining,\" \"Ancient Warrior,\" the title track. A genuinely good record nobody listened to at the time — the start of a long underrated Martin-era stretch.",

  // ─── Deep Purple ─────────────────────────────────────────────────────────
  "12367722":
    "Mark I Deep Purple — Rod Evans on vocals, Nick Simper on bass, before the band figured out what it was. Heavy psych-prog covers (\"River Deep, Mountain High,\" Neil Diamond's \"Kentucky Woman\") padded out with originals. Closer in spirit to early Vanilla Fudge than to anything that came later. A curious historical document.",
  "394390":
    "The album that turned Deep Purple into Deep Purple. Mark II's debut — Gillan and Glover joining Blackmore, Lord, and Paice, the band tearing past prog into something faster, louder, more dangerous. \"Speed King,\" \"Child in Time,\" \"Flight of the Rat,\" \"Hard Lovin' Man.\" The blueprint for hard rock as a self-aware genre.",
  "12233833":
    "Another 1970 pressing of *In Rock* — same record, second early copy in the collection. The Mark II detonation that established the band as a force.",
  "6156597":
    "A 1973 repress of *In Rock* — pressed quickly to keep up with demand after *Machine Head* turned Mark II into a worldwide phenomenon.",
  "6628440":
    "A later reissue of the 1970 milestone — same album, fresh vinyl. The hard-rock blueprint pressed back to plastic for another generation.",
  "2170921":
    "Jon Lord's experiment — Mark II Deep Purple performing his composition with the Royal Philharmonic Orchestra at Royal Albert Hall, September 1969. A grand-folly hybrid that mostly works because the band was already operating at a different level by 1969. Repress pressing.",
  "3433692":
    "The often-overlooked Mark II album between *In Rock* and *Machine Head* — looser, weirder, and more eclectic than either. Title track is fast and frantic; \"No No No\" and \"Demon's Eye\" are deeper cuts that reward repeat listens. Gillan has called it his favorite of the run; the band moved past it too quickly.",
  "1149595":
    "A 2-LP compilation of Mark I material released in 1972 — the label trying to catch the wave of Mark II's success by repackaging the Rod Evans years. Worth it for the curiosity factor; the Mark I catalog otherwise gets quietly buried.",
  "13651670":
    "A 1972 compilation that mostly draws from the Mark I era — released as the band was hitting its commercial peak. The kind of label cash-grab that nonetheless makes a decent introduction to where the band came from.",
  "4428461":
    "The peak of Mark II and one of the best hard-rock records ever made. Recorded in a corridor of the Grand Hotel in Montreux after the casino burned down (that casino is on fire on the cover; the song is \"Smoke on the Water\"). \"Highway Star,\" \"Lazy,\" \"Space Truckin',\" \"Pictures of Home\" — every song great, the band locked in completely.",
  "394382":
    "Often cited as the greatest live rock album ever recorded — Mark II at the absolute apex, Osaka and Tokyo, August 1972. Twenty-minute \"Space Truckin',\" all-time-great versions of \"Highway Star,\" \"Smoke on the Water,\" \"Lazy.\" Recorded almost as a contractual afterthought; ended up defining how live albums were made for the rest of the decade.",
  "11165565":
    "A 1973 pressing of *Made in Japan* — second copy in the collection of the live double LP that defined the form.",
  "653558":
    "Mark II's last album before the lineup blew up — Gillan and Glover both done by the end of the year. Tense, fractured, with \"Woman from Tokyo\" carrying the record almost by itself. The sound of a band that knew it was over and made a record anyway.",
  "3234711":
    "Mark III's debut — David Coverdale on vocals, Glenn Hughes on bass and second vocals, more soul and funk in the mix without losing any of the heaviness. Title track is a stunner; \"Mistreated\" is the blues epic Coverdale would build a career on. The reinvention nobody expected to work.",
  "14913632":
    "Another 1974 pressing of *Burn* — Mark III's debut, second copy in the collection.",
  "12913770":
    "A third 1974 pressing of *Burn*. Coverdale and Hughes in, the band reinvented yet again, the riffs as sharp as ever.",
  "2138869":
    "Mark III's second and final album with Blackmore — funkier, soulier, less metal than *Burn*. \"Stormbringer,\" \"Lady Double Dealer,\" \"Soldier of Fortune.\" Blackmore famously hated the direction and quit shortly after; he wasn't necessarily wrong, but the record holds up better in retrospect than at the time.",
  "19667788":
    "Mark IV — Tommy Bolin in for Blackmore, the band leaning all the way into funk-rock and jam-band territory. \"Gettin' Tighter,\" \"You Keep On Moving,\" \"Comin' Home.\" Bolin was dead by the end of the next year and the band broke up; this album exists in a strange quarantine, neither classic Purple nor anything else.",
  "12996728":
    "Mark III live — recorded on the *Stormbringer* tour in 1975, released after the band had dissolved. The lineup nobody had fully appreciated until they were gone, captured at full power.",
  "15511177":
    "A 1978 compilation released after the band's first breakup, drawn from the Mark II–Mark III run. The sort of label-curated retrospective that exists to tide fans over until somebody figures out a reunion.",
  "8179694":
    "The Mark II reunion — Gillan, Blackmore, Glover, Lord, Paice all back, the band sounding genuinely re-energized for the first time in eleven years. \"Knocking at Your Back Door,\" \"Perfect Strangers,\" \"Wasted Sunsets.\" A reunion album that actually meant it; sold gold worldwide.",
  "13718279":
    "The Mark II reunion's second act, with the lineup tensions already audible — Blackmore and Gillan barely speaking by the end of the sessions. \"Bad Attitude,\" \"Call of the Wild,\" \"Hard Lovin' Woman.\" Less inspired than *Perfect Strangers* but still a serviceable late-period record.",
  "19946938":
    "Live double LP from the *House of Blue Light* tour — Mark II reunion captured before it fell apart again. A few missteps (a re-recorded \"Hush\" tacked on the end) but otherwise a solid live document of a band that could still play.",
  "2513871":
    "The 2006 remaster of the 1972 masterpiece — same songs, sharper sound, fresh vinyl. The version to play when you want *Machine Head* to sound the way modern speakers expect.",
  "3748921":
    "Mark V — Joe Lynn Turner replacing Gillan after the *House of Blue Light* fallout. A polarizing record that's essentially Rainbow with the rest of Deep Purple sitting in. \"King of Dreams,\" \"The Cut Runs Deep.\" Better than its reputation, but never going to please anyone who wanted Gillan.",
  "10782927":
    "Mark II back together one more time — written for Joe Lynn Turner, then re-recorded with Gillan after the label insisted on the classic lineup. Title track and \"Anya\" are strong; the band fell apart for good before the tour ended. Blackmore's last Deep Purple album.",

  // ─── Rush ────────────────────────────────────────────────────────────────
  "17476912":
    "The album that saved the band. Mercury was about to drop them after *Caress of Steel* tanked; the band responded by writing a 20-minute side-long sci-fi suite in defiance and putting it as side one. It worked — *2112* went platinum, established the Rush template, and bought them a permanent license to do whatever they wanted. Side two is shorter songs (\"A Passage to Bangkok,\" \"The Twilight Zone\"); side one is the foundation of the modern prog-rock fan's identity. Club Edition pressing.",
  "4911082":
    "A 1981 reissue of *2112* — pressed after Rush had become an arena act in their own right. Same album, fresh vinyl.",
  "14536870":
    "The first live album, recorded at Massey Hall in Toronto on the *2112* tour. The end of Rush's \"early\" era — the band before they became the Rush of *Permanent Waves* and *Moving Pictures*. Loud, bluesy, leaning hard on Zeppelin in places, but with the prog instincts already locked in.",
  "4125070":
    "The band leaving the *2112* template behind — synthesizers showing up, song structures more ambitious, the playing more refined. Title track is a peak; \"Closer to the Heart\" is the radio-ready song they always denied wanting; \"Xanadu\" is eleven minutes of Coleridge-via-Peart at his most decadent.",
  "5879158":
    "The most demanding Rush record. Side one is the 18-minute \"Cygnus X-1 Book II: Hemispheres\" — the most prog they ever got; side two has \"The Trees,\" \"La Villa Strangiato,\" and \"Circumstances.\" The album that nearly broke them — they reportedly almost quit during the sessions — and the album that prompted the deliberate course-correction that became *Permanent Waves*.",
  "589472":
    "A box set compiling the first three albums (*Rush*, *Fly by Night*, *Caress of Steel*) — released in 1978 as the band was hitting commercial liftoff. The proto-Rush years bundled together for the new fans who'd come in via *2112*.",
  "741593":
    "The pivot. Shorter songs, sharper hooks, synthesizers fully integrated, the band consciously stepping away from side-long suites and toward something the radio could actually play. \"The Spirit of Radio,\" \"Freewill,\" \"Jacob's Ladder,\" \"Natural Science.\" The album that opened the door to *Moving Pictures*.",
  "741607":
    "Live double LP recorded on the *Permanent Waves* and *Moving Pictures* tours — Rush at their absolute commercial peak, playing the songs that had just turned them into one of the biggest rock bands in the world. \"Tom Sawyer,\" \"Red Barchetta,\" \"YYZ,\" \"Closer to the Heart.\" Definitive live document of the imperial era.",
  "704218":
    "Synthesizers fully in charge, guitar pushed back in the mix, the start of the polarizing '80s Rush. \"Subdivisions,\" \"The Analog Kid,\" \"Digital Man,\" \"New World Man\" — the songwriting still razor-sharp under all the new textures. Lifeson hated it; everyone else loved it. The hinge of the catalog.",
  "783035":
    "Cold-war anxiety set to chorus pedals and Roland synths. Peter Henderson producing instead of Terry Brown for the first time. \"Distant Early Warning,\" \"Red Sector A,\" \"The Enemy Within,\" \"Afterimage.\" Maybe the most underrated record in the catalog — a band processing the '80s as the '80s were happening to them.",
  "2087598":
    "Peter Collins producing, the synth-heavy approach taken to its most refined point. \"The Big Money,\" \"Manhattan Project,\" \"Marathon,\" \"Mystic Rhythms.\" The drum sound that defines mid-'80s Rush; loved or hated depending on what you wanted from the band that year.",
  "4566171":
    "The most synth-saturated Rush album, Peter Collins still producing, Aimee Mann singing on \"Time Stand Still.\" \"Force Ten,\" \"Lock and Key,\" \"Mission.\" A polarizing record at the time and now — the absolute extreme of '80s Rush before the band started pulling back toward guitars again on *Presto*.",
  "5866160":
    "Live double LP from the *Hold Your Fire* tour — the synth-era Rush captured at its peak before the band consciously walked back from it. \"Subdivisions,\" \"Mission,\" \"Distant Early Warning.\" The capper to the entire 1980s in one document.",

  // ─── Judas Priest ────────────────────────────────────────────────────────
  "2283248":
    "The album that invented Judas Priest — fully formed twin-guitar attack, Halford finding his range, the band pulling away from the bluesier *Rocka Rolla* into something more theatrical and harder. \"Victim of Changes,\" \"The Ripper,\" \"Tyrant.\" A foundational metal document, often overlooked because the band hadn't broken yet. 1983 reissue pressing.",
  "8568738":
    "First album for CBS, with Roger Glover producing and Simon Phillips drumming. \"Sinner,\" \"Diamonds and Rust\" (a Joan Baez cover, somehow), \"Starbreaker,\" \"Dissident Aggressor.\" The band's first proper budget — tighter, louder, more polished than *Sad Wings*.",
  "14049341":
    "The album that ended up in court — the supposed subliminal-message lawsuit over \"Better by You, Better than Me.\" Beyond all that: one of the band's heaviest records. \"Exciter,\" \"Beyond the Realms of Death,\" \"Saints in Hell,\" the title track. Faster, more aggressive, the proto-speed-metal blueprint already drawn here.",
  "8569429":
    "The US title for *Killing Machine* — leather-and-studs Halford appearing on the cover for the first time, the band consciously building the visual identity that would carry them into the '80s. \"Hell Bent for Leather,\" \"Take On the World,\" \"Delivering the Goods,\" and the cover of Fleetwood Mac's \"The Green Manalishi\" that became a setlist permanent.",
  "10245319":
    "The live album — recorded in Japan, allegedly so heavily overdubbed in post-production that they should have called it \"Unleashed in the Studio.\" Doesn't matter. The performances are blistering, the song selection is the hits, and it's one of the great late-'70s live metal records. The album that set up *British Steel*.",
  "10150087":
    "The breakthrough. Streamlined, anthemic, the songs trimmed to single length — \"Breaking the Law,\" \"Living After Midnight,\" \"Metal Gods,\" \"United.\" The album that made Judas Priest a stadium band and gave the new wave of British heavy metal a commercial template.",
  "1167225":
    "The follow-up nobody talks about. *British Steel* with the swagger but less of the punch. \"Heading Out to the Highway,\" \"Hot Rockin',\" \"Desert Plains.\" Underrated — the band trying to figure out what to do after a hit, with one foot in the old anthem mode and one foot in something more relaxed.",
  "15260301":
    "The American breakthrough — multi-platinum on the back of \"You've Got Another Thing Comin',\" but the deep cuts are where the album lives. Title track, \"Electric Eye,\" \"(Take These) Chains,\" \"Riding on the Wind.\" The peak of the Tom Allom production era, and the album that made Judas Priest synonymous with metal in the US.",
  "2045602":
    "Same producer, same approach as *Screaming for Vengeance*, slightly less of a hit but in many ways a better record. \"Freewheel Burning,\" \"The Sentinel,\" \"Some Heads Are Gonna Roll,\" \"Rock Hard Ride Free.\" If *Screaming* had the singles, *Defenders* had the songs.",
  "2045593":
    "The synthesizer album. Halford and Tipton both deep into guitar synths, the band consciously chasing radio. \"Turbo Lover,\" \"Locked In,\" \"Parental Guidance.\" Polarizing then, recently rehabilitated as a perfect time capsule of '80s metal flirting with arena pop.",
  "2557143":
    "The double live album from the *Turbo* tour — the heaviest material reframed through the synth-era production, the new songs holding up better than expected. Less iconic than *Unleashed in the East*, more representative of where the band actually was at the peak.",
  "2754890":
    "The synth-era hangover record. Some songs originally intended for a *Turbo II* concept that got abandoned; the band consciously trying to harden up and not entirely succeeding. \"Ram It Down,\" \"Heavy Metal,\" \"Blood Red Skies.\" The transition to *Painkiller* — a record that's less than the sum of its parts but with real moments.",

  // ─── Rainbow ─────────────────────────────────────────────────────────────
  "4546304":
    "The debut. Blackmore quits Deep Purple, recruits Ronnie James Dio from Elf, builds a band around medieval themes and big riffs. \"Man on the Silver Mountain,\" \"Catch the Rainbow,\" \"Sixteenth Century Greensleeves.\" The template every neoclassical metal band has been working from since.",
  "5748800":
    "Eight songs, six on the album proper, the entire second side taken up by \"Stargazer\" and \"A Light in the Black\" — eight-and-a-half minutes of Cozy Powell, Dio, and Blackmore at their absolute peak. Argued for years to be the greatest hard rock album ever made, and the argument is harder to dismiss than it first sounds.",
  "6461597":
    "The first live album — Dio-era Rainbow on the *Rising* tour, Cozy Powell's drums miked like cannons, \"Mistreated\" and \"Catch the Rainbow\" stretched to ten and twelve minutes. Less iconic than the studio records but a definitive document of how this band actually sounded onstage.",
  "1419706":
    "Dio's last with Rainbow, Cozy Powell's last too — the band already pulling in two directions. \"Long Live Rock 'n' Roll,\" \"Kill the King,\" \"Gates of Babylon.\" Dio leaves for Black Sabbath right after; Rainbow becomes a different band.",
  "5125230":
    "The pivot. Graham Bonnet on vocals (briefly), Roger Glover producing and on bass, Blackmore deliberately writing for radio. \"Since You Been Gone\" is the calling card; \"All Night Long\" is the deeper cut. Sword-and-sorcery out, FM radio in.",
  "11873363":
    "A 12\" EP from the *Difficult to Cure* era — \"Jealous Lover\" being one of Joe Lynn Turner's finest moments with the band. Short, slick, very 1981.",
  "6349293":
    "The label-curated Rainbow comp from 1981 — basically a cherry-picked retrospective covering Dio through Bonnet through Joe Lynn Turner. A snapshot of a band that was three different bands by then.",
  "1880712":
    "Joe Lynn Turner's debut on vocals — Rainbow as full-on AOR machine. \"I Surrender,\" \"Spotlight Kid,\" the title track (a metallized take on Beethoven's 9th). The album that proved Blackmore could write for the radio when he wanted to.",
  "10501123":
    "More Joe Lynn Turner, more polish. \"Stone Cold,\" \"Power,\" \"Death Alley Driver.\" The best of the Turner-era studio albums; tighter and harder than what came before or after.",
  "2150378":
    "The 12\" single from *Bent Out of Shape* — \"Street of Dreams\" being the best song from that record and the last great Joe Lynn Turner-era Rainbow track.",
  "3415465":
    "The last Rainbow studio album before the first breakup. Joe Lynn Turner still on vocals, the songwriting starting to thin. \"Street of Dreams\" is the obvious peak; the rest is uneven. Blackmore reunites with Deep Purple right after.",
  "3896348":
    "A Soviet-pressed Rainbow compilation released in 1989 — the kind of artifact only collectors care about, an oddity from the brief late-Cold-War window when Western rock got officially licensed for Russian shelves.",

  // ─── Led Zeppelin ────────────────────────────────────────────────────────
  "4280370":
    "The debut. Recorded in 36 hours, three weeks after the Yardbirds folded, with John Paul Jones and Page already playing studio work together. \"Good Times Bad Times,\" \"Dazed and Confused,\" \"Babe I'm Gonna Leave You,\" \"Communication Breakdown.\" Heavy blues turned up to volumes nobody had quite reached yet. Year zero of a different kind of rock.",
  "13018792":
    "The breakthrough. Recorded on the road during their second American tour. \"Whole Lotta Love,\" \"Heartbreaker,\" \"Ramble On,\" \"Bring It On Home.\" The blues turned into something else entirely — louder, weirder, more sexual, more confident. Knocked the Beatles' *Abbey Road* off the top of the charts.",
  "738727":
    "The acoustic-leaning record nobody expected after II. Side one is rock; side two is folk and acoustic. \"Immigrant Song,\" \"Since I've Been Loving You,\" \"Gallows Pole,\" \"That's the Way.\" The album that proved they were a real band, not a one-trick volume act. 1977 reissue pressing.",
  "5262145":
    "Four (the runes album, IV, ZoSo). The album with \"Stairway.\" Also \"Black Dog,\" \"Rock and Roll,\" \"When the Levee Breaks,\" \"Going to California,\" \"The Battle of Evermore.\" Twenty-three million copies sold in the US alone. The mountain everyone else has been climbing ever since. 1977 reissue.",
  "12499040":
    "The most underrated Zeppelin record. \"The Song Remains the Same,\" \"The Rain Song,\" \"Over the Hills and Far Away,\" \"No Quarter,\" \"Dancing Days,\" \"The Ocean.\" Lighter on its feet than IV — funkier, more playful, still totally crushing when it wants to be.",
  "4756019":
    "The dark, anxious, all-rock record made under duress — Robert Plant in a wheelchair after his Greek car accident, Page's heroin use accelerating, the whole album recorded in eighteen days. \"Achilles Last Stand\" is one of their greatest songs; the rest is leaner and meaner than usual.",
  "12116462":
    "The soundtrack to the live film, recorded at Madison Square Garden in 1973. Stretched-out, indulgent, definitive of the live Zeppelin myth — \"Dazed and Confused\" goes on for 26 minutes. Loved by fans, dismissed by Page himself, fascinating either way.",
  "9073292":
    "The last proper studio album. John Paul Jones drives the songwriting via the Yamaha GX-1 synthesizer; Page is comparatively absent. \"All My Love,\" \"Fool in the Rain,\" \"In the Evening.\" Polarizing then, much better-loved now — the album that briefly suggested where the band might have gone if Bonham hadn't died a year later.",
  "18861868":
    "The 2020 remastered reissue of IV — same album, fresh vinyl, sharper sound. The way to hear \"When the Levee Breaks\" rattle the room without sacrificing your original pressing.",

  // ─── Van Halen ───────────────────────────────────────────────────────────
  "6256253":
    "The debut. Eddie Van Halen's right-hand-tapping changed how the guitar worked; \"Eruption\" alone reset what people thought was possible. \"Runnin' with the Devil,\" \"You Really Got Me,\" \"Ain't Talkin' 'Bout Love,\" \"Jamie's Cryin'.\" Recorded in three weeks for $50,000. Year zero of a different kind of hard rock.",
  "5593596":
    "The follow-up, made fast and confident. \"Dance the Night Away,\" \"Beautiful Girls,\" \"D.O.A.,\" \"Spanish Fly\" (the acoustic answer to \"Eruption\"). Less revelatory than the debut, but tighter and more melodic; the band figuring out it could be a singles act too.",
  "4826240":
    "The heaviest of the Roth-era records. \"And the Cradle Will Rock...,\" \"Everybody Wants Some!!,\" \"Romeo Delight.\" Less radio-friendly than what surrounded it; the band openly chasing the harder, weirder material the live shows demanded.",
  "9974995":
    "The dark album. Ted Templeman producing again but the band actively pushing back against him — Eddie reportedly sneaking back into the studio at night to lay down his own takes. \"Mean Street,\" \"Unchained,\" \"So This Is Love?\" The fans' Van Halen record; the one nobody outside the cult talks about.",
  "4098189":
    "The covers album, basically — half originals and half covers (\"(Oh) Pretty Woman,\" \"Dancing in the Street,\" \"Where Have All the Good Times Gone!\"), assembled fast to extend the contract with Warner. Eddie hated it. The deep cuts are stronger than the famous parts.",
  "7266248":
    "The commercial peak. \"Jump\" is the calling card — Eddie playing the synth nobody wanted him to play — but the album is \"Panama,\" \"Hot for Teacher,\" \"I'll Wait,\" \"Top Jimmy.\" The album that broke them on MTV; the album that Roth left after.",
  "2375327":
    "Sammy Hagar's debut. Different singer, different band, different era. \"Why Can't This Be Love,\" \"Best of Both Worlds,\" \"Dreams,\" \"Love Walks In.\" Diamond on first release, polarizing forever after — \"Van Hagar\" or the band's commercial second wind, depending on which side you're on. Club Edition pressing.",
  "3917169":
    "Hagar's second. Title is \"Oh, you ate one, too?\" — the cover of *1984* with one number changed. \"When It's Love,\" \"Black and Blue,\" \"Finish What Ya Started.\" Smoother than *5150*, less stadium-anthemic, more grown-up. Club Edition pressing.",
  "8000391":
    "Another 1988 pressing of *OU812* — same album, second copy in the collection.",

  // ─── The Who ─────────────────────────────────────────────────────────────
  "402897":
    "The first proper rock opera — eighty-five minutes of Pete Townshend's deaf-dumb-and-blind-kid concept, including \"Pinball Wizard,\" \"I'm Free,\" \"We're Not Gonna Take It,\" \"Acid Queen.\" Pretentious as designed; vindicated commercially and critically; spawned a film, a Broadway show, and a thousand imitators.",
  "13488595":
    "The greatest Who album, by most reasonable measures. \"Baba O'Riley,\" \"Bargain,\" \"Behind Blue Eyes,\" \"Won't Get Fooled Again.\" Salvaged from the abandoned *Lifehouse* concept, mixed with synthesizer experiments that nobody else was doing yet. The starting point for almost every \"best rock album of the '70s\" list.",
  "3348574":
    "The other rock opera — Pete Townshend writing a four-personality concept around a young mod in Brighton, with each member getting a \"theme\" leitmotif. \"5:15,\" \"The Real Me,\" \"Love, Reign O'er Me.\" Sprawling, overreaching, completely worth the patience.",
  "4948990":
    "The midlife-crisis album. Townshend at his most exposed and self-loathing, the band leaning into a sparer rock sound. \"Squeeze Box,\" \"Slip Kid,\" \"However Much I Booze.\" Often dismissed as a transitional record; rewards a re-listen.",
  "14747951":
    "The last album with Keith Moon (who died two weeks after release). \"Who Are You,\" \"Sister Disco,\" \"New Song.\" Synthesizers everywhere, Moon clearly in decline behind the kit, the band sounding both very 1978 and like the end of something. It was.",
  "1126210":
    "Soundtrack to the documentary of the same name — an anthology pulled from years of Who live footage and TV appearances. More compilation than album, but a great one if you want the band as a live act in one place.",
  "4872192":
    "*The* live document. February 14, 1970, six songs on the original release (\"Heaven and Hell,\" \"Substitute,\" \"Magic Bus,\" etc.), all of them blistering. Often called the greatest live rock album ever made; rarely successfully argued against.",
  "7316250":
    "The last Who album with John Entwistle, the second with Kenney Jones replacing Moon. \"Eminence Front,\" \"Athena,\" the title track. Mixed reviews then; the band quietly retired right after. Worth it for \"Eminence Front\" alone.",
  "26398610":
    "The other 1970 Who live recording — Isle of Wight Festival, the last great UK Sixties festival. *Tommy* performed in full, plus everything else they had. Released decades later because they finally made the call to put it out. Special edition pressing.",

  // ─── ZZ Top ──────────────────────────────────────────────────────────────
  "12171349":
    "The debut. Already the lineup that would never change — Billy Gibbons, Dusty Hill, Frank Beard. Texas blues-rock with horns and harmonica; the songwriting still finding itself, the swagger already locked in. \"(Somebody Else Been) Shaking Your Tree,\" \"Brown Sugar.\"",
  "5399645":
    "The breakthrough. \"La Grange,\" \"Beer Drinkers & Hell Raisers,\" \"Jesus Just Left Chicago.\" The album that turned ZZ Top from a regional Texas band into a national one — and the album that more or less invented the Southern blues-boogie sound.",
  "7859625":
    "Half live (recorded at the Warehouse in New Orleans), half studio. \"Tush\" is on side two; side one is the live half, with extended takes of \"Thunderbird\" and \"Backdoor Medley.\" Half a band's career on one record.",
  "766667":
    "The comeback after a three-year hiatus. The beards arrive; the sound stays loose and bluesy. \"I Thank You,\" \"Cheap Sunglasses,\" \"I'm Bad, I'm Nationwide.\" The album where the band finds the visual identity that would carry them through the MTV era.",
  "4944475":
    "The transition record. Synthesizers showing up, drum patterns getting more processed, the band quietly preparing for *Eliminator*. \"Tube Snake Boogie,\" \"Pearl Necklace,\" \"Leila.\" Underrated; the bridge between blues-rock ZZ Top and MTV ZZ Top.",
  "10924067":
    "The phenomenon. Synthesizers and Linn drums layered over Gibbons riffs, MTV in heavy rotation, the '33 Ford coupe on the cover. \"Gimme All Your Lovin',\" \"Sharp Dressed Man,\" \"Legs,\" \"Got Me Under Pressure.\" Diamond status, the album that turned three Texas blues-rockers into the biggest band on TV.",
  "4966361":
    "The follow-up to *Eliminator*. More synthesizers, more drum machines, the formula refined past the point of subtlety. \"Sleeping Bag,\" \"Stages,\" \"Rough Boy.\" Multi-platinum despite being slightly less of a moment than its predecessor; the peak of ZZ Top as MTV act.",
  "1924379":
    "The last of the synth-era trilogy — the band easing back toward live drums and guitars but not all the way. \"Doubleback\" (from *Back to the Future III*), \"Concrete and Steel,\" \"Give It Up.\" The pivot record before *Antenna* in '94.",
  "24111257":
    "The soundtrack to the 2019 documentary *That Little Ol' Band From Texas* — stripped-down studio recordings of the catalog by the original trio, made shortly before Dusty Hill died. The band as a live thing, in a quiet room, playing the songs once more.",

  // ─── The Beatles ─────────────────────────────────────────────────────────
  "5475892":
    "The American debut LP, Capitol's quick re-sequencing of *With the Beatles* for the US market. \"I Want to Hold Your Hand,\" \"I Saw Her Standing There,\" \"All My Loving.\" The album that triggered Beatlemania in the States; cover photo by Robert Freeman.",
  "380811":
    "Vee-Jay's earlier-but-shadier US release of essentially *Please Please Me* — the album Capitol hadn't yet decided was worth the trouble. \"Twist and Shout,\" \"I Saw Her Standing There,\" \"Love Me Do.\" A tangled rights story; a great record regardless.",
  "2609020":
    "Capitol's third US rework — pulling tracks from *With the Beatles* and *A Hard Day's Night* B-sides into a cobbled-together LP. \"She Loves You,\" \"Roll Over Beethoven,\" \"Long Tall Sally.\" Of historical interest; a Frankenstein of an album that still hits hard.",
  "13143466":
    "The first soundtrack and the first Beatles album of all originals. \"A Hard Day's Night,\" \"Can't Buy Me Love,\" \"And I Love Her,\" \"If I Fell.\" George Harrison's twelve-string Rickenbacker defining the chime of folk-rock to come. The peak of early-period Beatles as a singles band.",
  "1406835":
    "The Red Album. Double-LP comp of the early Beatles, sequenced by George Martin — every essential single from the early period in one place. Ubiquitous on '70s shelves for a reason.",
  "28975849":
    "The Blue Album. Companion comp covering the late Beatles. \"Strawberry Fields Forever,\" \"A Day in the Life,\" \"Hey Jude,\" \"Let It Be.\" Together with the Red Album, the standard Beatles introduction for half a generation.",
  "20610742":
    "The 2021 reissue of *Let It Be*, contemporary with the *Get Back* documentary release. \"Get Back,\" \"Across the Universe,\" \"The Long and Winding Road,\" the title track. Phil Spector's much-disputed final mixing job; still a great record despite all the surrounding chaos.",

  // ─── Metallica ───────────────────────────────────────────────────────────
  "17156098":
    "The debut. The album that essentially invented thrash metal as a commercially viable thing. \"Hit the Lights,\" \"The Four Horsemen,\" \"Whiplash,\" \"Seek & Destroy.\" Rough, fast, raw — a band figuring out what they could do, and what they could do was a lot. Kirk Hammett's debut after replacing Dave Mustaine right before the recording. 2021 reissue.",
  "17156179":
    "The leap. Ambition, dynamics, more elaborate songwriting. \"Fight Fire with Fire,\" \"For Whom the Bell Tolls,\" \"Fade to Black,\" \"Creeping Death.\" The album where Metallica becomes more than thrash — and where everyone who comes after has to figure out how to be more than thrash too. 2021 reissue.",
  "17161708":
    "The peak. Eight songs, fifty-five minutes, every one of them landmark. \"Battery,\" \"Master of Puppets,\" \"Welcome Home (Sanitarium),\" \"Disposable Heroes,\" \"Orion,\" \"Damage, Inc.\" Cliff Burton's last album; the last record they made before the bus crash that killed him. Often called the greatest metal album ever made. 2021 reissue.",
  "17179330":
    "Jason Newsted's debut, the bass infamously buried in the mix, the songs longer and more progressive. \"Blackened,\" \"...And Justice for All,\" \"One,\" \"Harvester of Sorrow.\" The album where Metallica started getting MTV play (the \"One\" video) but also the album the band would later partially disavow over the production. 2021 reissue.",
  "11855130":
    "Five covers (Diamond Head, Holocaust, Killing Joke, Budgie, the Misfits) recorded fast in 1987 to break in Jason Newsted. The price was the title; the spirit was the point. A band proudly showing where it came from. 2018 reissue.",
  "16476591":
    "The Black Album. Sixteen million copies sold in the US, the album that turned a thrash band into the biggest rock band in the world. \"Enter Sandman,\" \"Sad But True,\" \"The Unforgiven,\" \"Nothing Else Matters,\" \"Wherever I May Roam.\" Hated by purists, vindicated by everything that came after. 2021 reissue.",
  "26759282":
    "The most recent studio album. Greg Fidelman producing again, Metallica deep into late-period mode but still energetic. The title track and \"Lux Æterna\" are the calling cards; \"Inamorata\" is an 11-minute closer. Forty years into the career and the band can still make a record worth listening to. Deluxe edition pressing.",

  // ─── Aerosmith ───────────────────────────────────────────────────────────
  "1256530":
    "The debut. \"Dream On\" — already there on side one. The band still finding itself between Rolling Stones blues and the harder thing they were about to become. \"Mama Kin,\" \"Walking the Dog,\" \"One Way Street.\" Recorded in two weeks for $50,000.",
  "14566233":
    "Jack Douglas producing, the band tightening up. \"Same Old Song and Dance,\" \"Lord of the Thighs,\" the Yardbirds' \"Train Kept A-Rollin'\" cover that became a setlist permanent. The leap from debut to actual band.",
  "2404362":
    "The breakthrough. \"Walk This Way,\" \"Sweet Emotion,\" the title track, \"Big Ten Inch Record.\" The album where everything clicked — songwriting, swagger, production. The point at which Aerosmith became Aerosmith.",
  "16065313":
    "The fans' Aerosmith record. Heavier and meaner than *Toys in the Attic*. \"Back in the Saddle,\" \"Last Child,\" \"Sick as a Dog,\" \"Nobody's Fault.\" Slash and James Hetfield have both cited this as their favorite hard-rock album, which is reason enough.",
  "1362671":
    "The decadence album — the band recording in an abandoned convent in upstate New York while their substance use spiraled. \"Draw the Line,\" \"Kings and Queens,\" \"Get It Up.\" Less consistent than the previous two but with great moments; the start of the long fall.",
  "8349226":
    "Joe Perry quits during the sessions; Jimmy Crespo replaces him for the rest. The band openly falling apart in the studio. \"Remember (Walking in the Sand),\" \"Chiquita.\" The end of the original lineup; the beginning of the wilderness years.",
  "752892":
    "The 1980 Columbia compilation that kept the band on radio rotation while everything offstage was collapsing. \"Walk This Way,\" \"Sweet Emotion,\" \"Dream On,\" \"Back in the Saddle.\" The album that quietly held the catalog together until *Done with Mirrors*.",
  "8184416":
    "The reunion record — Joe Perry and Brad Whitford back, Steven Tyler still in active addiction, the album sounding tentative for it. \"Let the Music Do the Talking,\" \"My Fist Your Face.\" Not the comeback; the comeback would come with *Permanent Vacation* and Run-DMC. But the start of one.",

  // ─── The Sword ───────────────────────────────────────────────────────────
  "18800353":
    "The debut. Black Sabbath worship transmuted into 21st-century Texas stoner-doom. \"Freya,\" \"Winter's Wolves,\" \"The Horned Goddess.\" The riffs are why. RSD limited reissue pressing.",
  "26182202":
    "The second album, doom expanded into more elaborate songcraft. \"Maiden Mother and Crone,\" \"How Heavy This Axe,\" \"Lords.\" The album that established The Sword as more than another retro-Sabbath act. RSD reissue.",
  "2895067":
    "Their third album and the prog turn — a sci-fi concept record about a marksman exiled from his home planet, the riffs slimming down without losing weight. \"Tres Brujas,\" \"Acheron/Unearthing the Orb,\" \"Lawless Lands.\" The Sword leaving doom for something more melodic and Rush-ier.",
  "25476232":
    "Their fourth and arguably their most balanced record — heaviness restored, the *Warp Riders* prog instincts kept. \"The Veil of Isis,\" \"Cloak of Feathers,\" the title track. The peak of the Metal Blade era.",
  "7377430":
    "The big departure — country-rock, southern boogie, '70s AOR textures. Polarizing then; rewards patience now. \"High Country,\" \"Empty Temples,\" \"Mist & Shadow.\" Less metal, more Texas.",
  "10234021":
    "Live album recorded on tour, covering material from across the catalog with the *High Country*-era five-piece lineup. The transitional document.",
  "11743880":
    "The last studio album before the indefinite hiatus. Synthesizers and electronics layered into the sound, the band still pulling in the prog/AOR direction. \"Deadly Nightshade,\" \"Twilight Sunrise,\" \"Don't Get Too Comfortable.\"",
  "15455212":
    "A double-LP compilation released after the band went on hiatus — the best of the Metal Blade years collected for new arrivals. The ideal Sword starter pack.",

  // ─── Me First and the Gimme Gimmes ───────────────────────────────────────
  "24447305":
    "The debut. Soft-rock standards put through the punk meat grinder — \"Sweet Caroline,\" \"Mandy,\" \"Rocket Man,\" \"Country Roads.\" The album that proved the joke had legs. 2022 reissue.",
  "543143":
    "The Broadway album. Fat Mike's punk supergroup taking on showtunes — \"Phantom of the Opera,\" \"The Sound of Music,\" \"Cabaret,\" \"Tomorrow.\" A more conceptually committed record than the formula deserved.",
  "1112281":
    "The '60s folk and protest album. \"Blowin' in the Wind,\" \"I Got You Babe,\" \"Mrs. Robinson,\" \"Where Have All the Flowers Gone.\" Same trick, different reference texts; works because the Gimme Gimmes can actually play.",
  "957108":
    "The live-at-a-bar-mitzvah album. Recorded in Long Island, kid named Jonny in attendance, the band tearing through the catalog as a hired bar mitzvah act. Concept entirely as advertised.",
  "2070186":
    "The country album. \"Why Don't We Get Drunk,\" \"Annie's Song,\" \"End of the Road\" (Boyz II Men, kind of country). Loose and shaggier than the earlier theme records — late-period Gimme Gimmes settling into the bit.",
  "5180857":
    "The companion to *Have a Ball* — singles released around the same time as the debut, finally collected on one LP. \"Sweet Caroline,\" \"Country Roads,\" \"I Believe I Can Fly.\" The Gimme Gimmes' funniest run.",
  "2686117":
    "A 7\" EP of Australian-music covers — Men at Work, AC/DC, Air Supply. Brief, unessential, exactly what a Gimme Gimmes EP should be.",

  // ─── Alice Cooper ────────────────────────────────────────────────────────
  "18486484":
    "The band's third album and the breakthrough. \"Under My Wheels,\" \"Be My Lover,\" \"Halo of Flies,\" \"Dead Babies.\" Bob Ezrin producing and bringing the theatrical density that would define everything after. The album that turned them from regional weirdos into the most threatening band on radio.",
  "4062880":
    "The peak. The band at their commercial and creative apex — \"Elected,\" \"No More Mr. Nice Guy,\" \"Billion Dollar Babies,\" \"Hello Hooray,\" \"I Love the Dead.\" Bob Ezrin still producing. The album that capped the original-band era.",
  "9804138":
    "The last album by the original band — recorded under deteriorating conditions, Ezrin no longer producing, Cooper already drifting toward the solo career. \"Big Apple Dreamin' (Hippo),\" \"Teenage Lament '74,\" the title track. Polarizing; better than its reputation.",
  "2567456":
    "Greatest hits from the original-band era. \"School's Out,\" \"I'm Eighteen,\" \"No More Mr. Nice Guy,\" \"Elected,\" \"Billion Dollar Babies.\" The transitional artifact — released as the band dissolved and Vincent Furnier became Alice Cooper full-time.",
  "2749414":
    "The solo debut. Bob Ezrin back, the Lou Reed/Hunter Ronson rhythm section as backing band, Vincent Price on the title track. \"Only Women Bleed,\" \"Welcome to My Nightmare,\" \"Department of Youth.\" A theatrical concept album that doubled as a TV special and a tour. The new template.",
  "2125787":
    "Live album from the *Welcome to My Nightmare* / *Lace and Whiskey* tour — half greatest hits, half new material, the theatrical show captured in audio form.",
  "7287449":
    "The autobiographical alcoholism album, written with Bernie Taupin while Cooper was getting sober in a sanitarium. \"How You Gonna See Me Now\" was the hit; the rest is some of the most emotionally exposed work in his catalog.",
  "8228167":
    "The new-wave Alice Cooper. Roy Thomas Baker producing (Queen, the Cars), the band leaning into power-pop and synthesizers. \"Clones (We're All),\" \"Pain,\" \"Dance Yourself to Death.\" Polarizing then, intriguing now — Cooper trying to figure out where he fit in the post-punk era.",
  "6232522":
    "The deeper end of the new-wave era. Roy Thomas Baker out, Richard Podolor producing. \"Who Do You Think We Are,\" \"You Want It, You Got It.\" Less commercial than *Flush the Fashion*, less coherent overall; the start of what fans call the \"blackout albums\" — Cooper drinking heavily, recording mostly on autopilot.",
  "8855687":
    "The blackout-era nadir. Cooper has said he doesn't remember making this record. \"Zorro's Ascent,\" \"I Like Girls,\" \"I'm the Coolest.\" A fascinating curio for completists; nobody's idea of a great Alice Cooper album.",
  "22988168":
    "The industrial-metal Alice Cooper album. Bob Marlette producing, the band leaning hard into Marilyn Manson's tonal palette. \"Brutal Planet,\" \"Gimme,\" \"Wicked Young Man.\" Polarizing as everything from this stretch, but a genuinely good record. RSD reissue pressing.",

  // ─── Weezer ──────────────────────────────────────────────────────────────
  "4760354":
    "The 2013 Mobile Fidelity reissue of the 1994 Blue Album — the debut, one of the most influential rock albums of the '90s. \"Buddy Holly,\" \"Undone (The Sweater Song),\" \"Say It Ain't So,\" \"My Name Is Jonas.\" Numbered limited edition.",
  "9258455":
    "Released seven months after the Green Album, recorded by the band themselves, much heavier and looser. \"Dope Nose,\" \"Keep Fishin',\" \"Slob.\" A polarizing record that's quietly become one of the fan favorites of the early 2000s era.",
  "9258477":
    "The album with \"Beverly Hills\" — for many fans, the breaking point with mainstream Weezer. Rick Rubin producing. Better than its reputation; the singles overshadowed a deeper record.",
  "12965199":
    "Sixth album, Jorge Garcia from *Lost* on the cover. Looser, faster, after the *Raditude* commercial flop. \"Memories,\" \"Ruling Me,\" \"Where's My Sex?\" Underrated — one of the more enjoyable post-Green Album records.",
  "6160805":
    "The \"back to basics\" Weezer album, Ric Ocasek producing one more time. \"Back to the Shack,\" \"Cleopatra,\" \"The British Are Coming.\" A conscious course-correction after the Raditude/Hurley/Make Believe years; the album that started the late-period rehabilitation.",
  "17272615":
    "The orchestral acoustic album — strings instead of guitars, recorded during the pandemic. \"All My Favorite Songs,\" \"Aloo Gobi,\" \"Numbers.\" A quiet masterpiece in an unexpected register; the kind of late-period Weezer record that reminds you why they earned the cult in the first place.",

  // ─── The Dickies ─────────────────────────────────────────────────────────
  "1352870":
    "A 10\" promo maxi-single with three early Dickies cuts. \"Paranoid\" (Black Sabbath, sped up to insane tempo), \"Hideous\" (Banana Splits theme adapted), \"You Drive Me Ape.\" Pure early-Dickies sensibility distilled.",
  "1118743":
    "The debut. Punk-pop covers (\"Paranoid,\" \"Eve of Destruction\") and originals at impossible tempo, Leonard's high-pitched vocals over Stan Lee's bubblegum songwriting. \"Give It Back,\" \"Mental Ward,\" \"Curb Job.\" Foundational LA punk.",
  "14379422":
    "The follow-up. Cleaner production, slightly slower tempos, more polished pop-punk. \"Manny, Moe & Jack,\" \"Nights in White Satin\" (an unexpected cover), \"Fan Mail.\" Less raw than the debut, in some ways more consistent.",
  "23846681":
    "The third album, post-original-lineup chaos. The title track is one of their best. The album that started the long stretch where the Dickies kept being the Dickies on a smaller scale. 2022 reissue.",
  "26463089":
    "The 12\" of the title track from the cult horror movie soundtrack — the Dickies' best-known late-period song. Reissued for a new generation.",
  "21161209":
    "The mid-'90s Dickies record. The catalog still moving, the songwriting still recognizable, the production catching up to the era. \"I'm Stuck in a Pagoda with Tricia Toyota,\" \"I'm on Crack.\" The kind of record that exists for the people who never stopped caring. 2021 reissue.",
  "6798372":
    "The five-piece era of the Dickies captured live in Trenton, NJ — old material at full speed, the band caught at one of the great early-'80s East Coast punk venues.",

  // ─── Stray Cats ──────────────────────────────────────────────────────────
  "1334296":
    "The UK debut, the album that launched them in Britain before America caught on. \"Runaway Boys,\" \"Rock This Town,\" \"Stray Cat Strut.\" The full rockabilly revival in one record — Dave Edmunds producing, the trio playing like a band raised on Eddie Cochran and Gene Vincent.",
  "1346627":
    "The second UK album — released the same year as the debut, with \"You Don't Believe Me\" and a more wide-ranging sense of what rockabilly could include. Less famous than the debut, with deeper-cut character.",
  "525919":
    "The US compilation — pulled from the first two UK albums to introduce the Stray Cats to America. \"Rock This Town\" and \"Stray Cat Strut\" both went top 10; the album went triple platinum. The launchpad for the entire rockabilly revival of the early '80s.",
  "8679677":
    "The 12\" of \"Stray Cat Strut\" — one of the band's two signature songs and one of the most distinctive vocal hooks of the early '80s.",
  "637306":
    "The proper second American album — \"(She's) Sexy + 17,\" \"I Won't Stand in Your Way.\" The record that proved the band could write songs as good as the singles. Followed by a hiatus.",
  "2295533":
    "The reunion album after the late-'80s breakup. Less of a moment than the early run; the band still playing tight rockabilly, the world having moved on.",

  // ─── Elvis Costello ──────────────────────────────────────────────────────
  "13408424":
    "The debut. Recorded with American band Clover backing him, Nick Lowe producing. \"Alison,\" \"Watching the Detectives,\" \"(The Angels Wanna Wear My) Red Shoes,\" \"Less Than Zero,\" \"Mystery Dance.\" A lean, angry, hooky debut — the album that announced Costello as the most caustic songwriter of the new wave.",
  "747149":
    "The first album with the Attractions — the lineup that would define his sound for the next decade. Faster, harder, angrier than *My Aim Is True*. \"Pump It Up,\" \"Radio, Radio,\" \"(I Don't Want to Go to) Chelsea,\" \"Lipstick Vogue.\" His pure punk-pop peak.",
  "13127156":
    "The third album, with the Attractions, songs about love-as-fascism and politics-as-romance. \"Oliver's Army,\" \"Accidents Will Happen,\" \"Two Little Hitlers,\" \"(What's So Funny 'Bout) Peace, Love, and Understanding.\" His most commercially successful early album.",
  "1040850":
    "The soul album. Twenty songs in fifty minutes, Costello and the Attractions doing Stax/Volt R&B at punk-band intensity. \"I Can't Stand Up for Falling Down,\" \"High Fidelity,\" \"New Amsterdam,\" \"Riot Act.\" Polarizing then, recognized now as one of his best.",
  "400441":
    "A US-only compilation of singles, B-sides, and outtakes from 1977-1980 — the songs that didn't fit on the proper albums. As good as a \"leftovers\" compilation can be when the leftovers are this strong. \"Girls Talk,\" \"Just a Memory,\" \"Hoover Factory.\"",
  "6377116":
    "The transitional album. Costello pulling away from the pure speed-and-aggression of the previous records, the songs more melodic and ambivalent. \"Watch Your Step,\" \"Clubland,\" \"From a Whisper to a Scream.\" The bridge between *Get Happy!!* and *Imperial Bedroom*.",
  "8520411":
    "The country album. Costello and the Attractions covering classic country songs in Nashville, Billy Sherrill producing. \"A Good Year for the Roses,\" \"Sweet Dreams,\" \"Sittin' and Thinkin'.\" Polarizing in 1981; vindicated since. The album that prefigured all the genre-pivots to come.",
  "448757":
    "The masterpiece. Geoff Emerick (Beatles engineer) producing, the songwriting more elaborate, the arrangements more orchestral. \"Beyond Belief,\" \"Man Out of Time,\" \"Almost Blue,\" \"Pidgin English.\" Often cited as his finest album; the case is hard to argue against.",
  "3723395":
    "The pop album. Clive Langer and Alan Winstanley producing, brass and TKO Horns added, Costello writing for radio. \"Everyday I Write the Book,\" \"Pills and Soap,\" \"Shipbuilding.\" Polarizing; the singles were big, the deep cuts hold up.",
  "7720321":
    "The album Costello himself called \"our worst album.\" Disowned by its maker but reissued anyway. \"The Only Flame in Town,\" \"Peace in Our Time,\" \"I Wanna Be Loved.\" Better than its reputation if you can get past the producer's glossy '80s mix. 2015 reissue.",
  "1277129":
    "The American roots-rock album, recorded with the legendary T-Bone Burnett band (Jerry Scheff, James Burton, Jim Keltner). \"Brilliant Mistake,\" \"American Without Tears,\" \"I'll Wear It Proudly,\" \"Indoor Fireworks.\" Released as \"The Costello Show\" to signal the new direction. One of his finest records.",
  "1133528":
    "Recorded back-to-back with *King of America*, the Attractions reunited, Nick Lowe producing one last time. Loud, angry, raw. \"Uncomplicated,\" \"Tokyo Storm Warning,\" \"I Want You\" (the latter a six-minute slow-burning masterwork). The end of the original Attractions era.",
  "1931040":
    "The first major-label record post-Attractions. Big production, lots of guest stars (Paul McCartney co-wrote two songs). \"Veronica,\" \"Tramp the Dirt Down,\" \"God's Comic.\" Sprawling; underrated; the start of the long, ambitious post-Attractions era.",

  // ─── Robert Gordon ───────────────────────────────────────────────────────
  "3531189":
    "The 1977 debut, reissued in 1979. Gordon and Wray together: pure rockabilly revivalism done by people who'd lived through the original — \"Red Hot,\" \"Sweet Love on My Mind,\" \"The Way I Walk.\" Foundational document of the late-'70s rockabilly revival that made the Stray Cats possible.",
  "1390339":
    "The second Robert Gordon / Link Wray album. Rockabilly revival, Wray on lead guitar, Gordon channeling Elvis circa 1956. \"Fire\" (the Bruce Springsteen song; this version pre-dates the Pointer Sisters' hit), \"20 Flight Rock,\" \"I'm Coming Home.\"",
  "1855355":
    "The first album without Link Wray, with Chris Spedding stepping in on guitar. \"Rock Billy Boogie,\" \"Black Slacks,\" \"Lonesome Train (On a Lonesome Track).\" The transition; Gordon proving he could carry it without Wray.",
  "2064803":
    "More Spedding, more rockabilly. \"Bad Boy,\" \"Walk on By.\" The middle Robert Gordon record, less essential than the bookends but very enjoyable.",
  "1856019":
    "Title track was a near-hit. Marshall Crenshaw on rhythm guitar, the production tightening up. \"Someday, Someway\" (a Crenshaw song, before Crenshaw recorded it himself). One of the better Spedding-era Gordon records.",
  "2575780":
    "The compilation that wrapped up Gordon's RCA years. The cleanest introduction to a deeply '70s/'80s artist who happened to be playing 1956 music with conviction.",

  // ─── The Cars ────────────────────────────────────────────────────────────
  "190219":
    "The debut — basically a greatest-hits album by accident. \"Just What I Needed,\" \"My Best Friend's Girl,\" \"Good Times Roll,\" \"You're All I've Got Tonight,\" \"Bye Bye Love.\" Roy Thomas Baker producing the new wave the way he produced Queen — gleaming and synthetic. The album that launched the band overnight.",
  "190216":
    "The fast follow-up. Same producer, same approach, slightly more nervous energy. \"Let's Go,\" \"Dangerous Type,\" \"It's All I Can Do.\" Less iconic single-by-single than the debut but a tighter album.",
  "4297239":
    "The deliberate art-rock pivot. Less hooky, more atmospheric, the band consciously trying not to repeat the formula. \"Touch and Go\" was the single; the rest is denser and weirder. Polarizing; rewards the patience.",
  "3407234":
    "The course-correction back toward radio. \"Shake It Up,\" \"Since You're Gone,\" \"Cruiser.\" Less of a moment than the first two but a return to the singles-first sensibility.",
  "230574":
    "The MTV peak. \"You Might Think,\" \"Drive,\" \"Magic,\" \"Hello Again.\" Mutt Lange producing, every song chiseled into a video. The album that cemented the Cars as a defining sound of the mid-'80s.",
  "3646966":
    "The last album of the original run. \"You Are the Girl,\" \"Coming Up You.\" Less inspired than what came before; the band split shortly after. A footnote to a great catalog.",

  // ─── The Blasters ────────────────────────────────────────────────────────
  "1757039":
    "The breakthrough. Dave Alvin's songs, Phil Alvin's vocals, Lee Allen on sax — roots rock pulled from rockabilly, jump blues, country, and R&B. \"American Music,\" \"Marie Marie,\" \"I'm Shakin'.\" The album that established the LA roots-rock scene of the early '80s.",
  "1836174":
    "Live mini-album from a London club show — the band on the road behind the debut, blistering through the catalog with Lee Allen's saxophone front and center.",
  "1836194":
    "Dave Alvin's most ambitious songwriting record with the band — story-songs, character sketches, working-class realism. \"Long White Cadillac,\" \"Tag Along,\" \"Boomtown.\" The album that prefigured Alvin's later solo work.",
  "1695634":
    "The polished album, Jeff Eyrich producing, John Cougar guesting. \"Common Man\" became a hit; \"Just Another Sunday\" pointed Alvin toward his folk side. Dave Alvin's last with the band before going solo.",
  "32432937":
    "The complete 1982 London show finally released in full — RSD pressing. The mini-album was a sample; this is the whole night.",

  // ─── Bruce Springsteen ───────────────────────────────────────────────────
  "1628918":
    "The second album, the one with the early E Street Band fully formed. \"Rosalita (Come Out Tonight),\" \"4th of July, Asbury Park (Sandy),\" \"Incident on 57th Street.\" More sprawling and jazzy than what came later; the sound of a band still figuring itself out, with the songwriting already at masterpiece level. 1983 reissue.",
  "3012371":
    "The album made under three years of legal battles after *Born to Run*. Stripped down, focused, all the romanticism of the previous record traded for hard work and quiet despair. \"Badlands,\" \"The Promised Land,\" \"Racing in the Street,\" the title track. Some fans' favorite.",
  "892971":
    "The double album. Twenty songs covering everything — bar-rock, rockabilly, ballads, party songs, the heartbreak that would become *Nebraska* a year later. \"Hungry Heart,\" \"The River,\" \"Out in the Street,\" \"Drive All Night,\" \"Wreck on the Highway.\" Everything Springsteen could do, on one record.",
  "1343227":
    "The phenomenon. Twelve songs, seven hit singles, 30 million copies sold worldwide. \"Born in the U.S.A.\" (constantly misread), \"Dancing in the Dark,\" \"Glory Days,\" \"I'm on Fire,\" \"My Hometown.\" The album that turned Springsteen into the biggest American rock star of the decade.",
  "1709195":
    "The marriage-falling-apart album. Mostly Springsteen alone in his home studio with Toby Scott engineering, the E Street Band reduced to occasional contributors. \"Brilliant Disguise,\" \"One Step Up,\" \"Tougher Than the Rest,\" the title track. The most personal record he'd made; the divorce was final by the next album.",

  // ─── The Dead Milkmen ────────────────────────────────────────────────────
  "19116595":
    "The debut. Philly satirical punk — sneering, smart, politically charged, and weirdly catchy. \"Bitchin' Camaro,\" \"Tiny Town,\" \"Dean's Dream.\" The album that made the Milkmen the most quotable underground band in college dorms for a decade. 2021 reissue.",
  "30454172":
    "The third album. \"(Theme from) Blood Orgy of the Atomic Fern,\" \"Watching Scotty Die,\" \"Going to Graceland.\" The Milkmen's strangest, most hook-driven record; the joke albums dressed in actual songcraft. 2024 RSD reissue.",
  "25275316":
    "The fifth album. Tighter production, the band's sense of humor still intact but the songs leaning slightly more serious. \"If I Had a Gun,\" \"Methodist Coloring Book,\" \"I Tripped Over the Ottoman.\" 2022 reissue.",
  "6880144":
    "The fourth album, the one with \"Punk Rock Girl\" — by far their biggest hit, an unlikely college-radio anthem about love and Mojo Nixon. \"Stuart,\" \"Bleach Boys,\" \"Smokin' Banana Peels.\" The Milkmen's most accessible record.",
  "1220929":
    "The 7\" single — the song, the moment, the only Dead Milkmen track most casual listeners ever knew.",

  // ─── Groovie Ghoulies ────────────────────────────────────────────────────
  "1581405":
    "The debut LP for Lookout. Ramones-influenced pop-punk with horror-movie themes throughout. \"Be My Frankenstein,\" \"Hello Skull,\" \"Highschool Massacre.\" The Groovie Ghoulies' template fully formed.",
  "3697285":
    "The follow-up — more horror, more hooks, more Ramones-style sub-three-minute pop-punk. \"Ghoulies Are Go!,\" \"Beast With Five Hands,\" \"Graveyard Girlfriend.\" Cleaner production than the debut.",
  "27158292":
    "The fourth album — more polish, more melodic ambition, the songwriting maturing. \"Hopelessly Devoted to You\" (a *Grease* cover, played straight), \"Strange Town.\" A late-Lookout high point. 2023 reissue.",
  "26069941":
    "The fifth album. The band still doing what they do — fast pop-punk songs about monsters and girls — with the songwriting holding up across the catalog. 2023 reissue.",
  "25769308":
    "The sixth album. Even stronger melodic instincts; the Ghoulies as a Ramones-style power-pop band more than a pure punk one by now. The last great album of their original run. 2023 reissue.",

  // ─── Madonna ─────────────────────────────────────────────────────────────
  "2897713":
    "The debut. Reggie Lucas producing most of it, John \"Jellybean\" Benitez stepping in for the final mixes. \"Holiday,\" \"Borderline,\" \"Lucky Star,\" \"Burning Up.\" The album that signaled the arrival of the most defining pop figure of the next decade.",
  "4289408":
    "The breakthrough. Nile Rodgers producing — that crisp, dance-rock production that defined mid-'80s pop. \"Like a Virgin,\" \"Material Girl,\" \"Dress You Up,\" \"Angel.\" The album that turned Madonna into a phenomenon.",
  "103403":
    "The 12\" extended-mix maxi-single — the kind of object that defined how dance-pop got distributed in the mid-'80s. \"Dress You Up\" stretched out for the clubs, plus B-side and remix.",
  "597222":
    "The artistic leap. Madonna co-producing for the first time, the songwriting more ambitious. \"Papa Don't Preach,\" \"Open Your Heart,\" \"Live to Tell,\" the title track. The album that made her more than a singles artist — and the album that started the parental-controversy cycle that ran for the next decade.",
  "1087663":
    "The masterpiece. Patrick Leonard and Stephen Bray as co-producers, Madonna writing more than ever, the album touching on religion, marriage, family, sexuality, and her own mortality. \"Like a Prayer,\" \"Express Yourself,\" \"Cherish,\" \"Oh Father.\" The peak of her '80s run; the foundation for everything that followed.",

  // ─── Descendents ─────────────────────────────────────────────────────────
  "13259961":
    "The fifth album, recorded just before Milo went back to college and the band became ALL. \"Coolidge,\" \"Iceman,\" \"Pep Talk,\" \"Schizophrenia.\" The most polished Descendents record, and arguably the high point of the original run.",
  "6929447":
    "The greatest-hits compilation pulling together the best of Descendents from *Milo Goes to College* through *All*. The standard introduction for anyone who didn't grow up on SST releases.",
  "8923462":
    "The first Descendents album in 12 years. \"Without Love,\" \"Smile,\" \"Victim of Me,\" \"Spineless and Scarlet Red.\" The band proving they could pick the formula back up like no time had passed.",
  "18487942":
    "The reunion album — Milo back, Bill Stevenson and Stephen Egerton from ALL, Karl Alvarez on bass. \"When I Get Old,\" \"Eunuch Boy,\" \"I'm the One.\" Faster and angrier than expected; one of the great late-'90s pop-punk records.",
  "19595560":
    "A weird late-period record — songs Bill Stevenson and Frank Navetta wrote in the late '70s/early '80s, finally recorded by Milo in 2021. The Descendents-as-archaeological-dig album. Strange and great.",

  // ─── Beastie Boys ────────────────────────────────────────────────────────
  "9173990":
    "The debut. Rick Rubin producing, frat-house obnoxiousness as art form. \"Fight for Your Right,\" \"No Sleep Till Brooklyn,\" \"Brass Monkey,\" \"Paul Revere.\" The first hip-hop album to hit #1 on the Billboard 200, sold by the truckload to suburban kids who'd never been near a rap record before. 2016 reissue.",
  "14228535":
    "The masterpiece nobody bought at the time. The Dust Brothers producing, every track built from layers of samples that wouldn't be legally clearable two years later. \"Hey Ladies,\" \"Shadrach,\" \"Shake Your Rump.\" Commercial flop on release; one of the most-cited hip-hop albums of all time since. 2019 reissue.",
  "3950974":
    "The Beasties pick up their instruments. Half hip-hop, half punk-jazz-funk fusion — recorded live in their own studio. \"So What'cha Want,\" \"Pass the Mic,\" \"Jimmy James,\" \"Gratitude.\" The album that established the Beasties as a band, not just a rap group. 2009 reissue.",
  "16269579":
    "A compilation of pre-*Licensed to Ill* hardcore punk material. The Beasties before they were the Beasties — fifteen-year-olds playing fast in NYC clubs. RSD pressing.",
  "19359646":
    "An eight-song hardcore-punk EP recorded between *Ill Communication* and *Hello Nasty* — the Beasties remembering they'd started as a punk band. Eleven minutes total; played fast.",

  // ─── Go-Go's ─────────────────────────────────────────────────────────────
  "13272620":
    "The 7\" single — the song that broke them, co-written by Jane Wiedlin and Terry Hall (Specials/Fun Boy Three). The new wave song that turned the Go-Go's from LA punk to MTV phenomenon overnight.",
  "3531333":
    "The debut LP. The first album by an all-female band that wrote and played their own songs to hit #1 in the US. \"Our Lips Are Sealed,\" \"We Got the Beat,\" \"How Much More,\" \"Lust to Love.\" Six weeks at #1; a foundational document of new wave.",
  "612086":
    "The second album. Same Richard Gottehrer production, the songs written under tour exhaustion. The title track was the hit; the rest is uneven, with flashes of the songwriting that would peak on *Talk Show*.",
  "1133410":
    "The masterpiece nobody talks about. Martin Rushent producing, the songs sharper and more melancholy. \"Head Over Heels,\" \"Turn to You,\" \"Yes or No.\" The band falling apart by the end of the cycle; this is what they did right before they did.",
  "18737743":
    "The reunion album. Same lineup as the original run, the songs still tight. \"Unforgiven,\" \"Apology,\" \"La La Land.\" Better than a reunion record had any right to be. 2021 reissue.",

  // ─── Slayer ──────────────────────────────────────────────────────────────
  "23513579":
    "*The* album. Twenty-nine minutes of pure terror — \"Angel of Death,\" \"Postmortem,\" \"Raining Blood.\" Rick Rubin producing, every song a sprint, the production deliberately raw. The blueprint for thrash and an entire generation of extreme metal. 2022 reissue.",
  "5190118":
    "The deliberate slowdown after *Reign in Blood*. Heavier in a different way — doomier, more atmospheric. \"South of Heaven,\" \"Mandatory Suicide,\" \"Silent Scream.\" Polarizing at the time; widely considered an underrated peak now. 2013 reissue.",
  "5180416":
    "The synthesis — *Reign in Blood* speed and *South of Heaven* atmosphere, balanced. \"War Ensemble,\" \"Dead Skin Mask,\" the title track, \"Spirit in Black.\" One of the great late-'80s thrash records; the last with Dave Lombardo for a decade. 2013 reissue.",
  "5231820":
    "Paul Bostaph in for Lombardo, the band adapting to the post-grunge era without compromising the sound. \"Killing Fields,\" \"Dittohead,\" the title track. Polarizing; the start of the long mid-period Slayer. 2013 reissue.",
  "5271716":
    "The covers album. Slayer doing hardcore punk — Verbal Abuse, Dr. Know, Minor Threat, Stooges, plus a couple Slayer originals. The album that was supposed to be a Pap Smear side project; ended up as a Slayer record because the label wanted one. 2013 reissue.",

  // ─── Mr. Bungle ──────────────────────────────────────────────────────────
  "6401086":
    "The debut. Mike Patton's Faith No More side project gone full art-school freakshow. John Zorn producing, every track a genre exercise — death metal next to lounge next to ska. \"Squeeze Me Macaroni,\" \"Carousel,\" \"My Ass Is on Fire.\" Unlike anything else in 1991. 2014 reissue.",
  "5958901":
    "The masterpiece. Even less coherent than the debut — Latin, polka, klezmer, free jazz, surf, all welded together with Patton's vocal acrobatics. \"Carry Stress in the Jaw,\" \"Desert Search for Techno Allah,\" \"After School Special.\" A record that exists in its own genre. 2014 reissue.",
  "5955900":
    "The third and most accessible Bungle album. Beach Boys harmonies, surf rock, lounge — still warped, still un-categorizable. \"None of Them Knew They Were Robots,\" \"Pink Cigarette,\" \"Retrovertigo.\" The final Bungle record before the long hiatus. 2014 reissue.",
  "17272540":
    "The 1986 thrash-metal Mr. Bungle demo — re-recorded in 2019 with Anthrax's Scott Ian and Slayer's Dave Lombardo as guests. The most metal Bungle release; technically a debut, technically a covers album of themselves.",
  "20859280":
    "Live album from a 2020 livestream show, post-reunion. The thrash-era Bungle catalog plus a few covers, performed by the *Easter Bunny Demo* lineup with Lombardo and Ian.",

  // ─── Electric Light Orchestra ────────────────────────────────────────────
  "9527004":
    "The album that broke them in America. \"Evil Woman,\" \"Strange Magic.\" Less ambitious than what would come, more pop-focused, the orchestral arrangements still front and center. The transition record.",
  "9212702":
    "The breakthrough. \"Livin' Thing,\" \"Telephone Line,\" \"Do Ya,\" \"Tightrope.\" Jeff Lynne fully figuring out the formula — Beatles harmonies, classical strings, prog-pop ambition wrapped in radio singles. The album that turned ELO into a global phenomenon.",
  "342681":
    "The double album, the peak. \"Mr. Blue Sky,\" \"Turn to Stone,\" \"Sweet Talkin' Woman,\" \"Wild West Hero,\" \"Concerto for a Rainy Day.\" Twenty-three songs of pure Lynne-orchestrated pop maximalism. The album that defined ELO.",
  "14217521":
    "The disco-leaning ELO album — fans called it \"Disco-very.\" \"Don't Bring Me Down,\" \"Shine a Little Love,\" \"Last Train to London,\" \"Confusion.\" The strings less prominent, the synths more present; the band consciously chasing the moment.",
  "5403020":
    "The soundtrack to the 1980 film — split between ELO songs (\"Xanadu,\" \"All Over the World,\" \"I'm Alive\") and Olivia Newton-John (\"Magic,\" \"Suddenly\"). The ELO half holds up better than the movie did.",

  // ─── Duran Duran ─────────────────────────────────────────────────────────
  "9961266":
    "The debut. Synth-driven new romantic, glossy production, runway-ready aesthetic from the first single. \"Planet Earth,\" \"Girls on Film,\" \"Careless Memories.\" The album that created the Duran Duran template the rest of the decade would chase.",
  "11835185":
    "The masterpiece. \"Hungry Like the Wolf,\" \"Rio,\" \"Save a Prayer,\" \"New Religion.\" The album that turned Duran Duran into one of the biggest bands in the world — videos in heavy MTV rotation, the singles defining the look and sound of mid-'80s pop.",
  "10864435":
    "The \"Reflex\" album. Recorded in Cannes, Montserrat, and Sydney while the band tax-exiled themselves around the globe. \"The Reflex,\" \"Union of the Snake,\" \"New Moon on Monday.\" Less iconic album-wise than *Rio* but with three of their biggest singles.",
  "11291504":
    "The live album from the *Sing Blue Silver* tour. The hits at peak Duran Duran scale, with one new studio track (\"The Wild Boys\") added. The live document of their commercial peak.",
  "7495171":
    "The post-split album — Andy and Roger Taylor gone, Nile Rodgers producing the remaining trio's funkier turn. The title track was the hit; the rest is a band quietly remaking itself. The bridge to the late-'80s era.",

  // ─── Stevie Wonder ───────────────────────────────────────────────────────
  "174477":
    "The album that established Wonder's \"classic period.\" \"Superstition,\" \"You Are the Sunshine of My Life,\" \"Maybe Your Baby.\" Wonder taking creative control after his 21st birthday released him from his Motown childhood contract. Year zero of the imperial run.",
  "13286331":
    "The masterpiece. \"Living for the City,\" \"Higher Ground,\" \"Don't You Worry 'Bout a Thing,\" \"All in Love Is Fair.\" Wonder playing nearly every instrument himself, the songs grappling with race, drugs, urban poverty, spirituality. Won Album of the Year and changed what soul music could do.",
  "3449731":
    "The follow-up to *Innervisions*, recorded after the car accident that nearly killed Wonder. Quieter, more inward. \"Boogie On Reggae Woman,\" \"You Haven't Done Nothin',\" \"Heaven Is 10 Zillion Light Years Away.\" Won Album of the Year again.",
  "2927062":
    "The double album that capped the imperial period. Two LPs plus a four-song bonus EP, twenty-one songs, every one of them indispensable. \"Sir Duke,\" \"I Wish,\" \"Pastime Paradise,\" \"As,\" \"Isn't She Lovely,\" \"Love's in Need of Love Today.\" Often called the greatest soul album ever made; the case is hard to argue.",
  "5717571":
    "The double-LP greatest-hits comp covering 1972-1982 — \"Superstition,\" \"Sir Duke,\" \"Higher Ground,\" \"Living for the City,\" plus four new songs including \"Do I Do\" and \"That Girl.\" The standard Stevie Wonder introduction for a generation.",

  // ─── X ───────────────────────────────────────────────────────────────────
  "13226518":
    "The debut. Ray Manzarek (the Doors' organist) producing, the band defining LA punk in real time. \"Los Angeles,\" \"Sex and Dying in High Society,\" \"Johnny Hit and Run Paulene,\" \"The World's a Mess; It's in My Kiss.\" Foundational document of the West Coast punk scene. 2019 reissue.",
  "853977":
    "The second album. Manzarek producing again, the band tighter and weirder. \"We're Desperate,\" \"White Girl,\" \"Adult Books,\" \"The Once Over Twice.\" Often cited as their masterpiece; the moment X locked in their X-ness.",
  "7086334":
    "The grief album. John Doe's sister had recently died; the songs grapple with death and Catholic imagery. \"The Hungry Wolf,\" \"Riding with Mary,\" \"Come Back to Me.\" A deepening, darker record; one of the great early-'80s American albums.",
  "12469269":
    "The polish era. Michael Wagener producing, the band consciously chasing radio. \"Burning House of Love,\" \"My Goodness.\" Polarizing among purists; better than its reputation if you accept what it's trying to do.",
  "12444727":
    "The fifth album, with Tony Gilkyson replacing Billy Zoom on guitar. \"Fourth of July\" (the Dave Alvin song, sung by Exene), the title track. The end of the original era. Quieter, more rooted, pointing toward Doe and Cervenka's solo careers.",

  // ─── Pink Floyd ──────────────────────────────────────────────────────────
  "5281428":
    "*The* album. The eight-week-#1 album, the 14-year-on-Billboard album, the 50-million-copies album. \"Money,\" \"Time,\" \"Us and Them,\" \"Brain Damage.\" Alan Parsons engineering, Roger Waters writing, the band at the absolute peak of their powers. The album that defined what rock-as-art-form could mean.",
  "30627961":
    "The 50th-anniversary remastered reissue — same album, sharper sound, fresh vinyl. The version to play when you need *Dark Side* to sound the way it does in your head.",
  "10755886":
    "The transitional record between the early Syd Barrett-era Floyd and the *Dark Side* monster. Side one is shorter songs (\"One of These Days,\" \"Fearless\"); side two is \"Echoes,\" 23 minutes of slow-build Floyd at their most prog. 1975 reissue.",
  "7270492":
    "The double album. Roger Waters' magnum opus and the album that ended Pink Floyd as a functional band. \"Another Brick in the Wall (Part II),\" \"Comfortably Numb,\" \"Hey You,\" \"Run Like Hell.\" Theatrically staged into oblivion, made into a film, the source of as much catalog royalty as anything in rock history.",

  // ─── The Time ────────────────────────────────────────────────────────────
  "19505374":
    "The debut. Prince's funk side project — Morris Day fronting a band that was secretly Prince and his band playing under different names. \"Get It Up,\" \"Cool,\" \"Girl.\" The album that launched the most successful protégé project of Prince's career. 2021 reissue.",
  "10950760":
    "The masterpiece. \"777-9311,\" \"The Walk,\" \"Wild and Loose,\" \"Gigolos Get Lonely Too.\" The Time at their funkiest peak — and a record that's basically a stealth Prince album with Morris Day's swagger on top.",
  "625713":
    "The album that gave the world \"Jungle Love\" and \"The Bird\" — both performed in *Purple Rain*. The title track is one of Prince's best Time productions. The end of the Prince-controlled era; Jam and Lewis would leave for their own production careers immediately after.",
  "202801":
    "The reunion album, six years later, the original lineup reassembled. \"Jerk Out,\" \"Donald Trump (Black Version).\" Less essential than the Prince-era records but a genuine band reunion that landed harder than expected.",

  // ─── Quicksand ───────────────────────────────────────────────────────────
  "21445501":
    "The four-song debut EP, before *Slip*. The template — heavy melodic post-hardcore that prefigured Helmet and Deftones. Reissued 7\" pressing.",
  "26466602":
    "The debut LP. Don Fury producing, the songs angular and heavy. \"Fazer,\" \"Dine Alone,\" \"Head to Wall.\" A foundational document of '90s post-hardcore — and an album that's been rehabilitated into \"essential\" status in the past decade. 2023 reissue.",
  "11126094":
    "The reunion album, 22 years after *Manic Compression*. The same band, slightly older, the songs less aggressive but more melodic. \"Illuminant,\" \"Cosmonauts,\" \"Warm and Low.\" A reunion that meant it.",
  "21528766":
    "The follow-up to *Interiors*. Tighter, more focused, the most accessible Quicksand album. \"Inversion,\" \"Lightning Field,\" the title track. Late-period Quicksand finding its register.",

  // ─── Faith No More ───────────────────────────────────────────────────────
  "5145542":
    "The fifth album, Jim Martin out, Trey Spruance (Mr. Bungle) in for the recording. The most stylistically scattered FNM album — country, gospel, hardcore, jazz, Patton vocals everywhere. \"Digging the Grave,\" \"Evidence,\" \"Just a Man.\" Polarizing then, recognized as a masterpiece now. 2013 reissue.",
  "5669738":
    "The sixth album, the original breakup record. Jon Hudson on guitar. \"Ashes to Ashes,\" \"Last Cup of Sorrow,\" \"Stripsearch.\" Less varied than *King for a Day* but tighter and more cohesive. The end of the original era. 2013 reissue.",
  "7014093":
    "The reunion album, 18 years after *Album of the Year*. The original lineup minus Martin (Hudson still in). \"Motherfucker,\" \"Sunny Side Up,\" \"Cone of Shame.\" A genuine return-to-form; nobody expected the band to write material this strong.",
  "19102939":
    "The post-breakup compilation. Two discs covering 1985-1997, plus four B-sides and rarities. The standard FNM introduction. 2021 reissue.",

  // ─── Pennywise ───────────────────────────────────────────────────────────
  "4583470":
    "The 7\" debut single, before the LP. Hardcore-edged skate punk; the band before they became the band the world knew. Pure early Pennywise.",
  "20735356":
    "The debut LP. Skate-punk at hardcore tempos. \"Bro Hymn\" is the song that became the band's defining anthem and a SoCal punk-rock standard. The album that established Pennywise as Epitaph royalty. 2021 reissue.",
  "12042828":
    "The third album. \"Peaceful Day,\" \"Same Old Story,\" \"Perfect People.\" The classic Pennywise sound at its most commercial peak — angry, tight, melodic, radio-ready. 2014 reissue.",
  "23424638":
    "The fourth album. \"Society,\" \"Broken,\" \"Final Day.\" Possibly the band's best record — the sound fully refined, the political lyrics at their most pointed. 2022 reissue.",

  // ─── Dokken ──────────────────────────────────────────────────────────────
  "6241595":
    "The US debut. Tom Werman producing. \"Breaking the Chains,\" \"Live to Rock (Rock to Live),\" \"In the Middle.\" The album that established Dokken as one of the most musical of the LA hair-metal bands — George Lynch's guitar already showing why everybody talked about him.",
  "2276060":
    "The breakthrough. \"Just Got Lucky,\" \"Into the Fire,\" \"Alone Again,\" \"Tooth and Nail.\" Roy Thomas Baker producing, the band tightening up. The album that turned them into a national act.",
  "1763580":
    "The peak. \"In My Dreams,\" \"It's Not Love,\" \"The Hunter,\" \"Unchain the Night.\" Melodic hard rock at its most refined; George Lynch at his absolute best. Often cited as the band's masterpiece.",
  "1309430":
    "The double LP, *Nightmare on Elm Street 3* connection (\"Dream Warriors\"), the band falling apart in the studio. \"Mr. Scary,\" \"Burning Like a Flame,\" \"Dream Warriors.\" Less consistent than *Under Lock and Key* but the highs are very high. Don and George's last real album together.",

  // ─── Def Leppard ─────────────────────────────────────────────────────────
  "17063673":
    "The debut. Tom Allom producing, the band fully NWOBHM at this stage. \"Hello America,\" \"Wasted,\" \"Rock Brigade.\" Less polished than what was coming, more raw. The album that launched a teenage Sheffield band into the metal scene.",
  "8091976":
    "The Mutt Lange debut. The production tightens, the songwriting sharpens. \"Bringin' on the Heartbreak,\" \"Switch 625,\" \"Lady Strange.\" The bridge between NWOBHM-era Lep and the *Pyromania* monster. 1984 reissue.",
  "393266":
    "The breakthrough. Mutt Lange producing, the songs chiseled to MTV-perfect shape. \"Photograph,\" \"Rock of Ages,\" \"Foolin'.\" Steve Clark's last full album before the long tragedy. Ten million copies sold in the US alone.",
  "421436":
    "The phenomenon. Three years of recording, Rick Allen learning to drum one-armed after his accident, Mutt Lange at his most obsessive. \"Pour Some Sugar on Me,\" \"Love Bites,\" \"Animal,\" \"Hysteria,\" \"Armageddon It.\" Diamond status; the album that defined late-'80s rock.",

  // ─── David Bowie ─────────────────────────────────────────────────────────
  "13823628":
    "The masterpiece. The concept album that invented the rock-star persona as performance art. \"Five Years,\" \"Starman,\" \"Suffragette City,\" \"Rock 'n' Roll Suicide,\" \"Ziggy Stardust.\" The album that turned David Jones into David Bowie. 1976 reissue.",
  "2833017":
    "The third Bowie album, Mick Ronson on guitar for the first time, the heaviness arriving. \"The Width of a Circle,\" \"All the Madmen,\" the title track (later Nirvana-covered to a generation that never knew the original). Reissue pressing.",
  "1361058":
    "The first Bowie compilation. Eleven songs covering 1969-1976 — \"Space Oddity,\" \"Changes,\" \"Suffragette City,\" \"Diamond Dogs,\" \"Young Americans,\" \"Fame.\" The standard Bowie introduction for a generation.",
  "528152":
    "The commercial peak. Nile Rodgers producing, the songs slick and danceable, the videos in heavy MTV rotation. \"Let's Dance,\" \"Modern Love,\" \"China Girl.\" Polarizing among earlier-era fans; one of his biggest-selling albums by a wide margin.",

  // ─── Rancid ──────────────────────────────────────────────────────────────
  "12147879":
    "A 7\" EP from the Brett Gurewitz Lookout era — three songs, original 1993 release, the band before *Let's Go* broke them. The Rancid origin myth in 7\" form.",
  "4290206":
    "The breakthrough. Twenty-three songs in 38 minutes, the band's hardcore-punk roots fully visible. \"Salvation,\" \"Radio,\" \"Nihilism,\" \"St. Mary.\" The album that set up *...And Out Come the Wolves*. 7\" album-format reissue.",
  "13466213":
    "Standard LP reissue of *Let's Go*. The version to throw on the turntable.",
  "13209987":
    "The masterpiece. The album that turned Rancid into one of the few '90s punk bands that could fill rooms anywhere in the world. \"Time Bomb,\" \"Ruby Soho,\" \"Roots Radicals,\" \"11th Hour,\" \"Olympia, WA.\" Multi-platinum, no compromise; the high-water mark for Berkeley-era Lookout punk. 2019 reissue.",

  // ─── The Queers ──────────────────────────────────────────────────────────
  "1431872":
    "The breakthrough. Fast Ramones-style pop-punk with Joe Queer's snarl over Hugh O'Neill drums. \"Ursula Finally Has Tits,\" \"I Hate Everything,\" \"Tamara Is a Punk.\" The album that established the Queers as kings of '90s Lookout pop-punk.",
  "1691004":
    "The Beach Boys-loving Queers record. \"Don't Back Down\" (the title track is a Beach Boys cover), \"Punk Rock Girls,\" \"I Only Drink Bud.\" Pop-punk with surf-pop harmonies; the band at their most melodic.",
  "4395836":
    "The first proper Queers full-length, originally released on Doheny in 1990 — pre-Lookout. The garage-punk Queers, before they figured out the Ramones formula. Reissue of the foundational document.",
  "20190169":
    "A late-period Queers album, the band still doing what they do — bratty, fast, hooky pop-punk songs about not much. \"Rocky Road,\" \"She's Gone.\" The kind of record that exists because the Queers exist.",

  // ─── Ozzy Osbourne ───────────────────────────────────────────────────────
  "8508132":
    "The solo debut. Randy Rhoads on guitar, Bob Daisley on bass, Lee Kerslake on drums — and the album that proved Ozzy could thrive without Black Sabbath. \"Crazy Train,\" \"Mr. Crowley,\" \"I Don't Know,\" \"Suicide Solution.\" Year zero of the Ozzy solo myth.",
  "13317921":
    "The follow-up. Same Rhoads-led band, the songwriting more ambitious. \"Over the Mountain,\" \"Flying High Again,\" \"Tonight,\" the title track. Randy Rhoads' last album with Ozzy before the plane crash that killed him in 1982.",
  "20905558":
    "The 2021 limited reissue of *Diary of a Madman*. Same album, fresh vinyl — the second Ozzy solo masterpiece pressed back to plastic.",
  "7747307":
    "Jake E. Lee on guitar after the brief Brad Gillis tour. The first Ozzy album without Rhoads, and the album that proved the solo project could survive the loss. \"Bark at the Moon,\" \"Rock 'n' Roll Rebel,\" \"You're No Different.\" A different kind of record but a genuinely good one.",

  // ─── Devo ────────────────────────────────────────────────────────────────
  "6059165":
    "The debut. Brian Eno producing, David Bowie executive-producing, the band fully formed and weird from the first note. \"Mongoloid,\" \"Jocko Homo,\" the cover of \"(I Can't Get No) Satisfaction.\" Year zero of de-evolution as an art project.",
  "5739402":
    "The follow-up. Ken Scott producing, the synthesizers more prominent. \"Blockhead,\" \"Smart Patrol/Mr. DNA,\" \"Secret Agent Man\" (the Johnny Rivers cover). Less iconic than the debut, more conceptually committed to the Devo worldview.",
  "17377":
    "The breakthrough. \"Whip It\" turned Devo into an MTV phenomenon — the synth riff, the cone hats, the spastic dance. The rest of the album holds up: \"Girl U Want,\" \"Gates of Steel,\" the title track. Less weird than the early records, more accessible without losing the bite.",
  "558929":
    "The follow-up to *Freedom of Choice*. \"Through Being Cool,\" \"Beautiful World,\" \"Love Without Anger.\" Less commercially successful than its predecessor; the start of the long, slow Devo deceleration.",

  // ─── Crack The Sky ───────────────────────────────────────────────────────
  "1254826":
    "The second album. Tighter and more refined than the debut, with the band's complex prog-pop instincts on display. The album that built the cult.",
  "4753860":
    "The fifth album. Synthesizers, sharper hooks, the band trying to break out of cult status without quite getting there.",
  "2107278":
    "A best-of compilation pulling together highlights from the first five albums — the standard introduction for anyone who didn't grow up on Lifesong Records.",
  "17007966":
    "A late-period RSD release — the band still active, still doing the unique Crack the Sky thing, four-plus decades in. Limited-edition pressing.",

  // ─── Huey Lewis And The News ─────────────────────────────────────────────
  "10585242":
    "The debut. Power-pop with new-wave production polish. The album the band moved past once they figured out their actual sound — more representative of the bar-band roots than what was coming. 1983 reissue.",
  "5242820":
    "The breakthrough. \"Do You Believe in Love\" went top 10; \"Workin' for a Livin'\" became a setlist permanent. The album that turned the News from regional act to national one. 1983 reissue.",
  "497769":
    "The phenomenon. Multi-platinum, three top-10 singles. \"I Want a New Drug,\" \"If This Is It,\" \"Heart and Soul,\" \"The Heart of Rock & Roll.\" The album that defined everything mainstream rock could be in 1984.",
  "911271":
    "The follow-up. \"Hip to Be Square,\" \"Stuck with You,\" \"Jacob's Ladder.\" The peak of the videos-and-singles era; quadruple platinum. *American Psycho*'s contribution made \"Hip to Be Square\" eternal.",
  "911344":
    "The pivot. Latin influences, jazz textures, more ambitious arrangements. Less commercially successful; the album that pulled Huey Lewis off the radio.",

  // ─── The Police ──────────────────────────────────────────────────────────
  "13854731":
    "The debut. Reggae-inflected punk-pop, recorded fast and cheap. \"Roxanne,\" \"Can't Stand Losing You,\" \"So Lonely,\" \"Next to You.\" The album that introduced one of the most defining trios of the new-wave era.",
  "11361662":
    "The third album. \"Don't Stand So Close to Me,\" \"De Do Do Do, De Da Da Da.\" Recorded in three weeks under massive label pressure. The album that turned them into a stadium act despite the band's own reservations about it.",
  "17293561":
    "The atmospheric synth turn. Hugh Padgham producing, the band leaning into keyboards and ambient textures. \"Every Little Thing She Does Is Magic,\" \"Spirits in the Material World,\" \"Invisible Sun.\" The Police remaking themselves before *Synchronicity*. Club Edition pressing.",
  "15307243":
    "The masterpiece. \"Every Breath You Take,\" \"King of Pain,\" \"Wrapped Around Your Finger,\" \"Synchronicity I/II.\" Eight weeks at #1 in the US; the album that broke the band. They split a year later.",

  // ─── The Cult ────────────────────────────────────────────────────────────
  "6232702":
    "The breakthrough. The band moving away from goth toward big-rock anthems. \"She Sells Sanctuary,\" \"Rain,\" \"Revolution.\" Steve Brown producing — the album that turned the Cult from a UK underground band to an international one.",
  "383049":
    "The Rick Rubin album. AC/DC riffs, big drums, the post-punk pretensions stripped away. \"Love Removal Machine,\" \"Lil' Devil,\" \"Wild Flower.\" Polarizing among the goth fans; the record that put the Cult on hard-rock radio.",
  "15634277":
    "The peak. Bob Rock producing, the songs at their most melodic. \"Fire Woman,\" \"Edie (Ciao Baby),\" \"Sun King,\" \"Sweet Soul Sister.\" The album that turned the Cult into a stadium act.",
  "4756130":
    "The 2013 expanded release pairing *Electric* with the alternate Steve Brown sessions (\"Peace\") — the two versions of the same album, finally released side by side. Fascinating context for the Rubin-era pivot.",

  // ─── Weather Report ──────────────────────────────────────────────────────
  "1052478":
    "The album where Jaco Pastorius arrived (on two tracks), changing the bass forever. Alphonso Johnson on bass for the rest, Chester Thompson on drums. \"Cannon Ball,\" \"Gibraltar,\" the title track. The transitional record between early Weather Report and the Jaco era.",
  "877385":
    "The breakthrough. \"Birdland\" became one of the few jazz-fusion songs to crack pop radio; \"A Remark You Made,\" \"Teen Town.\" Jaco Pastorius co-producing alongside Zawinul. The album that turned Weather Report into a brand-name jazz act.",
  "1516462":
    "The polarizing follow-up. Three drummers (Tony Williams, Steve Gadd, Peter Erskine), Jaco's fretless bass everywhere, Zawinul's compositions getting denser. *Down Beat* gave it one star; subsequent generations have been more generous.",
  "1600795":
    "The double live album from the *Mr. Gone* tour, with the Jaco/Erskine lineup. One studio side, three live sides. The peak of the band as a touring unit; a genuine reset of how jazz-fusion sounded live.",

  // ─── Grateful Dead ───────────────────────────────────────────────────────
  "774120":
    "The pivot. The Dead leaving long-form psychedelic improvisation behind for tight, country-folk-influenced songcraft. \"Uncle John's Band,\" \"Casey Jones,\" \"Cumberland Blues,\" \"New Speedway Boogie.\" A fresh-grass record made by a band who'd been at Altamont a few months earlier.",
  "9171947":
    "The triple-LP live document of the band's spring 1972 European tour — Pigpen's last real run. \"Truckin',\" \"Tennessee Jed,\" \"Brown-Eyed Women,\" \"Sugar Magnolia,\" \"Morning Dew.\" The Dead at their early-'70s touring peak; arguably the best live introduction to what made them special.",
  "10054848":
    "The unlikely hit album. \"Touch of Grey\" went top 10, the album multi-platinum, the Dead suddenly a mainstream act 22 years in. \"Hell in a Bucket,\" \"West LA Fadeaway,\" \"Black Muddy River.\" The album that brought a whole new generation into the Deadhead fold.",
  "30217874":
    "The 1974 Warner-curated greatest-hits comp — the standard introduction for a generation of new Deadheads. \"Truckin',\" \"Sugar Magnolia,\" \"Casey Jones,\" \"Friend of the Devil.\" 2023 reissue pressing.",

  // ─── Dave Brubeck Quartet ────────────────────────────────────────────────
  "2579247":
    "The masterpiece. The first jazz album to sell a million copies. \"Take Five,\" \"Blue Rondo a la Turk,\" \"Three to Get Ready.\" The album that proved odd time signatures could swing — and the album that made jazz approachable for an entire generation of suburban listeners. 1962 stereo reissue.",
  "21328570":
    "Another reissue of *Time Out* — the same masterpiece, second copy in the collection.",
  "12913709":
    "The Brubeck Quartet's final Newport performance, with Gerry Mulligan on baritone sax. \"Take Five\" and \"Blue Rondo\" expanded into longer, looser readings. Club Edition pressing.",

  // ─── Bit Brigade ─────────────────────────────────────────────────────────
  "8891838":
    "Bit Brigade's instrumental rendition of the *Mega Man 2* NES soundtrack. The whole game's music played live by a band — cult-favorite project that's halfway between video-game arrangement and prog-rock cover band.",
  "14361606":
    "The follow-up — same band, same project, the entire *Mega Man 3* soundtrack performed in band form. For people who grew up on the NES and want to hear those melodies played by people.",
  "23308526":
    "The *DuckTales* NES soundtrack performed in full — another classic 8-bit score given the Bit Brigade treatment. The \"Moon Theme\" alone is worth it.",

  // ─── Oingo Boingo ────────────────────────────────────────────────────────
  "597423":
    "The debut. Danny Elfman's pre-soundtrack-superstar new-wave band, with horns and percussion stacked on top of art-school weirdness. \"Only a Lad,\" \"Capitalism,\" \"Little Girls.\" The album that established Boingo as LA's most idiosyncratic new-wave outfit. 1982 reissue.",
  "7601618":
    "The third album, the one with \"Cry of the Vatos\" and \"Wake Up (It's 1984).\" Tighter than the debut; the band figuring out their actual sound between the punk-jazz origins and the synth-pop they'd lean into next.",
  "27952671":
    "The fifth album. \"Weird Science,\" \"No One Lives Forever,\" the title track. Boingo's most accessible record — the Tim Burton soundtrack era starting to bleed in. 2023 reissue.",

  // ─── ALL ─────────────────────────────────────────────────────────────────
  "806022":
    "The debut. Dave Smalley on vocals. Stevenson, Egerton, Alvarez carrying the Descendents sound into ALL territory. \"Just Perfect,\" \"She's My Ex,\" \"Pretty Little Girl.\"",
  "26793332":
    "The seventh ALL album with Chad Price on vocals. Tighter, more melodic than the early Smalley records. \"Million Bucks,\" \"Dot.\" Late-period ALL at its most consistent. 2023 reissue.",
  "27821019":
    "The eighth ALL album, Chad Price's last. \"I'll Get There,\" \"Vida Blue.\" A subtle, sometimes melancholy late-period record — and the end of the original ALL run.",

  // ─── The Mr. T Experience ───────────────────────────────────────────────
  "14835851":
    "Career-spanning compilation of MTX — Dr. Frank Portman's brilliant, criminally underrated Lookout pop-punk band. The introduction nobody quite needed but everybody who reads this ought to have.",
  "24586358":
    "The Lookout-era masterpiece — wittiest pop-punk of the '90s. \"Even Hitler Had a Girlfriend,\" \"Spaghetti Western,\" \"Naomi.\" 2022 reissue.",
  "27016335":
    "MTX's full cover of the Ramones' *Road to Ruin* album, played note-for-note in MTX style. A tribute and a thesis statement at once.",

  // ─── The B-52's ──────────────────────────────────────────────────────────
  "9783418":
    "The debut. Athens, GA art-school weirdos doing dance-punk before the genre had a name. \"Rock Lobster,\" \"Planet Claire,\" \"Dance This Mess Around.\" The album that made beehive hairdos and surf-organ riffs cohere into a genre of their own.",
  "4831364":
    "The second album. Same band, slightly more polished. \"Private Idaho,\" \"Party Out of Bounds,\" \"Give Me Back My Man.\" The B-52's getting comfortable being the B-52's.",
  "163032":
    "The comeback. After the AIDS-related death of Ricky Wilson and a four-year hiatus, the band returned with Don Was and Nile Rodgers producing. \"Love Shack,\" \"Roam,\" \"Channel Z.\" Multi-platinum, top-10 singles, the band's biggest commercial moment by a wide margin.",

  // ─── Billy Idol ──────────────────────────────────────────────────────────
  "5040955":
    "The peak. Keith Forsey producing, Steve Stevens on guitar. \"Rebel Yell,\" \"Eyes Without a Face,\" \"Flesh for Fantasy,\" \"Catch My Fall.\" The album that turned Idol from former Generation X frontman into MTV royalty. Club Edition pressing.",
  "14166806":
    "The follow-up. Same producer-guitarist team, slightly less inspired. \"To Be a Lover,\" \"Don't Need a Gun,\" \"Sweet Sixteen.\" Multi-platinum but not the moment *Rebel Yell* was.",
  "6204692":
    "The motorcycle-accident-recovery album. \"Cradle of Love\" carried it commercially. The end of Idol's mainstream peak. Club Edition pressing.",

  // ─── Subhumans ───────────────────────────────────────────────────────────
  "14016397":
    "A flexi-disc 7\" — one of the late-period Subhumans releases. Single-sided picture disc; the kind of object completists collect.",
  "26255189":
    "The third album. The most musically expansive Subhumans record — politically pointed lyrics over more dynamic arrangements than the early hardcore EPs. \"Apathy,\" \"Mickey Mouse Is Dead.\" Limited-edition reissue pressing.",
  "26409680":
    "Standard reissue of *Worlds Apart*. The Subhumans' most fully realized album, in regular pressing.",

  // ─── Debbie Gibson ───────────────────────────────────────────────────────
  "341976":
    "The 12\" single — the song that introduced the world to a 16-year-old Debbie Gibson, written and performed entirely by herself. Pre-MTV pop phenomenon.",
  "1903337":
    "The 12\" single from *Out of the Blue*. More of the same self-written, self-produced teen pop that turned Gibson into a phenomenon.",
  "22988318":
    "A 2022 RSD picture-disc reissue — the duet version of \"Lost in Your Eyes\" with Joey McIntyre. Absolutely an artifact of teen-pop nostalgia.",

  // ─── Circle Jerks ────────────────────────────────────────────────────────
  "23843555":
    "The debut. Fourteen songs in fifteen minutes. Keith Morris straight from Black Flag, the songs faster and funnier. \"Wasted,\" \"Live Fast Die Young,\" \"Beverly Hills.\" A foundational document of LA hardcore. 2021 reissue.",
  "22256020":
    "The follow-up. Slightly slower, more melodic, with a few covers. The title track (Garland Jeffreys cover), \"Letter Bomb,\" \"Forced Labor.\" The album that proved hardcore could have hooks. 2022 reissue.",
  "1080107":
    "The major-label album — Combat Records, Chuck Plotkin producing. Longer songs, polished sound, polarizing among the hardcore faithful. \"Dude,\" \"Mrs. Jones,\" \"Karma Stew.\"",

  // ─── Public Enemy ────────────────────────────────────────────────────────
  "11234140":
    "The masterpiece. The Bomb Squad's production — sirens, samples piled twelve-deep, James Brown chops welded to noise — made the album an aesthetic event as much as a record. \"Bring the Noise,\" \"Don't Believe the Hype,\" \"Black Steel in the Hour of Chaos,\" \"Rebel Without a Pause.\" Year zero of politically charged hip-hop. 2014 reissue.",
  "143373":
    "The 12\" single from *Apocalypse 91*. PE at their most directly historical — the song traces the Middle Passage and ties it to contemporary America. Single-format reissue.",
  "16137969":
    "The late-period PE album, released at the height of pandemic anxiety. Chuck still angry, still on point.",

  // ─── A Tribe Called Quest ────────────────────────────────────────────────
  "387767":
    "The 12\" single — the closing track from *The Low End Theory*, the posse cut with Leaders of the New School (and Busta Rhymes' first famous verse). One of the most replayed hip-hop tracks of the '90s.",
  "1623522":
    "The 12\" single from *The Love Movement*. Tribe's last single from their original run before the breakup; melodic, late-period jazz-rap.",
  "7816096":
    "The 1999 compilation pulling together Tribe's biggest singles from all five albums. \"Bonita Applebum,\" \"Can I Kick It?,\" \"Award Tour,\" \"Electric Relaxation.\" The ideal entry point to the whole catalog.",

  // ─── Type O Negative ─────────────────────────────────────────────────────
  "19886482":
    "The debut. Brutal, heavy, Peter Steele's worldview at its most uncomfortably personal. \"Unsuccessfully Coping with the Natural Beauty of Infidelity\" runs twelve minutes. The record that established Type O before the goth-pop turn. 2021 reissue.",
  "25512865":
    "The breakthrough. \"Black No. 1 (Little Miss Scare-All),\" \"Christian Woman,\" \"Summer Breeze.\" The album that turned Type O into goth-metal cult royalty. Numbered limited reissue.",
  "20958604":
    "The masterpiece. \"Love You to Death,\" \"My Girlfriend's Girlfriend,\" \"In Praise of Bacchus,\" \"Wolf Moon.\" Less brutal than what came before; more melodic, more autumnal. The Type O record that introduced the band to a wider audience. 2021 reissue.",

  // ─── Billy Joel ──────────────────────────────────────────────────────────
  "10175678":
    "The new-wave Billy Joel. \"It's Still Rock and Roll to Me,\" \"You May Be Right,\" \"Don't Ask Me Why,\" \"All for Leyna.\" The album where Joel pushed back against being labeled a balladeer; harder-edged, faster, the singles dominating radio.",
  "822425":
    "The doo-wop/Motown nostalgia album. \"Uptown Girl,\" \"Tell Her About It,\" \"The Longest Time,\" \"Keeping the Faith.\" Joel writing in the styles of his teenage years; one of his biggest commercial successes.",
  "1326435":
    "The double-LP greatest-hits collection — the standard Billy Joel introduction for the rest of the century.",

  // ─── David Lee Roth ──────────────────────────────────────────────────────
  "9166399":
    "The four-song EP. \"California Girls\" (a Beach Boys cover, with Roth's video the calling card), \"Just a Gigolo / I Ain't Got Nobody.\" The release that effectively ended Van Halen — Roth's commercial peak as a solo act came at his old band's expense.",
  "1551701":
    "The proper solo debut. Steve Vai on guitar, Billy Sheehan on bass, Gregg Bissonette on drums — a virtuoso lineup playing Roth's grand-folly hard-rock. \"Yankee Rose,\" \"Goin' Crazy!,\" \"Tobacco Road.\" A genuine Van Halen-rivalling album.",
  "3833359":
    "The follow-up. Still Vai on guitar, but the songs more pop-oriented. \"Just Like Paradise,\" \"Damn Good.\" Less overall consistent than *Eat 'Em and Smile*; the start of the long Roth fade. Club Edition pressing.",

  // ─── Dio ─────────────────────────────────────────────────────────────────
  "13316385":
    "The debut. Dio out of Black Sabbath, Vivian Campbell on guitar, Vinny Appice on drums. \"Holy Diver,\" \"Rainbow in the Dark,\" \"Stand Up and Shout,\" \"Don't Talk to Strangers.\" The album that proved Dio could front his own band as well as any of the heavyweight names he'd previously sung for.",
  "15389682":
    "The follow-up. \"We Rock,\" the title track, \"Mystery,\" \"I Speed at Night.\" Possibly even better than the debut — the band fully locked in, Campbell's guitar at its peak.",
  "1547190":
    "The third album. More melodic, more keyboards, the live show getting more theatrical (the giant fire-breathing dragon arrived). \"Rock 'n' Roll Children,\" \"Hungry for Heaven,\" the title track. Vivian Campbell's last with Dio.",

  // ─── Savatage ────────────────────────────────────────────────────────────
  "23131682":
    "The album where Savatage became Savatage. Paul O'Neill producing, the songs more theatrical and prog-leaning. The title track is one of the great metal songs of the era. The blueprint for Trans-Siberian Orchestra was drawn here. 2022 reissue.",
  "23134733":
    "The full rock-opera. Operatic, theatrical, deeply '70s-prog in spirit. \"Jesus Saves,\" \"Tonight He Grins Again,\" \"If I Go Away.\" The peak of Jon Oliva's writing with the band. 2022 reissue.",
  "23890382":
    "Zak Stevens replaces Jon Oliva on lead vocals. \"Edge of Thorns,\" \"Lights Out.\" Criss Oliva's final album before his death in a car accident later that year. A tragic, beautiful record. 2022 reissue.",

  // ─── The Reverend Horton Heat ────────────────────────────────────────────
  "24196382":
    "The second album. Psychobilly cranked to maximum — Jim Heath's guitar work, the rockabilly trio sound at hardcore tempos. \"Wiggle Stick,\" \"Five-O Ford,\" \"It's a Dark Day.\" 2022 reissue.",
  "24196496":
    "The Sub Pop breakthrough. Al Jourgensen producing, the band on full grindhouse-rockabilly mode. \"Big Sky,\" \"Baddest of the Bad,\" \"I Could Get Used to It.\" 2022 reissue.",
  "24183839":
    "The debut. Pure psychobilly — fast, loud, smart. \"Psychobilly Freakout,\" \"Marijuana.\" The album that established the Rev as the king of the form. 2022 reissue.",
  "21133411":
    "The Christmas album. Psychobilly versions of holiday standards — exactly as advertised, somehow more enjoyable than that should be. RSD reissue with a misprint variant.",

  // ─── Green Day ───────────────────────────────────────────────────────────
  "706134":
    "The second Lookout album. Tre Cool's debut on drums. \"2000 Light Years Away,\" \"Welcome to Paradise,\" \"Christie Road.\" The album that established the Green Day sound — and the album they'd re-record half of for *Dookie* a few years later.",
  "24250745":
    "The phenomenon. \"Longview,\" \"Basket Case,\" \"When I Come Around,\" \"She.\" Diamond status; the album that turned punk-pop into a genre that filled stadiums. 2022 reissue.",
  "1297507":
    "The dark follow-up to *Dookie*. Heavier, faster, less obviously commercial. \"Geek Stink Breath,\" \"Brain Stew/Jaded,\" \"Walking Contradiction.\" The album that proved Green Day could resist being *Dookie 2*.",

  // ─── Eagles ──────────────────────────────────────────────────────────────
  "2398669":
    "The concept album about cowboys and outlaws — Don Henley and Glenn Frey writing as a unit for the first time. \"Tequila Sunrise,\" \"Doolin-Dalton,\" the title track. Less commercially successful than what came before or after; the artistic foundation of everything to follow.",
  "5073789":
    "The third album — the bridge between the country-rock Eagles and the harder-rocking Eagles to come. Don Felder joins. \"Already Gone,\" \"James Dean,\" \"The Best of My Love.\" The transition record.",
  "8135346":
    "The compilation. Diamond-certified — for years, the best-selling album in US history. \"Take It Easy,\" \"Witchy Woman,\" \"Lyin' Eyes,\" \"Best of My Love,\" \"One of These Nights.\" The standard Eagles introduction for everyone.",

  // ─── Bad Company ─────────────────────────────────────────────────────────
  "4491141":
    "The debut. Paul Rodgers (Free), Mick Ralphs (Mott the Hoople), Boz Burrell (King Crimson), Simon Kirke (Free). Recorded in seven days at Headley Grange. \"Can't Get Enough,\" \"Rock Steady,\" \"Bad Company,\" \"Movin' On.\" The supergroup that became its own thing.",
  "380973":
    "Another 1974 pressing of the debut — same album, second copy in the collection.",
  "5131426":
    "The third album. \"Run with the Pack,\" \"Honey Child,\" \"Live for the Music.\" Less iconic than the first two; tighter and more polished, the Bad Company sound completely refined.",

  // ─── Robin Trower ────────────────────────────────────────────────────────
  "6780284":
    "The masterpiece. Trower out of Procol Harum, James Dewar on bass and vocals, the Hendrix-meets-blues guitar sound at its absolute peak. \"Day of the Eagle,\" the title track, \"Too Rolling Stoned,\" \"Little Bit of Sympathy.\" One of the great instrumental-guitar albums of the '70s.",
  "15571730":
    "Another 1974 pressing of *Bridge of Sighs*. Same masterpiece, second copy.",
  "8145583":
    "The follow-up. Same lineup, less of a moment. \"Shame the Devil,\" \"Alethea,\" \"Confessin' Midnight.\" The deeper-cut Trower record for fans of the formula.",

  // ─── Fleetwood Mac ───────────────────────────────────────────────────────
  "528651":
    "The \"White Album.\" Lindsey Buckingham and Stevie Nicks join the band, the lineup-that-mattered locked in. \"Rhiannon,\" \"Landslide,\" \"Say You Love Me,\" \"Over My Head.\" The album that introduced the version of the band that would define '70s rock.",
  "7943027":
    "*The* album. Forty million copies sold worldwide. The band falling apart in real time, every song a window into a different romantic disaster. \"Dreams,\" \"Go Your Own Way,\" \"The Chain,\" \"Don't Stop,\" \"Songbird.\" The masterpiece.",
  "21862852":
    "Another reissue of *Rumours*. Same masterpiece, fresh pressing.",

  // ─── Mötley Crüe ─────────────────────────────────────────────────────────
  "728931":
    "The breakthrough. The album that turned Mötley Crüe into a national phenomenon. \"Looks That Kill,\" \"Too Young to Fall in Love,\" \"Shout at the Devil,\" \"Bastard.\" Tom Werman producing, the band at their most pure-LA-glam-metal moment.",
  "3873684":
    "Another reissue of *Shout at the Devil*. Same album, second copy.",
  "18840568":
    "The greatest-hits compilation — the singles and signature songs, plus a couple of new tracks. The standard Crüe introduction. 2021 reissue.",

  // ─── Squeeze ─────────────────────────────────────────────────────────────
  "4250609":
    "The breakthrough. Difford and Tilbrook writing at peak — clever, witty, melodic, tinged with new-wave production. The title track, \"Up the Junction,\" \"Slap and Tickle.\" The album that launched Squeeze as one of the best songwriting partnerships in British pop.",
  "3010036":
    "The follow-up. \"Pulling Mussels (From the Shell),\" \"Another Nail in My Heart,\" \"If I Didn't Love You.\" More refined than *Cool for Cats*; one of the great early-'80s pop records. 1982 reissue.",
  "9020141":
    "The best-of compilation pulling together the early Squeeze singles. The standard introduction for anyone whose Squeeze knowledge starts at \"Tempted.\"",

  // ─── The Romantics ───────────────────────────────────────────────────────
  "13452902":
    "The debut. Detroit power-pop with the matching red leather suits. \"What I Like About You\" (the song every restaurant has played at closing time for forty years), \"When I Look in Your Eyes.\" The album that defined the band.",
  "13098770":
    "The follow-up. Same year, same approach — power-pop hooks at speed. Less iconic single-by-single than the debut, but consistent.",
  "8872976":
    "The MTV-era Romantics. \"Talking in Your Sleep\" was the big hit; \"One in a Million\" was the deep cut. The band's commercial peak right before they got swallowed by '80s-rock blandness.",

  // ─── Bon Jovi ────────────────────────────────────────────────────────────
  "14970726":
    "The debut. Lance Quinn producing. \"Runaway,\" \"She Don't Know Me.\" Pre-*Slippery* Bon Jovi, hungrier, less polished. The album that established the band before they became a phenomenon. 1987 reissue.",
  "5304551":
    "The phenomenon. Bruce Fairbairn producing, Desmond Child co-writing, the songs chiseled to MTV-perfect. \"You Give Love a Bad Name,\" \"Livin' on a Prayer,\" \"Wanted Dead or Alive.\" Diamond status; the album that turned New Jersey hair-rockers into the biggest band in the world.",
  "8212263":
    "The follow-up. Bruce Fairbairn producing again, the songs slightly more grown-up. \"Bad Medicine,\" \"Born to Be My Baby,\" \"I'll Be There for You,\" \"Lay Your Hands on Me.\" Multi-platinum but slightly less of a moment than *Slippery*.",

  // ─── King Diamond ────────────────────────────────────────────────────────
  "744844":
    "The 12\" debut single. Released between *Mercyful Fate* and the King Diamond solo project — Christmas-themed metal as only King Diamond could imagine it.",
  "15180577":
    "The masterpiece. Concept album about a haunted house and a dead child, the King Diamond signature sound fully formed. \"Arrival,\" \"A Mansion in Darkness,\" \"The Family Ghost,\" \"Abigail.\" Foundational document of theatrical heavy metal. 2020 reissue.",
  "2124030":
    "The follow-up concept album — a haunted teapot, an Englishwoman called Grandma, the King Diamond storytelling at its most elaborate. \"Welcome Home,\" \"The Invisible Guests,\" the title track. The album that proved *Abigail* wasn't a one-time peak.",

  // ─── W.A.S.P. ────────────────────────────────────────────────────────────
  "1301774":
    "The debut. Blackie Lawless and the original lineup at their most theatrically shocking. \"L.O.V.E. Machine,\" \"I Wanna Be Somebody,\" \"Hellion.\" The album that got the PMRC's attention before the censorship hearings began.",
  "5572794":
    "The follow-up. \"Wild Child,\" \"Blind in Texas,\" \"Ballcrusher.\" Tighter than the debut; the band's commercial peak. Club Edition pressing.",
  "12951746":
    "The live album from the *Inside the Electric Circus* tour. The early hits captured at full theatrical intensity.",

  // ─── Queens Of The Stone Age ─────────────────────────────────────────────
  "14426180":
    "The masterpiece. Dave Grohl on drums, Mark Lanegan on guest vocals, Josh Homme writing the songs of his career. \"No One Knows,\" \"Go With the Flow,\" \"First It Giveth,\" \"A Song for the Dead.\" A loose concept album about driving across the California desert; the album that broke QOTSA into stadium territory. 2019 reissue.",
  "14432517":
    "The second album, the breakthrough. Nick Oliveri co-producing, the band's stoner-rock-meets-pop balance perfectly tuned. \"The Lost Art of Keeping a Secret,\" \"Auto Pilot,\" \"Feel Good Hit of the Summer.\" Foundational document of post-Kyuss desert rock. 2019 reissue.",
  "4608497":
    "The reunion record after a six-year gap. Dave Grohl back on drums, Trent Reznor and Elton John guesting, the album written through Homme's near-death recovery. \"I Sat by the Ocean,\" \"If I Had a Tail,\" \"My God Is the Sun.\" A genuine return to form, possibly even better than that.",

  // ─── Dwarves ─────────────────────────────────────────────────────────────
  "7928149":
    "The Sub Pop debut. Twelve songs in fifteen minutes; pure shock-punk at hardcore tempos. The album that established Blag Dahlia's Dwarves as the kings of provocative West Coast scuzz-punk.",
  "19160902":
    "The Epitaph album. More accessible than the early Sub Pop records, with actual choruses. \"Way Out,\" \"Pimp,\" \"We Must Have Blood.\" The Dwarves at their most listenable peak. 2019 reissue.",
  "1915946":
    "The follow-up. Still fast, still obnoxious, still smarter than they pretended to be. \"We're Not So Bad,\" \"Drug Store.\" Mid-period Dwarves at peak Dwarves.",

  // ─── Ratt ────────────────────────────────────────────────────────────────
  "4468276":
    "The breakthrough. Beau Hill producing. \"Round and Round,\" \"Wanted Man,\" \"Back for More.\" The album that turned Ratt into one of the defining LA hair-metal bands. Triple platinum.",
  "4831567":
    "The follow-up. Same producer, same approach, slightly more polish. \"Lay It Down,\" \"You're in Love.\" Multi-platinum; the band consolidating their position. Club Edition pressing.",
  "10869901":
    "The third album. \"Dance,\" \"Body Talk.\" Less iconic than its predecessors; the start of the slow Ratt decline as the genre got more crowded.",

  // ─── R.E.M. ──────────────────────────────────────────────────────────────
  "12093732":
    "The breakthrough. Scott Litt producing for the first time. \"It's the End of the World as We Know It (And I Feel Fine),\" \"The One I Love,\" \"Finest Worksong.\" The album that turned R.E.M. from college-radio darlings into mainstream rock band. 2018 reissue.",
  "17711755":
    "The phenomenon. \"Losing My Religion,\" \"Shiny Happy People,\" \"Near Wild Heaven.\" Multi-platinum; the album that turned R.E.M. into the biggest American rock band of the early '90s. 25th anniversary remastered reissue.",
  "653909":
    "The IRS-era greatest-hits compilation, released as the band moved to Warner. The standard introduction to the early college-radio R.E.M. catalog.",

  // ─── Ted Nugent ──────────────────────────────────────────────────────────
  "14059527":
    "The solo debut. After the Amboy Dukes, Nugent on his own with Derek St. Holmes singing most of it. \"Stranglehold\" (eight and a half minutes of pure guitar showcase), \"Just What the Doctor Ordered,\" \"Stormtroopin'.\" The album that established Nugent as a guitar god.",
  "15286358":
    "The breakthrough. The title track is one of the great cock-rock anthems of the '70s. \"Wang Dang Sweet Poontang,\" \"Death by Misadventure.\" The album that turned Nugent into a stadium act.",
  "4344470":
    "The double live album. Nugent at his peak as a touring force — every song stretched out, every guitar solo extended, the audience screaming. The Nugent live document; one of the great hard-rock live albums of the era.",

  // ─── Lionel Richie ───────────────────────────────────────────────────────
  "9725047":
    "The solo debut. James Anthony Carmichael producing. \"Truly,\" \"You Are,\" \"My Love.\" Richie out of the Commodores, sounding like himself for the first time. 1984 repress.",
  "4225726":
    "The phenomenon. Diamond status. \"All Night Long (All Night),\" \"Hello,\" \"Penny Lover,\" \"Stuck on You.\" The album that turned Richie into the biggest pop star in America.",
  "19305115":
    "The follow-up. Multi-platinum but slightly less of a moment than *Can't Slow Down*. The title track is the calling card; \"Say You, Say Me\" had already won an Oscar by the time the album dropped.",

  // ─── Bad Brains ──────────────────────────────────────────────────────────
  "19227691":
    "The debut. *The* hardcore record — fifteen songs in thirty minutes, the band moving between thrash and reggae with no warning. \"Pay to Cum,\" \"Banned in DC,\" \"Big Take Over.\" The album that more or less invented hardcore as a fully-formed thing. 2021 reissue.",
  "20569102":
    "The Ric Ocasek-produced follow-up. Tighter and louder than the debut; the band's most accessible early album. \"Coptic Times,\" \"Sailin' On,\" \"I and I Survive.\" 2021 reissue.",
  "20813419":
    "The original 1980 7\" single — the song that introduced Bad Brains to the world. Reissued as a numbered limited 7\".",

  // ─── Heart ───────────────────────────────────────────────────────────────
  "6921009":
    "The fourth Heart album, the troubled one — the band locked in a contract dispute with Mushroom Records, which assembled the album from old demos against the band's wishes. \"Heartless,\" \"Devil Delight.\" A fascinating document of label-vs-band dysfunction.",
  "7628736":
    "The double LP — half greatest hits, half live recordings. The standard Heart introduction for the era between the two main eras of the band.",
  "1028214":
    "The comeback. Ron Nevison producing, the songs aimed at MTV. \"What About Love,\" \"Never,\" \"These Dreams,\" \"Nothin' at All.\" Quintuple platinum; the album that turned Heart from '70s arena-rock survivors into '80s power-ballad royalty.",

  // ─── Rod Stewart ─────────────────────────────────────────────────────────
  "485238":
    "The album with \"You're in My Heart (The Final Acclaim)\" and \"Hot Legs.\" Stewart in his post-Faces, mid-disco-flirtation era. The bridge between \"Maggie May\" Stewart and the polished radio Stewart of the '80s.",
  "7058917":
    "The follow-up to the disco-leaning *Foolish Behavior*. \"Young Turks,\" \"Tonight I'm Yours,\" \"How Long.\" The synthesizers more prominent; the early-'80s Stewart sound at its most refined.",
  "8251673":
    "The compilation that pulled together the post-*Atlantic Crossing* singles. The standard introduction to '70s solo Stewart. 1983 repress.",

  // ─── Boston ──────────────────────────────────────────────────────────────
  "13125386":
    "The debut. Tom Scholz recording in his basement on equipment he built himself. \"More Than a Feeling,\" \"Peace of Mind,\" \"Foreplay/Long Time,\" \"Rock & Roll Band.\" Diamond status, the all-time best-selling debut for years, the album that defined what big-rock production could be.",
  "7141254":
    "The follow-up. Same Scholz approach, same big-production sound. The title track was the hit; the rest was uneven by comparison to the debut, but the standards stayed high.",
  "850430":
    "The eight-years-later third album. Brad Delp's vocals back, \"Amanda\" the calling-card single, \"We're Ready\" the deeper cut. Multi-platinum despite the long delay; nobody else made records like this.",

  // ─── Joe Jackson ─────────────────────────────────────────────────────────
  "3611210":
    "The debut. New-wave power-pop with horns and angular guitar. \"Is She Really Going Out with Him?,\" \"Sunday Papers,\" \"One More Time.\" The album that introduced Jackson as the smart, snide alternative to the post-punk scene.",
  "15661366":
    "The fast follow-up — same year, same band, same approach. \"It's Different for Girls,\" \"Kinda Kute,\" the title track. The second half of the one-two punch that established Jackson.",
  "10428542":
    "The jump-blues / swing-revival album. Jackson and a horns-heavy band doing 1940s Louis Jordan / Cab Calloway songs straight. Polarizing then, completely vindicated since.",
  "11450606":
    "The pivot. Latin rhythms, Manhattan sophistication, Jackson reinventing himself entirely. \"Steppin' Out,\" \"Breaking Us in Two,\" \"Real Men.\" His commercial peak and arguably his masterpiece.",

  // ─── Johnny Cash ─────────────────────────────────────────────────────────
  "4255659":
    "The 7\" single — original Sun Records pressing era. \"I Walk the Line\" — the song. The defining recording of early Cash.",
  "13955955":
    "A Sun Records compilation pulling together the early Cash and Tennessee Two singles. Foundational document of the rockabilly Cash era.",
  "10502809":
    "The compilation released as Cash hit his early-Columbia peak. The title track was the hit; the comp covers a lot of ground beyond it. Mono pressing.",
  "1045459":
    "The Columbia greatest-hits comp. Standard introduction for a generation of Cash listeners.",
  "4699658":
    "A double-LP comp covering the late-'60s Cash at his commercial and creative peak. The Folsom/San Quentin era distilled.",

  // ─── 2-record artists ────────────────────────────────────────────────────
  "1100891":
    "The first Slade compilation, capturing the band at the height of their UK glam-rock dominance — \"Cum On Feel the Noize,\" \"Mama Weer All Crazee Now,\" \"Take Me Bak 'Ome,\" \"Skweeze Me Pleeze Me.\" The deliberately-misspelled-titles era distilled.",
  "6280689":
    "The band's '80s comeback, with \"Run Runaway\" and \"My Oh My\" — the two singles that reintroduced Slade to American radio and inspired the Quiet Riot covers that followed.",
  "16659117":
    "The breakthrough. Conceptually ambitious, sonically pristine — Ken Scott engineering. \"Bloody Well Right,\" \"Dreamer,\" \"School,\" \"Rudy.\" The album that established Supertramp as one of the great prog-pop bands of the era.",
  "617486":
    "The phenomenon. Multi-platinum, top of the charts. \"The Logical Song,\" \"Take the Long Way Home,\" the title track, \"Goodbye Stranger.\" The album that made Supertramp a household name.",
  "22124983":
    "The breakthrough. The Brooklyn band's hardcore-metal-rap fusion — heavy, angry, crushing. The album that established Biohazard as one of the defining bands of '90s NYC hardcore. 2022 reissue.",
  "32427309":
    "The major-label album. Cleaner production, the songs more focused. 2024 RSD reissue.",
  "5738575":
    "The debut. Carlos Santana fusing rock, blues, and Latin percussion before Woodstock made the band famous. \"Evil Ways,\" \"Jingo,\" \"Soul Sacrifice.\" Year zero of Latin rock.",
  "1079527":
    "The early-'80s Santana — more pop-oriented, less jam-focused. \"Winning\" was the hit.",
  "11648649":
    "The Killer at the Birmingham Municipal Auditorium, the post-marriage-scandal comeback in full force. Country-tinged rockabilly meets the original lunatic. Stereo pressing.",
  "2636351":
    "The mono pressing of the same Birmingham live record.",
  "9495823":
    "The masterpiece. Concept album about aging, with \"Mrs. Robinson,\" \"America,\" \"Old Friends,\" \"A Hazy Shade of Winter,\" \"At the Zoo.\" One of the greatest American pop albums.",
  "4317210":
    "The post-breakup compilation. The standard Simon & Garfunkel introduction.",
  "11229467":
    "Stoner-rock trio out of NJ, ex-members of Monster Magnet. Heavy fuzz, big riffs, prog instincts.",
  "29025289":
    "Earlier Bitchwax album reissued — same band, same approach, more of the heavy fuzz that built the cult.",
  "26551505":
    "The compilation pulling together the Keith Morris / Chavo / Dez Cadena pre-Rollins era — \"Wasted,\" \"Nervous Breakdown,\" \"Jealous Again.\" Foundational document of LA hardcore.",
  "11599673":
    "The masterpiece. Henry Rollins's debut. \"Rise Above,\" \"Six Pack,\" \"TV Party,\" \"Damaged I.\" The album that defined American hardcore.",
  "23572895":
    "The masterpiece. Quebec prog-thrash, the Pink Floyd cover (\"Astronomy Domine\") at its weirdest. \"The Unknown Knows,\" \"Pre-Ignition.\" 2022 RSD reissue.",
  "28430650":
    "Concept album about a galactic transcendental being. Voïvod's most ambitious record. 2023 reissue.",
  "27840558":
    "The Donnas' breakthrough — Lookout-era pop-punk with full Runaways/AC/DC swagger. 2023 reissue.",
  "27840036":
    "The debut. Pure teenage Donnas, before they figured out the AC/DC pivot. 2023 reissue.",
  "11497435":
    "The debut EP. LA punk-funk-ska-metal fusion; nobody else sounded like this. \"Party at Ground Zero,\" \"Ugly,\" \"? (Modern Industry).\"",
  "26513438":
    "The breakthrough. Sharper songwriting, the Curtis Mayfield \"Freddie's Dead\" cover. \"Ma and Pa,\" \"Bonin' in the Boneyard.\" 2023 reissue.",
  "1106103":
    "The soundtrack. \"Flash\" was the hit; the rest is largely instrumental Queen score work — campy, brilliant.",
  "5698008":
    "\"Another One Bites the Dust,\" \"Crazy Little Thing Called Love.\" The album that turned Queen into a US-radio phenomenon.",
  "9914880":
    "The score. \"The Ecstasy of Gold,\" \"Il triello.\" One of the greatest film scores ever composed.",
  "7922257":
    "Tarantino soundtrack. Morricone's late-period Western score, won him his first Oscar.",
  "14466553":
    "Late-period thrash from the NJ veterans. Faster than most bands half their age. RSD deluxe.",
  "21211915":
    "Six-LP box of the Atlantic-era Overkill catalog — *Feel the Fire* through *I Hear Black*. Limited box set.",
  "385133":
    "Yngwie's second album, the one with Jeff Scott Soto on vocals. Neoclassical shred-metal at its most uncompromising. \"I'll See the Light, Tonight.\"",
  "3118600":
    "Joe Lynn Turner on vocals. \"Heaven Tonight,\" \"Crystal Ball.\" Yngwie's most commercial album.",
  "7868541":
    "Tenth Clutch album. \"X-Ray Visions,\" \"A Quick Death in Texas.\" Late-period peak Clutch.",
  "7082884":
    "The blues-rock-leaning Clutch record. Dirtier and looser than what surrounded it. 2015 repress.",
  "3315019":
    "The breakthrough. Joey Cape's songwriting at full power. \"May 16,\" \"Violins.\" 2011 reissue.",
  "25552669":
    "The follow-up. More melodic, more polished. 2022 reissue.",
  "4982268":
    "The double live album. Lowell George's last great document with the band — boogie, funk, roots-rock at the highest level.",
  "9922094":
    "Another pressing of *Waiting for Columbus*. Same album, second copy.",
  "1416843":
    "Solo debut after the Go-Go's. \"Mad About You\" was the hit.",
  "7574662":
    "The breakthrough. \"Heaven Is a Place on Earth,\" \"I Get Weak.\" Club Edition pressing.",
  "706690":
    "The debut. Steve Howe (Yes), Carl Palmer (ELP), Geoff Downes (Buggles/Yes), John Wetton (King Crimson). \"Heat of the Moment,\" \"Only Time Will Tell.\" Prog-rock supergroup goes platinum.",
  "1569066":
    "The follow-up. \"Don't Cry,\" \"The Smile Has Left Your Eyes.\" Less of a moment than the debut. Club Edition pressing.",
  "25089685":
    "The major-label MxPx — pop-punk Christians from Bremerton, WA. \"I'm OK, You're OK.\" 2022 reissue.",
  "25089814":
    "The Tooth & Nail breakthrough. Pop-punk with PG-13 Christian themes. 2022 reissue.",
  "16089952":
    "The pre-*Splinter Shards* ZAO material. Hardcore beginnings, before the band reinvented itself as metalcore.",
  "22823951":
    "The ZAO masterpiece. Metalcore as theology. 2022 reissue.",
  "2467457":
    "The Epic-era compilation. Includes \"He Stopped Loving Her Today\" — country music's most-covered, most-cited song.",
  "2793588":
    "The 7\" promo single — the song before Chris Stapleton made it ubiquitous.",
  "5776726":
    "The breakthrough. \"Pink Houses,\" \"Crumblin' Down,\" \"Authority Song.\" The album that established Mellencamp as more than a regional act.",
  "8248703":
    "The roots-rock pivot. \"Paper in Fire,\" \"Cherry Bomb.\" Mellencamp at his most distinctive — fiddles, accordions, Indiana storytelling.",
  "10258354":
    "The breakthrough. Double album, Prince inventing his '80s sound. \"1999,\" \"Little Red Corvette,\" \"Delirious.\"",
  "1778185":
    "The Batman soundtrack. \"Batdance,\" \"Partyman.\" Pure late-'80s Prince — funk, theater, weirdness.",
  "2696142":
    "The breakthrough. Andy Johns producing. \"Nobody's Fool,\" \"Shake Me,\" the title track.",
  "5746882":
    "The blues-rock turn. \"Don't Know What You Got (Till It's Gone).\" Cinderella moving past the hair-metal template into something more grown-up.",
  "3234708":
    "The masterpiece. \"Gimme Shelter,\" \"You Can't Always Get What You Want,\" \"Midnight Rambler,\" \"Country Honk.\" Brian Jones's last; Mick Taylor's first.",
  "14113118":
    "The last great Stones album. \"Start Me Up,\" \"Waiting on a Friend.\" Mostly outtakes from earlier sessions, brilliantly assembled.",
  "5812988":
    "Mick Taylor era at full power. \"Brown Sugar,\" \"Wild Horses,\" \"Sister Morphine,\" \"Moonlight Mile.\" Andy Warhol's zipper cover.",
  "5642260":
    "Mick Taylor's last. The title track, \"Time Waits for No One,\" \"Ain't Too Proud to Beg.\" The end of the imperial era.",
  "4845662":
    "The masterpiece. \"Wild World,\" \"Father and Son,\" \"Where Do the Children Play.\" Cat Stevens at his most quietly devastating.",
  "6254090":
    "The follow-up. \"Peace Train,\" \"Moonshadow,\" \"Morning Has Broken.\" Two stone-cold masterpieces in a row.",
  "17617867":
    "The last Kyuss album. Less fuzzy, more song-oriented than what came before. The end of stoner-rock's foundational band. 2021 reissue.",
  "17482804":
    "The masterpiece. The album that more or less invented stoner-doom as a recognizable genre. \"Green Machine,\" \"Thumb,\" \"50 Million Year Trip (Downside Up).\" 2021 reissue.",
  "573259":
    "The debut. Orson Welles narrating \"Dark Avenger.\" Pure mythic-metal absurdism, taken with absolute sincerity.",
  "13789136":
    "The 28-minute \"Achilles, Agony and Ecstasy in Eight Parts.\" Manowar at their most operatically extreme.",
  "23261477":
    "The Mike Patton EP. Mathcore meets Mr. Bungle. Brief, hostile, brilliant. 2022 reissue.",
  "22936127":
    "The final DEP album. The band signing off with their most ambitious record.",
  "1024395":
    "The breakthrough. \"Refugee,\" \"Don't Do Me Like That,\" \"Here Comes My Girl.\" Jimmy Iovine producing. The album that turned Petty into a household name.",
  "412419":
    "The follow-up. \"The Waiting,\" \"A Woman in Love (It's Not Me),\" \"Insider.\" The Heartbreakers consolidating their position.",
  "19332691":
    "The \"Astronomy Domine\" album — the Pink Floyd cover that signaled a new Voivod direction. Eric Forrest era.",
  "22980044":
    "The pop-Voivod record. Polarizing then; vindicated since. 2022 RSD reissue.",
  "568590":
    "The debut. \"I Remember You,\" \"18 and Life,\" \"Youth Gone Wild.\" The album that turned Sebastian Bach into a star.",
  "21230056":
    "Box-set Skid Row — the Atlantic-era catalog collected.",
  "6060614":
    "The breakthrough. \"No One Like You,\" \"Can't Live Without You.\" Klaus Meine briefly losing his voice during recording nearly killed the album.",
  "5371830":
    "The peak. \"Rock You Like a Hurricane,\" \"Still Loving You.\" Club Edition pressing.",
  "15599849":
    "Jay Farrar's post-Uncle Tupelo debut. \"Drown,\" \"Windfall.\" Foundational alt-country. 2020 reissue.",
  "19710010":
    "Recent Son Volt. The political alt-country, written through Trump-era America.",
  "380865":
    "*The* album. Ska-punk before the third wave. \"Sound System,\" \"Knowledge,\" \"Bombshell.\" Tim Armstrong and Matt Freeman before Rancid.",
  "22134799":
    "The 2022 reissue of *Energy*. Same album, fresh vinyl.",
  "18368407":
    "Dave Smalley's first Dag Nasty record. Melodic hardcore with hooks. \"Values Here,\" \"Justification.\" 2021 reissue.",
  "18868789":
    "Peter Cortner takes over vocals. The classic Dag Nasty sound. 2021 repress.",
  "4495207":
    "Pre-EP demos. \"Filler,\" \"I Don't Wanna Hear It.\" Year zero of straight-edge hardcore. 2013 reissue.",
  "22085566":
    "The discography compilation. Every Minor Threat song you'd want, on one piece of vinyl. 2022 reissue.",
  "115079":
    "The 12\" maxi-single. \"Let's Go Crazy\" extended for the dance floor.",
  "20944321":
    "The masterpiece. \"Purple Rain,\" \"When Doves Cry,\" \"Let's Go Crazy,\" \"I Would Die 4 U.\" The album that defined the '80s. 2021 reissue.",
  "12768637":
    "\"Hollywood Nights,\" \"Old Time Rock and Roll,\" \"Still the Same.\" Seger's commercial peak — Detroit working-class rock with arena ambitions.",
  "18738349":
    "\"Shame on the Moon,\" \"Even Now.\" The follow-up to *Against the Wind* — Seger settling into mature MTV-era rock.",
  "2923681":
    "The breakthrough. Tom Allom producing, AC/DC-style hard rock from Switzerland.",
  "417935":
    "The follow-up. \"Midnite Maniac.\" Krokus consolidating their position.",
  "11732086":
    "The live album that broke them in the US. \"I Want You to Want Me,\" \"Surrender.\" Cheap Trick captured at peak Cheap Trick.",
  "10642292":
    "\"Dream Police,\" \"Way of the World,\" \"Voices.\" The studio album that capitalized on *Budokan*'s momentum.",
  "6634121":
    "The breakthrough. \"Sister Christian,\" \"(You Can Still) Rock In America.\" Night Ranger as definitive mid-'80s arena rock.",
  "1966796":
    "\"Sentimental Street,\" \"Goodbye.\" The follow-up.",
  "16205401":
    "The debut. \"Plush,\" \"Sex Type Thing,\" \"Creep.\" The album that put STP on the same shelf as Pearl Jam in 1992. 2020 reissue.",
  "16931310":
    "The masterpiece. \"Vasoline,\" \"Interstate Love Song,\" \"Big Empty.\" The album that proved STP were more than the second-coming-of-Pearl-Jam they got typed as. 2021 reissue.",
  "893003":
    "The Lookout debut. Pop-punk from Forestville, CA. The first Bracket album, before the band figured out the formula they'd ride for the next decade.",
  "1504500":
    "The companion 7\" EP to *924 Forestville St.*",
  "2444506":
    "Vancouver psych-rock. Stephen McBean's expansive '70s-leaning sound.",
  "8329410":
    "The fourth Black Mountain album. Synthier, more ambitious — psych-rock approaching prog territory.",
  "12421536":
    "Etched 12\" single. Sleep returns; the doom monolith back from the dead.",
  "18754174":
    "The masterpiece. \"Dragonaut,\" \"The Druid,\" \"Holy Mountain.\" Stoner-doom in its most foundational form. 2021 reissue.",
  "21328081":
    "The Howard Jones-debut album. \"The End of Heartache,\" \"Rose of Sharyn.\" Metalcore at its commercial peak. 2021 reissue.",
  "17342563":
    "The follow-up. \"My Curse,\" \"The Arms of Sorrow.\" Killswitch consolidating their post-Roadrunner peak. 2021 reissue.",
  "7478017":
    "The debut. \"Brass in Pocket,\" \"Kid,\" \"Stop Your Sobbing.\" Chrissie Hynde's masterpiece — and the album that established the Pretenders as one of the great new-wave bands.",
  "1386842":
    "\"Message of Love,\" \"Talk of the Town.\" James Honeyman-Scott's last with the band — he'd die a year later.",
  "1937013":
    "The debut. Carmine Appice and Tim Bogert's heavy-rock supergroup post-Vanilla Fudge. Heavier than expected, looser than they'd be later.",
  "1536397":
    "The fourth and final original Cactus album. The band already disintegrating; the heaviness still impressive.",
  "5585401":
    "The debut. Mitchell Froom producing. Boston roots-rockers in the IRS-era underground rock world. Club Edition pressing.",
  "1547160":
    "The follow-up. \"I Still Want You.\" Cleaner production; the band moving toward '80s adult rock.",
  "7446037":
    "The Cars frontman's solo debut. Synth-leaning, more experimental than the Cars. Club Edition pressing.",
  "12669442":
    "The follow-up. \"Emotion in Motion.\" More accessible than *Beatitude*. Club Edition pressing.",
  "14050372":
    "The third Kansas album. Pre-*Leftoverture* prog-rock — finding the formula but not yet riding it.",
  "788029":
    "The follow-up to *Leftoverture*. \"Dust in the Wind,\" the title track. Kansas's commercial and creative peak.",
  "9118863":
    "The third album. \"Love Gun.\" James at his early funk peak.",
  "10667689":
    "Post-*Street Songs* James. \"Dance Wit' Me.\" Club Edition pressing.",
  "204797":
    "The 12\" single. The Jam-and-Lewis-produced classic that defined Janet's *Control* era.",
  "16171629":
    "The album. Janet's breakthrough. \"Nasty,\" \"What Have You Done for Me Lately,\" \"When I Think of You.\" The album that turned Janet Jackson from \"Michael's sister\" into a force of her own.",
  "485002":
    "*The* album. Sixty-six million copies sold worldwide. \"Thriller,\" \"Beat It,\" \"Billie Jean,\" \"Wanna Be Startin' Somethin'.\" The biggest pop record ever made.",
  "459606":
    "The follow-up. \"Bad,\" \"The Way You Make Me Feel,\" \"Smooth Criminal,\" \"Man in the Mirror.\" The album that proved *Thriller* wasn't a one-time peak.",
  "9832273":
    "\"Ah! Leah!\" The Pittsburgh power-pop hit, Mark Avsec's writing.",
  "11873196":
    "\"Love Is Like a Rock.\" The follow-up. Donnie Iris consolidating his late-bloomer career.",
  "7780315":
    "The 4-song EP. \"Bad\" live; \"A Sort of Homecoming\" live. Bridge between *Unforgettable Fire* and *Joshua Tree*.",
  "1112974":
    "The masterpiece. \"Where the Streets Have No Name,\" \"I Still Haven't Found What I'm Looking For,\" \"With or Without You.\" The album that turned U2 into the biggest band in the world.",
  "9643831":
    "Setzer's solo debut after the Stray Cats. Heartland rock instead of rockabilly.",
  "1596571":
    "The follow-up. Setzer still figuring out his solo identity in the years before the Brian Setzer Orchestra.",
  "120588":
    "The debut. \"Stick 'Em,\" \"Jail House Rap.\" Old-school rap with personality.",
  "9371276":
    "The Chubby Checker collaboration single. Late-Fat Boys novelty rap.",
  "13541812":
    "Sting's solo debut. \"If You Love Somebody Set Them Free,\" \"Fortress Around Your Heart.\" Jazz-tinged adult contemporary; the start of post-Police Sting.",
  "14633879":
    "The follow-up. \"We'll Be Together,\" \"Englishman in New York,\" \"Be Still My Beating Heart.\" Sting's commercial peak as a solo artist.",
  "1766798":
    "The breakthrough. \"Lay It on the Line,\" \"Hold On.\" Canadian power-trio prog-metal.",
  "13223254":
    "\"Magic Power,\" \"Fight the Good Fight.\" Triumph's commercial peak.",
  "3837505":
    "The album. Michael Schenker on guitar. \"Lights Out,\" \"Too Hot to Handle,\" \"Love to Love.\" Foundational hard rock.",
  "18935734":
    "The 10\" RSD single — *Strangers in the Night* studio versions of two live staples.",
  "8439986":
    "The Moog synthesizer Bach album. Multi-platinum classical record. Foundational electronic music. 1970 reissue.",
  "118822":
    "The follow-up. More Moog-realized classical favorites; less of a moment than *Switched-On Bach* but still expanding what a synthesizer record could be.",
  "6746954":
    "The debut. \"Who Can It Be Now?,\" \"Down Under,\" \"Be Good Johnny.\" Australia's biggest pop-rock band of 1982.",
  "9926827":
    "The follow-up. \"Overkill,\" \"It's a Mistake.\" Less of a moment than *Business as Usual*.",
  "17205244":
    "The disco-funk debut. \"Boogie Nights.\" Rod Temperton writing. The album that launched a Quincy Jones favorite songwriter.",
  "825509":
    "\"Always and Forever,\" \"The Groove Line.\" Heatwave's commercial peak.",
  "9254447":
    "The debut. Sub Pop. \"About a Girl,\" \"Negative Creep,\" \"Blew.\" Pre-Grohl Nirvana — a different band, with the same writer at its center. 2015 reissue.",
  "20914213":
    "The phenomenon. \"Smells Like Teen Spirit,\" \"Come as You Are,\" \"Lithium.\" The album that ended the '80s overnight. 2021 reissue.",
  "1542128":
    "Trad ska/rocksteady from LA. Hellcat-era Hepcat — the closest the third-wave-ska era got to actual Studio One.",
  "1764691":
    "The follow-up. More of the same Skatalites-influenced trad-ska with horns out front.",
  "8627684":
    "The breakthrough US album. \"The One Thing,\" \"Don't Change.\" Nick Launay producing.",
  "12327319":
    "The phenomenon. \"Need You Tonight,\" \"New Sensation,\" \"Devil Inside,\" \"Never Tear Us Apart.\" Multi-platinum; the album that turned INXS into a stadium band. Club Edition pressing.",
  "16158051":
    "The early-'90s Trouble album. Doom metal with Christian themes; less prominent than the '80s catalog. 2020 reissue.",
  "16302895":
    "The \"Black Album.\" Rick Rubin producing. Trouble's commercial peak. 2020 reissue.",
  "7734517":
    "*The* album. Forty-three million copies sold worldwide. \"Paradise by the Dashboard Light,\" \"Two Out of Three Ain't Bad,\" \"Bat Out of Hell.\" Jim Steinman's masterpiece.",
  "11858130":
    "Another 1977 pressing of *Bat Out of Hell*. Same album, second copy in the collection.",
  "501949":
    "\"Getaway,\" \"Imagination.\" EW&F at peak EW&F.",
  "9225386":
    "\"Let's Groove.\" The biggest hit of EW&F's career; the synth-funk pivot.",
  "10364170":
    "\"The Big Crash.\" Late-'80s Eddie Money. Reissue pressing.",
  "8005002":
    "The follow-up to the debut. \"Maybe I'm a Fool.\" Eddie Money's straightforward rock-with-saxophone formula.",
  "9665783":
    "\"Every Kinda People.\" Robert Palmer's first big crossover hit.",
  "6886838":
    "\"Bad Case of Loving You (Doctor Doctor).\" Palmer's hardest-rocking pre-MTV record.",
  "1364746":
    "\"Old Fashioned Love Song.\" Three Dog Night at peak.",
  "7088203":
    "The compilation. \"Joy to the World,\" \"Mama Told Me Not to Come,\" \"One.\" The standard Three Dog Night intro.",
  "15151242":
    "\"Heartbroke.\" Skaggs's neo-traditional country breakthrough — bluegrass instincts in a Nashville production framework.",
  "2306634":
    "The follow-up. The neo-traditionalist movement Skaggs helped invent in full bloom.",
  "6453378":
    "\"Everybody Wants You.\" Squier's follow-up to *Don't Say No*; not quite the moment but a strong record.",
  "1581568":
    "\"Rock Me Tonite.\" The video that allegedly destroyed his career — and a perfectly good single regardless.",
  "2518486":
    "The masterpiece. Three songs, two of them side-long. \"Close to the Edge,\" \"And You and I,\" \"Siberian Khatru.\" Yes at peak Yes.",
  "15845768":
    "The Trevor Rabin-era pop comeback. \"Owner of a Lonely Heart.\" Different band, different sound, same name. Club Edition pressing.",
  "1336190":
    "With Crazy Horse. \"Cinnamon Girl,\" \"Cowgirl in the Sand,\" \"Down by the River.\" The album that established the Young/Crazy Horse template.",
  "15490591":
    "\"After the Gold Rush,\" \"Southern Man,\" \"Tell Me Why.\" Quiet, electric, devastating; one of his absolute peaks.",
  "2039943":
    "The Monument-era comp. \"Crying,\" \"In Dreams,\" \"Oh, Pretty Woman.\" Orbison at peak Orbison.",
  "689570":
    "The posthumous comeback album. \"You Got It,\" \"She's a Mystery to Me\" (a Bono co-write). Released a few months after his death.",
  "2355916":
    "The debut. \"Turn Me Loose,\" \"The Kid Is Hot Tonite.\" Canadian arena-rock template fully formed.",
  "8274478":
    "The breakthrough. \"Working for the Weekend,\" \"When It's Over.\" Loverboy at their commercial peak.",
  "665695":
    "\"Hit Me with Your Best Shot,\" \"Treat Me Right.\" Benatar's breakthrough.",
  "608392":
    "\"Fire and Ice,\" \"Promises in the Dark.\" The follow-up — Benatar consolidating her position as the leading woman in arena rock.",
  "13400743":
    "The instrumental-rock standard. \"Walk, Don't Run.\" The Ventures at their most foundational.",
  "9047526":
    "The Ventures go surf. Mono pressing — original 1963 release.",
  "5476447":
    "Industrial single. KMFDM at their late-'90s remix-EP peak. 2014 reissue.",
  "13925088":
    "The breakthrough KMFDM album. Industrial rock at its German-American peak. 2019 reissue.",
  "2996321":
    "The classic NYHC album. Walter Schreifels writing. \"Cats and Dogs,\" \"Hold Your Ground,\" \"New Direction.\" Foundational youth-crew document.",
  "18959677":
    "The pre-LP EP. \"High Hopes.\" 2021 repress.",
  "2580199":
    "The breakthrough. \"Heart of Glass,\" \"One Way or Another,\" \"Hanging on the Telephone.\" Mike Chapman producing. The album that turned Blondie into a pop band of consequence.",
  "160209":
    "The eclectic follow-up. \"Rapture,\" \"The Tide Is High.\" Blondie sliding through reggae, rap, and easy listening — and somehow making it cohere.",
  "401466":
    "The masterpiece. \"Urgent,\" \"Waiting for a Girl Like You,\" \"Juke Box Hero.\" Mutt Lange producing. Foreigner's commercial and creative peak.",
  "2040232":
    "\"I Want to Know What Love Is,\" \"That Was Yesterday.\" The follow-up — softer, more keyboard-led, multi-platinum on the strength of one ballad.",
  "9042575":
    "The cowpunk EP. \"White Lies,\" Bob Dylan's \"Absolutely Sweet Marie\" played at hardcore tempo. Foundational document of the Nashville-vs-NYC sound.",
  "1162552":
    "The follow-up LP. The Scorchers consolidating the cowpunk sound.",
  "12951516":
    "The Atlantic-era Juliana Hatfield. \"Universal Heart-Beat.\" 2018 numbered limited reissue.",
  "18620287":
    "Recent Hatfield album. The songwriting still sharp three decades in.",
  "541912":
    "Simon & Garfunkel material plus instrumental score. \"Mrs. Robinson,\" \"Sound of Silence.\" The soundtrack that got the songs into a generation's bloodstream.",
  "1331268":
    "Solo Simon. The film soundtrack-companion record. \"Late in the Evening.\"",
  "107470":
    "The 12\" single. Extended mixes of the Depeche Mode signature song.",
  "5745724":
    "The masterpiece. \"Personal Jesus,\" \"Enjoy the Silence,\" \"Policy of Truth.\" The album that turned Depeche Mode into stadium-fillers. 2014 reissue.",
  "809007":
    "Dave Smalley's post-Dag Nasty/All band. Melodic hardcore.",
  "1298693":
    "The Epitaph-era follow-up. Down by Law consolidating their formula.",
  "1985916":
    "The first of the RCA \"Legendary Performer\" comps. Outtakes plus hits.",
  "17243104":
    "A budget-priced Elvis comp. The kind of record that lived next to the turntable in millions of suburban living rooms.",
  "15037130":
    "The first post-Army Elvis album / soundtrack. The career pivot — leaner, tamer, the GI image officially launched.",
  "14298123":
    "The debut. \"Blue Suede Shoes,\" \"Tutti Frutti.\" The album that started everything. 1962 repress.",
  "9602372":
    "The major-label debut. \"Kool Thing,\" \"Tunic (Song for Karen),\" \"Dirty Boots.\" The album that brought Sonic Youth out of the underground.",
  "1190783":
    "The 12\" promo single. Chuck D guesting.",

  // ─── 1-record artists ────────────────────────────────────────────────────
  "2153365":
    "The breakthrough. \"Fox on the Run,\" \"Ballroom Blitz,\" \"Action.\" UK glam-rock at its hardest-edged peak — Brian Connolly fronting the band that bridged Slade and Cheap Trick.",
  "2939842":
    "A retrospective compilation of Arthur Lee's late-'60s LA psych/folk band — including key tracks from *Forever Changes*. The standard introduction.",
  "31132385":
    "Vince Clarke and Andy Bell at their commercial peak. \"A Little Respect,\" \"Chains of Love,\" \"Ship of Fools.\" The album that turned Erasure from synth-pop cult act into massive UK pop band. 2023 reissue.",
  "32427519":
    "Helmet's third album, more dynamic than *Meantime*. \"Wilma's Rainbow,\" \"Milquetoast.\" The album that influenced everyone in '90s alt-metal that mattered. 2024 reissue.",
  "30495316":
    "The straight-edge hardcore classic. Ray Cappo's youth-crew band at peak power. 2024 repress.",
  "394452":
    "The masterpiece. \"Karn Evil 9\" — three impressions, half an hour of prog-rock excess at its most thrilling. Plus \"Toccata,\" \"Still... You Turn Me On.\"",
  "2575861":
    "The album that more or less invented orchestral rock. \"Nights in White Satin.\" Released in 1967; a hit again in 1972 when \"Nights\" finally broke in the US. 1971 repress.",
  "2318781":
    "The 20th-anniversary comp that reignited Monkeemania. Includes new tracks \"That Was Then, This Is Now.\"",
  "15009031":
    "Post-Stones Taylor solo debut. Bluesy, instrumentally rich, the album he made on his own terms after leaving the biggest band in the world.",
  "3086928":
    "The MJQ at peak. \"Django\" (the title track for Django Reinhardt) is one of the great chamber-jazz compositions. 1983 reissue.",
  "3138846":
    "The bossa nova album. \"The Girl from Ipanema.\" Multi-platinum, the album that brought bossa nova to the world. Mono pressing.",
  "19094020":
    "The \"Apache\" album. The breakbeat record that essentially launched hip-hop sampling. 2021 RSD reissue.",
  "26845136":
    "The debut. Paul Gilbert / Billy Sheehan virtuoso shred-metal supergroup before \"To Be With You.\" 2023 RSD reissue.",
  "4646930":
    "Rockabilly revival 7\" — obscure even for the genre.",
  "7518668":
    "The original 7\". One of the foundational rock and roll singles — covered by everyone since.",
  "2485925":
    "The Stax-era soul classic. \"If Loving You Is Wrong\" became a country-soul standard.",
  "3219128":
    "The single. The first reggae song to top the UK charts.",
  "22612418":
    "Greg Gillis's mashup masterpiece. 71 minutes, 372 samples — pop history blended into a single river. 2022 reissue.",
  "27163383":
    "Lookout-era ska-punk, the dual-female-vocals act after the Operation Ivy split. 2023 reissue.",
  "8192450":
    "Bakersfield-sound instrumentals from the Don Rich-era Buckaroos. Mono pressing.",
  "14566740":
    "The party-rock manifesto. \"Party Hard,\" \"She Is Beautiful.\" Sincerity as performance art. 2019 reissue.",
  "20183605":
    "Elvis Costello's *This Year's Model* re-recorded entirely with Spanish-language vocals. Concept album as career retrospective.",
  "4884061":
    "The crossover-era EP. \"I'm the Man\" — Anthrax meets old-school rap. The bridge to *Bring the Noise*.",
  "1874766":
    "The Bowie-collab comeback. \"Real Wild Child,\" \"Cry for Love.\" Iggy at his most commercially focused.",
  "11076875":
    "The debut. Pre-*In-A-Gadda-Da-Vida*, the band still figuring out what they were.",
  "23900294":
    "The third King's X album. \"It's Love.\" The band's commercial peak. 2022 repress.",
  "13698832":
    "A novelty flexi about Gritty (the Philadelphia Flyers mascot) by a Ramones-themed band of moms. Exactly as unique as that sounds.",
  "12414801":
    "A pop-punk side-project flexi about getting older, played at the speed of getting older.",
  "25720819":
    "The Oingo-Boingo-rebranded-as-Boingo album. The last record of the Elfman era. 2023 reissue.",
  "25985029":
    "The breakthrough. Operatic metal-rock at its most ambitious. \"Bat Country,\" \"Beast and the Harlot.\" 2023 repress.",
  "14785134":
    "NJ thrash-punk weirdness. As goofy as the title. 2019 reissue.",
  "25426894":
    "The album. \"My Sister,\" \"Spin the Bottle.\" The Juliana Hatfield Three's masterpiece. 2023 reissue.",
  "2332319":
    "The debut. \"It's My Party.\" Quincy Jones producing a 17-year-old Lesley Gore. Mono pressing.",
  "929546":
    "Best-of comp of the Brill Building girl-group classics. \"Leader of the Pack,\" \"Remember (Walking in the Sand).\"",
  "25271875":
    "Atlanta cowpunk-metal trash with attitude. 2022 RSD.",
  "20843101":
    "Bay Area third-wave ska-punk. 2021 reissue.",
  "13094183":
    "The masterpiece. Ray Charles bringing soul to country, completely transforming both genres in the process. \"I Can't Stop Loving You,\" \"Born to Lose.\" Mono pressing.",
  "12825969":
    "The peak. \"Peg,\" \"Deacon Blues,\" \"Black Cow,\" the title track. Studio-musician virtuosity at its most refined.",
  "25282186":
    "Dave Grohl's metal side project / *Studio 666* film tie-in album. Heavier than the Foo Fighters allow. 2022 RSD.",
  "25261732":
    "Stevie Ray Vaughan-produced comeback album from one of the great instrumental-rock guitarists. 2022 RSD.",
  "11087965":
    "The companion album to Dr. Frank Portman's novel of the same name. Late-era MTX.",
  "22122850":
    "The Austin City Limits live album. Yoakam playing the catalog at peak.",
  "5121171":
    "The masterpiece. \"Sledgehammer,\" \"In Your Eyes,\" \"Don't Give Up.\" The album that turned Gabriel from prog-defector into pop juggernaut. Club Edition pressing.",
  "22204159":
    "Cleveland doom-metal trio with NWOBHM melodic instincts.",
  "24210188":
    "The masterpiece. \"Rooster,\" \"Down in a Hole,\" \"Them Bones,\" \"Would?\" The album that defined what grunge could be when it leaned into despair. 2022 reissue.",
  "5793558":
    "Freestyle/dance-pop trio. \"Come Go with Me,\" \"Point of No Return,\" \"Let Me Be the One.\" Club Edition pressing.",
  "3709602":
    "\"A Girl Like You,\" \"Blues Before and After.\" The Smithereens at their commercial peak.",
  "2501916":
    "NOLA roots rock with horns and Spanish-language tracks.",
  "3714970":
    "The single. The garage-rock standard. One of the most-covered songs of the era.",
  "1099520":
    "The follow-up single. Variation in artist credit on Discogs; same band, more raw garage-rock.",
  "1796186":
    "The original. Barbershop-pop number that They Might Be Giants would make famous 37 years later.",
  "2817858":
    "The 1964 garage-rock standard. The Ramones would cover it on *End of the Century*. Reissue pressing.",
  "12727421":
    "Canadian melodic hard rock — Kim Mitchell's pre-solo band.",
  "482701":
    "The breakthrough. The title track is the Southern-rock standard.",
  "2703655":
    "Alvin's first solo album post-Blasters. Roots-rock songwriting at peak.",
  "564350":
    "Post-Dixie Dregs / pre-Deep Purple Morse — instrumental fusion-rock guitar showcase.",
  "22706393":
    "NYC ska veterans, third-wave-ska album. 2017 reissue.",
  "5190750":
    "The hits comp. \"Suite: Judy Blue Eyes,\" \"Ohio,\" \"Teach Your Children,\" \"Helplessly Hoping.\"",
  "1632355":
    "Solo Harris at her early-'80s neo-traditional country peak.",
  "1319791":
    "The double-LP greatest-hits / retrospective. \"For What It's Worth,\" \"Mr. Soul,\" \"Bluebird.\"",
  "1430860":
    "The third Skynyrd album. \"Saturday Night Special.\" Less of a moment than the bookends, still a strong record.",
  "1306997":
    "The masterpiece. Eric Clapton, Duane Allman, Bobby Whitlock, Jim Gordon. \"Layla,\" \"Bell Bottom Blues,\" \"Why Does Love Got to Be So Sad?\"",
  "8566181":
    "The double-LP comp that put the Beach Boys back on the map after years of catalog neglect. The standard introduction for a new generation.",
  "12863194":
    "The eighth and final original-Band album. Released as a contractual obligation after *The Last Waltz*.",
  "1606550":
    "The phenomenon. \"Girls Just Want to Have Fun,\" \"Time After Time,\" \"Money Changes Everything,\" \"She Bop.\" The album that turned Lauper into MTV royalty.",
  "12257143":
    "The disco-era greatest-hits. \"Stayin' Alive,\" \"Night Fever,\" \"Tragedy.\"",
  "3196012":
    "The masterpiece. \"It's Too Late,\" \"I Feel the Earth Move,\" \"You've Got a Friend,\" \"So Far Away.\" The album that more or less invented the singer-songwriter LP.",
  "9855809":
    "The instrumental masterpiece. George Martin producing. \"'Cause We've Ended as Lovers\" (Stevie Wonder cover). Beck fully into jazz-fusion territory.",
  "6995960":
    "The post-glam, pre-Philly-soul Bowie. \"Rebel Rebel,\" \"1984,\" the title track. A Burroughsian dystopia in 11 songs.",
  "22452463":
    "SF heavy-rock — pure motor-revving riff-rock.",
  "6427201":
    "Tanya Donelly's post-Throwing Muses band. \"Feed the Tree,\" \"Gepetto.\" Foundational alt-rock. 2014 reissue.",
  "3080042":
    "The industrial-metal masterpiece. \"Jesus Built My Hotrod,\" \"N.W.O.\" Al Jourgensen's commercial peak. 2011 reissue.",
  "1864023":
    "The breakthrough. \"Walk This Way,\" \"It's Tricky,\" \"My Adidas,\" \"Peter Piper.\" The album that turned hip-hop into a mainstream genre.",
  "9575414":
    "Post-Cactus heavy-rock; one of the most obscure '70s pressings.",
  "1132882":
    "Pittsburgh hardcore.",
  "916895":
    "Australian punk-pop trio compilation.",
  "347367":
    "The debut. \"Rollin' with Kid 'N Play,\" \"Gittin' Funky.\" The hi-top-fade-era dance-rap.",
  "23177768":
    "The album that more or less invented death metal. Foundational. 2022 RSD reissue.",
  "10531798":
    "The definitive ABBA comp. The standard introduction; multi-platinum across decades. 2017 reissue.",
  "22943867":
    "The Mark Ronson and Preservation Hall remixes — *Medicine at Midnight* B-sides on 7\". 2022 RSD.",
  "19695118":
    "The debut. Pre-Anthrax-Bush Armored Saint. Power metal with NWOBHM instincts.",
  "7355266":
    "The double live album from the band's pre-MTV years. Loud, sweaty, R&B-grounded.",
  "2164903":
    "The debut. \"Down Boys,\" \"Heaven.\" Pure late-'80s LA hair-metal at the genre's peak.",
  "2248642":
    "The masterpiece. \"For the Love of God.\" Instrumental shred-guitar at its most expressive.",
  "9502009":
    "The masterpiece. \"Get It On (Bang a Gong),\" \"Jeepster,\" \"Cosmic Dancer.\" Marc Bolan's glam-rock high-water mark.",
  "19749856":
    "The live debut. \"Kick Out the Jams,\" \"Ramblin' Rose.\" Foundational document of proto-punk Detroit rock. 2021 reissue.",
  "22497002":
    "Ian MacKaye + Al Jourgensen industrial-hardcore project. Brief, uncategorizable, brilliant. 2022 reissue.",
  "2188297":
    "The 1983 comedy soundtrack.",
  "2133936":
    "The masterpiece. \"Joey,\" \"Bloodletting.\" Johnette Napolitano's vocals carrying the band to its commercial peak.",
  "1354415":
    "Obscure 7\" — limited edition.",
  "21416422":
    "Pre-Rage Against the Machine band — Zack de la Rocha as a teenage hardcore singer. 2021 repress.",
  "17358229":
    "The debut EP. \"Waiting Room,\" \"Bulldog Front.\" Year zero of post-hardcore. 2021 reissue.",
  "10594668":
    "Kansas guitarist's solo debut, with Ronnie James Dio guesting. Christian-prog meets metal.",
  "4201631":
    "The Chipmunks covering 1980 punk-pop hits — Knack, Cars, Blondie, Linda Ronstadt. Surreal artifact.",
  "19101847":
    "\"Ready to Go.\" The big-beat-electronic alt-rock single. 2021 RSD reissue.",
  "6178987":
    "The supergroup album. Dylan, Harrison, Petty, Lynne, Orbison. \"Handle with Care,\" \"End of the Line.\"",
  "453776":
    "Surf-rock cult act.",
  "2752807":
    "The Soviet pressing of Yngwie's *Trilogy*. Curio of the brief late-Cold-War licensing window.",
  "2830872":
    "Christian metal at its peak. \"Calling on You,\" \"Honestly.\" Multi-platinum. Club Edition pressing.",
  "495918":
    "The breakthrough. \"Smoking Gun.\" Cray's blues-rock crossover moment.",
  "1743723":
    "Stray Cats rhythm section + Earl Slick supergroup album.",
  "5169334":
    "Metal's \"We Are the World.\" Dio organizing every metal singer in 1986 to record one famine-relief charity single.",
  "52836":
    "The Bambaataa/Lydon collaboration. Foundational electro-punk-funk.",
  "688673":
    "German pop-punk. Brief.",
  "1633668":
    "The masterpiece. \"Even Hitler Had a Girlfriend,\" \"Ba Ba Ba Ba Ba.\" Dr. Frank's songwriting at peak.",
  "2605649":
    "NYC post-hardcore. The debut.",
  "6715705":
    "Obscure hard-rock LP.",
  "7610569":
    "The comeback. \"Got My Mind Set on You,\" \"When We Was Fab.\" Jeff Lynne producing.",
  "18976594":
    "The debut. \"Mother,\" \"Twist of Cain,\" \"Am I Demon.\" Glenn Danzig's post-Misfits band fully formed. Rick Rubin producing.",
  "1619100":
    "The standard Steppenwolf comp. \"Born to Be Wild,\" \"Magic Carpet Ride.\"",
  "20779024":
    "The Bosstones' second album. Pre-\"Impression That I Get\" ska-core. 2021 repress.",
  "19115083":
    "The debut. Pre-Evan-Dando-only Lemonheads — punk-pop with Massachusetts grit. 2021 RSD reissue.",
  "3277571":
    "The 12\" — extended take on the Incredible Bongo Band breakbeat.",
  "401459":
    "\"Fast\" Eddie Clarke (Motörhead) + Pete Way (UFO) supergroup. Hard rock at peak.",
  "10044835":
    "The Cars guitarist's solo album. Club Edition pressing.",
  "20450938":
    "\"Sex (I'm A...),\" \"The Metro.\" Berlin's pre-\"Take My Breath Away\" synth-pop peak. Club Edition reissue.",
  "1430573":
    "NWOBHM-era cult metal. UK power-metal at its most B-tier-charming.",
  "1891139":
    "Scottish rockabilly revivalists.",
  "11696313":
    "Live album from California's underrated melodic-metal act.",
  "400430":
    "The breakthrough. The title track became inescapable. The album that established the Eurythmics formula.",
  "11107970":
    "The debut. \"Don't Dream It's Over.\" Neil Finn's post-Split Enz band fully formed.",
  "7003556":
    "The Time singer's solo debut, post-Prince-protégé era. Club Edition pressing.",
  "323719":
    "The 12\" of one of the defining R&B singles of the late '80s.",
  "19681738":
    "The first CCR comp. \"Proud Mary,\" \"Bad Moon Rising,\" \"Fortunate Son.\"",
  "963130":
    "The single. The infamous lip-sync moment in pop history.",
  "3571268":
    "The comeback. The title track, \"The Old Man Down the Road.\" Fogerty back from his post-CCR legal exile.",
  "13098661":
    "The breakthrough. The title track became their MTV moment.",
  "12435485":
    "The promo LP. Bits, sketches, and music from the film.",
  "19007":
    "The soundtrack. \"Call Me\" by Blondie alongside Moroder's instrumental score.",
  "626536":
    "The 12\" maxi-single. Post-Vanity-6 Prince protégé.",
  "2623174":
    "The legendary jazz big-band of late-night TV in studio.",
  "5056815":
    "The 12\" single. The early-'80s anti-cocaine anthem that became eternal.",
  "4011440":
    "Mickey Thomas's debut as singer. \"Jane.\" The first Starship-without-Slick album.",
  "14468125":
    "The compilation. \"Eye in the Sky,\" \"I Wouldn't Want to Be Like You,\" \"Don't Answer Me.\" Club Edition pressing.",
  "676961":
    "The album. \"Maneater,\" \"Family Man,\" \"One on One.\" Multi-platinum.",
  "16964550":
    "Plant's second solo album. \"Big Log.\"",
  "1087635":
    "\"The Boys of Summer,\" \"All She Wants to Do Is Dance.\" Henley's solo masterpiece.",
  "4628447":
    "John Lennon's son's debut. \"Too Late for Goodbyes,\" the title track. Multi-platinum on the strength of the obvious comparison.",
  "4188172":
    "The phenomenon. \"Money for Nothing,\" \"Walk of Life,\" the title track. The album that defined CD-era rock production. Club Edition pressing.",
  "7484675":
    "The compilation. \"Everyday People,\" \"Stand!,\" \"Family Affair,\" \"Dance to the Music.\" Foundational document of late-'60s soul/funk fusion.",
  "5856861":
    "The debut. \"Saving All My Love for You,\" \"How Will I Know,\" \"Greatest Love of All.\" The album that launched the biggest pop voice of the era.",
  "1705919":
    "\"Jump (For My Love),\" \"I'm So Excited,\" \"Automatic,\" \"Neutron Dance.\" The Pointer Sisters' commercial peak.",
  "9274123":
    "The double live album that defined '70s arena rock. \"Show Me the Way,\" \"Baby, I Love Your Way,\" \"Do You Feel Like We Do.\" Multi-platinum.",
  "18371335":
    "Late-period Dinosaur Jr. The original lineup still going strong three decades in.",
  "18795121":
    "A covers album of obscure psychedelic-rock classics from the late '60s and early '70s.",
  "20524276":
    "The masterpiece. The album that introduced Snoop Dogg, defined G-funk, and reshaped hip-hop production for the '90s. \"Nuthin' but a 'G' Thang,\" \"Let Me Ride,\" \"Fuck Wit Dre Day.\" 2021 reissue.",
  "438688":
    "The phenomenon. \"Shout,\" \"Everybody Wants to Rule the World,\" \"Head Over Heels.\" The album that turned Tears For Fears into an arena band.",
  "456176":
    "\"There'll Be Sad Songs (To Make You Cry),\" \"Love Zone.\" Ocean's commercial peak.",
  "11940359":
    "The compilation. \"The Devil Went Down to Georgia,\" \"The South's Gonna Do It,\" \"Long Haired Country Boy.\"",
  "10818367":
    "The 12\" — the freestyle dance-pop hit.",
  "3231508":
    "Christian rock from western PA.",
  "2442075":
    "The first Hall & Oates greatest-hits comp. \"Say It Isn't So\" was the new track.",
  "6581336":
    "The second New Edition album. \"Cool It Now,\" \"Mr. Telephone Man.\" Bobby Brown era. Club Edition pressing.",
  "2549360":
    "The Disney spooky-sound-effects record. Halloween-party essential for a generation.",
  "16476990":
    "Chuck Schuldiner's death-metal masterpiece. Technical, melodic, ambitious. 2020 reissue.",
  "20784814":
    "The breakthrough. The Christmas-rock-opera that defined the genre. Paul O'Neill of Savatage producing. 2021 reissue.",
  "8930816":
    "\"Karma Chameleon,\" \"Church of the Poison Mind,\" \"Miss Me Blind.\" Boy George's commercial peak.",
  "2148850":
    "The breakthrough. The title track is one of the great metal anthems. Udo Dirkschneider at his vocal peak.",
  "5336522":
    "The debut. \"Talk Dirty to Me,\" \"I Want Action.\" Pure first-wave LA hair metal.",
  "868401":
    "The Belfast punk debut. \"Suspect Device,\" \"Alternative Ulster,\" \"Wasted Life.\"",
  "3126823":
    "\"I'm Giving You All My Love.\" Late-period Quincy Jones-produced funk.",
  "16770162":
    "The breakthrough. The title track is the Todd Rundgren-produced classic. Multi-platinum.",
  "4267848":
    "The masterpiece. \"Le Freak,\" \"I Want Your Love.\" Nile Rodgers and Bernard Edwards at peak disco.",
  "9089803":
    "The pre-Eagles solo Walsh. \"Rocky Mountain Way.\"",
  "1787387":
    "The album. The title track was the biggest single of her career. Soft-rock with mild aerobics-era cheek.",
  "1433992":
    "\"Baker Street.\" The defining sax solo of the late '70s.",
  "1349813":
    "The compilation. \"Memphis,\" \"Secret Agent Man.\"",
  "12147407":
    "\"The Warrior\" — the Patty Smyth-fronted hit.",
  "1587876":
    "\"Babe.\" The album that gave Styx their first #1.",
  "1974703":
    "The Prince-produced second album. \"A Love Bizarre.\" Club Edition pressing.",
  "836052":
    "\"Romancing the Stone,\" \"Till I Can't Take Love No More.\" The follow-up to *Killer on the Rampage*.",
  "6443199":
    "Mel Galley + Glenn Hughes-era Trapeze. Funk-rock with Hughes's vocals.",
  "1445461":
    "The 12\" promo. \"Two Tribes\" extended for the dance floor.",
  "476287":
    "The *Star Wars* score realized on Moog synthesizers. As '70s as anything ever recorded.",
  "2142700":
    "The first solo album as Gloria Estefan (post-Miami Sound Machine billing). \"Don't Wanna Lose You,\" \"Get on Your Feet.\"",
  "2887882":
    "\"Conga,\" \"Bad Boy,\" \"Words Get in the Way.\" The breakthrough.",
  "6499462":
    "The third Grand Funk album. \"I'm Your Captain (Closer to Home).\"",
  "12310764":
    "The breakthrough. \"You Ain't Seen Nothing Yet,\" \"Roll on Down the Highway.\" Reissue pressing.",
  "12576401":
    "The second Fun Boy Three album. Terry Hall's post-Specials art-pop band.",
  "20110321":
    "SoCal melodic skate-punk. 2021 reissue.",
  "11066941":
    "Live Buddy Guy with Junior Wells, recorded 1974 at Montreux. Reissue pressing.",
  "12529125":
    "\"Car Wash.\" Rose Royce performing the Whitfield-produced songs. Disco-era funk masterpiece.",
  "5507447":
    "The second SRV album. \"Cold Shot,\" the title track. The cover of \"Voodoo Chile (Slight Return)\" alone justifies the record. Reissue pressing.",
  "16142560":
    "The Junior Wells masterpiece. With Buddy Guy. Foundational electric-blues record. Reissue pressing.",
  "433954":
    "The score. As iconic as the film.",
  "229548":
    "\"Hold Me Now,\" \"Doctor! Doctor!.\" The Thompson Twins' commercial peak.",
  "18672889":
    "Steinman's only solo album. The songs that didn't make *Bat Out of Hell*. Operatic rock excess at peak.",
  "599264":
    "The blaxploitation soundtrack — funk grooves heavily sampled in the breakbeat era.",
  "1291621":
    "The concept album. \"Twilight,\" \"Hold On Tight,\" \"Yours Truly, 2095.\" ELO going synth-heavy.",
  "11871602":
    "The breakthrough. \"She Drives Me Crazy,\" \"Good Thing.\" Roland Gift's vocals atop a tightly produced pop record.",
  "7191675":
    "Ace's second post-Kiss solo album. \"Rock Soldiers.\"",
  "5075094":
    "The phenomenon. The title track — the synth-fanfare-era's defining moment.",
  "10327610":
    "The breakthrough. The title track at #1 for seven weeks. \"Crimson and Clover,\" \"Bits and Pieces.\" Club Edition pressing.",
  "14999515":
    "The phenomenon. \"We're Not Gonna Take It,\" \"I Wanna Rock.\" The album that made Twisted Sister a stadium act. 2020 reissue.",
  "19621969":
    "The masterpiece. \"Down on the Street,\" \"TV Eye,\" \"1970,\" \"Fun House,\" \"L.A. Blues.\" Iggy at his most unhinged. Foundational document of proto-punk. 2021 reissue.",
  "12416337":
    "The masterpiece. \"Rehab,\" \"Back to Black,\" \"You Know I'm No Good.\" Mark Ronson and Salaam Remi producing. The album that made Winehouse a global icon — and the album that hit harder when she died at 27.",
  "1358996":
    "The standard Neil Diamond compilation. \"Sweet Caroline,\" \"Cracklin' Rosie,\" \"Song Sung Blue.\"",
  "4520279":
    "The Cincinnati Reds broadcaster's celebration of the 1975 World Series win. Pure baseball nostalgia.",
  "7515852":
    "\"Regret,\" \"Ruined in a Day.\" New Order's last album of the original run before the long hiatus. 2015 reissue.",
  "1078681":
    "Barry Gibb's production for Barbra. \"Woman in Love,\" \"Guilty.\" The album that put Streisand on top of the pop charts.",
  "1919801":
    "Brown with Louis Bellson and an 18-piece big band. The album that proved Brown could swing as well as he could funk.",
  "13567865":
    "The Christmas special soundtrack. \"Holly Jolly Christmas,\" \"Silver and Gold.\"",
  "249257":
    "The phenomenon. \"U Can't Touch This,\" \"Have You Seen Her,\" \"Pray.\" Diamond status; the biggest rap album of its time.",
  "3244610":
    "The 18-minute title-track talking blues. The Thanksgiving tradition of one generation. Reissue pressing.",
  "13829463":
    "The third and final album. \"Save It for Later,\" \"I Confess.\" Two-tone evolves into something more sophisticated.",
  "6632280":
    "The album. \"I Know What Boys Like,\" \"Christmas Wrapping.\" Patty Donahue's deadpan vocal-as-personality.",
  "813527":
    "The 12\" — the Frank and Moon Unit Zappa novelty single that gave the world \"totally.\"",
  "4097194":
    "The 1966 debut. \"Good Lovin'.\" Pre-(just-)Rascals era. Reissue pressing.",
  "6318145":
    "The phenomenon. \"My Sharona,\" \"Good Girls Don't.\" Multi-platinum power-pop debut.",
  "18918394":
    "The album. \"These Boots Are Made for Walkin'.\" Lee Hazlewood producing. Mono pressing.",
  "11997561":
    "The breakthrough. \"Jessie's Girl,\" \"I've Done Everything for You.\"",
  "1626906":
    "The standard Hank comp. \"Your Cheatin' Heart,\" \"I'm So Lonesome I Could Cry,\" \"Hey, Good Lookin'.\"",
  "3049973":
    "The compilation of Alvin Lee's blues-rock band.",
  "15253938":
    "A '60s burlesque-music novelty record. Pure crate-digger curio.",
  "2552320":
    "The album. \"Ai No Corrida,\" \"Razzamatazz,\" \"Just Once.\" Quincy producing himself at his crossover peak.",
  "2345433":
    "\"Rock Me Amadeus.\" *The* album.",
  "4622723":
    "The first Hendrix comp. \"Purple Haze,\" \"Hey Joe,\" \"Foxey Lady,\" \"Voodoo Chile.\"",
  "1999884":
    "The European power-metal masterpiece. \"I Want Out,\" \"Eagle Fly Free.\" The album that defined the German power-metal sound.",
  "6054070":
    "The debut. The album that introduced Yngwie's neoclassical shred-guitar to the world. \"Far Beyond the Sun,\" \"Black Star.\" Club Edition pressing.",
  "10659795":
    "The post-breakup compilation released to fulfill George Michael's contract obligations.",
  "4899717":
    "The breakthrough. The title track went to #1 in the UK. The new-romantic ballad of the era.",
  "6252609":
    "The album. \"Fine Time,\" \"Vanishing Point,\" \"Run.\" New Order's Ibiza-influenced acid-house pivot.",
  "779490":
    "Steve Howe (Yes) + Steve Hackett (Genesis) supergroup. \"When the Heart Rules the Mind.\" Club Edition pressing.",
  "57656":
    "\"Oh Patti (Don't Feel Sorry for Loverboy).\" The follow-up to *Cupid & Psyche 85*.",
  "2386827":
    "The live double LP. Tony at peak. One of the great Carnegie recordings of any era.",
  "19529575":
    "The Foo Fighters as Bee Gees tribute act. As fun as it sounds. 2021 RSD.",
  "1693137":
    "The phenomenon. \"You Got It (The Right Stuff),\" \"Cover Girl,\" the title track. Multi-platinum.",
  "15171550":
    "Boston grindcore — pre-The Hold Steady's Tad Kubler era.",
  "19270393":
    "The masterpiece. The concept album about a junkie assassin and a sex-cult priest. \"Eyes of a Stranger,\" \"I Don't Believe in Love.\" Foundational document of progressive metal. 2021 reissue.",
  "1259068":
    "Frank Zappa's Mothers of Invention masterpiece. \"Camarillo Brillo,\" \"Dinah-Moe Humm,\" \"Montana.\" Reissue pressing.",
  "10171794":
    "Space-rock comp from Hawkwind's classic era. \"Silver Machine,\" \"Master of the Universe.\" 2017 RSD.",
  "13158718":
    "NYHC pre-Quicksand band. Walter Schreifels and Chaka Malik's brief, brilliant project. 2019 repress.",
  "18959701":
    "The 7\" debut. The NYHC essential before the LPs. 2021 repress.",
  "12964153":
    "The Canadian skate-punk peak. Faster, smarter, angrier than the genre demanded. 2009 reissue.",
  "3160817":
    "Revelation-era melodic post-hardcore.",
  "6921642":
    "The \"Blue Album.\" LA hardcore. \"Amoeba,\" \"Kids of the Black Hole.\" Repress pressing.",
  "19524100":
    "The 2-Tone era Selecter live document. Pauline Black at peak. 2021 RSD.",
  "19116868":
    "The masterpiece. NYHC at its most foundational. \"We Gotta Know,\" \"World Peace,\" \"Hard Times.\" 2021 RSD reissue.",
  "1459698":
    "The album that made everyone in America twist.",
  "1459740":
    "A compilation of early Marley with the Wailers — pre-Island years.",
  "537032":
    "The film soundtrack. Aretha, James Brown, Cab Calloway, Ray Charles, plus the Brothers themselves. Multi-platinum.",
  "5853088":
    "Martin's second comedy album. The era when stand-up was a big arena phenomenon.",
  "1046279":
    "The original concept album. The album that became the show that became the film. Multi-platinum.",
  "694363":
    "The \"seven words you can't say on television\" album. The free-speech case that made Carlin a folk hero. Reissue pressing.",
  "2499072":
    "\"Cruisin'.\" Smokey's adult-contemporary R&B comeback.",
  "9413756":
    "The album that brought calypso to mainstream America. \"Day-O (The Banana Boat Song).\" First million-selling LP by a single artist. Mono pressing.",
  "8425619":
    "The London Lyceum live album. \"No Woman, No Cry\" extended into the definitive version.",
  "1438836":
    "Score by John Barry. Coppola's '80s film about the Harlem Renaissance jazz club.",
  "5474712":
    "The major-label peak. \"Start Choppin',\" \"Out There.\" J Mascis at his most accessible. 2013 reissue.",
  "14357279":
    "The Garth box set. The complete Capitol-era catalog.",
  "3667148":
    "The phenomenon. \"Run to You,\" \"Summer of '69,\" \"Heaven,\" \"It's Only Love\" (with Tina Turner). Diamond status.",
  "19113751":
    "Cleveland metallic hardcore. 2021 RSD.",
  "19118968":
    "A collection of Desmond Dekker's pre-rocksteady ska singles. 2021 RSD.",
  "19100593":
    "UK stoner-doom from one of the longest-running bands in the genre. 2021 RSD reissue.",
  "1620122":
    "GG at his most provocative. The album that earned him the lasting cult. 2008 reissue.",
  "8918219":
    "The transitional album. Phil Collins at the front, prog elements receding. The title track and \"No Reply at All.\" Club Edition pressing.",
  "10423765":
    "Bill Bruford / John Wetton / Eddie Jobson / Allan Holdsworth — prog-rock supergroup. The most all-star fusion lineup of the '70s.",
  "5970860":
    "Jeff Beck + Tim Bogert + Carmine Appice supergroup. \"Superstition\" (Stevie Wonder cover).",
  "10391553":
    "\"Oh Well.\" Detroit hard rock cover band.",
  "15496844":
    "The debut. King Diamond pre-King-Diamond. \"Curse of the Pharaohs,\" the title track. Foundational document of theatrical metal. 2020 reissue.",
  "10931589":
    "The third Pixies album. \"Velouria,\" \"Dig for Fire,\" \"Allison.\" Often dismissed at the time; vindicated since. 2014 reissue.",
  "4610169":
    "The debut. \"She Blinded Me with Science.\" Synth-pop with smart-ass British sensibilities. 1983 reissue.",
  "2615717":
    "The debut. Heavy psych-rock covers — \"You Keep Me Hangin' On\" stretched to seven minutes.",
  "11553549":
    "The third Pretenders album, post-Honeyman-Scott death. \"Back on the Chain Gang,\" \"My City Was Gone,\" \"Middle of the Road.\" CD repress.",
  "653009":
    "The debut album from Belushi/Aykroyd's blues revue. Multi-platinum.",
  "2430697":
    "The breakthrough LP. \"White Lies,\" \"Last Time Around.\" Cowpunk at peak.",
  "1458621":
    "Greatest-hits double LP. \"Sherry,\" \"Big Girls Don't Cry,\" \"Walk Like a Man,\" \"Rag Doll.\"",
  "2870336":
    "The album with the title track — a #1 surf classic. Mono pressing.",
  "15783525":
    "West Virginia doom-rock with Sabbath/Coven references all over.",
  "16093128":
    "The 1978 album that didn't get released until 1996. Pre-*Walk Among Us* original Misfits at their primal best. Glenn Danzig's masterpiece. 2020 reissue.",
  "14733611":
    "The thrash-crossover masterpiece. Anthrax + Nuclear Assault side project. \"Milk,\" \"March of the S.O.D.\" 2016 reissue.",
  "9402772":
    "The masterpiece. \"Outshined,\" \"Rusty Cage,\" \"Jesus Christ Pose.\" The album that turned Soundgarden into the heaviest of the grunge bands. 2016 reissue.",
  "3206328":
    "The debut. \"Mississippi Queen.\" Felix Pappalardi producing the band that turned heavy-blues-rock into a power trio.",
  "346778":
    "\"Play That Funky Music.\" The album.",
  "2516555":
    "The Canadian prog band's commercial peak. \"On the Loose,\" \"Wind Him Up.\"",
  "2683094":
    "The second Dolls album. George \"Shadow\" Morton producing. \"Stranded in the Jungle,\" \"Babylon.\" The album before everything fell apart.",
  "4972062":
    "The debut EP. \"Hush,\" \"Sweat,\" \"Opiate.\" Pre-*Undertow* Tool — angrier, simpler, less prog. 2007 reissue.",
  "1473127":
    "The first installment of the rock opera. \"Joe's Garage,\" \"Catholic Girls.\" Zappa concept work at its most listenable.",
  "8042136":
    "The career-spanning compilation, released after Tony Sly's death. The standard NUFAN introduction.",
  "4242096":
    "Wisconsin pop-punk band whose entire gimmick is being burglars. As fun as Ramones-influenced pop-punk gets.",
  "5680731":
    "A 7\" of Bowie + Michael Jackson covers played on ukulele. Joey Cape side project.",
  "18051376":
    "Independent hardcore 7\".",
  "9154868":
    "The masterpiece. \"Head Like a Hole,\" \"Down in It,\" \"Sin,\" \"Terrible Lie.\" Trent Reznor's industrial-rock debut. Multi-platinum without ever leaving the underground. 2011 reissue.",
  "7154259":
    "*The* album. \"So What,\" \"Blue in Green,\" \"All Blues,\" \"Flamenco Sketches.\" The best-selling jazz album in history. The album that introduced modal jazz to the world. 2010 reissue.",
  "713519":
    "The masterpiece. \"Lowdown,\" \"Lido Shuffle,\" \"What Can I Say.\" The album that cemented Scaggs as a singer-songwriter who could outsell most of his Bay Area peers.",
  "14803093":
    "Midwestern hard rock. \"Never Been Any Reason.\"",
  "865157":
    "\"Snortin' Whiskey.\" Hard-rock guitar showcase.",
  "872473":
    "Christian metalcore.",
  "3038800":
    "Pittsburgh grindcore.",
  "13978285":
    "A Wray comp. \"Rumble\" and other foundational rumblers from the original guitar instrumentalist.",
  "1770862":
    "The double album. \"Bobby Brown Goes Down,\" \"Dancin' Fool,\" \"Jewish Princess.\" Zappa at his most pop-leaning.",
  "96622":
    "The 12\" — the title track from the *Beat Street* movie soundtrack.",
  "16670154":
    "A budget-bin musical-theater compilation.",
  "3708386":
    "WV stoner-doom. The instrumental-rock cult hero.",
  "534011":
    "The 10\" promo single. Live's mid-'90s commercial peak.",
  "1221587":
    "The debut. Pre-*Smash* Offspring — rougher, less commercial. The cult-only Offspring before they became massive. 1995 reissue.",
  "3000728":
    "The masterpiece. \"P-Funk (Wants to Get Funked Up),\" \"Mothership Connection,\" \"Give Up the Funk.\" George Clinton's funk universe assembled.",
  "1132007":
    "Q-Tip's first single after A Tribe Called Quest. The 12\" promo.",
  "2315842":
    "The phenomenon. \"Cum On Feel the Noize\" (Slade cover) and \"Metal Health (Bang Your Head).\" The first metal album to hit #1 on the Billboard 200.",
  "318874":
    "The 12\" single. The song that introduced Eminem to the world.",
  "2922840":
    "The bluegrass duo's compilation. \"Foggy Mountain Breakdown.\"",
  "12243433":
    "\"She's Kerosene.\" The third-wave-ska revival in 2018 form.",
  "1621676":
    "George Jones + Tammy Wynette duets compilation. Country's most famous broken marriage caught on tape.",
  "582326":
    "Tesco Vee's hardcore band. As provocative as the title.",
  "604619":
    "The debut. \"Sailing,\" \"Ride Like the Wind,\" \"Never Be the Same.\" The album that swept the 1981 Grammys.",
  "166651":
    "The 12\" debut single. Cousin of Ice Cube; West Coast underground rap.",

  // ─── Various / Various Artists / Soundtracks ─────────────────────────────
  "11871224":
    "The 1986 Billy Crystal/Gregory Hines comedy soundtrack. Sweet, soulful R&B with a few rock cuts. Reissue pressing.",
  "16844181":
    "A late-'50s/early-'60s test-tones-and-sound-effects record. The kind of \"stereo demonstration\" LP audio nerds gave each other to show off their hi-fi rigs.",
  "7836810":
    "A Pickwick budget compilation — early-'70s soft rock and pop hits assembled on the cheap. Limited-edition pressing.",
  "3606514":
    "A K-Tel-style budget '50s-rock comp. Pure thrift-store-era hits-on-a-shoestring.",
  "1725576":
    "A novelty-songs compilation — \"Yummy Yummy Yummy,\" \"Sugar, Sugar,\" \"Yellow Submarine,\" and other singles for which \"dumb ditty\" was the era's term of endearment.",
  "3750567":
    "A K-Tel hard-rock comp. Top 40 radio rock collected on one LP for the kids who couldn't afford the singles.",
  "2168577":
    "A late-'70s '50s-rock revival comp. Capitalizing on the *American Graffiti* / *Happy Days* nostalgia wave.",
  "5118532":
    "The Clint Eastwood / orangutan road comedy soundtrack. Mostly country (Eddie Rabbitt, Mel Tillis, Charlie Rich) for the rural drive-in audience.",
  "6350995":
    "The phenomenon. Twenty-eight weeks at #1, fifteen million copies in the US, the album that turned John Travolta and the Bee Gees into the defining faces of disco. The Bee Gees side dominates — \"Stayin' Alive,\" \"Night Fever,\" \"How Deep Is Your Love,\" \"More Than a Woman\" — but \"Disco Inferno,\" \"If I Can't Have You,\" and the Tavares cover of \"More Than a Woman\" earn their sides too. The soundtrack that established the soundtrack as a commercial format unto itself.",
  "916746":
    "A novelty/comedy-records compilation. Ray Stevens, Allan Sherman, Tom Lehrer-adjacent material for backseat-of-the-station-wagon family listening.",
  "14512532":
    "A nostalgia-format late-'70s/early-'80s pop comp. The K-Tel formula adapted for the post-disco wind-down.",
  "3071654":
    "The live document of the very first Monsters of Rock festival at Castle Donnington — Rainbow headlining, Judas Priest, Scorpions, April Wine, Saxon, Riot, Touch. The album that cemented the festival as the UK's premier metal event.",
  "2009521":
    "The John Travolta Texas-honky-tonk soundtrack. Mickey Gilley, Eagles, Charlie Daniels Band, Anne Murray. The album that mainstreamed country music and arguably set up the whole '80s urban-cowboy crossover.",
  "1881687":
    "A 7\" promo sampler. The kind of object DJs and radio programmers got in the mail.",
  "1228546":
    "A K-Tel-style new-wave / new-music comp. The brief window when the term \"new wave\" still meant something on the rack at Caldor.",
  "14639531":
    "The double-LP charity benefit recorded at London's Hammersmith Odeon, late 1979 — Paul McCartney, the Who, Queen, the Pretenders, Elvis Costello, Rockpile. Proceeds to UNICEF for Cambodian famine relief; one of the great late-'70s live documents nobody talks about.",
  "13664546":
    "Another K-Tel-era genre comp — early-'80s synth-pop and dance-rock packaged for the Top 40 radio listener.",
  "1028369":
    "The Two Tone label compilation — the Specials, Madness, the Beat, the Selecter. The British ska revival of the late '70s/early '80s in one LP. A foundational document.",
  "1569415":
    "A K-Tel-era dance comp. Pure radio-era hits packaged on the cheap.",
  "14581339":
    "Another K-Tel pop comp. The format taken into the heart of the early '80s.",
  "24416960":
    "The Chevy Chase comedy soundtrack. Harold Faltermeyer's score plus Stephanie Mills, Dan Hartman, others. Pure mid-'80s mainstream.",
  "2710448":
    "The fifth volume of Atlantic's exhaustive catalog of its R&B singles era. Soul, R&B, early rock — the catalog that defined what \"rhythm and blues\" meant for two decades.",
  "1628624":
    "The sixth volume — Aretha era, Otis Redding era, the Atlantic-Stax connection at peak.",
  "2244305":
    "The second volume — early Atlantic R&B before rock 'n' roll fully formed. Ruth Brown, the Clovers, Joe Turner.",
  "1228968":
    "An LA hardcore/punk comp on Bemis Brain Records. The 45 Grave / Christian Death / Modern Warfare era of West Coast underground rock, captured before it splintered.",
  "3295222":
    "The TV soundtrack. Jan Hammer's \"Miami Vice Theme,\" \"Crockett's Theme,\" plus Glenn Frey's \"Smuggler's Blues\" and Phil Collins's \"In the Air Tonight.\" The soundtrack that defined what '80s TV could do with pop music. Club Edition pressing.",
  "14609210":
    "The Scorsese pool-hall sequel soundtrack. Eric Clapton, Robert Palmer, Robbie Robertson, Don Henley, Mark Knopfler — the album that taught a generation of Gen Xers what blues-rock was supposed to sound like.",
  "4830981":
    "The Ritchie Valens biopic soundtrack. Los Lobos rerecording the Valens catalog. The title track went to #1 and reintroduced \"La Bamba\" to a generation. Club Edition pressing.",
  "4846937":
    "The phenomenon. Eleven million copies. \"(I've Had) The Time of My Life,\" \"She's Like the Wind,\" \"Hungry Eyes,\" plus the original-era oldies that anchor the film — the Ronettes, the Drifters, the Contours. One of the most-streamed soundtracks ever made.",
  "4041464":
    "The masterpiece. Wall of Sound Christmas album recorded by Spector's full Brill Building roster — the Ronettes, the Crystals, Darlene Love, Bob B. Soxx. \"Sleigh Ride,\" \"Christmas (Baby Please Come Home).\" Released the day Kennedy was shot; eventually canonized as the greatest Christmas record ever made. 1987 reissue.",
  "7524663":
    "The Penelope Spheeris LA-hair-metal documentary soundtrack. Megadeth, Faster Pussycat, Lizzy Borden, Motörhead, plus Ozzy and Aerosmith for star power. The audio companion to one of the greatest rockumentaries ever made. Club Edition pressing.",
  "209433":
    "The Demme soundtrack. Tom Tom Club, Sinéad O'Connor, New Order, Iggy Pop. One of the great late-'80s indie-flavored film soundtracks.",
  "3762541":
    "A Columbia House-era hard-rock comp. The kind of album that arrived in the mail when you forgot to check the \"no thanks\" box. Club Edition pressing.",
  "1276035":
    "Early Ramones tribute on Triple X Records — the LA punk underground (L7, Bad Religion, Mojo Nixon, the Vandals, Flesh Eaters) covering the catalog. Years before tribute albums became a label-grade format.",
  "16521483":
    "The Mister Cartoon / Estevan Oriol Netflix documentary soundtrack. West Coast hip-hop from across the catalogs of LA royalty.",
  "20522434":
    "The second Fat Wreck Chords sampler — Fat Mike's roster captured at its mid-'90s commercial peak. NOFX, Lagwagon, No Use for a Name, Strung Out, Less Than Jake, Snuff, Wizo. Forty minutes that essentially defined the Fat Wreck sound for a decade. 2021 reissue.",
  "24792422":
    "The third Fat Wreck sampler. Same formula — NOFX, Lagwagon, the new label additions of the late '90s. The Fat Wreck-as-a-scene snapshot. 2022 reissue.",
  "23583140":
    "The Fat Wreck-era punk-pop sampler. Roughly contemporaneous with *Survival of the Fattest*; same scene, slightly different cuts. 2022 RSD reissue.",
  "22290661":
    "The Dischord label's first six releases — Teen Idles, Minor Threat, Government Issue, Youth Brigade, S.O.A. (with Henry Rollins), Untouchables — collected as a numbered box set. The DC hardcore origin story in vinyl form.",
  "25069879":
    "The soundtrack to the season that revived \"Running Up That Hill\" and put Kate Bush back at #1 forty years after the original release. Plus Metallica's \"Master of Puppets\" placed in cosmic context. A masterclass in music supervision. Limited edition pressing.",
};

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const force = process.argv.includes("--force");
  const { containers } = await import("../lib/cosmos");

  for (const [id, writeUp] of Object.entries(WRITEUPS)) {
    const { resource: existing } = await containers.records
      .item(id, id)
      .read<any>();
    if (!existing) {
      console.log(`✗ ${id}: not found in Cosmos`);
      continue;
    }
    const artists = (existing.artists ?? []).map((a: any) => a.name).join(" · ");
    if (existing.writeUp && !force) {
      console.log(`↷ ${id}: already has a write-up — skipping (${artists} — ${existing.title})`);
      continue;
    }
    if (dryRun) {
      console.log(`◌ ${id}: would write ${writeUp.length} chars (${artists} — ${existing.title})`);
      continue;
    }
    const updated = { ...existing, writeUp, updatedAt: new Date().toISOString() };
    await containers.records.item(id, id).replace(updated);
    console.log(`✓ ${id}: wrote ${writeUp.length} chars (${artists} — ${existing.title})`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
