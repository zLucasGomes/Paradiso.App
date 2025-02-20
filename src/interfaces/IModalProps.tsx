interface ModalProps {
    onClose?: () => void;
    openModal?: (type: ModalProps["type"], contentType?: ModalProps["contentType"]) => void;
    type?: 'loginRegister' | 'myProfile' | 'profile' | 'myContent' | 'content' | 'confirmation';
    messageType?: MessageType
    contentType?: 'Filme' | 'Trilha' | 'Roteiro' | 'Foto';
    contentId?: number;
    contentInfo?: IContendInfoData;
    internAction?: InternAction;

}

interface InternAction {
    onInputChange?: (name: any, value: any) => void;
    onInternInputChange?: (name: any, value: any) => void;
    closeAll?: (value: boolean) => void;
    close?: boolean;
}

type MessageType = 'empty' | 'save' | 'delete_account' | 'delete_content' | 'logout';

interface TypeMyContent {
    isNew: boolean
}
