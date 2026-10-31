# Happy Valley guide: evidence and remaining verification

Guide assembled 31 October 2026. This is a visitor introduction, not a live racecard or prediction service.

## Read source

[Sassy Hong Kong — Happy Wednesday: Your Guide To Happy Valley Horse Races & Betting](https://www.sassyhongkong.com/top-tips-wednesday-races-hong-kong-whatsonhk/), published **19 August 2026**, read 31 October 2026. It covers the 2026/27 season, the 1846 racecourse history, usual Wednesday-night context, public admission quoted at HK$10 via Octopus, the HK$10 standard minimum stake, counter wording, basic bet types, social areas and pari-mutuel pooling. The website identifies Sassy as the source of the admission/stake figures and advises confirming HKJC conditions.

The article's simplified Place description does not explain small-field exceptions, so the website does not state an unconditional three-place rule. It directs the visitor to confirm the actual pool and paid places. Its suggestion that a well-known jockey is a “cheat code” was not adopted: public jockey information does not establish a profitable betting edge.

## Official sources to read when access is applied

- [HKJC fixture calendar](https://racing.hkjc.com/racing/english/racing-info/fixture.aspx)
- [HKJC racecard](https://racing.hkjc.com/racing/information/English/Racing/RaceCard.aspx)
- [Racecourse visitor information](https://entertainment.hkjc.com/en/racing-experience/happy-valley-racecourse.html)
- [Official betting information](https://bet.hkjc.com/)

Requests to the Jockey Club racing/visitor hosts failed with a 403 tunnel denial from the execution environment. Host additions are saved in the pending environment draft, but are not active merely because the draft is saved. This prevents an independent official fixture/rule check in the current instance. These outgoing references are labelled for live checking rather than falsely marked as read sources.

`racing-data.js` therefore has **no confirmed fixture dates** and `verifiedOn: null`. The UI explains the usual Wednesday pattern, the September–July season, how to choose the correct venue, and how to use the official racecard for the actual first/last race times. It never generates weekly dates by assumption. After access changes, read the official current calendar, record exact Happy Valley fixtures with their check date, confirm source URLs/entry conditions and pool rules, then update the data and visible source notes. Keep Sha Tin fixtures separate.

General practical advice (arriving early, checking tickets, setting a total entertainment stake and comparing relevant form) is editorial guidance, not a guarantee of a payout or profit. No live horses, tips, current odds or predicted results are supplied. The guide distinguishes collecting on a Place bet from making a profit across all tickets.

## Mini race

The Willy/Gilly game is unrelated to real-world betting. Browser `crypto.getRandomValues` supplies a new uniform draw for each start; the lower half of the interval chooses Willy and the upper half chooses Gilly. Repeated winners are allowed. Separate random values set animation pace; they never change the selected winner. Both horses complete two laps, with the chosen winner assigned the shorter finishing time. Scores reset on reload. Reduced-motion mode resolves immediately.

Tests cover both possible winner branches, repeat winners, monotonic bounded progress, winner/finish order, actual animation, duplicate-start protection, scoreboard updates, replay, reduced motion and mobile layout. Passing these tests validates the software, not the factual freshness of racing schedules.
