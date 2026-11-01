import { restaurants, hotel } from "./data.js";
export { hotel };
export const checkedOn = "2026-11-01";
const hktb = (slug) => ({
  publisher: "Hong Kong Tourism Board",
  title: slug.replaceAll("-", " "),
  url: `https://www.discoverhongkong.com/eng/place-to-go/travel.guide-${slug}.html`,
  accessed: checkedOn,
});
const sassy = (slug, title, edition) => ({
  publisher: "Sassy Hong Kong",
  title,
  url: `https://www.sassyhongkong.com/${slug}/`,
  edition,
  accessed: checkedOn,
});
const ssp = sassy(
  "sassys-guide-to-sham-shui-po-whatsonhk",
  "Sham Shui Po neighbourhood guide",
  "Updated July 2022 · older coverage",
);
const syp = sassy(
  "living-neighbourhood-guide-sai-ying-pun",
  "Sai Ying Pun neighbourhood guide",
  "Updated October 2025",
);
const poho = sassy(
  "living-neighbourhood-guide-poho-hong-kong",
  "Poho neighbourhood guide",
);
const cat = sassy(
  "whats-on-cat-street-antiques-coffee-hong-kong",
  "Cat Street: antiques, coffee and more",
);
const wch = sassy(
  "whats-on-hk-wong-chuk-hang-neighbourhood-guide-eat-drink-shopping",
  "Wong Chuk Hang neighbourhood guide",
  "February 2024 · older coverage",
);
const jazz = sassy(
  "whats-on-hong-kong-best-jazz-bars-cocktails",
  "Hong Kong jazz bars",
);
const point = (
  id,
  name,
  kind,
  address,
  lat,
  lng,
  description,
  tip,
  sources,
  options = {},
) => ({
  id,
  name,
  kind,
  address,
  lat,
  lng,
  description,
  tip,
  sources,
  ...options,
});
const food = (id, tip) => {
  const r = restaurants.find((r) => r.id === id);
  if (!r) throw new Error(`Unknown food stop: ${id}`);
  return {
    id: r.id,
    name: r.name,
    chinese: r.chinese,
    kind: "food",
    address: `${r.address}, ${r.area}`,
    lat: r.lat,
    lng: r.lng,
    description: r.description,
    tip: tip || r.tip,
    order: r.order,
    budget: `HK$${r.low}–${r.high} per person · food-guide estimate`,
    sources: r.citations.map((c) => ({
      publisher: c.publisher,
      title: c.title,
      url: c.url,
      accessed: r.checkedOn,
    })),
    foodId: r.id,
  };
};
export const kinds = {
  all: "All stops",
  streets: "Streets & heritage",
  art: "Art & design",
  food: "Local food",
  coffee: "Coffee & a pause",
  drinks: "Drinks",
};
export const neighbourhoods = [
  {
    id: "sham-shui-po",
    name: "Sham Shui Po",
    chinese: "深水埗",
    number: "01",
    accent: "#8b5838",
    short: "Market streets, studio floors, a good meal.",
    vibe: "A whole afternoon of street life",
    intro:
      "Follow electronics stalls into fabric-shop streets, pause for coffee, then head up to the studios in Shek Kip Mei. There is plenty here for a whole day: rice rolls for lunch, a slow browse, and a relaxed drink near Boundary Street.",
    context:
      "Sham Shui Po’s interest comes from the mix: working shops, old residential blocks, food businesses and newer creative spaces sharing the same streets. Tai Nan Street gives you independent coffee and design; Apliu Street and the surrounding markets keep the day rooted in the neighbourhood.",
    time: "Afternoon into early evening",
    duration: "4–6 hours, with food and pauses",
    station: "Sham Shui Po MTR",
    lat: 22.3292,
    lng: 114.1627,
    transport:
      "From Eaton, walk to Jordan MTR and take the Tsuen Wan line towards Tsuen Wan to Sham Shui Po. Finish near Prince Edward for the direct Tsuen Wan-line journey back to Jordan. Use the transit link for current routes.",
    terrain:
      "Mostly level streets. JCCAC is a longer northern detour into Shek Kip Mei; allow a separate walk or use transport rather than rushing it.",
    practical:
      "Street stalls and studio programmes keep different hours. Aim for daylight for the markets; JCCAC is a working arts centre, so individual studios are not guaranteed to admit visitors. Bring a little cash for small food shops.",
    pairing:
      "For a complete day: a small lunch, markets, one coffee stop, JCCAC if something is on, then dinner or a drink. Openground and Café Sausalito are optional alternatives to each other.",
    route: ["hop-yik-tai", "apliu", "tai-nan", "bound"],
    day: [
      [
        "Lunch",
        "Start small, leave room",
        "Try rice rolls at Hop Yik Tai or tofu pudding at Kung Wo. Both are already on your food shortlist.",
      ],
      [
        "Afternoon",
        "Follow the market streets",
        "Wander Apliu Street, then drift towards Tai Nan Street. Choose a coffee/design stop rather than turning every address into a task.",
      ],
      [
        "Later",
        "Give the studios their own time",
        "If JCCAC has a show or public programme, head north to Shek Kip Mei. Otherwise stay around the market streets and have an unhurried noodle bowl.",
      ],
      [
        "Evening",
        "Dinner, then an optional drink",
        "Lau Sum Kee is a simple local-food finish. BOUND is a separate option on the Prince Edward edge; check the map before setting off.",
      ],
    ],
    leads: [],
    places: [
      point(
        "apliu",
        "Apliu Street market",
        "streets",
        "Apliu Street near Kweilin Street, Sham Shui Po",
        22.329575,
        114.1628038,
        "Electronics, cables, components and second-hand odds and ends make this a good street for browsing and people-watching. Look at the everyday trading as well as the things for sale.",
        "The marker is on the market stretch near Kweilin Street. Stall activity varies; daylight is the useful starting point.",
        [ssp],
      ),
      point(
        "tai-nan",
        "Tai Nan Street",
        "streets",
        "Tai Nan Street around 172–201, Sham Shui Po",
        22.3274,
        114.1631,
        "The creative businesses here sit among older trading streets. Use this stretch to slow down, look into independent shopfronts, and choose a coffee or design stop.",
        "A street segment, rather than a single attraction. Side streets and shop openings will shape the wander.",
        [ssp],
      ),
      point(
        "openground",
        "Openground",
        "art",
        "198 Tai Nan Street, Sham Shui Po",
        22.327302,
        114.1633166,
        "A design platform combining books, coffee and exhibition/workshop space. It is a good match for an afternoon of looking at printed things and small creative businesses.",
        "The address and description come from a July 2022 guide. Check its current listing and programme before making a special trip.",
        [ssp],
        { older: true },
      ),
      point(
        "sausalito",
        "Café Sausalito",
        "coffee",
        "201 Tai Nan Street, Sham Shui Po",
        22.3274707,
        114.1627909,
        "A small independent coffee pause on the Tai Nan Street stretch. Sassy describes single-origin coffee and a community-minded approach; this is a useful place to stop between the market and shop browsing.",
        "Older July 2022 coverage: check today’s opening. Choose this or Openground as your main coffee pause; no need to do both.",
        [ssp],
        { older: true },
      ),
      point(
        "jccac",
        "Jockey Club Creative Arts Centre",
        "art",
        "30 Pak Tin Street, Shek Kip Mei",
        22.334786029619377,
        114.16563178501781,
        "A former factory estate became this nine-storey arts centre in 2008. The courtyard, concrete corridors and surviving industrial machinery give the building as much interest as its public exhibitions.",
        "Check the programme before the detour. Public exhibitions and open-studio events are the reliable visitor opportunities; individual studios are working spaces.",
        [hktb("jockey-club-creative-arts-centre")],
        { operator: "https://www.jccac.org.hk/?lang=en" },
      ),
      food(
        "hop-yik-tai",
        "A small rice-roll lunch makes it easy to leave room for another snack. Use the food-guide card for the order and branch details.",
      ),
      food(
        "kung-wo",
        "A tofu-pudding or soya-milk pause fits around the market walk. Opening and queues can change.",
      ),
      food(
        "lau-sum-kee",
        "A local noodle-shop choice for a later meal. Check the branch and today’s service before committing to a dinner time.",
      ),
      point(
        "bound",
        "BOUND",
        "drinks",
        "32 Boundary Street, Prince Edward",
        22.326437797011412,
        114.16699173823882,
        "An indie café and bar bringing coffee, craft beer, cocktails and local creatives together. The Tourism Board describes an industrial interior and a mix of Chinese and Western influences.",
        "On the Prince Edward edge, outside the core market loop. Check current hours, menu and any music programme; a performance is not assumed.",
        [hktb("bound")],
        { badge: "Prince Edward extension" },
      ),
    ],
  },
  {
    id: "sheung-wan",
    name: "Sheung Wan",
    chinese: "上環",
    number: "02",
    accent: "#58704c",
    short: "Old streets, design shops, noodles and a drink.",
    vibe: "An easy day that turns into an evening",
    intro:
      "Make a loose loop through Cat Street, Square Street and Hollywood Road, with lunch around Gough Street and a coffee or beer when you want a pause. Small galleries and design studios fit naturally between the food stops.",
    context:
      "This guide follows the inland Sheung Wan and Poho streets, with Gough Street and a clearly marked SoHo evening extension. Antiques, temples, design businesses and newer cafés sit close together, but slopes and steps make the area feel much bigger than it looks on the map.",
    time: "Late morning through evening",
    duration: "4–6 hours, with lunch and drinks",
    station: "Sheung Wan MTR",
    lat: 22.2848,
    lng: 114.1505,
    transport:
      "From Eaton, use Jordan MTR to Central on the Tsuen Wan line, then the Island line towards Kennedy Town for Sheung Wan. Walking inland from the station brings you to the Cat Street/Hollywood Road area. Transit links calculate the current route.",
    terrain:
      "Hilly, with steps and narrow pavements. Square Street, Gough Street and PMQ are inland uphill from the waterfront. Use Google walking directions for current crossings.",
    practical:
      "Some antiques stalls open later than cafés; galleries can be between shows. Pick one or two indoor stops and leave room for the streets. The Pontiac is in SoHo/Central, an optional extension rather than a Sheung Wan address.",
    pairing:
      "The noodle shops and dai pai dong keep the food part local. Blue Supreme is the relaxed beer option; The Pontiac adds a louder cocktail finish if you want it. Cocktail spending is separate from the casual-food budget.",
    route: ["lascar", "square-gallery", "kau-kee", "blue-supreme"],
    day: [
      [
        "Late morning",
        "Cat Street and a temple pause",
        "Browse Upper Lascar Row and the western Hollywood Road streets. Drop into Man Mo Temple respectfully if it is receiving visitors.",
      ],
      [
        "Lunch",
        "Keep it local around Gough Street",
        "Choose Kau Kee for beef noodles or Sing Heung Yuen for a casual bowl. They are alternatives, and either can have a queue.",
      ],
      [
        "Afternoon",
        "One gallery, then a slow browse",
        "Try Square Street Gallery if there is a current exhibition; PMQ is another design-focused option. Leave time for shop windows and a coffee pause.",
      ],
      [
        "Evening",
        "A beer, or a cocktail extension",
        "Blue Supreme is the easy craft-beer choice. For cocktails, walk towards The Pontiac in SoHo, or carry on west to the Sai Ying Pun guide.",
      ],
    ],
    leads: [
      {
        name: "Mius",
        note: "The conversation suggested a Gough Street cocktail stop. Check its current address, menu and opening before choosing it.",
        query: "Mius cocktail bar Gough Street Hong Kong",
      },
      {
        name: "BEHIND 69",
        note: "A further cocktail lead from the conversation. Confirm the current Burd Street listing and service details first.",
        query: "BEHIND 69 bar Burd Street Hong Kong",
      },
    ],
    places: [
      point(
        "lascar",
        "Upper Lascar Row / Cat Street",
        "streets",
        "Upper Lascar Row, Sheung Wan",
        22.2848892,
        114.1496663,
        "A compact antiques-and-curios stretch that rewards looking slowly. You will see memorabilia and decorative objects as well as cafés; treat the objects as things to browse, without assuming that every piece is an authenticated antique.",
        "Street-stall activity varies. Combine with the nearby Tung Street and Hollywood Road lanes.",
        [hktb("upper-lascar-row"), cat],
      ),
      point(
        "man-mo",
        "Man Mo Temple",
        "streets",
        "124–126 Hollywood Road, Sheung Wan",
        22.284065,
        114.150235,
        "Dedicated to the gods of literature and war, the temple adds a different rhythm to the Hollywood Road walk. Its incense-filled interior is a working religious space within the busy neighbourhood.",
        "Check admission arrangements, keep voices low and follow photography guidance. An exterior pause also fits the route.",
        [hktb("man-mo-temple")],
      ),
      point(
        "square-gallery",
        "Square Street Gallery",
        "art",
        "21 Square Street, Tai Ping Shan, Sheung Wan",
        22.284252,
        114.149856,
        "An art space and incubator working with early-career creatives and experimental exhibitions. Its smaller scale suits a day built around neighbourhood streets and independent businesses.",
        "Check the current exhibition and visitor hours. A directory entry is not a promise that a show is open today.",
        [hktb("square-street-gallery")],
      ),
      point(
        "gough",
        "Gough Street and its side lanes",
        "streets",
        "Gough Street, Sheung Wan / Central edge",
        22.2842236,
        114.1524177,
        "A useful lunch anchor with small shops and lanes around it. Follow the street towards Mee Lun Street, then let the food queue and your appetite determine the pace.",
        "The food guide labels the Gough Street restaurants Central; this walk crosses that neighbourhood boundary.",
        [poho, cat],
      ),
      point(
        "pmq",
        "PMQ",
        "art",
        "35 Aberdeen Street, Central",
        22.2836283764,
        114.1517342968,
        "The former Police Married Quarters now house creative businesses and design studios. It provides a mix of architecture, independent design and occasional exhibitions within walking distance of the older streets.",
        "An optional Central-edge detour. Individual shops and events keep their own hours; check what is on before planning around an exhibition.",
        [hktb("pmq")],
      ),
      food(
        "kau-kee",
        "A small, busy beef-noodle shop on Gough Street. Choose this or Sing Heung Yuen for lunch rather than making the day a restaurant queue tour.",
      ),
      food(
        "sing-heung-yuen",
        "A casual local-food alternative around the corner from Kau Kee. Plan flexibly around queues and the day’s service.",
      ),
      food(
        "lin-heung",
        "A yum-cha alternative if you want a longer sit-down meal. It is at 160 Wellington Street; allow time for the separate detour.",
      ),
      point(
        "blue-supreme",
        "Blue Supreme",
        "drinks",
        "21 Tung Street, Sheung Wan",
        22.2852514,
        114.1493596,
        "A relaxed stop for craft beer with a substantial bottle/draft selection. It is a useful late-afternoon pause beside the Cat Street wander, especially if you prefer an informal room to a hotel bar.",
        "Beer is the main reason to choose it. Its bistro food is international; the noodle shops in this guide cover the local-food brief. Check today’s menu.",
        [poho, cat],
      ),
      point(
        "pontiac",
        "The Pontiac",
        "drinks",
        "13 Old Bailey Street, Central / SoHo",
        22.281888781710606,
        114.15358905127621,
        "An inclusive, female-led cocktail bar with a grungy dive-bar aesthetic, a jukebox and an energetic atmosphere. It is a characterful option when you want the evening to become livelier.",
        "A SoHo extension, not a quiet listening room. Check current prices and opening; do not assume a published happy-hour promotion is still available.",
        [hktb("the-pontiac")],
        { badge: "SoHo extension", operator: "https://www.thepontiac.com/" },
      ),
      point(
        "halfway",
        "Halfway Coffee",
        "coffee",
        "12 Tung Street, Sheung Wan",
        22.2851,
        114.1493,
        "Coffee served in vintage porcelain suits the antiques-and-design mood of the Cat Street wander. The local guides describe a small space with an eclectic mix of objects and seating.",
        "Use the 12 Tung Street address from the Poho guide and check the current branch listing. The approximate pin covers the immediate Cat Street area; take a little cash.",
        [poho, cat],
        { approximate: true },
      ),
    ],
  },
  {
    id: "sai-ying-pun",
    name: "Sai Ying Pun",
    chinese: "西營盤",
    number: "03",
    accent: "#9c503e",
    short: "Steep streets, everyday food, thoughtful cocktails.",
    vibe: "A neighbourhood day with a good evening built in",
    intro:
      "Start with a lane of murals and an old-school craft shop, find a noodle lunch, and take your time over coffee. High Street, Second Street and Centre Street give the wander its shape; there are several quite different ways to finish with a drink.",
    context:
      "Sai Ying Pun is a lived-in district on a slope: produce shops, small restaurants, stairways and newer cafés overlap. The bars are one part of a day here. First and Second Street are useful places to drift between a meal, a shop and a music or cocktail stop.",
    time: "Afternoon into the evening",
    duration: "4–6 hours, longer with dinner",
    station: "Sai Ying Pun MTR",
    lat: 22.2866,
    lng: 114.1424,
    transport:
      "From Eaton, take the Tsuen Wan line from Jordan to Central, then the Island line towards Kennedy Town to Sai Ying Pun. Choose the exit near your first stop using the transit link; station exits can make a large difference on these slopes.",
    terrain:
      "Steep streets and steps, especially around Centre Street and High Street. The map gives place locations, not a step-free itinerary.",
    practical:
      "Check current opening and booking arrangements for bars. Mostly Harmless may use a particular service/menu format; ask the total price before committing. CODA’s music listings do not guarantee a live performance on your chosen night.",
    pairing:
      "Eng Kee is a straightforward local lunch. Kwan Kee makes a more substantial claypot-rice dinner if the queue and service suit you. Winstons covers coffee, and one of the evening bars is plenty for a satisfying finish.",
    route: ["art-lane", "bamboo", "eng-kee", "ping-pong"],
    day: [
      [
        "Afternoon",
        "Murals and a working craft shop",
        "Begin around Art Lane, then look for Tuck Chong Sum Kee on Western Street. Follow the shop’s lead about browsing and photography.",
      ],
      [
        "Late lunch",
        "Noodles, then a slow uphill wander",
        "Try Eng Kee on High Street and explore Centre Street and the nearby blocks. The streets are steep, so use the café stop as an actual rest.",
      ],
      [
        "Coffee & shops",
        "First Street at your own pace",
        "Winstons is a simple coffee pause. CODA gives you a more music-focused option; check what kind of service or programme is running.",
      ],
      [
        "Dinner & drinks",
        "Choose one good finish",
        "Kwan Kee is the local dinner option. Then pick Mostly Harmless for an ingredient-led cocktail experience, Ping Pong for the striking room, or CODA for a quieter music-led mood.",
      ],
    ],
    leads: [
      {
        name: "West Garden Lane",
        note: "A neighbourhood cocktail lead from your conversation. Current venue details need checking before making it the evening’s anchor.",
        query: "West Garden Lane cocktail bar Sai Ying Pun Hong Kong",
      },
    ],
    places: [
      point(
        "art-lane",
        "Art Lane",
        "art",
        "Chung Ching Street / Ki Ling Lane, Sai Ying Pun",
        22.2874876,
        114.1412315,
        "Murals turn the small lanes near the MTR into an easy first wander. It is a quick outdoor art stop with cafés nearby, rather than an indoor gallery visit.",
        "Murals can change. Keep entrances and residential access clear; the point represents the lane area.",
        [syp],
      ),
      point(
        "centre",
        "Centre Street and Second Street",
        "streets",
        "Centre Street at Second Street, Sai Ying Pun",
        22.2863412,
        114.1422587,
        "The hill gives you long street views and a feel for the neighbourhood’s everyday businesses. Follow the cross streets for food shops, small restaurants and a less hurried look around.",
        "The climb is real. Use crossings and allow extra time for steps; do not rely on the map as a step-free route.",
        [syp],
      ),
      point(
        "bamboo",
        "Tuck Chong Sum Kee Bamboo Steamer Company",
        "art",
        "12 Western Street, Sai Ying Pun",
        22.2874873,
        114.1408954,
        "A family craft business associated with handmade bamboo dim sum steamers and kitchen tools. It connects the afternoon’s design interest to the practical objects used in Cantonese food.",
        "A working shop. Check opening and ask before photographs; demonstrations or workshops are not assumed.",
        [syp],
      ),
      food(
        "eng-kee",
        "A local noodle lunch on High Street. Let its current service and the queue set the timing; this is a meal stop rather than an appointment.",
      ),
      food(
        "kwan-kee-claypot",
        "A local claypot-rice dinner option. Budget time for cooking and queues, and check the current opening and minimum-order arrangements.",
      ),
      point(
        "winstons",
        "Winstons Coffee · Sai Ying Pun",
        "coffee",
        "Shop 4, 213 Queen’s Road West, Sai Ying Pun",
        22.287,
        114.142,
        "A neighbourhood coffee stop that also switches towards drinks later in the day. The Tourism Board lists the Sai Ying Pun branch separately from Kennedy Town, so use the full address when navigating.",
        "Approximate Queen’s Road West pin: use the branch-specific Maps link for the door. Check current coffee/drinks service and hours.",
        [hktb("winstons-coffee"), syp],
        { approximate: true },
      ),
      point(
        "coda",
        "CODA Jazz Kissa",
        "drinks",
        "G/F, 112 First Street, Sai Ying Pun",
        22.2865327,
        114.1422331,
        "A Japanese kissaten-inspired jazz lounge and café with vinyl-lined walls, coffee and drinks. It suits the listening-bar mood in your conversation, especially if you want music to be part of the pause.",
        "Approximate First Street pin. Check the programme, opening, booking and any music-related charge; nightly live music is not assumed.",
        [jazz],
        { operator: "https://codajazzkissa.com", approximate: true },
      ),
      point(
        "mostly",
        "Mostly Harmless",
        "drinks",
        "2/F, 110 Queen’s Road West, Sai Ying Pun / Sheung Wan edge",
        22.2861429,
        114.1461036,
        "A small upstairs cocktail venue that Sassy describes as ingredient-led, locally sourced and personal in its approach. It is a strong candidate when the drink itself is the evening’s main event.",
        "At the eastern edge of this walk. Confirm booking, whether service is à la carte or a set experience, and the total price before committing.",
        [syp],
      ),
      point(
        "ping-pong",
        "Ping Pong 129 Gintoneria",
        "drinks",
        "L/G, Nam Cheong House, 129 Second Street, Sai Ying Pun",
        22.287077379963723,
        114.13978743005802,
        "A former ping-pong hall behind a red door, with high ceilings, neon and a gin-focused drinks list. The room supplies the industrial character; this is the most theatrical finish among the options here.",
        "Check current service and prices. Choose it for the gin and the room; use the local restaurants for your main Chinese/Hong Kong meal.",
        [hktb("ping-pong-gintoneria"), syp],
        { operator: "https://pingpong129.com" },
      ),
    ],
  },
  {
    id: "wong-chuk-hang",
    name: "Wong Chuk Hang",
    chinese: "黃竹坑",
    number: "04",
    accent: "#4a6d73",
    short: "Factory-floor art, a market lunch, coffee upstairs.",
    vibe: "A south-side day with an industrial backdrop",
    intro:
      "Build an afternoon around a local cooked-food-market lunch, a couple of galleries and a coffee or drink upstairs in an industrial building. The interest is spread between floors and blocks, so a little planning gives you a much better day.",
    context:
      "Former industrial buildings now share the area with creative businesses, galleries, offices and newer development. Freight lifts, building directories and working streets are part of the experience. It is dispersed, so pick a few places and allow for lifts, entrances and getting between blocks.",
    time: "Lunch and afternoon; confirm gallery access first",
    duration: "3–5 hours, including lunch and coffee",
    station: "Wong Chuk Hang MTR",
    lat: 22.2483,
    lng: 114.1658,
    transport:
      "From Eaton, take the Tsuen Wan line from Jordan to Admiralty and change to the South Island line for Wong Chuk Hang. To continue to Sai Ying Pun or Sheung Wan later, change at Admiralty for the Island line towards Kennedy Town.",
    terrain:
      "Mostly urban pavements, busy road crossings and lifts into industrial buildings. Heung Yip Road and Wong Chuk Hang Road form a useful short loop; exact building access needs checking.",
    practical:
      "Confirm two galleries have a current show and visitor access before travelling. Tuesday–Saturday is a sensible starting point from published gallery guides, but opening days and appointments vary. No exhibition title, closing date or universal 11–6 schedule from the pasted chat is treated as confirmed.",
    pairing:
      "Start with the cooked-food market for an inexpensive local meal, then choose two galleries and one coffee/drinks pause. Africa Coffee & Tea gives you another reason to enter an industrial building, though its food is international. Staying for dinner depends on current market/café service; Sheung Wan or Sai Ying Pun is an optional continuation.",
    route: ["nam-long", "desarthe", "blindspot", "africa"],
    day: [
      [
        "Lunch",
        "Eat before the lifts and galleries",
        "Start at Nam Long Shan Road Cooked Food Market. Look over the stalls and choose a local rice or noodle meal; the centre also has Thai food, so check the individual menu.",
      ],
      [
        "Early afternoon",
        "Two galleries are enough",
        "Confirm access, then visit DE SARTHE and Blindspot. Give yourself time to find the right building entrance and floor instead of rushing between names.",
      ],
      [
        "Later",
        "Coffee and a view from upstairs",
        "Africa Coffee & Tea is a possible café/bar pause in another industrial building. Its source is older, so verify the venue’s current floor and service first.",
      ],
      [
        "Evening",
        "Keep the next step flexible",
        "If the market or café is serving a meal you fancy, stay. Otherwise the MTR makes it straightforward to continue west for the Sheung Wan or Sai Ying Pun food-and-drinks guides.",
      ],
    ],
    leads: [
      {
        name: "PODIUM",
        note: "An additional gallery lead from the conversation. Confirm its current address, exhibition and visitor access before adding it.",
        query: "PODIUM gallery Wong Chuk Hang Hong Kong",
      },
      {
        name: "SC Gallery",
        note: "Another gallery mentioned in the conversation. Check the current venue listing and programme before making a trip.",
        query: "SC Gallery Wong Chuk Hang Hong Kong",
      },
    ],
    places: [
      point(
        "nam-long",
        "Nam Long Shan Road Cooked Food Market",
        "food",
        "1 Nam Long Shan Road, Wong Chuk Hang",
        22.2474123,
        114.1663091,
        "A two-storey cooked-food centre and a practical local-meal anchor near the station. Sassy describes affordable stalls and a mix that includes Thai eateries; look for the Chinese/Hong Kong dishes that suit your appetite.",
        "The guide is from February 2024. Individual stalls keep their own hours and menus. Check prices on site; no particular stall or evening service is guaranteed.",
        [wch],
        { older: true },
      ),
      point(
        "desarthe",
        "DE SARTHE",
        "art",
        "2/F, Block A, Vita Tower, 29 Wong Chuk Hang Road",
        22.2486653511,
        114.1682374382,
        "A spacious contemporary-art gallery with a high-ceilinged setting and a programme spanning painting, installation and experimental work from Asia and beyond.",
        "Use the Tourism Board’s Vita Tower address as the planning reference. Older guides list 21 Wong Chuk Hang Road; confirm the address and current visitor access with the gallery before travelling.",
        [hktb("de-sarthe-gallery")],
        { operator: "https://www.desarthe.com/" },
      ),
      point(
        "blindspot",
        "Blindspot Gallery",
        "art",
        "15/F, Po Chai Industrial Building, 28 Wong Chuk Hang Road",
        22.247985825443582,
        114.16489375241882,
        "A contemporary gallery with roots in photography and image-based art, now also showing video, installation and other media. It is a good place to give a single exhibition time and attention.",
        "Confirm the current exhibition, access and whether an appointment is needed. The conversation’s “Soft Borders, through 7 November” claim has not been independently verified and is not used as a current listing.",
        [hktb("blindspot-gallery")],
        { operator: "https://blindspotgallery.com/" },
      ),
      point(
        "heung-yip",
        "Heung Yip Road and the industrial blocks",
        "streets",
        "Heung Yip Road, Wong Chuk Hang",
        22.2480473,
        114.1670662,
        "The connecting streets make the industrial setting legible: building directories, workshops and businesses sharing blocks with newer creative uses. Walk between your confirmed stops and look up as well as into ground-floor shopfronts.",
        "An area pin, not an attraction or a public-building access pass. Use marked crossings and check building visitor instructions.",
        [wch],
        { badge: "Area pin" },
      ),
      point(
        "africa",
        "Africa Coffee & Tea",
        "coffee",
        "Suite 1501, 15/F, 41 Heung Yip Road, Wong Chuk Hang",
        22.247788,
        114.162773,
        "A café/bar described in the neighbourhood guide as a 15th-floor space, with a ground-floor kiosk as another option. It gives the day a proper coffee pause and a possible drinks stop in the same industrial setting.",
        "February 2024 coverage: confirm the current floor, opening and whether the bar is serving. Coffee, drinks and international food are options; the cooked-food market is the local-food anchor.",
        [wch],
        {
          older: true,
          also: ["drinks"],
          operator: "https://www.africacoffeeandtea.com",
          badge: "Coffee & drinks",
        },
      ),
    ],
  },
];
for (const area of neighbourhoods) {
  area.places.forEach((place, index) => (place.number = index + 1));
  area.sources = [
    ...new Map(
      area.places.flatMap((p) => p.sources).map((s) => [s.url, s]),
    ).values(),
  ];
}
export const byNeighbourhood = Object.fromEntries(
  neighbourhoods.map((n) => [n.id, n]),
);
