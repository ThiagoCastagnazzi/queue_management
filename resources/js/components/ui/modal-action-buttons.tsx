import { Ticket } from "@/types";
import { Pencil, Trash } from "lucide-react";

interface ActionProps<T> {
    row: T;
    handleOpen: (action: "edit" | "delete", row: T) => void;
    isEditable: boolean;
    isDeletable: boolean;
}

export const ActionButtons = <T,>({ row, handleOpen, isEditable, isDeletable }: ActionProps<T>) => (
    <td className="px-4 py-4 flex gap-4">
        {isEditable && (
            <button
                onClick={() => handleOpen("edit", row)}
                className="text-blue-500 hover:text-blue-700 cursor-pointer"
            >
                <Pencil size={18} />
            </button>
        )}
        {isDeletable && (
            <button
                onClick={() => handleOpen("delete", row)}
                className="text-red-500 hover:text-red-700 cursor-pointer"
            >
                <Trash size={18} />
            </button>
        )}
    </td>
);

interface ManagerActionButtonsProps {
    row: Ticket;
    handleOpen: (action: string, row: Ticket) => void;
}

const getActionsForTicket = (status: string) => {
    switch (status) {
        case 'pending':
            return ['Chamar', 'Excluir Senha'];
        case 'called':
            return ['Iniciar Atendimento', 'Chamar Novamente','Excluir Senha'];
        case 'attended':
            return ['Finalizar Atendimento', 'Encaminhar Atendimento'];
        case 'solved':
            return [];
        default:
            return [];
    }
};

export const ManagerActionButtons = ({ row, handleOpen }: ManagerActionButtonsProps) => {
    const actions = getActionsForTicket(row.status);

    return (
        <td className="px-4 py-2">
            <div className="flex gap-2">
                {actions.map((action) => (
                    <button
                        key={action}
                        onClick={() => handleOpen(action.toLowerCase(), row)}
                        className="rounded-lg bg-blue-600 px-3 py-1 text-white transition-all hover:bg-blue-700"
                    >
                        {action}
                    </button>
                ))}
            </div>
        </td>
    );
};
