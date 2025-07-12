import { UserModal } from '@/components/modal';
import Pagination from '@/components/pagination';
import { Table } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { IndexProps, User } from '@/types';
import { useState } from 'react';

export default function Index({ users }: IndexProps) {
    const [modalState, setModalState] = useState<{
        open: boolean;
        type?: 'new' | 'edit' | 'delete';
        user: User | undefined;
    }>({
        open: false,
        type: undefined,
        user: undefined,
    });

    const handleOpen = (type: 'new' | 'edit' | 'delete', user: User | undefined) => {
        setModalState({ open: true, type, user });
    };

    const handleClose = () => {
        setModalState({ open: false, type: undefined, user: undefined });
    };

    const breadcrumbs = [{ title: 'Usuários', href: '/users' }];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="mx-4 mt-4 flex flex-col gap-4">
                <div className="mt-4 flex justify-end">
                    <button
                        className="bg-sidebar text-sidebar-primary flex h-[35px] w-[200px] cursor-pointer items-center justify-center gap-[8px] rounded-[4px] px-[16px] transition-all hover:bg-gray-600"
                        onClick={() => handleOpen('new', undefined)}
                    >
                        <span className="hover:text-sidebar dark:hover:text-sidebar-primary text-[16px] font-bold">Adicionar Usuário</span>
                    </button>
                </div>

                <Table
                    columnsName={['ID', 'Nome', 'E-mail']}
                    columns={['id', 'name', 'email']}
                    data={users.data}
                    type="users"
                    handleOpen={handleOpen}
                    isDeletable={false}
                    isEditable={true}
                />

                {users.data.length > 0 && (
                    <Pagination
                        current_page={users.current_page}
                        last_page={users.last_page}
                        per_page={users.per_page}
                        total={users.total}
                        url="/users"
                    />
                )}

                {modalState.open && modalState.type === 'new' && <UserModal user={modalState.user} onClose={handleClose} type={modalState.type} />}
                {modalState.open && modalState.type === 'edit' && <UserModal user={modalState.user} onClose={handleClose} type={modalState.type} />}
            </div>
        </AppLayout>
    );
}
