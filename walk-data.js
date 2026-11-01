// Based on the user-provided itinerary; original numbering is preserved.
import { hotel as walkHotel } from "./data.js";
export { walkHotel };

export const walkMeta = {
  checkedOn: "2026-11-01",
  title: "Walk Kowloon",
  origin:
    "Photographed Lonely Planet Walk Kowloon, page 127; edition/date not visible",
  originalStopCount: 10,
  extraStopCount: 6,
};

export const walkStops = [
  {
    id: "art",
    number: 1,
    name: "Hong Kong Museum of Art",
    chinese: "香港藝術館",
    address: "10 Salisbury Road, Tsim Sha Tsui",
    tag: "Art & harbour views",
    lat: 22.29361480517811,
    lng: 114.17213508192181,
    background:
      "Hong Kong’s first public art museum began at City Hall in 1962, moved to the Tsim Sha Tsui waterfront in 1991 and reopened after a major 2015–19 renovation. It is a good place to begin with the city’s own cultural perspective, rather than treating the harbour as only a skyline photograph.\n\nThe collections bring together Chinese antiquities, painting and calligraphy, China trade art and modern Hong Kong art. The building’s harbour-facing windows also make the setting part of the visit.",
    lookFor: [
      "Choose a Chinese painting/calligraphy or Hong Kong art display, rather than trying to see everything.",
      "Look for the contrast between historic objects and the harbour outside.",
    ],
    practical:
      "Check the museum’s opening day and exhibition arrangements. Sassy describes the permanent displays as free; special exhibitions may have separate ticket conditions. An exterior harbourfront start still works if the galleries are closed.",
    allow: "45–90 minutes",
    sources: [
      {
        name: "Hong Kong Museum of Art",
        publisher: "Hong Kong Tourism Board",
        url: "https://www.discoverhongkong.com/eng/place-to-go/travel.guide-hong-kong-museum-of-art.html",
        accessed: "2026-11-01",
      },
      {
        publisher: "Sassy Hong Kong",
        name: "Tsim Sha Tsui neighbourhood guide",
        url: "https://www.sassyhongkong.com/whats-on-hk-tsim-sha-tsui-neighbourhood-guide-eat-drink-shop/",
        accessed: "2026-11-01",
      },
    ],
  },
  {
    id: "park",
    number: 2,
    name: "Kowloon Park",
    chinese: "九龍公園",
    address: "Kowloon Park, Tsim Sha Tsui",
    tag: "A garden in the city",
    lat: 22.300452557625945,
    lng: 114.17080936214721,
    background:
      "This large green space interrupts the dense streets of Tsim Sha Tsui with banyan shade, water, birds and garden paths. Its setting has another layer: surviving Whitfield Barracks buildings now house the Heritage Discovery Centre, an optional stop inside the park.\n\nThe park is a pause in the walk, not simply a shortcut. A short wander through the Chinese Garden, Banyan Court and sculpture areas makes a useful contrast with Nathan Road outside.",
    lookFor: [
      "Banyan roots, shaded paths and the Chinese Garden.",
      "Bird areas and the sculpture walk, if open on your visit.",
    ],
    practical:
      "There are entrances on Nathan Road and Haiphong Road. The pin represents the gardens rather than a guaranteed entrance or a single prescribed path. Detour D is nearby; detour C is on Nathan Road.",
    allow: "20–40 minutes",
    sources: [
      {
        name: "Kowloon Park",
        publisher: "Hong Kong Tourism Board",
        url: "https://www.discoverhongkong.com/eng/place-to-go/travel.guide-kowloon-park.html",
        accessed: "2026-11-01",
      },
      {
        name: "Hong Kong Heritage Discovery Centre",
        publisher: "Hong Kong Tourism Board",
        url: "https://www.discoverhongkong.com/eng/place-to-go/travel.guide-the-hong-kong-heritage-discovery-centre.html",
        accessed: "2026-11-01",
      },
      {
        publisher: "Sassy Hong Kong",
        name: "Tsim Sha Tsui neighbourhood guide",
        url: "https://www.sassyhongkong.com/whats-on-hk-tsim-sha-tsui-neighbourhood-guide-eat-drink-shop/",
        accessed: "2026-11-01",
      },
    ],
  },
  {
    id: "waffles",
    number: 3,
    name: "Lee Keung Kee North Point Egg Waffles",
    chinese: "利強記北角雞蛋仔",
    address: "G/F, Kun Lock Building, 178 Nathan Road, Tsim Sha Tsui",
    tag: "The book’s waffle stop",
    lat: 22.302758057105116,
    lng: 114.17194694280624,
    background:
      "Egg waffles — gai daan jai — are an everyday Hong Kong street snack: a connected sheet of puffed little egg-shaped bubbles, with a crisp outside and a soft middle. This is the snack stop named in your photograph.\n\n“North Point” belongs to the business’s name. The branch for this Kowloon walk is at 178 Nathan Road in Tsim Sha Tsui; it does not require a trip to North Point on Hong Kong Island.",
    lookFor: [
      "The LKK/利強記 sign and the Nathan Road branch address.",
      "The balance of crisp edges and a soft centre while the waffle is still warm.",
    ],
    practical:
      "The exact Tsim Sha Tsui branch is listed on OpenRice. Check current opening before heading there for a special stop; business listings do not guarantee today’s service.",
    allow: "10–15 minutes",
    sources: [
      {
        publisher: "Sassy Hong Kong",
        name: "The Best Egg Waffles in Hong Kong",
        url: "https://www.sassyhongkong.com/egg-waffle-hong-kong-eat-drink/",
        accessed: "2026-11-01",
      },
      {
        publisher: "OpenRice",
        name: "Lee Keung Kee — 178 Nathan Road branch",
        url: "https://www.openrice.com/en/hongkong/r-%E5%88%A9%E5%BC%B7%E8%A8%98%E5%8C%97%E8%A7%92%E9%9B%9E%E8%9B%8B%E4%BB%94-tsim-sha-tsui-hong-kong-style-r13622",
        accessed: "2026-11-01",
      },
    ],
  },
  {
    id: "mak",
    number: 4,
    name: "Mak Man Kee Noodle Shop",
    chinese: "麥文記麵家",
    address: "51 Parkes Street, Jordan",
    tag: "Wontons for lunch",
    lat: 22.3046799,
    lng: 114.1705644,
    background:
      "A small, no-frills noodle shop makes a fitting lunch stop in Jordan. Michelin highlights Mak Man Kee’s prawn wontons, thin wrappers and springy duck-egg noodles in a savoury broth. This is a glimpse of everyday Cantonese noodle-shop culture, with compact tables and an efficient rhythm.\n\nSoup noodles are the classic introduction. Tossed noodles with shrimp roe offer a different, more concentrated flavour if you want to compare bowls.",
    lookFor: [
      "Prawn wontons and the texture of the egg noodles.",
      "The shrimp-roe tossed-noodle option if you would rather skip broth.",
    ],
    practical:
      "Expect a small room and shared seating when busy. This is Mak Man Kee on Parkes Street, not Mak’s Noodle in Central. It is also included in your food guide.",
    allow: "25–40 minutes",
    sources: [
      {
        publisher: "MICHELIN Guide",
        name: "Mak Man Kee — Parkes Street",
        url: "https://guide.michelin.com/hk/en/hong-kong-region/hong-kong/restaurant/mak-man-kee",
        accessed: "2026-10-31",
      },
    ],
  },
  {
    id: "jade",
    number: 5,
    name: "Jade Market",
    chinese: "玉器市場",
    address: "Jade Market / Jade Street, 251 Shanghai Street, Yau Ma Tei",
    tag: "Craft, colour & browsing",
    lat: 22.30924627528399,
    lng: 114.16995321625451,
    background:
      "The covered market and neighbouring jade shops form one of Yau Ma Tei’s characteristic trading areas. Stalls sell pendants, bangles, charms and ornaments, alongside other stones and souvenir jewellery. Browsing is worthwhile even without buying: look at how small objects are shaped, displayed and discussed.\n\nThe market belongs to the neighbourhood’s daytime commercial life. It should not be confused with the evening street stalls of Temple Street.",
    lookFor: [
      "Different forms of bangles, pendants and carved charms.",
      "The contrast between covered stalls and permanent jade shops nearby.",
    ],
    practical:
      "The marker uses the Tourism Board’s Yau Ma Tei listing, not the similarly named jade market in Sham Shui Po. If buying, ask about the material and treatment rather than assuming that a low price establishes quality.",
    allow: "20–30 minutes",
    sources: [
      {
        name: "Jade Market and Jade Street",
        publisher: "Hong Kong Tourism Board",
        url: "https://www.discoverhongkong.com/eng/place-to-go/travel.guide-jade-market-and-jade-street.html",
        accessed: "2026-11-01",
      },
      {
        publisher: "Sassy Hong Kong",
        name: "Jordan & Yau Ma Tei neighbourhood guide",
        url: "https://www.sassyhongkong.com/jordan-yau-ma-tei-neighbourhood-guide/",
        accessed: "2026-11-01",
      },
    ],
  },
  {
    id: "temple",
    number: 6,
    name: "Tin Hau Temple, Yau Ma Tei",
    chinese: "油麻地天后廟",
    address: "56–58 Temple Street, Yau Ma Tei",
    tag: "A reminder of the old shore",
    lat: 22.30995704123432,
    lng: 114.17054513561747,
    background:
      "Tin Hau is the goddess of the sea, traditionally important to fishermen and boat-dwelling communities. That makes this temple especially revealing: the busy inland streets around it were once much closer to the waterfront, before reclamation changed the geography.\n\nThe Tourism Board traces the temple’s beginnings to the 1860s and its move to this site to 1878. The surrounding temple complex and public space give the market district a religious and social centre; Temple Street takes its name from it.",
    lookFor: [
      "The roof decoration, entrance details and the relationship between the temple and its courtyard.",
      "Everyday worship, rather than only the building as a photo stop.",
    ],
    practical:
      "This is a living religious site. Keep out of worshippers’ way and follow posted guidance on entry and photography. Do not assume temple interiors share the hours of nearby shops.",
    allow: "15–25 minutes",
    sources: [
      {
        name: "Tin Hau Temple, Yau Ma Tei",
        publisher: "Hong Kong Tourism Board",
        url: "https://www.discoverhongkong.com/eng/place-to-go/travel.guide-tin-hau-temple-at-yau-ma-tei.html",
        accessed: "2026-11-01",
      },
      {
        publisher: "Sassy Hong Kong",
        name: "Jordan & Yau Ma Tei neighbourhood guide",
        url: "https://www.sassyhongkong.com/jordan-yau-ma-tei-neighbourhood-guide/",
        accessed: "2026-11-01",
      },
    ],
  },
  {
    id: "fruit",
    number: 7,
    name: "Yau Ma Tei Wholesale Fruit Market",
    chinese: "油麻地果欄",
    address: "202 Reclamation Street, near Waterloo Road, Yau Ma Tei",
    tag: "Working market & old warehouses",
    lat: 22.312292510396553,
    lng: 114.16861161977887,
    background:
      "Known as Gwo Laan, the wholesale fruit market is part of the city’s food-distribution machinery, not just a visitor market. Its low-rise stone buildings and traders’ gable inscriptions preserve a very different scale of Kowloon; the Tourism Board describes surviving pre-war buildings dating from 1913.\n\nThe place also has a screen life, appearing in Hong Kong films. By day, the architecture and surrounding lanes can be as interesting as the produce itself.",
    lookFor: [
      "Old gables, traders’ names and the low-rise market buildings.",
      "The working edges of the market, viewed without blocking deliveries.",
    ],
    practical:
      "Most wholesale action is overnight or very early. An afternoon visit on this route is not a promise of busy auctions or haggling. Stay on public routes and clear of loading traffic. The marker is the wholesale complex, not a fruit shop farther south.",
    allow: "15–25 minutes",
    sources: [
      {
        name: "Yau Ma Tei Fruit Market",
        publisher: "Hong Kong Tourism Board",
        url: "https://www.discoverhongkong.com/eng/place-to-go/travel.guide-yau-ma-tei-fruit-market.html",
        accessed: "2026-11-01",
      },
    ],
  },
  {
    id: "shanghai",
    number: 8,
    mapsQuery: "316 Shanghai Street, Yau Ma Tei, Hong Kong",
    name: "Shanghai Street kitchenware stretch",
    chinese: "上海街廚具街",
    address: "Shanghai Street, roughly nos. 284–345, Yau Ma Tei",
    tag: "Tools behind the food",
    lat: 22.3115136,
    lng: 114.1698245,
    background:
      "This section of Shanghai Street shows the practical side of Hong Kong’s food culture: steamers, chopping boards, knives, tableware and other tools used by homes and professional kitchens. Sassy’s street guide identifies longstanding suppliers including Ming Sang, Chan Chi Kee and Man Kee around this Yau Ma Tei stretch.\n\nThe street’s story is also one of changing shoreline and trade. It was formerly called Station Street and was renamed Shanghai Street in 1909, reflecting the city’s commercial connections.",
    lookFor: [
      "Bamboo steamers, chopping boards, moulds and kitchen tools in shopfronts.",
      "Traditional signs and the everyday trade rather than only souvenir purchases.",
    ],
    practical:
      "Shanghai Street is long. This point represents the kitchenware section near 316–318 Shanghai Street; the 618 Shanghai Street redevelopment is farther north in Mong Kok. Shop access and individual opening hours vary.",
    allow: "20–40 minutes",
    sources: [
      {
        publisher: "Sassy Hong Kong",
        name: "The Best of Shanghai Street: Kitchenware, 618 Shopping & More",
        url: "https://www.sassyhongkong.com/shanghai-street-kitchenware-618-neighbourhood-guide/",
        accessed: "2026-11-01",
      },
    ],
  },
  {
    id: "ferry",
    number: 9,
    name: "Tsim Sha Tsui Star Ferry Pier",
    chinese: "尖沙咀天星碼頭",
    address: "Star Ferry Pier, Salisbury Road, Tsim Sha Tsui",
    tag: "The book’s harbour crossing",
    lat: 22.2935413,
    lng: 114.167987,
    background:
      "The green-and-white ferry is both working public transport and one of the city’s most memorable ways to read its geography. The short crossing lets the towers recede into a whole skyline, then brings the other shore into view.\n\nYour photographed itinerary suggests sailing around sunset and returning before the evening lights. A Tsim Sha Tsui–Central return trip is a straightforward interpretation: Central’s Star Ferry service uses Pier 7. This is separate from sightseeing cruises sold around the harbour.",
    lookFor: [
      "The change in skyline as each shore falls away.",
      "The Clock Tower and old railway/ferry relationship beside the Tsim Sha Tsui pier.",
    ],
    practical:
      "Allow time for two crossings, queues and boarding if making the return excursion. Check the operator’s current timetable, fare and weather notices. Use the ferry toggle to show the schematic harbour line; it is not a sailing track.",
    allow: "Allow roughly 30–45 minutes for a return outing; longer if busy",
    sources: [
      {
        name: "Star Ferry Pier",
        publisher: "Hong Kong Tourism Board",
        url: "https://www.discoverhongkong.com/eng/place-to-go/travel.guide-star-ferry-pier.html",
        accessed: "2026-11-01",
      },
    ],
  },
  {
    id: "stars",
    number: 10,
    name: "Avenue of Stars",
    chinese: "星光大道",
    address: "Avenue of Stars, Tsim Sha Tsui Promenade",
    tag: "Film stories & the night skyline",
    lat: 22.293042360222405,
    lng: 114.17413375397369,
    background:
      "The waterfront promenade celebrates Hong Kong’s screen industry through handprints, plaques and statues, including Bruce Lee and Anita Mui along the avenue. It is a reminder that the city has exported stories and screen personalities as well as goods.\n\nThe harbour is the other star. Stay for the changing light, or time the finish around the published usual 8pm start of A Symphony of Lights. The show and a simple evening skyline walk are different experiences; either can be a satisfying end to the day.",
    lookFor: [
      "Film-industry handprints and the statues along the promenade.",
      "The skyline changing from dusk to evening, with space to pause rather than rush.",
    ],
    practical:
      "The pin marks a representative western section of the avenue, not every statue. Check show announcements: weather and special arrangements can cancel or change the usual performance. Leave extra time if continuing farther east along the promenade.",
    allow: "30–45 minutes, plus any wait for the show",
    sources: [
      {
        name: "Avenue of Stars",
        publisher: "Hong Kong Tourism Board",
        url: "https://www.discoverhongkong.com/eng/place-to-go/travel.guide-avenue-of-stars.html",
        accessed: "2026-11-01",
      },
      {
        name: "A Symphony of Lights",
        publisher: "Hong Kong Tourism Board",
        url: "https://www.discoverhongkong.com/eng/place-to-go/travel.guide-a-symphony-of-lights.html",
        accessed: "2026-11-01",
      },
      {
        publisher: "Sassy Hong Kong",
        name: "Tsim Sha Tsui neighbourhood guide",
        url: "https://www.sassyhongkong.com/whats-on-hk-tsim-sha-tsui-neighbourhood-guide-eat-drink-shop/",
        accessed: "2026-11-01",
      },
    ],
  },
];

