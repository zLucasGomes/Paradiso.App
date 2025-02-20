"use client"
import React, { useEffect, useState } from 'react';
import { LoginOutlined, FormOutlined, LogoutOutlined, UserOutlined, SignatureOutlined, CheckCircleOutlined, FireOutlined, CloseCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import Modal from '../modals/Modal';

// Componente Button
const Button: React.FC<CombinedButtonProps> = (props) => {    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const [isLeftModalOpen, setIsLeftModalOpen] = useState(false);
    const [isRightModalOpen, setIsRightModalOpen] = useState(false);
    const openLeftModal = () => setIsLeftModalOpen(true);
    const closeLeftModal = () => setIsLeftModalOpen(false);
    const openRightModal = () => setIsRightModalOpen(true);
    const closeRightModal = () => setIsRightModalOpen(false);

    const [contentId, setContentId] = useState<number | undefined>();

    useEffect(() => {
        // Only show the file section if `isNew` is true and `tipo` is selected
        if ('modal' in props) {
            const { modal } = props;
            setContentId(modal?.contentId); // Safe access using optional chaining
        }
      }, [props]); // Re-run this effect when `isNew` or `formValues.tipo` changes
      
    // Função para renderizar ícones com base no tipo
    const renderIcon = (type?: 'login' | 'login-modal' | 'my-content' | 'profile' | 'logout' 
        | 'register' | 'save' | 'delete' | 'create') => {
        switch (type) {
            case 'login':
            case 'login-modal':
                return <LoginOutlined className="cmp-btn-icon" />;
            case 'my-content':
                return <FormOutlined className="cmp-btn-icon" />;
            case 'profile':
                return <UserOutlined className="cmp-btn-icon" />;
            case 'logout':
                return <LogoutOutlined className="cmp-btn-icon" />;
            case 'register':
                return <SignatureOutlined className="cmp-btn-icon" />;
            case 'save':
                return <CheckCircleOutlined className="cmp-btn-icon" />;
            case 'delete':
                return <CloseCircleOutlined className="cmp-btn-icon" />;
            case 'create':
                return <PlusCircleOutlined className="cmp-btn-icon" />;
            default:
                return null;
        }
    };

    // Função para obter a classe com base na localização
    const getClassByLocation = (location: 'bottom' | 'free') => {
        return location === 'bottom' ? 'cmp-btn-bottom' : 'cmp-btn';
    };

    let { text, type, location, color, modal, onClick } = props as ButtonProps;
    const buttonType = type === 'login' || type === 'register' || type === 'save' ? 'submit' : 'button';

    // Verifica se as propriedades de botão duplo estão presentes
    if ('textLeft' in props && 'textRight' in props && 'typeLeft' in props && 'typeRight' in props) {
        const { textLeft, textRight, typeLeft, typeRight, location, onClickLeft, onClickRight } = props as ButtonDoubleProps;
        const className = getClassByLocation(location || 'free');
        return (
            <div className={className + "-double"}>
                <button type={buttonType} className={className + "-double-left"} onClick={onClickLeft || openLeftModal}>
                    {renderIcon(typeLeft)}
                    {textLeft?.toUpperCase()}
                </button>
                <button type={buttonType} className={className + "-double-right"} onClick={onClickRight || openRightModal}>
                    {renderIcon(typeRight)}
                    {textRight?.toUpperCase()}
                </button>
                {isLeftModalOpen && 
                    <Modal 
                        onClose={closeLeftModal} 
                        type={props.modalLeft?.type}
                        messageType={props.modalLeft?.messageType}
                        contentId={props.modalLeft?.contentId} />}
                {isRightModalOpen && 
                    <Modal 
                        onClose={closeRightModal} 
                        type={props.modalRight?.type} 
                        messageType={props.modalRight?.messageType} 
                        contentId={props.modalRight?.contentId}/>}
            </div>
        );
    } 

    let className = getClassByLocation(location || 'free');

     if(type == 'my-content')
        className = 'cmp-btn-my-content'

    return (
        <div className={className}>
            <button
                type={buttonType}
                className='custom-buttom'
                onClick={buttonType === 'button' ? (onClick || openModal) : undefined}
                style={{ 'backgroundColor': color }}
            >
                {renderIcon(type)}
                {text?.toUpperCase()}
            </button>
            {isModalOpen && 
                <Modal 
                    onClose={closeModal} 
                    type={modal?.type} 
                    messageType={modal?.messageType} 
                    contentId={contentId} />}
        </div>
    );
};

export default Button;