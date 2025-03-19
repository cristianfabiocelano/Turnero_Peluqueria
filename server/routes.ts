import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertAppointmentSchema, 
  contactMessageSchema, 
  insertServiceSchema, 
  insertStylistSchema, 
  insertAvailableDaySchema, 
  insertAvailableTimeSlotSchema,
  insertGalleryItemSchema,
  insertUserSchema
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { setupAuth } from "./auth";

// Middleware para verificar si el usuario está autenticado como administrador
function isAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated() && (req.user as any).isAdmin) {
    next();
  } else {
    res.status(401).json({ message: "No autorizado" });
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Configurar la autenticación
  setupAuth(app);
  
  // API routes
  // Get all services
  app.get("/api/services", async (req: Request, res: Response) => {
    try {
      const services = await storage.getServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Error fetching services" });
    }
  });
  
  // Get all stylists
  app.get("/api/stylists", async (req: Request, res: Response) => {
    try {
      const stylists = await storage.getStylists();
      res.json(stylists);
    } catch (error) {
      res.status(500).json({ message: "Error fetching stylists" });
    }
  });
  
  // Get all gallery items
  app.get("/api/gallery", async (req: Request, res: Response) => {
    try {
      const galleryItems = await storage.getGalleryItems();
      res.json(galleryItems);
    } catch (error) {
      res.status(500).json({ message: "Error fetching gallery items" });
    }
  });
  
  // Get appointments by date (for availability checking)
  app.get("/api/appointments/:date", async (req: Request, res: Response) => {
    try {
      const { date } = req.params;
      const appointments = await storage.getAppointmentsByDate(date);
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: "Error fetching appointments" });
    }
  });
  
  // Create a new appointment
  app.post("/api/appointments", async (req: Request, res: Response) => {
    try {
      const appointmentData = insertAppointmentSchema.parse(req.body);
      const appointment = await storage.createAppointment(appointmentData);
      res.status(201).json(appointment);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        res.status(500).json({ message: "Error creating appointment" });
      }
    }
  });
  
  // Submit contact form
  app.post("/api/contact", async (req: Request, res: Response) => {
    try {
      const contactData = contactMessageSchema.parse(req.body);
      await storage.submitContactMessage(contactData);
      res.status(200).json({ message: "Mensaje enviado correctamente" });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        res.status(500).json({ message: "Error al enviar el mensaje" });
      }
    }
  });

  // ===== RUTAS ADMIN =====
  // Obtener todas las citas (solo admin)
  app.get("/api/admin/appointments", isAdmin, async (req: Request, res: Response) => {
    try {
      const appointments = await storage.getAppointments();
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: "Error getting appointments" });
    }
  });

  // Obtener una cita por ID (solo admin)
  app.get("/api/admin/appointments/:id", isAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const appointment = await storage.getAppointment(parseInt(id));
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      res.json(appointment);
    } catch (error) {
      res.status(500).json({ message: "Error getting appointment" });
    }
  });

  // Actualizar una cita (solo admin)
  app.put("/api/admin/appointments/:id", isAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const appointmentId = parseInt(id);
      const appointment = await storage.getAppointment(appointmentId);
      
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      
      const appointmentData = insertAppointmentSchema.partial().parse(req.body);
      const updatedAppointment = await storage.updateAppointment(appointmentId, appointmentData);
      
      res.json(updatedAppointment);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        res.status(500).json({ message: "Error updating appointment" });
      }
    }
  });

  // Eliminar una cita (solo admin)
  app.delete("/api/admin/appointments/:id", isAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const appointmentId = parseInt(id);
      const appointment = await storage.getAppointment(appointmentId);
      
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      
      await storage.deleteAppointment(appointmentId);
      res.json({ message: "Appointment deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting appointment" });
    }
  });

  // SERVICIOS ADMIN
  // Crear un nuevo servicio (solo admin)
  app.post("/api/admin/services", isAdmin, async (req: Request, res: Response) => {
    try {
      const serviceData = insertServiceSchema.parse(req.body);
      const service = await storage.createService(serviceData);
      res.status(201).json(service);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        res.status(500).json({ message: "Error creating service" });
      }
    }
  });

  // Actualizar un servicio (solo admin)
  app.put("/api/admin/services/:id", isAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const serviceId = parseInt(id);
      const service = await storage.getService(serviceId);
      
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
      
      const serviceData = insertServiceSchema.partial().parse(req.body);
      const updatedService = await storage.updateService(serviceId, serviceData);
      
      res.json(updatedService);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        res.status(500).json({ message: "Error updating service" });
      }
    }
  });

  // Eliminar un servicio (solo admin)
  app.delete("/api/admin/services/:id", isAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const serviceId = parseInt(id);
      const service = await storage.getService(serviceId);
      
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
      
      await storage.deleteService(serviceId);
      res.json({ message: "Service deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting service" });
    }
  });

  // ESTILISTAS ADMIN
  // Crear un nuevo estilista (solo admin)
  app.post("/api/admin/stylists", isAdmin, async (req: Request, res: Response) => {
    try {
      const stylistData = insertStylistSchema.parse(req.body);
      const stylist = await storage.createStylist(stylistData);
      res.status(201).json(stylist);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        res.status(500).json({ message: "Error creating stylist" });
      }
    }
  });

  // Actualizar un estilista (solo admin)
  app.put("/api/admin/stylists/:id", isAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const stylistId = parseInt(id);
      const stylist = await storage.getStylist(stylistId);
      
      if (!stylist) {
        return res.status(404).json({ message: "Stylist not found" });
      }
      
      const stylistData = insertStylistSchema.partial().parse(req.body);
      const updatedStylist = await storage.updateStylist(stylistId, stylistData);
      
      res.json(updatedStylist);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        res.status(500).json({ message: "Error updating stylist" });
      }
    }
  });

  // Eliminar un estilista (solo admin)
  app.delete("/api/admin/stylists/:id", isAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const stylistId = parseInt(id);
      const stylist = await storage.getStylist(stylistId);
      
      if (!stylist) {
        return res.status(404).json({ message: "Stylist not found" });
      }
      
      await storage.deleteStylist(stylistId);
      res.json({ message: "Stylist deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting stylist" });
    }
  });

  // DÍAS DISPONIBLES ADMIN
  // Obtener todos los días disponibles
  app.get("/api/available-days", async (req: Request, res: Response) => {
    try {
      const days = await storage.getAvailableDays();
      res.json(days);
    } catch (error) {
      res.status(500).json({ message: "Error getting available days" });
    }
  });

  // Crear un nuevo día disponible (solo admin)
  app.post("/api/admin/available-days", isAdmin, async (req: Request, res: Response) => {
    try {
      const dayData = insertAvailableDaySchema.parse(req.body);
      const day = await storage.createAvailableDay(dayData);
      res.status(201).json(day);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        res.status(500).json({ message: "Error creating available day" });
      }
    }
  });

  // Actualizar un día disponible (solo admin)
  app.put("/api/admin/available-days/:id", isAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const dayId = parseInt(id);
      const day = await storage.getAvailableDay(dayId);
      
      if (!day) {
        return res.status(404).json({ message: "Available day not found" });
      }
      
      const dayData = insertAvailableDaySchema.partial().parse(req.body);
      const updatedDay = await storage.updateAvailableDay(dayId, dayData);
      
      res.json(updatedDay);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        res.status(500).json({ message: "Error updating available day" });
      }
    }
  });

  // HORARIOS DISPONIBLES ADMIN
  // Obtener todos los horarios disponibles
  app.get("/api/available-time-slots", async (req: Request, res: Response) => {
    try {
      const timeSlots = await storage.getAvailableTimeSlots();
      res.json(timeSlots);
    } catch (error) {
      res.status(500).json({ message: "Error getting available time slots" });
    }
  });

  // Crear un nuevo horario disponible (solo admin)
  app.post("/api/admin/available-time-slots", isAdmin, async (req: Request, res: Response) => {
    try {
      const slotData = insertAvailableTimeSlotSchema.parse(req.body);
      const slot = await storage.createAvailableTimeSlot(slotData);
      res.status(201).json(slot);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        res.status(500).json({ message: "Error creating available time slot" });
      }
    }
  });

  // Actualizar un horario disponible (solo admin)
  app.put("/api/admin/available-time-slots/:id", isAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const slotId = parseInt(id);
      const slot = await storage.getAvailableTimeSlot(slotId);
      
      if (!slot) {
        return res.status(404).json({ message: "Available time slot not found" });
      }
      
      const slotData = insertAvailableTimeSlotSchema.partial().parse(req.body);
      const updatedSlot = await storage.updateAvailableTimeSlot(slotId, slotData);
      
      res.json(updatedSlot);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        res.status(500).json({ message: "Error updating available time slot" });
      }
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
