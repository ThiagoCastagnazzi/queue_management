import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Monitor, Ticket } from '@/types';
import { useEffect, useRef, useState } from 'react';

export default function Show({ monitor, tickets }: { monitor: Monitor; tickets: Ticket[] }) {
    const [currentTicket, setCurrentTicket] = useState<Ticket>();
    const [ticketsUpdated, setTicketsUpdated] = useState<Ticket[]>(tickets);
    const [delay] = useState<number>(3000);
    const [isBlinking, setIsBlinking] = useState<boolean>(false);
    const lastPlayedTime = useRef<number>(0);

    useEffect(() => {
        const lastTicket = ticketsUpdated[0];
        setCurrentTicket(lastTicket ?? '');
    }, [ticketsUpdated]);

    const playAudio = () => {
        const now = Date.now();
        if (now - lastPlayedTime.current >= delay) {
            const audio = new Audio('/assets/songs/notification.mp3');
            audio.play();
            lastPlayedTime.current = now;

            setIsBlinking(true);

            setTimeout(() => {
                setIsBlinking(false);
            }, 2000);
        }
    };

    useEffect(() => {
        if (monitor) {
            window.Echo.channel(`Monitor.${monitor.id}`).listen('.Monitor', (event: { ticket: Ticket; tickets: Ticket[] }) => {
                setTicketsUpdated(event.tickets);
                setCurrentTicket(event.ticket);

                if (event.ticket) {
                    playAudio();
                }
            });
        }

        return () => {
            if (monitor) {
                window.Echo.leave(`Monitor.${monitor.id}`);
            }
        };
    }, [monitor, ticketsUpdated]);

    return (
        <div className="flex h-screen flex-1 flex-col gap-4 rounded-xl p-4 md:flex-row">
            <div
                className={`flex flex-1 flex-col items-center justify-center rounded-xl bg-blue-500 p-8 text-6xl font-bold text-white shadow-lg ${
                    isBlinking ? 'blink-effect bg-yellow-400 transition-all' : ''
                }`}
            >
                <span>{currentTicket?.code}</span>
                <span className="mt-4 text-4xl">
                    {currentTicket?.booth?.name} {currentTicket?.booth?.number}
                </span>
            </div>

            <div className="border-sidebar-border/70 dark:border-sidebar-border w-1/3 overflow-hidden rounded-xl border p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Últimas Senhas Chamadas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 text-lg font-semibold">
                            {ticketsUpdated.map((ticket, index) => (
                                <li key={index} className="border-b pb-2">
                                    {ticket.code}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
