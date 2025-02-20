import ModalConfirmation from "./ModalConfirmation";
import ModalContent from "./ModalContent";
import ModalLoginRegister from "./ModalLoginRegister";
import ModalMyContent from "./ModalMyContent";
import ModalMyProfile from "./ModalMyProfile";
import ModalProfile from "./ModalProfile";

export default function Modal({ onClose, type, contentType, messageType, contentId, internAction }: ModalProps) {
    const renderModal = () => {
        switch (type) {
            case 'loginRegister':
                return <ModalLoginRegister onClose={onClose} />;
            case 'myProfile':
                return <ModalMyProfile onClose={onClose} />;
            case 'profile':
                return <ModalProfile onClose={onClose} contentId={contentId} internAction={internAction} />;
            case 'myContent':
                return <ModalMyContent onClose={onClose} />;
            case 'content':
                return <ModalContent onClose={onClose} contentType={contentType} contentId={contentId} internAction={internAction} />; // Garantindo que `contentType` seja `null` se `undefined`
            case 'confirmation':
                return <ModalConfirmation onClose={onClose} messageType={messageType} contentId={contentId} />;
            default:
                return null;
        }
    };

    return (
        <div className="cmp-modal" onClick={onClose}>
            {renderModal()}
        </div>
    );
}