export const walkExtras = [
  {
    id: "clock",
    label: "A",
    name: "Clock Tower",
    chinese: "前九廣鐵路鐘樓",
    address: "Clock Tower, Salisbury Road, Tsim Sha Tsui",
    tag: "Railway memory",
    near: 9,
    lat: 22.29357707197745,
    lng: 114.169548762395,
    background:
      "This 44-metre red-brick and granite tower was erected in 1915 as part of the Kowloon–Canton Railway terminus. The station has gone, but the tower remains as a declared monument. It recalls the era when travellers arrived by rail at this waterfront and continued across the harbour by ferry.\n\nIt is a small detour that changes how the whole harbourfront reads: today’s cultural and shopping district was once a transport gateway.",
    lookFor: [
      "Brick, granite and the scale of the surviving tower.",
      "The relationship between the former railway terminus and the nearby ferry.",
    ],
    practical:
      "An exterior landmark stop beside the ferry and Cultural Centre; do not assume there is a public climb or viewing platform.",
    allow: "10–15 minutes",
    sources: [
      {
        name: "Clock Tower",
        publisher: "Hong Kong Tourism Board",
        url: "https://www.discoverhongkong.com/eng/place-to-go/travel.guide-clock-tower.html",
        accessed: "2026-11-01",
      },
    ],
  },
  {
    id: "1881",
    label: "B",
    name: "1881 Heritage",
    chinese: "前水警總部",
    address: "2A Canton Road, Tsim Sha Tsui",
    tag: "Former Marine Police headquarters",
    near: 9,
    lat: 22.295532640146288,
    lng: 114.16996312474512,
    background:
      "Despite its present retail-and-dining identity, this complex was the Marine Police headquarters from 1884 until 1996. Preserved buildings and historical features reveal a very different waterfront function: policing a busy port and its shipping traffic.\n\nThe architectural detour is worthwhile in its own right, even if you are not here to shop. Look at the raised site, old buildings and relationship to Canton Road below.",
    lookFor: [
      "The former headquarters buildings and their elevated setting.",
      "Preserved heritage features among the modern commercial uses.",
    ],
    practical:
      "Public circulation and access to individual rooms can differ. Treat it as a short architecture walk, with any guided-tour or indoor access checked separately.",
    allow: "15–25 minutes",
    sources: [
      {
        name: "1881 Heritage",
        publisher: "Hong Kong Tourism Board",
        url: "https://www.discoverhongkong.com/eng/place-to-go/travel.guide-1881-heritage.html",
        accessed: "2026-11-01",
      },
    ],
  },
  {
    id: "mosque",
    label: "C",
    name: "Kowloon Mosque & Islamic Centre",
    chinese: "九龍清真寺",
    address: "105 Nathan Road, Tsim Sha Tsui",
    tag: "Another layer of Kowloon",
    near: 2,
    lat: 22.29887713026478,
    lng: 114.17178386831618,
    background:
      "The mosque adds an important chapter to the park’s former garrison setting. The Tourism Board’s Muslim-travel listing traces the community’s first Kowloon mosque to 1896, following worship arrangements within Whitfield Barracks; the present replacement was completed in 1984.\n\nIts dome, minarets and pale exterior stand out against the commercial density of Nathan Road. It remains a working centre of worship, rather than a museum.",
    lookFor: [
      "The dome and minarets from the Nathan Road pavement.",
      "The proximity of the mosque to the former barracks and present park.",
    ],
    practical:
      "An exterior look is enough to appreciate the site. Enter only when visitors are welcomed, follow posted guidance and avoid interrupting prayers.",
    allow: "10–15 minutes outside",
    sources: [
      {
        publisher: "Hong Kong Tourism Board",
        name: "Muslim Travel — Kowloon Masjid listing",
        url: "https://www.discoverhongkong.com/eng/themed-travel/muslim-travel.html",
        accessed: "2026-11-01",
      },
    ],
  },
  {
    id: "discovery",
    label: "D",
    name: "Hong Kong Heritage Discovery Centre",
    chinese: "香港文物探知館",
    address: "Kowloon Park, Haiphong Road, Tsim Sha Tsui",
    tag: "Archaeology in old barracks",
    near: 2,
    lat: 22.299479903140053,
    lng: 114.16989241125222,
    background:
      "Inside surviving Whitfield Barracks buildings, this centre explores Hong Kong’s archaeological and built heritage. The setting makes the subject tangible: the place displaying the city’s past is itself part of that past.\n\nArtefacts such as pottery and stone tools invite a longer view than the skyline’s recent construction. It is a useful counterpoint to the Museum of Art if you enjoy history and the changing shape of the city.",
    lookFor: [
      "The reused barracks buildings as well as the displays.",
      "Archaeological objects that reveal everyday life before modern Hong Kong.",
    ],
    practical:
      "Check the centre’s current opening and exhibition arrangements. This is optional and inside the park; it is not another mandatory museum visit.",
    allow: "20–40 minutes",
    sources: [
      {
        name: "Hong Kong Heritage Discovery Centre",
        publisher: "Hong Kong Tourism Board",
        url: "https://www.discoverhongkong.com/eng/place-to-go/travel.guide-the-hong-kong-heritage-discovery-centre.html",
        accessed: "2026-11-01",
      },
    ],
  },
  {
    id: "theatre",
    label: "E",
    name: "Yau Ma Tei Theatre & Red Brick Building",
    chinese: "油麻地戲院及紅磚屋",
    address: "6–8 Waterloo Road, Yau Ma Tei",
    tag: "Exterior heritage detour",
    near: 7,
    lat: 22.312521235045885,
    lng: 114.16919320940283,
    background:
      "Two neighbouring buildings tell different stories. The theatre began as a cinema in 1930 and was later adapted for Cantonese opera. Nearby, the 1895 Red Brick Building survives from the old pumping station’s engineer’s office, with brickwork, arches and granite detailing.\n\nTogether they show that the neighbourhood’s history is not only about markets: entertainment and urban infrastructure were part of the same streets.",
    lookFor: [
      "The theatre’s surviving facade and roof forms.",
      "The Red Brick Building’s arches, brick and granite details.",
    ],
    practical:
      "Exterior only in this guide. The Tourism Board page currently carries a theatre closure/construction notice. Do not plan a performance or assume entry from this itinerary.",
    allow: "10–20 minutes outside",
    sources: [
      {
        name: "Yau Ma Tei Theatre",
        publisher: "Hong Kong Tourism Board",
        url: "https://www.discoverhongkong.com/eng/place-to-go/travel.guide-yau-ma-tei-theatre.html",
        accessed: "2026-11-01",
      },
      {
        publisher: "Sassy Hong Kong",
        name: "The Best of Shanghai Street: Kitchenware, 618 Shopping & More",
        url: "https://www.sassyhongkong.com/shanghai-street-kitchenware-618-neighbourhood-guide/",
        accessed: "2026-11-01",
      },
    ],
  },
  {
    id: "night-market",
    label: "F",
    name: "Temple Street after dark",
    chinese: "廟街夜市",
    address: "Temple Street, Jordan / Yau Ma Tei",
    tag: "An optional evening return",
    near: 6,
    lat: 22.306540154576837,
    lng: 114.16997631740077,
    background:
      "The daytime temple-and-market streets change character after sunset, with illuminated signs, food stalls and souvenir browsing. This is a different experience from the covered Jade Market earlier in the walk.\n\nTemple Street’s screen appearances and musical or fortune-telling traditions are part of its popular image, but the simple pleasure is a slow evening wander among ordinary stalls and snacks.",
    lookFor: [
      "Street signs, the archway and food stalls after dark.",
      "The contrast with the same neighbourhood seen during the daytime loop.",
    ],
    practical:
      "Sassy says many stalls open from around 6pm and the area gets livelier later. It is an easy separate outing from Eaton, or a return after the harbour; allow travel time if also aiming for the 8pm lights.",
    allow: "30–60 minutes, optional evening",
    sources: [
      {
        name: "Temple Street Night Market",
        publisher: "Hong Kong Tourism Board",
        url: "https://www.discoverhongkong.com/eng/place-to-go/travel.guide-temple-street-night-market.html",
        accessed: "2026-11-01",
      },
      {
        publisher: "Sassy Hong Kong",
        name: "Jordan & Yau Ma Tei neighbourhood guide",
        url: "https://www.sassyhongkong.com/jordan-yau-ma-tei-neighbourhood-guide/",
        accessed: "2026-11-01",
      },
    ],
  },
];

