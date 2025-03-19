import {
  users, type User, type InsertUser,
  services, type Service, type InsertService,
  stylists, type Stylist, type InsertStylist,
  appointments, type Appointment, type InsertAppointment,
  galleryItems, type GalleryItem, type InsertGalleryItem,
  availableDays, type AvailableDay, type InsertAvailableDay,
  availableTimeSlots, type AvailableTimeSlot, type InsertAvailableTimeSlot,
  type ContactMessage
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Services
  getServices(): Promise<Service[]>;
  getService(id: number): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, service: Partial<InsertService>): Promise<Service | undefined>;
  deleteService(id: number): Promise<boolean>;
  
  // Stylists
  getStylists(): Promise<Stylist[]>;
  getStylist(id: number): Promise<Stylist | undefined>;
  createStylist(stylist: InsertStylist): Promise<Stylist>;
  updateStylist(id: number, stylist: Partial<InsertStylist>): Promise<Stylist | undefined>;
  deleteStylist(id: number): Promise<boolean>;
  
  // Appointments
  getAppointments(): Promise<Appointment[]>;
  getAppointment(id: number): Promise<Appointment | undefined>;
  getAppointmentsByDate(date: string): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: number, appointment: Partial<InsertAppointment>): Promise<Appointment | undefined>;
  deleteAppointment(id: number): Promise<boolean>;
  
  // Gallery
  getGalleryItems(): Promise<GalleryItem[]>;
  createGalleryItem(item: InsertGalleryItem): Promise<GalleryItem>;
  updateGalleryItem(id: number, item: Partial<InsertGalleryItem>): Promise<GalleryItem | undefined>;
  deleteGalleryItem(id: number): Promise<boolean>;
  
  // Available Days
  getAvailableDays(): Promise<AvailableDay[]>;
  getAvailableDay(id: number): Promise<AvailableDay | undefined>;
  getAvailableDayByDate(date: string): Promise<AvailableDay | undefined>;
  createAvailableDay(day: InsertAvailableDay): Promise<AvailableDay>;
  updateAvailableDay(id: number, day: Partial<InsertAvailableDay>): Promise<AvailableDay | undefined>;
  deleteAvailableDay(id: number): Promise<boolean>;
  
  // Available Time Slots
  getAvailableTimeSlots(): Promise<AvailableTimeSlot[]>;
  getAvailableTimeSlot(id: number): Promise<AvailableTimeSlot | undefined>;
  getAvailableTimeSlotByTime(time: string): Promise<AvailableTimeSlot | undefined>;
  createAvailableTimeSlot(slot: InsertAvailableTimeSlot): Promise<AvailableTimeSlot>;
  updateAvailableTimeSlot(id: number, slot: Partial<InsertAvailableTimeSlot>): Promise<AvailableTimeSlot | undefined>;
  deleteAvailableTimeSlot(id: number): Promise<boolean>;
  
  // Contact
  submitContactMessage(message: ContactMessage): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private services: Map<number, Service>;
  private stylists: Map<number, Stylist>;
  private appointments: Map<number, Appointment>;
  private galleryItems: Map<number, GalleryItem>;
  private availableDays: Map<number, AvailableDay>;
  private availableTimeSlots: Map<number, AvailableTimeSlot>;
  private contactMessages: ContactMessage[];
  
  currentUserId: number;
  currentServiceId: number;
  currentStylistId: number;
  currentAppointmentId: number;
  currentGalleryItemId: number;
  currentAvailableDayId: number;
  currentAvailableTimeSlotId: number;

  constructor() {
    this.users = new Map();
    this.services = new Map();
    this.stylists = new Map();
    this.appointments = new Map();
    this.galleryItems = new Map();
    this.availableDays = new Map();
    this.availableTimeSlots = new Map();
    this.contactMessages = [];
    
    this.currentUserId = 1;
    this.currentServiceId = 1;
    this.currentStylistId = 1;
    this.currentAppointmentId = 1;
    this.currentGalleryItemId = 1;
    this.currentAvailableDayId = 1;
    this.currentAvailableTimeSlotId = 1;
    
    // Initialize with sample data asíncronamente
    this.initializeSampleData().catch(error => {
      console.error("Error al inicializar datos de muestra:", error);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id, isAdmin: insertUser.isAdmin || false };
    this.users.set(id, user);
    return user;
  }
  
  // Service methods
  async getServices(): Promise<Service[]> {
    return Array.from(this.services.values());
  }
  
  async getService(id: number): Promise<Service | undefined> {
    return this.services.get(id);
  }
  
  async createService(insertService: InsertService): Promise<Service> {
    const id = this.currentServiceId++;
    const service: Service = { ...insertService, id };
    this.services.set(id, service);
    return service;
  }
  
  async updateService(id: number, serviceData: Partial<InsertService>): Promise<Service | undefined> {
    const existingService = this.services.get(id);
    if (!existingService) return undefined;
    
    const updatedService = { ...existingService, ...serviceData };
    this.services.set(id, updatedService);
    return updatedService;
  }
  
  async deleteService(id: number): Promise<boolean> {
    return this.services.delete(id);
  }
  
  // Stylist methods
  async getStylists(): Promise<Stylist[]> {
    return Array.from(this.stylists.values());
  }
  
  async getStylist(id: number): Promise<Stylist | undefined> {
    return this.stylists.get(id);
  }
  
  async createStylist(insertStylist: InsertStylist): Promise<Stylist> {
    const id = this.currentStylistId++;
    const stylist: Stylist = { ...insertStylist, id };
    this.stylists.set(id, stylist);
    return stylist;
  }
  
  async updateStylist(id: number, stylistData: Partial<InsertStylist>): Promise<Stylist | undefined> {
    const existingStylist = this.stylists.get(id);
    if (!existingStylist) return undefined;
    
    const updatedStylist = { ...existingStylist, ...stylistData };
    this.stylists.set(id, updatedStylist);
    return updatedStylist;
  }
  
  async deleteStylist(id: number): Promise<boolean> {
    return this.stylists.delete(id);
  }
  
  // Appointment methods
  async getAppointments(): Promise<Appointment[]> {
    return Array.from(this.appointments.values());
  }
  
  async getAppointment(id: number): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }
  
  async getAppointmentsByDate(date: string): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(
      (appointment) => appointment.date === date
    );
  }
  
  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const id = this.currentAppointmentId++;
    const appointment: Appointment = { 
      ...insertAppointment, 
      id, 
      stylistId: insertAppointment.stylistId || null,
      comments: insertAppointment.comments || null
    };
    this.appointments.set(id, appointment);
    return appointment;
  }
  
  async updateAppointment(id: number, appointmentData: Partial<InsertAppointment>): Promise<Appointment | undefined> {
    const existingAppointment = this.appointments.get(id);
    if (!existingAppointment) return undefined;
    
    const updatedAppointment = { 
      ...existingAppointment, 
      ...appointmentData,
      stylistId: appointmentData.stylistId !== undefined ? appointmentData.stylistId : existingAppointment.stylistId,
      comments: appointmentData.comments !== undefined ? appointmentData.comments : existingAppointment.comments
    };
    this.appointments.set(id, updatedAppointment);
    return updatedAppointment;
  }
  
  async deleteAppointment(id: number): Promise<boolean> {
    return this.appointments.delete(id);
  }
  
  // Gallery methods
  async getGalleryItems(): Promise<GalleryItem[]> {
    return Array.from(this.galleryItems.values());
  }
  
  async createGalleryItem(insertItem: InsertGalleryItem): Promise<GalleryItem> {
    const id = this.currentGalleryItemId++;
    const item: GalleryItem = { ...insertItem, id };
    this.galleryItems.set(id, item);
    return item;
  }
  
  async updateGalleryItem(id: number, itemData: Partial<InsertGalleryItem>): Promise<GalleryItem | undefined> {
    const existingItem = this.galleryItems.get(id);
    if (!existingItem) return undefined;
    
    const updatedItem = { ...existingItem, ...itemData };
    this.galleryItems.set(id, updatedItem);
    return updatedItem;
  }
  
  async deleteGalleryItem(id: number): Promise<boolean> {
    return this.galleryItems.delete(id);
  }
  
  // Available Days methods
  async getAvailableDays(): Promise<AvailableDay[]> {
    return Array.from(this.availableDays.values());
  }
  
  async getAvailableDay(id: number): Promise<AvailableDay | undefined> {
    return this.availableDays.get(id);
  }
  
  async getAvailableDayByDate(date: string): Promise<AvailableDay | undefined> {
    return Array.from(this.availableDays.values()).find(
      (day) => day.date === date
    );
  }
  
  async createAvailableDay(insertDay: InsertAvailableDay): Promise<AvailableDay> {
    const id = this.currentAvailableDayId++;
    const day: AvailableDay = { ...insertDay, id };
    this.availableDays.set(id, day);
    return day;
  }
  
  async updateAvailableDay(id: number, dayData: Partial<InsertAvailableDay>): Promise<AvailableDay | undefined> {
    const existingDay = this.availableDays.get(id);
    if (!existingDay) return undefined;
    
    const updatedDay = { ...existingDay, ...dayData };
    this.availableDays.set(id, updatedDay);
    return updatedDay;
  }
  
  async deleteAvailableDay(id: number): Promise<boolean> {
    return this.availableDays.delete(id);
  }
  
  // Available Time Slots methods
  async getAvailableTimeSlots(): Promise<AvailableTimeSlot[]> {
    return Array.from(this.availableTimeSlots.values());
  }
  
  async getAvailableTimeSlot(id: number): Promise<AvailableTimeSlot | undefined> {
    return this.availableTimeSlots.get(id);
  }
  
  async getAvailableTimeSlotByTime(time: string): Promise<AvailableTimeSlot | undefined> {
    return Array.from(this.availableTimeSlots.values()).find(
      (slot) => slot.time === time
    );
  }
  
  async createAvailableTimeSlot(insertSlot: InsertAvailableTimeSlot): Promise<AvailableTimeSlot> {
    const id = this.currentAvailableTimeSlotId++;
    const slot: AvailableTimeSlot = { ...insertSlot, id };
    this.availableTimeSlots.set(id, slot);
    return slot;
  }
  
  async updateAvailableTimeSlot(id: number, slotData: Partial<InsertAvailableTimeSlot>): Promise<AvailableTimeSlot | undefined> {
    const existingSlot = this.availableTimeSlots.get(id);
    if (!existingSlot) return undefined;
    
    const updatedSlot = { ...existingSlot, ...slotData };
    this.availableTimeSlots.set(id, updatedSlot);
    return updatedSlot;
  }
  
  async deleteAvailableTimeSlot(id: number): Promise<boolean> {
    return this.availableTimeSlots.delete(id);
  }
  
  // Contact methods
  async submitContactMessage(message: ContactMessage): Promise<boolean> {
    this.contactMessages.push(message);
    return true;
  }
  
  // Initialize sample data for the salon
  private async initializeSampleData() {
    try {
      // Importar función de hash para contraseñas
      const { scrypt, randomBytes } = await import('crypto');
      const { promisify } = await import('util');
      const scryptAsync = promisify(scrypt);
      
      // Función para hashear contraseña
      const hashPassword = async (password: string) => {
        const salt = randomBytes(16).toString("hex");
        const buf = (await scryptAsync(password, salt, 64)) as Buffer;
        return `${buf.toString("hex")}.${salt}`;
      };
      
      // Añadir usuario administrador con contraseña hasheada
      const adminPassword = await hashPassword("Admin");
      await this.createUser({
        username: "Admin",
        password: adminPassword,
        isAdmin: true
      });
      
      // Add services
      const services: InsertService[] = [
        {
          name: "Corte de Cabello",
          description: "Cortes personalizados según tu tipo de rostro, estilo y preferencias.",
          price: 1200,
          duration: 45,
          imageUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          icon: "scissors"
        },
        {
          name: "Coloración",
          description: "Coloración integral, mechas, balayage y técnicas modernas para un look actual.",
          price: 2500,
          duration: 90,
          imageUrl: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          icon: "palette"
        },
        {
          name: "Peinados",
          description: "Peinados para eventos especiales, bodas, fiestas y cualquier ocasión.",
          price: 1800,
          duration: 60,
          imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          icon: "wind"
        },
        {
          name: "Tratamientos Capilares",
          description: "Hidratación, reestructuración y tratamientos especializados para tu cabello.",
          price: 2000,
          duration: 60,
          imageUrl: "https://images.unsplash.com/photo-1607008829749-c8051e257672?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          icon: "droplet"
        },
        {
          name: "Alisado y Keratina",
          description: "Técnicas de alisado permanente y tratamientos con keratina para un cabello disciplinado.",
          price: 3500,
          duration: 120,
          imageUrl: "https://images.unsplash.com/photo-1634302904768-15c1f3860bdc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          icon: "feather"
        },
        {
          name: "Barbería",
          description: "Corte de barba, perfilado y tratamientos para el cuidado del rostro masculino.",
          price: 900,
          duration: 30,
          imageUrl: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          icon: "scissors"
        }
      ];
      
      for (const service of services) {
        await this.createService(service);
      }
      
      // Add stylists
      const stylists: InsertStylist[] = [
        {
          name: "Carlos",
          role: "Fundador & Estilista Principal",
          description: "Especialista en cortes modernos y coloración avanzada con más de 20 años de experiencia.",
          imageUrl: "https://images.unsplash.com/photo-1537832816519-689ad163238b?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
        },
        {
          name: "Laura",
          role: "Colorista Experta",
          description: "Especializada en balayage, mechas y las últimas tendencias en coloración internacional.",
          imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
        },
        {
          name: "Martín",
          role: "Barbero Profesional",
          description: "Experto en cortes masculinos, arreglo de barba y tratamientos faciales para hombres.",
          imageUrl: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
        }
      ];
      
      for (const stylist of stylists) {
        await this.createStylist(stylist);
      }
      
      // Add gallery items
      const galleryItems: InsertGalleryItem[] = [
        {
          imageUrl: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
          description: "Corte moderno mujer"
        },
        {
          imageUrl: "https://images.unsplash.com/photo-1541576980233-97577392c3b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
          description: "Coloración balayage"
        },
        {
          imageUrl: "https://images.unsplash.com/photo-1513531926349-466f15ec8cc7?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
          description: "Corte masculino"
        },
        {
          imageUrl: "https://images.unsplash.com/photo-1508474722893-c3ccb98db1a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80", 
          description: "Peinado recogido"
        },
        {
          imageUrl: "https://images.unsplash.com/photo-1587297516206-19ae9250bdbd?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
          description: "Tratamiento capilar"
        },
        {
          imageUrl: "https://images.unsplash.com/photo-1505033575518-a36ea2ef75ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
          description: "Coloración rubia"
        },
        {
          imageUrl: "https://images.unsplash.com/photo-1585314614250-d213876625e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
          description: "Arreglo de barba"
        },
        {
          imageUrl: "https://images.unsplash.com/photo-1602798415391-06d4fc4825c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
          description: "Peinado para evento"
        }
      ];
      
      for (const item of galleryItems) {
        await this.createGalleryItem(item);
      }
      
      // Add available time slots
      const timeSlots: InsertAvailableTimeSlot[] = [
        { time: "09:00", isAvailable: true },
        { time: "10:00", isAvailable: true },
        { time: "11:00", isAvailable: true },
        { time: "12:00", isAvailable: true },
        { time: "13:00", isAvailable: false }, // Horario de almuerzo
        { time: "14:00", isAvailable: true },
        { time: "15:00", isAvailable: true },
        { time: "16:00", isAvailable: true },
        { time: "17:00", isAvailable: true },
        { time: "18:00", isAvailable: true },
        { time: "19:00", isAvailable: true },
      ];
      
      for (const slot of timeSlots) {
        await this.createAvailableTimeSlot(slot);
      }
      
      // Add available days for the next month
      const today = new Date();
      
      // Generate dates for the next 30 days
      for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(today.getDate() + i);
        
        // Format date as YYYY-MM-DD
        const formattedDate = date.toISOString().split('T')[0];
        
        // Make weekends unavailable
        const dayOfWeek = date.getDay();
        const isWeekend = dayOfWeek === 0; // 0 is Sunday, 6 is Saturday
        
        await this.createAvailableDay({
          date: formattedDate,
          isAvailable: !isWeekend
        });
      }
    } catch (error) {
      console.error('Error inicializando datos:', error);
    }
  }
}

export const storage = new MemStorage();
