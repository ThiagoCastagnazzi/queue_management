import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    booth: Booth;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Attendance {
    id: number;
    ticket: Ticket;
    booth: Booth;
    status: string;
    created_at: string;
    updated_at: string;
    finish_time: string | null;
    service: Service;
}

interface PaginatedResults<T> {
    data: T[];
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    // Outros campos que você pode precisar
}

interface User {
    id: number;
    name: string;
    email: string;
    // Outros campos do usuário
}

interface Totem {
    id: number;
    name: string;
    services: Service[];
    // Outros campos do totem
}

interface Booth {
    id: number;
    name: string;
    number: number;
    active: boolean;
    services: Service[];
    user_id: number;
}

interface Monitor {
    id: number;
    name: string;
    services: Service[];
}

interface PaginatedResults<T> {
    data: T[];
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
}

interface IndexProps {
    users: PaginatedResults<User>;
    services: PaginatedResults<Service>;
    totems: PaginatedResults<Totem>;
    tickets: PaginatedResults<Ticket>;
    booths: PaginatedResults<Booth>;
    attendances: PaginatedResults<Attendance>;
    monitors: PaginatedResults<Monitor>;
}

interface ShowProps {
    ticket: Ticket;
}

interface Service {
    id: number;
    name: string;
    prefix: string;
    priority: string;
    preferential: boolean;
    active: boolean;
    created_at: string;
    updated_at: string;
    booths: Booth[];
}

interface TableType<T> {
    columns: string[];
    data: T[];
    isEditable: boolean;
    isDeletable: boolean;
}

interface Ticket {
    id: number;
    uuid: string;
    code: string;
    services: Service[];
    status: string;
    priority: string;
    created_at: string;
    updated_at: string;
    booth: Booth;
    url: string|null;
}