export const walkLegs = [
  {
    fromId: "art",
    toId: "park",
    via: "Salisbury Road → Nathan Road → Haiphong Road / park paths",
    points: [
      [22.29361480517811, 114.17213508192181],
      [22.29425, 114.1723],
      [22.2988, 114.17215],
      [22.29905, 114.1714],
      [22.300452557625945, 114.17080936214721],
    ],
  },
  {
    fromId: "park",
    toId: "waffles",
    via: "Park paths → Nathan Road",
    points: [
      [22.300452557625945, 114.17080936214721],
      [22.3015, 114.17105],
      [22.30265, 114.1716],
      [22.302758057105116, 114.17194694280624],
    ],
  },
  {
    fromId: "waffles",
    toId: "mak",
    via: "Nathan Road → Austin Road → Parkes Street",
    points: [
      [22.302758057105116, 114.17194694280624],
      [22.30361, 114.1718],
      [22.30364, 114.1706],
      [22.3046799, 114.1705644],
    ],
  },
  {
    fromId: "mak",
    toId: "jade",
    via: "Parkes Street → Ning Po Street → Temple / Kansu Street",
    points: [
      [22.3046799, 114.1705644],
      [22.3061, 114.1706],
      [22.3061, 114.1701],
      [22.30915, 114.17025],
      [22.30924627528399, 114.16995321625451],
    ],
  },
  {
    fromId: "jade",
    toId: "temple",
    via: "Kansu / Temple Street → temple forecourt",
    points: [
      [22.30924627528399, 114.16995321625451],
      [22.30945, 114.17045],
      [22.30995704123432, 114.17054513561747],
    ],
  },
  {
    fromId: "temple",
    toId: "fruit",
    via: "Shanghai Street → Waterloo Road / Reclamation Street",
    points: [
      [22.30995704123432, 114.17054513561747],
      [22.31045, 114.17035],
      [22.31251, 114.16985],
      [22.31256, 114.1687],
      [22.312292510396553, 114.16861161977887],
    ],
  },
  {
    fromId: "fruit",
    toId: "shanghai",
    via: "Market edge → Waterloo Road / Shanghai Street",
    points: [
      [22.312292510396553, 114.16861161977887],
      [22.31255, 114.16875],
      [22.31254, 114.16972],
      [22.3115136, 114.1698245],
    ],
  },
  {
    fromId: "shanghai",
    toId: "ferry",
    via: "Shanghai / Kansu Street → Canton Road → Salisbury Road",
    points: [
      [22.3115136, 114.1698245],
      [22.30955, 114.17015],
      [22.30955, 114.16725],
      [22.3041, 114.16765],
      [22.30355, 114.1677],
      [22.2989, 114.1684],
      [22.294, 114.16915],
      [22.29385, 114.16815],
      [22.2935413, 114.167987],
    ],
  },
  {
    fromId: "ferry",
    toId: "stars",
    via: "Waterfront past the Clock Tower and Cultural Centre",
    points: [
      [22.2935413, 114.167987],
      [22.2933, 114.16955],
      [22.29285, 114.1715],
      [22.29284, 114.1731],
      [22.293042360222405, 114.17413375397369],
    ],
  },
];

