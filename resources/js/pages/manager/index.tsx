import { DeleteModal } from '@/components/modal';
import Pagination from '@/components/pagination';
import { ManagerTable } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Booth, BreadcrumbItem, IndexProps, Ticket } from '@/types';
import { router } from '@inertiajs/react';
import moment from 'moment';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface DashboardProps {
    cancelledTickets: number;
    totalTickets: number;
    totalAttendees: number;
    tickets: IndexProps['tickets'];
    booth: Booth;
}

export default function Index(props: DashboardProps) {
    const { booth, tickets, totalTickets, totalAttendees, cancelledTickets } = props;
    const statusTranslatedPT = [
        { status: 'pending', translated: 'Pendente' },
        { status: 'called', translated: 'Chamado' },
        { status: 'attended', translated: 'Atendido' },
        { status: 'canceled', translated: 'Cancelado' },
        { status: 'solved', translated: 'Resolvido' },
    ];
    const priorityTranslatedPT = [
        { priority: 'low', translated: 'Baixa' },
        { priority: 'medium', translated: 'Média' },
        { priority: 'high', translated: 'Alta' },
    ];

    const [modalState, setModalState] = useState<{
        open: boolean;
        type?: string;
        ticket: Ticket | undefined;
    }>({
        open: false,
        type: undefined,
        ticket: undefined,
    });

    const handleOpen = (action: string, ticket: Ticket) => {
        if (action.toLowerCase() === 'chamar') {
            const payload = {
                ticket_id: ticket.id,
                status: 'called',
                booth_id: booth.id,
                services: ticket.services.map((service) => service.id),
            };

            router.put(route('tickets.update', { ticket: ticket.id }), payload, {
                onSuccess: () => {
                    toast.success('Chamando senha!');
                },
                onError: () => {
                    toast.error('Erro ao chamar senha.');
                },
            });
        }

        if (action.toLowerCase() === 'excluir senha') {
            setModalState({ open: true, type: action.toLowerCase(), ticket });
        }
    };

    const handleClose = () => {
        setModalState({ open: false, type: undefined, ticket: undefined });
    };

    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Gerenciamento de Fila', href: '/manager' }];

    const newData =
        tickets?.data?.map((ticket) => {
            return {
                ...ticket,
                formattedCreatedAt: moment(ticket.created_at).format('DD/MM/YYYY HH:mm:ss'),
                priorityTranslated: priorityTranslatedPT.find((priority) => priority.priority === ticket.priority)?.translated,
                statusTranslated: statusTranslatedPT.find((status) => status.status === ticket.status)?.translated,
            };
        }) || [];

    useEffect(() => {
        if (booth) {
            window.Echo.channel(`Booth.${booth.id}`).listen('.Booth', () => {
                router.visit(route('manager.index', { page: tickets.current_page }));
            });
        }

        return () => {
            if (booth) {
                window.Echo.leave(`Booth.${booth.id}`);
            }
        };
    }, [booth, tickets.current_page]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="grid grid-cols-1 gap-4 px-4 py-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="w-full rounded-2xl border p-4 shadow-lg transition-shadow duration-300 hover:shadow-xl">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500">
                            <span className="text-xl text-white">📊</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="text-sidebar-primary text-2xl font-bold">{totalTickets}</div>
                            <div className="text-sidebar-primary text-sm">Total Tickets (Dia)</div>
                        </div>
                    </div>
                </div>

                <div className="w-full rounded-2xl border p-4 shadow-lg transition-shadow duration-300 hover:shadow-xl">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500">
                            <span className="text-xl text-white">📈</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="text-sidebar-primary text-2xl font-bold">{totalAttendees}</div>
                            <div className="text-sidebar-primary text-sm">Total Atendimentos (Dia)</div>
                        </div>
                    </div>
                </div>

                <div className="w-full rounded-2xl border p-4 shadow-lg transition-shadow duration-300 hover:shadow-xl">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500">
                            <span className="text-xl text-white">📅</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="text-sidebar-primary text-2xl font-bold">{tickets.total}</div>
                            <div className="text-sidebar-primary text-sm">Tickets Pendentes (Dia)</div>
                        </div>
                    </div>
                </div>

                <div className="w-full rounded-2xl border p-4 shadow-lg transition-shadow duration-300 hover:shadow-xl">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500">
                            <span className="text-xl text-white">📉</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="text-sidebar-primary text-2xl font-bold">{cancelledTickets}</div>
                            <div className="text-sidebar-primary text-sm">Tickets Cancelados (Dia)</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-4 flex flex-col gap-4">
                <ManagerTable
                    columnsName={['ID', 'Código', 'Status', 'Prioridade', 'Criado em']}
                    columns={['id', 'code', 'statusTranslated', 'priorityTranslated', 'formattedCreatedAt']}
                    data={newData}
                    handleOpen={handleOpen}
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
            {modalState.open && modalState.type === 'excluir senha' && (
                <DeleteModal id={modalState.ticket?.id} onClose={handleClose} name="Ticket" type="tickets" />
            )}
        </AppLayout>
    );
}
