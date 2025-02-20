import TextH1 from "../texts/TextH1";
import TextH3 from "../texts/TextH3";
import Input from "../inputs/Input";
import Button from "../buttons/Button";
import { useEffect, useState } from "react";
import { ClearOutlined } from "@ant-design/icons";

export default function HomeBoxMenu({ isLogged, internAction, query }: LoginProps & ModalProps & IQuery ) {
    return (
        <div className="cmp-home-box-menu">
            <div className="cmp-home-box-menu-intern">
                <HomeBoxMenuHeader />
                <HomeBoxMenuBody isLogged={isLogged} internAction={internAction} query={query} />
            </div>
        </div>
    );
}

export const HomeBoxMenuHeader = () => {
    return (
        <div className="cmp-home-box-menu-header">
            <TextH1 text="paradiso" hoverOptions={['#6714BA']} isRefreshLink={true} />
        </div>
    );
}

export const HomeBoxMenuBody = ({isLogged, internAction, query }: LoginProps & ModalProps & IQuery) => {
    const [selectedState, setSelectedState] = useState<string>();

    useEffect(() => {
        if (query?.estado) {
            setSelectedState(query.estado);
        }
    }, [query?.estado]);

    const handleStateChange = (event:any) => {
        const value = event.target.value;
        setSelectedState(value);
        if(internAction?.onInputChange)
        {
            internAction.onInputChange('estado', value); // Atualiza o estado "estado"
            internAction.onInputChange('cidade', ''); // Clear the "cidade" field
        }
    };

    const handleChange = (name:any) => (event:any) => {
        if(internAction?.onInputChange)
            internAction.onInputChange(name, event.target.value); // Atualiza o estado correspondente
    };

    const handleClear = () => {
        setSelectedState('');
        if (internAction?.onInputChange) {
            internAction.onInputChange('estado', ''); // Clear "estado"
            internAction.onInputChange('cidade', ''); // Clear "cidade"
            internAction.onInputChange('tipo', ''); // Clear "tipo"
            internAction.onInputChange('pesquisa', ''); // Clear "pesquisa"
            internAction.onInputChange('genero', ''); // Clear "genero"
            internAction.onInputChange('area', ''); // Clear "area"
        }
    };
    return (
        <>
            <div className="cmp-home-box-menu-body">
                <Input type="tipo" onChange={handleChange('tipo')} value={query?.tipo ?? ''} />
                <Input type="pesquisa" onChange={handleChange('pesquisa')} value={query?.pesquisa ?? ''} />
                <Input type="genero" onChange={handleChange('genero')} value={query?.genero ?? ''} />
                <Input type="estado" onChange={handleStateChange} value={query?.estado ?? ''} />
                <Input type="cidade" selectedState={selectedState} onChange={handleChange('cidade')} value={query?.cidade ?? ''} />
                <Input type="area" onChange={handleChange('area')} value={query?.area ?? ''} />
            </div>
            <div className="cmp-home-box-menu-footer">
            {isLogged ? (
                <div className="cmp-home-box-menu-footer-utils-logged">
                    <div className="cmp-home-box-menu-footer-utils">
                        <Button text="meu conteúdo" type="my-content" modal={{type: 'myContent'}}/>
                        <button className="btn-clear" onClick={handleClear}><ClearOutlined classID="btn-clea-icon" /></button>
                    </div>
                    <div className="cmp-home-box-menu-footer-utils-menu">
                        <TextH3 text="@todos os direitos reservados" />
                        <Button textLeft="perfil" 
                                textRight="sair" 
                                typeLeft="profile" 
                                typeRight="logout" 
                                location="bottom"
                                modalLeft={{type: 'myProfile'}}
                                modalRight={{type: 'confirmation', messageType: 'logout'}} />
                    </div>
                </div>
            ) : (
                <div className="cmp-home-box-menu-footer-utils-unlogged">
                    <div className="cmp-home-box-menu-footer-utils-btn-unlogged">
                        <button className="btn-clear-unlogged" onClick={handleClear}><ClearOutlined classID="btn-clea-icon-unlogged" /></button>
                    </div>
                    <div className="cmp-home-box-menu-footer-utils-menu-unlogged">
                        <TextH3 text="@todos os direitos reservados" />
                        <Button text="entrar" type="login-modal" location="bottom" modal={{type: 'loginRegister'}} />
                    </div>
                </div>
            )}
        </div>
        </>
    );
}