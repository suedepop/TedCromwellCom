import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

async function main() {
  const { upsertResume } = await import("../lib/resume");
  const { randomUUID } = await import("node:crypto");

  const id = () => randomUUID();

  const resume = await upsertResume({
    name: "Ted Cromwell",
    tagline: "Senior Consultant — Legal Marketing Technology · Systems Architect · SAFe® 5 Agilist",
    email: "tedcromwell@gmail.com",
    location: "Weirton, West Virginia, United States",
    website: "https://www.tedcromwell.com",
    linkedin: "https://www.linkedin.com/in/tedcromwell",
    summary:
      "Highly skilled, certified SAFe® 5 Agilist with over 25 years designing and executing high-traffic websites, systems integrations, and cloud migrations. A proven team leader and mentor who can build, nurture, and guide multiple teams to a successful outcome. Flexible and knowledgeable across the full Software Development Lifecycle (SDLC), with a deep understanding of user experience and expert proficiency in Content Management Systems. Effective communicator who can work in a common language with every level, from developers to senior leadership.",
    experience: [
      {
        id: id(),
        sortOrder: 0,
        organization: "Mount Insights",
        role: "Senior Consultant — Legal Marketing Technology",
        startDate: "2025-10",
        bullets: [],
      },
      {
        id: id(),
        sortOrder: 1,
        organization: "Cromwell Ventures LLC",
        role: "Principal",
        location: "Weirton, West Virginia, United States",
        startDate: "2025-10",
        bullets: [
          "West Virginia–based consulting firm providing specialized subcontracting services to established consulting and technology organizations.",
          "Focused on delivering high-quality expertise in information technology, digital transformation, and business process improvement across multiple industries.",
        ],
      },
      {
        id: id(),
        sortOrder: 2,
        organization: "Wellmark Blue Cross and Blue Shield",
        role: "System Architect",
        location: "Des Moines, Iowa, United States",
        startDate: "2024-06",
        endDate: "2025-05",
        bullets: [
          "Led the move from batch processing to event-driven architecture using pub/sub patterns, leveraging automation to keep data flowing to the appropriate systems.",
          "Ensured alignment with requirements and timelines via close collaboration with Project and Delivery Managers; ran regular progress reviews to maintain accountability.",
          "Created strategic architecture via logical and infrastructure diagrams and partnered with platform engineers to enhance designs and technologies.",
          "Engaged with the broader Architecture group to reinforce standards and ensure consistency in patterns across teams.",
        ],
      },
      {
        id: id(),
        sortOrder: 3,
        organization: "PPG Industries",
        role: "Senior Front-End Architect",
        location: "Pittsburgh, Pennsylvania, United States",
        startDate: "2021-07",
        endDate: "2024-05",
        bullets: [
          "Partnered with Leadership, Product Owners, UI/UX, Tech Leads, DevOps Engineers, and other Architects to deliver the $35M+ Global Website Platform (PPG.com).",
          "Developed and delivered high- and low-level architecture diagrams to articulate solution vision.",
          "Oversaw data-flow architecture via multiple API services — enhancing content, search indices, location management, and lead generation — using serverless orchestration alongside no/low-code solutions (Logic Apps).",
          "Enhanced automated content creation leveraging AI (ChatGPT / DeepL) and RPA through Webhooks and API microservices.",
          "Streamlined collaboration between developers and operations by automating application releases with Terraform and Azure Pipelines.",
          "Directed Information Architecture projects while managing all data types in Enterprise CMS (Kontent.ai) and Enterprise Search (Algolia).",
          "Onboarded, mentored, and supported multiple teams of contract developers and tech leads across time zones and locations.",
          "Presented and participated as a member of the Architectural Review Board.",
          "Visited Wrocław, Poland multiple times to deliver support and facilitate workshops with contract and regional-office employees.",
        ],
      },
      {
        id: id(),
        sortOrder: 4,
        organization: "PPG Industries",
        role: "Systems Analyst, Expert",
        location: "Greater Pittsburgh Area",
        startDate: "2014-02",
        endDate: "2021-06",
        bullets: [
          "Oversaw project execution for an array of PPG Architectural Coatings brands including PPG Paints, Olympic, Glidden, Liquid Nails, Homax, Sico, CIL, Disney Paints, Deft, and Flood.",
          "Designed, proved, and implemented standards for front-end development, SEO, website analytics, and social sharing.",
          "Led multiple contracted and full-time employees — daily activities, annual evaluations, goal progress, and career development.",
          "Participated in the PPG Internship Program as both mentor and supervisor.",
          "Established and executed standards to streamline the development life cycle and enhance team efficiency.",
          "Introduced: Design System, Azure DevOps, Azure B2C shared login, headless Enterprise CMS (Kontent.ai), Enterprise Search (Algolia), PIM (Kontent.ai, SAP, Informatica), Bootstrap grid, Google Places/Maps, Kentico e-commerce, 3rd-party retail automation (Walmart, Amazon, others), BazaarVoice ratings and reviews.",
        ],
      },
      {
        id: id(),
        sortOrder: 5,
        organization: "Orrick, Herrington & Sutcliffe LLP",
        role: "Digital Marketing Technology Team Lead",
        location: "Wheeling, West Virginia Area",
        startDate: "2008-02",
        endDate: "2014-02",
        bullets: [
          "Managed team of digital marketing coordinators and specialists building, maintaining, and advancing Orrick.com, Orrick Blogs, and Orrick regional sites.",
          "Oversaw internal content management systems and databases delivering content to internal and external customers.",
          "Developed strategies for social business consulting to enhance client engagement.",
          "Implemented marketing-automation tools to streamline campaign management.",
          "Engineered and applied effective SEO strategies.",
          "Designed and managed web and portal-driven solutions for marketing and business development, integrating CRM (Recommind) with lead generation (HubSpot).",
          "Established and managed systems for measuring digital-marketing success (WebTrends, HubSpot, Google Analytics).",
          "*Previously Web Engineering Specialist II:* developer on client-facing applications and websites; managed IntApp low-code integrations for content, user roles, and data transformation; WebTrends administrator, WordPress lead, IntApp Solutions Architect, and SharePoint integration.",
        ],
      },
      {
        id: id(),
        sortOrder: 6,
        organization: "Consolidated Communications",
        role: "Web Strategist",
        location: "Wexford, Pennsylvania, United States",
        startDate: "2003-02",
        endDate: "2008-02",
        bullets: [
          "*Formerly Nauticom Internet Services (North Pittsburgh Systems, Inc.).*",
          "Partnered with external clients to design digital solutions strengthening brand presence.",
          "Developed solutions for high-traffic regional clients including the Art Institutes, Fred Rogers Productions (Mister Rogers), Traco, and CertainTeed.",
          "Lead interface designer and mass-email specialist; solutions architect and lead proposal generator.",
        ],
      },
      {
        id: id(),
        sortOrder: 7,
        organization: "Rapid Systems, Inc.",
        role: "Creative Director",
        location: "Tampa, Florida, United States",
        startDate: "2000-07",
        endDate: "2002-10",
        bullets: [
          "Engaged with clients to develop customized web solutions advancing business objectives, featuring early e-commerce models.",
          "Oversaw in-house marketing across corporate website, print, billboards, radio, and other media.",
          "Implemented web analytics (WebTrends) to monitor traffic and assess effectiveness for all customers.",
          "Developed internal software to streamline troubleshooting of network and customer challenges.",
        ],
      },
    ],
    education: [
      {
        id: id(),
        sortOrder: 0,
        organization: "West Liberty University",
        role: "B.S., Graphic Design & Communications",
        startDate: "1995",
        endDate: "2000",
        bullets: [],
      },
    ],
    skills: [
      {
        category: "Architecture & Leadership",
        skills: ["Systems Architecture", "SAFe® 5 Agilist", "Team Leadership", "Mentorship", "Architectural Review Board"],
        sortOrder: 0,
      },
      {
        category: "Consulting",
        skills: ["Consulting", "Technology Integration", "Digital Transformation", "Salesforce.com"],
        sortOrder: 1,
      },
      {
        category: "Content & Commerce Platforms",
        skills: ["Kontent.ai (headless CMS)", "Kentico", "WordPress", "SharePoint", "Recommind", "HubSpot"],
        sortOrder: 2,
      },
      {
        category: "Cloud & DevOps",
        skills: ["Azure DevOps", "Azure Pipelines", "Azure B2C", "Terraform", "Serverless Orchestration", "Logic Apps"],
        sortOrder: 3,
      },
      {
        category: "Search & Analytics",
        skills: ["Algolia", "Google Analytics", "WebTrends", "BazaarVoice", "SEO"],
        sortOrder: 4,
      },
      {
        category: "Patents",
        skills: ["Home Visualization Tool"],
        sortOrder: 5,
      },
    ],
  });

  console.log("Resume seeded. Updated:", resume.updatedAt);
  console.log(`Experience entries: ${resume.experience.length}`);
  console.log(`Education entries: ${resume.education.length}`);
  console.log(`Skill groups: ${resume.skills.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
