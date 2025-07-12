import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Ticket, Totem } from '@/types';
import axios from 'axios';
import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';

export default function Index({ totem }: { totem: Totem }) {
    const [tickets, setTickets] = useState<{ [key: number]: Ticket | null }>({});
    const [currentTime, setCurrentTime] = useState<string>(new Date().toLocaleString());
    const [countdowns, setCountdowns] = useState<{ [key: number]: number | null }>({});
    const [isTicketGenerating, setIsTicketGenerating] = useState<boolean>(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date().toLocaleString());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const timers: NodeJS.Timeout[] = [];

        Object.keys(countdowns).forEach((serviceId) => {
            const id = Number(serviceId);
            if (countdowns[id] !== null && countdowns[id]! > 0) {
                const timer = setTimeout(() => {
                    setCountdowns((prev) => ({
                        ...prev,
                        [id]: prev[id]! - 1,
                    }));
                }, 1000);
                timers.push(timer);
            } else if (countdowns[id] === 0) {
                setTickets((prev) => ({
                    ...prev,
                    [id]: null,
                }));
                setCountdowns((prev) => ({
                    ...prev,
                    [id]: null,
                }));
            }
        });

        return () => timers.forEach((timer) => clearTimeout(timer));
    }, [countdowns]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date().toLocaleString());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const generateTicket = async (serviceId: number) => {
        if (isTicketGenerating) return;

        setIsTicketGenerating(true);
        const response = await axios.post(route('tickets.store'), {
            service_id: serviceId,
            priority: totem.services.find((service) => service.id === serviceId)?.priority,
        });

        setTickets((prevTickets) => ({
            ...prevTickets,
            [serviceId]: response.data,
        }));
        setCountdowns((prevCountdowns) => ({
            ...prevCountdowns,
            [serviceId]: 30,
        }));

        setIsTicketGenerating(false);
    };

    const printTicket = () => {
        window.print();
    };

    return (
        <div className="bg-sidebar-accent mx-auto my-auto flex min-h-screen items-center justify-center gap-6 pt-[3rem]">
            <nav className="bg-sidebar fixed start-0 top-0 z-20 w-full border-b">
                <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
                    <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <span className="text-sidebar-primary self-center text-2xl font-semibold whitespace-nowrap">Queue Management</span>
                    </a>
                    <div className="hidden w-full items-center justify-between md:order-1 md:flex md:w-auto">
                        <ul>
                            <li>
                                <span className="text-sidebar-primary block rounded px-3 py-2">{currentTime}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(700px,1fr))] place-items-center gap-6 p-4">
                {totem.services.map((service) => {
                    const ticket = tickets[service.id];

                    return (
                        <Card className="bg-sidebar mt-6 h-[400px] w-[700px] gap-1 rounded-2xl p-6 text-center shadow-xl" key={service.id}>
                            <div className={`flex h-[200px] ${!ticket ? 'flex-col' : 'flex-row justify-center gap-6'} w-full items-center`}>
                                <h1 className="text-sidebar-primary text-3xl">Serviço</h1>
                                <p className={`text-sidebar-primary text-5xl ${!ticket ? 'font-bold' : ''}`}>{service.name}</p>
                            </div>
                            <p className="text-sidebar-primary mt-2">{ticket ? 'Sua senha é:' : 'Clique no botão abaixo para gerar uma senha.'}</p>
                            {ticket && <div className="text-sidebar-primary text-5xl font-bold">{ticket.code}</div>}
                            <div className="mt-4 flex h-full w-full items-end justify-end">
                                {ticket ? (
                                    <div className="flex w-full flex-col items-center justify-between">
                                        <div className="flex w-full flex-col items-center justify-between">
                                            <div>
                                                <p className="mt-2 text-lg text-red-500">
                                                    Imprima ou Escaneie o QR-Code em até {countdowns[service.id]}s
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex w-full justify-between gap-4">
                                            <Button
                                                onClick={printTicket}
                                                className="flex w-[310px] cursor-pointer rounded-lg bg-blue-600 py-12 text-3xl font-semibold text-white shadow-md hover:bg-blue-700"
                                            >
                                                Imprimir
                                            </Button>
                                            <div className="flex h-full w-[310px] items-center justify-center rounded-lg bg-white shadow-md">
                                                <a href={String(ticket?.url)} target="_blank" rel="noreferrer">
                                                    <QRCode value={String(ticket?.url)} size={80} className="h-auto w-fit p-2" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <Button
                                        onClick={() => generateTicket(service.id)}
                                        className="flex flex-1 cursor-pointer rounded-lg bg-blue-600 py-12 text-3xl font-semibold text-white shadow-md hover:bg-blue-700"
                                    >
                                        Gerar Senha
                                    </Button>
                                )}
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
