import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  CATEGORIES,
  CELEBRITIES,
  COUNTRIES,
  MANAGERS,
} from "./seed-data";

const db = new PrismaClient();

/**
 * Real photography written by `npm run fetch:images`. Absent on a fresh clone,
 * in which case every celebrity keeps its generated portrait — the seed and the
 * UI both treat imagery as optional.
 */
interface PhotoManifestEntry {
  portrait: string;
  wide?: string;
  blur?: string;
  width?: number;
  height?: number;
  credit?: string;
  licence?: string;
  licenceUrl?: string;
  sourceUrl?: string;
  source?: string;
  gallery?: { url: string; credit?: string; licence?: string; sourceUrl?: string }[];
}

function loadPhotoManifest(): Record<string, PhotoManifestEntry> {
  const file = path.join(process.cwd(), "public", "media", "talent", "manifest.json");
  try {
    return JSON.parse(fs.readFileSync(file, "utf8")) as Record<string, PhotoManifestEntry>;
  } catch {
    return {};
  }
}

// Deterministic PRNG so every seed run produces the same demo world
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20260726);

const REVIEW_POOL: { title: string; body: string; eventType: string; rating: number }[] = [
  { title: "Flawless from inquiry to encore", body: "Every detail was advanced weeks ahead. The performance itself exceeded a room full of very high expectations.", eventType: "corporate", rating: 5 },
  { title: "Our guests are still talking about it", body: "Professional team, punctual arrival, and genuine warmth with our guests. Worth every dollar.", eventType: "wedding", rating: 5 },
  { title: "A masterclass in showing up", body: "Arrived early, stayed late, took photos with the whole team. The keynote was tailored to our industry beautifully.", eventType: "speaking", rating: 5 },
  { title: "Smooth production, minor timing shift", body: "The set was phenomenal. Schedule slipped 30 minutes on the day, but the team communicated clearly throughout.", eventType: "festival", rating: 4 },
  { title: "Exceeded the brief", body: "The campaign content over-delivered on every metric we track. Approvals were fast and collaborative.", eventType: "endorsement", rating: 5 },
  { title: "Unforgettable evening", body: "Booking through the platform's escrow gave our finance team confidence. The appearance itself was pure magic.", eventType: "charity", rating: 5 },
];

