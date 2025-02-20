'use server'
import fs from 'fs';

export const postUser = async (user: IUserPost) => {
    let contents : IContentData[] = JSON.parse(await fs.promises.readFile('./public/_contents.json', 'utf-8'));
    let logins : IUserData[] = JSON.parse(await fs.promises.readFile('./public/_logins.json', 'utf-8'));
    let myUser : IMyUser[] = JSON.parse(await fs.promises.readFile('./public/_my_user.json', 'utf-8'));
    let userContents : IUser[] = JSON.parse(await fs.promises.readFile('./public/_users_contents.json', 'utf-8'));
    let users: IUsers[] = JSON.parse(await fs.promises.readFile('./public/_users.json', 'utf-8'));

    const id: number = Date.now();

    logins.push({
        id: id,
        email: user.email,
        senha: user.senha,
        nome: user.nome
    });

    users.push({
        id: id,
        email: user.email,
        nome: user.nome
    })

    userContents.push({
        id: id,
        nome: user.nome,
        email: user.email,
        area: user.area,
        estado: user.estado,
        cidade: user.cidade,
        conteudos: []
    });

    myUser.push({
        id: id,
        nome: user.nome,
        email: user.email,
        senha: user.senha,
        area: user.area,
        estado: user.estado,
        cidade: user.cidade,
        conteudos: []
    });

    contents.push({
        id: id,
        nome: null,
        criador: user.nome,
        genero: user.area,
        tipo: 'profile',
        info: '0',
        estado: user.estado,
        cidade: user.cidade
    })

    await fs.promises.writeFile('./public/_logins.json', JSON.stringify(logins, null, 2))  
    await fs.promises.writeFile('./public/_users_contents.json', JSON.stringify(userContents, null, 2))  
    await fs.promises.writeFile('./public/_my_user.json', JSON.stringify(myUser, null, 2))  
    await fs.promises.writeFile('./public/_contents.json', JSON.stringify(contents, null, 2))  
    await fs.promises.writeFile('./public/_users.json', JSON.stringify(users, null, 2))  
};

export const deleteUser = async (id: number | null) => {
    if(id === null) return;

    let contentSelected : IContendInfoData[] = JSON.parse(await fs.promises.readFile('./public/_content_selected.json', 'utf-8'));
    let contents : IContentData[] = JSON.parse(await fs.promises.readFile('./public/_contents.json', 'utf-8'));
    let logins : IUserData[] = JSON.parse(await fs.promises.readFile('./public/_logins.json', 'utf-8'));
    let myUser : IMyUser[] = JSON.parse(await fs.promises.readFile('./public/_my_user.json', 'utf-8'));
    let myUserFile: IMyUserFile[] = JSON.parse(await fs.promises.readFile('./public/_my_user.json', 'utf-8'));
    let userContents : IUser[] = JSON.parse(await fs.promises.readFile('./public/_users_contents.json', 'utf-8'));
    let users : IUsers[] = JSON.parse(await fs.promises.readFile('./public/_users.json', 'utf-8'));

    const myInfo : IMyUserFile | undefined = myUserFile.find(user => user.id === id);

    if (!myInfo)
        throw new Error("Usuário não encontrado!");

    const contentIds = myInfo.conteudos.map(v => v.id)
    const userIds = myInfo.conteudos.flatMap(v => v.equipe).map(v => v.id)

    contentSelected = contentSelected
    .filter(v => !contentIds.includes(v.id))
    .map(content => ({
        ...content,
        equipe: content.equipe.filter(member => member.id !== id) // Remove o usuário da equipe
    }));

    // Filtra `myUser` para excluir o usuário e remove o mesmo da equipe dos seus conteúdos
    myUser = myUser.map(user => ({
        ...user,
        conteudos: user.conteudos.map(content => ({
            ...content,
            equipe: content.equipe.filter(member => member.id !== id) // Remove o usuário da equipe
        }))
    })).filter(user => user.id !== id);

    contents = contents
        .filter(content => !(content.id === id && content.tipo === 'profile'))
        .filter(content => !(contentIds.includes(content.id) && content.tipo !== 'profile'));

    contents.forEach(v => {
        if(userIds.includes(v.id) && v.tipo === 'profile')
        {
            v.info = (Number.parseInt(v.info) - 1).toString()
        }
    })

    logins = logins.filter(user => user.id !== id);

    userContents = userContents.filter(user => user.id !== id);

    users = users.filter(v => v.id !== id)

    await fs.promises.writeFile('./public/_content_selected.json', JSON.stringify(contentSelected, null, 2)) 
    await fs.promises.writeFile('./public/_contents.json', JSON.stringify(contents, null, 2))  
    await fs.promises.writeFile('./public/_logins.json', JSON.stringify(logins, null, 2))  
    await fs.promises.writeFile('./public/_my_user.json', JSON.stringify(myUser, null, 2))  
    await fs.promises.writeFile('./public/_users_contents.json', JSON.stringify(userContents, null, 2)) 
    await fs.promises.writeFile('./public/_users.json', JSON.stringify(users, null, 2))  
};

