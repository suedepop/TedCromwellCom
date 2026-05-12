import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

const DESCRIPTIONS: Record<string, string> = {
  "uke-hunt":
    "American ukulele rock band formed in Berkeley, California in 2012. Side project featuring Frank Portman (vocals/ukulele, of the Mr. T Experience) and a rotating ensemble of East Bay punk musicians. Distinguished by their ukulele-based reinterpretations of classic punk, surf, and pop songs.\n\nReleased *Uke-Hunt* (2012, Asian Man Records). The project performs primarily ukulele covers of Misfits, Buzzcocks, Devo, and similar punk-era material.",
  "ultraspank":
    "American nu-metal band formed in San Diego in 1995. Long-running lineup centered on Peter Murray (vocals). Distinguished by their hybrid alternative-metal / industrial-tinged style during the late-1990s nu-metal boom.\n\nReleased two studio albums: *Ultraspank* (1998) and *Progress* (2000) on Epic Records. The band dissolved in 2002.",
  "uncle-sam":
    "American hard rock band formed in Cleveland in 1985. Long-running lineup centered on Larry Miller (vocals) and Jeff D'Andrea (guitar). Distinguished by their throwback 1970s-style hard-rock sound during the late-1980s glam-metal era.\n\nReleased *Heaven or Hollywood* (1988) on Reptile Records and *Letters from London* (1990) on Atlantic Records. The band has been intermittently active in subsequent decades.",
  "upon-a-burning-body":
    "American metalcore band formed in San Antonio, Texas in 2005. Long-running lineup centered on Danny Leal (vocals). Distinguished by their fusion of metalcore with deathcore and Pantera-influenced groove metal.\n\nReleased six studio albums between *The World Is My Enemy Now* (2010) and *Fury* (2024). Released primarily on Sumerian Records and Seek and Strike Records.",
  "upsidedown-cross":
    "American doom metal band formed in Boston in 1989. Side project featuring members of Anal Cunt and Kilslug. Long-running lineup centered on Larry Lifeless (vocals/guitar) and Seth Putnam (bass/vocals, 1968-2011, primarily of Anal Cunt).\n\nReleased four studio albums between *Upsidedown Cross* (1991) and *Evilution* (2023). Released primarily on Taang! Records. Seth Putnam died in 2011 of a heart attack.",
  "valerie-june":
    "American singer-songwriter born Valerie June Hockett on January 10, 1982, in Jackson, Tennessee. Distinguished by her distinctive high-pitched voice and her fusion of folk, blues, gospel, soul, and Appalachian music traditions.\n\nReleased four studio albums between *The Way of the Weeping Willow* (2010) and *The Moon and Stars: Prescriptions for Dreamers* (2021, Grammy-nominated for Best Americana Album). Her stylistic restlessness and visually distinctive aesthetic — long dreadlocks, vintage clothing — have given her a particular crossover appeal across Americana, soul, and indie-folk audiences.",
  "value-pac":
    "American Christian ska-punk band formed in Florida in 1995. Long-running lineup centered on the Wirick brothers. Distinguished by their fusion of third-wave ska with explicit Christian lyrical content.\n\nReleased three studio albums between *Value Pac* (1997) and *Stuck in the 90s* (1999). Released primarily on Tooth & Nail Records during the late-1990s Christian-ska boom.",
  "vanilla-fudge":
    "American rock band formed in Long Island, New York in 1966. Long-running lineup historically: Mark Stein (vocals/keyboards, b. 1947), Vince Martell (guitar, b. 1945), Tim Bogert (bass/vocals, 1944-2021), and Carmine Appice (drums/vocals, b. 1946). Distinguished by their psychedelic-influenced, heavily reworked covers of contemporary pop songs.\n\nReleased five studio albums during their original run between *Vanilla Fudge* (1967) and *Rock & Roll* (1969). Best-known recording: their seven-minute slow-tempo reinvention of the Supremes' \"You Keep Me Hangin' On\" (1967). Bogert and Appice subsequently formed Cactus and Beck, Bogert & Appice. Tim Bogert died in 2021 of cancer.",
  "venus-hum":
    "American electronic pop band formed in Nashville in 1998. Trio: Annette Strean (vocals), Tony Miracle (synthesizers/programming), and Kip Kubin (synthesizers/programming). Distinguished by Strean's clear vocals and the band's glitchy electro-pop production.\n\nReleased three studio albums between *Big Beautiful Sky* (2003) and *Mechanical Yearning* (2006). Performed with Blue Man Group on their *The Complex Rock Tour Live* (2003) and contributed vocals to their *The Complex* album.",
  "veruca-salt":
    "American alternative rock band formed in Chicago in 1992. Long-running classic lineup: Louise Post (vocals/guitar), Nina Gordon (vocals/guitar), Steve Lack (bass), and Jim Shapiro (drums, Gordon's brother). Distinguished by Post and Gordon's male-female harmony vocals and their fuzz-rock songwriting.\n\nReleased five studio albums between *American Thighs* (1994) and *Ghost Notes* (2015). Commercial peak: *American Thighs* (featuring the breakthrough \"Seether\") and *Eight Arms to Hold You* (1997, featuring \"Volcano Girls\"). Gordon left in 1998 amid acrimony with Post; the classic lineup reunited in 2013 for *Ghost Notes*.",
  "vice-squad":
    "English punk rock band formed in Bristol in 1978. Long-running lineup historically centered on Beki Bondage (vocals, born Rebecca Bond). Distinguished by Bondage's powerful vocals and the band's role as one of the foundational female-fronted UK punk acts.\n\nReleased over a dozen studio albums between *No Cause for Concern* (1981) and *Battle of Britain* (2018). Bondage briefly left the band in 1982 (replaced by Lia, with the resulting lineup releasing *Stand Strong, Stand Proud*); Bondage returned in 1997 and has continued to lead the band.",
  "victoria-williams":
    "American singer-songwriter born December 23, 1959, in Forbing, Louisiana. Distinguished by her fragile, child-like vocals and her songwriting drawing on folk, country, and gospel influences. Her 1992 diagnosis with multiple sclerosis inspired the *Sweet Relief* tribute albums (1993, 1996) — featuring Pearl Jam, Lou Reed, Lucinda Williams, and others covering her songs — to raise funds for uninsured musicians.\n\nReleased nine studio albums between *Happy Come Home* (1987) and *Sings Some Ol' Songs* (2002). Married to Mark Olson (the Jayhawks) 1996-2006. Continues to record and tour.",
  "vince-neil":
    "American singer born Vincent Neil Wharton on February 8, 1961, in Hollywood, California. Lead vocalist for Mötley Crüe (1981-1992, 1996-present). Distinguished by his high-tenor vocals and his off-stage tabloid notoriety, including a 1984 vehicular manslaughter conviction stemming from a fatal car crash that killed Hanoi Rocks drummer Razzle.\n\nReleased four solo studio albums between *Exposed* (1993) and *Tattoos & Tequila* (2010). Memoir: *Tattoos & Tequila: To Hell and Back with One of Rock's Most Notorious Frontmen* (2010). Continues to tour with Mötley Crüe.",
  "vintage-trouble":
    "American soul / rhythm and blues band formed in Los Angeles in 2010. Long-running lineup: Ty Taylor (vocals), Nalle Colt (guitar), Rick Barrio Dill (bass), and Richard Danielson (drums). Distinguished by Taylor's high-energy stage performance and the band's throwback 1960s-soul instrumentation.\n\nReleased four studio albums between *The Bomb Shelter Sessions* (2011) and *Heavy Hymnal* (2023). Opened for the Who, the Rolling Stones, AC/DC, and Bon Jovi on major tours during the 2010s.",
  "violator":
    "Brazilian thrash metal band formed in Aparecida, Brazil in 2002 (disambiguated as Violator (3) on Discogs to distinguish from other bands of the same name). Long-running lineup centered on Pedro Arcanjo (vocals/bass). Distinguished by their classic-thrash-metal style drawing on Slayer, Sodom, and Kreator.\n\nReleased three studio albums between *Chemical Assault* (2006) and *Scenarios of Brutality* (2013). Released on Kill Again Records and Mutilation Records.",
  "violent-femmes":
    "American folk-punk band formed in Milwaukee in 1980. Long-running classic lineup: Gordon Gano (vocals/guitar), Brian Ritchie (bass), and Victor DeLorenzo (drums). Distinguished by their acoustic, semi-improvised arrangement style and Gano's confessional, sexually frank lyrics.\n\nReleased 11 studio albums between *Violent Femmes* (1983) and *Hotel Last Resort* (2019). Commercial peak: *Violent Femmes* (eventually platinum-certified through years of slow but steady sales, featuring \"Blister in the Sun,\" \"Add It Up,\" and \"Kiss Off\") and *Hallowed Ground* (1984). The band split and reunited multiple times.",
  "vision":
    "American hardcore band formed in Old Bridge, New Jersey in 1986. Long-running lineup centered on Dave Franklin (vocals). Distinguished by their melodic-hardcore style associated with the New Jersey hardcore scene alongside Token Entry and Killing Time.\n\nReleased five studio albums between *Just Short of Living* (1990) and *Watch You Drown* (1998). Released primarily on Caroline Records. The band has been intermittently active.",
  "war-on-women":
    "American feminist hardcore band formed in Baltimore in 2010. Long-running lineup centered on Shawna Potter (vocals) and Brooks Harlan (guitar). Distinguished by their explicitly feminist and anti-misogynist lyrics combined with hardcore-punk musical aggression.\n\nReleased three studio albums between *War on Women* (2015) and *Wonderful Hell* (2020). Released on Bridge Nine Records.",
  "wham":
    "British pop duo formed in Bushey, Hertfordshire in 1981 (officially Wham!). Duo of George Michael (vocals, 1963-2016) and Andrew Ridgeley (guitar/vocals, b. 1963). Distinguished by their bright, dance-oriented pop sound and Michael's powerful vocals.\n\nReleased three studio albums during their five-year run: *Fantastic* (1983), *Make It Big* (1984, featuring \"Wake Me Up Before You Go-Go,\" \"Careless Whisper,\" and \"Everything She Wants,\" all #1 hits), and *Music from the Edge of Heaven* (1986). Wham! disbanded in 1986; George Michael pursued a solo career until his Christmas Day 2016 death from heart failure.",
  "whiskeytown":
    "American alt-country band formed in Raleigh, North Carolina in 1994. Long-running lineup historically centered on Ryan Adams (vocals/guitar) and Caitlin Cary (violin/vocals). Distinguished by their fusion of country, folk, and rock and as one of the foundational bands of the alt-country movement.\n\nReleased three studio albums during their original run: *Faithless Street* (1995), *Strangers Almanac* (1997), and *Pneumonia* (2001, recorded 1999 but delayed by label issues). The band dissolved in 2001; Adams pursued a prolific solo career.",
  "white-zombie":
    "American heavy metal band formed in New York City in 1985 by Rob Zombie (vocals, born Robert Cummings) and Sean Yseult (bass). Long-running classic lineup later added Jay Yuenger (guitar, joined 1989) and John Tempesta (drums, joined 1992). Distinguished by their fusion of groove metal with B-movie horror aesthetics and industrial-sample textures.\n\nReleased four studio albums between *Soul-Crusher* (1987) and *Astro-Creep: 2000* (1995, multi-platinum, featuring \"More Human Than Human\" and \"Super-Charger Heaven\"). Commercial peak: *La Sexorcisto: Devil Music Vol. 1* (1992, eventually double-platinum) and *Astro-Creep: 2000*. The band dissolved in 1998; Rob Zombie has continued the aesthetic in his solo career.",
  "whitechapel":
    "American deathcore band formed in Knoxville, Tennessee in 2006. Long-running lineup: Phil Bozeman (vocals), Ben Savage (guitar), Alex Wade (guitar), Zach Householder (guitar), Gabe Crisp (bass), and Alex Rüdinger (drums, since 2018). Distinguished by their three-guitar attack and Bozeman's gutturals.\n\nReleased eight studio albums between *The Somatic Defilement* (2007) and *Hymns in Dissonance* (2025). Critical peak: *A New Era of Corruption* (2010) and *The Valley* (2019). Released primarily on Metal Blade Records.",
  "whitesnake":
    "British hard rock band formed in London in 1978 by David Coverdale (vocals, b. September 22, 1951, formerly of Deep Purple). Long-running lineup has rotated extensively but Coverdale has been the only constant member. Notable members have included Bernie Marsden (1951-2023), Mickey Moody, Cozy Powell (1947-1998), Steve Vai, Adrian Vandenberg, and many others.\n\nReleased 13 studio albums between *Trouble* (1978) and *Flesh & Blood* (2019). Commercial peak: *Whitesnake* (1987, 8x platinum in the US, featuring \"Here I Go Again\" and \"Is This Love\") and *Slip of the Tongue* (1989). The band shifted from a blues-based hard-rock sound to a glam-metal direction starting with the 1984 *Slide It In* album.",
  "whitney-houston":
    "American singer and actress born August 9, 1963, in Newark, New Jersey; died February 11, 2012. Among the best-selling music artists of all time, with estimated worldwide sales of 200 million-plus units. Distinguished by her powerful vocal range and influential interpretations of popular standards.\n\nReleased seven studio albums between *Whitney Houston* (1985) and *I Look to You* (2009). Commercial peak: *Whitney Houston* (diamond-certified), *Whitney* (1987), *I'm Your Baby Tonight* (1990), and *The Bodyguard* (1992, the best-selling soundtrack of all time at 45 million-plus copies, featuring her recording of Dolly Parton's \"I Will Always Love You\"). Six Grammy Awards. Died at age 48 by drowning in a bathtub, with cocaine use and heart disease cited as contributing factors. Inducted into the Rock and Roll Hall of Fame in 2020.",
  "wilco":
    "American rock band formed in Belleville, Illinois in 1994 by Jeff Tweedy (vocals/guitar, formerly of Uncle Tupelo). Long-running lineup: Tweedy, John Stirratt (bass, since founding), Glenn Kotche (drums, since 2001), Nels Cline (guitar, since 2004), Pat Sansone (multi-instrumentalist, since 2004), and Mikael Jorgensen (keyboards, since 2002). Distinguished by their stylistic restlessness — alt-country, experimental rock, Americana, and chamber-pop across their catalog.\n\nReleased 13 studio albums between *A.M.* (1995) and *Cousin* (2023). Critical peak: *Summerteeth* (1999), *Yankee Hotel Foxtrot* (2002, the album Reprise rejected before Wilco's purchase-back-and-leak made it a cult classic), and *A Ghost Is Born* (2004, Grammy for Best Alternative Music Album). The 2002 Sam Jones documentary *I Am Trying to Break Your Heart* chronicled the *Yankee Hotel Foxtrot* saga.",
  "wild-cherry":
    "American funk-rock band formed in Mingo Junction, Ohio in 1970. Long-running lineup centered on Robert Parissi (vocals). Distinguished by their one-hit-wonder commercial peak with \"Play That Funky Music\" (1976), a #1 Billboard Hot 100 hit reportedly inspired by a Black audience member's heckle at a Wild Cherry show: \"Play that funky music, white boy.\"\n\nReleased four studio albums between *Wild Cherry* (1976) and *Only the Wild Survive* (1979). Won the 1977 Grammy for Best R&B Vocal Performance by a Duo, Group, or Chorus for \"Play That Funky Music.\"",
  "will-haven":
    "American post-metal band formed in Sacramento, California in 1995. Long-running lineup centered on Grady Avenell (vocals) and Jeff Irwin (guitar). Distinguished by their fusion of hardcore, sludge metal, and post-metal — sometimes credited as an early influence on the broader post-metal genre.\n\nReleased five studio albums between *El Diablo* (1997) and *Muerte* (2018). Released on Revelation Records during their commercial peak. Frequent touring partners with the Deftones and Far.",
  "willie-nelson":
    "American singer-songwriter born April 29, 1933, in Abbott, Texas. Among the most prolific and influential figures in country music history. Distinguished by his distinctive nasal phrasing, gut-string acoustic guitar (his famous \"Trigger\"), and his pivotal role in the outlaw-country movement of the 1970s.\n\nReleased over 75 studio albums between *...And Then I Wrote* (1962) and *The Border* (2024). Commercial peak: *Red Headed Stranger* (1975), *Stardust* (1978, the standards-album sleeper hit that sold over five million copies), and *Always on My Mind* (1982). Founded Farm Aid with Neil Young and John Mellencamp in 1985. Member of the Highwaymen with Johnny Cash, Waylon Jennings, and Kris Kristofferson (1985-1995). Inducted into the Country Music Hall of Fame in 1993. 13 Grammy Awards.",
  "winger":
    "American rock band formed in New York City in 1987. Long-running lineup: Kip Winger (vocals/bass), Reb Beach (guitar), Paul Taylor (keyboards, joined 1988), and Rod Morgenstein (drums). Distinguished by their slick, keyboard-heavy hard rock during the late-1980s glam-metal era. Frequent target of mockery on MTV's *Beavis and Butt-Head*, which damaged the band's public perception in the early 1990s.\n\nReleased seven studio albums between *Winger* (1988) and *Seven* (2023). Commercial peak: *Winger* (platinum-certified, featuring \"Seventeen\" and \"Madalaine\") and *In the Heart of the Young* (1990).",
  "wizo":
    "German punk rock band formed in Sindelfingen in 1986 (often stylized WIZO, originally Wizo). Long-running lineup centered on Axel \"Axl\" Kurth (vocals/guitar). Distinguished by their politically charged German-language punk lyrics and their long-running role on Fat Wreck Chords's roster.\n\nReleased nine studio albums between *Für'n Arsch* (1990) and *Der* (2017). Released on Hulk Räckorz, Fat Wreck Chords, and (later) Fat Mike's NOFX-affiliated labels. Has continued to tour internationally.",
  "wynonna-judd":
    "American country singer born Christina Claire Ciminella on May 30, 1964, in Ashland, Kentucky. Half of the mother-daughter duo The Judds (1983-1991, with Naomi Judd, 1946-2022) before launching her solo career. Distinguished by her powerful contralto vocals.\n\nReleased eight solo studio albums between *Wynonna* (1992, 5x platinum, featuring \"She Is His Only Need\") and *Recollection* (2020). The Judds reunited intermittently in subsequent decades; Naomi Judd died in 2022 by suicide one day before the Judds' Country Music Hall of Fame induction. Wynonna has continued the planned 2022-2023 reunion tour as a solo tribute.",
  "y-t":
    "American hard rock band formed in Oakland, California in 1974 (originally as Yesterday & Today, shortened to Y&T in 1981 due to the Beatles album of the same name). Long-running lineup centered on Dave Meniketti (vocals/guitar). Distinguished by their bluesy hard-rock sound and modest commercial peak during the early-1980s metal explosion.\n\nReleased 14 studio albums between *Yesterday & Today* (1976) and *Facemelter* (2010). Commercial peak: *Earthshaker* (1981), *Black Tiger* (1982), and *Mean Streak* (1983). Tragically lost guitarist Joey Alves (1953-2017), drummer Leonard Haze (1955-2016), and bassist Phil Kennemore (1953-2011) within a few-year span.",
  "yanni":
    "Greek-American keyboardist and composer born Yiannis Hryssomallis on November 14, 1954, in Kalamata, Greece. Distinguished by his lush, large-ensemble new-age compositions and his elaborate live productions, frequently filmed at historic sites for PBS broadcasts.\n\nReleased over 20 studio albums between *Optimystique* (1980) and *The Dream Concert: Live from the Great Pyramids of Egypt* (2017). Commercial peak: *Live at the Acropolis* (1994, eventually 7x platinum, recorded at the Herodes Atticus Theater in Athens). Two Grammy nominations.",
  "yates-mckendree":
    "American blues guitarist and singer-songwriter born c. 2002. Son of producer Kevin McKendree. Distinguished by his throwback Stevie Ray Vaughan-style blues guitar at an unusually young age — he performed alongside Buddy Guy, Joe Bonamassa, and Tedeschi Trucks Band before turning 20.\n\nReleased the debut *Buchanan Lane* (2021) on Qualified Records. Part of the contemporary young-blues revival alongside Christone \"Kingfish\" Ingram and Marcus King.",
  "year-of-the-cobra":
    "American doom metal duo formed in Seattle in 2014. Married couple Amy Tung Barrysmith (bass/vocals) and Jon Barrysmith (drums). Distinguished by their two-piece doom-metal format with bass-only low end and Tung Barrysmith's haunting vocals.\n\nReleased two studio albums: *...In the Shadows Below* (2016) and *Ash and Dust* (2019). Released primarily on Magnetic Eye Records and Prophecy Productions.",
  "youth-of-today":
    "American hardcore band formed in Danbury, Connecticut in 1985. Long-running lineup historically centered on Ray Cappo (vocals) and Porcell (Porcelli, guitar). Foundational influence on the late-1980s straight-edge and youth-crew hardcore movements; their pro-vegetarian, pro-straight-edge lyrics shaped a generation of hardcore bands.\n\nReleased two studio albums during their original run: *Break Down the Walls* (1986) and *We're Not in This Alone* (1988). The band dissolved in 1990; Cappo subsequently led the Hare Krishna-influenced Shelter while Porcell joined Judge and (later) Shelter. Youth of Today has reunited intermittently since the early 2000s.",
  "zappa":
    "American rock band led by guitarist Frank Zappa (1940-1993). The credit \"Zappa\" appears on albums released under Frank Zappa's own name (rather than \"Frank Zappa\" or \"The Mothers of Invention\"), most notably starting with the 1979 *Sheik Yerbouti* and *Joe's Garage* releases when Zappa began separating his \"Zappa band\" from the Mothers branding.\n\nReleased over 60 studio albums under various Zappa credits. Best-known recordings include \"Bobby Brown\" (1979), \"Valley Girl\" (1982, featuring Moon Zappa), and the *Joe's Garage* (1979) and *You Are What You Is* (1981) song cycles. Inducted into the Rock and Roll Hall of Fame in 1995. The Zappa estate continues to release archival material.",
  "ziggy-marley-and-the-melody-makers":
    "Jamaican reggae band formed in Kingston in 1979 by the children of Bob Marley (1945-1981). Lineup: David \"Ziggy\" Marley (vocals/guitar, b. 1968), Stephen Marley (vocals, b. 1972), Cedella Marley (vocals, b. 1967), and Sharon Marley Prendergast (vocals, b. 1964). Distinguished by their continuation of the classic-roots-reggae tradition.\n\nReleased nine studio albums between *Play the Game Right* (1985) and *Fallen Is Babylon* (1997). Commercial peak: *Conscious Party* (1988, produced by Talking Heads' Tina Weymouth and Chris Frantz) and *One Bright Day* (1989), both winning Grammy Awards for Best Reggae Album. Ziggy Marley has pursued a solo career since the late 1990s; the Melody Makers have not toured since the 1990s.",
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
