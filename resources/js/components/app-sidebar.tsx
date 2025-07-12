import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Archive, LayoutGrid, List, MapPinHouse, Monitor, Ticket, Users, Wrench } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Gerenciamento de Fila',
        url: '/manager',
        icon: List,
    },
    {
        title: 'Serviços',
        url: '/services',
        icon: Wrench,
    },
    {
        title: 'Monitores',
        url: '/monitors',
        icon: Monitor,
    },
    {
        title: 'Guichês',
        url: '/booths',
        icon: MapPinHouse,
    },
    {
        title: 'Senhas',
        url: '/tickets',
        icon: Ticket,
    },
    {
        title: 'Atendimentos',
        url: '/attendances',
        icon: Archive,
    },
    {
        title: 'Usuários',
        url: '/users',
        icon: Users,
    },
    {
        title: 'Totems',
        url: '/totems',
        icon: Monitor,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