export const putUser = async (user: IUserPut) => {
    // Read data from the JSON files
    let contentSelected : IContendInfoData[] = JSON.parse(await fs.promises.readFile('./public/_content_selected.json', 'utf-8'));
    let contents: IContentData[] = JSON.parse(await fs.promises.readFile('./public/_contents.json', 'utf-8'));
    let logins: IUserData[] = JSON.parse(await fs.promises.readFile('./public/_logins.json', 'utf-8'));
    let myUser: IMyUser[] = JSON.parse(await fs.promises.readFile('./public/_my_user.json', 'utf-8'));
    let myUserFile: IMyUserFile[] = JSON.parse(await fs.promises.readFile('./public/_my_user.json', 'utf-8'));
    let userContents: IUser[] = JSON.parse(await fs.promises.readFile('./public/_users_contents.json', 'utf-8'));
    let users : IUsers[] = JSON.parse(await fs.promises.readFile('./public/_users.json', 'utf-8'));

    const myInfo : IMyUserFile | undefined = myUserFile.find(v => v.id === user.id);

    if (!myInfo)
        throw new Error("Usuário não encontrado!");

    const contentIds = myInfo.conteudos.map(v => v.id)

    // Update user in the selected content file if applicable
    contentSelected.forEach(content => {
        if (content.email === user.email) {
           content.equipe.forEach(equipe => {
                if(equipe.id === user.id)
                {
                    equipe.nome = user.nome || myInfo.nome;
                    equipe.area = user.area || myInfo.area;
                }
           })
           content.email = user.email;
        }
    });

    // Optionally update contents (if necessary), for example:
    // Here we assume the contents array has a `userId` property and you want to update some of the content based on user updates
    contents.forEach(content => {
        if(content.tipo === 'profile')
        {
            content.criador = user.nome || myInfo.nome;
            content.genero = user.area || myInfo.area;
            content.estado = user.estado || myInfo.estado;
            content.cidade = user.cidade || myInfo.cidade;
        }
        else if(contentIds.includes(content.id))
        {
            content.criador = user.nome || myInfo.nome;
            content.estado = user.estado || myInfo.estado;
            content.cidade = user.cidade || myInfo.cidade;
        }
    })

    // Update the user in the logins array
    const loginIndex = logins.findIndex((login) => login.id === user.id);
    if (loginIndex !== -1) {
        logins[loginIndex] = {
            ...logins[loginIndex], // Retain the previous data
            nome: user.nome || logins[loginIndex].nome,
            email: user.email || logins[loginIndex].email,
            senha: user.senha || logins[loginIndex].senha,
        };
    }

    // Update the user in the myUser array
    myUser.forEach(obj => {
        if(obj.id === user.id)
        {
            obj.nome = user.nome || myInfo.nome;
            obj.email = user.email || myInfo.email;
            obj.senha = user.senha || myInfo.senha;
            obj.area =  user.area || myInfo.area;
            obj.estado = user.estado || myInfo.estado;
            obj.cidade = user.cidade || myInfo.cidade;
        }
        else
        {
            obj.conteudos.forEach(file => {
                file.equipe.forEach(equipe => {
                    if(equipe.id === user.id)
                    {
                        equipe.nome = user.nome || myInfo.nome;
                        equipe.area = user.area || myInfo.area;
                        equipe.email = user.email || myInfo.email;
                    }
                })
            })
        }
    })

    // Update the user in the userContents array
   userContents.forEach(userContent => {
        if(userContent.id === user.id)
        {
            userContent.nome = user.nome || myInfo.nome;
            userContent.email = user.email || myInfo.email;
            userContent.area =  user.area || myInfo.area;
            userContent.estado = user.estado || myInfo.estado;
            userContent.cidade = user.cidade || myInfo.cidade;

            userContent.conteudos.forEach(cont => {
                cont.estado = user.estado || myInfo.estado;
                cont.cidade = user.cidade || myInfo.cidade;
            })
        }
   })    

   users.forEach(v => {
        v.nome = user.nome || myInfo.nome;
        v.email = user.email || myInfo.email;
   })

    // Write the updated data back to the files
    await fs.promises.writeFile('./public/_content_selected.json', JSON.stringify(contentSelected, null, 2)); 
    await fs.promises.writeFile('./public/_contents.json', JSON.stringify(contents, null, 2));  
    await fs.promises.writeFile('./public/_logins.json', JSON.stringify(logins, null, 2));  
    await fs.promises.writeFile('./public/_my_user.json', JSON.stringify(myUserFile, null, 2));  
    await fs.promises.writeFile('./public/_users_contents.json', JSON.stringify(userContents, null, 2)); 
    await fs.promises.writeFile('./public/_users.json', JSON.stringify(users, null, 2));  
};

