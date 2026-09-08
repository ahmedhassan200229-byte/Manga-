import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  real,
  timestamp,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";

export const seriesStatusEnum = pgEnum("series_status", [
  "ongoing",
  "completed",
  "hiatus",
]);

export const seriesTypeEnum = pgEnum("series_type", [
  "manhwa",
  "manga",
  "manhua",
  "novel",
]);

export const series = pgTable("series", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  titleAr: varchar("title_ar", { length: 255 }).notNull(),
  titleEn: varchar("title_en", { length: 255 }).notNull(),
  description: text("description").notNull(),
  coverImage: text("cover_image").notNull(),
  bannerImage: text("banner_image"),
  author: varchar("author", { length: 255 }),
  artist: varchar("artist", { length: 255 }),
  status: seriesStatusEnum("status").default("ongoing").notNull(),
  type: seriesTypeEnum("type").default("manhwa").notNull(),
  year: integer("year"),
  rating: real("rating").default(8.5).notNull(),
  ratingsCount: integer("ratings_count").default(0).notNull(),
  views: integer("views").default(0).notNull(),
  likes: integer("likes").default(0).notNull(),
  featured: boolean("featured").default(false).notNull(),
  trending: boolean("trending").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const genres = pgTable("genres", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
});

export const seriesGenres = pgTable("series_genres", {
  id: serial("id").primaryKey(),
  seriesId: integer("series_id")
    .notNull()
    .references(() => series.id, { onDelete: "cascade" }),
  genreId: integer("genre_id")
    .notNull()
    .references(() => genres.id, { onDelete: "cascade" }),
});

export const chapters = pgTable("chapters", {
  id: serial("id").primaryKey(),
  seriesId: integer("series_id")
    .notNull()
    .references(() => series.id, { onDelete: "cascade" }),
  number: real("number").notNull(),
  title: varchar("title", { length: 255 }),
  views: integer("views").default(0).notNull(),
  pagesCount: integer("pages_count").default(12).notNull(),
  pageUrls: text("page_urls"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  seriesId: integer("series_id").references(() => series.id, {
    onDelete: "cascade",
  }),
  chapterId: integer("chapter_id").references(() => chapters.id, {
    onDelete: "cascade",
  }),
  userName: varchar("user_name", { length: 100 }).notNull(),
  avatarColor: varchar("avatar_color", { length: 20 }),
  content: text("content").notNull(),
  likes: integer("likes").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const bookmarks = pgTable("bookmarks", {
  id: serial("id").primaryKey(),
  userKey: varchar("user_key", { length: 100 }).notNull(),
  seriesId: integer("series_id")
    .notNull()
    .references(() => series.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const ratings = pgTable("ratings", {
  id: serial("id").primaryKey(),
  userKey: varchar("user_key", { length: 100 }).notNull(),
  seriesId: integer("series_id")
    .notNull()
    .references(() => series.id, { onDelete: "cascade" }),
  value: integer("value").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Series = typeof series.$inferSelect;
export type Genre = typeof genres.$inferSelect;
export type Chapter = typeof chapters.$inferSelect;
export type Comment = typeof comments.$inferSelect;
