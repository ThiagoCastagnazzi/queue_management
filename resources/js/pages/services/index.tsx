import { DeleteModal, ServiceModal } from '@/components/modal';
import Pagination from '@/components/pagination';
import { Table } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, IndexProps, Service } from '@/types';
import { useState } from 'react';

export default function Index({ services }: { services: IndexProps['services'] }) {
    const [modalState, setModalState] = useState<{
        open: boolean;
        type?: 'new' | 'edit' | 'delete';
        service: Service | undefined;
    }>({
        open: false,
        type: undefined,
        service: undefined,
    });

    const handleOpen = (type: 'new' | 'edit' | 'delete', service: Service | undefined) => {
        setModalState({ open: true, type, service });
    };

    const handleClose = () => {
        setModalState({ open: false, type: undefined, service: undefined });
    };

    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Serviços', href: '/services' }];

    const newData = services.data.map((service) => {
        return {
            ...service,
            priorityName: service.priority === 'low' ? 'Baixa' : service.priority === 'medium' ? 'Média' : 'Alta',
            boothName: service.booths.map((booth) => booth.name).join(', '),
        };
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="mx-4 flex flex-col gap-4">
                <div className="mt-4 flex justify-end">
                    <button
                        className="bg-sidebar text-sidebar-primary flex h-[35px] w-[200px] cursor-pointer items-center justify-center gap-[8px] rounded-[4px] px-[16px] transition-all hover:bg-gray-600"
                        onClick={() => handleOpen('new', undefined)}
                    >
                        <span className="hover:text-sidebar dark:hover:text-sidebar-primary text-[16px] font-bold">Adicionar Serviço</span>
                    </button>
                </div>

                <Table
                    columnsName={['ID', 'Nome', 'Guichês', 'Prioridade']}
                    columns={['id', 'name', 'boothName', 'priorityName']}
                    data={newData}
                    type="services"
                    handleOpen={handleOpen}
                    isDeletable={true}
                    isEditable={true}
                />

                {services.data.length > 0 && (
                    <Pagination
                        current_page={services.current_page}
                        last_page={services.last_page}
                        per_page={services.per_page}
                        total={services.total}
                        url="/services"
                    />
                )}
            </div>
            {modalState.open && modalState.type === 'new' && (
                <ServiceModal service={modalState.service} onClose={handleClose} type={modalState.type} />
            )}
            {modalState.open && modalState.type === 'edit' && (
                <ServiceModal service={modalState.service} onClose={handleClose} type={modalState.type} />
            )}
            {modalState.open && modalState.type === 'delete' && (
                <DeleteModal id={modalState.service?.id} name="Serviço" onClose={handleClose} type="services" />
            )}
        </AppLayout>
    );
}