export const postContent = async (userId: number | null, formData: FormData, userData: IMyUserContent) => {
    // Lê os arquivos JSON necessários
    const [myUserData, contentSelectedData, contentsData, userContentsData] = await Promise.all([
        fs.promises.readFile('./public/_my_user.json', 'utf-8'),
        fs.promises.readFile('./public/_content_selected.json', 'utf-8'),
        fs.promises.readFile('./public/_contents.json', 'utf-8'),
        fs.promises.readFile('./public/_users_contents.json', 'utf-8')
    ]);

    try {
        const response = await fetch('http://localhost:5000/api/content', {
            method: 'POST',
            body: formData, // Send the FormData directly
        });

        const result = await response.json();
        console.log('Server response:', result);
    } catch (error) {
        console.error('Failed to post content:', error);
        return
    }

    // Parse dos dados lidos
    let myUser: IMyUserFile[] = JSON.parse(myUserData);
    let contentSelected: IContendInfoData[] = JSON.parse(contentSelectedData);
    let contents: IContentData[] = JSON.parse(contentsData);
    let userContents: IUser[] = JSON.parse(userContentsData);

    const id = Date.now()

    // Encontra o usuário baseado no 'userId'
    const myInfo = myUser.find(user => user.id === userId);

    if (!myInfo) {
        throw new Error("Usuário não encontrado!");
    }

    // Processa os arquivos de 'formData.files'
    const files = formData.getAll('files') as File[];  // Assumindo que 'files' é uma lista de arquivos
    const fileUrls: string[] = [];
    
    // Salva os arquivos e gera as URLs
    for (const file of files) {
        fileUrls.push(`/files/${file.name}`);
    }

    let info: string = '';
    
    switch(userData.tipo)
    {
        case 'Filme':
            try{
                // Envia o arquivo de vídeo para obter a duração
                const videoFile = files[0]; // Considera o primeiro arquivo como vídeo
                const videoDuration = await getVideoDuration(videoFile.name);
                info = `${videoDuration}`;
            } catch (error) {
                console.error('Failed to post content:', error);
            }
            break;

        case 'Roteiro':
            try{
                // Envia o arquivo de PDF para obter a quantidade de páginas
                const pdfFile = files[0]; // Considera o primeiro arquivo como PDF
                const pdfPageCount = await getPdfPageCount(pdfFile);
                info = `${pdfPageCount}pág`;
            } catch (error) {
                console.error('Failed to post content:', error);
            }
            break;

        case 'Foto':
        case 'Trilha':
            info = fileUrls.length + "un"
            break
    }

    // Cria a nova entrada de conteúdo com a equipe incluindo o usuário automaticamente
    const newContent = {
        id: id,
        nome: userData.nome,
        genero: userData.genero,
        tipo: userData.tipo,
        info: info,
        sinopse: userData.sinopse,
        urls: fileUrls,  // Assume que os arquivos são enviados
        equipe: [
            { // Adiciona o usuário à sua própria equipe com id, nome, area e email
                id: myInfo.id,
                nome: myInfo.nome,
                area: myInfo.area,
                email: myInfo.email
            },
            ...userData.equipe.map(teamMember => ({
                id: teamMember.id,
                nome: teamMember.nome,
                area: myUser.find(v => v.id === teamMember.id)?.area || '',
                email: teamMember.email
            }))
        ],
        estado: myInfo.estado, // Mantém o estado da informação do usuário
        cidade: myInfo.cidade, // Mantém a cidade da informação do usuário
        email: myInfo.email // Mantém o e-mail do usuário
    };

    // Adiciona o novo conteúdo ao '_content_selected.json'
    contentSelected.push(newContent);
    
    // Adiciona o novo conteúdo à lista 'conteudos' do usuário no '_my_user.json'
    const userIndex = myUser.findIndex(user => user.id === userId);
    
    if (userIndex !== -1) {
        myUser[userIndex].conteudos.push({
            id: id,
            nome: userData.nome,
            genero: userData.genero,
            tipo: userData.tipo,
            info: info,
            sinopse: userData.sinopse,
            urls: fileUrls, 
            equipe: [
                ...userData.equipe.map(teamMember => ({
                    id: teamMember.id,
                    nome: teamMember.nome,
                    area: myUser.find(v => v.id === teamMember.id)?.area || '',
                    email: teamMember.email
                }))
            ]
        });
    }

    const userIds = myUser[userIndex].conteudos.flatMap(v => v.equipe).map(v => v.id)

    // Adiciona o conteúdo na lista de 'conteudos' de cada usuário em '_users_contents.json'
    userContents.forEach(user => {
        if (user.id === userId) {
            user.conteudos.push({
                id: id,
                nome: userData.nome,
                genero: userData.genero,
                tipo: userData.tipo,
                info: info,
                sinopse: userData.sinopse,
                urls: userData.files.map(file => file.url),
                estado: myInfo.estado,
                cidade: myInfo.cidade
            });
        }
        else if(userIds.includes(user.id))
        {
            user.conteudos.push({
                id: id,
                nome: userData.nome,
                genero: userData.genero,
                tipo: userData.tipo,
                info: info,
                sinopse: userData.sinopse,
                urls: userData.files.map(file => file.url),
                estado: myInfo.estado,
                cidade: myInfo.cidade
            });
        }
    });

    // Adiciona o novo conteúdo ao '_contents.json'
    contents.push({
        id: id,
        nome: userData.nome,
        criador: myInfo.nome, // Usamos o nome do criador (usuário)
        genero: userData.genero,
        tipo: userData.tipo,
        info: info,
        estado: myInfo.estado,
        cidade: myInfo.cidade
    });

    contents.forEach(v => {
        if(userIds.includes(v.id))
        {
            v.info = (Number.parseInt(v.info) + 1).toString()
        }
    })

    const contentIndex = contents.findIndex((content) => content.id === userId && content.tipo === 'profile');
    
    if (contentIndex !== -1) {
        contents[contentIndex] = {
            ...contents[contentIndex], // Retain the previous data
            info: myInfo.conteudos.length.toString()
        };
    }

    // Atualiza os arquivos JSON com os novos dados
    await Promise.all([
        fs.promises.writeFile('./public/_content_selected.json', JSON.stringify(contentSelected, null, 2)),
        fs.promises.writeFile('./public/_contents.json', JSON.stringify(contents, null, 2)),
        fs.promises.writeFile('./public/_my_user.json', JSON.stringify(myUser, null, 2)),
        fs.promises.writeFile('./public/_users_contents.json', JSON.stringify(userContents, null, 2))
    ]);   
};
  
