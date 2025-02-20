interface IUsers{
    id: number,
    nome: string,
    email: string
}

interface IContentData{
    id: number,
    nome: string | null,
    criador: string,
    genero: string,
    tipo: string,
    info: string,
    estado: string | null,
    cidade: string | null
}

interface ITypeData {
    tipos: { id: number; value: string }[];
    generos: { id: number; value: string }[];
    areas: { id: number; value: string }[];
}

interface ILocationData {
    locais: { 
        id: number; 
        estado: string; 
        cidades: { id: number; value: string }[]; 
    }[];
}

interface ITeamRow {
    rowIndex: number;
    id: number;
    userName: string;
    email: string;
}

interface ISelectedItem{
    rowIndex: number,
    id: number,
    value: string
}

interface FileRow{ 
    id: number, 
    fileName: string, 
    isUrl: boolean, 
    url: string,
    file?: File
  }

interface IMyUser{
    id: number,
    nome: string,
    email: string,
    senha: string,
    area: string,
    estado: string,
    cidade: string,
    conteudos: IMyUserContent[]
}

interface IMyUserContent{
    id: number,
    nome: string,
    genero: string,
    tipo: string,
    info: string,
    sinopse: string,
    files: IFile[],
    equipe: ITeam[]
}

interface IMyUserFile{
    id: number,
    nome: string,
    email: string,
    senha: string,
    area: string,
    estado: string,
    cidade: string,
    conteudos: IMyUserContentFile[]
}

interface IMyUserContentFile{
    id: number,
    nome: string,
    genero: string,
    tipo: string,
    info: string,
    sinopse: string,
    urls: string[],
    equipe: ITeam[]
}

interface IFile{
    url: string,
    file: File
}

interface ITeam{
    id: number,
    nome: string,
    area: string,
    email: string
}

interface IContendInfoData{
    id: number,
    nome: string,
    genero: string,
    tipo: string,
    info: string,
    sinopse: string,
    urls: string[],
    equipe: ITeam[],
    estado: string,
    cidade: string,
    email: string
}

interface IUser{
    id: number,
    nome: string,
    email: string,
    area: string,
    estado: string,
    cidade: string,
    conteudos: IUserContent[]
}

interface IUserContent{
    id: number,
    nome: string,
    genero: string,
    tipo: string,
    info: string,
    sinopse: string,
    urls: string[],
    estado: string,
    cidade: string,
}
