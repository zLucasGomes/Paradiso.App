// Definição das interfaces
interface ButtonProps {
    text?: string; // Texto exibido no botão único
    type?: 'login' | 'login-modal' | 'my-content' | 'register' | 'save' | 'delete' | 'create' | 'logout'; // Tipo do botão único, que define o ícone
    location?: 'bottom' | 'free'; // Localização do botão único, que define o estilo
    color?: string;
    modal?: ModalProps;
    onClick?: () => void; // Função opcional para o clique
}

interface ButtonDoubleProps {
    textLeft?: string; // Texto do botão à esquerda
    textRight?: string; // Texto do botão à direita
    typeLeft?: 'profile' | 'logout' | 'save' | 'delete'; // Tipo do botão esquerdo
    typeRight?: 'profile' | 'logout' | 'save' | 'delete'; // Tipo do botão direito
    location: 'bottom' | 'free'; // Localização, por enquanto apenas 'bottom'
    modalLeft?: ModalProps;
    modalRight?: ModalProps;
    onClickLeft?: () => void; // Função opcional para o clique do botão à esquerda
    onClickRight?: () => void; // Função opcional para o clique do botão à direita
}

type CombinedButtonProps = ButtonProps | ButtonDoubleProps;