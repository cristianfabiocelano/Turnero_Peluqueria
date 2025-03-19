import { useState } from 'react';
import { Link } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  ChevronLeft,
  LogOut,
  User,
  Clock,
  Plus,
  Calendar,
  Check,
  X,
  RefreshCcw,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { fadeIn } from '@/lib/animations';
import { apiRequest } from '@/lib/queryClient';

type AvailableDay = {
  id: number;
  date: string;
  isAvailable: boolean;
};

type AvailableTimeSlot = {
  id: number;
  time: string;
  isAvailable: boolean;
};

const dayFormSchema = z.object({
  date: z.date({
    required_error: 'Seleccione una fecha',
  }),
  isAvailable: z.boolean().default(true),
});

const timeSlotFormSchema = z.object({
  time: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Ingrese un tiempo válido en formato HH:MM',
  }),
  isAvailable: z.boolean().default(true),
});

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

const AdminAvailability = () => {
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('days');
  const [isAddDayDialogOpen, setIsAddDayDialogOpen] = useState(false);
  const [isAddTimeSlotDialogOpen, setIsAddTimeSlotDialogOpen] = useState(false);

  // Formulario para añadir día disponible
  const dayForm = useForm<z.infer<typeof dayFormSchema>>({
    resolver: zodResolver(dayFormSchema),
    defaultValues: {
      isAvailable: true,
    },
  });

  // Formulario para añadir franja horaria
  const timeSlotForm = useForm<z.infer<typeof timeSlotFormSchema>>({
    resolver: zodResolver(timeSlotFormSchema),
    defaultValues: {
      time: '',
      isAvailable: true,
    },
  });

  // Consulta para obtener todos los días disponibles
  const { data: availableDays, isLoading: isLoadingDays } = useQuery({
    queryKey: ['/api/available-days'],
    queryFn: async () => {
      const res = await fetch('/api/available-days');
      if (!res.ok) throw new Error('Error al cargar días disponibles');
      return res.json();
    },
  });

  // Consulta para obtener todas las franjas horarias
  const { data: availableTimeSlots, isLoading: isLoadingTimeSlots } = useQuery({
    queryKey: ['/api/available-time-slots'],
    queryFn: async () => {
      const res = await fetch('/api/available-time-slots');
      if (!res.ok) throw new Error('Error al cargar franjas horarias');
      return res.json();
    },
  });

  // Mutación para añadir un día disponible
  const addDayMutation = useMutation({
    mutationFn: async (data: { date: string; isAvailable: boolean }) => {
      const res = await apiRequest('POST', '/api/admin/available-days', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/available-days'] });
      setIsAddDayDialogOpen(false);
      dayForm.reset({ isAvailable: true });
      toast({
        title: 'Día añadido',
        description: 'El día ha sido añadido correctamente',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Error al añadir el día: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Mutación para actualizar un día disponible
  const updateDayMutation = useMutation({
    mutationFn: async ({ id, isAvailable }: { id: number; isAvailable: boolean }) => {
      const res = await apiRequest('PUT', `/api/admin/available-days/${id}`, {
        isAvailable,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/available-days'] });
      toast({
        title: 'Día actualizado',
        description: 'El estado del día ha sido actualizado correctamente',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Error al actualizar el día: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Mutación para añadir una franja horaria
  const addTimeSlotMutation = useMutation({
    mutationFn: async (data: z.infer<typeof timeSlotFormSchema>) => {
      const res = await apiRequest('POST', '/api/admin/available-time-slots', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/available-time-slots'] });
      setIsAddTimeSlotDialogOpen(false);
      timeSlotForm.reset({ time: '', isAvailable: true });
      toast({
        title: 'Franja horaria añadida',
        description: 'La franja horaria ha sido añadida correctamente',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Error al añadir la franja horaria: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Mutación para actualizar una franja horaria
  const updateTimeSlotMutation = useMutation({
    mutationFn: async ({ id, isAvailable }: { id: number; isAvailable: boolean }) => {
      const res = await apiRequest('PUT', `/api/admin/available-time-slots/${id}`, {
        isAvailable,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/available-time-slots'] });
      toast({
        title: 'Franja horaria actualizada',
        description: 'El estado de la franja horaria ha sido actualizado correctamente',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Error al actualizar la franja horaria: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const onDaySubmit = (data: z.infer<typeof dayFormSchema>) => {
    const formattedDate = data.date.toISOString().split('T')[0];
    addDayMutation.mutate({
      date: formattedDate,
      isAvailable: data.isAvailable,
    });
  };

  const onTimeSlotSubmit = (data: z.infer<typeof timeSlotFormSchema>) => {
    addTimeSlotMutation.mutate(data);
  };

  const handleDayToggle = (day: AvailableDay) => {
    updateDayMutation.mutate({
      id: day.id,
      isAvailable: !day.isAvailable,
    });
  };

  const handleTimeSlotToggle = (timeSlot: AvailableTimeSlot) => {
    updateTimeSlotMutation.mutate({
      id: timeSlot.id,
      isAvailable: !timeSlot.isAvailable,
    });
  };

  // Ordenar días por fecha
  const sortedDays = availableDays
    ? [...availableDays].sort(
        (a: AvailableDay, b: AvailableDay) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
      )
    : [];

  // Ordenar franjas horarias por tiempo
  const sortedTimeSlots = availableTimeSlots
    ? [...availableTimeSlots].sort((a: AvailableTimeSlot, b: AvailableTimeSlot) => {
        const [aHours, aMinutes] = a.time.split(':').map(Number);
        const [bHours, bMinutes] = b.time.split(':').map(Number);
        if (aHours !== bHours) return aHours - bHours;
        return aMinutes - bMinutes;
      })
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#165C5C] text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Clock className="h-6 w-6" />
            <h1 className="text-xl font-bold">Administración de Disponibilidad</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              <span>{user?.username}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-[#165C5C]/90 text-white"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-1" />
              Salir
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-6 px-4">
        <div className="flex items-center mb-6">
          <Link href="/admin/dashboard">
            <Button variant="ghost" size="sm" className="mr-2">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Volver al Dashboard
            </Button>
          </Link>
          <h2 className="text-2xl font-bold">Gestión de Disponibilidad</h2>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="days" className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Días Disponibles
            </TabsTrigger>
            <TabsTrigger value="timeSlots" className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Franjas Horarias
            </TabsTrigger>
          </TabsList>

          <TabsContent value="days">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Administrar Días Disponibles</h3>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    queryClient.invalidateQueries({ queryKey: ['/api/available-days'] })
                  }
                >
                  <RefreshCcw className="h-4 w-4 mr-1" />
                  Actualizar
                </Button>
                <Dialog open={isAddDayDialogOpen} onOpenChange={setIsAddDayDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Añadir Día
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Añadir Día Disponible</DialogTitle>
                      <DialogDescription>
                        Seleccione una fecha y establezca su disponibilidad
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...dayForm}>
                      <form
                        onSubmit={dayForm.handleSubmit(onDaySubmit)}
                        className="space-y-4"
                      >
                        <FormField
                          control={dayForm.control}
                          name="date"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Fecha</FormLabel>
                              <CalendarComponent
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={dayForm.control}
                          name="isAvailable"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                              <div className="space-y-0.5">
                                <FormLabel>Disponible</FormLabel>
                                <FormDescription>
                                  Marque si este día estará disponible para citas
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <DialogFooter>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsAddDayDialogOpen(false)}
                          >
                            Cancelar
                          </Button>
                          <Button type="submit" disabled={addDayMutation.isPending}>
                            {addDayMutation.isPending ? 'Guardando...' : 'Guardar Día'}
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {isLoadingDays ? (
              <div className="flex justify-center items-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#165C5C]"></div>
              </div>
            ) : (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeIn(0.1)}
                className="bg-white rounded-lg shadow overflow-hidden p-4"
              >
                {sortedDays.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium text-gray-600">
                      No hay días configurados
                    </h3>
                    <p className="text-gray-500 mt-2">
                      Comience añadiendo días disponibles para citas
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {sortedDays.map((day: AvailableDay) => (
                      <Card key={day.id} className="overflow-hidden">
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-base flex justify-between items-center">
                            <span>{formatDate(day.date)}</span>
                            <Badge
                              className={
                                day.isAvailable
                                  ? 'bg-green-100 text-green-800 hover:bg-green-100'
                                  : 'bg-red-100 text-red-800 hover:bg-red-100'
                              }
                            >
                              {day.isAvailable ? 'Disponible' : 'No Disponible'}
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-2">
                          <div className="flex justify-end">
                            <Button
                              variant={day.isAvailable ? 'destructive' : 'outline'}
                              size="sm"
                              className={
                                !day.isAvailable
                                  ? 'border-green-500 text-green-600 hover:text-green-700'
                                  : ''
                              }
                              onClick={() => handleDayToggle(day)}
                            >
                              {day.isAvailable ? (
                                <>
                                  <X className="h-4 w-4 mr-1" />
                                  Deshabilitar
                                </>
                              ) : (
                                <>
                                  <Check className="h-4 w-4 mr-1" />
                                  Habilitar
                                </>
                              )}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="timeSlots">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Administrar Franjas Horarias</h3>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    queryClient.invalidateQueries({
                      queryKey: ['/api/available-time-slots'],
                    })
                  }
                >
                  <RefreshCcw className="h-4 w-4 mr-1" />
                  Actualizar
                </Button>
                <Dialog
                  open={isAddTimeSlotDialogOpen}
                  onOpenChange={setIsAddTimeSlotDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Añadir Horario
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Añadir Franja Horaria</DialogTitle>
                      <DialogDescription>
                        Ingrese un horario en formato HH:MM (24h) y establezca su
                        disponibilidad
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...timeSlotForm}>
                      <form
                        onSubmit={timeSlotForm.handleSubmit(onTimeSlotSubmit)}
                        className="space-y-4"
                      >
                        <FormField
                          control={timeSlotForm.control}
                          name="time"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Horario (HH:MM)</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="14:30" />
                              </FormControl>
                              <FormDescription>
                                Ingrese el horario en formato de 24 horas (p. ej. 14:30)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={timeSlotForm.control}
                          name="isAvailable"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                              <div className="space-y-0.5">
                                <FormLabel>Disponible</FormLabel>
                                <FormDescription>
                                  Marque si este horario estará disponible para citas
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <DialogFooter>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsAddTimeSlotDialogOpen(false)}
                          >
                            Cancelar
                          </Button>
                          <Button type="submit" disabled={addTimeSlotMutation.isPending}>
                            {addTimeSlotMutation.isPending
                              ? 'Guardando...'
                              : 'Guardar Horario'}
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {isLoadingTimeSlots ? (
              <div className="flex justify-center items-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#165C5C]"></div>
              </div>
            ) : (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeIn(0.1)}
                className="bg-white rounded-lg shadow overflow-hidden p-4"
              >
                {sortedTimeSlots.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium text-gray-600">
                      No hay franjas horarias configuradas
                    </h3>
                    <p className="text-gray-500 mt-2">
                      Comience añadiendo horarios disponibles para citas
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {sortedTimeSlots.map((timeSlot: AvailableTimeSlot) => (
                      <Card key={timeSlot.id} className="overflow-hidden">
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-base flex justify-between items-center">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2 text-gray-500" />
                              <span>{timeSlot.time}</span>
                            </div>
                            <Badge
                              className={
                                timeSlot.isAvailable
                                  ? 'bg-green-100 text-green-800 hover:bg-green-100'
                                  : 'bg-red-100 text-red-800 hover:bg-red-100'
                              }
                            >
                              {timeSlot.isAvailable ? 'Disponible' : 'No Disponible'}
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-2">
                          <div className="flex justify-end">
                            <Button
                              variant={timeSlot.isAvailable ? 'destructive' : 'outline'}
                              size="sm"
                              className={
                                !timeSlot.isAvailable
                                  ? 'border-green-500 text-green-600 hover:text-green-700'
                                  : ''
                              }
                              onClick={() => handleTimeSlotToggle(timeSlot)}
                            >
                              {timeSlot.isAvailable ? (
                                <>
                                  <X className="h-4 w-4 mr-1" />
                                  Deshabilitar
                                </>
                              ) : (
                                <>
                                  <Check className="h-4 w-4 mr-1" />
                                  Habilitar
                                </>
                              )}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminAvailability;