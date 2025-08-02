import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { DataTable } from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Machine {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export default function Machines() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMachine, setEditingMachine] = useState<Machine | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });
  const { toast } = useToast();

  const columns = [
    { key: "name", label: "Nome" },
    { key: "description", label: "Descrição" },
    { 
      key: "created_at", 
      label: "Criado em",
      render: (value: string) => new Date(value).toLocaleDateString('pt-BR')
    }
  ];

  useEffect(() => {
    fetchMachines();
  }, []);

  const fetchMachines = async () => {
    try {
      const { data, error } = await supabase
        .from('machines')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMachines(data || []);
    } catch (error) {
      console.error('Erro ao buscar máquinas:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar máquinas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingMachine) {
        const { error } = await supabase
          .from('machines')
          .update(formData)
          .eq('id', editingMachine.id);

        if (error) throw error;
        toast({ title: "Sucesso", description: "Máquina atualizada com sucesso" });
      } else {
        const { error } = await supabase
          .from('machines')
          .insert([formData]);

        if (error) throw error;
        toast({ title: "Sucesso", description: "Máquina criada com sucesso" });
      }

      setDialogOpen(false);
      setEditingMachine(null);
      setFormData({ name: "", description: "" });
      fetchMachines();
    } catch (error) {
      console.error('Erro ao salvar máquina:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar máquina",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (machine: Machine) => {
    setEditingMachine(machine);
    setFormData({
      name: machine.name,
      description: machine.description || ""
    });
    setDialogOpen(true);
  };

  const handleDelete = async (machine: Machine) => {
    if (!confirm('Tem certeza que deseja excluir esta máquina?')) return;

    try {
      const { error } = await supabase
        .from('machines')
        .delete()
        .eq('id', machine.id);

      if (error) throw error;
      toast({ title: "Sucesso", description: "Máquina excluída com sucesso" });
      fetchMachines();
    } catch (error) {
      console.error('Erro ao excluir máquina:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir máquina",
        variant: "destructive"
      });
    }
  };

  const handleAdd = () => {
    setEditingMachine(null);
    setFormData({ name: "", description: "" });
    setDialogOpen(true);
  };

  return (
    <Layout>
      <DataTable
        data={machines}
        columns={columns}
        title="Máquinas"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingMachine ? 'Editar Máquina' : 'Nova Máquina'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingMachine ? 'Atualizar' : 'Criar'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}