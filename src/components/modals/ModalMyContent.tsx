import Button from "../buttons/Button";
import Input from "../inputs/Input";
import { ListFileCreate, ListTeamCreate } from "../list/ListCreate";
import TextH2 from "../texts/TextH2";
import React, { useEffect, useState } from "react";
import { ListMyProfileContent } from "../list/ListContent";
import { postContent, putContent } from "../commands/InputData";
import { getContents, getSelectedContents, getUsers } from "../commands/LoadData";
import { useAuth } from "../auth/Auth";

export default function ModalMyContent({ onClose }: ModalProps) {
  return (
    <div className="cmp-modal-intern-mycontent" onClick={(e) => e.stopPropagation()}>
      <div className="cmp-modal-mycontent-main">
        <ModalMyContentMain onClose={onClose} />
      </div>
    </div>
  );
}

export const ModalMyContentMain = ({ onClose }: ModalProps) => {
  const [isNew, setIsNew] = useState(true);
  const [selectedContent, setSelectedContent] = useState<IMyUserContent | null>(null);
  const [error, setErrorMessage] = useState<string | null>(null);

  const handleClearErrorMessage = (message: string | null) => {
    if(message)
      setErrorMessage(message)
    else
      setErrorMessage(null); // Clear error when content is selected
  };

  return (
    <div className="cmp-modal-mycontent">
      <div className="cmp-modal-icon-close-mycontent" onClick={onClose}>
        <span>&times;</span>
      </div>
      <div className="cmp-modal-mycontent-body">
        <MyContentCreate 
          isNew={isNew} 
          selectedContent={selectedContent}
          error={error} 
          setErrorMessage={handleClearErrorMessage} />

        <MyContentSearch 
          setIsNew={setIsNew} 
          setSelectedContent={setSelectedContent}
          setErrorMessage={handleClearErrorMessage} />
      </div>
    </div>
  );
};