export const walkSections = [
  {
    label: "1–4 · Harbour to Jordan",
    ids: ["art", "park", "waffles", "mak"],
  },
  {
    label: "4–8 · Markets & temple",
    ids: ["mak", "jade", "temple", "fruit", "shanghai"],
  },
  {
    label: "8–10 · Back to the harbour",
    ids: ["shanghai", "ferry", "stars"],
  },
];

export const ferryEndpoint = {
  id: "central-ferry",
  name: "Central Star Ferry Pier (Pier 7)",
  address: "Central Pier 7, Man Kwong Street, Central",
  lat: 22.2870418,
  lng: 114.1611903,
  description:
    "Optional return harbour excursion from stop 9. The line is schematic, not an exact sailing track.",
  sources: [
    {
      name: "Star Ferry Pier",
      publisher: "Hong Kong Tourism Board",
      url: "https://www.discoverhongkong.com/eng/place-to-go/travel.guide-star-ferry-pier.html",
      accessed: "2026-11-01",
    },
  ],
};

export const walkSourceCards = [
  {
    name: "Hong Kong Museum of Art",
    publisher: "Hong Kong Tourism Board",
    url: "https://www.discoverhongkong.com/eng/place-to-go/travel.guide-hong-kong-museum-of-art.html",
    accessed: "2026-11-01",
  },
  {
    name: "Kowloon Park",
    publisher: "Hong Kong Tourism Board",
    url: "https://www.discoverhongkong.com/eng/place-to-go/travel.guide-kowloon-park.html",
    accessed: "2026-11-01",
  },
  {
    name: "Jade Market and Jade Street",
    publisher: "Hong Kong Tourism Board",
    url: "https://www.discoverhongkong.com/eng/place-to-go/travel.guide-jade-market-and-jade-street.html",
    accessed: "2026-11-01",
  },
  {
    name: "Tin Hau Temple, Yau Ma Tei",
    publisher: "Hong Kong Tourism Board",
    url: "https://www.discoverhongkong.com/eng/place-to-go/travel.guide-tin-hau-temple-at-yau-ma-tei.html",
    accessed: "2026-11-01",
  },
  {
    name: "Yau Ma Tei Fruit Market",
    publisher: "Hong Kong Tourism Board",
    url: "https://www.discoverhongkong.com/eng/place-to-go/travel.guide-yau-ma-tei-fruit-market.html",
    accessed: "2026-11-01",
  },
  {
    name: "Avenue of Stars",
    publisher: "Hong Kong Tourism Board",
    url: "https://www.discoverhongkong.com/eng/place-to-go/travel.guide-avenue-of-stars.html",
    accessed: "2026-11-01",
  },
  {
    name: "Star Ferry Pier",
    publisher: "Hong Kong Tourism Board",
    url: "https://www.discoverhongkong.com/eng/place-to-go/travel.guide-star-ferry-pier.html",
    accessed: "2026-11-01",
  },
  {
    publisher: "Sassy Hong Kong",
    name: "The Best of Shanghai Street: Kitchenware, 618 Shopping & More",
    url: "https://www.sassyhongkong.com/shanghai-street-kitchenware-618-neighbourhood-guide/",
    accessed: "2026-11-01",
  },
  {
    name: "Yau Ma Tei Theatre",
    publisher: "Hong Kong Tourism Board",
    url: "https://www.discoverhongkong.com/eng/place-to-go/travel.guide-yau-ma-tei-theatre.html",
    accessed: "2026-11-01",
  },
  {
    publisher: "Hong Kong Tourism Board",
    name: "Muslim Travel — Kowloon Masjid listing",
    url: "https://www.discoverhongkong.com/eng/themed-travel/muslim-travel.html",
    accessed: "2026-11-01",
  },
];
