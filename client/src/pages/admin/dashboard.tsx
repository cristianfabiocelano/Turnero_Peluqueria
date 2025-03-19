import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import {
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Users, 
  Scissors, 
  Clock, 
  Calendar as CalendarIcon,
  Clipboard
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  
  const { data: appointments = [] } = useQuery({
    queryKey: ['/api/admin/appointments'],
    enabled: !!user?.isAdmin,
  });

  const { data: services = [] } = useQuery({
    queryKey: ['/api/services'],
    enabled: !!user?.isAdmin,
  });

  const { data: stylists = [] } = useQuery({
    queryKey: ['/api/stylists'],
    enabled: !!user?.isAdmin,
  });

  const pendingAppointments = appointments.filter(
    (appointment: any) => appointment.status === 'pending'
  ).length;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
        <div className="flex items-center space-x-4">
          <div className="bg-[#165C5C] text-white px-4 py-2 rounded-full">
            <span>Usuario: {user?.username}</span>
          </div>
          <Link href="/">
            <Button variant="outline">
              Ver Sitio Web
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="border-l-4 border-[#165C5C]">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-[#165C5C]" />
              Citas Pendientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{pendingAppointments}</p>
            <p className="text-sm text-gray-500">Requieren acción</p>
            <div className="mt-4">
              <Link href="/admin/appointments">
                <Button variant="outline" size="sm" className="w-full">
                  Ver Citas
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-[#FFAD57]">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Scissors className="h-5 w-5 mr-2 text-[#FFAD57]" />
              Servicios Activos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{services.length}</p>
            <p className="text-sm text-gray-500">Disponibles para clientes</p>
            <div className="mt-4">
              <Link href="/admin/services">
                <Button variant="outline" size="sm" className="w-full">
                  Gestionar Servicios
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-[#A5A8B9]">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Users className="h-5 w-5 mr-2 text-[#A5A8B9]" />
              Estilistas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stylists.length}</p>
            <p className="text-sm text-gray-500">Profesionales activos</p>
            <div className="mt-4">
              <Link href="/admin/stylists">
                <Button variant="outline" size="sm" className="w-full">
                  Gestionar Estilistas
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2 text-[#165C5C]" />
              Gestión de Disponibilidad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Configura los días y horarios disponibles para reservas.</p>
            <div className="flex space-x-4">
              <Link href="/admin/availability">
                <Button className="bg-[#165C5C] hover:bg-[#0e4242]">
                  Administrar Disponibilidad
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clipboard className="h-5 w-5 mr-2 text-[#165C5C]" />
              Acciones Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/admin/appointments">
                <Button variant="outline" className="w-full">
                  Ver Citas
                </Button>
              </Link>
              <Link href="/admin/services">
                <Button variant="outline" className="w-full">
                  Ver Servicios
                </Button>
              </Link>
              <Link href="/admin/stylists">
                <Button variant="outline" className="w-full">
                  Ver Estilistas
                </Button>
              </Link>
              <Link href="/admin/availability">
                <Button variant="outline" className="w-full">
                  Horarios
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;