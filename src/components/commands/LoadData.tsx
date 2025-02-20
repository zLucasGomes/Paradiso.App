'use server'
import fs from 'fs';

// const response = await axios.post('/api/auth', { username, password });
// alert(response.data.message);

export const getLogin = async () => {
    const fileContents = await fs.promises.readFile('./public/_logins.json', 'utf-8');
    const data: IUserData[] = JSON.parse(fileContents);
    return data;
};

export const getContents = async (query?: IQueryMenu | null): Promise<IContentData[]> => {
    const fileContents = await fs.promises.readFile('./public/_contents.json', 'utf-8');
    let data: IContentData[] = JSON.parse(fileContents);

    if (query != null) {
        data = data.filter(item => {
            return (
                (!query.tipo || item.tipo?.toLowerCase().includes(query.tipo!.toLowerCase())) &&
                (!query.pesquisa || 
                    item.nome?.toLowerCase().includes(query.pesquisa!.toLowerCase()) || 
                    item.criador?.toLowerCase().includes(query.pesquisa!.toLowerCase())) &&
                (!query.genero || item.genero?.toLowerCase().includes(query.genero!.toLowerCase())) &&
                (!query.estado || item.estado?.toLowerCase().includes(query.estado!.toLowerCase())) &&
                (!query.cidade || item.cidade?.toLowerCase().includes(query.cidade!.toLowerCase())) &&
                (!query.area || item.genero?.toLowerCase().includes(query.area!.toLowerCase()))
            );
        });
    }
    
    return data;
};

export const getUsers = async (): Promise<IUsers[]> => {
    const fileContents = await fs.promises.readFile('./public/_users.json', 'utf-8');
    let data: IUsers[] = JSON.parse(fileContents);    
    return data;
};

export const getUserContents = async (id: number | undefined) => {
    const fileContents = await fs.promises.readFile('./public/_users_contents.json', 'utf-8');
    const data: IUser[] = JSON.parse(fileContents);
    return data.find(item =>  item.id == id);
};

export const getSelectedContents = async () => {
    const fileContents = await fs.promises.readFile('./public/_content_selected.json', 'utf-8');
    const data: IContendInfoData[] = JSON.parse(fileContents);
    return data;
};

export const getTypes = async () => {
    const fileContents = await fs.promises.readFile('./public/_types.json', 'utf-8');
    const data: ITypeData = JSON.parse(fileContents);
    return data;
};

export const getLocations = async () => {
    const fileContents = await fs.promises.readFile('./public/_locations.json', 'utf-8');
    const data: ILocationData = JSON.parse(fileContents);
    return data;
};

export const getMyUser = async (id: number | null) => {
    const fileContents = await fs.promises.readFile('./public/_my_user.json', 'utf-8');
    const data: IMyUser[] = JSON.parse(fileContents);
    return data.find(v => v.id == id);
};