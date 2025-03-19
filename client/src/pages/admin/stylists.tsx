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
  Users,
  Plus,
  Pencil,
  Trash2,
  Instagram,
  Facebook,
  Twitter,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { fadeIn } from '@/lib/animations';
import { apiRequest } from '@/lib/queryClient';

type Stylist = {
  id: number;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
};

const formSchema = z.object({
  name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
  role: z.string().min(2, { message: 'El cargo debe tener al menos 2 caracteres' }),
  bio: z.string().min(10, { message: 'La biografía debe tener al menos 10 caracteres' }),
  imageUrl: z.string().url({ message: 'Debe ser una URL válida' }),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  twitter: z.string().optional(),
});

const AdminStylists = () => {
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStylist, setSelectedStylist] = useState<Stylist | null>(null);

  // Formulario para añadir estilista
  const addForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      role: '',
      bio: '',
      imageUrl: '',
      instagram: '',
      facebook: '',
      twitter: '',
    },
  });

  // Formulario para editar estilista
  const editForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      role: '',
      bio: '',
      imageUrl: '',
      instagram: '',
      facebook: '',
      twitter: '',
    },
  });

  // Consulta para obtener todos los estilistas
  const { data: stylists, isLoading } = useQuery({
    queryKey: ['/api/stylists'],
    queryFn: async () => {
      const res = await fetch('/api/stylists');
      if (!res.ok) throw new Error('Error al cargar estilistas');
      return res.json();
    },
  });

  // Mutación para añadir un estilista
  const addStylistMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const res = await apiRequest('POST', '/api/admin/stylists', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/stylists'] });
      setIsAddDialogOpen(false);
      addForm.reset();
      toast({
        title: 'Estilista añadido',
        description: 'El estilista ha sido añadido correctamente',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Error al añadir el estilista: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Mutación para editar un estilista
  const editStylistMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: z.infer<typeof formSchema>;
    }) => {
      const res = await apiRequest('PUT', `/api/admin/stylists/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/stylists'] });
      setIsEditDialogOpen(false);
      setSelectedStylist(null);
      toast({
        title: 'Estilista actualizado',
        description: 'El estilista ha sido actualizado correctamente',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Error al actualizar el estilista: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Mutación para eliminar un estilista
  const deleteStylistMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/admin/stylists/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/stylists'] });
      setIsDeleteDialogOpen(false);
      setSelectedStylist(null);
      toast({
        title: 'Estilista eliminado',
        description: 'El estilista ha sido eliminado correctamente',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Error al eliminar el estilista: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const onAddSubmit = (data: z.infer<typeof formSchema>) => {
    addStylistMutation.mutate(data);
  };

  const onEditSubmit = (data: z.infer<typeof formSchema>) => {
    if (selectedStylist) {
      editStylistMutation.mutate({ id: selectedStylist.id, data });
    }
  };

  const handleEditClick = (stylist: Stylist) => {
    setSelectedStylist(stylist);
    editForm.reset({
      name: stylist.name,
      role: stylist.role,
      bio: stylist.bio,
      imageUrl: stylist.imageUrl,
      instagram: stylist.instagram || '',
      facebook: stylist.facebook || '',
      twitter: stylist.twitter || '',
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (stylist: Stylist) => {
    setSelectedStylist(stylist);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedStylist) {
      deleteStylistMutation.mutate(selectedStylist.id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#165C5C] text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Users className="h-6 w-6" />
            <h1 className="text-xl font-bold">Administración de Estilistas</h1>
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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link href="/admin/dashboard">
              <Button variant="ghost" size="sm" className="mr-2">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Volver al Dashboard
              </Button>
            </Link>
            <h2 className="text-2xl font-bold">Gestión de Estilistas</h2>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-1" />
                Añadir Estilista
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Añadir Nuevo Estilista</DialogTitle>
                <DialogDescription>
                  Complete el formulario para añadir un nuevo estilista a su equipo
                </DialogDescription>
              </DialogHeader>
              <Form {...addForm}>
                <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-4">
                  <FormField
                    control={addForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Carlos Gómez" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cargo / Especialidad</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Estilista Senior" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Biografía</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Breve descripción del estilista..."
                            rows={4}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL de Imagen</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="https://ejemplo.com/imagen.jpg"
                          />
                        </FormControl>
                        <FormDescription>
                          Utilice una URL de imagen del estilista (foto profesional)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Redes Sociales (opcional)</h4>
                    <div className="grid grid-cols-1 gap-4">
                      <FormField
                        control={addForm.control}
                        name="instagram"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center">
                              <Instagram className="h-4 w-4 mr-2 text-pink-600" />
                              <FormLabel>Instagram</FormLabel>
                            </div>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="https://instagram.com/username"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={addForm.control}
                        name="facebook"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center">
                              <Facebook className="h-4 w-4 mr-2 text-blue-600" />
                              <FormLabel>Facebook</FormLabel>
                            </div>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="https://facebook.com/username"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={addForm.control}
                        name="twitter"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center">
                              <Twitter className="h-4 w-4 mr-2 text-blue-400" />
                              <FormLabel>Twitter / X</FormLabel>
                            </div>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="https://twitter.com/username"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={addStylistMutation.isPending}>
                      {addStylistMutation.isPending
                        ? 'Guardando...'
                        : 'Guardar Estilista'}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#165C5C]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stylists && stylists.length > 0 ? (
              stylists.map((stylist: Stylist) => (
                <motion.div
                  key={stylist.id}
                  initial="hidden"
                  animate="visible"
                  variants={fadeIn(0.1)}
                  className="bg-white rounded-lg shadow overflow-hidden"
                >
                  <div
                    className="h-60 bg-cover bg-center bg-gray-100"
                    style={{
                      backgroundImage: `url(${stylist.imageUrl})`,
                      backgroundPosition: 'center top',
                    }}
                  />
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-lg">{stylist.name}</CardTitle>
                    <p className="text-sm text-gray-500">{stylist.role}</p>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">{stylist.bio}</p>
                    
                    <div className="flex space-x-2 mb-4">
                      {stylist.instagram && (
                        <a
                          href={stylist.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-pink-600 hover:text-pink-700"
                        >
                          <Instagram className="h-5 w-5" />
                        </a>
                      )}
                      {stylist.facebook && (
                        <a
                          href={stylist.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Facebook className="h-5 w-5" />
                        </a>
                      )}
                      {stylist.twitter && (
                        <a
                          href={stylist.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-500"
                        >
                          <Twitter className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                    <Separator className="my-4" />
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditClick(stylist)}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteClick(stylist)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Eliminar
                      </Button>
                    </div>
                  </CardContent>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-600">
                  No hay estilistas registrados
                </h3>
                <p className="text-gray-500 mt-2">
                  Comience añadiendo su primer estilista con el botón "Añadir Estilista"
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Dialog de edición */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Estilista</DialogTitle>
            <DialogDescription>
              Actualice la información del estilista seleccionado
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
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
                control={editForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cargo / Especialidad</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Biografía</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={4} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL de Imagen</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Utilice una URL de imagen del estilista (foto profesional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Redes Sociales (opcional)</h4>
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={editForm.control}
                    name="instagram"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center">
                          <Instagram className="h-4 w-4 mr-2 text-pink-600" />
                          <FormLabel>Instagram</FormLabel>
                        </div>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editForm.control}
                    name="facebook"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center">
                          <Facebook className="h-4 w-4 mr-2 text-blue-600" />
                          <FormLabel>Facebook</FormLabel>
                        </div>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editForm.control}
                    name="twitter"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center">
                          <Twitter className="h-4 w-4 mr-2 text-blue-400" />
                          <FormLabel>Twitter / X</FormLabel>
                        </div>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={editStylistMutation.isPending}>
                  {editStylistMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmación para eliminar */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Está seguro de que desea eliminar este estilista? Esta acción no se puede
              deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteStylistMutation.isPending}
            >
              {deleteStylistMutation.isPending ? 'Eliminando...' : 'Eliminar Estilista'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminStylists;