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

interface Part {
  id: string;
  name: string;
  code: string;
  description: string;
  created_at: string;
}

export default function Parts() {
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<Part | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: ""
  });
  const { toast } = useToast();

  const columns = [
    { key: "code", label: "Código" },
    { key: "name", label: "Nome" },
    { key: "description", label: "Descrição" },
    { 
      key: "created_at", 
      label: "Criado em",
      render: (value: string) => new Date(value).toLocaleDateString('pt-BR')
    }
  ];

  useEffect(() => {
    fetchParts();
  }, []);

  const fetchParts = async () => {
    try {
      const { data, error } = await supabase
        .from('parts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setParts(data || []);
    } catch (error) {
      console.error('Erro ao buscar peças:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar peças",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingPart) {
        const { error } = await supabase
          .from('parts')
          .update(formData)
          .eq('id', editingPart.id);

        if (error) throw error;
        toast({ title: "Sucesso", description: "Peça atualizada com sucesso" });
      } else {
        const { error } = await supabase
          .from('parts')
          .insert([formData]);

        if (error) throw error;
        toast({ title: "Sucesso", description: "Peça criada com sucesso" });
      }

      setDialogOpen(false);
      setEditingPart(null);
      setFormData({ name: "", code: "", description: "" });
      fetchParts();
    } catch (error) {
      console.error('Erro ao salvar peça:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar peça",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (part: Part) => {
    setEditingPart(part);
    setFormData({
      name: part.name,
      code: part.code || "",
      description: part.description || ""
    });
    setDialogOpen(true);
  };

  const handleDelete = async (part: Part) => {
    if (!confirm('Tem certeza que deseja excluir esta peça?')) return;

    try {
      const { error } = await supabase
        .from('parts')
        .delete()
        .eq('id', part.id);

      if (error) throw error;
      toast({ title: "Sucesso", description: "Peça excluída com sucesso" });
      fetchParts();
    } catch (error) {
      console.error('Erro ao excluir peça:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir peça",
        variant: "destructive"
      });
    }
  };

  const handleAdd = () => {
    setEditingPart(null);
    setFormData({ name: "", code: "", description: "" });
    setDialogOpen(true);
  };

  return (
    <Layout>
      <DataTable
        data={parts}
        columns={columns}
        title="Peças"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingPart ? 'Editar Peça' : 'Nova Peça'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="code">Código</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
              />
            </div>

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
                {editingPart ? 'Atualizar' : 'Criar'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}