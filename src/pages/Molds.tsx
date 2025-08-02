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

interface Mold {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export default function Molds() {
  const [molds, setMolds] = useState<Mold[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMold, setEditingMold] = useState<Mold | null>(null);
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
    fetchMolds();
  }, []);

  const fetchMolds = async () => {
    try {
      const { data, error } = await supabase
        .from('molds')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMolds(data || []);
    } catch (error) {
      console.error('Erro ao buscar moldes:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar moldes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingMold) {
        const { error } = await supabase
          .from('molds')
          .update(formData)
          .eq('id', editingMold.id);

        if (error) throw error;
        toast({ title: "Sucesso", description: "Molde atualizado com sucesso" });
      } else {
        const { error } = await supabase
          .from('molds')
          .insert([formData]);

        if (error) throw error;
        toast({ title: "Sucesso", description: "Molde criado com sucesso" });
      }

      setDialogOpen(false);
      setEditingMold(null);
      setFormData({ name: "", description: "" });
      fetchMolds();
    } catch (error) {
      console.error('Erro ao salvar molde:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar molde",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (mold: Mold) => {
    setEditingMold(mold);
    setFormData({
      name: mold.name,
      description: mold.description || ""
    });
    setDialogOpen(true);
  };

  const handleDelete = async (mold: Mold) => {
    if (!confirm('Tem certeza que deseja excluir este molde?')) return;

    try {
      const { error } = await supabase
        .from('molds')
        .delete()
        .eq('id', mold.id);

      if (error) throw error;
      toast({ title: "Sucesso", description: "Molde excluído com sucesso" });
      fetchMolds();
    } catch (error) {
      console.error('Erro ao excluir molde:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir molde",
        variant: "destructive"
      });
    }
  };

  const handleAdd = () => {
    setEditingMold(null);
    setFormData({ name: "", description: "" });
    setDialogOpen(true);
  };

  return (
    <Layout>
      <DataTable
        data={molds}
        columns={columns}
        title="Moldes"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingMold ? 'Editar Molde' : 'Novo Molde'}
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
                {editingMold ? 'Atualizar' : 'Criar'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}