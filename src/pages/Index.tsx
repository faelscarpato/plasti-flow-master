import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Factory, 
  Cog, 
  ClipboardCheck, 
  Package, 
  Users, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings
} from "lucide-react";

const Index = () => {
  const stats = [
    { title: "Máquinas Ativas", value: "12", change: "+2%", icon: Factory, color: "text-blue-600" },
    { title: "Produção Hoje", value: "1,247", change: "+15%", icon: Package, color: "text-green-600" },
    { title: "Qualidade", value: "98.5%", change: "+0.5%", icon: CheckCircle, color: "text-emerald-600" },
    { title: "Eficiência (OEE)", value: "87%", change: "+3%", icon: TrendingUp, color: "text-purple-600" },
  ];

  const quickActions = [
    { title: "Controle de Produção", icon: Factory, href: "/producao" },
    { title: "Gestão de Qualidade", icon: ClipboardCheck, href: "/qualidade" },
    { title: "Manutenção", icon: Cog, href: "/manutencao" },
    { title: "Estoque", icon: Package, href: "/estoque" },
    { title: "Funcionários", icon: Users, href: "/funcionarios" },
    { title: "Configurações", icon: Settings, href: "/configuracoes" },
  ];

  const alerts = [
    { type: "warning", message: "Manutenção preventiva Máquina #05 vence em 2 dias", time: "2h" },
    { type: "error", message: "Não conformidade detectada - Lote #L001234", time: "1h" },
    { type: "info", message: "Novo lote de matéria-prima recebido", time: "30min" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">QUALY System</h1>
              <p className="text-sm text-muted-foreground">Sistema de Gestão Industrial</p>
            </div>
            <Button variant="outline" size="sm">
              <Users className="w-4 h-4 mr-2" />
              Perfil
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-green-600 mt-1">{stat.change}</p>
                    </div>
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-auto p-6 flex flex-col items-center gap-3"
                      onClick={() => console.log(`Navigate to ${action.href}`)}
                    >
                      <Icon className="h-8 w-8" />
                      <span className="text-sm font-medium text-center">{action.title}</span>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Alertas Recentes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {alerts.map((alert, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    alert.type === 'error' ? 'bg-red-500' :
                    alert.type === 'warning' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{alert.time} atrás</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Production Status */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Status de Produção em Tempo Real</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Linhas de Produção</h4>
                <div className="space-y-2">
                  {[
                    { name: "Linha 01", status: "ativa", product: "Produto A" },
                    { name: "Linha 02", status: "ativa", product: "Produto B" },
                    { name: "Linha 03", status: "parada", product: "Manutenção" },
                  ].map((line, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded border">
                      <span className="font-medium">{line.name}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant={line.status === 'ativa' ? 'default' : 'secondary'}>
                          {line.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{line.product}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Moldes em Uso</h4>
                <div className="space-y-2">
                  {[
                    { name: "Molde M001", cycles: "2,450", limit: "5,000" },
                    { name: "Molde M002", cycles: "1,890", limit: "5,000" },
                    { name: "Molde M003", cycles: "4,850", limit: "5,000" },
                  ].map((mold, index) => (
                    <div key={index} className="p-2 rounded border">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{mold.name}</span>
                        <span className="text-sm">{mold.cycles}/{mold.limit}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${(parseInt(mold.cycles.replace(',', '')) / parseInt(mold.limit.replace(',', ''))) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Qualidade Hoje</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Peças Aprovadas</span>
                    <span className="text-green-600 font-semibold">1,205</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Não Conformes</span>
                    <span className="text-red-600 font-semibold">18</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxa de Aprovação</span>
                    <span className="font-semibold">98.5%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
