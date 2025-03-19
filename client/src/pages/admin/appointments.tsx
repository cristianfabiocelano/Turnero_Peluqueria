import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Link } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { queryClient } from '@/lib/queryClient';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Calendar, ChevronLeft, Search, ArrowUpDown, Check, X, AlertTriangle } from 'lucide-react';

type Appointment = {
  id: number;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  serviceId: number;
  serviceName: string;
  stylistId: number;
  stylistName: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
};

const AppointmentsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'view' | 'edit'>('view');
  const [editForm, setEditForm] = useState({
    status: '',
    notes: '',
  });

  // Obtener citas
  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['/api/admin/appointments'],
    enabled: !!user?.isAdmin,
  });

  // Mutar estado de la cita
  const updateAppointmentMutation = useMutation({
    mutationFn: async (data: { id: number; status: string }) => {
      const response = await fetch(`/api/admin/appointments/${data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: data.status }),
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/appointments'] });
      toast({
        title: 'Estado actualizado',
        description: 'La cita ha sido actualizada correctamente',
        variant: 'default',
      });
      setIsDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la cita',
        variant: 'destructive',
      });
    },
  });

  // Eliminar cita
  const deleteAppointmentMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/appointments/${id}`, {
        method: 'DELETE',
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/appointments'] });
      toast({
        title: 'Cita eliminada',
        description: 'La cita ha sido eliminada correctamente',
        variant: 'default',
      });
      setIsDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la cita',
        variant: 'destructive',
      });
    },
  });

  // Filtrar y ordenar citas
  const filteredAppointments = appointments
    .filter((appointment: Appointment) => {
      const matchesSearch =
        appointment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.phone.includes(searchTerm);
      
      const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a: Appointment, b: Appointment) => {
      if (sortBy === 'date') {
        const dateA = new Date(`${a.date} ${a.time}`);
        const dateB = new Date(`${b.date} ${b.time}`);
        return sortOrder === 'asc'
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      }
      
      if (sortBy === 'name') {
        return sortOrder === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      
      if (sortBy === 'status') {
        return sortOrder === 'asc'
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      }
      
      return 0;
    });

  // Funciones de ayuda para manejar la UI
  const handleSort = (column: 'date' | 'name' | 'status') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleViewAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setEditForm({
      status: appointment.status,
      notes: '',
    });
    setDialogMode('view');
    setIsDialogOpen(true);
  };

  const handleEditAppointment = () => {
    setDialogMode('edit');
  };

  const handleUpdateStatus = () => {
    if (selectedAppointment) {
      updateAppointmentMutation.mutate({
        id: selectedAppointment.id,
        status: editForm.status,
      });
    }
  };

  const handleDeleteAppointment = () => {
    if (selectedAppointment) {
      if (window.confirm('¿Estás seguro que deseas eliminar esta cita?')) {
        deleteAppointmentMutation.mutate(selectedAppointment.id);
      }
    }
  };

  const formatAppointmentDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return format(date, 'PPP', { locale: es });
    } catch {
      return dateStr;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'confirmed':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'confirmed':
        return 'Confirmada';
      case 'cancelled':
        return 'Cancelada';
      case 'completed':
        return 'Completada';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#165C5C]"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <Link href="/admin/dashboard">
            <Button variant="outline" size="icon" className="mr-4">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Citas</h1>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre, email o teléfono..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="pending">Pendientes</SelectItem>
                <SelectItem value="confirmed">Confirmadas</SelectItem>
                <SelectItem value="cancelled">Canceladas</SelectItem>
                <SelectItem value="completed">Completadas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No hay citas</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all'
                ? 'No se encontraron citas que coincidan con los filtros aplicados.'
                : 'Aún no hay citas programadas en el sistema.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">
                    <button
                      className="flex items-center font-medium"
                      onClick={() => handleSort('date')}
                    >
                      Fecha y Hora
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      className="flex items-center font-medium"
                      onClick={() => handleSort('name')}
                    >
                      Cliente
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </button>
                  </TableHead>
                  <TableHead>Servicio</TableHead>
                  <TableHead>Estilista</TableHead>
                  <TableHead>
                    <button
                      className="flex items-center font-medium"
                      onClick={() => handleSort('status')}
                    >
                      Estado
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </button>
                  </TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map((appointment: Appointment) => (
                  <TableRow
                    key={appointment.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleViewAppointment(appointment)}
                  >
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{formatAppointmentDate(appointment.date)}</span>
                        <span className="text-gray-500 text-sm">{appointment.time}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{appointment.name}</span>
                        <span className="text-gray-500 text-sm">{appointment.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>{appointment.serviceName}</TableCell>
                    <TableCell>{appointment.stylistName}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                          appointment.status
                        )}`}
                      >
                        {getStatusLabel(appointment.status)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={(e) => {
                        e.stopPropagation();
                        handleViewAppointment(appointment);
                      }}>
                        Ver detalles
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {selectedAppointment && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {dialogMode === 'view' ? 'Detalles de la Cita' : 'Editar Cita'}
              </DialogTitle>
              <DialogDescription>
                {dialogMode === 'view'
                  ? 'Información detallada de la cita seleccionada'
                  : 'Modifica el estado de la cita'}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {dialogMode === 'view' ? (
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-[#165C5C]/10 p-3 rounded-full mr-3">
                      <Calendar className="h-6 w-6 text-[#165C5C]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Fecha y Hora</h4>
                      <p className="text-lg font-medium">
                        {formatAppointmentDate(selectedAppointment.date)} a las{' '}
                        {selectedAppointment.time}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Cliente</h4>
                      <p className="text-lg font-medium">{selectedAppointment.name}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Email</h4>
                      <p className="text-lg font-medium">{selectedAppointment.email}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Teléfono</h4>
                      <p className="text-lg font-medium">{selectedAppointment.phone}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Estado</h4>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                          selectedAppointment.status
                        )}`}
                      >
                        {getStatusLabel(selectedAppointment.status)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Servicio</h4>
                    <p className="text-lg font-medium">{selectedAppointment.serviceName}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Estilista</h4>
                    <p className="text-lg font-medium">{selectedAppointment.stylistName}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Estado de la cita</Label>
                    <Select
                      value={editForm.status}
                      onValueChange={(value) => setEditForm({ ...editForm, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pendiente</SelectItem>
                        <SelectItem value="confirmed">Confirmada</SelectItem>
                        <SelectItem value="cancelled">Cancelada</SelectItem>
                        <SelectItem value="completed">Completada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {editForm.status === 'cancelled' && (
                    <div className="flex items-center p-4 bg-amber-50 border border-amber-200 rounded-md">
                      <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                      <span className="text-sm text-amber-800">
                        Al cancelar una cita, se notificará al cliente sobre este cambio.
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
            <DialogFooter className="sm:justify-between">
              {dialogMode === 'view' ? (
                <div className="flex justify-between w-full">
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAppointment}
                    disabled={deleteAppointmentMutation.isPending}
                  >
                    {deleteAppointmentMutation.isPending ? (
                      <span className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Eliminando...
                      </span>
                    ) : (
                      'Eliminar'
                    )}
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cerrar
                    </Button>
                    <Button onClick={handleEditAppointment}>Editar Estado</Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between w-full">
                  <Button variant="outline" onClick={() => setDialogMode('view')}>
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleUpdateStatus}
                    disabled={updateAppointmentMutation.isPending}
                  >
                    {updateAppointmentMutation.isPending ? (
                      <span className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Guardando...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Check className="h-4 w-4 mr-2" />
                        Guardar Cambios
                      </span>
                    )}
                  </Button>
                </div>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AppointmentsPage;