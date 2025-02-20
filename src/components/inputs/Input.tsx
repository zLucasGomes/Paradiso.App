"use client"
import React, { useEffect, useState } from 'react';
import { AppstoreOutlined, CoffeeOutlined, CompassOutlined, EnvironmentOutlined, EyeInvisibleOutlined, EyeOutlined, InboxOutlined, LockOutlined, MailOutlined, NotificationOutlined, SearchOutlined, SignatureOutlined, UserOutlined } from '@ant-design/icons';
import { getLocations, getTypes, getUsers } from '../commands/LoadData';
import { useAuth } from '../auth/Auth';

const iconConfigs: Record<IconType, IconConfig> = {    
    tipo: { icon: <AppstoreOutlined className='cmp-input-icon' />, placeholder: 'Escolha um tipo', inputType: 'search', listId: 'tipos', options: [] },
    pesquisa: { icon: <SearchOutlined className='cmp-input-icon' />, placeholder: 'Procure um conteúdo ou perfil', inputType: 'search' },
    pesquisa_meu_conteudo: { icon: <SearchOutlined className='cmp-input-icon' />, placeholder: 'Procure um conteúdo', inputType: 'search' },
    genero: { icon: <InboxOutlined className='cmp-input-icon' />, placeholder: 'Escolha um genêro', inputType: 'search', listId: 'generos', options: [] },    
    email: { icon: <MailOutlined className='cmp-input-icon' />, placeholder: 'Email', inputType: 'email' },
    senha: { icon: <LockOutlined className='cmp-input-pwd-icon' />, placeholder: 'Senha', inputType: 'password' },
    nome: { icon: <UserOutlined className='cmp-input-icon' />, placeholder: 'Nome', inputType: 'search' },
    nome_conteudo: { icon: <SignatureOutlined className='cmp-input-icon' />, placeholder: 'Nome', inputType: 'search' },
    sinopse: { icon: <NotificationOutlined className='cmp-input-textarea-icon' />, placeholder: 'Sinopse', inputType: 'textarea' },
    
    area: { icon: <CoffeeOutlined className='cmp-input-icon' />, placeholder: 'Escolha uma área', inputType: 'search', listId: 'areas', options: [] },
    area_user: { icon: <CoffeeOutlined className='cmp-input-icon' />, placeholder: 'Área', inputType: 'search', listId: 'areasUser', options: [] },

    estado: { icon: <CompassOutlined className='cmp-input-icon' />, placeholder: 'Escolha um estado', inputType: 'search', listId: 'estados', options: [] },
    cidade: { icon: <EnvironmentOutlined className='cmp-input-icon' />, placeholder: 'Escolha uma cidade', inputType: 'search', listId: 'cidades', options: [] },

    estado_register: { icon: <CompassOutlined className='cmp-input-icon' />, placeholder: 'Estado', inputType: 'search', listId: 'estadosRegister', options: [] },
    cidade_register: { icon: <EnvironmentOutlined className='cmp-input-icon' />, placeholder: 'Cidade', inputType: 'search', listId: 'cidadesRegister', options: [] },

    estado_user: { icon: <CompassOutlined className='cmp-input-icon' />, placeholder: 'Estado', inputType: 'search', listId: 'estadosUser', options: [] },
    cidade_user: { icon: <EnvironmentOutlined className='cmp-input-icon' />, placeholder: 'Cidade', inputType: 'search', listId: 'cidadesUser', options: [] },

    users: { icon: <UserOutlined className='cmp-input-icon' />, placeholder: 'Selecione um integrante', inputType: 'search', listId: 'usuarios', options: [] },
};

