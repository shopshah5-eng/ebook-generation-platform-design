export const navLinks = ["Templates", "Examples", "Pricing"];

export const examples = ["Startup guide", "Wellness workbook", "Finance handbook"];

export const logos = [
  "Google for Startups",
  "Notion",
  "Microsoft",
  "HubSpot",
  "Canva",
  "deel",
  "Framer",
];

export const media = {
  heroBooks:
    "https://images.pexels.com/photos/19907129/pexels-photo-19907129.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200",
  openBook:
    "https://images.pexels.com/photos/2099266/pexels-photo-2099266.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200",
  creatorDesk:
    "https://images.pexels.com/photos/8400596/pexels-photo-8400596.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200",
};

export const templates = [
  {
    title: "The Future of Work",
    tag: "Free",
    theme: "Modern Business",
    bg: "linear-gradient(145deg, #fffcf7 0%, #eee9df 100%)",
    color: "#111827",
    lines: ["THE FUTURE", "OF WORK"],
    image: "./covers/cover-business.jpg",
    pages: [
      {
        type: "cover",
        title: "The Future of Work",
        subtitle: "A Guide to Hybrid Teams & Async Operations"
      },
      {
        type: "toc",
        chapters: [
          { num: "01", name: "The Hybrid Revolution", page: "03" },
          { num: "02", name: "Culture-First Connectivity", page: "04" },
          { num: "03", name: "Outcomes-Based Focus", page: "05" },
          { num: "04", name: "Async Collaboration Tools", page: "06" }
        ]
      },
      {
        type: "chapter",
        chapterNum: "Chapter 01",
        title: "The Hybrid Revolution",
        content: "Work is no longer a place we go, but an activity we perform. The modern organization must embrace asynchronous operations, culture-first connectivity, and outcomes-based management to thrive in the new paradigm. Rather than measuring hours at a desk, leaders must focus on output, trust, and alignment."
      },
      {
        type: "content",
        quote: "Success in hybrid teams is built on documentation, clear ownership, and radical transparency.",
        text: "A successful hybrid framework requires clear communication protocols, decentralized decision making, and intentional collaboration windows. Standardized documentation ensures that everyone remains aligned, regardless of their location or time zone."
      },
      {
        type: "visual",
        image: "https://images.pexels.com/photos/3184311/pexels-photo-3184311.jpeg?auto=compress&cs=tinysrgb&w=800",
        caption: "Figure 1.1: Collaboration in decentralized teams."
      },
      {
        type: "checklist",
        title: "Implementation Framework",
        items: [
          "Define core async communication hours",
          "Implement weekly outcomes tracking",
          "Conduct quarterly connection retreats",
          "Provide home office equipment stipends"
        ]
      }
    ]
  },
  {
    title: "Nature of Calm",
    tag: "Free",
    theme: "Wellness",
    bg: "linear-gradient(145deg, #edf3e7 0%, #718366 100%)",
    color: "#253724",
    lines: ["NATURE", "OF CALM"],
    image: "./covers/cover-wellness.jpg",
    pages: [
      {
        type: "cover",
        title: "Nature of Calm",
        subtitle: "Daily Mindfulness & Natural Restorative Habits"
      },
      {
        type: "toc",
        chapters: [
          { num: "01", name: "The Art of Slowing Down", page: "03" },
          { num: "02", name: "Breath and Attention", page: "04" },
          { num: "03", name: "Spacious Daily Routines", page: "05" },
          { num: "04", name: "Gratitude & Connection", page: "06" }
        ]
      },
      {
        type: "chapter",
        chapterNum: "Chapter 01",
        title: "The Art of Slowing Down",
        content: "In a hyper-connected world, silence is a form of luxury. Finding moments of stillness is not a waste of time, but a vital necessity for the mind, body, and spirit to recharge and maintain focus. It begins with simple breath awareness, expanding outward to conscious movement."
      },
      {
        type: "content",
        quote: "Mindfulness is not about clearing your head; it is about being present with whatever is there.",
        text: "Practicing mindfulness is about training your attention to remain in the present moment without judgment. Creating brief spacious moments throughout the day can significantly lower cortisol levels and restore mental clarity."
      },
      {
        type: "visual",
        image: "https://images.pexels.com/photos/35721588/pexels-photo-35721588.jpeg?auto=compress&cs=tinysrgb&w=800",
        caption: "Figure 1.1: Natural environments and calm spaces."
      },
      {
        type: "checklist",
        title: "Wellness Practice Goals",
        items: [
          "Start with 5 minutes of daily breathing",
          "Spend 20 minutes in nature unplugged",
          "Practice mindful eating once a day",
          "Write down three gratitude points nightly"
        ]
      }
    ]
  },
  {
    title: "Launch Notes",
    tag: "Pro",
    theme: "Startup",
    bg: "linear-gradient(145deg, #101f3b 0%, #182b4d 62%, #d7b16b 100%)",
    color: "#f5e7c3",
    lines: ["LAUNCH", "NOTES"],
    image: "./covers/cover-scifi.jpg",
    pages: [
      {
        type: "cover",
        title: "Launch Notes",
        subtitle: "How to Build, Validate, and Scale an MVP"
      },
      {
        type: "toc",
        chapters: [
          { num: "01", name: "Building to Learn", page: "03" },
          { num: "02", name: "The Validation Loop", page: "04" },
          { num: "03", name: "Metric-Driven Growth", page: "05" },
          { num: "04", name: "Failing Fast and Pivoting", page: "06" }
        ]
      },
      {
        type: "chapter",
        chapterNum: "Chapter 01",
        title: "Building to Learn",
        content: "The greatest risk to any startup is building something nobody wants. Your primary objective in the early days is not to scale, but to learn, validate assumptions, and iterate rapidly based on real user feedback. Gather qualitative insights, track key usage metrics, and do not be afraid to pivot."
      },
      {
        type: "content",
        quote: "If you are not embarrassed by the first version of your product, you launched too late.",
        text: "Deploy your Minimum Viable Product (MVP) as early as possible. Standardize validation experiments, monitor core engagement indicators, and only scale operations after achieving verifiable product-market fit."
      },
      {
        type: "visual",
        image: "https://images.pexels.com/photos/7376/startup-photos.jpg?auto=compress&cs=tinysrgb&w=800",
        caption: "Figure 1.1: Early validation and rapid prototyping."
      },
      {
        type: "checklist",
        title: "Startup Milestones",
        items: [
          "Conduct 10 qualitative user interviews",
          "Launch landing page with email sign-up",
          "Track click-through and signup conversion",
          "Build minimum feature set for release"
        ]
      }
    ]
  },
  {
    title: "Wealth Systems",
    tag: "Free",
    theme: "Finance",
    bg: "radial-gradient(circle at 64% 28%, rgba(180, 128, 52, .36), transparent 29%), linear-gradient(145deg, #efe4d2 0%, #c8b084 100%)",
    color: "#6d4d22",
    lines: ["WEALTH", "SYSTEMS"],
    image: "./covers/cover-cookbook.jpg",
    pages: [
      {
        type: "cover",
        title: "Wealth Systems",
        subtitle: "Automated Investing & Wealth Management Habits"
      },
      {
        type: "toc",
        chapters: [
          { num: "01", name: "Automating Your Savings", page: "03" },
          { num: "02", name: "Power of Compound Interest", page: "04" },
          { num: "03", name: "The 50/30/20 Allocation Rule", page: "05" },
          { num: "04", name: "Smart Asset Allocation", page: "06" }
        ]
      },
      {
        type: "chapter",
        chapterNum: "Chapter 01",
        title: "Automating Your Savings",
        content: "Financial freedom is built on systems, not timing. By automating your savings, investments, and debt payments, you remove emotion from money management and leverage the power of compound interest. Allocate your income using a structured model (e.g. 50% needs, 20% savings, 30% wants)."
      },
      {
        type: "content",
        quote: "Do not save what is left after spending; spend what is left after saving.",
        text: "Consistency is far more important than the initial amount; start small, build the habit, and scale as your earnings increase. Set up automatic bank transfers to invest monthly without requiring manual execution."
      },
      {
        type: "visual",
        image: "https://images.pexels.com/photos/4386442/pexels-photo-4386442.jpeg?auto=compress&cs=tinysrgb&w=800",
        caption: "Figure 1.1: Growth curves of compounding investments."
      },
      {
        type: "checklist",
        title: "Financial Checklist",
        items: [
          "Set up automatic transfer to savings",
          "Establish a 3-month emergency fund",
          "Contribute to tax-advantaged accounts",
          "Pay off high-interest debt aggressively"
        ]
      }
    ]
  },
  {
    title: "Luxury Brand Strategy",
    tag: "Pro",
    theme: "Luxury Brand",
    bg: "linear-gradient(145deg, #070707 0%, #22201c 58%, #9b742c 100%)",
    color: "#d9bb74",
    lines: ["LUXURY", "BRAND"],
    image: "./covers/cover-history.jpg",
    pages: [
      {
        type: "cover",
        title: "Luxury Brand Strategy",
        subtitle: "Heritage, Exclusivity, & Premium Positioning"
      },
      {
        type: "toc",
        chapters: [
          { num: "01", name: "The Illusion of Rarity", page: "03" },
          { num: "02", name: "Exclusivity vs. Accessibility", page: "04" },
          { num: "03", name: "Bespoke Packaging Systems", page: "05" },
          { num: "04", name: "Managing Brand Heritage", page: "06" }
        ]
      },
      {
        type: "chapter",
        chapterNum: "Chapter 01",
        title: "The Illusion of Rarity",
        content: "Luxury is not about utility; it is about identity, heritage, and emotion. To build a premium brand, you must elevate your product from a functional commodity to an aspirational symbol of status and artistry. Never compete on price; compete on exclusivity and craftsmanship."
      },
      {
        type: "content",
        quote: "Luxury is the expression of a brand's soul, not its manufacturing efficiency.",
        text: "The luxury brand controls supply, creates premium experiences, and tells a compelling story of heritage that justifies its premium pricing. Every touchpoint must feel high-fidelity, customized, and rare."
      },
      {
        type: "visual",
        image: "https://images.pexels.com/photos/19907129/pexels-photo-19907129.jpeg?auto=compress&cs=tinysrgb&w=800",
        caption: "Figure 1.1: Craftsmanship and premium aesthetic textures."
      },
      {
        type: "checklist",
        title: "Premium Strategy Focus",
        items: [
          "Refine visual identity for minimalism",
          "Limit product runs for exclusivity",
          "Deliver custom concierge packaging",
          "Establish brand history narratives"
        ]
      }
    ]
  },
  {
    title: "The Art of Persuasion",
    tag: "Pro",
    theme: "Persuasion",
    bg: "linear-gradient(145deg, #461018 0%, #801b27 68%, #c79868 100%)",
    color: "#f1d1ad",
    lines: ["THE ART OF", "PERSUASION"],
    image: "./covers/cover-romance.jpg",
    pages: [
      {
        type: "cover",
        title: "The Art of Persuasion",
        subtitle: "The Psychology of Influence & Shared Alignment"
      },
      {
        type: "toc",
        chapters: [
          { num: "01", name: "The Psychology of Influence", page: "03" },
          { num: "02", name: "Reciprocity and Authority", page: "04" },
          { num: "03", name: "Social Proof in Action", page: "05" },
          { num: "04", name: "Frameworks for Public Speaking", page: "06" }
        ]
      },
      {
        type: "chapter",
        chapterNum: "Chapter 01",
        title: "The Psychology of Influence",
        content: "Persuasion is not manipulation; it is the art of alignment. By understanding core human drivers—reciprocity, authority, social proof, and scarcity—you can communicate your ideas in a way that resonates with others. Always start with the listener's perspective."
      },
      {
        type: "content",
        quote: "To influence others, you must first be willing to be influenced by their perspective.",
        text: "Frame your message around their problems, desires, and objectives. When they feel understood, their psychological resistance drops, and true collaboration and persuasion can begin."
      },
      {
        type: "visual",
        image: "https://images.pexels.com/photos/716276/pexels-photo-716276.jpeg?auto=compress&cs=tinysrgb&w=800",
        caption: "Figure 1.1: Dialogue and psychological alignment."
      },
      {
        type: "checklist",
        title: "Influence Milestones",
        items: [
          "Use the reciprocity principle in offers",
          "Establish authority through case studies",
          "Showcase social proof and testimonials",
          "Highlight scarce resources or timelines"
        ]
      }
    ]
  },
];

