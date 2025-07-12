import { Booth, Service, Ticket, Totem, User } from '@/types';
import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface ServiceModelProps {
    service: Service | undefined;
    onClose: () => void;
    type: 'new' | 'edit';
}

interface BoothModalProps {
    booth: Booth | undefined;
    services: Service[];
    users: User[];
    onClose: () => void;
    type: 'new' | 'edit';
}

interface TotemModalProps {
    totem: Totem | undefined;
    services: Service[];
    onClose: () => void;
    type: 'new' | 'edit';
}

interface DeleteModalProps {
    id: number | undefined;
    onClose: () => void;
    type: string;
    name: string;
}

interface StartServiceModalProps {
    ticket: Ticket | undefined;
    onClose: () => void;
    booth_id: number | null;
    user_id: number;
}

interface FinishServiceModalProps {
    ticket: Ticket | undefined;
    services: Service[];
    onClose: () => void;
}

interface CallAgainModalProps {
    ticket: Ticket | undefined;
    onClose: () => void;
}

interface UserModalProps {
    user: User | undefined;
    onClose: () => void;
    type: 'new' | 'edit';
}

export const ModalTemplate = ({ children }: { children: React.ReactNode }) => {
    return <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50">{children}</div>;
};

export const TotemModal = ({ totem, onClose, type, services }: TotemModalProps) => {
    const [selectedServices, setSelectedServices] = useState<Service[]>(totem?.services || []);
    const [totemName, setTotemName] = useState<string>(totem?.name || '');

    const handleChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTotemName(e.target.value);
    };

    const handleSubmit = () => {
        if (type === 'new') {
            const payload = {
                name: totemName,
                services: selectedServices.map((service) => service.id),
            };

            router.post(route('totems.store'), payload, {
                onSuccess: () => {
                    toast.success('Totem cadastrado com sucesso!');
                    onClose();
                },
                onError: () => {
                    toast.error('Erro ao cadastrar totem.');
                },
            });
        }

        if (type === 'edit') {
            const payload = {
                id: totem?.id,
                name: totemName,
                services: selectedServices.map((service) => service.id),
            };

            router.put(route('totems.update', payload.id), payload, {
                onSuccess: () => {
                    toast.success('Totem atualizado com sucesso!');
                    onClose();
                },
                onError: () => {
                    toast.error('Erro ao atualizar totem.');
                },
            });
        }
    };

    useEffect(() => {
        if (totem && type === 'edit') {
            setSelectedServices(totem.services);
            setTotemName(totem.name);
        }

        if (type === 'new') {
            setSelectedServices([]);
            setTotemName('');
        }
    }, [totem, type]);

    const toogleBooth = (service: Service) => {
        if (selectedServices.some((s) => s.id === service.id)) {
            setSelectedServices(selectedServices.filter((s) => s.id !== service.id));
        } else {
            setSelectedServices([...selectedServices, service]);
        }
    };

    return (
        <ModalTemplate>
            <div className="bg-sidebar w-[600px] rounded-lg p-6 text-white shadow-lg">
                <h1 className="text-sidebar-primary text-2xl font-bold">{type === 'new' ? 'Adicionar Totem' : 'Editar Totem'}</h1>

                <div className="mt-4">
                    <label htmlFor="name" className="text-sidebar-primary">
                        Nome do Totem
                    </label>
                    <input
                        type="text"
                        id="name"
                        className="bg-accent text-sidebar-primary mt-1 w-full rounded-lg p-2"
                        placeholder="Nome do Totem"
                        value={totemName}
                        onChange={handleChanges}
                    />
                </div>

                <div className="bg-sidebar-accent mt-4 rounded-lg p-4 shadow-lg">
                    <h2 className="text-sidebar-primary text-lg font-semibold">Serviços Disponíveis</h2>
                    <div className="mt-2 grid max-h-[200px] grid-cols-2 gap-2 overflow-auto">
                        {services.length ? (
                            services.map((service) => (
                                <div
                                    key={service.id}
                                    className={`flex cursor-pointer items-center justify-between rounded-lg p-2 ${
                                        selectedServices.some((s) => s.id === service.id)
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-sidebar hover:bg-sidebar-ring dark:hover:bg-sidebar-primary text-black hover:text-white dark:text-white dark:hover:text-black'
                                    }`}
                                    onClick={() => toogleBooth(service)}
                                >
                                    <span>{service.name}</span>
                                    <input
                                        type="checkbox"
                                        checked={selectedServices.some((s) => s.id === service.id)}
                                        onChange={() => toogleBooth(service)}
                                        className="form-checkbox h-4 w-4 text-blue-500"
                                    />
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">Nenhum serviço disponível.</p>
                        )}
                    </div>
                </div>

                <div className="mt-6 flex justify-between">
                    <button onClick={onClose} className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-white transition-all hover:bg-red-700">
                        Fechar
                    </button>
                    <button
                        className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-white transition-all hover:bg-blue-700"
                        onClick={handleSubmit}
                    >
                        Salvar
                    </button>
                </div>
            </div>
        </ModalTemplate>
    );
};

export const ServiceModal = ({ service, onClose, type }: ServiceModelProps) => {
    const [serviceName, setServiceName] = useState<string>(service?.name || '');
    const [servicePrefix, setServicePrefix] = useState<string>(service?.prefix || '');
    const [servicePriority, setServicePriority] = useState<string>(service?.priority || 'low');

    const handleSubmit = () => {
        if (!serviceName) {
            toast.error('O nome do serviço é obrigatório.');
            return;
        }

        if (!servicePrefix) {
            toast.error('O prefixo do serviço é obrigatório.');
            return;
        }

        if (servicePrefix.length !== 3) {
            toast.error('O prefixo do serviço deve ter 3 caracteres.');
            return;
        }

        if (type === 'new') {
            const payload = {
                name: serviceName,
                prefix: servicePrefix,
                priority: servicePriority,
            };

            router.post(route('services.store'), payload, {
                onSuccess: () => {
                    toast.success('Serviço cadastrado com sucesso!');
                    onClose();
                },
                onError: () => {
                    toast.error('Erro ao cadastrar serviço.');
                },
            });
        }

        if (type === 'edit') {
            const payload = {
                id: service?.id,
                name: serviceName,
                prefix: servicePrefix,
                priority: servicePriority,
            };

            router.put(route('services.update', payload.id), payload, {
                onSuccess: () => {
                    toast.success('Serviço atualizado com sucesso!');
                    onClose();
                },
                onError: () => {
                    toast.error('Erro ao atualizar serviço.');
                },
            });
        }
    };

    useEffect(() => {
        if (service && type === 'edit') {
            setServiceName(service.name);
            setServicePrefix(service.prefix);
            setServicePriority(service.priority);
        }

        if (type === 'new') {
            setServiceName('');
            setServicePrefix('');
            setServicePriority('low');
        }
    }, [service, type]);

    return (
        <ModalTemplate>
            <div className="bg-sidebar w-[600px] rounded-lg p-6 text-white shadow-lg">
                <h1 className="text-sidebar-primary text-2xl font-bold">{type === 'new' ? 'Adicionar Serviço' : 'Editar Serviço'}</h1>

                <div className="mt-4 flex items-center justify-between gap-2">
                    <div>
                        <label htmlFor="name" className="text-sidebar-primary">
                            Nome do Serviço
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="bg-accent text-sidebar-primary mt-1 w-full rounded-lg p-2"
                            placeholder="Nome do Serviço"
                            value={serviceName}
                            onChange={(e) => setServiceName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="prefix" className="text-sidebar-primary">
                            Prefixo
                        </label>
                        <input
                            type="text"
                            id="prefix"
                            className="bg-accent text-sidebar-primary mt-1 w-full rounded-lg p-2"
                            placeholder="Prefixo (3 letras)"
                            value={servicePrefix}
                            onChange={(e) => setServicePrefix(e.target.value)}
                            maxLength={3}
                        />
                    </div>
                </div>

                <div className="mt-4">
                    <label htmlFor="priority" className="text-sidebar-primary">
                        Prioridade
                    </label>
                    <select
                        id="priority"
                        className="bg-accent text-sidebar-primary mt-1 w-full rounded-lg p-2"
                        value={servicePriority}
                        onChange={(e) => setServicePriority(e.target.value)}
                    >
                        <option value="low">Baixa</option>
                        <option value="medium">Média</option>
                        <option value="high">Alta</option>
                    </select>
                </div>

                <div className="mt-6 flex justify-between">
                    <button onClick={onClose} className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-white transition-all hover:bg-red-700">
                        Fechar
                    </button>
                    <button
                        className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-white transition-all hover:bg-blue-700"
                        onClick={handleSubmit}
                    >
                        Salvar
                    </button>
                </div>
            </div>
        </ModalTemplate>
    );
};

export const BoothModal = ({ booth, onClose, type, services, users }: BoothModalProps) => {
    const [selectedServices, setSelectedServices] = useState<Service[]>(booth?.services || []);
    const [selectedUser, setSelectedUser] = useState<User | undefined>(users.find((user) => user.id === booth?.user_id));
    const [boothName, setBoothName] = useState<string>(booth?.name || '');
    const [boothNumber, setBoothNumber] = useState<number | string>(booth?.number || '');

    const handleSubmit = () => {
        if (!boothName) {
            toast.error('O nome do guichê é obrigatório.');
            return;
        }

        if (!boothNumber) {
            toast.error('O número do guichê é obrigatório.');
            return;
        }

        if (!selectedUser) {
            toast.error('Selecione um usuário para o guichê.');
            return;
        }

        if (selectedServices.length === 0) {
            toast.error('Selecione pelo menos um serviço.');
            return;
        }

        if (type === 'new') {
            const payload = {
                name: boothName,
                number: boothNumber,
                services: selectedServices.map((service) => service.id),
                user_id: selectedUser?.id ? selectedUser.id : null,
            };

            router.post(route('booths.store'), payload, {
                onSuccess: () => {
                    toast.success('Guichê cadastrado com sucesso!');
                    onClose();
                },
                onError: () => {
                    toast.error('Erro ao cadastrar guichê.');
                },
            });
        }

        if (type === 'edit') {
            const payload = {
                id: booth?.id,
                name: boothName,
                number: boothNumber,
                services: selectedServices.map((service) => service.id),
                user_id: selectedUser?.id ? selectedUser.id : null,
            };

            router.put(route('booths.update', payload.id), payload, {
                onSuccess: () => {
                    toast.success('Guichê atualizado com sucesso!');
                    onClose();
                },
                onError: () => {
                    toast.error('Erro ao atualizar guichê.');
                },
            });
        }
    };

    const toogleBooth = (service: Service) => {
        if (selectedServices.some((s) => s.id === service.id)) {
            setSelectedServices(selectedServices.filter((s) => s.id !== service.id));
        } else {
            setSelectedServices([...selectedServices, service]);
        }
    };

    const handleUserSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedUserId = parseInt(event.target.value, 10);
        const user = users.find((u) => u.id === selectedUserId);
        setSelectedUser(user);
    };

    useEffect(() => {
        if (booth && type === 'edit') {
            setBoothName(booth.name);
            setBoothNumber(booth.number);
            setSelectedServices(booth.services);
            const user = users.find((user) => user.id === booth.user_id);
            setSelectedUser(user || undefined);
        }

        if (type === 'new') {
            setBoothName('');
            setBoothNumber('');
            setSelectedServices([]);
            setSelectedUser(undefined);
        }
    }, [booth, type, users]);

    return (
        <ModalTemplate>
            <div className="bg-sidebar w-[600px] rounded-lg p-6 text-white shadow-lg">
                <h1 className="text-sidebar-primary text-2xl font-bold">{type === 'new' ? 'Adicionar Guichê' : 'Editar Guichê'}</h1>

                <div className="mt-4 flex items-center justify-between gap-2">
                    <div>
                        <label htmlFor="name" className="text-sidebar-primary">
                            Nome do Guichê
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="bg-accent text-sidebar-primary mt-1 w-full rounded-lg p-2"
                            placeholder="Nome do Serviço"
                            value={boothName}
                            onChange={(e) => setBoothName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="number" className="text-sidebar-primary">
                            Número do Guichê
                        </label>
                        <input
                            type="number"
                            id="number"
                            className="bg-accent text-sidebar-primary mt-1 w-full rounded-lg p-2"
                            placeholder="Número do Guichê"
                            value={boothNumber}
                            onChange={(e) => setBoothNumber(Number(e.target.value))}
                        />
                    </div>
                </div>

                <div className="mt-4 flex flex-col gap-2">
                    <label htmlFor="user" className="text-sidebar-primary">
                        Usuário
                    </label>
                    <select
                        className="bg-sidebar-accent text-sidebar-primary w-full rounded-lg p-4 shadow-lg"
                        onChange={handleUserSelection}
                        value={selectedUser?.id || ''}
                    >
                        <option value="" className="text-sidebar-primary">
                            Selecione um usuário
                        </option>
                        {users?.length ? (
                            users.map((user) => (
                                <option key={user.id} value={user.id} className="text-sidebar-primary">
                                    {user.name}
                                </option>
                            ))
                        ) : (
                            <option className="text-gray-500">Nenhum usuário disponível.</option>
                        )}
                    </select>
                </div>

                <div className="bg-sidebar-accent mt-4 rounded-lg p-4 shadow-lg">
                    <h2 className="text-sidebar-primary text-lg font-semibold">Serviços Disponíveis</h2>
                    <div className="mt-2 grid max-h-[200px] grid-cols-2 gap-2 overflow-auto">
                        {services.length ? (
                            services.map((service) => (
                                <div
                                    key={service.id}
                                    className={`flex cursor-pointer items-center justify-between rounded-lg p-2 ${
                                        selectedServices.some((s) => s.id === service.id)
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-sidebar hover:bg-sidebar-ring dark:hover:bg-sidebar-primary text-black hover:text-white dark:text-white dark:hover:text-black'
                                    }`}
                                    onClick={() => toogleBooth(service)}
                                >
                                    <span>{service.name}</span>
                                    <input
                                        type="checkbox"
                                        checked={selectedServices.some((s) => s.id === service.id)}
                                        onChange={() => toogleBooth(service)}
                                        className="form-checkbox h-4 w-4 text-blue-500"
                                    />
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">Nenhum serviço disponível.</p>
                        )}
                    </div>
                </div>

                <div className="mt-6 flex justify-between">
                    <button onClick={onClose} className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-white transition-all hover:bg-red-700">
                        Fechar
                    </button>
                    <button
                        className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-white transition-all hover:bg-blue-700"
                        onClick={handleSubmit}
                    >
                        Salvar
                    </button>
                </div>
            </div>
        </ModalTemplate>
    );
};

export const StartAttendanceModal = ({ ticket, onClose, booth_id, user_id }: StartServiceModalProps) => {
    const [selectedService, setSelectedService] = useState<Service | undefined>(undefined);

    const handleServiceSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedServiceId = parseInt(event.target.value, 10);
        const service = ticket?.services?.find((s) => s.id === selectedServiceId);
        setSelectedService(service);
    };

    const handleStartService = () => {
        if (!ticket) {
            toast.error('Ticket não encontrado.');
            return;
        }

        if (selectedService === undefined) {
            toast.error('Selecione pelo menos um serviço.');
            return;
        }

        const payload = {
            ticket_id: ticket.id,
            service_id: selectedService.id,
            booth_id: booth_id,
            user_id: user_id,
            start_time: new Date().toISOString().slice(0, 19).replace('T', ' '),
        };

        router.post(route('attendances.store'), payload, {
            onSuccess: () => {
                toast.success('Atendimento iniciado com sucesso!');
                onClose();
            },
            onError: () => {
                toast.error('Erro ao iniciar atendimento.');
            },
        });
    };

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50">
            <div className="bg-sidebar w-[600px] rounded-lg p-6 text-white shadow-lg">
                <h1 className="text-sidebar-primary text-2xl font-bold">Iniciar Atendimento</h1>

                <div className="mt-4">
                    <p className="text-sidebar-primary">
                        Ticket: <span className="font-semibold">{ticket?.code}</span>
                    </p>
                </div>

                <select className="bg-sidebar-accent text-sidebar-primary mt-4 w-full rounded-lg p-4 shadow-lg" onChange={handleServiceSelection}>
                    <option value="">Selecione um serviço</option>
                    {ticket?.services?.length ? (
                        ticket?.services.map((service) => (
                            <option key={service.id} value={service.id}>
                                {service.name}
                            </option>
                        ))
                    ) : (
                        <option className="text-gray-500">Nenhum serviço disponível.</option>
                    )}
                </select>

                <div className="mt-6 flex justify-between">
                    <button onClick={onClose} className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-white transition-all hover:bg-red-700">
                        Fechar
                    </button>
                    <button
                        className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-white transition-all hover:bg-blue-700"
                        onClick={handleStartService}
                    >
                        Iniciar Atendimento
                    </button>
                </div>
            </div>
        </div>
    );
};

interface ForwardAttendanceModalProps {
    ticket: Ticket | undefined;
    services: Service[];
    onClose: () => void;
    booth_id: number | null;
    user_id: number;
}

export const ForwardAttendanceModal = ({ ticket, services, onClose, booth_id, user_id }: ForwardAttendanceModalProps) => {
    const [selectedServices, setSelectedServices] = useState<Service[]>(ticket?.services || []);

    const handleServiceSelection = (service: Service) => {
        if (selectedServices.some((s) => s.id === service.id)) {
            setSelectedServices(selectedServices.filter((s) => s.id !== service.id));
        } else {
            setSelectedServices([...selectedServices, service]);
        }
    };

    const handleForwardService = () => {
        if (!ticket) {
            toast.error('Ticket não encontrado.');
            return;
        }

        if (selectedServices.length === 0) {
            toast.error('Selecione pelo menos um serviço.');
            return;
        }

        const payload = {
            ticket_id: ticket.id,
            services: selectedServices.map((service) => service.id),
            booth_id: booth_id,
            user_id: user_id,
            start_time: new Date().toISOString().slice(0, 19).replace('T', ' '),
        };

        router.post(route('forward'), payload, {
            onSuccess: () => {
                toast.success('Atendimento encaminhado com sucesso!');
                onClose();
            },
            onError: () => {
                toast.error('Erro ao encaminhar atendimento.');
            },
        });
    };

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50">
            <div className="bg-sidebar w-[600px] rounded-lg p-6 text-white shadow-lg">
                <h1 className="text-sidebar-primary text-2xl font-bold">Encaminhar Atendimento</h1>

                <div className="mt-4">
                    <p className="text-sidebar-primary">
                        Ticket: <span className="font-semibold">{ticket?.code}</span>
                    </p>
                </div>

                <div className="bg-sidebar-accent mt-4 rounded-lg p-4 shadow-lg">
                    <h2 className="text-sidebar-primary text-lg font-semibold">Serviços Disponíveis</h2>
                    <div className="mt-2 grid max-h-[200px] grid-cols-2 gap-2 overflow-auto">
                        {services.length ? (
                            services.map((service) => (
                                <div
                                    key={service.id}
                                    className={`flex cursor-pointer items-center justify-between rounded-lg p-2 ${
                                        selectedServices.some((s) => s.id === service.id)
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-sidebar hover:bg-sidebar-ring dark:hover:bg-sidebar-primary text-black hover:text-white dark:text-white dark:hover:text-black'
                                    }`}
                                    onClick={() => handleServiceSelection(service)}
                                >
                                    <span>{service.name}</span>
                                    <input
                                        type="checkbox"
                                        checked={selectedServices.some((s) => s.id === service.id)}
                                        onChange={() => handleServiceSelection(service)}
                                        className="form-checkbox h-4 w-4 text-blue-500"
                                    />
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">Nenhum serviço disponível.</p>
                        )}
                    </div>
                </div>

                <div className="mt-6 flex justify-between">
                    <button onClick={onClose} className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-white transition-all hover:bg-red-700">
                        Fechar
                    </button>
                    <button
                        className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-white transition-all hover:bg-blue-700"
                        onClick={handleForwardService}
                    >
                        Encaminhar Atendimento
                    </button>
                </div>
            </div>
        </div>
    );
};

export const FinishServiceModal = ({ ticket, services, onClose }: FinishServiceModalProps) => {
    const [selectedServices, setSelectedServices] = useState<Service[]>(ticket?.services || []);

    useEffect(() => {
        if (ticket) {
            setSelectedServices(ticket.services || []);
        }
    }, [ticket]);

    const handleServiceSelection = (service: Service) => {
        if (selectedServices.some((s) => s.id === service.id)) {
            setSelectedServices(selectedServices.filter((s) => s.id !== service.id));
        } else {
            setSelectedServices([...selectedServices, service]);
        }
    };

    const handleFinishService = () => {
        if (!ticket) {
            toast.error('Ticket não encontrado.');
            return;
        }

        if (selectedServices.length === 0) {
            toast.error('Selecione pelo menos um serviço.');
            return;
        }

        const payload = {
            ticket_id: ticket.id,
            services: selectedServices.map((service) => service.id),
        };

        router.put(route('tickets.update'), payload, {
            onSuccess: () => {
                toast.success('Atendimento finalizado com sucesso!');
                onClose();
            },
            onError: () => {
                toast.error('Erro ao finalizar atendimento.');
            },
        });
    };

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50">
            <div className="bg-sidebar w-[600px] rounded-lg p-6 text-white shadow-lg">
                <h1 className="text-sidebar-primary text-2xl font-bold">Finalizar Atendimento</h1>

                <div className="mt-4">
                    <p className="text-sidebar-primary">
                        Ticket: <span className="font-semibold">{ticket?.code}</span>
                    </p>
                </div>

                <div className="bg-sidebar-accent mt-4 rounded-lg p-4 shadow-lg">
                    <h2 className="text-sidebar-primary text-lg font-semibold">Serviços Disponíveis</h2>
                    <div className="mt-2 grid max-h-[200px] grid-cols-2 gap-2 overflow-auto">
                        {services.length ? (
                            services.map((service) => (
                                <div
                                    key={service.id}
                                    className={`flex cursor-pointer items-center justify-between rounded-lg p-2 ${
                                        selectedServices.some((s) => s.id === service.id)
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-sidebar hover:bg-sidebar-ring dark:hover:bg-sidebar-primary text-black hover:text-white dark:text-white dark:hover:text-black'
                                    }`}
                                    onClick={() => handleServiceSelection(service)}
                                >
                                    <span>{service.name}</span>
                                    <input
                                        type="checkbox"
                                        checked={selectedServices.some((s) => s.id === service.id)}
                                        onChange={() => handleServiceSelection(service)}
                                        className="form-checkbox h-4 w-4 text-blue-500"
                                    />
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">Nenhum serviço disponível.</p>
                        )}
                    </div>
                </div>

                <div className="mt-6 flex justify-between">
                    <button onClick={onClose} className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-white transition-all hover:bg-red-700">
                        Fechar
                    </button>
                    <button
                        className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-white transition-all hover:bg-blue-700"
                        onClick={handleFinishService}
                    >
                        Finalizar Atendimento
                    </button>
                </div>
            </div>
        </div>
    );
};

export const DeleteModal = ({ id, onClose, type, name }: DeleteModalProps) => {
    return (
        <ModalTemplate>
            <div className="bg-sidebar w-[600px] rounded-lg p-6 text-white shadow-lg">
                <h1 className="text-sidebar-primary text-2xl font-bold">Deletar {name}</h1>
                <p className="text-sidebar-primary mt-4">Tem certeza que deseja deletar?</p>
                <div className="mt-6 flex justify-between">
                    <button onClick={onClose} className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-white transition-all hover:bg-blue-700">
                        Cancelar
                    </button>
                    <button
                        className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-white transition-all hover:bg-red-700"
                        onClick={() => {
                            router.delete(route(`${type}.destroy`, id), {
                                onSuccess: () => {
                                    toast.success(`${name} deletado com sucesso!`);
                                    onClose();
                                },
                                onError: () => {
                                    toast.error(`Erro ao deletar ${name}.`);
                                },
                            });
                        }}
                    >
                        Deletar
                    </button>
                </div>
            </div>
        </ModalTemplate>
    );
};

export const CallAgainModal = ({ ticket, onClose }: CallAgainModalProps) => {
    const handleCallAgain = () => {
        onClose();
    };

    return (
        <div className="bg-opacity-50 fixed inset-0 flex items-center justify-center bg-black">
            <div className="rounded-lg bg-white p-6 shadow-lg">
                <h2 className="text-xl font-bold">Chamar Novamente</h2>
                <p className="mt-2">Você está prestes a chamar novamente o ticket {ticket?.code}.</p>
                <div className="mt-4 flex justify-end gap-2">
                    <button onClick={onClose} className="rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-gray-600">
                        Cancelar
                    </button>
                    <button onClick={handleCallAgain} className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                        Chamar
                    </button>
                </div>
            </div>
        </div>
    );
};

export const UserModal = ({ user, onClose, type }: UserModalProps) => {
    const [name, setName] = useState<string>(user?.name || '');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [email, setEmail] = useState<string>(user?.email || '');
    const [userType, setUserType] = useState<'attendant' | 'totem' | 'admin'>('attendant');

    const validateForm = () => {
        if (!name) {
            toast.error('O nome é obrigatório.');
            return;
        }

        if (!email) {
            toast.error('O e-mail é obrigatório.');
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            toast.error('E-mail inválido.');
            return;
        }

        if (!password) {
            toast.error('A senha é obrigatória.');
            return;
        }

        if (password.length < 8) {
            toast.error('A senha deve ter no mínimo 9 caracteres.');
            return;
        }

        if (!confirmPassword) {
            toast.error('Confirme a senha.');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('As senhas não coincidem.');
            return;
        }

        return name && email && password && confirmPassword && password === confirmPassword ? true : false;
    };

    const handleSubmit = () => {
        if (!validateForm()) {
            return;
        }

        const payload = {
            name,
            email,
            password,
            password_confirmation: confirmPassword,
            type: userType,
        };

        if (type === 'new') {
            router.post(route('users.store'), payload, {
                onSuccess: () => {
                    toast.success('Usuário cadastrado com sucesso!');
                    onClose();
                },
                onError: () => {
                    toast.error('Erro ao cadastrar usuário.');
                },
            });
        }

        if (type === 'edit' && user?.id) {
            router.put(route('users.update', user.id), payload, {
                onSuccess: () => {
                    toast.success('Usuário atualizado com sucesso!');
                    onClose();
                },
                onError: () => {
                    toast.error('Erro ao atualizar usuário.');
                },
            });
        }
    };

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50">
            <div className="bg-sidebar w-[600px] rounded-lg p-6 text-white shadow-lg">
                <h1 className="text-sidebar-primary text-2xl font-bold">{type === 'new' ? 'Adicionar Usuário' : 'Editar Usuário'}</h1>

                <div className="mt-4">
                    <label htmlFor="name" className="text-sidebar-primary">
                        Nome
                    </label>
                    <input
                        type="text"
                        id="name"
                        className="bg-accent text-sidebar-primary mt-1 w-full rounded-lg p-2"
                        placeholder="Nome do usuário"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="mt-4">
                    <label htmlFor="email" className="text-sidebar-primary">
                        E-mail
                    </label>
                    <input
                        type="email"
                        id="email"
                        className="bg-accent text-sidebar-primary mt-1 w-full rounded-lg p-2"
                        placeholder="E-mail do usuário"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="mt-4">
                    <label htmlFor="password" className="text-sidebar-primary">
                        Senha
                    </label>
                    <input
                        type="password"
                        id="password"
                        className="bg-accent text-sidebar-primary mt-1 w-full rounded-lg p-2"
                        placeholder="Senha do usuário"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="mt-4">
                    <label htmlFor="confirmPassword" className="text-sidebar-primary">
                        Confirmar Senha
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        className="bg-accent text-sidebar-primary mt-1 w-full rounded-lg p-2"
                        placeholder="Confirme a senha"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                <div className="mt-4">
                    <label htmlFor="type" className="text-sidebar-primary">
                        Tipo de Usuário
                    </label>
                    <select
                        id="type"
                        className="bg-accent text-sidebar-primary mt-1 w-full rounded-lg p-2"
                        value={userType}
                        onChange={(e) => setUserType(e.target.value as 'attendant' | 'totem' | 'admin')}
                    >
                        <option value="attendant">Atendente</option>
                        <option value="totem">Totem</option>
                        <option value="admin">Administrador</option>
                    </select>
                </div>

                <div className="mt-6 flex justify-between">
                    <button onClick={onClose} className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-white transition-all hover:bg-red-700">
                        Fechar
                    </button>
                    <button
                        className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-white transition-all hover:bg-blue-700"
                        onClick={handleSubmit}
                    >
                        Salvar
                    </button>
                </div>
            </div>
        </div>
    );
};

interface MonitorModalProps {
    monitor: { id?: number; name?: string; services?: Service[] } | undefined;
    services: Service[];
    onClose: () => void;
    type: 'new' | 'edit';
}

export const MonitorModal = ({ monitor, services, onClose, type }: MonitorModalProps) => {
    const [monitorName, setMonitorName] = useState<string>(monitor?.name || '');
    const [selectedServices, setSelectedServices] = useState<Service[]>(monitor?.services || []);

    const handleSubmit = () => {
        if (type === 'new') {
            const payload = {
                name: monitorName,
                services: selectedServices.map((service) => service.id),
            };

            router.post(route('monitors.store'), payload, {
                onSuccess: () => {
                    toast.success('Monitor cadastrado com sucesso!');
                    onClose();
                },
                onError: () => {
                    toast.error('Erro ao cadastrar monitor.');
                },
            });
        }

        if (type === 'edit' && monitor?.id) {
            const payload = {
                id: monitor.id,
                name: monitorName,
                services: selectedServices.map((service) => service.id),
            };

            router.put(route('monitors.update', payload.id), payload, {
                onSuccess: () => {
                    toast.success('Monitor atualizado com sucesso!');
                    onClose();
                },
                onError: () => {
                    toast.error('Erro ao atualizar monitor.');
                },
            });
        }
    };

    const toggleService = (service: Service) => {
        if (selectedServices.some((s) => s.id === service.id)) {
            setSelectedServices(selectedServices.filter((s) => s.id !== service.id));
        } else {
            setSelectedServices([...selectedServices, service]);
        }
    };

    useEffect(() => {
        if (monitor && type === 'edit') {
            setMonitorName(monitor.name || '');
            setSelectedServices(monitor.services || []);
        }

        if (type === 'new') {
            setMonitorName('');
            setSelectedServices([]);
        }
    }, [monitor, type]);

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50">
            <div className="bg-sidebar w-[600px] rounded-lg p-6 text-white shadow-lg">
                <h1 className="text-sidebar-primary text-2xl font-bold">{type === 'new' ? 'Adicionar Monitor' : 'Editar Monitor'}</h1>

                <div className="mt-4">
                    <label htmlFor="name" className="text-sidebar-primary">
                        Nome do Monitor
                    </label>
                    <input
                        type="text"
                        id="name"
                        className="bg-accent text-sidebar-primary mt-1 w-full rounded-lg p-2"
                        placeholder="Nome do Monitor"
                        value={monitorName}
                        onChange={(e) => setMonitorName(e.target.value)}
                    />
                </div>

                <div className="bg-sidebar-accent mt-4 rounded-lg p-4 shadow-lg">
                    <h2 className="text-sidebar-primary text-lg font-semibold">Serviços Disponíveis</h2>
                    <div className="mt-2 grid max-h-[200px] grid-cols-2 gap-2 overflow-auto">
                        {services.length ? (
                            services.map((service) => (
                                <div
                                    key={service.id}
                                    className={`flex cursor-pointer items-center justify-between rounded-lg p-2 ${
                                        selectedServices.some((s) => s.id === service.id)
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-sidebar hover:bg-sidebar-ring dark:hover:bg-sidebar-primary text-black hover:text-white dark:text-white dark:hover:text-black'
                                    }`}
                                    onClick={() => toggleService(service)}
                                >
                                    <span>{service.name}</span>
                                    <input
                                        type="checkbox"
                                        checked={selectedServices.some((s) => s.id === service.id)}
                                        onChange={() => toggleService(service)}
                                        className="form-checkbox h-4 w-4 text-blue-500"
                                    />
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">Nenhum serviço disponível.</p>
                        )}
                    </div>
                </div>

                <div className="mt-6 flex justify-between">
                    <button onClick={onClose} className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-white transition-all hover:bg-red-700">
                        Fechar
                    </button>
                    <button
                        className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-white transition-all hover:bg-blue-700"
                        onClick={handleSubmit}
                    >
                        Salvar
                    </button>
                </div>
            </div>
        </div>
    );
};