export default function Input({
  type,
  selectedState,
  value = '',
  post = false,
  onChange,
  selectedItens = [],
  isDatalist = true,
  isNew = true
}: InputProps) {
  const { userId } = useAuth();
  const { icon, placeholder, inputType, listId } = iconConfigs[type];
  const [contentTypeData, setTypeData] = useState<ITypeData | null>(null);
  const [users, setUsers] = useState<IUsers[]>([]); // All users
  const [contentLocationData, setLocationData] = useState<ILocationData | null>(null);
  const [datalistOptions, setDatalistOptions] = useState<{ id: number; value: string }[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch creators (users)
  const getCreators = async () => {
    try {
      const users = await getUsers();
      setUsers(users);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  // Fetch types data (areas, tipos, generos, etc.)
  const getDataTypes = async () => {
    try {
      const dataTypes = await getTypes();
      setTypeData(dataTypes);
    } catch (err) {
      console.error('Error fetching types:', err);
    }
  };

  // Fetch location data (states, cities, etc.)
  const getDataLocations = async () => {
    try {
      const dataLocations = await getLocations();
      setLocationData(dataLocations);
    } catch (err) {
      console.error('Error fetching locations:', err);
    }
  };

  // Fetch all necessary data when the component mounts
  useEffect(() => {
    getCreators();
    getDataTypes();
    getDataLocations().then(() => setLoading(false));
  }, []);

  // Update datalist options
  useEffect(() => {
    if (loading || !listId) return;

    let newOptions: { id: number; value: string }[] = [];

    switch (listId) {
      case 'estados':
      case 'estadosUser':
      case 'estadosRegister':
        newOptions = contentLocationData?.locais.map((v) => ({ id: v.id, value: v.estado })) || [];
        break;
      case 'cidades':
      case 'cidadesUser':
      case 'cidadesRegister':
        if (selectedState) {
          const cities =
            contentLocationData?.locais
              .find((location) => location.estado === selectedState)
              ?.cidades.map((city) => ({ id: city.id, value: city.value })) || [];
          newOptions = cities;
        }
        break;
      case 'usuarios':
        const filteredUsers = users.filter(
          (user) =>
            !selectedItens.some((item) => item.id === user.id) &&
            userId !== user.id
        );
        newOptions = filteredUsers.map((v) => ({
          id: v.id,
          value: `${v.nome} - ${v.email}`,
        }));
        break;
        case 'areas':
        case 'areasUser':
          // Areas (for content types like job areas, etc.)
          newOptions = contentTypeData?.areas.map((v) => ({ id: v.id, value: v.value })) || [];
          break;
  
        case 'tipos':
        case 'tiposUser':
          // Types (for specific user or content types)
          newOptions = contentTypeData?.tipos.map((v) => ({ id: v.id, value: v.value })) || [];
          break;
  
        case 'generos':
          // Genres
          newOptions = contentTypeData?.generos.map((v) => ({ id: v.id, value: v.value })) || [];
          break;      
        default:
          break;
    }

    if (JSON.stringify(newOptions) !== JSON.stringify(datalistOptions)) {
      setDatalistOptions(newOptions);
    }
  }, [listId, selectedState, loading, contentLocationData, contentTypeData, users, selectedItens]);

  const className =
    inputType === 'textarea'
      ? 'cmp-input-textarea'
      : inputType === 'password'
      ? 'cmp-input-pwd'
      : 'cmp-input';

  return (
    <div className={className}>
      {icon}
      {inputType === 'textarea' ? (
        <textarea
          placeholder={placeholder.toUpperCase()}
          className="cmp-textarea"
          value={value}
          onChange={(e) => onChange && onChange(e)}
        />
      ) : isDatalist ? (
        <>
          <input
            type={inputType}
            name={inputType}
            value={value}
            placeholder={placeholder.toUpperCase()}
            list={listId}
            onChange={(e) => onChange && onChange(e)}
          />
          {listId && (
            <datalist id={listId}>
              {datalistOptions.map((option) => (
                <option key={option.id} value={option.value} />
              ))}
            </datalist>
          )}
        </>
      ) : (
        <select className='cmp-input-select' value={value} onChange={(e) => onChange && onChange(e)} disabled={!isNew}>
          <option value="" disabled>
            {placeholder.toUpperCase()}
          </option>
          {datalistOptions.map((option) => (
            <option key={option.id} value={option.value}>
              {option.value}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
