import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Home, 
  Users, 
  Factory, 
  Settings, 
  FileText, 
  AlertTriangle, 
  Wrench, 
  BarChart3, 
  Package,
  ClipboardCheck,
  Shield,
  Calendar,
  Building2,
  UserCheck,
  Cog
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    href: "/",
  },
  {
    title: "Produção",
    icon: Factory,
    children: [
      { title: "Máquinas", href: "/machines" },
      { title: "Moldes", href: "/molds" },
      { title: "Peças", href: "/parts" },
      { title: "Ordens de Serviço", href: "/service-orders" },
    ]
  },
  {
    title: "Qualidade",
    icon: Shield,
    children: [
      { title: "Não Conformidades", href: "/non-conformities" },
      { title: "Planos de Inspeção", href: "/inspection-plans" },
      { title: "Registros de Inspeção", href: "/inspection-records" },
      { title: "Instrumentos", href: "/instruments" },
    ]
  },
  {
    title: "Manutenção",
    icon: Wrench,
    children: [
      { title: "Logs de Manutenção", href: "/maintenance" },
      { title: "Histórico de Moldes", href: "/mold-maintenance" },
    ]
  },
  {
    title: "Materiais",
    icon: Package,
    children: [
      { title: "Lotes de Materiais", href: "/materials" },
      { title: "Matérias-Primas", href: "/raw-materials" },
      { title: "Componentes", href: "/components" },
    ]
  },
  {
    title: "Recursos Humanos",
    icon: Users,
    children: [
      { title: "Funcionários", href: "/employees" },
      { title: "Treinamentos", href: "/trainings" },
      { title: "Departamentos", href: "/departments" },
      { title: "Cargos", href: "/roles" },
    ]
  },
  {
    title: "Relatórios",
    icon: BarChart3,
    children: [
      { title: "KPIs", href: "/kpis" },
      { title: "Relatórios", href: "/reports" },
      { title: "Avaliações", href: "/evaluations" },
    ]
  },
  {
    title: "Clientes",
    icon: Building2,
    href: "/clients",
  },
  {
    title: "Tickets",
    icon: AlertTriangle,
    href: "/tickets",
  },
  {
    title: "Configurações",
    icon: Settings,
    href: "/settings",
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  const isParentActive = (children: { href: string }[]) => {
    return children.some(child => location.pathname === child.href);
  };

  return (
    <div className={cn("pb-12 w-64", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            QUALY System
          </h2>
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="space-y-1">
              {menuItems.map((item, index) => (
                <div key={index}>
                  {item.children ? (
                    <div className="space-y-1">
                      <Button
                        variant={isParentActive(item.children) ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        asChild
                      >
                        <div className="flex items-center">
                          <item.icon className="mr-2 h-4 w-4" />
                          {item.title}
                        </div>
                      </Button>
                      <div className="ml-6 space-y-1">
                        {item.children.map((child, childIndex) => (
                          <Button
                            key={childIndex}
                            variant={isActive(child.href) ? "secondary" : "ghost"}
                            className="w-full justify-start text-sm"
                            asChild
                          >
                            <Link to={child.href}>
                              {child.title}
                            </Link>
                          </Button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant={isActive(item.href!) ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      asChild
                    >
                      <Link to={item.href!}>
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.title}
                      </Link>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}