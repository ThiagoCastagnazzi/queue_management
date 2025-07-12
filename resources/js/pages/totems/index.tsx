import { DeleteModal, TotemModal } from '@/components/modal';
import Pagination from '@/components/pagination';
import { Table } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, IndexProps, Service, Totem } from '@/types';
import { useState } from 'react';

export default function Index({ totems, services }: { totems: IndexProps['totems']; services: Service[] }) {
    const [modalState, setModalState] = useState<{
        open: boolean;
        type?: 'new' | 'edit' | 'delete';
        totem: Totem | undefined;
    }>({
        open: false,
        type: undefined,
        totem: undefined,
    });

    const handleOpen = (type: 'new' | 'edit' | 'delete', totem: Totem | undefined) => {
        setModalState({ open: true, type, totem });
    };

    const handleClose = () => {
        setModalState({ open: false, type: undefined, totem: undefined });
    };

    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Totems', href: '/totems' }];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="mx-4 flex flex-col gap-4">
                <div className="mt-4 flex justify-end">
                    <button
                        className="bg-sidebar text-sidebar-primary flex h-[35px] w-[200px] cursor-pointer items-center justify-center gap-[8px] rounded-[4px] px-[16px] transition-all hover:bg-gray-600"
                        onClick={() => handleOpen('new', undefined)}
                    >
                        <span className="hover:text-sidebar dark:hover:text-sidebar-primary text-[16px] font-bold">Adicionar Totem</span>
                    </button>
                </div>

                <Table
                    columnsName={['ID', 'Nome']}
                    columns={['id', 'name']}
                    data={totems.data}
                    type="totems"
                    handleOpen={handleOpen}
                    isDeletable={true}
                    isEditable={true}
                />

                {totems.data.length > 0 && (
                    <Pagination
                        current_page={totems.current_page}
                        last_page={totems.last_page}
                        per_page={totems.per_page}
                        total={totems.total}
                        url="/totems"
                    />
                )}
            </div>
            {modalState.open && modalState.type === 'new' && (
                <TotemModal totem={modalState.totem} onClose={handleClose} type={modalState.type} services={services} />
            )}
            {modalState.open && modalState.type === 'edit' && (
                <TotemModal totem={modalState.totem} onClose={handleClose} type={modalState.type} services={services} />
            )}
            {modalState.open && modalState.type === 'delete' && (
                <DeleteModal id={modalState.totem?.id} name="Totem" onClose={handleClose} type="totems" />
            )}
        </AppLayout>
    );
}
