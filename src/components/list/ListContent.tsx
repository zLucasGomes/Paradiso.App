"use client"
import { CaretRightOutlined, UserOutlined, InfoCircleFilled, SignatureOutlined, PauseOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import Modal from "../modals/Modal";
import { getContents, getMyUser } from "../commands/LoadData";
import { useAuth } from "../auth/Auth";

export const ListContent = ({ query, internAction}: IQuery & ModalProps) => {
  const { userId } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalProps["type"]>(undefined);
  const [modalContentType, setModalContentType] = useState<ModalProps["contentType"]>(undefined);  
  const [modalContentId, setContentId] = useState<ModalProps["contentId"]>(undefined);  
  const [contentData, setContentData] = useState<IContentData[]>([]);
  const [error, setError] = useState<string | null>(null);

  const openModal = (
      type: ModalProps["type"], 
      contentType?: ModalProps["contentType"],
      contentId?: ModalProps["contentId"]) => {
    setModalType(type);
    setModalContentType(contentType);
    setContentId(contentId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(undefined);
    setContentId(undefined);
    setModalContentType(undefined);
  };

  const getData = async (query:IQueryMenu | null) => {
    try {
      const data = await getContents(query ?? null);      
      setContentData(data);
    } catch (err) {
      setError("Error: " + err);
    }
  };

  useEffect(() => {
    if(internAction?.closeAll)
      internAction?.closeAll(false)
  }, [internAction?.closeAll]);

  useEffect(() => {
    getData(query ?? null); // Fetch data when the component mounts
  }, [query]); // Empty dependency array means this runs once on mount

  const shuffleArray = (array:IContentData[]) => {
    let shuffled = array.slice(); // Create a copy of the array to avoid mutation
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
    }
    return shuffled;
  };
  
  // Shuffle the contentData
  const randomizedContentData = shuffleArray(contentData);

  return (
    <div className="cmp-list-content">
      <table>
        <colgroup>
          <col width="5%" />
          <col width="35%" />
          <col width="27%" />
          <col width="20%" />
          <col width="12%" />
        </colgroup>
        <thead>
          <tr className="cmp-list-content-header">
            <th className="cmp-list-content-header-item"></th>
            <th className="cmp-list-content-header-item">Título / Localização</th>
            <th className="cmp-list-content-header-item">Criador</th>
            <th className="cmp-list-content-header-item">Genêro / Área</th>
            <th className="cmp-list-content-header-icon"><InfoCircleFilled className="cmp-list-header-icon" /></th>
          </tr>
        </thead>
        <tbody>
          {randomizedContentData.map((item, index) => {
            if (item.id === userId && item.tipo === 'profile') return null; // Skip this item
            return (<tr key={index} 
                className="cmp-list-content-item" 
                onClick={() => openModal(item.tipo === "profile" 
                  ? "profile" : "content", 
                  item.tipo as ModalProps["contentType"], item.id as ModalProps["contentId"])}>
              <th>{item.tipo === "profile" ? <UserOutlined className="cmp-list-icon" /> : <CaretRightOutlined className="cmp-list-icon" />}</th>
              <td className="cmp-list-content-item-name">
                {item.nome != null ? item.nome.toUpperCase() : `${item.cidade} / ${item.estado}` }
              </td>
              <td className="cmp-list-content-item-others">{item.criador}</td>
              <td className="cmp-list-content-item-others">
                {item.tipo === "profile" ? item.genero : `${item.tipo} / ${item.genero}`}
              </td>
              <td className="cmp-list-content-item-info">{item.info}</td>
            </tr>)
            })}
        </tbody>
      </table>

      {isModalOpen && (
        <Modal 
          onClose={closeModal} 
          type={modalType} 
          contentType={modalContentType}
          contentId={modalContentId}
          internAction={internAction}
        />
      )}

    </div>
  );
};

export const ListTrack = ({ contentInfo }: ModalProps) => {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null); // Track currently playing index

  // Function to handle row click and toggle play/pause
  const handleRowClick = (index: number) => {
    const audioElement = document.getElementById(`audio-${index}`) as HTMLAudioElement;
    
    if (audioElement) {
      if (audioElement.paused) {
        audioElement.play();
        setPlayingIndex(index); // Set this index as currently playing
      } else {
        audioElement.pause();
        setPlayingIndex(null); // Reset if paused
      }
    }
  };

  return (
    <div className="cmp-list-content-track">
      <table>
        <colgroup>
          <col width="4%" />
          <col width="30%" />
          <col width="50%" />
        </colgroup>
        <thead>
          <tr className="cmp-list-content-track-header">
            <th></th>
            <th>Título</th>
            <th>Faixas</th>
          </tr>
        </thead>
        <tbody>
          {contentInfo?.urls.map((item, index) => (
            <tr
              key={index}
              className="cmp-list-content-track-item"
              onClick={() => handleRowClick(index)}
            >
              <th>
                {playingIndex === index ? (
                  <PauseOutlined className="cmp-list-icon" />
                ) : (
                  <CaretRightOutlined className="cmp-list-icon" />
                )}
              </th>
              <td className="cmp-list-content-track-item-name">{contentInfo.nome} - Faixa {index + 1}</td>
              <td>
                <audio
                  id={`audio-${index}`}
                  controls
                  controlsList="nodownload"
                  onEnded={() => setPlayingIndex(null)} // Reset icon when audio finishes
                >
                  <source src={item} type="audio/ogg" />
                  <source src={item} type="audio/mp3" />
                </audio>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const ListTeamContent = (props: ModalProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalProps["type"]>(undefined);
  const [modalContentType, setModalContentType] = useState<ModalProps["contentType"]>(undefined);
  const [profileId, setProfileId] = useState<number>();

  const openModal = (profileId: number, type: ModalProps["type"], contentType?: ModalProps["contentType"]) => {
    setModalType(type);
    setModalContentType(contentType);
    setIsModalOpen(true);
    setProfileId(profileId);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(undefined);
    setModalContentType(undefined);
    setProfileId(undefined);
  };

  return (
    <div className="cmp-list-team-content">
      <table>
        <colgroup>
          <col width="2%" />
          <col width="78%" />
          <col width="20%" />
        </colgroup>
        <tbody>
          {props.contentInfo?.equipe.map((item, index) => {
            return (
              <tr key={index} className="cmp-list-team-content-item"
                  onClick={() => openModal(item.id, "profile")}>
                <th></th>
                <td className="cmp-list-team-content-item-name">{item.nome.toUpperCase()}</td>
                <td className="cmp-list-team-content-item-others">{item.area}</td>
              </tr>
              )
            })}
        </tbody>
      </table>

      {isModalOpen && (
        <Modal 
          onClose={closeModal} 
          type={modalType} 
          contentType={modalContentType} 
          contentId={profileId}
          internAction={props.internAction}
        />
      )}

    </div>
  );
}

export const ListProfileContent = (props: ModalProps & IUser) => {  
  const handleChange = (name:any, value:any) => {
    if(props.internAction?.onInternInputChange)
      props.internAction?.onInternInputChange(name, value); // Atualiza o estado correspondente
  };

  return (
    <div className="cmp-list-profile-content">
      <table>
        <colgroup>
          <col width="5%" />
          <col width="30%" />
          <col width="15%" />
          <col width="7%" />
        </colgroup>
        <tbody>
          {props.conteudos.map((item, index) => {
            return (
              <tr key={index} className="cmp-list-profile-content-item"  
                onClick={() => {
                  handleChange('pesquisa', item.nome);
                  handleChange('genero', item.genero);
                  handleChange('tipo', item.tipo);
                  handleChange('estado', item.estado);
                  handleChange('cidade', item.cidade);
                  if (props.onClose) 
                  {
                    if(props.internAction?.closeAll)
                      props.internAction?.closeAll(true);
                    props.onClose(); // Close the modal
                  }
                }}>
                <th><CaretRightOutlined className="cmp-list-icon" /></th>
                <td className="cmp-list-profile-content-item-name">{item.nome.toUpperCase()}</td>
                <td className="cmp-list-profile-content-item-others">
                  {item.tipo} / {item.genero}
                </td>
                <td className="cmp-list-profile-content-item-others">{item.info}</td>
              </tr>
            );
          })}
        </tbody>
      </table>  
    </div>
  );
}

export const ListMyProfileContent = ({ 
  selectedIndex, 
  setSelectedIndex, 
  setIsNew, 
  setSelectedContent, 
  setErrorMessage, 
  pesquisa, 
  tipo 
}: { 
  selectedIndex: number | null;
  setSelectedIndex: (index: number | null) => void; 
  setIsNew: (isNew: boolean) => void;
  setSelectedContent: (content: IMyUserContent | null) => void;
  setErrorMessage: (message: string | null) => void
  pesquisa: string;
  tipo: string 
}) => {

  const { userId } = useAuth();
  const [contentMyUser, setMyUserData] = useState<IMyUser | null>(null);

  const getMyUserContent = async () => {
    try {
        const dataMyUser = await getMyUser(userId);
        if (dataMyUser) {
          setMyUserData(dataMyUser);
        }
    } catch (err) {
        console.error("Error fetching user data:", err);
    }
  };

  useEffect(() => {
    getMyUserContent();
  }, [userId]);
  
  // Filtra os conteúdos com base em `pesquisa` e `tipo`
  const filteredContent = contentMyUser?.conteudos.filter((item) => {
    const matchesSearch = pesquisa
      ? item.nome.toLowerCase().includes(pesquisa.toLowerCase())
      : true;
    const matchesType = tipo ? item.tipo === tipo : true;
    return matchesSearch && matchesType;
  });

  return (
    <div className="cmp-list-profile-content">
      <table>
        <colgroup>
          <col width="5%" />
          <col width="30%" />
          <col width="15%" />
        </colgroup>
        <tbody>
          {filteredContent?.map((item, index) => {
            const isSelected = selectedIndex === index ? "-selected" : "";

            return (
              <tr
                key={index}
                className={"cmp-list-profile-content-item" + isSelected}
                onClick={() => {
                  setSelectedIndex(index);
                  setIsNew(false);
                  setSelectedContent(item); // Pass the selected item
                  setErrorMessage(null);
                }}
              >
                <th>
                  <SignatureOutlined className="cmp-list-icon" />
                </th>
                <td className={"cmp-list-profile-content-item-name" + isSelected}>
                  {item.nome.toUpperCase()}
                </td>
                <td className={"cmp-list-profile-content-item-others" + isSelected}>
                  {item.tipo}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
