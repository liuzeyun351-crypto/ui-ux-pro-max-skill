import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";

export type CelebrityWithRefs = Prisma.CelebrityGetPayload<{
  include: { category: true; country: true; manager: { include: { user: true } } };
}>;

export const celebrityInclude = {
  category: true,
  country: true,
  manager: { include: { user: true } },
} satisfies Prisma.CelebrityInclude;

export interface DirectoryFilters {
  q?: string;
  category?: string;
  country?: string;
  gender?: string;
  availability?: string;
  minFee?: number; // dollars
  maxFee?: number;
  verified?: boolean;
  sort?: "popularity" | "price-asc" | "price-desc" | "trending" | "recent" | "az";
  cursor?: number; // offset pagination for infinite scroll
  take?: number;
}

export async function queryCelebrities(f: DirectoryFilters) {
  const where: Prisma.CelebrityWhereInput = {};
  if (f.q) {
    const q = f.q.trim();
    where.OR = [
      { name: { contains: q } },
      { tagline: { contains: q } },
      { bio: { contains: q } },
      { category: { name: { contains: q } } },
      { country: { name: { contains: q } } },
    ];
  }
  if (f.category) where.category = { slug: f.category };
  if (f.country) where.country = { code: f.country };
  if (f.gender) where.gender = f.gender;
  if (f.availability) where.availability = f.availability;
  if (f.verified) where.verified = true;
  if (f.minFee !== undefined || f.maxFee !== undefined) {
    where.feeFromCents = {};
    if (f.minFee !== undefined) where.feeFromCents.gte = f.minFee * 100;
    if (f.maxFee !== undefined) where.feeFromCents.lte = f.maxFee * 100;
  }

  const orderBy: Prisma.CelebrityOrderByWithRelationInput[] =
    f.sort === "price-asc"
      ? [{ feeFromCents: "asc" }]
      : f.sort === "price-desc"
        ? [{ feeFromCents: "desc" }]
        : f.sort === "trending"
          ? [{ trendingScore: "desc" }]
          : f.sort === "recent"
            ? [{ createdAt: "desc" }]
            : f.sort === "az"
              ? [{ name: "asc" }]
              : [{ popularity: "desc" }];

  const take = f.take ?? 12;
  const skip = f.cursor ?? 0;
  const [items, total] = await Promise.all([
    db.celebrity.findMany({ where, orderBy, take, skip, include: celebrityInclude }),
    db.celebrity.count({ where }),
  ]);
  return { items, total, nextCursor: skip + items.length < total ? skip + items.length : null };
}

export function getFeaturedCelebrities(take = 8) {
  return db.celebrity.findMany({
    where: { featured: true },
    orderBy: { popularity: "desc" },
    take,
    include: celebrityInclude,
  });
}

export function getCelebrityBySlug(slug: string) {
  return db.celebrity.findUnique({
    where: { slug },
    include: {
      ...celebrityInclude,
      reviews: {
        where: { status: "published" },
        orderBy: { createdAt: "desc" },
        take: 6,
        include: { author: true },
      },
      events: { where: { date: { gte: new Date() } }, orderBy: { date: "asc" }, take: 4 },
      availability_: { orderBy: { date: "asc" } },
      media: { where: { kind: "gallery" }, orderBy: { createdAt: "asc" }, take: 3 },
    },
  });
}

export function getRelatedCelebrities(categoryId: string, excludeId: string, take = 4) {
  return db.celebrity.findMany({
    where: { categoryId, id: { not: excludeId } },
    orderBy: { popularity: "desc" },
    take,
    include: celebrityInclude,
  });
}

export function getCategoriesWithCounts() {
  return db.category.findMany({
    include: {
      _count: { select: { celebrities: true } },
      // The best-known name in the category, whose photograph fronts the tile.
      celebrities: {
        orderBy: { popularity: "desc" },
        take: 1,
        select: { name: true, accentHue: true, photo: true },
      },
    },
    orderBy: { name: "asc" },
  });
}

export function getCountries() {
  return db.country.findMany({ orderBy: { name: "asc" } });
}

export function getUpcomingEvents(take = 6) {
  return db.event.findMany({
    where: { isPublic: true, date: { gte: new Date() } },
    orderBy: { date: "asc" },
    take,
    include: { celebrity: { include: { category: true } } },
  });
}

export function getArticles(take?: number) {
  return db.article.findMany({
    orderBy: { publishedAt: "desc" },
    ...(take ? { take } : {}),
    include: { celebrity: true, heroTalent: true },
  });
}

export function getManagersWithRoster() {
  return db.manager.findMany({
    include: {
      user: true,
      celebrities: { orderBy: { popularity: "desc" }, take: 4 },
      _count: { select: { celebrities: true } },
    },
    orderBy: { yearsActive: "desc" },
  });
}
