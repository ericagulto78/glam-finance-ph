
import React from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PageHeader from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ServiceTypeDialogs from '@/components/service-types/ServiceTypeDialogs';
import { useServiceTypes } from '@/hooks/useServiceTypes';

const ServiceTypes = () => {
  const {
    serviceTypes,
    newServiceType,
    selectedServiceType,
    isAddDialogOpen,
    isEditDialogOpen,
    isDeleteDialogOpen,
    isLoading,
    setSelectedServiceType,
    setIsAddDialogOpen,
    setIsEditDialogOpen,
    setIsDeleteDialogOpen,
    handleNewServiceTypeChange,
    handleSelectedServiceTypeChange,
    addServiceType,
    updateServiceType,
    deleteServiceType
  } = useServiceTypes();

  const handleAddServiceType = () => {
    setIsAddDialogOpen(true);
  };

  const handleEditServiceType = (serviceType: any) => {
    setSelectedServiceType(serviceType);
    setIsEditDialogOpen(true);
  };

  const handleDeleteServiceType = (serviceType: any) => {
    setSelectedServiceType(serviceType);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="h-full">
      <PageHeader 
        title="Service Types" 
        subtitle="Manage your service types and default pricing"
        action={{
          label: "Add Service Type",
          onClick: handleAddServiceType,
          icon: <Plus size={16} />,
        }}
      />

      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Service Types</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-6">Loading service types...</div>
            ) : serviceTypes.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <p>No service types found. Create your first service type to get started.</p>
                <Button onClick={handleAddServiceType} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Service Type
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right">Default Price</TableHead>
                    <TableHead className="w-[100px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {serviceTypes.map((serviceType) => (
                    <TableRow key={serviceType.id}>
                      <TableCell className="font-medium">{serviceType.name}</TableCell>
                      <TableCell className="text-right">₱{serviceType.default_price.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                                <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                              </svg>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditServiceType(serviceType)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteServiceType(serviceType)} className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <ServiceTypeDialogs 
        isAddDialogOpen={isAddDialogOpen}
        isEditDialogOpen={isEditDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        isLoading={isLoading}
        newServiceType={newServiceType}
        selectedServiceType={selectedServiceType}
        onAddDialogOpenChange={setIsAddDialogOpen}
        onEditDialogOpenChange={setIsEditDialogOpen}
        onDeleteDialogOpenChange={setIsDeleteDialogOpen}
        onNewServiceTypeChange={handleNewServiceTypeChange}
        onSelectedServiceTypeChange={handleSelectedServiceTypeChange}
        onSubmitNewServiceType={addServiceType}
        onUpdateServiceType={updateServiceType}
        onConfirmDelete={deleteServiceType}
      />
    </div>
  );
};

export default ServiceTypes;
