import { BoothModal, DeleteModal } from '@/components/modal';
import Pagination from '@/components/pagination';
import { Table } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Booth, BreadcrumbItem, IndexProps, Service, User } from '@/types';
import { useState } from 'react';

export default function Index({ booths, services, users }: { booths: IndexProps['booths']; services: Service[]; users: User[] }) {
    const [modalState, setModalState] = useState<{
        open: boolean;
        type?: 'new' | 'edit' | 'delete';
        booth: Booth | undefined;
    }>({
        open: false,
        type: undefined,
        booth: undefined,
    });

    const handleOpen = (type: 'new' | 'edit' | 'delete', booth: Booth | undefined) => {
        setModalState({ open: true, type, booth });
    };

    const handleClose = () => {
        setModalState({ open: false, type: undefined, booth: undefined });
    };

    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Guichês', href: '/booths' }];

    const newData = booths.data.map((booth) => {
        return {
            ...booth,
            serviceName: booth.services.map((service) => service.name).join(', '),
            userName: users.find((user) => user.id === booth.user_id)?.name || 'Nenhum usuário no Guichê',
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
                        <span className="hover:text-sidebar dark:hover:text-sidebar-primary text-[16px] font-bold">Adicionar Guichê</span>
                    </button>
                </div>

                <Table
                    columnsName={['ID', 'Nome', 'Serviços', 'Usuário']}
                    columns={['id', 'name', 'serviceName', 'userName']}
                    data={newData}
                    type="booths"
                    handleOpen={handleOpen}
                    isDeletable={true}
                    isEditable={true}
                />

                {booths.data.length > 0 && (
                    <Pagination
                        current_page={booths.current_page}
                        last_page={booths.last_page}
                        per_page={booths.per_page}
                        total={booths.total}
                        url="/booths"
                    />
                )}
            </div>
            {modalState.open && modalState.type === 'new' && (
                <BoothModal booth={modalState.booth} onClose={handleClose} type={modalState.type} services={services} users={users} />
            )}
            {modalState.open && modalState.type === 'edit' && (
                <BoothModal booth={modalState.booth} onClose={handleClose} type={modalState.type} services={services} users={users} />
            )}
            {modalState.open && modalState.type === 'delete' && (
                <DeleteModal id={modalState.booth?.id} name="Guichê" onClose={handleClose} type="booths" />
            )}
        </AppLayout>
    );
}
