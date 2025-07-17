import Pagination from '@/components/pagination';
import { Table } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, IndexProps } from '@/types';
import moment from 'moment';

export default function Index({ tickets }: { tickets: IndexProps['tickets'] }) {
    const statusTranslatedPT = [
        { status: 'pending', translated: 'Pendente' },
        { status: 'called', translated: 'Chamado' },
        { status: 'attended', translated: 'Atendido' },
        { status: 'cancelled', translated: 'Cancelado' },
        { status: 'solved', translated: 'Resolvido' },
    ];
    const priorityTranslatedPT = [
        { priority: 'low', translated: 'Baixa' },
        { priority: 'medium', translated: 'Média' },
        { priority: 'high', translated: 'Alta' },
    ];

    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Tickets', href: '/tickets' }];

    const newData = tickets.data.map((ticket) => {
        return {
            ...ticket,
            formattedCreatedAt: moment(ticket.created_at).format('DD/MM/YYYY HH:mm:ss'),
            priorityTranslated: priorityTranslatedPT.find((priority) => priority.priority === ticket.priority)?.translated,
            statusTranslated: statusTranslatedPT.find((status) => status.status === ticket.status)?.translated,
        };
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="mx-4 mt-4 flex flex-col gap-4">
                <Table
                    columnsName={['ID', 'Código', 'Status', 'Prioridade', 'Criado em']}
                    columns={['id', 'code', 'statusTranslated', 'priorityTranslated', 'formattedCreatedAt']}
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
        </AppLayout>
    );
}
