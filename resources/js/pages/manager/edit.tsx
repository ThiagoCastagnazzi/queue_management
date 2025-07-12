import { DeleteModal, ForwardAttendanceModal, StartAttendanceModal } from '@/components/modal';
import AppLayout from '@/layouts/app-layout';
import { Booth, BreadcrumbItem, Service, SharedData, ShowProps, Ticket } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { Play, SendHorizonal, Volume2, X } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Edit({ ticket, services, booth }: { ticket: ShowProps['ticket']; services: Service[]; booth: Booth }) {
    const { auth } = usePage<SharedData>().props;

    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Gerenciamento de Fila', href: '/manager' }];
    const ticketServices = ticket?.services || [];

    const [modalState, setModalState] = useState<{
        open: boolean;
        type?: string;
        ticket?: Ticket | undefined;
    }>({
        open: false,
        type: undefined,
        ticket: undefined,
    });

    const handleOpen = (action: string) => {
        if (action.toLowerCase() === 'iniciar atendimento') {
            setModalState({ open: true, type: action.toLowerCase() });
        }

        if (action.toLowerCase() === 'chamar novamente') {
            const payload = {
                ticket_id: ticket.id,
                status: 'called',
                booth_id: booth.id,
                services: ticket.services.map((service) => service.id),
            };

            router.put(route('tickets.update', { ticket: ticket.id }), payload, {
                onSuccess: () => {
                    toast.success('Chamando senha novamente!');
                },
                onError: () => {
                    toast.error('Erro ao chamar senha novamente.');
                },
            });
        }

        if (action.toLowerCase() === 'encaminhar atendimento') {
            setModalState({ open: true, type: action.toLowerCase() });
        }

        if (action.toLowerCase() === 'excluir senha') {
            setModalState({ open: true, type: action.toLowerCase(), ticket });
        }
    };

    const handleClose = () => {
        setModalState({ open: false, type: undefined, ticket: undefined });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="p-4">
                <div className="bg-sidebar relative flex h-[calc(100vh-7rem)] flex-col items-center justify-center rounded-2xl text-white">
                    <h1 className="text-sidebar-primary text-3xl font-bold">{ticket?.code || 'Totem'}</h1>
                    <div className="mt-4 text-gray-400">
                        {ticketServices.length > 0 ? (
                            ticketServices.map((service, index) => (
                                <p key={index} className="text-lg">
                                    Services: {service.name}
                                </p>
                            ))
                        ) : (
                            <p className="text-lg">Nenhum serviço disponível.</p>
                        )}
                    </div>

                    <div className="absolute bottom-4 flex gap-4">
                        <div className="group relative flex flex-col items-center">
                            <span className="text-sidebar-primary absolute -top-8 text-sm whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100">
                                Iniciar Atendimento
                            </span>
                            <button
                                className="cursor-pointer rounded-full bg-gray-700 p-3 transition-all hover:bg-gray-600"
                                onClick={() => handleOpen('iniciar atendimento')}
                            >
                                <Play />
                            </button>
                        </div>

                        <div className="group relative flex flex-col items-center">
                            <span className="text-sidebar-primary absolute -top-8 text-sm whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100">
                                Chamar Novamente
                            </span>
                            <button
                                className="cursor-pointer rounded-full bg-gray-700 p-3 transition-all hover:bg-gray-600"
                                onClick={() => handleOpen('chamar novamente')}
                            >
                                <Volume2 />
                            </button>
                        </div>

                        <div className="group relative flex flex-col items-center">
                            <span className="text-sidebar-primary absolute -top-8 text-sm whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100">
                                Encaminhar Atendimento
                            </span>
                            <button
                                className="cursor-pointer rounded-full bg-gray-700 p-3 transition-all hover:bg-gray-600"
                                onClick={() => handleOpen('encaminhar atendimento')}
                            >
                                <SendHorizonal />
                            </button>
                        </div>

                        <div className="group relative flex flex-col items-center">
                            <span className="text-sidebar-primary absolute -top-8 text-sm whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100">
                                Cancelar Senha
                            </span>
                            <button
                                className="cursor-pointer rounded-full bg-red-600 p-3 transition-all hover:bg-red-700"
                                onClick={() => handleOpen('excluir senha')}
                            >
                                <X />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {modalState.open && modalState.type === 'iniciar atendimento' && (
                <StartAttendanceModal ticket={ticket} onClose={handleClose} booth_id={auth.user?.booth.id} user_id={auth.user.id} />
            )}

            {modalState.open && modalState.type === 'encaminhar atendimento' && (
                <ForwardAttendanceModal
                    ticket={ticket}
                    services={services}
                    onClose={handleClose}
                    booth_id={auth.user?.booth.id}
                    user_id={auth.user.id}
                />
            )}

            {modalState.open && modalState.type === 'excluir senha' && (
                <DeleteModal id={modalState.ticket?.id} onClose={handleClose} name="Ticket" type="tickets" />
            )}
        </AppLayout>
    );
}
