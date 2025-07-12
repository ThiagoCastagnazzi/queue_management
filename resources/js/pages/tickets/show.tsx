import { Ticket } from '@/types';
import { useEffect, useRef, useState } from 'react';

export default function Show({ ticket }: { ticket: Ticket }) {
    const DELAY = 3000;
    const [updatedTicket, setUpdatedTicket] = useState<Ticket>(ticket);
    const [isBlinking, setIsBlinking] = useState<boolean>(false);
    const lastPlayedTime = useRef<number>(0);

    const statusTranslatedPT = [
        { status: 'pending', translated: 'Em Espera'},
        { status: 'called', translated: 'Chamando'},
        { status: 'attended', translated: 'Em Atendimento'},
        { status: 'cancelled', translated: 'Cancelado'},
        { status: 'solved', translated: 'Resolvido'},
    ];

    useEffect(() => {
        const playAudio = () => {
            const now = Date.now();
            if (now - lastPlayedTime.current >= DELAY) {
                const audio = new Audio('/assets/songs/notification.mp3');
                audio.play();
                lastPlayedTime.current = now;

                setIsBlinking(true);

                setTimeout(() => {
                    setIsBlinking(false);
                }, 2000);
            }
        };

        if (ticket) {
            window.Echo.channel(`Ticket.${ticket.uuid}`).listen('.Ticket', (event: { ticket: Ticket }) => {
                setUpdatedTicket(event.ticket);

                if (event.ticket) {
                    playAudio();
                }
            });
        }

        return () => {
            if (ticket) {
                window.Echo.leave(`Ticket.${ticket.uuid}`);
            }
        };
    }, [ticket, updatedTicket]);

    return (
        <div className="flex h-screen flex-1 flex-col gap-4 rounded-xl p-4 md:flex-row">
            <div
                className={`flex flex-1 flex-col items-center justify-center rounded-xl bg-blue-500 p-8 text-6xl font-bold text-white shadow-lg ${
                    isBlinking ? 'blink-effect bg-yellow-400 transition-all' : ''
                }`}
            >
                <span>{updatedTicket?.code}</span>
                <span className="mt-4 text-4xl">{statusTranslatedPT.find((status) => status.status === updatedTicket?.status)?.translated}</span>
                <span className="mt-4 text-4xl">
                    {updatedTicket?.booth?.name} {updatedTicket?.booth?.number}
                </span>
            </div>
        </div>
    );
}
