interface IQuery {
    query?: IQueryMenu
}

interface IQueryMenu{
    tipo?: string | null,
    pesquisa?: string | null,
    genero?: string | null,
    estado?: string | null,
    cidade?: string | null,
    area?: string | null
}

interface IUserPost{
    email: string,
    senha: string,
    nome: string,
    area: string,
    estado: string,
    cidade: string
}

interface IUserPut{
    id: number
    email: string,
    senha: string,
    nome: string,
    area: string,
    estado: string,
    cidade: string
}

interface IUserData {
    id: number;
    nome: string;
    email: string;
    senha: string;
}

interface IMyContentPost{
    nome: string,
    genero: string,
    tipo: string,
    info: string,
    sinopse: string,
    urls: string[],
    equipe: ITeamPost[]
}

interface ITeamPost{
    id: number,
    nome: string,
    area: string,
    email: string
}