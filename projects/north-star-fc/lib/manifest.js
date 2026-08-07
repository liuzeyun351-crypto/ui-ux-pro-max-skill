/* =============================================================================
   North Star Football Club — site data
   -----------------------------------------------------------------------------
   THIS IS THE ONLY FILE THE CLUB NEEDS TO EDIT FOR ROUTINE UPDATES.
   Everything below feeds the website: field status, weather location, schedules,
   documents, sponsors and contact details.

   All content is ALSO hardcoded in the HTML so the site still reads if this file
   fails to load. When you change something here, change it in the matching HTML
   too (each block is marked with an HTML comment telling you where).

   Values marked  // TODO  are placeholders — replace with the club's real data.
   ============================================================================ */
(function () {
  "use strict";

  window.__BRAND__ = {
    name: "North Star Football Club",
    shortName: "North Star FC",
    tagline: "Community football, from MiniRoos to FQPL.",
    founded: 1974, // TODO: confirm founding year

    contact: {
      email: "admin@northstarfc.com.au",        // TODO
      phone: "07 0000 0000",                     // TODO
      ground: "North Star Sports Complex",       // TODO
      address: "Club Road, Brisbane QLD 4000",   // TODO
      postal: "PO Box 000, Brisbane QLD 4000"    // TODO
    },

    /* ---------------------------------------------------------------------
       WEATHER — used by fields.html and the home page status strip.
       Coordinates drive the live forecast (Open-Meteo, no API key needed).
       Replace with your ground's latitude / longitude.
       --------------------------------------------------------------------- */
    weather: {
      lat: -27.4698,
      lon: 153.0251,
      placeLabel: "Brisbane, QLD",
      timezone: "Australia/Brisbane"
    },

    /* ---------------------------------------------------------------------
       FIELD STATUS — update after every ground inspection.
       state: "open" | "caution" | "closed"
       Mirrored in fields.html and index.html. Update both.
       --------------------------------------------------------------------- */
    fieldsUpdated: "Thursday 6 Aug, 4:15pm",
    fields: [
      {
        id: "field-1",
        name: "Field 1",
        use: "FQPL & Senior fixtures",
        state: "open",
        note: "Full surface open. Lights on until 9:30pm."
      },
      {
        id: "field-2",
        name: "Field 2",
        use: "Junior community 12–17",
        state: "caution",
        note: "Southern goalmouth soft after rain. Avoid heavy drills in the box."
      },
      {
        id: "field-3",
        name: "Field 3",
        use: "MiniRoos & training grids",
        state: "closed",
        note: "Closed for turf renovation. Reopens Monday 11 Aug."
      },
      {
        id: "field-4",
        name: "Training Grid",
        use: "Small-sided & goalkeeper work",
        state: "open",
        note: "Open. Portable goals to be returned to the shed after use."
      }
    ],

    /* ---------------------------------------------------------------------
       PROGRAMS — shown on the home page and the registration page.
       --------------------------------------------------------------------- */
    programs: [
      { code: "01", name: "MiniRoos Kick-Off", ages: "Ages 4–5", format: "4v4 · Saturday mornings", fee: "$120", blurb: "First touch, first team, first season. Ten weeks, no scores kept." },
      { code: "02", name: "MiniRoos", ages: "Ages 6–11", format: "5v5 to 9v9 · Saturday", fee: "$310", blurb: "Small-sided football with rotating positions and equal game time." },
      { code: "03", name: "Junior Community", ages: "Ages 12–17", format: "11v11 · Saturday & Sunday", fee: "$430", blurb: "Graded squads across the Brisbane community competition." },
      { code: "04", name: "Senior Community", ages: "Ages 18+", format: "11v11 · Saturday", fee: "$520", blurb: "Four men's and two women's sides, from division one to over-35s." },
      { code: "05", name: "FQPL Academy", ages: "Ages 12–18", format: "Trials · Aug–Sep", fee: "By selection", blurb: "Our pathway squads in the Football Queensland Premier League." },
      { code: "06", name: "All Abilities", ages: "All ages", format: "Sunday mornings", fee: "$60", blurb: "Inclusive football for players with disability, plus walking football." }
    ],

    /* ---------------------------------------------------------------------
       WEEKLY TRAINING — schedules.html
       --------------------------------------------------------------------- */
    training: [
      { day: "Monday",    slots: [ { time: "16:00–17:15", squad: "MiniRoos 6–8", field: "Training Grid" }, { time: "17:30–19:00", squad: "Junior 12–14", field: "Field 2" }, { time: "19:00–20:30", squad: "Senior Women", field: "Field 1" } ] },
      { day: "Tuesday",   slots: [ { time: "16:00–17:15", squad: "MiniRoos 9–11", field: "Training Grid" }, { time: "17:30–19:00", squad: "FQPL 13–15", field: "Field 1" }, { time: "19:00–20:30", squad: "Senior Men Div 1", field: "Field 1" } ] },
      { day: "Wednesday", slots: [ { time: "16:00–17:15", squad: "Goalkeepers (all ages)", field: "Training Grid" }, { time: "17:30–19:00", squad: "Junior 15–17", field: "Field 2" }, { time: "19:00–20:30", squad: "Senior Men Div 3", field: "Field 2" } ] },
      { day: "Thursday",  slots: [ { time: "17:30–19:00", squad: "FQPL 16–18", field: "Field 1" }, { time: "19:00–20:30", squad: "Senior Women", field: "Field 1" }, { time: "19:00–20:30", squad: "Over 35s", field: "Field 2" } ] },
      { day: "Friday",    slots: [ { time: "17:00–18:30", squad: "Optional skills session", field: "Training Grid" } ] }
    ],

    /* ---------------------------------------------------------------------
       WEEKEND FIXTURES — schedules.html. Update weekly.
       --------------------------------------------------------------------- */
    fixturesRound: "Round 17 · 9–10 August",
    fixtures: [
      { day: "Sat", time: "08:00", squad: "MiniRoos 6–8", opponent: "Club rotation grids", venue: "Home · Field 1", ha: "H" },
      { day: "Sat", time: "09:30", squad: "MiniRoos 9–11", opponent: "Kedron Kites", venue: "Home · Field 1", ha: "H" },
      { day: "Sat", time: "11:00", squad: "Junior 12–14", opponent: "Bardon Stars", venue: "Away · Bardon", ha: "A" },
      { day: "Sat", time: "13:00", squad: "Junior 15–17", opponent: "Grange Rovers", venue: "Home · Field 1", ha: "H" },
      { day: "Sat", time: "15:00", squad: "Senior Women", opponent: "Newmarket City", venue: "Home · Field 1", ha: "H" },
      { day: "Sat", time: "17:00", squad: "Senior Men Div 1", opponent: "Aspley United", venue: "Away · Aspley", ha: "A" },
      { day: "Sun", time: "09:00", squad: "All Abilities", opponent: "Come-and-try round", venue: "Home · Field 2", ha: "H" },
      { day: "Sun", time: "11:00", squad: "FQPL 16–18", opponent: "Redcliffe FQPL", venue: "Home · Field 1", ha: "H" }
    ],

    /* ---------------------------------------------------------------------
       DOCUMENT HUB — documents.html
       Put the real PDFs in  assets/docs/  and update the `file` value.
       --------------------------------------------------------------------- */
    documents: [
      { cat: "Governance",  name: "Club Constitution", file: "assets/docs/constitution.pdf", updated: "Mar 2026", size: "PDF · 480 KB" },
      { cat: "Governance",  name: "Annual Report & Financials", file: "assets/docs/annual-report.pdf", updated: "Feb 2026", size: "PDF · 2.1 MB" },
      { cat: "Governance",  name: "Committee Meeting Minutes", file: "assets/docs/minutes.pdf", updated: "Jul 2026", size: "PDF · 210 KB" },
      { cat: "Safety",      name: "Member Protection Policy", file: "assets/docs/member-protection.pdf", updated: "Jan 2026", size: "PDF · 340 KB" },
      { cat: "Safety",      name: "Concussion & Head Injury Policy", file: "assets/docs/concussion.pdf", updated: "Jan 2026", size: "PDF · 190 KB" },
      { cat: "Safety",      name: "Heat & Wet Weather Policy", file: "assets/docs/weather-policy.pdf", updated: "Oct 2025", size: "PDF · 160 KB" },
      { cat: "Conduct",     name: "Player Code of Conduct", file: "assets/docs/code-players.pdf", updated: "Jan 2026", size: "PDF · 120 KB" },
      { cat: "Conduct",     name: "Parent & Spectator Code of Conduct", file: "assets/docs/code-parents.pdf", updated: "Jan 2026", size: "PDF · 120 KB" },
      { cat: "Conduct",     name: "Coach & Volunteer Code of Conduct", file: "assets/docs/code-coaches.pdf", updated: "Jan 2026", size: "PDF · 130 KB" },
      { cat: "Conduct",     name: "Grievance & Complaints Procedure", file: "assets/docs/grievance.pdf", updated: "Jan 2026", size: "PDF · 150 KB" },
      { cat: "Agreements",  name: "Volunteer Agreement", file: "assets/docs/volunteer-agreement.pdf", updated: "Feb 2026", size: "PDF · 95 KB" },
      { cat: "Agreements",  name: "Coach Agreement", file: "assets/docs/coach-agreement.pdf", updated: "Feb 2026", size: "PDF · 110 KB" },
      { cat: "Agreements",  name: "Photography & Media Consent", file: "assets/docs/media-consent.pdf", updated: "Feb 2026", size: "PDF · 88 KB" },
      { cat: "Registration",name: "Registration & Refund Policy", file: "assets/docs/refund-policy.pdf", updated: "Dec 2025", size: "PDF · 140 KB" },
      { cat: "Registration",name: "FairPlay Voucher — How To Apply", file: "assets/docs/fairplay-guide.pdf", updated: "Dec 2025", size: "PDF · 260 KB" },
      { cat: "Registration",name: "Player Transfer Request Form", file: "assets/docs/transfer-form.pdf", updated: "Dec 2025", size: "PDF · 75 KB" }
    ],

    /* ---------------------------------------------------------------------
       SPONSORSHIP — partners.html
       --------------------------------------------------------------------- */
    sponsorTiers: [
      { code: "01", name: "Principal Partner", price: "$12,000 / season", spots: "1 available", includes: ["Naming rights on the main grandstand", "Front-of-shirt on all senior and FQPL kits", "Two 6m fence signs on Field 1", "Logo on every page of this website", "Ten season passes and a match-day hosting package"] },
      { code: "02", name: "Major Partner", price: "$6,000 / season", spots: "3 available", includes: ["Back-of-shirt on two senior squads", "One 6m fence sign on Field 1", "Logo on the partners page and newsletter", "Four season passes"] },
      { code: "03", name: "Club Partner", price: "$2,500 / season", spots: "8 available", includes: ["Sleeve or short branding on one squad", "One 3m fence sign", "Logo on the partners page", "Two season passes"] },
      { code: "04", name: "Team Sponsor", price: "$900 / season", spots: "Open", includes: ["Your name on one junior or MiniRoos team kit", "Team photo with your banner", "Social media feature at season launch"] },
      { code: "05", name: "Ground Signage", price: "$650 / season", spots: "Open", includes: ["One 3m fence sign, your artwork or ours", "Listed on the partners page"] },
      { code: "06", name: "Community Supporter", price: "$250 / season", spots: "Open", includes: ["Named on the community board at the clubhouse", "Listed on the partners page", "Great for local trades and small businesses"] }
    ],

    /* ---------------------------------------------------------------------
       CLUB NUMBERS — animated count-ups on the home page.
       --------------------------------------------------------------------- */
    stats: [
      { value: 1974, label: "Founded", suffix: "" },
      { value: 640,  label: "Registered players", suffix: "+" },
      { value: 46,   label: "Teams across all grades", suffix: "" },
      { value: 120,  label: "Volunteers each season", suffix: "+" }
    ],

    /* ---------------------------------------------------------------------
       REGISTRATION PORTALS — register.html
       --------------------------------------------------------------------- */
    portals: [
      { name: "PlayFootball", role: "Official national registration portal — all players register here first.", url: "https://www.playfootball.com.au/", cta: "Open PlayFootball" },
      { name: "FairPlay Vouchers", role: "Queensland Government vouchers of up to $200 towards club fees.", url: "https://www.qld.gov.au/recreation/sports/funding/fairplay", cta: "Check eligibility" },
      { name: "Club Payment Plan", role: "Split fees across the season. Email the registrar to set one up.", url: "mailto:admin@northstarfc.com.au", cta: "Email the registrar" }
    ]
  };
})();
