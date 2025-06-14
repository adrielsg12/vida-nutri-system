
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Search, 
  Eye, 
  ChefHat,
  Calculator 
} from 'lucide-react';

interface Patient {
  id: string;
  nome: string;
  cpf?: string;
  telefone?: string;
  email?: string;
  status: string;
  created_at: string;
  planosCount?: number;
}

interface PlanoAlimentar {
  id: string;
  titulo: string;
  status: string;
  created_at: string;
}

interface PacientesTableProps {
  patients: Patient[];
  pacientePlanos: {[key: string]: PlanoAlimentar[]};
  onViewPatient: (patientId: string) => void;
  onCreatePlano: (patientId: string) => void;
  onViewPlano: (planoId: string) => void;
}

export const PacientesTable = ({ 
  patients, 
  pacientePlanos, 
  onViewPatient, 
  onCreatePlano, 
  onViewPlano 
}: PacientesTableProps) => {
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');

  useEffect(() => {
    let filtered = patients;

    if (searchTerm) {
      filtered = filtered.filter(patient =>
        patient.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.cpf?.includes(searchTerm)
      );
    }

    if (statusFilter !== 'todos') {
      filtered = filtered.filter(patient => patient.status === statusFilter);
    }

    setFilteredPatients(filtered);
  }, [searchTerm, statusFilter, patients]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativo':
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
      case 'inativo':
        return <Badge variant="secondary">Inativo</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="w-5 h-5 mr-2" />
          Lista de Pacientes
        </CardTitle>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="Buscar por nome, email ou CPF..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="sm:w-48">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Planos</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell className="font-medium">{patient.nome}</TableCell>
                <TableCell>{patient.email || '-'}</TableCell>
                <TableCell>{patient.telefone || '-'}</TableCell>
                <TableCell>{getStatusBadge(patient.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{patient.planosCount || 0} planos</Badge>
                    {pacientePlanos[patient.id] && pacientePlanos[patient.id].length > 0 && (
                      <div className="flex gap-1">
                        {pacientePlanos[patient.id].slice(0, 2).map((plano) => (
                          <Button
                            key={plano.id}
                            size="sm"
                            variant="outline"
                            onClick={() => onViewPlano(plano.id)}
                            className="text-xs"
                          >
                            <Calculator className="w-3 h-3 mr-1" />
                            {plano.titulo.substring(0, 10)}...
                          </Button>
                        ))}
                        {pacientePlanos[patient.id].length > 2 && (
                          <Badge variant="secondary">+{pacientePlanos[patient.id].length - 2}</Badge>
                        )}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onViewPatient(patient.id)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Ver
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onCreatePlano(patient.id)}
                      className="bg-emerald-50 hover:bg-emerald-100"
                    >
                      <ChefHat className="w-4 h-4 mr-1" />
                      Plano
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {filteredPatients.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {searchTerm || statusFilter !== 'todos' 
              ? 'Nenhum paciente encontrado com os filtros aplicados.'
              : 'Nenhum paciente cadastrado ainda. Clique em "Novo Paciente" para começar.'
            }
          </div>
        )}
      </CardContent>
    </Card>
  );
};
