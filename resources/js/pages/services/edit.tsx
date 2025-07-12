import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Service } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Editar Serviço',
        href: '/services/edit',
    },
];

export default function Edit({ service }: { service: Service }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    {service.name}
                </div>
            </div>
        </AppLayout>
    );
}