const ARTICLES = [
  {
    slug: "art-of-the-private-performance",
    title: "The Art of the Private Performance",
    excerpt: "What separates a good private show from a legendary one? Production advance, room design, and the courage to ask for the unexpected.",
    kind: "guide",
    heroHue: 45,
    readMinutes: 7,
    body: "A private performance is not a smaller concert. It is a different art form entirely.\n\nThe best private shows begin months before the first note, in the production advance: power, staging, sightlines, and the acoustic character of a room never designed for amplified music. Our producers walk every venue with the artist's team, because a ballroom that seats four hundred for dinner behaves nothing like a theatre.\n\nThen there is the set itself. The artists on this platform tailor arrangements to the room — stripped-back openings, a story between songs, a request honored for the couple or the founder or the guest of honor. That intimacy is the entire point. It cannot be bought at a stadium.\n\nFinally: discretion. NDAs are standard, phones are often pouched, and the moment belongs to the room alone. When it works, guests describe it the same way every time — like the artist played their living room.",
  },
  {
    slug: "how-escrow-changed-talent-booking",
    title: "How Escrow Changed Talent Booking",
    excerpt: "Milestone-based payments ended the era of wire-and-hope. Here is how the modern booking pipeline protects both sides.",
    kind: "news",
    heroHue: 220,
    readMinutes: 5,
    body: "For decades, booking marquee talent meant wiring a six-figure deposit to an agency account and hoping. The modern pipeline looks different.\n\nOn Aurum, funds move into escrow at contract signature and release on milestones: deposit on countersignature, balance at event completion, documented at every step. Cancellation terms are encoded in the contract itself, so refunds follow rules agreed before anyone commits.\n\nFor talent, escrow means a verified client with committed funds — no more holding dates for offers that evaporate. For clients, it means the fee is never at risk ahead of delivery. Our data shows escrow-backed offers are confirmed 2.4x faster than traditional inquiries, because trust is structural rather than personal.",
  },
  {
    slug: "booking-keynotes-that-move-markets",
    title: "Booking Keynotes That Move Markets",
    excerpt: "The right speaker changes what a summit is worth. A former conference director on how the best programmers think.",
    kind: "guide",
    heroHue: 250,
    readMinutes: 6,
    body: "Ask any conference director: the keynote is the poster. It anchors ticket pricing, sponsorship decks, and press coverage before a single session is announced.\n\nThe best programmers work backwards from the room they want. A leadership summit buys credibility with a researcher or a statesman. A sales kickoff buys energy — a champion athlete, a comedian who can read a corporate room. A product launch buys attention itself.\n\nLead time is the discipline. Tier-one speakers confirm six to twelve months out, and the calendar around Davos, SXSW and earnings seasons compresses further. The programmers who win book the date first and build the agenda around it.",
  },
  {
    slug: "afrobeats-global-takeover",
    title: "Afrobeats and the New Global Stage",
    excerpt: "From Lagos to London Stadium: why the world's fastest-growing sound is reshaping event lineups everywhere.",
    kind: "news",
    heroHue: 150,
    readMinutes: 5,
    celebritySlug: "burna-boy",
    body: "When Burna Boy sold out London Stadium — 80,000 seats — he did more than set a record for African artists. He confirmed what promoters had watched building for a decade: Afrobeats is now headline economics on every continent.\n\nStreaming numbers tell one story, but bookings tell a sharper one. Festival programmers who once slotted African artists into world-music side stages now build main-stage nights around them. Corporate and luxury-brand events have followed, chasing the genre's global, young, devoted audience.\n\nFor bookers, the practical note is lead time: the top tier tours across three continents and their calendars fill a year out.",
  },
  {
    slug: "what-a-booking-fee-actually-buys",
    title: "What a Booking Fee Actually Buys",
    excerpt: "Inside the anatomy of a seven-figure appearance fee: production, team, insurance, and the hours you never see.",
    kind: "guide",
    heroHue: 41,
    readMinutes: 8,
    body: "A headline fee is the visible tip of a large operation. Behind a single evening: a touring band or glam team, production and security advances, rehearsals, travel for a party that can exceed thirty people, and insurance on all of it.\n\nUnderstanding the anatomy changes how buyers negotiate. Routing matters enormously — an artist already on your continent costs meaningfully less than a bespoke international trip. Format matters: a DJ set or moderated conversation carries a fraction of the production load of a full live show. And timing matters: off-cycle dates can unlock names that look unreachable on paper.\n\nOur booking specialists model all three levers on every inquiry, which is why quotes on Aurum are typically returned within five business days with itemized scopes.",
  },
  {
    slug: "rise-of-the-creator-headliner",
    title: "The Rise of the Creator Headliner",
    excerpt: "Creators now command audiences larger than networks. What that means for brands planning their next flagship moment.",
    kind: "news",
    heroHue: 195,
    readMinutes: 6,
    celebritySlug: "mrbeast",
    body: "The most-watched entertainer of the decade has never had a primetime slot. Creator audiences now dwarf broadcast, and the booking market has caught up: creator appearances, integrations and co-productions are the fastest-growing category on this platform.\n\nWhat brands are learning is that creator bookings are format-native. A traditional appearance contract — arrive, perform, depart — misses the point. The value is in the content: an integration inside a video watched by two hundred million people outperforms any billboard on earth.\n\nThe winning structure pairs an appearance with a content commitment, negotiated with the creator's studio as a production partner rather than a vendor.",
  },
];

