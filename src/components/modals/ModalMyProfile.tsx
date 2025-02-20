import { UserOutlined } from "@ant-design/icons";
import Button from "../buttons/Button";
import Input from "../inputs/Input";
import { useEffect, useState } from "react";
import { getMyUser } from "../commands/LoadData";
import { useAuth } from "../auth/Auth";
import { putUser } from "../commands/InputData";

export default function ModalMyProfile({ onClose } : ModalProps) {
    return (
        <div className="cmp-modal-intern-myprofile" onClick={(e) => e.stopPropagation()}>
            <div className="cmp-modal-myprofile-main">
                <ModalMyProfileMain onClose={onClose} />
            </div>
        </div>
    )
}

export const ModalMyProfileMain = ({ onClose } : ModalProps) => {
    return (
        <div className="cmp-modal-myprofile">
            <ModalMyProfileHeader onClose={onClose} />
            <ModalMyProfileBody />
        </div>
    )
}

export const ModalMyProfileHeader = ({ onClose } : ModalProps) => {
    return (
        <div className="cmp-modal-myprofile-header">
            <div className="cmp-modal-icon-close-myprofile" onClick={onClose}>
                <span>&times;</span>
            </div>
            <div className="cmp-modal-icon-myprofile-header">
                <UserOutlined className="cmp-modal-icon-myprofile" />
            </div>
        </div>
    )
}

export const ModalMyProfileBody = () => {
    const { userId } = useAuth();
    const [contentMyUser, setMyUserData] = useState<IMyUser | null>(null);
    const [nome, setNome] = useState('');
    const [area, setArea] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [estado, setEstado] = useState('');
    const [cidade, setCidade] = useState('');
    const [error, setErrorMessage] = useState<string | null>(null);
    const [selectedStateUser, setSelectedStateUser] = useState<string>();

    useEffect(() => {
        if (estado) {
            setSelectedStateUser(estado);
        }
    }, [estado]);

    // Handle when estado changes, clear cidade
    const handleStateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setEstado(value);       // Update estado
        setCidade('');          // Reset cidade when estado changes
        console.log("Estado changed:", value);
    };

    const getMyUserContent = async () => {
        try {
            const dataMyUser = await getMyUser(userId);
            if(dataMyUser)
            {
                setMyUserData(dataMyUser);
                // Initialize state variables with fetched user data
                if (dataMyUser) {
                    setNome(dataMyUser.nome);
                    setArea(dataMyUser.area || ''); // Assuming area is optional
                    setEmail(dataMyUser.email);
                    setSenha(dataMyUser.senha); // You might want to keep password hidden
                    setEstado(dataMyUser.estado || '');
                    setCidade(dataMyUser.cidade || '');
                }
            }
        } catch (err) {
            console.error("Error fetching user data:", err);
        }
    };
    
    useEffect(() => {
        getMyUserContent();
    }, [userId]);

    const handleInputs = (e: React.FormEvent) => {
        e.preventDefault();
                
        if (!email || !senha || !nome || !area || !estado || !cidade) {            
            setErrorMessage('Todas as informações devem ser preenchidas');
            return; // Stop the form submission if validation fails
        }

        if(contentMyUser?.email == email &&
            contentMyUser.senha == senha &&
            contentMyUser.nome == nome &&
            contentMyUser.area == area &&
            contentMyUser.estado == estado &&
            contentMyUser.cidade)
        {
            setErrorMessage('Nenhuma informação foi alterada');
            return; // Stop the form submission if validation fails
        }

        if(userId)
        {
            const user : IUserPut = { id:userId, email, senha, nome, area, estado, cidade };
            putUser(user)
            window.location.reload(); // Faz o refresh da página
        }
    }

    return (
        <form className="cmp-modal-myprofile-body" onSubmit={handleInputs}>
            <Input type="nome" value={nome} onChange={(e) => setNome(e.target.value)} post={true} />
            <Input type="area_user" value={area} onChange={(e) => setArea(e.target.value)} post={true} />
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} post={true} />
            <Input type="senha" value={senha} onChange={(e) => setSenha(e.target.value)} post={true} />

            <Input 
                type="estado_user" 
                onChange={handleStateChange}  // Call handleStateChange onChange
                value={estado} 
            />

            <Input 
                type="cidade_user" 
                selectedState={selectedStateUser} 
                onChange={(e) => setCidade(e.target.value)} 
                value={cidade}  // Ensure controlled input
            />

            <Button 
                textLeft="alterar" 
                textRight="excluir" 
                typeLeft="save" 
                typeRight="delete" 
                location="free"
                modalLeft={{type: 'confirmation', messageType: 'save'}} 
                modalRight={{type: 'confirmation', messageType: 'delete_account'}}
            />
            {error && <p className="cmp-modal-login-body-error">{error}</p>}
        </form>
    );
}