export const deleteContent = async (userId: number | null, idContent: number | null) => {
    // Lê os dados de uma vez
    const [contentSelectedData, contentsData, myUserData, usersContentsData] = await Promise.all([
        fs.promises.readFile('./public/_content_selected.json', 'utf-8'),
        fs.promises.readFile('./public/_contents.json', 'utf-8'),
        fs.promises.readFile('./public/_my_user.json', 'utf-8'),
        fs.promises.readFile('./public/_users_contents.json', 'utf-8')
    ]);

    // Parse dos dados
    let contentSelected: IContendInfoData[] = JSON.parse(contentSelectedData);
    let contents: IContentData[] = JSON.parse(contentsData);
    let myUser: IMyUserFile[] = JSON.parse(myUserData);
    let userContents: IUser[] = JSON.parse(usersContentsData);

    const myInfo : IMyUserFile | undefined = myUser.find(user => user.id === userId);
    let urls = myInfo?.conteudos.find(v => v.id === idContent)?.urls || []

    if(urls)
        urls = urls.map(v => v.replace('/files/', ''))

    if (!myInfo)
        throw new Error("Usuário não encontrado!");

    const userIds = myUser.find(v => v.id === userId)?.conteudos.flatMap(v => v.equipe).map(v => v.id)

    // Remove o conteúdo de 'contentSelected'
    contentSelected = contentSelected.filter(content => content.id !== idContent);

    // Remove o conteúdo de 'userContents' de cada usuário
    userContents.forEach(user => {
        user.conteudos = user.conteudos.filter(content => content.id !== idContent);
    });

    // Remove o conteúdo de 'myUser' (dos conteúdos do usuário)
    myUser.forEach(user => {
        user.conteudos = user.conteudos.filter(content => content.id !== idContent);
    });

    // Remove o conteúdo de 'contents'
    //contents = contents.filter(content => content.id !== idContent && content.tipo !== 'profile');

    contents = contents.filter(content => !(content.id === idContent && content.tipo !== 'profile'));

    const contentIndex = contents.findIndex((content) => content.id === userId && content.tipo === 'profile');
    
    if (contentIndex !== -1) {
        contents[contentIndex] = {
            ...contents[contentIndex], // Retain the previous data
            info: myInfo.conteudos.length.toString()
        };
    }    

    contents.forEach(v => {
        if(userIds)
        {
            if(userIds.includes(v.id) && v.tipo === 'profile')
            {
                v.info = (Number.parseInt(v.info) - 1).toString()
            }
        }
    })

    // Escreve os dados de volta nos arquivos JSON
    await Promise.all([
        fs.promises.writeFile('./public/_content_selected.json', JSON.stringify(contentSelected, null, 2)),
        fs.promises.writeFile('./public/_users_contents.json', JSON.stringify(userContents, null, 2)),
        fs.promises.writeFile('./public/_contents.json', JSON.stringify(contents, null, 2)),
        fs.promises.writeFile('./public/_my_user.json', JSON.stringify(myUser, null, 2))
    ]);    

    try {
        const response = await fetch('http://localhost:5000/api/content', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ urls: urls }) // Envia o email no corpo da requisição
        });

        const result = await response.json();
        console.log('Server response:', result);
    } catch (error) {
        console.error('Failed to delete content:', error);
    }
};