async function main() {
  console.log("Seeding Aurum demo world…");

  // Wipe in dependency order (idempotent reseeds)
  await db.auditLog.deleteMany();
  await db.notification.deleteMany();
  await db.message.deleteMany();
  await db.conversationParticipant.deleteMany();
  await db.conversation.deleteMany();
  await db.contract.deleteMany();
  await db.invoice.deleteMany();
  await db.payment.deleteMany();
  await db.bookingEvent.deleteMany();
  await db.booking.deleteMany();
  await db.savedCelebrity.deleteMany();
  await db.review.deleteMany();
  await db.media.deleteMany();
  await db.event.deleteMany();
  await db.article.deleteMany();
  await db.availability.deleteMany();
  await db.celebrity.deleteMany();
  await db.manager.deleteMany();
  await db.category.deleteMany();
  await db.country.deleteMany();
  await db.newsletterSubscriber.deleteMany();
  await db.session.deleteMany();
  await db.account.deleteMany();
  await db.user.deleteMany();

  const password = await bcrypt.hash("aurum-demo", 10);
  const photos = loadPhotoManifest();
  const photoCount = Object.keys(photos).length;
  console.log(
    photoCount > 0
      ? `Photography: ${photoCount} freely-licensed portraits found`
      : "Photography: none yet — run `npm run fetch:images` (generated art in use)"
  );

  // ── Demo accounts, one per role ──
  const [client, admin] = await Promise.all([
    db.user.create({
      data: {
        name: "Ava Sinclair",
        email: "client@aurum.demo",
        role: "USER",
        passwordHash: password,
        company: "Solstice Events",
        bio: "Producing flagship brand moments across three continents.",
      },
    }),
    db.user.create({
      data: {
        name: "Nova Adeyemi",
        email: "admin@aurum.demo",
        role: "ADMIN",
        passwordHash: password,
        company: "Aurum",
      },
    }),
  ]);

  const extraClients = await Promise.all(
    [
      ["Elena Vasquez", "elena@meridianfoundation.demo", "Meridian Foundation"],
      ["Thomas Wright", "thomas@halcyonmotors.demo", "Halcyon Motors"],
      ["Priya Sharma", "priya@solsticeweddings.demo", "Solstice Weddings"],
      ["Daniel Osei", "daniel@vertexsummit.demo", "Vertex Summit"],
    ].map(([name, email, company]) =>
      db.user.create({
        data: { name, email, role: "USER", passwordHash: password, company },
      })
    )
  );

  // ── Reference data ──
  const categories = Object.fromEntries(
    await Promise.all(
      CATEGORIES.map(async (c) => [
        c.slug,
        await db.category.create({ data: { slug: c.slug, name: c.name, tagline: c.tagline } }),
      ])
    )
  );
  const countries = Object.fromEntries(
    await Promise.all(
      COUNTRIES.map(async (c) => [
        c.code,
        await db.country.create({ data: { code: c.code, name: c.name, flag: c.flag } }),
      ])
    )
  );

  // ── Managers (with dashboard logins) ──
  const managers = [] as { id: string }[];
  for (const [i, m] of MANAGERS.entries()) {
    const user = await db.user.create({
      data: {
        name: m.name,
        email: `manager${i === 0 ? "" : i}@aurum.demo`,
        role: "MANAGER",
        passwordHash: password,
        company: m.agency,
      },
    });
    managers.push(
      await db.manager.create({
        data: {
          userId: user.id,
          agencyName: m.agency,
          title: m.title,
          yearsActive: m.years,
        },
      })
    );
  }

  // ── Celebrities ──
  const talentUser = await db.user.create({
    data: {
      name: "Burna Boy",
      email: "talent@aurum.demo",
      role: "TALENT",
      passwordHash: password,
      bio: "African Giant. Managed by Continental Entertainment.",
    },
  });

  const celebs: Record<string, { id: string; name: string; slug: string }> = {};
  for (const c of CELEBRITIES) {
    const photo = photos[c.slug];
    const created = await db.celebrity.create({
      data: {
        slug: c.slug,
        name: c.name,
        photo: photo
          ? JSON.stringify({
              portrait: photo.portrait,
              wide: photo.wide,
              blur: photo.blur,
              credit: photo.credit,
              licence: photo.licence,
              licenceUrl: photo.licenceUrl,
              sourceUrl: photo.sourceUrl,
              source: photo.source,
            })
          : null,
        userId: c.slug === "burna-boy" ? talentUser.id : undefined,
        tagline: c.tagline,
        bio: c.bio,
        gender: c.gender,
        featured: c.featured ?? false,
        trendingScore: c.trendingScore,
        popularity: c.popularity,
        rating: c.rating,
        reviewCount: c.reviewCount,
        followers: c.followers,
        feeFromCents: c.feeFrom * 100,
        feeToCents: c.feeTo * 100,
        availability: c.availability,
        yearsActive: c.yearsActive,
        accentHue: c.accentHue,
        achievements: JSON.stringify(c.achievements),
        awards: JSON.stringify(c.awards),
        works: JSON.stringify(c.works),
        socials: JSON.stringify(c.socials),
        faq: JSON.stringify(c.faq),
        categoryId: categories[c.category].id,
        countryId: countries[c.country].id,
        managerId: managers[c.manager - 1].id,
      },
    });
    celebs[c.slug] = created;

    // Media rows carry provenance for the /credits page and admin media manager
    if (photo) {
      await db.media.create({
        data: {
          celebrityId: created.id,
          kind: "portrait",
          url: photo.portrait,
          alt: `Photograph of ${c.name}`,
          width: photo.width,
          height: photo.height,
          credit: photo.credit,
          licence: photo.licence,
          licenceUrl: photo.licenceUrl,
          sourceUrl: photo.sourceUrl,
          source: photo.source,
          blurDataUrl: photo.blur,
        },
      });
      for (const g of photo.gallery ?? []) {
        await db.media.create({
          data: {
            celebrityId: created.id,
            kind: "gallery",
            url: g.url,
            alt: `Photograph of ${c.name}`,
            credit: g.credit,
            licence: g.licence,
            sourceUrl: g.sourceUrl,
            source: photo.source,
          },
        });
      }
    }

    // 90 days of availability, character depends on headline availability state
    const openBias = c.availability === "available" ? 0.72 : c.availability === "limited" ? 0.4 : 0.12;
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const days = [] as { celebrityId: string; date: Date; status: string }[];
    for (let d = 7; d < 97; d++) {
      const date = new Date(today);
      date.setUTCDate(date.getUTCDate() + d);
      const r = rand();
      const status = r < openBias ? "open" : r < openBias + 0.12 ? "held" : "booked";
      days.push({ celebrityId: created.id, date, status });
    }
    await db.availability.createMany({ data: days });

    // Reviews from the pool, rotated per celebrity for variety.
    //
    // Drawn without replacement: sampling randomly put the same review, by the
    // same reviewer, twice side by side on a profile, which reads as a bug.
    const reviewers = [client, ...extraClients];
    const n = 2 + Math.floor(rand() * 3);
    const offset = Math.floor(rand() * REVIEW_POOL.length);
    const reviewerOffset = Math.floor(rand() * reviewers.length);
    for (let i = 0; i < n; i++) {
      const r = REVIEW_POOL[(offset + i) % REVIEW_POOL.length];
      await db.review.create({
        data: {
          celebrityId: created.id,
          authorId: reviewers[(reviewerOffset + i) % reviewers.length].id,
          rating: r.rating,
          title: r.title,
          body: r.body,
          eventType: r.eventType,
        },
      });
    }
  }

  // ── Upcoming public events ──
  const eventSeeds: [string, string, string, string, string, number][] = [
    ["burna-boy", "I Told Them… World Tour", "concert", "Accra", "Black Star Square", 21],
    ["the-weeknd", "After Hours til Dawn — Finale", "concert", "São Paulo", "Estádio MorumBIS", 34],
    ["kevin-hart", "Acting My Age Tour", "concert", "Chicago", "United Center", 18],
    ["trevor-noah", "Off the Record — European Leg", "concert", "Amsterdam", "Ziggo Dome", 27],
    ["brene-brown", "Dare to Lead Live", "speaking", "Austin", "Moody Center", 41],
    ["simon-sinek", "The Optimism Tour", "speaking", "London", "Royal Albert Hall", 48],
    ["charli-damelio", "Creator Con Keynote", "meet-greet", "Los Angeles", "LA Convention Center", 55],
    ["gordon-ramsay", "An Evening with Gordon Ramsay", "tv-appearance", "Sydney", "ICC Sydney", 62],
  ];
  for (const [slug, title, eventType, city, venue, inDays] of eventSeeds) {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() + inDays);
    await db.event.create({
      data: { celebrityId: celebs[slug].id, title, eventType, city, venue, date },
    });
  }

  // ── Articles ──
  for (const [i, a] of ARTICLES.entries()) {
    const publishedAt = new Date();
    publishedAt.setUTCDate(publishedAt.getUTCDate() - (3 + i * 9));
    await db.article.create({
      data: {
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt,
        body: a.body,
        kind: a.kind,
        heroHue: a.heroHue,
        readMinutes: a.readMinutes,
        publishedAt,
        celebrityId: a.celebritySlug ? celebs[a.celebritySlug].id : undefined,
      },
    });
  }

  // ── A worked booking pipeline for the demo client ──
  async function seedBooking(opts: {
    ref: string;
    clientId: string;
    slug: string;
    status: string;
    eventType: string;
    inDays: number;
    city: string;
    country: string;
    venue: string;
    guests: number;
    budget: number;
    quote?: number;
    history: string[];
  }) {
    const eventDate = new Date();
    eventDate.setUTCDate(eventDate.getUTCDate() + opts.inDays);
    const booking = await db.booking.create({
      data: {
        reference: opts.ref,
        clientId: opts.clientId,
        celebrityId: celebs[opts.slug].id,
        status: opts.status,
        eventType: opts.eventType,
        eventDate,
        city: opts.city,
        countryName: opts.country,
        venue: opts.venue,
        guestCount: opts.guests,
        budgetCents: opts.budget * 100,
        quoteCents: (opts.quote ?? opts.budget) * 100,
        depositCents: Math.round((opts.quote ?? opts.budget) * 0.25) * 100,
        requests: "Full production advance required. Dietary and security riders to follow.",
      },
    });
    let t = new Date();
    t.setUTCDate(t.getUTCDate() - opts.history.length * 2);
    for (const status of opts.history) {
      await db.bookingEvent.create({
        data: { bookingId: booking.id, status, createdAt: new Date(t) },
      });
      t = new Date(t.getTime() + 2 * 86400_000);
    }
    return booking;
  }

  const b1 = await seedBooking({
    ref: "AUR-2026-0142",
    clientId: client.id,
    slug: "burna-boy",
    status: "DEPOSIT_PAID",
    eventType: "corporate",
    inDays: 45,
    city: "Dubai",
    country: "United Arab Emirates",
    venue: "Atlantis The Royal",
    guests: 400,
    budget: 650_000,
    quote: 720_000,
    history: ["SUBMITTED", "UNDER_REVIEW", "CONTRACT_SENT", "DEPOSIT_PAID"],
  });
  const b2 = await seedBooking({
    ref: "AUR-2026-0155",
    clientId: client.id,
    slug: "brene-brown",
    status: "UNDER_REVIEW",
    eventType: "speaking",
    inDays: 72,
    city: "Singapore",
    country: "Singapore",
    venue: "Marina Bay Sands Expo",
    guests: 1200,
    budget: 250_000,
    history: ["SUBMITTED", "UNDER_REVIEW"],
  });
  const b3 = await seedBooking({
    ref: "AUR-2025-0961",
    clientId: client.id,
    slug: "kevin-hart",
    status: "COMPLETED",
    eventType: "award-show",
    inDays: -60,
    city: "New York",
    country: "United States",
    venue: "Cipriani Wall Street",
    guests: 350,
    budget: 400_000,
    history: ["SUBMITTED", "UNDER_REVIEW", "CONTRACT_SENT", "DEPOSIT_PAID", "CONFIRMED", "COMPLETED"],
  });
  await seedBooking({
    ref: "AUR-2026-0170",
    clientId: extraClients[0].id,
    slug: "zendaya",
    status: "CONTRACT_SENT",
    eventType: "endorsement",
    inDays: 90,
    city: "Paris",
    country: "France",
    venue: "—",
    guests: 0,
    budget: 900_000,
    history: ["SUBMITTED", "UNDER_REVIEW", "CONTRACT_SENT"],
  });
  await seedBooking({
    ref: "AUR-2026-0181",
    clientId: extraClients[3].id,
    slug: "simon-sinek",
    status: "SUBMITTED",
    eventType: "speaking",
    inDays: 120,
    city: "Toronto",
    country: "Canada",
    venue: "Metro Toronto Convention Centre",
    guests: 2000,
    budget: 180_000,
    history: ["SUBMITTED"],
  });

  // Payments + invoices + contract for the active pipeline booking
  await db.payment.create({
    data: {
      bookingId: b1.id,
      kind: "deposit",
      status: "held_in_escrow",
      amountCents: 180_000_00,
      provider: "stripe",
      providerRef: "pi_demo_3XyZ",
      escrowUntil: b1.eventDate!,
    },
  });
  await db.payment.create({
    data: {
      bookingId: b3.id,
      kind: "deposit",
      status: "released",
      amountCents: 100_000_00,
      provider: "stripe",
    },
  });
  await db.payment.create({
    data: {
      bookingId: b3.id,
      kind: "balance",
      status: "released",
      amountCents: 300_000_00,
      provider: "paypal",
    },
  });
  const due1 = new Date();
  due1.setUTCDate(due1.getUTCDate() + 14);
  await db.invoice.create({
    data: {
      number: "INV-2026-0087",
      bookingId: b1.id,
      userId: client.id,
      status: "paid",
      lineItems: JSON.stringify([
        { label: "Booking deposit (25%)", amountCents: 180_000_00 },
        { label: "Platform & escrow fee", amountCents: 7_200_00 },
      ]),
      totalCents: 187_200_00,
      dueDate: due1,
      paidAt: new Date(),
    },
  });
  await db.invoice.create({
    data: {
      number: "INV-2026-0088",
      bookingId: b1.id,
      userId: client.id,
      status: "issued",
      lineItems: JSON.stringify([
        { label: "Balance on completion (75%)", amountCents: 540_000_00 },
      ]),
      totalCents: 540_000_00,
      dueDate: b1.eventDate!,
    },
  });
  await db.invoice.create({
    data: {
      number: "INV-2025-0512",
      bookingId: b3.id,
      userId: client.id,
      status: "paid",
      lineItems: JSON.stringify([{ label: "Full engagement fee", amountCents: 400_000_00 }]),
      totalCents: 400_000_00,
      dueDate: b3.eventDate!,
      paidAt: b3.eventDate!,
    },
  });
  await db.contract.create({
    data: {
      bookingId: b1.id,
      status: "executed",
      title: "Private Performance Agreement — AUR-2026-0142",
      sentAt: new Date(Date.now() - 6 * 86400_000),
      signedAt: new Date(Date.now() - 4 * 86400_000),
      body: "This Private Performance Agreement is entered into between Solstice Events (\"Client\") and Continental Entertainment obo the Artist. The Artist shall render one (1) performance of no less than seventy-five (75) minutes at Atlantis The Royal, Dubai. Deposit of 25% is held in escrow at signature and released per the milestone schedule in Exhibit B. Cancellation by Client within 30 days of the Event forfeits the deposit; force majeure terms per Exhibit C. [Demo contract — not a legal instrument.]",
    },
  });

  // ── Conversation on the active booking ──
  const managerUserId = (await db.manager.findUnique({
    where: { id: managers[2].id },
    select: { userId: true },
  }))!.userId;
  const convo = await db.conversation.create({
    data: {
      bookingId: b1.id,
      subject: "AUR-2026-0142 · Burna Boy — Dubai corporate",
      participants: {
        create: [
          { userId: client.id, lastReadAt: new Date() },
          { userId: managerUserId },
        ],
      },
    },
  });
  const msgs: [string, string, number][] = [
    [managerUserId, "Wonderful news — the deposit cleared escrow this morning. We're confirmed for the 45-day window.", 96],
    [client.id, "Fantastic. Can we schedule the production advance call for next week? Our AV vendor needs the technical rider.", 72],
    [managerUserId, "Absolutely. Rider attached to the contract exhibit — Tuesday 3pm GST works for the tour manager.", 70],
    [client.id, "Tuesday works. One more thing: the CEO would like a 10-minute meet & greet before the set. Possible?", 26],
    [managerUserId, "Yes — we'll add a 15-minute private reception before doors. No extra fee for this scope.", 2],
  ];
  for (const [senderId, body, hoursAgo] of msgs) {
    await db.message.create({
      data: {
        conversationId: convo.id,
        senderId,
        body,
        createdAt: new Date(Date.now() - hoursAgo * 3600_000),
      },
    });
  }

  // ── Saved list, notifications, audit ──
  for (const slug of ["taylor-swift", "zendaya", "trevor-noah", "mrbeast"]) {
    await db.savedCelebrity.create({ data: { userId: client.id, celebrityId: celebs[slug].id } });
  }
  const notifs: [string, string, string, string][] = [
    ["payment", "Deposit secured in escrow", "Your $180,000 deposit for AUR-2026-0142 is held in escrow until event completion.", "/dashboard/bookings"],
    ["contract", "Contract executed", "The Private Performance Agreement for Burna Boy has been signed by all parties.", "/dashboard/bookings"],
    ["message", "New message from Amara Okafor", "\"Yes — we'll add a 15-minute private reception before doors…\"", "/dashboard/messages"],
    ["booking", "Booking under review", "Your keynote inquiry for Brené Brown is with her speaking bureau.", "/dashboard/bookings"],
  ];
  for (const [i, [kind, title, body, href]] of notifs.entries()) {
    await db.notification.create({
      data: {
        userId: client.id,
        kind,
        title,
        body,
        href,
        readAt: i > 2 ? new Date() : null,
        createdAt: new Date(Date.now() - i * 7 * 3600_000),
      },
    });
  }
  await db.auditLog.createMany({
    data: [
      { actorId: admin.id, action: "booking.status_changed", entity: `Booking:${b1.id}`, detail: '{"from":"CONTRACT_SENT","to":"DEPOSIT_PAID"}' },
      { actorId: admin.id, action: "payment.escrow_hold", entity: `Booking:${b1.id}`, detail: '{"amountCents":18000000,"provider":"stripe"}' },
      { actorId: null, action: "user.login", entity: `User:${client.id}`, ip: "203.0.113.24" },
      { actorId: admin.id, action: "review.published", entity: "Review:*", detail: '{"count":3}' },
    ],
  });

  const counts = {
    users: await db.user.count(),
    celebrities: await db.celebrity.count(),
    bookings: await db.booking.count(),
    reviews: await db.review.count(),
    availability: await db.availability.count(),
    articles: await db.article.count(),
  };
  console.log("Seed complete:", counts);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
