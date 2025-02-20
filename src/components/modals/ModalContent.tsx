"use client"
import { useEffect, useState } from "react";
import { ListTeamContent, ListTrack } from "../list/ListContent";
import TextH2 from "../texts/TextH2";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { getSelectedContents } from "../commands/LoadData";

export default function ModalContent({ onClose, contentType, contentId, internAction }: ModalProps) {
    const [contentData, setContentData] = useState<IContendInfoData>();
    const [error, setError] = useState<string | null>(null);

    const getData = async () => {
        try {
            const data = await getSelectedContents();
            setContentData(data.find(a => a.id === contentId));
        } catch (err) {
            setError("Error: " + err);
        }
    };

    useEffect(() => {
        if (internAction?.close && onClose) {
            onClose(); // Close the modal
        }
    }, [internAction?.close, onClose]);

    useEffect(() => {
        getData(); // Fetch data when the component mounts
    }, []); // Empty dependency array means this runs once on mount

    return (
        <div className="cmp-modal-intern-content" onClick={(e) => e.stopPropagation()}>
            <div className="cmp-modal-content-main">
                <ModalContentMain 
                    onClose={onClose} 
                    contentType={contentType} 
                    contentInfo={contentData} 
                    internAction={internAction} />
            </div>
        </div>
    );
}

export const ModalContentMain = (props: ModalProps) => {
    return (
        <div className="cmp-modal-content">
            <div className="cmp-modal-icon-close-content" onClick={props.onClose}>
                <span>&times;</span>
            </div>
            <div className="cmp-modal-content-body">
                <Content contentType={props.contentType} contentInfo={props.contentInfo} />
                <ContentInfo {...props} />
            </div>
        </div>
    );
};

export const Content = ({ contentType, contentInfo }: ModalProps) => {
    const renderContent = (content?: IContendInfoData) => {
        switch (contentType) {
            case 'Filme':
                return <ContentMovie contentInfo={content} />;
            case 'Trilha':
                return <ContentSoundTrack contentInfo={content} />;
            case 'Roteiro':
                return <ContentScript contentInfo={content} />;
            case 'Foto':
                return <ContentPhoto contentInfo={content} />;
            default:
                return null;
        }
    };

    return (
        <div className="cmp-modal-content-left">
            {renderContent(contentInfo)}
        </div>
    );
};

export const ContentMovie = ({ contentInfo }: ModalProps) => {    
    return (
        <div className="cmp-modal-content-left-movie">
            {contentInfo?.urls?.[0] ? (
                <video width="100%" height="100%" controls>
                    <source src={contentInfo.urls[0]} type="video/mp4" />
                </video>
            ) : (
                <p>Loading...</p> // Fallback message
            )}
        </div>
    );
};

export const ContentScript = ({ contentInfo }: ModalProps) => {
    return (
        <div className="cmp-modal-content-left-script">
            {<iframe src={contentInfo?.urls[0]} width='100%' height='100%' />}
        </div>
    )
}

export const ContentSoundTrack = ({ contentInfo }: ModalProps) => {
    return (
        <div className="cmp-modal-content-left-track">
           <ListTrack contentInfo={contentInfo} />
        </div>
    )
};

export const ContentPhoto = ({ contentInfo }: ModalProps) => {
    return (
        <div className="cmp-modal-content-left-photo">
            <Carousel className="my-carousel"
                showThumbs={true} 
                showArrows={true} 
                showIndicators={false} 
                infiniteLoop={true}
                dynamicHeight={false}
                showStatus={false}
                useKeyboardArrows={true}
                swipeable={true}
                selectedItem={0}>
                {
                    contentInfo?.urls.map((item, index) => (
                        <div className="my-carousel-box" key={index}>
                            <img src={item} alt="slides" height="50%" width="50%"/>
                        </div>
                    ))
                }
            </Carousel>
        </div>
    )
}

export const ContentInfo = (props: ModalProps) => {
    return (
        <div className="cmp-modal-content-right">
            <div className="cmp-modal-content-right-header">
                {<TextH2 text={props?.contentInfo?.nome ?? ''} />}
            </div>
            <div className="cmp-modal-content-right-body">
                <div className="cmp-modal-content-right-body-sinopse">
                    <p className="cmp-modal-content-right-body-sinopse-kind">{props?.contentInfo?.genero.toUpperCase()}</p>
                    <p className="cmp-modal-content-right-body-sinopse-text">{props?.contentInfo?.sinopse}</p>
                </div>
                <div className="cmp-modal-content-right-body-team">
                    <p className="cmp-modal-content-right-body-sinopse-kind">EQUIPE</p>
                    <ListTeamContent {...props} />
                </div>
            </div>
            <div className="cmp-modal-content-right-footer">
                <p>{props?.contentInfo?.cidade} - {props?.contentInfo?.estado}</p>
                <p>Contato - {props?.contentInfo?.email}</p>
                <p>@Todos os direitos reservados</p>
            </div>
        </div>
    )
}