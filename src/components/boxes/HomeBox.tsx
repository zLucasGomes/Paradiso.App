"use client"
import { useEffect, useState } from "react";
import { useAuth } from "../auth/Auth";
import HomeBoxContent from "./HomeBoxContent";
import HomeBoxMenu from "./HomeBoxMenu";

export default function HomeBox() {
    const { isLogged, userId } = useAuth();
    const [inputValues, setInputValues] = useState<IQueryMenu>();
    const [close, setClose] = useState<boolean>();

    // Função para atualizar os valores dos inputs
    const handleInputChange = (name:any, value:any) => {
        setInputValues(prevValues => ({
            ...prevValues,
            [name]: value
        }));
    };

    const handleInternInputChange = (name:any, value:any) => {
        setInputValues(prevValues => ({
            ...prevValues,
            [name]: value
        }));
    };

    const handleCloseAll = (value: boolean) => {
        setClose(value);
    };

    let props: ModalProps = {
        internAction: {
            onInputChange: handleInputChange,
            onInternInputChange: handleInternInputChange,
            closeAll: handleCloseAll,
            close: close
        },
    };
    
    return (
        <div className="cmp-home-box">
            <HomeBoxContent query={inputValues} internAction={props.internAction} />
            <HomeBoxMenu isLogged={isLogged} internAction={props.internAction} query={inputValues} />
        </div>
    )
}