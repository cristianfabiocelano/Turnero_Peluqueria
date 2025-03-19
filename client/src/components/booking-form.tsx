import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { format, addDays, isBefore, isToday } from 'date-fns';
import { es } from 'date-fns/locale';

import { 
  Calendar,
  Scissors, 
  Wind, 
  Palette, 
  Droplet, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle,
  Feather
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

import { fadeIn, slideInLeft, slideInRight } from '@/lib/animations';
import { apiRequest } from '@/lib/queryClient';
import { formatDate, formatPrice, formatDuration } from '@/lib/utils';
import { Service, Stylist, insertAppointmentSchema } from '@shared/schema';

// Form schema extension with validation
const formSchema = insertAppointmentSchema.extend({
  firstName: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  lastName: z.string().min(2, { message: "El apellido debe tener al menos 2 caracteres" }),
  email: z.string().email({ message: "Por favor ingrese un email válido" }),
  phone: z.string().min(8, { message: "Por favor ingrese un número de teléfono válido" }),
  date: z.string(),
  time: z.string(),
  serviceId: z.number(),
  stylistId: z.number().optional(),
  comments: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

type BookingFormProps = {
  services: Service[];
  stylists: Stylist[];
};

const BookingForm = ({ services, stylists }: BookingFormProps) => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(addDays(new Date(), 1));
  const [isSuccessful, setIsSuccessful] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Get appointments for selected date to check availability
  const dateString = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
  const { data: appointments = [] } = useQuery({
    queryKey: ['/api/appointments', dateString],
    queryFn: () => fetch(`/api/appointments/${dateString}`).then(res => res.json()),
    enabled: !!dateString
  });

  // Get available time slots
  const availableTimeSlots = [
    "10:00", "11:00", "12:00", "13:00", 
    "14:00", "15:00", "16:00", "17:00", "18:00"
  ];

  // Filter out booked time slots
  const bookedTimeSlots = appointments.map((appointment: any) => appointment.time);
  const timeSlots = availableTimeSlots.filter(slot => !bookedTimeSlots.includes(slot));

  // Setup form with validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : "",
      time: "",
      serviceId: 0,
      stylistId: undefined,
      comments: ""
    }
  });

  // Create appointment mutation
  const mutation = useMutation({
    mutationFn: (data: FormValues) => {
      return apiRequest('POST', '/api/appointments', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/appointments'] });
      setIsSuccessful(true);
      toast({
        title: "¡Reserva Confirmada!",
        description: "Te hemos enviado un email con los detalles de tu cita.",
      });
      setTimeout(() => {
        setIsSuccessful(false);
        setStep(1);
        form.reset();
      }, 3000);
    },
    onError: (error) => {
      toast({
        title: "Error al crear la reserva",
        description: "Por favor intenta nuevamente.",
        variant: "destructive"
      });
    }
  });

  // Handle form submission
  const onSubmit = (data: FormValues) => {
    if (selectedDate) {
      data.date = format(selectedDate, 'yyyy-MM-dd');
    }
    
    mutation.mutate(data);
  };

  // Handle date selection
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      form.setValue('date', format(date, 'yyyy-MM-dd'));
    }
  };

  // Navigation between steps
  const nextStep = () => {
    if (step === 1 && !form.getValues('serviceId')) {
      form.setError('serviceId', { message: 'Por favor selecciona un servicio' });
      return;
    }
    
    if (step === 2 && !form.getValues('time')) {
      form.setError('time', { message: 'Por favor selecciona un horario' });
      return;
    }
    
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  // Function to get icon by service type
  const getServiceIcon = (iconName: string) => {
    switch(iconName) {
      case 'scissors': return <Scissors className="text-[#FFAD57] mr-3" />;
      case 'palette': return <Palette className="text-[#FFAD57] mr-3" />;
      case 'wind': return <Wind className="text-[#FFAD57] mr-3" />;
      case 'droplet': return <Droplet className="text-[#FFAD57] mr-3" />;
      case 'feather': return <Feather className="text-[#FFAD57] mr-3" />;
      default: return <Scissors className="text-[#FFAD57] mr-3" />;
    }
  };

  // Function to disable past dates
  const disabledDays = (date: Date) => {
    return isBefore(date, new Date()) && !isToday(date);
  };

  // Get summary data
  const selectedService = services.find(s => s.id === form.getValues('serviceId'));
  const selectedStylist = stylists.find(s => s.id === form.getValues('stylistId'));
  
  return (
    <div className="bg-gray-50 rounded-lg shadow-lg p-6 md:p-10 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row">
        {/* Steps sidebar */}
        <div className="md:w-1/3 mb-8 md:mb-0 md:pr-8 md:border-r border-gray-200">
          <h3 className="text-xl font-bold text-[#165C5C] mb-4">Pasos a seguir</h3>
          <ul className="space-y-6">
            {[
              { number: 1, title: "Selecciona el servicio", desc: "Elige entre nuestras opciones de servicios" },
              { number: 2, title: "Elige fecha y hora", desc: "Selecciona cuando quieres visitarnos" },
              { number: 3, title: "Tus datos", desc: "Completa tus datos de contacto" },
              { number: 4, title: "Confirmación", desc: "Recibe confirmación por email o SMS" }
            ].map((s) => (
              <motion.li 
                key={s.number}
                initial="hidden"
                animate="visible"
                variants={fadeIn(s.number)}
                className="flex"
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                  step === s.number 
                    ? 'bg-[#165C5C] text-white' 
                    : step > s.number 
                    ? 'bg-[#FFAD57] text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step > s.number ? <CheckCircle size={16} /> : <span className="font-medium">{s.number}</span>}
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">{s.title}</h4>
                  <p className="text-sm text-gray-600">{s.desc}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
        
        {/* Form content */}
        <div className="md:w-2/3 md:pl-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Step 1: Service Selection */}
              {step === 1 && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={slideInRight}
                >
                  <h3 className="text-xl font-bold text-[#165C5C] mb-4">1. Selecciona el servicio</h3>
                  
                  <FormField
                    control={form.control}
                    name="serviceId"
                    render={({ field }) => (
                      <FormItem className="space-y-4">
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => field.onChange(parseInt(value))}
                            defaultValue={field.value?.toString()}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                          >
                            {services.map((service) => (
                              <div key={service.id} className="relative">
                                <RadioGroupItem
                                  value={service.id.toString()}
                                  id={`service-${service.id}`}
                                  className="peer sr-only"
                                />
                                <Label
                                  htmlFor={`service-${service.id}`}
                                  className="flex cursor-pointer rounded-lg border-2 border-gray-200 p-4 hover:border-[#165C5C] transition-colors peer-data-[state=checked]:border-[#165C5C]"
                                >
                                  <div className="flex items-center">
                                    {getServiceIcon(service.icon)}
                                    <div>
                                      <span className="block font-medium text-gray-800">{service.name}</span>
                                      <span className="block text-sm text-gray-500">
                                        {formatPrice(service.price)} - {formatDuration(service.duration)}
                                      </span>
                                    </div>
                                  </div>
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-800 mb-2">Selecciona un estilista (opcional)</h4>
                    <FormField
                      control={form.control}
                      name="stylistId"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                              <SelectTrigger>
                                <SelectValue placeholder="Cualquiera disponible" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="0">Cualquiera disponible</SelectItem>
                                {stylists.map((stylist) => (
                                  <SelectItem key={stylist.id} value={stylist.id.toString()}>
                                    {stylist.name} ({stylist.role})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="mt-6 text-right">
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="bg-[#165C5C] text-white hover:bg-[#165C5C]/90"
                    >
                      Siguiente <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}
              
              {/* Step 2: Date and Time Selection */}
              {step === 2 && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={slideInRight}
                  exit="hidden"
                >
                  <h3 className="text-xl font-bold text-[#165C5C] mb-4">2. Selecciona fecha y hora</h3>
                  
                  {/* Calendar */}
                  <div className="mb-6">
                    <FormField
                      control={form.control}
                      name="date"
                      render={() => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="font-medium text-gray-800 mb-2">Selecciona una fecha</FormLabel>
                          <div className="border rounded-md p-2 w-full">
                            <CalendarComponent
                              mode="single"
                              selected={selectedDate}
                              onSelect={handleDateChange}
                              disabled={disabledDays}
                              initialFocus
                            />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* Time Slots */}
                  {selectedDate && (
                    <div className="mb-6">
                      <FormField
                        control={form.control}
                        name="time"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium text-gray-800 mb-2">
                              Horarios disponibles para el {selectedDate && formatDate(selectedDate)}
                            </FormLabel>
                            <FormControl>
                              <RadioGroup 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                                className="grid grid-cols-3 md:grid-cols-4 gap-2"
                              >
                                {timeSlots.length > 0 ? (
                                  timeSlots.map((time) => (
                                    <div key={time} className="relative">
                                      <RadioGroupItem
                                        id={`time-${time}`}
                                        className="peer sr-only"
                                        value={time}
                                      />
                                      <Label
                                        htmlFor={`time-${time}`}
                                        className="cursor-pointer py-2 border border-gray-200 rounded-md text-center block hover:border-[#165C5C] transition-colors peer-data-[state=checked]:border-[#165C5C] peer-data-[state=checked]:bg-[#165C5C] peer-data-[state=checked]:text-white"
                                      >
                                        {time}
                                      </Label>
                                    </div>
                                  ))
                                ) : (
                                  <p className="col-span-4 text-center text-gray-500 py-4">
                                    No hay horarios disponibles para este día. Por favor selecciona otra fecha.
                                  </p>
                                )}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                  
                  <div className="mt-6 flex justify-between">
                    <Button
                      type="button"
                      onClick={prevStep}
                      variant="outline"
                      className="border-gray-200"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" /> Anterior
                    </Button>
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="bg-[#165C5C] text-white hover:bg-[#165C5C]/90"
                      disabled={!form.getValues('time')}
                    >
                      Siguiente <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}
              
              {/* Step 3: Contact Information */}
              {step === 3 && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={slideInRight}
                >
                  <h3 className="text-xl font-bold text-[#165C5C] mb-4">3. Tus datos de contacto</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Apellido</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Teléfono</FormLabel>
                          <FormControl>
                            <Input type="tel" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="mb-6">
                    <FormField
                      control={form.control}
                      name="comments"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Comentarios (opcional)</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {selectedService && (
                    <div className="bg-[#EADBEE] bg-opacity-20 p-4 rounded-md mb-6">
                      <h4 className="font-medium text-gray-800 mb-2">Resumen de tu reserva:</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li><strong>Servicio:</strong> {selectedService.name}</li>
                        <li><strong>Estilista:</strong> {selectedStylist ? selectedStylist.name : 'Cualquiera disponible'}</li>
                        <li><strong>Fecha:</strong> {selectedDate ? formatDate(selectedDate) : ''}</li>
                        <li><strong>Hora:</strong> {form.getValues('time')}</li>
                      </ul>
                    </div>
                  )}
                  
                  <div className="mt-6 flex justify-between">
                    <Button
                      type="button"
                      onClick={prevStep}
                      variant="outline"
                      className="border-gray-200"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" /> Anterior
                    </Button>
                    <Button
                      type="submit"
                      className="bg-[#FFAD57] text-white hover:bg-[#FFAD57]/90"
                      disabled={mutation.isPending || isSuccessful}
                    >
                      {mutation.isPending ? 'Procesando...' : 'Confirmar Reserva'} 
                      {!mutation.isPending && <CheckCircle className="ml-2 h-4 w-4" />}
                    </Button>
                  </div>
                </motion.div>
              )}
              
              {/* Success message */}
              {isSuccessful && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">¡Reserva Confirmada!</h3>
                  <p className="text-gray-600">
                    Te hemos enviado un email con los detalles de tu cita.
                  </p>
                </motion.div>
              )}
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
