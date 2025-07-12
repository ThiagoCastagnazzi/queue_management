import { MonitorModal } from '@/components/modal'; // Importe o modal de Monitor
import Pagination from '@/components/pagination';
import { Table } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, IndexProps, Monitor, Service } from '@/types';
import { useState } from 'react';

export default function Index({ monitors, services }: { monitors: IndexProps['monitors']; services: Service[] }) {
    const [modalState, setModalState] = useState<{
        open: boolean;
        type?: 'new' | 'edit' | 'delete';
        monitor: Monitor | undefined;
    }>({
        open: false,
        type: undefined,
        monitor: undefined,
    });

    const handleOpen = (type: 'new' | 'edit' | 'delete', monitor: Monitor | undefined) => {
        setModalState({ open: true, type, monitor });
    };

    const handleClose = () => {
        setModalState({ open: false, type: undefined, monitor: undefined });
    };

    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Monitores', href: '/monitors' }];

    const newData = monitors.data.map((monitor) => {
        return {
            ...monitor,
            servicesName: monitor.services.map((service) => service.name).join(', '),
        };
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="mx-4 mt-4 flex flex-col gap-4">
                <div className="mt-4 flex justify-end">
                    <button
                        className="bg-sidebar text-sidebar-primary flex h-[35px] w-[200px] cursor-pointer items-center justify-center gap-[8px] rounded-[4px] px-[16px] transition-all hover:bg-gray-600"
                        onClick={() => handleOpen('new', undefined)}
                    >
                        <span className="hover:text-sidebar dark:hover:text-sidebar-primary text-[16px] font-bold">Adicionar Monitor</span>
                    </button>
                </div>

                <Table
                    columnsName={['ID', 'Nome', 'Serviços']}
                    columns={['id', 'name', 'servicesName']}
                    data={newData}
                    type="monitors"
                    handleOpen={handleOpen}
                    isDeletable={true}
                    isEditable={true}
                />

                {monitors.data.length > 0 && (
                    <Pagination
                        current_page={monitors.current_page}
                        last_page={monitors.last_page}
                        per_page={monitors.per_page}
                        total={monitors.total}
                        url="/monitors"
                    />
                )}

                {modalState.open && modalState.type === 'new' && (
                    <MonitorModal monitor={modalState.monitor} onClose={handleClose} type={modalState.type} services={services} />
                )}
                {modalState.open && modalState.type === 'edit' && (
                    <MonitorModal monitor={modalState.monitor} onClose={handleClose} type={modalState.type} services={services} />
                )}
            </div>
        </AppLayout>
    );
}