export const putContent = async (userId: number | null, userData: IMyUserContent) => {
    // Lê os arquivos JSON necessários
    const [myUserData, contentSelectedData, contentsData, userContentsData] = await Promise.all([
        fs.promises.readFile('./public/_my_user.json', 'utf-8'),
        fs.promises.readFile('./public/_content_selected.json', 'utf-8'),
        fs.promises.readFile('./public/_contents.json', 'utf-8'),
        fs.promises.readFile('./public/_users_contents.json', 'utf-8')
    ]);

    // Parse dos dados lidos
    let myUser: IMyUserFile[] = JSON.parse(myUserData);
    let contentSelected: IContendInfoData[] = JSON.parse(contentSelectedData);
    let contents: IContentData[] = JSON.parse(contentsData);
    let userContents: IUser[] = JSON.parse(userContentsData);

    // Encontra o usuário baseado no 'userId'
    const myInfo = myUser.find(user => user.id === userId);

    if (!myInfo) {
        throw new Error("Usuário não encontrado!");
    }

    // Encontre o conteúdo específico no 'contentSelected' para atualizar
    const contentIndex = contentSelected.findIndex(content => content.id === userData.id);

    if (contentIndex === -1) {
        throw new Error("Conteúdo não encontrado em _content_selected");
    }

    const userIdsBefore = myInfo.conteudos.flatMap(v => v.equipe).map(v => v.id)
    const userIdsAfter = userData.equipe.map(v => v.id)    

    // Atualiza o conteúdo no 'contentSelected', mas mantém as URLs inalteradas
    contentSelected[contentIndex] = {
        ...contentSelected[contentIndex], // mantém as propriedades atuais
        nome: userData.nome,
        genero: userData.genero,
        tipo: userData.tipo,
        info: userData.info,
        sinopse: userData.sinopse,
        equipe: [{ // Adiciona o usuário à sua própria equipe com id, nome, area e email
            id: myInfo.id,
            nome: myInfo.nome,
            area: myInfo.area,
            email: myInfo.email
        },
        ...userData.equipe.map(teamMember => ({
            id: myUser.find(v => v.email === teamMember.email)?.id || 0,
            nome: teamMember.nome,
            area: myUser.find(v => v.email === teamMember.email)?.area || '',
            email: teamMember.email
        }))],
        estado: myInfo.estado, // mantemos o estado da informação do usuário
        cidade: myInfo.cidade, // mantemos a cidade da informação do usuário
        email: myInfo.email // mantemos o e-mail do usuário
    };

    // Encontre o conteúdo correspondente em 'contents' e faça a atualização, mas sem mudar as URLs
    const contentIndexInContents = contents.findIndex(content => content.id === userData.id && content.tipo !== 'profile');
    
    if (contentIndexInContents !== -1) {
        contents[contentIndexInContents] = {
            ...contents[contentIndexInContents], // mantém as propriedades atuais
            nome: userData.nome,
            genero: userData.genero,
            tipo: userData.tipo,
            info: userData.info,
            estado: myInfo.estado,
            cidade: myInfo.cidade
        };
    }

    contents.forEach(v => {
        if(userIdsBefore.includes(v.id))
        {
            if(!userIdsAfter.includes(v.id))
            {
                v.info = (Number.parseInt(v.info) - 1).toString()
            }
        } 
        else
        {
            if(userIdsAfter.includes(v.id))
            {
                v.info = (Number.parseInt(v.info) + 1).toString()
            }
        }
    })

    // Encontre o conteúdo correspondente em 'userContents' e atualize os dados, sem alterar as URLs
    userContents.forEach(user => {
        user.conteudos = user.conteudos.map(content => {
            if (content.id === userData.id) {
                return {
                    ...content, // mantém as propriedades atuais
                    nome: userData.nome,
                    genero: userData.genero,
                    tipo: userData.tipo,
                    info: userData.info,
                    sinopse: userData.sinopse,
                    urls: content.urls, // Mantém as URLs antigas
                    estado: myInfo.estado,
                    cidade: myInfo.cidade
                };
            }
            return content;
        });
    });

    // Atualiza os conteudos no meu usuário (_my_user.json)
    const myUserIndex = myUser.findIndex(user => user.id === userId);

    if (myUserIndex !== -1) {
        myUser[myUserIndex].conteudos = myUser[myUserIndex].conteudos.map(content => {
            if (content.id === userData.id) {
                return {
                    ...content, // mantém as propriedades atuais
                    nome: userData.nome,
                    genero: userData.genero,
                    tipo: userData.tipo,
                    info: userData.info,
                    sinopse: userData.sinopse,
                    urls: content.urls, // Mantém as URLs antigas
                    equipe: [
                        ...userData.equipe.map(teamMember => ({
                            id: myUser.find(v => v.email === teamMember.email)?.id || 0,
                            nome: teamMember.nome,
                            area: myUser.find(v => v.email === teamMember.email)?.area || '',
                            email: teamMember.email
                        }))
                    ]
                };
            }
            return content;
        });
    }
    

    // Atualiza os dados de volta nos arquivos
    await Promise.all([
        fs.promises.writeFile('./public/_content_selected.json', JSON.stringify(contentSelected, null, 2)),
        fs.promises.writeFile('./public/_contents.json', JSON.stringify(contents, null, 2)),
        fs.promises.writeFile('./public/_my_user.json', JSON.stringify(myUser, null, 2)),
        fs.promises.writeFile('./public/_users_contents.json', JSON.stringify(userContents, null, 2))
    ]);
};

// Função para obter a duração do vídeo (em segundos)
// Função para obter a duração do vídeo em minutos
const getVideoDuration = async (path: string): Promise<string> => {
    const formData = new FormData();
    formData.append('path', path.trim());

    const response = await fetch('http://localhost:5000/api/video-duration', {
        method: 'POST',
        body: formData
    });

    const result = await response.json();
    const durationInSeconds = result.duration; // Duração em segundos

    // Convertendo para minutos e formatando como "minutos:segundos"
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = Math.floor(durationInSeconds % 60);

    if(minutes === 0)
        return `${seconds}seg`; // Retorna a duração formatada em minutos e segundos
    else
        return `${minutes}min`; // Retorna a duração formatada em minutos e segundos
};

// Função para obter o número de páginas de um PDF
const getPdfPageCount = async (file: File): Promise<number> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('http://localhost:5000/api/pdf-page-count', {
        method: 'POST',
        body: formData
    });

    const result = await response.json();
    return result.pageCount;  // Retorna o número de páginas
};