export const MyContentCreate = ({
  isNew,
  selectedContent,
  error,
  setErrorMessage
}: {
  isNew: boolean;
  selectedContent: IMyUserContent | null;
  error: string | null,
  setErrorMessage: (message: string | null) => void
}) => {
  const { userId } = useAuth();
  const [users, setUsers] = useState<IUsers[]>([]);

  const [formValues, setFormValues] = useState<IMyUserContent>({
    id: 0,
    nome: '',
    genero: '',
    tipo: '',
    info: '',
    sinopse: '',
    files: [],  // Changed to array of IFile
    equipe: [],  // Team stays the same
  });

  const [isFileSectionVisible, setIsFileSectionVisible] = useState(false);

  useEffect(() => {
    // Only show the file section if `isNew` is true and `tipo` is selected
    if (isNew && formValues.tipo) {
      setIsFileSectionVisible(true);
    } else {
      setIsFileSectionVisible(false);
    }
  }, [isNew, formValues.tipo]); // Re-run this effect when `isNew` or `formValues.tipo` changes


  useEffect(() => {
    // Fetch users when the component mounts
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getUsers();  // Fetch users from API
        setUsers(fetchedUsers);  // Update the users state
      } catch (error) {
        console.error('Failed to fetch users:', error);
        setErrorMessage('Failed to load users');
      }
    };

    fetchUsers();  // Call the function to fetch users
  }, []);  // Empty dependency array means this effect runs once on mount

  useEffect(() => {  
    if (selectedContent) {
      setFormValues({
        ...selectedContent,
        files: selectedContent.files || [],  // Handle files if available in selectedContent
      });
    } else if (isNew) {
      setFormValues({
        id: 0,
        nome: '',
        genero: '',
        tipo: '',
        sinopse: '',
        info: '',
        files: [],
        equipe: [],
      });
    }
  }, [selectedContent, isNew]);

  const handleInputChange = (key: string, value: string | ITeamPost[]) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleTeamChange = (team: ITeamPost[]) => {
    setFormValues((prev) => {
      if (JSON.stringify(prev.equipe) !== JSON.stringify(team)) {
        return { ...prev, equipe: team };
      }
      return prev;
    });
  };

  const handleFilesChange = (files: IFile[]) => {
    // Pass the files to parent component via a callback function
    setFormValues((prev) => ({ ...prev, files }));
  };

  const handleSubmit = async (e: React.FormEvent) => {



    e.preventDefault();
  
    setErrorMessage('');
      
    // Validate required fields
    if (!formValues.nome || 
      !formValues.genero || 
      !formValues.tipo || 
      !formValues.sinopse) {
      setErrorMessage('Informações e arquivo(s) devem ser preenchidos.');
      return;
    }     
    
    if(isNew)
    {
      if (formValues.files.length === 0) {
        setErrorMessage('Informações e arquivo(s) devem ser preenchidos.');
        return;
      } 

      const fileNames = new Set<string>();
      for (const fileObj of formValues.files) {
        if (fileNames.has(fileObj.url)) {
          setErrorMessage('Existem arquivos com o mesmo nome.');
          return;  // Stop submission if duplicates are found
        }

        const urls = (await getSelectedContents()).flatMap(v => v.urls);  // Fetch users from API
        
        if(urls.some(v => v.replace('/files/', '')
            .split('_')[0] === fileObj.file.name.split('_')[0])){
          setErrorMessage('Esse conteúdo já existe.');
          return;  // Stop submission if duplicates are found
        }

        fileNames.add(fileObj.url);
      }
    
      // File extension validation based on the type
      const allowedExtensions: Record<string, string[]> = {
        Filme: ['mp4'],
        Roteiro: ['pdf'],
        Trilha: ['ogv', 'ogg', 'mp3'],
        Foto: ['jpeg', 'jpg', 'png']
      };
    
      const validExtensions = allowedExtensions[formValues.tipo];
      if (!validExtensions) {
        setErrorMessage('Tipo de conteúdo inválido.');
        return;
      }
    
      for (const fileObj of formValues.files) {
        const fileExtension = fileObj.file.name.split('.').pop()?.toLowerCase();
        if (fileExtension && !validExtensions.includes(fileExtension)) {
          setErrorMessage(`Arquivo inválido. Apenas as extensões (${validExtensions.join(', ')}) são permitidas para o tipo ${formValues.tipo}.`);
          return;
        }
      }
    }

    setErrorMessage('');
  
    try {
      const formData = new FormData();
  
      // Append content fields to FormData
      formData.append('nome', formValues.nome.trim());
      formData.append('genero', formValues.genero.trim());
      formData.append('tipo', formValues.tipo.trim());
      formData.append('sinopse', formValues.sinopse.trim());
      formData.append('info', formValues.info);
      formData.append('equipe', JSON.stringify(formValues.equipe));
  
      // Append files to FormData
      formValues.files.forEach((fileObj) => {
        formData.append('files', fileObj.file);  // Add the actual file
      });
  
      // Send the content data and files together
      if(isNew)
        await postContent(userId, formData, formValues);
      else
        await putContent(userId, formValues);

      window.location.reload(); // Faz o refresh da página
    } catch (error) {
      console.error('Failed to post content:', error);
    }
  };  

  return (
    <form className="cmp-modal-mycontent-create" onSubmit={handleSubmit}>
      <div className="cmp-modal-mycontent-create-left">
        <div className="cmp-modal-mycontent-create-left-information">
          <div className="cmp-modal-mycontent-create-left-information-header">
            <TextH2 text="INFORMAÇÕES" />
          </div>
          <div className="cmp-modal-mycontent-create-left-information-body">
            <Input
              type="nome_conteudo"
              value={formValues.nome}
              onChange={(e) => handleInputChange('nome', e.target.value)}
            />
            <Input
              type="genero"
              value={formValues.genero}
              onChange={(e) => handleInputChange('genero', e.target.value)}
              isDatalist={false}
            />
            <Input
              type="tipo"
              value={formValues.tipo}
              onChange={(e) => handleInputChange('tipo', e.target.value)}
              isDatalist={false}
              isNew={isNew}
            />
            <Input
              type="sinopse"
              value={formValues.sinopse}
              onChange={(e) => handleInputChange('sinopse', e.target.value)}
            />
          </div>
          <div className="cmp-modal-mycontent-create-left-information-footer">
            <Button text="salvar" type="save" />
            {!isNew && (
              <Button
                text="apagar"
                type="delete"
                color="#A52A2A"
                modal={{ 
                  type: 'confirmation', 
                  messageType: 'delete_content', 
                  contentId: selectedContent?.id 
                }}
              />
            )}
            {error && <p className="cmp-modal-login-body-error">{error}</p>}
          </div>
        </div>
      </div>
      <div className="cmp-modal-mycontent-create-right">
        <div className="cmp-modal-mycontent-create-right-group">
          <div className="cmp-modal-mycontent-create-right-group-header">
            <TextH2 text="EQUIPE" />
          </div>
          <div className="cmp-modal-mycontent-create-right-group-body">
            <ListTeamCreate
              users={users}
              selectedContent={selectedContent}
              onTeamChange={handleTeamChange}
            />
          </div>
        </div>
        {isFileSectionVisible && (
          <div className="cmp-modal-mycontent-create-right-file">
            <div className="cmp-modal-mycontent-create-right-file-header">
              <TextH2 text="ARQUIVO(S)" />
            </div>
            <div className="cmp-modal-mycontent-create-right-file-body">
              <ListFileCreate tipo={formValues.tipo} onFilesChange={handleFilesChange} />
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

export const MyContentSearch = ({ 
  setIsNew, 
  setSelectedContent,
  setErrorMessage // Add setErrorMessage here to clear error message
}: { 
  setIsNew: (isNew: boolean) => void; 
  setSelectedContent: (content: IMyUserContent | null) => void; 
  setErrorMessage: (message: string | null) => void
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);  
  const [formValues, setFormValues] = useState({
    pesquisa: '',
    tipo: ''
  });

  const handleCreateClick = () => {
    setSelectedIndex(null); // Reset selected index to null
    setIsNew(true); // Set isNew to true when creating new content
    setSelectedContent(null); // Clear selected content when creating new content
    setErrorMessage(null); // Clear any previous error message
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSelect = (content: IMyUserContent) => {
    setSelectedContent(content); // Set the selected content
    setIsNew(false); // Set isNew to false when selecting an existing content
    setErrorMessage(null); // Clear any previous error message
  };

  return (
    <div className="cmp-modal-mycontent-search">
      <div className="cmp-modal-mycontent-search-header">
        <div className="cmp-modal-mycontent-search-header-title">
          <TextH2 text="MEUS CONTEÚDOS" />
        </div>
      </div>
      <div className="cmp-modal-mycontent-search-body">
        <div className="cmp-modal-mycontent-search-body-buttons">
          <Button text="criar" type="create" onClick={handleCreateClick} />
          <Input 
            type="pesquisa_meu_conteudo" 
            onChange={(e) => handleInputChange(e, 'pesquisa')}            
            value={formValues.pesquisa} 
          />
          <Input 
            type="tipo" 
            onChange={(e) => handleInputChange(e, 'tipo')}             
            value={formValues.tipo} 
          />
        </div>
      </div>
      <div className="cmp-modal-mycontent-search-footer">
        <div className="cmp-modal-mycontent-search-footer-list">
          <ListMyProfileContent 
            selectedIndex={selectedIndex} 
            setSelectedIndex={setSelectedIndex} 
            setIsNew={setIsNew}
            setSelectedContent={setSelectedContent} 
            setErrorMessage={setErrorMessage}
            pesquisa={formValues.pesquisa} // Pass updated pesquisa value
            tipo={formValues.tipo} // Pass updated tipo value
          />
        </div>
      </div>
    </div>
  );
};
