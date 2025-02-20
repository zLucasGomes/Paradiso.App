"use client"
import { UserOutlined } from "@ant-design/icons";
import { ListProfileContent } from "../list/ListContent";
import { useEffect, useState } from "react";
import { getContents, getUserContents } from "../commands/LoadData";
  
export default function ModalProfile({ onClose, contentId, internAction } : ModalProps) {
    const [contentData, setContentData] = useState<IUser | undefined>();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const getData = async () => {
        setLoading(true);
        try {
            const data = await getUserContents(contentId); // Replace with your API call
            setContentData(data);
        } catch (err) {
            setError("Error: " + err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getData();
    }, [contentId]);

    return (
        <div className="cmp-modal-intern-profile" onClick={(e) => e.stopPropagation()}>
            <div className="cmp-modal-profile-main">
                {loading && <p>Loading...</p>}
                {error && <p className="error">{error}</p>}
                {contentData && <ModalProfileMain {...contentData} onClose={onClose} internAction={internAction} />}
            </div>
        </div>
    );
}

export const ModalProfileMain = (props: ModalProps & IUser) => {
    return (
        <div className="cmp-modal-profile">
            <ModalProfileHeader onClose={props.onClose} />
            <ModalProfileBody {...props} />
            <ModalProfileFooter {...props} />
        </div>
    )
}

export const ModalProfileHeader = ({ onClose } : ModalProps) => {
    return (
        <div className="cmp-modal-profile-header">
            <div className="cmp-modal-icon-close-profile" onClick={onClose}>
                <span>&times;</span>
            </div>
            <div className="cmp-modal-icon-profile-header">
                <UserOutlined className="cmp-modal-icon-profile" />
            </div>
        </div>
    )
}

export const ModalProfileBody = (props : IUser) => {
    return (
        <div className="cmp-modal-profile-body">
           <h1>{props.nome.toUpperCase()}</h1>
           <h2>{props.area.toUpperCase()}</h2>
           <h2>{props.cidade.toUpperCase()} - {props.estado.toUpperCase()}</h2>
           <h2>{props.email}</h2>
        </div>
    )
}

export const ModalProfileFooter = (props: ModalProps & IUser) => {
    return (
      <div className="cmp-modal-profile-footer">
        <ListProfileContent {...props}  />
      </div>
    );
};