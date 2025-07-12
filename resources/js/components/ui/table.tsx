import { TableType, Ticket } from "@/types";
import { Link } from "@inertiajs/react";
import { ActionButtons, ManagerActionButtons } from "./modal-action-buttons";

interface TableProps<T> extends TableType<T> {
    handleOpen: (action: "edit" | "delete", row: T) => void;
    columnsName: string[];
    columns: string[];
    data: T[];
    type: string;
    isEditable: boolean;
    isDeletable: boolean;
}

export const Table = <T extends { id: number | string }>({
    columnsName,
    columns,
    data,
    type,
    handleOpen,
    isEditable,
    isDeletable,
}: TableProps<T>) => {
    return (
        <div className="flex h-full flex-1 flex-col gap-4 rounded-2xl overflow-hidden">
            {
                data.length > 0 ? (
                    <table className="w-full max-h-[500px] overflow-auto">
                <thead className="text-left text-sidebar-primary bg-sidebar-accent">
                    <tr>
                        {columnsName.map((columnName, index) => (
                            <th key={columns[index]} className="px-4 py-4 capitalize">
                                {columnName}
                            </th>
                        ))}
                        {(isEditable || isDeletable) ? <th className="px-4 py-4">Ações</th> : <th></th>}
                    </tr>
                </thead>
                <tbody className="text-sidebar-primary bg-sidebar">
                    {data.map((row) => (
                        <tr
                            key={row.id}
                            className={`border-b border-gray-700 transition-all hover:bg-accent`}
                        >
                            {columns.map((column) => (
                                <td key={column} className="px-4 py-2">
                                    {['totems', 'monitors'].includes(type) ? (
                                        <Link href={`/${type}/${row.id}`} as="a">
                                            {String(row[column as keyof T])}
                                        </Link>
                                    ) : (
                                        String(row[column as keyof T])
                                    )}
                                </td>
                            ))}
                            <ActionButtons
                                row={row}
                                handleOpen={handleOpen}
                                isEditable={isEditable}
                                isDeletable={isDeletable}
                            />
                        </tr>
                    ))}
                </tbody>
            </table>
                ) : (
                    <div className="flex items-center justify-center h-full text-sidebar-primary">
                        Nenhum registro encontrado
                    </div>
                )
            }
        </div>
    );
};

interface ManagerTableProps {
    columnsName: string[];
    columns: string[];
    data: Ticket[];
    handleOpen: (action: string, row: Ticket) => void;
}

export const ManagerTable = ({
    columnsName,
    columns,
    data,
    handleOpen,
}: ManagerTableProps) => {
    return (
        <div className="flex h-full flex-1 flex-col gap-4 rounded-2xl overflow-hidden">
            {
                data.length > 0 ? (
                    <table className="w-full max-h-[500px] overflow-auto">
                <thead className="text-left text-sidebar-primary bg-sidebar-accent">
                    <tr>
                        {columnsName.map((columnName, index) => (
                            <th key={columns[index]} className="px-4 py-4 capitalize">
                                {columnName}
                            </th>
                        ))}
                        <th className="px-4 py-4">Ações</th>
                    </tr>
                </thead>
                <tbody className="text-sidebar-primary bg-sidebar">
                    {data.map((row) => (
                        <tr
                            key={row.id}
                            className={`border-b border-gray-700 transition-all hover:bg-accent`}
                        >
                            {columns.map((column) => (
                                <td key={column} className="px-4 py-2">
                                    {String(row[column as keyof Ticket])}
                                </td>
                            ))}
                            <ManagerActionButtons
                                row={row}
                                handleOpen={handleOpen}
                            />
                        </tr>
                    ))}
                </tbody>
            </table>
                ) : (
                    <div className="flex items-center justify-center h-full text-sidebar-primary">
                        Fila de tickets vazia
                    </div>
                )
            }
        </div>
    );
};
