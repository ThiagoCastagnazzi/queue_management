import { Link } from '@inertiajs/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface PaginationProps {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    url: string;
}

const Pagination = ({ current_page, last_page, per_page, total, url }: PaginationProps) => {
    const from = (current_page - 1) * per_page + 1;
    const to = Math.min(current_page * per_page, total);

    return (
        <div className="flex items-center justify-end gap-4">
            <div>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                    {from}-{to} de {total} resultados
                </span>
            </div>

            <div className="flex gap-2">
                <Link
                    href={`${url}?page=${current_page - 1}`}
                    as="button"
                    disabled={current_page === 1}
                    className={`rounded-full p-2 ${
                        current_page === 1 ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-200 dark:hover:bg-gray-800'
                    }`}
                >
                    <ArrowLeft size={20} className={current_page === 1 ? 'text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-gray-200'} />
                </Link>

                <Link
                    href={`${url}?page=${current_page + 1}`}
                    as="button"
                    disabled={current_page === last_page}
                    className={`rounded-full p-2 ${
                        current_page === last_page ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-200 dark:hover:bg-gray-800'
                    }`}
                >
                    <ArrowRight
                        size={20}
                        className={current_page === last_page ? 'text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-gray-200'}
                    />
                </Link>
            </div>
        </div>
    );
};

export default Pagination;
