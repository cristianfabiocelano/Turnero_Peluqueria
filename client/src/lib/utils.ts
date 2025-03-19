import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Custom date formatter for Spanish locale
export function formatDate(date: Date): string {
  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  
  return `${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
}

// Get time slots for a given date
export function getTimeSlots(date: Date): string[] {
  // In a real app, we would check availability from the database
  // For now, return fixed time slots
  return [
    "10:00", "11:00", "12:00", "13:00", 
    "14:00", "15:00", "16:00", "17:00", "18:00"
  ];
}

// Check if a time slot is available
export function isTimeSlotAvailable(date: Date, time: string, bookedSlots: string[]): boolean {
  // In a real app, we would check against existing appointments
  // For simplicity, we'll just check against a fixed list
  const dateString = date.toISOString().split('T')[0];
  const unavailableSlots = bookedSlots.filter(slot => slot === time);
  
  return unavailableSlots.length === 0;
}

// Get icon component name from string
export function getIconName(iconName: string): string {
  const icons: Record<string, string> = {
    "scissors": "Scissors",
    "palette": "Palette",
    "wind": "Wind",
    "droplet": "Droplet",
    "feather": "Feather"
  };
  
  return icons[iconName] || "Scissors";
}

// Function to generate unique IDs for form elements
export function generateId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 11)}`;
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate phone number format (simple validation)
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  return phoneRegex.test(phone);
}

// Format price in Argentinian Pesos
export function formatPrice(price: number): string {
  return `$${price.toLocaleString('es-AR')}`;
}

// Convert service duration from minutes to readable format
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} hora${hours > 1 ? 's' : ''}`;
  }
  
  return `${hours} hora${hours > 1 ? 's' : ''} ${remainingMinutes} min`;
}
