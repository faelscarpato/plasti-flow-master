import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { DataTable } from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface NonConformity {
  id: string;
  part_name: string;
  machine_id: string;
  defect_type: string;
  description: string;
  criticality: string;
  status: string;
  image_url: string;
  created_at: string;
}

const criticalityColors = {
  'Baixa': 'bg-green-100 text-green-800',
  'Média': 'bg-yellow-100 text-yellow-800',
  'Alta': 'bg-red-100 text-red-800',
  'Crítica': 'bg-red-200 text-red-900'
};

const statusColors = {
  'Aberta': 'bg-red-100 text-red-800',
  'Em Análise': 'bg-yellow-100 text-yellow-800',
  'Resolvida': 'bg-green-100 text-green-800',
  'Fechada': 'bg-gray-100 text-gray-800'
};

export default function NonConformities() {
  const [nonConformities, setNonConformities] = useState<NonConformity[]>([]);
  const [machines, setMachines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NonConformity | null>(null);
  const [formData, setFormData] = useState({
    part_name: "",
    machine_id: "",
    defect_type: "",
    description: "",
    criticality: "",
    status: "Aberta"
  });
  const { toast } = useToast();

  const columns = [
    { key: "part_name", label: "Peça" },
    { key: "machine_id", label: "Máquina" },
    { key: "defect_type", label: "Tipo de Defeito" },
    { 
      key: "criticality", 
      label: "Criticidade",
      render: (value: string) => (
        <Badge className={criticalityColors[value as keyof typeof criticalityColors]}>
          {value}
        </Badge>
      )
    },
    { 
      key: "status", 
      label: "Status",
      render: (value: string) => (
        <Badge className={statusColors[value as keyof typeof statusColors]}>
          {value}
        </Badge>
      )
    },
    { 
      key: "created_at", 
      label: "Criado em",
      render: (value: string) => new Date(value).toLocaleDateString('pt-BR')
    }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ncResult, machinesResult] = await Promise.all([
        supabase.from('non_conformities').select('*').order('created_at', { ascending: false }),
        supabase.from('machines').select('id, name')
      ]);

      if (ncResult.error) throw ncResult.error;
      if (machinesResult.error) throw machinesResult.error;

      setNonConformities(ncResult.data || []);
      setMachines(machinesResult.data || []);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingItem) {
        const { error } = await supabase
          .from('non_conformities')
          .update(formData)
          .eq('id', editingItem.id);

        if (error) throw error;
        toast({ title: "Sucesso", description: "Não conformidade atualizada com sucesso" });
      } else {
        const { error } = await supabase
          .from('non_conformities')
          .insert([formData]);

        if (error) throw error;
        toast({ title: "Sucesso", description: "Não conformidade criada com sucesso" });
      }

      setDialogOpen(false);
      setEditingItem(null);
      setFormData({
        part_name: "",
        machine_id: "",
        defect_type: "",
        description: "",
        criticality: "",
        status: "Aberta"
      });
      fetchData();
    } catch (error) {
      console.error('Erro ao salvar não conformidade:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar não conformidade",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (item: NonConformity) => {
    setEditingItem(item);
    setFormData({
      part_name: item.part_name,
      machine_id: item.machine_id,
      defect_type: item.defect_type,
      description: item.description,
      criticality: item.criticality,
      status: item.status
    });
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      part_name: "",
      machine_id: "",
      defect_type: "",
      description: "",
      criticality: "",
      status: "Aberta"
    });
    setDialogOpen(true);
  };

  return (
    <Layout>
      <DataTable
        data={nonConformities}
        columns={columns}
        title="Não Conformidades"
        onAdd={handleAdd}
        onEdit={handleEdit}
        loading={loading}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Editar Não Conformidade' : 'Nova Não Conformidade'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="part_name">Nome da Peça *</Label>
                <Input
                  id="part_name"
                  value={formData.part_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, part_name: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="machine_id">Máquina *</Label>
                <Select
                  value={formData.machine_id}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, machine_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma máquina" />
                  </SelectTrigger>
                  <SelectContent>
                    {machines.map((machine) => (
                      <SelectItem key={machine.id} value={machine.id}>
                        {machine.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="defect_type">Tipo de Defeito *</Label>
                <Input
                  id="defect_type"
                  value={formData.defect_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, defect_type: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="criticality">Criticidade *</Label>
                <Select
                  value={formData.criticality}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, criticality: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a criticidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Baixa">Baixa</SelectItem>
                    <SelectItem value="Média">Média</SelectItem>
                    <SelectItem value="Alta">Alta</SelectItem>
                    <SelectItem value="Crítica">Crítica</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Aberta">Aberta</SelectItem>
                    <SelectItem value="Em Análise">Em Análise</SelectItem>
                    <SelectItem value="Resolvida">Resolvida</SelectItem>
                    <SelectItem value="Fechada">Fechada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingItem ? 'Atualizar' : 'Criar'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}