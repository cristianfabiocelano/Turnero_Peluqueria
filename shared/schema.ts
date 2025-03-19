import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  isAdmin: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  duration: integer("duration").notNull(), // in minutes
  imageUrl: text("image_url").notNull(),
  icon: text("icon").notNull(),
});

export const insertServiceSchema = createInsertSchema(services);
export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;

export const stylists = pgTable("stylists", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
});

export const insertStylistSchema = createInsertSchema(stylists);
export type InsertStylist = z.infer<typeof insertStylistSchema>;
export type Stylist = typeof stylists.$inferSelect;

export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  serviceId: integer("service_id").notNull(),
  stylistId: integer("stylist_id"),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  comments: text("comments"),
});

export const insertAppointmentSchema = createInsertSchema(appointments).pick({
  serviceId: true,
  stylistId: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  date: true,
  time: true,
  comments: true
});

export const contactMessageSchema = z.object({
  name: z.string().min(1, "Nombre es requerido"),
  email: z.string().email("Email inválido"),
  subject: z.string().min(1, "Asunto es requerido"),
  message: z.string().min(1, "Mensaje es requerido")
});

export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Appointment = typeof appointments.$inferSelect;
export type ContactMessage = z.infer<typeof contactMessageSchema>;

export const galleryItems = pgTable("gallery_items", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  description: text("description").notNull(),
});

export const insertGalleryItemSchema = createInsertSchema(galleryItems);
export type InsertGalleryItem = z.infer<typeof insertGalleryItemSchema>;
export type GalleryItem = typeof galleryItems.$inferSelect;

export const availableDays = pgTable("available_days", {
  id: serial("id").primaryKey(),
  date: text("date").notNull().unique(),
  isAvailable: boolean("is_available").default(true).notNull(),
});

export const insertAvailableDaySchema = createInsertSchema(availableDays);
export type InsertAvailableDay = z.infer<typeof insertAvailableDaySchema>;
export type AvailableDay = typeof availableDays.$inferSelect;

export const availableTimeSlots = pgTable("available_time_slots", {
  id: serial("id").primaryKey(),
  time: text("time").notNull().unique(),
  isAvailable: boolean("is_available").default(true).notNull(),
});

export const insertAvailableTimeSlotSchema = createInsertSchema(availableTimeSlots);
export type InsertAvailableTimeSlot = z.infer<typeof insertAvailableTimeSlotSchema>;
export type AvailableTimeSlot = typeof availableTimeSlots.$inferSelect;
