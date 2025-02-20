type IconType = 'tipo' | 'pesquisa' | 'pesquisa_meu_conteudo' | 'genero' | 'estado' | 'cidade' | 'area'
                | 'email' | 'senha' | 'nome' | 'nome_conteudo' | 'estado_user' 
                | 'cidade_user' | 'estado_register' | 'cidade_register' | 'area_user' | 'sinopse' | 'users';

interface IconConfig {
    icon: JSX.Element;
    placeholder: string;
    inputType: string;
    listId?: string;  // O id do datalist se necessário
    options?: string[];  // As opções para o datalist, se houver
}

interface InputProps {
    type: IconType;
    value: string;
    selectedState?: string; 
    post?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any) => void;
    selectedItens?: ISelectedItem[]
    isDatalist?: boolean
    isNew?: boolean
}