export const showcasePoints = [
  "Structured chapters",
  "Designed covers",
  "Print-ready PDFs",
];

export const steps = [
  {
    number: "01",
    title: "Paste or Write",
    text: "Add your content or simply describe your idea. Our AI understands the context.",
  },
  {
    number: "02",
    title: "AI Creates",
    text: "We structure chapters, write content, design layouts and generate visuals.",
  },
  {
    number: "03",
    title: "Export & Share",
    text: "Get a beautifully designed PDF ready to publish, share or sell.",
  },
];

export const testimonials = [
  {
    quote: "PageNest made my consulting guide feel like something from a boutique publisher.",
    name: "Maya Chen",
    role: "Growth Consultant",
    img: "https://images.pexels.com/photos/14587417/pexels-photo-14587417.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    quote: "We turned a rough lead magnet into a premium product in a single afternoon.",
    name: "Avery Stone",
    role: "Founder, Northline Studio",
    img: "https://images.pexels.com/photos/7717254/pexels-photo-7717254.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    quote: "The output feels calm, credible, and editorial. Exactly what my wellness audience expects.",
    name: "Isla Morgan",
    role: "Wellness Coach",
    img: "https://images.pexels.com/photos/35721588/pexels-photo-35721588.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    quote: "It bridges the gap between a document and a real digital product.",
    name: "Noah Reed",
    role: "Creator Educator",
    img: "https://images.pexels.com/photos/14950779/pexels-photo-14950779.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
];

export const pricing = [
  {
    name: "Free",
    monthlyPrice: 0,
    features: ["1 complete ebook", "30 page preview exports", "Core templates", "Community support"],
    button: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    monthlyPrice: 9,
    features: ["60 ebooks per month", "No watermarks", "Premium templates", "Full-resolution PDF", "Priority processing"],
    button: "Start Pro Trial",
    popular: true,
  },
  {
    name: "Ultra",
    monthlyPrice: 24,
    features: ["Unlimited ebooks", "Up to 120 pages", "Advanced brand kits", "Team workspaces", "Fastest processing", "Dedicated support"],
    button: "Start Ultra Trial",
    popular: false,
  },
];

export const footerColumns = [
  { title: "Product", links: ["Templates", "Features", "Examples", "Pricing"] },
  { title: "Resources", links: ["Guides", "Blog", "Help Center", "Brand Kit"] },
  { title: "Company", links: ["About", "Careers", "Contact", "Affiliates"] },
  { title: "Legal", links: ["Terms", "Privacy", "Cookies", "Security"] },
];