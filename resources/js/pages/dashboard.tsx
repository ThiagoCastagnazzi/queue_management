import Pagination from '@/components/pagination';
import { Table } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { IndexProps, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface DashboardProps {
    cancelledTickets: number;
    totalTickets: number;
    totalAttendees: number;
    tickets: IndexProps['tickets'];
}

export default function Dashboard(props: DashboardProps) {
    const { tickets, cancelledTickets, totalAttendees, totalTickets } = props;

    const statusTranslatedPT = [
        { status: 'pending', translated: 'Pendente' },
        { status: 'in_progress', translated: 'Em Andamento' },
        { status: 'called', translated: 'Chamado' },
        { status: 'attended', translated: 'Atendido' },
        { status: 'cancelled', translated: 'Cancelado' },
        { status: 'solved', translated: 'Resolvido' },
    ];

    const newData = tickets.data.map((ticket) => {
        return {
            ...ticket,
            statusTranslated: statusTranslatedPT.find((status) => status.status === ticket.status)?.translated,
            createdAtFormatted: new Date(ticket.created_at).toLocaleDateString() + ' ' + String(ticket.created_at).split('T')[1].split('.')[0],
        };
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative flex flex-col gap-2 overflow-hidden rounded-xl border bg-white p-6 shadow-sm dark:bg-[#161615]">
                        <h2 className="text-lg font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">Tickets do mês</h2>
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500">
                                <span className="text-xl text-white">📊</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="text-sidebar-primary text-2xl font-bold">{totalTickets}</div>
                            </div>
                        </div>
                    </div>

                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative flex flex-col gap-2 overflow-hidden rounded-xl border bg-white p-6 shadow-sm dark:bg-[#161615]">
                        <h2 className="text-lg font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">Atendimentos do mês</h2>
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500">
                                <span className="text-xl text-white">🎧</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="text-sidebar-primary text-2xl font-bold">{totalAttendees}</div>
                            </div>
                        </div>
                    </div>

                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative flex flex-col gap-2 overflow-hidden rounded-xl border bg-white p-6 shadow-sm dark:bg-[#161615]">
                        <h2 className="text-lg font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">Tickets Cancelados do mês</h2>
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500">
                                <span className="text-xl text-white">🎧</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="text-sidebar-primary text-2xl font-bold">{cancelledTickets}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-sidebar-border/70 dark:border-sidebar-border relative mb-10 rounded-xl bg-white p-6 shadow-sm dark:bg-[#161615]">
                    <h2 className="mb-2 text-lg font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">Histórico de Tickets</h2>
                    <Table
                        columnsName={['ID', 'Código', 'Status', 'Criado em']}
                        columns={['id', 'code', 'statusTranslated', 'createdAtFormatted']}
                        handleOpen={() => {}}
                        data={newData}
                        type="tickets"
                        isDeletable={false}
                        isEditable={false}
                    />

                    {tickets.data.length > 0 && (
                        <Pagination
                            current_page={tickets.current_page}
                            last_page={tickets.last_page}
                            per_page={tickets.per_page}
                            total={tickets.total}
                            url="/tickets"
                        />
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
