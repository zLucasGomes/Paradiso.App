'use client'
import { useState } from "react";
import { useAuth } from "../auth/Auth";
import Button from "../buttons/Button";
import { deleteContent, deleteUser } from "../commands/InputData";
import TextH2 from "../texts/TextH2";

const messages: Record<MessageType, string> = {
    empty: "",
    save: "Deseja salvar as alterações?",
    delete_account: "Deseja excluir sua conta.\nEsta ação não pode ser desfeita.",
    delete_content: "Deseja excluir este conteúdo?\nEsta ação é irreversível.",
    logout: "Deseja sair da sua conta?",    
};

export default function ModalConfirmation({ onClose, messageType = 'empty', contentId }: ModalProps) {
    return (
        <div className="cmp-modal-intern-confirmation" onClick={(e) => e.stopPropagation()}>
            <div className="cmp-modal-confirmation-main">
                <ModalConfirmationMain onClose={onClose} messageType={messageType} contentId={contentId} />
            </div>
        </div>
    );
}

export const ModalConfirmationMain = ({ onClose, messageType = 'empty', contentId } : ModalProps) => {
    return (
        <div className="cmp-modal-confirmation">
            <ModalConfirmationHeader onClose={onClose} messageType={messageType} />
            <ModalConfirmationBody messageType={messageType} contentId={contentId} onClose={onClose} />
        </div>
    )
}

export const ModalConfirmationHeader = ({ onClose, messageType = 'empty' } : ModalProps) => {
    const messageLines = messages[messageType].split('\n'); // Divide o texto nas linhas

    return (
        <div className="cmp-modal-confirmation-header">
            <div className="cmp-modal-icon-close-confirmation" onClick={onClose}>
                <span>&times;</span>
            </div>
            <div className="cmp-modal-confirmation-header-message-box">
                <div className="cmp-modal-confirmation-header-message">
                    {messageLines.map((line, index) => (
                        <TextH2 key={index} text={line} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export const ModalConfirmationBody = ({messageType = 'empty', contentId, onClose } : ModalProps) => {
    const { setIsLogged, setUserId, userId } = useAuth();

    const handleLogout = () => {
        // Lógica para logout
        setIsLogged(false);
        setUserId(null);
        localStorage.removeItem('isLogged');
        localStorage.removeItem('userId'); 
        window.location.reload(); // Faz o refresh da página
    };

    const handleDeleteAccount = () => {
        deleteUser(userId)
        setIsLogged(false);
        setUserId(null);
        localStorage.removeItem('isLogged');
        localStorage.removeItem('userId'); 
        window.location.reload(); // Faz o refresh da página
    }

    const handleDeleteContent = async (id: number | undefined) => {
        if(id) await deleteContent(userId, id);
        if(onClose) onClose();
        window.location.reload(); // Faz o refresh da página
    }

    const renderMessage = () => {
        switch (messageType) {
            case 'logout':
                return (
                    <div className="cmp-modal-confirmation-body">
                        <Button type="logout" text="Confirmar" onClick={handleLogout} />
                    </div>
                );
            case 'delete_account':
                return (
                    <div className="cmp-modal-confirmation-body">
                        <Button type="delete" text="Confirmar" onClick={handleDeleteAccount} />
                    </div>
                );
            case 'save':
                return (
                    <div className="cmp-modal-confirmation-body">
                        <Button type="save" text="Confirmar" />
                    </div>
                );
            case 'delete_content':
                return (
                    <div className="cmp-modal-confirmation-body">
                        <Button type="delete" text="Confirmar" onClick={() => handleDeleteContent(contentId)} />
                    </div>
                );
            default:
                return (
                    <div className="cmp-modal-confirmation-body">
                        <Button type="save" text="Confirmar" />
                    </div>
                );
        }
    };

    return renderMessage(); // Renderiza a mensagem apropriada
}