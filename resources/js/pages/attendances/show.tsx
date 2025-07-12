import AppLayout from '@/layouts/app-layout';
import { Attendance, BreadcrumbItem } from '@/types';
import { router } from '@inertiajs/react';
import { Check } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Show({ attendance }: { attendance: Attendance }) {
    const [notes, setNotes] = useState<string>('');

    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Atendimentos', href: '/attendance' }];

    const handleOpen = (action: string) => {
        if (action.toLowerCase() === 'finalizar atendimento') {
            const payload = {
                text: notes,
                status: 'finished',
                finish_time: new Date().toISOString().slice(0, 19).replace('T', ' '),
            };

            router.put(route('attendances.update', attendance.id), payload, {
                onSuccess: () => {
                    toast.success('Atendimento finalizado com sucesso!');
                },
                onError: () => {
                    toast.error('Erro ao finalizar atendimento!');
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="p-4">
                <div className="bg-sidebar relative flex h-[calc(100vh-7rem)] flex-col items-center justify-center rounded-2xl text-white">
                    <h1 className="text-sidebar-primary text-3xl font-bold">Senha: #{attendance?.ticket?.code}</h1>

                    <textarea
                        className="dark:bg-sidebar text-sidebar-primary border-sidebar-primary mt-4 h-32 w-[600px] rounded-xl border bg-gray-100 p-4"
                        placeholder="Notas de Atendimento"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />

                    <div className="absolute bottom-4 flex gap-4">
                        <div className="group relative flex flex-col items-center">
                            <span className="absolute -top-8 text-sm whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100">
                                Finalizar Atendimento
                            </span>
                            <button
                                className="cursor-pointer rounded-full bg-green-500 p-3 transition-all hover:bg-green-600"
                                onClick={() => handleOpen('finalizar atendimento')}
                            >
                                <Check />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
