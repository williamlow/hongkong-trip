import { hotel } from "./data.js";
export { hotel };
export const outdoorsCheckedOn = "2026-11-03";
const tourism = (slug, title) => ({
  publisher: "Hong Kong Tourism Board",
  title,
  url: `https://www.discoverhongkong.com/eng/place-to-go/travel.guide-${slug}.html`,
  accessed: outdoorsCheckedOn,
});
const sassy = (slug, title, edition) => ({
  publisher: "Sassy Hong Kong",
  title,
  url: `https://www.sassyhongkong.com/${slug}/`,
  edition,
  accessed: outdoorsCheckedOn,
});
export const outdoorSources = {
  peng: tourism("peng-chau", "Peng Chau"),
  pengGuide: sassy(
    "peng-chau-hong-kong-guide-whats-on",
    "Peng Chau island guide",
    "October 2024 · older guide",
  ),
  yim: tourism(
    "yim-tin-tsai",
    "Yim Tin Tsai: village, salt pans and published travel information",
  ),
  hoi: tourism("hoi-ha-wan-marine-park", "Hoi Ha Wan Marine Park"),
  hoiCentre: tourism("hoi-ha-marine-life-centre", "Hoi Ha Marine Life Centre"),
  mui: tourism("mui-wo", "Mui Wo"),
  muiGuide: sassy(
    "whats-on-hk-mui-wo-neighbourhood-guide-lantau-eat-drink",
    "Mui Wo neighbourhood guide",
    "June 2024 · older guide",
  ),
  taio: tourism("tai-o-village", "Tai O Village"),
  taioGuide: sassy(
    "tai-o-fishing-village-guide-whats-on",
    "Tai O fishing village guide",
    "Older guide · editorial note July 2023; metadata later",
  ),
  kadoorie: tourism(
    "kadoorie-farm-botanic-garden",
    "Kadoorie Farm & Botanic Garden",
  ),
  tap: tourism("tap-mun", "Tap Mun: village and published travel information"),
  lai: tourism(
    "lai-chi-wo",
    "Lai Chi Wo: published weekday and weekend pier information",
  ),
  shing: tourism("shing-mun-country-park", "Shing Mun Country Park"),
  shingWalk: sassy(
    "health-fitness-outdoors-best-dog-friendly-hikes",
    "Pineapple Dam Nature Trail description",
    "September 2023 · older route description",
  ),
  easy: sassy(
    "top-beginner-hikes-whatsonhk",
    "Beginner-friendly hikes including Shing Mun",
    "February 2025",
  ),
  shade: sassy(
    "health-fitness-shaded-hikes-outdoors-best",
    "Shaded hikes including Tai Po Kau and Sir Cecil’s Ride",
    "May 2024 · older guide",
  ),
  pok: tourism(
    "pok-fu-lam-reservoir",
    "Pok Fu Lam Reservoir and the longer route to The Peak",
  ),
  tam: tourism(
    "tai-tam-reservoirs",
    "Tai Tam reservoirs and heritage structures",
  ),
  history: sassy(
    "fitness-outdoor-hikes-walking-trails-history-culture",
    "Tai Tam Waterworks Heritage Trail",
    "August 2024 · older guide",
  ),
  hok: tourism("hok-tau-reservoir", "Hok Tau Reservoir"),
  quiet: sassy(
    "trail-quiet-less-known-hikes-off-beaten-path",
    "Less-known hikes: Hok Tau and Wu Kau Tang approaches",
  ),
  family: {
    publisher: "Hong Kong Tourism Board",
    title: "Family hikes, including the longer Lai Chi Wo walk",
    url: "https://www.discoverhongkong.com/eng/outdoors/family-friendly-hikes-in-hong-kong.html",
    accessed: outdoorsCheckedOn,
  },
  hikingTips: {
    publisher: "Hong Kong Tourism Board",
    title: "Practical hiking tips",
    url: "https://www.discoverhongkong.com/eng/outdoors/practical-hiking-tips-to-explore-hong-kongs-trails.html",
    accessed: outdoorsCheckedOn,
  },
};
export const liveLinks = {
  warnings: "https://www.hko.gov.hk/en/wxinfo/warning.htm",
  forecast: "https://www.hko.gov.hk/en/wxinfo/currwx/fnd.htm",
  trails: "https://www.hiking.gov.hk/",
  ferries:
    "https://www.td.gov.hk/en/transport_in_hong_kong/public_transport/ferries/service_details/index.html",
  kaito:
    "https://www.td.gov.hk/en/transport_in_hong_kong/public_transport/ferries/kaito_services_map/service_details/index.html",
};
export const laiChiWoLead = {
  status: "Published lead · current sailings unconfirmed",
  text: "The Tourism Board describes Tuesday/Thursday sailings from Shatin Area 77 Landing near Tai Shui Hang, and a separate Ma Liu Shui route mainly on weekends and public holidays. That is worth checking before writing off another visit. The operator’s present timetable and availability have not been independently confirmed.",
  caution:
    "Confirm the exact route, departure pier, outward and return times, operation on your chosen date, and booking or capacity before leaving Eaton. Do not transfer the Ma Liu Shui departure time to the Area 77 service. Sha Tau Kok is a separate route with a closed-area-permit requirement; it is not a casual alternative pier.",
  source: outdoorSources.lai,
  pier: {
    name: "Shatin Area 77 Landing",
    address: "near Tai Shui Hang, Ma On Shan, Hong Kong",
  },
  village: {
    name: "Lai Chi Wo",
    address: "Lai Chi Wo, New Territories, Hong Kong",
  },
};
export const dayTrips = [
  {
    id: "peng-chau",
    number: 1,
    name: "Peng Chau",
    chinese: "坪洲",
    tagline: "An island village with flexible plans",
    lat: 22.2850708978,
    lng: 114.0390233566,
    simpleWeekday: true,
    boat: true,
    shortStroll: true,
    match: "Best first look for a low-commitment boat day",
    travel: "Allow roughly 1–1½ hours each way from Eaton",
    walk: "About 1–2 km if you keep to the main village; optional wandering is extra",
    shade: "Village shade and café breaks; waterfront sections are open",
    heat: "A useful shorter-stroll option because you can stay near food and the pier. It is still an outdoor outing, and the beach and Finger Hill add sun and steps.",
    why: "A small, lived-in island with temples, older lanes, local cafés and a creative side. It is an appealing alternative when you want a ferry and village atmosphere without committing to a long cross-country hike.",
    plan: [
      "Take a Central–Peng Chau ferry, then stay around Wing On Street and the older village lanes.",
      "Have a local lunch or tea, then look for the old leather-factory art courtyard if it is open. Treat individual workshops and shops as optional.",
      "Choose a short waterfront pause or another café, then take a suitable return sailing. Skip Finger Hill and extended coastal paths in the hottest conditions.",
    ],
    food: "Kee Sum Café at 3 Wing On Street is a published option for prawn toast, Hong Kong-style meals and tea. Hoi King at 13–15 Wing On Side Street is another local-food lead. Both are in an October 2024 guide: check current opening, and choose one rather than queueing for both.",
    foodPlace: {
      name: "Kee Sum Café",
      address: "Shop B, 3 Wing On Street, Peng Chau, Hong Kong",
    },
    access:
      "From Eaton, get to Central Ferry Pier 6 for the Peng Chau service. Published coverage describes frequent Central sailings; consult the current timetable before choosing your boat. Slow/fast services have different journey times.",
    return:
      "Check the return timetable on arrival, including any service changes. Returning to the same pier keeps the day simple; inter-island ferries are less frequent and are not assumed in this plan.",
    fallback:
      "If the sailing or heat does not suit, keep the day on Hong Kong Island with a meal and an indoor stop rather than forcing an exposed island walk.",
    check:
      "Regular ferry route, not a confirmed departure. The quieter feel varies by day and weekends can be busier.",
    destination: {
      name: "Central Ferry Pier 6",
      address: "Central, Hong Kong",
    },
    operator: "https://www.hkkf.com.hk/en/",
    sources: [outdoorSources.peng, outdoorSources.pengGuide],
  },
  {
    id: "yim-tin-tsai",
    number: 2,
    name: "Yim Tin Tsai",
    chinese: "鹽田梓",
    tagline: "The closest Hakka-village match",
    lat: 22.384518697863058,
    lng: 114.30343085864911,
    simpleWeekday: false,
    boat: true,
    shortStroll: false,
    match: "Best village-and-heritage match once the boat is confirmed",
    travel:
      "Allow roughly 1½–2½ hours each way, including the Sai Kung connection",
    walk: "Plan about 1–2 km around the village and salt pans; steps and optional paths add more",
    shade: "Mixed: village shelter, wooded patches and exposed salt pans",
    heat: "The salt-pan visit is out in the sun, and your return depends on a boat. Book a suitable visit/return window rather than assuming you can leave whenever you get hot.",
    why: "A former Catholic Hakka settlement with restored salt pans, St Joseph’s Chapel, village history and outdoor artworks. It is the strongest thematic alternative to Lai Chi Wo in this selection.",
    plan: [
      "Reach Sai Kung and confirm the outward and return boat before boarding.",
      "Visit the village, chapel and heritage displays where open; make the salt pans a brief early stop rather than a long midday linger.",
      "Look at a few artworks and take a shaded pause. Leave Jade-Girdle Bridge and longer peripheral walks as optional extras.",
    ],
    food: "The Tourism Board mentions Hakka snacks and tofu custard near the pier, but weekday service is not guaranteed. Carry lunch/water and plan your reliable sit-down meal back in Sai Kung town.",
    foodPlace: {
      name: "Sai Kung town centre",
      address: "Yi Chun Street / Man Nin Street, Sai Kung, Hong Kong",
    },
    access:
      "Travel to Sai Kung via Choi Hung and a connecting minibus, or Diamond Hill and a bus. Use the Yim Tin Tsai reception/ticket point by the Sai Kung waterfront. The Tourism Board describes a usual Tuesday–Sunday boat pattern; this has not been confirmed against today’s operator timetable.",
    return:
      "Agree a specific return sailing and check chapel, salt-pan and exhibition access for your date. Do not assume that a boat ticket includes every attraction, a workshop or an unscheduled return.",
    fallback:
      "If boat or site access is unconfirmed, use Sai Kung town for lunch and consider the land-access Hoi Ha plan only if the heat and onward transport suit you.",
    check:
      "Confirm boat and visitor access first. A published Tuesday–Sunday pattern is not a booking or a live service guarantee.",
    destination: {
      name: "Sai Kung Public Pier",
      address: "Sai Kung, Hong Kong",
    },
    sources: [outdoorSources.yim],
  },
  {
    id: "hoi-ha",
    mapPlace: {
      name: "Hoi Ha village",
      address: "Hoi Ha Road, Sai Kung, Hong Kong",
    },
    number: 3,
    name: "Hoi Ha Wan",
    chinese: "海下灣",
    tagline: "A rural coastal day reached by land",
    lat: 22.4603,
    lng: 114.3279,
    simpleWeekday: true,
    boat: false,
    shortStroll: false,
    match: "Best rural-coast alternative without an island ferry",
    travel: "Allow roughly 1½–2½ hours each way via Sai Kung",
    walk: "Keep to about 1–2 km around the village and nearby coast; longer trails are optional",
    shade: "Mixed woodland and open shore; the beach is exposed",
    heat: "Use short shaded sections and village pauses. A sea breeze is not guaranteed cooling, and an exposed beach afternoon does not fit the heat brief.",
    why: "A small village beside a marine park, with a much more rural setting than the central waterfronts. You can make the coast itself the outing and avoid a long ridge or an island-ferry commitment.",
    plan: [
      "Go via Sai Kung to Hoi Ha village, noting the return minibus arrangements as soon as you arrive.",
      "Take a short village/coastal look, using shaded stretches and turning back before it becomes a longer walk.",
      "If you want the Marine Life Centre or its glass-bottomed-boat programme, book the specific WWF activity in advance; otherwise return to Sai Kung for a meal.",
    ],
    food: "The Tourism Board describes local snack/drink cafés, but do not depend on one being open. Bring water and a simple packed lunch; Sai Kung town is the dependable meal district before or after the rural visit.",
    foodPlace: { name: "Sai Kung town centre", address: "Sai Kung, Hong Kong" },
    access:
      "From Sai Kung, the published access is a minibus or New Territories taxi to Hoi Ha. This is land access to a coastal village; a boat tour is optional. Private-car access inside the country park is restricted.",
    return:
      "Confirm the last practical minibus and allow for queues. If relying on a taxi, arrange collection rather than assuming an empty cab will appear at the village.",
    fallback:
      "The Marine Life Centre is a bookable programme, not a guaranteed walk-in refuge. If the return connection or conditions are poor, stay in Sai Kung rather than adding a remote coastal walk.",
    check:
      "Confirm rural minibus/taxi return. Book WWF separately for the centre/boat programme.",
    destination: {
      name: "Hoi Ha village",
      address: "Hoi Ha Road, Sai Kung, Hong Kong",
    },
    operator: "https://wwf.org.hk/en/oceans/booking/",
    sources: [outdoorSources.hoi, outdoorSources.hoiCentre],
  },
  {
    id: "mui-wo",
    number: 4,
    name: "Mui Wo",
    chinese: "梅窩",
    tagline: "Ferry, local lunch and a village-edge wander",
    lat: 22.265731667707843,
    lng: 113.9937532489713,
    simpleWeekday: true,
    boat: true,
    shortStroll: false,
    match: "Best flexible Lantau day with a straightforward meal stop",
    travel: "Allow roughly 1–1½ hours each way with ferry waits",
    walk: "About 1–3 km depending on how far you wander; the waterfall adds distance",
    shade: "Cafés and village shade, with open promenade and fields",
    heat: "Keep the route short and pause indoors when possible. The inland lanes and waterfall approach are not continuously shaded; the waterfall is optional, not the point of the day.",
    why: "A rural Lantau town where you can combine a ferry crossing, a Cantonese meal and a low-pressure look at village life. The easy return to the pier makes it a useful alternative to a remote point-to-point hike.",
    plan: [
      "Take the ferry to Mui Wo and begin with the cooked-food centre or a village lunch.",
      "Wander a short section towards Silvermine Bay and the village edge. Decide how much walking you want after feeling the conditions.",
      "Only add a short inland leg if it is comfortable; skip waterfall, beach sunbathing and long Lantau-trail extensions on oppressive days. Return by ferry or the checked land connection.",
    ],
    food: "Wah Kee at Mui Wo Cooked Food Centre is a published no-frills Cantonese seafood option. Check the menu and price before ordering seafood; the current opening and menu are not verified.",
    foodPlace: {
      name: "Mui Wo Cooked Food Centre",
      address: "Mui Wo, Lantau Island, Hong Kong",
    },
    access:
      "Central Ferry Pier 6 has the published Central–Mui Wo route. Use the correct queue/service: Peng Chau also uses Pier 6. Check the current Sun Ferry timetable and service type.",
    return:
      "Confirm a return sailing rather than treating the ferry as continuous. A Tung Chung-bound land connection can be a backup when operating, but its current timetable also needs checking.",
    fallback:
      "Have a short pier-side meal and return early if the inland walk feels too hot. A long trip across Lantau is not required to make this a worthwhile outing.",
    check:
      "Regular ferry route; actual sailing, cooked-food-centre service and any bus backup need checking.",
    destination: {
      name: "Central Ferry Pier 6",
      address: "Central, Hong Kong",
    },
    operator: "https://www.sunferry.com.hk/en/",
    sources: [outdoorSources.mui, outdoorSources.muiGuide],
  },
  {
    id: "tai-o",
    number: 5,
    name: "Tai O",
    chinese: "大澳",
    tagline: "Stilt-house lanes and local food, with a bus home",
    lat: 22.25586314445085,
    lng: 113.86141036947791,
    simpleWeekday: true,
    boat: false,
    shortStroll: true,
    match: "Best compact village day with a land-based return",
    travel: "Allow roughly 1½–2 hours each way; road queues can add time",
    walk: "About 1–2 km around the main village; optional outlying stops add more",
    shade: "Patchy village cover; bridges, waterfront and queues are exposed",
    heat: "A short village loop can work better than a long trail, but Tai O is not a shaded retreat. Keep the walk small and take a proper seated break.",
    why: "Stilt houses, waterways, dried-seafood shops and a strong food identity give this a different texture from the city centre. It is also a known visitor destination, so choose it for the village rather than an expectation of solitude.",
    plan: [
      "Travel to Tung Chung and take the published bus connection to Tai O. Start with a modest village loop around the lanes and waterway.",
      "Have a local snack or lunch and look into shops. Skip the longer viewpoints and extended waterfront walk if the heat is heavy.",
      "Return by bus with time in hand. A dolphin boat trip, wildlife sighting or cable-car circuit is not assumed.",
    ],
    food: "Tai O Bakery at 6 Kat Hing Street is a published Chinese-doughnut stop; availability and queues vary. For a meal, compare village menus and order clearly priced dishes rather than assuming a seafood platter is inexpensive.",
    foodPlace: {
      name: "Tai O Bakery",
      address: "6 Kat Hing Street, Tai O, Hong Kong",
    },
    access:
      "From Eaton, travel by MTR to Tung Chung and check the current bus 11 service to Tai O. This plan uses land transport; there is no need to coordinate a rural ferry.",
    return:
      "Check the bus timetable and expect queues on busy days. Keep the Tung Chung return simple rather than relying on an optional boat or cable car.",
    fallback:
      "Tung Chung is the rail-connected fallback if the bus queue or conditions make the village visit unattractive.",
    check:
      "Regular bus access as published, not a confirmed departure. Some cafés and special activities have limited weekday opening.",
    destination: {
      name: "Tung Chung Station",
      address: "Tung Chung, Hong Kong",
    },
    operator: "https://www.nlb.com.hk/",
    sources: [outdoorSources.taio, outdoorSources.taioGuide],
  },
  {
    id: "kadoorie",
    number: 6,
    name: "Kadoorie Farm & Botanic Garden",
    chinese: "嘉道理農場暨植物園",
    tagline: "Woodland and conservation, with a deliberately small route",
    lat: 22.433307165128028,
    lng: 114.11790077520784,
    simpleWeekday: true,
    boat: false,
    shortStroll: true,
    match: "Best managed nature day if current admission suits",
    travel:
      "Allow roughly 1–1½ hours each way, depending on rail/bus connections",
    walk: "Choose a short lower-garden visit; it is a hillside site, not a flat park",
    shade: "Trees and garden shelter, with exposed and sloping sections",
    heat: "The lower gardens let you keep the visit modest. Do not turn it into a climb to the upper slopes, or depend on an unconfirmed shuttle to make the day downhill.",
    why: "A conservation garden and wildlife-rescue setting in the rural New Territories, with native plants, woodland and themed gardens. It is a different kind of escape from the village islands, with more control over how much you do.",
    plan: [
      "Check admission and any booking requirement before travelling. Begin with the lower garden and visitor information.",
      "Choose a small selection of gardens and conservation displays where open, with regular seated pauses.",
      "Have the packed lunch you brought, or use the current café if confirmed. Finish while comfortable instead of adding the upper hillside.",
    ],
    food: "Bring a simple lunch and water unless you have checked the current on-site food service. Tai Po Market is a sensible local-food stop on a rail/bus routing via Tai Po.",
    foodPlace: {
      name: "Tai Po Hui Market and Cooked Food Centre",
      address: "Tai Po Complex, 8 Heung Sze Wui Street, Tai Po, Hong Kong",
    },
    access:
      "The destination is on Lam Kam Road. Use a current journey planner for the rail/bus connection via Tai Po or Kam Sheung Road, or a taxi to the visitor entrance. Confirm admission first; arriving at the gate is not proof of entry.",
    return:
      "Note the return bus stop/direction and last comfortable departure when arriving. Do not rely on an upper-garden shuttle, tour or restaurant without confirming it.",
    fallback:
      "If admission is unavailable, turn this into a Tai Po food-and-town visit or choose another day. The site’s hillside tracks are not an unbooked substitute hike.",
    check:
      "Check current admission, closures and food service. “Simpler weekday logistics” means no ferry dependency, not guaranteed entry.",
    destination: {
      name: "Kadoorie Farm & Botanic Garden visitor entrance",
      address: "Lam Kam Road, Tai Po, Hong Kong",
    },
    operator: "https://www.kfbg.org/en/",
    sources: [outdoorSources.kadoorie],
  },
  {
    id: "tap-mun",
    number: 7,
    name: "Tap Mun / Grass Island",
    chinese: "塔門",
    tagline: "A boat-and-village day with a bigger heat compromise",
    lat: 22.46826055266255,
    lng: 114.35907694343801,
    simpleWeekday: false,
    boat: true,
    shortStroll: false,
    match: "A longer-travel option for a milder day",
    travel:
      "Allow roughly 2–3 hours each way once rural connections and waits are included",
    walk: "Keep to a short harbour/village visit; the published 2.5 km island loop is extra",
    shade:
      "Harbour shelter and patchy trees; grassland and headlands are exposed",
    heat: "The island’s signature open grass slopes are a poor match for oppressive heat. A short village-only visit still has a boat-return commitment. This is a conditional choice, not a lead hot-day recommendation.",
    why: "A fishing-village atmosphere and a proper stretch of water between you and town make Tap Mun appealing. The price is the long approach and a much less flexible return than the main Central island routes.",
    plan: [
      "Confirm a workable outward/return pair via Wong Shek or Ma Liu Shui before leaving Eaton.",
      "On arrival, keep close to the village and harbour, have a local meal and look around at an unhurried pace.",
      "Treat the hilltop, Balanced Rock and open grassland circuit as additions for better conditions. Return on the service you planned, with a margin for boarding.",
    ],
    food: "The Tourism Board describes village seafood restaurants and sea-urchin fried rice. Confirm opening and price before ordering; take water and backup food for waiting and connection delays.",
    foodPlace: {
      name: "Tap Mun Hoi Pong Street",
      address: "Tap Mun, Hong Kong",
    },
    access:
      "The published options include a kaito from Wong Shek and a limited service from Ma Liu Shui. Via Wong Shek, first get to Sai Kung and check the bus connection. These are separate piers and routes; do not mix their return instructions.",
    return:
      "The Tourism Board describes only two weekday sailings on the Ma Liu Shui route, but today’s times/capacity are not confirmed here. Check the current kaito listing for your specific route and a return connection all the way back.",
    fallback:
      "If the boat pair is awkward or the forecast is oppressive, choose Peng Chau, Mui Wo or a land-access outing. Do not replace a missed return with a long, improvised coastal hike.",
    check:
      "Limited rural ferry dependency. Current sailings unconfirmed; the short-looking island loop is substantially exposed.",
    destination: { name: "Wong Shek Pier", address: "Sai Kung, Hong Kong" },
    sources: [outdoorSources.tap],
  },
];
export const hikes = [
  {
    id: "pineapple-dam",
    number: 1,
    name: "Shing Mun · Pineapple Dam short return",
    chinese: "城門菠蘿壩",
    fit: "First look for a short wooded walk",
    category: "woodland",
    mostlyWooded: true,
    downhill: false,
    short: true,
    distance: "About 1.6–2 km return, planned",
    minutes: "About 45–75 minutes, plus transport",
    distanceNote:
      "The published Pineapple Dam nature section is about 0.8 km. This plan returns the same way and allows a little access walking; it is not the full reservoir circuit.",
    climb: "A flight of access steps and some gentle ups/downs; not step-free",
    shade:
      "Largely wooded on the short section, with gaps and exposed access points",
    surface: "Signed nature trail and surfaced paths; steps near the terminus",
    commitment:
      "Low walking commitment if you turn back early; it still feels hot and humid under trees.",
    why: "The minibus terminus is near the start, so you can get a proper woodland feel without spending the first hour on an approach road. It is the most straightforward short-forest candidate in this selection.",
    route: [
      "Begin at the Pineapple Dam / Shing Mun minibus terminus and use the signed Pineapple Dam Nature Trail.",
      "Take the short wooded nature section at an easy pace. Turn back at its end, or sooner if you are heating up.",
      "Retrace the same way to the terminus. Keep this a short return rather than continuing around the reservoir.",
    ],
    skip: "Skip Tai Shing Stream, stream walking, swimming, longer paperbark-tree detours and the full 7 km-or-more reservoir circuit. They are separate outings with extra distance, exposure and route commitments.",
    access:
      "From Eaton, take the MTR towards Tsuen Wan, then check the published minibus 82 connection to Shing Mun/Pineapple Dam. The final steps into the trail count as part of the walk.",
    exit: "Return to the same minibus terminus. Check the service back before starting and allow for queues. Early turnaround is simple on this out-and-back.",
    food: "Plan lunch in Tsuen Wan before or after the walk. Carry your own water and snack; a kiosk or visitor centre is not guaranteed to be open.",
    start: {
      name: "Pineapple Dam / Shing Mun minibus terminus",
      address: "Shing Mun Road, Tsuen Wan, Hong Kong",
      lat: 22.3848,
      lng: 114.1439,
    },
    transportMode: "transit",
    sources: [
      outdoorSources.shing,
      outdoorSources.shingWalk,
      outdoorSources.easy,
    ],
  },
  {
    id: "tai-po-kau",
    number: 2,
    name: "Tai Po Kau · timed forest out-and-back",
    chinese: "大埔滘",
    fit: "For deeper forest, if the initial climb feels comfortable",
    category: "woodland",
    mostlyWooded: true,
    downhill: false,
    short: true,
    distance: "Roughly 2–3 km return as a planning allowance",
    minutes: "Cap the walk at about 60–90 minutes",
    distanceNote:
      "This is a deliberately shortened visit along the signed forest approach, not a claim that a named 3 km loop includes all access. Turn around by time rather than adding a full coloured loop.",
    climb:
      "An uphill approach inside the reserve, then the same descent on return",
    shade:
      "Substantial forest cover; the roadside approach and gaps add exposure",
    surface:
      "Use the surfaced/signed forest approach; do not explore unmarked side trails",
    commitment:
      "Woodland is the attraction, but the initial climb makes this conditional in heavy heat.",
    why: "A nature reserve with a more immersive forest feel than an urban park. It suits your willingness to travel for trees and birds, provided you accept that shade does not remove the effort of climbing.",
    route: [
      "Start from the Tai Po Road / Tsung Tsai Yuen reserve entrance area, not a map pin in the middle of the reserve.",
      "Follow the signed forest approach. Treat the first uphill stretch as the decision point: turn back if it already feels too demanding.",
      "Set an outward limit of roughly 25–35 minutes from your actual start and retrace the same route. Stop earlier whenever needed.",
    ],
    skip: "Do not add the 3–10 km coloured walks on top of the approach. Their advertised distances are not the complete bus-stop-to-bus-stop outing.",
    access:
      "Use rail towards Tai Po and a checked local bus or taxi to the reserve entrance on Tai Po Road. Neither option takes away the uphill walking inside the reserve. The map marker is an approximate road-access reference.",
    exit: "This out-and-back keeps the original road exit available. The return is downhill; check the bus stop/direction before setting off and arrange any taxi pickup rather than expecting one inside the forest.",
    food: "Tai Po Market and its cooked-food centre make a good local meal before or after. Bring all the water and food you need for the forest section.",
    start: {
      name: "Tai Po Kau Nature Reserve entrance / Tsung Tsai Yuen",
      address: "Tai Po Road, Tai Po Kau, Hong Kong",
      lat: 22.4319,
      lng: 114.1865,
    },
    transportMode: "transit",
    sources: [outdoorSources.shade],
  },
  {
    id: "pok-fu-lam",
    number: 3,
    name: "The Peak → Pok Fu Lam Reservoir",
    chinese: "山頂至薄扶林水塘",
    fit: "First look if downhill matters most",
    category: "downhill",
    mostlyWooded: true,
    downhill: true,
    short: false,
    distance: "About 2.5–3.5 km for the shortened descent, estimated",
    minutes: "About 1–1½ hours, with extra time for getting up to The Peak",
    distanceNote:
      "A shortened reverse-direction adaptation of the longer Tourism Board walk. It excludes the Lugard Road loop and High West; it is not the published 6 km itinerary.",
    climb:
      "Predominantly downhill from a high start; minor rises and steep sections remain",
    shade:
      "Wooded on much of the reservoir road; upper/lower access and breaks in the canopy are exposed",
    surface:
      "Mostly surfaced reservoir road/path; descent can be hard on knees and slippery when wet",
    commitment:
      "A one-way descent through country-park woodland; fewer easy exits once you leave the upper roads.",
    why: "Transport handles the major climb. The trail part then leaves the busy Peak area and drops towards the older reservoir through woodland. It is near the city, but the middle of the outing is country park rather than a street walk.",
    route: [
      "Take transport to The Peak. Find the signed Pok Fu Lam Reservoir Road descent near the Peak Galleria area.",
      "Follow the signed reservoir road downhill towards Pok Fu Lam Reservoir; keep the route simple.",
      "Continue to the lower public-road access at Pok Fu Lam Road for your return transport.",
    ],
    skip: "Skip High West, the Lugard Road circuit and any climb from Central. They defeat the short/downhill purpose. If signs or closures prevent the intended descent, use transport down instead of improvising another trail.",
    access:
      "Take the published bus/minibus/Peak transport options or a taxi up. The start is the Peak Galleria/reservoir-road area. A long walk uphill to reach it is not included or recommended for this heat brief.",
    exit: "Finish near Pok Fu Lam Reservoir Road’s junction with Pok Fu Lam Road and use the checked bus connection. A few kilometres of descent can still be tiring; choose a short return walk instead if you need an immediate turnaround option.",
    food: "After returning towards Kennedy Town or Sai Ying Pun, use the neighbourhood guide for a local meal. Carry water and a snack for the wooded descent.",
    foodLink: "./sai-ying-pun.html",
    start: {
      name: "Peak Galleria / Pok Fu Lam Reservoir Road start",
      address: "The Peak, Hong Kong",
      lat: 22.2703561,
      lng: 114.1498719,
    },
    end: {
      name: "Pok Fu Lam Reservoir Road at Pok Fu Lam Road",
      address: "Pok Fu Lam, Hong Kong",
      lat: 22.2629,
      lng: 114.136,
    },
    transportMode: "transit",
    sources: [outdoorSources.pok, outdoorSources.hikingTips],
  },
  {
    id: "sir-cecil",
    number: 4,
    name: "Sir Cecil’s Ride · Mount Butler Road to Braemar Hill",
    chinese: "金督馳馬徑",
    fit: "A wooded near-city backup",
    category: "woodland",
    mostlyWooded: true,
    downhill: false,
    short: false,
    distance: "Published core about 3 km; allow roughly 3–4 km with access",
    minutes: "About 1–1½ hours at an unhurried pace",
    distanceNote:
      "The older guide gives a roughly 3 km core. Trailhead and bus-stop approaches add walking, so this is not presented as a guaranteed 45-minute outing.",
    climb:
      "Undulating, with steps and rocky sections; not a flat or continuous-downhill walk",
    shade:
      "Much of the trail is wooded, with open gaps and road-end approaches",
    surface: "Country-park path, some uneven/rocky sections and steps",
    commitment:
      "Less remote than the New Territories options, but still a trail with no assumed mid-route shop.",
    why: "A way to get into trees without a long rural transport chain. It is a practical reserve choice when you want woodland and can accept a near-city setting rather than a faraway village landscape.",
    route: [
      "Use transport to the Mount Butler Road approach and check the signed Sir Cecil’s Ride route towards Braemar Hill before committing.",
      "Stay with the signed contouring route towards Braemar Hill; take the steps and rocky stretches slowly.",
      "Finish towards the Braemar Hill bus-terminus area and use public transport or a taxi for the onward meal.",
    ],
    skip: "Skip summit diversions, Red Incense Burner viewpoint scrambles and any unmarked shortcut. If you cannot positively identify the signed route, choose another walk rather than treating this overview as navigation.",
    access:
      "Check the current minibus/taxi access to Mount Butler Road. Starting from a low MTR station on foot adds climbing and is not the plan. The map uses approximate road-end references, not surveyed trailhead coordinates.",
    exit: "A one-way walk ending around Braemar Hill’s public-transport terminus. Confirm the actual return service/direction; do not assume a restaurant or taxi will be immediately available at the trail end.",
    food: "Use Braemar Hill/Tin Hau for a café or Hong Kong-style meal afterwards. Carry water and a snack; shaded terrain does not guarantee a convenient rest stop.",
    start: {
      name: "Mount Butler Road / Sir Cecil’s Ride trail access",
      address: "Mount Butler Road, Hong Kong",
      lat: 22.2703554,
      lng: 114.196696,
    },
    end: {
      name: "Braemar Hill Public Transport Terminus",
      address: "Hau Yuen Path, Braemar Hill, Hong Kong",
      lat: 22.28344,
      lng: 114.19882,
    },
    transportMode: "transit",
    sources: [outdoorSources.shade],
  },
  {
    id: "tai-tam",
    number: 5,
    name: "Tai Tam · high start to the lower reservoirs",
    chinese: "大潭水塘",
    fit: "Reserve for a less oppressive morning",
    category: "downhill",
    mostlyWooded: false,
    downhill: true,
    short: false,
    distance: "About 4–5 km for the high-start descent, estimated",
    minutes:
      "About 1½–2½ hours, depending on stops and the actual access point",
    distanceNote:
      "An adapted one-way descent from the Parkview-side country-park entrance. It is not a claim that the whole heritage itinerary is a short, flat or circular walk.",
    climb:
      "Mostly descending from the high start, with undulations and possible short uphill sections",
    shade: "Mixed woodland and substantial open reservoir/dam sections",
    surface:
      "Mostly surfaced reservoir paths/roads; exposed structures and long gaps between exits",
    commitment:
      "The longest and most exposed option on this page. A high start helps climbing, but does not make it a severe-heat recommendation.",
    why: "Waterworks bridges, dams and forest make a rewarding country-park landscape. It is included for the downhill preference, with a clear tradeoff: more time outdoors and more sun than the short forest options.",
    route: [
      "Arrange a taxi to the public Tai Tam country-park entrance by the Parkview end of Tai Tam Reservoir Road. Confirm the actual drop-off point first.",
      "Follow the signed reservoir/heritage paths downhill towards the lower reservoirs, using the official map and current signs.",
      "Finish at the public Tai Tam Road access and the correct bus stop for your onward journey.",
    ],
    skip: "Skip the uphill road approach from Wong Nai Chung Gap, reservoir circuits, Repulse Bay extensions and side trails. If a legal high-start drop-off and a definite bus-road finish are not confirmed, do not choose this version.",
    access:
      "This version relies on a high taxi start. A bus to Wong Nai Chung Gap still leaves an uphill approach and is not an equivalent low-effort start. Do not assume access through private Parkview grounds or closed gates.",
    exit: "There are few useful shortcuts to public transport in the middle. Confirm the Tai Tam Road finish and bus direction before starting; carry enough water for the whole route and delays.",
    food: "Plan a meal after reaching public transport, for example towards Sai Wan Ho or Stanley according to the checked bus route. There is no assumed trail café or guaranteed refill point.",
    start: {
      name: "Tai Tam country-park public entrance near Parkview",
      address: "Tai Tam Reservoir Road, Hong Kong",
      lat: 22.258,
      lng: 114.1979,
    },
    end: {
      name: "Tai Tam Road / Tai Tam country-park lower exit",
      address: "Tai Tam Tuk Reservoir, Hong Kong",
      lat: 22.2464,
      lng: 114.2211,
    },
    transportMode: "driving",
    sources: [
      outdoorSources.tam,
      outdoorSources.history,
      outdoorSources.hikingTips,
    ],
  },
];
export const rejectedOptions = [
  {
    name: "Dragon’s Back, High Junk Peak and exposed beach ridges",
    reason:
      "Ridge sunshine, climbing and long stretches without a quick exit make them a weak match for this heat brief.",
  },
  {
    name: "Ng Tung Chai waterfalls, High West and Razor Hill",
    reason:
      "Shade or a short headline distance hides substantial climbing, steps or uneven ground. Waterfall pools are not a heat-management plan.",
    sources: [outdoorSources.shade],
  },
  {
    name: "Full Shing Mun circuit and the hike into Lai Chi Wo",
    reason:
      "These are longer commitments than the short variants here. Missing a ferry is not a reason to improvise a long village approach in heavy heat.",
    sources: [outdoorSources.easy, outdoorSources.family],
  },
  {
    name: "Hok Tau and Wu Kau Tang longer routes",
    reason:
      "Attractive rural settings, but the published routes checked include long approaches or major extensions. A verified short, shaded door-to-door alternative needs more access detail before it belongs on this shortlist.",
    sources: [outdoorSources.hok, outdoorSources.quiet],
  },
  {
    name: "Tung Ping Chau / Kat O as a spontaneous weekday replacement",
    reason:
      "Check the specific route and operating day first. Remote island sailings cannot be treated as interchangeable weekday services, and open coastal paths add heat exposure.",
  },
];
export function filterDayTrips(mode = "all") {
  return dayTrips.filter(
    (t) =>
      mode === "all" ||
      (mode === "weekday" && t.simpleWeekday) ||
      (mode === "boat" && t.boat) ||
      (mode === "short" && t.shortStroll),
  );
}
export function filterHikes(mode = "all") {
  return hikes.filter(
    (h) =>
      mode === "all" ||
      (mode === "wooded" && h.mostlyWooded) ||
      (mode === "downhill" && h.downhill) ||
      (mode === "short" && h.short),
  );
}
for (const h of hikes) {
  h.lat = h.start.lat;
  h.lng = h.start.lng;
}
