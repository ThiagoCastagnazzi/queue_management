import Pagination from '@/components/pagination';
import { Table } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, IndexProps } from '@/types';

export default function Index({ attendances }: { attendances: IndexProps['attendances'] }) {
    const statusTranslatedPT = [
        { status: 'pending', translated: 'Pendente' },
        { status: 'in_progress', translated: 'Em Andamento' },
        { status: 'called', translated: 'Chamado' },
        { status: 'attended', translated: 'Atendido' },
        { status: 'cancelled', translated: 'Cancelado' },
        { status: 'finished', translated: 'Resolvido' },
    ];
    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Atendimentos', href: '/attendances' }];

    const newData = attendances.data.map((attendance) => {
        return {
            ...attendance,
            formattedCreatedAt:
                new Date(attendance.created_at).toLocaleDateString() + ' ' + String(attendance.created_at).split('T')[1].split('.')[0],
            formattedFinishTime: attendance.finish_time
                ? new Date(attendance.finish_time).toLocaleDateString() + ' ' + String(attendance.finish_time).split(' ')[1].split('.')[0]
                : '',
            ticketCode: attendance?.ticket?.code ?? 'Atendimento sem senha',
            statusTranslated: statusTranslatedPT.find((status) => status.status === attendance.status)?.translated,
            serviceName: attendance.service.name,
        };
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="mx-4 mt-4 flex flex-col gap-4">
                <Table
                    columnsName={['ID', 'Código', 'Serviço', 'Status', 'Criado em', 'Finalizado em']}
                    columns={['id', 'ticketCode', 'serviceName', 'statusTranslated', 'formattedCreatedAt', 'formattedFinishTime']}
                    handleOpen={() => {}}
                    data={newData}
                    type="attendances"
                    isDeletable={false}
                    isEditable={false}
                />

                {attendances.data.length > 0 && (
                    <Pagination
                        current_page={attendances.current_page}
                        last_page={attendances.last_page}
                        per_page={attendances.per_page}
                        total={attendances.total}
                        url="/attendances"
                    />
                )}
            </div>
        </AppLayout>
    );
}
