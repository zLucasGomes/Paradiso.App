'use client'
import { useEffect, useState } from "react";
import axios from 'axios';
import Button from "../buttons/Button";
import Input from "../inputs/Input";
import TextH2 from "../texts/TextH2";
import { useAuth } from "../auth/Auth";
import path from "path";
import { getLogin } from "../commands/LoadData";
import { postUser } from "../commands/InputData";

export default function ModalLoginRegister({ onClose } : ModalProps) {
    return (
        <div className="cmp-modal-intern-loginregister" onClick={(e) => e.stopPropagation()}>
           <div className="cmp-modal-icon-close" onClick={onClose}>
                <span>&times;</span>
            </div>
            <div className="cmp-modal-loginregister">
                <ModalRegister />
                <ModalLoginRegisterLine />
                <ModalLogin />
            </div>
        </div>
    )
}

export const ModalRegister = () => {
    return (
        <div className="cmp-modal-register">
            <ModalRegisterHeader />
            <ModalRegisterBody />
        </div>
    )
}

export const ModalRegisterHeader = () => {
    return (
        <div className="cmp-modal-register-header">
            <TextH2 text="registrar" />
        </div>
    )
}

export const ModalRegisterBody = () => {
    const { setIsLogged, setUserId } = useAuth();
    const [error, setErrorMessage] = useState<string | null>(null);
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [nome, setNome] = useState('');
    const [area, setArea] = useState('');
    const [estado, setEstado] = useState('');
    const [cidade, setCidade] = useState('');

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

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        const data = await getLogin();
        const user = data.find(v => v.email.trim() === email.trim() && v.senha.trim() === senha.trim());

        if (user) {
            setIsLogged(true);
            setUserId(user.id); // Define the user ID
            window.location.reload(); // Refresh the page
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !senha || !nome || !area || !estado || !cidade) {
            setErrorMessage('Todos devem ser preenchidos');
            return; // Stop the form submission if validation fails
        }

        const data = await getLogin();
        const emailExists = data.some((user) => user.email.trim() === email.trim());

        if (emailExists) {
            setErrorMessage('Esse Email já está cadastrado');
            return; // Interrompe a submissão se o e-mail já existir
        }

        if(senha.trim().length < 8) {
            setErrorMessage('Senha com o minímo de 8 caracteres');
            return; // Interrompe a submissão se o e-mail já existir
        }

        setErrorMessage(''); // Clear error message if validation passes

        const user = { email: email.trim(), senha: senha.trim(), nome: nome.trim(), area: area.trim(), estado: estado.trim(), cidade: cidade.trim() };
        postUser(user);
        handleLogin(e);
    };

    return (
        <form className="cmp-modal-register-body" onSubmit={handleSubmit}>
            <Input type="email" onChange={(e) => setEmail(e.target.value)} value={email} post={true} />
            <Input type="senha" onChange={(e) => setSenha(e.target.value)} value={senha} post={true} />
            <Input type="nome" onChange={(e) => setNome(e.target.value)} value={nome} post={true} />
            <Input type="area_user" onChange={(e) => setArea(e.target.value)} value={area} post={true} />

            <Input 
                type="estado_register" 
                onChange={handleStateChange}  // Call handleStateChange onChange
                value={estado} 
                isDatalist={false}
            />

            <Input 
                type="cidade_register" 
                selectedState={selectedStateUser} 
                onChange={(e) => setCidade(e.target.value)} 
                value={cidade}  // Ensure controlled input
                isDatalist={false}
            />
                
            <Button text="cadastrar" type="register" />
            {error && <p className="cmp-modal-login-body-error">{error}</p>}
        </form>
    );
}

export const ModalLogin = () => {
    return (
        <div className="cmp-modal-login">
            <ModalLoginHeader />
            <ModalLoginBody />
        </div>
    )
}

export const ModalLoginHeader = () => {
    return (
        <div className="cmp-modal-login-header">
            <TextH2 text="entrar" />
        </div>
    )
}

export const ModalLoginBody = () => {
    const { setIsLogged, setUserId, setUserEmail } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            // const response = await axios.post('/api/auth', { username, password });
            // alert(response.data.message);

            const data = await getLogin();
            const user = data.find(v => v.email.toLowerCase() === email.toLowerCase() && 
                            v.senha.toLowerCase() === password.toLowerCase());

            if (user) {
                setIsLogged(true);
                setUserId(user.id); // Defina o ID do usuário
                setUserEmail(user.email)
                setError(null);
                window.location.reload(); // Faz o refresh da página
            } else {
                setError('Usuário ou senha inválido');
            }
        } catch (err) {
            setError('Usuário ou senha inválido');
        }
    };

    return (
        <form className="cmp-modal-login-body" onSubmit={handleLogin}>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input type="senha" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button text="acessar" type="login" />
            {error && <p className="cmp-modal-login-body-error">{error}</p>}
        </form>        
    )
}

export const ModalLoginRegisterLine = () => {
    return (
        <div className="cmp-modal-loginregister-line"></div>
    )
}
