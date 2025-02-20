import HomeBox from "@/components/boxes/HomeBox";
import "@/css/Global.css"
import "@/css/modals/Modal.css"
import "@/css/modals/ModalLoginRegister.css"
import "@/css/modals/ModalMyContent.css"
import "@/css/modals/ModalContent.css"
import "@/css/modals/ModalMyProfile.css"
import "@/css/modals/ModalProfile.css"
import "@/css/modals/ModalConfirmation.css"
import "@/css/inputs/Input.css"
import "@/css/buttons/Button.css"
import "@/css/list/ListCreate.css"
import "@/css/list/ListContent.css"
import "@/css/texts/Text.css"
import "@/css/boxes/HomeBox.css"
import "@/css/boxes/HomeBoxContent.css"
import "@/css/boxes/HomeBoxMenu.css"
import { AuthProvider } from "@/components/auth/Auth";

export default function App() {
    return (
        <body className="app">
             <AuthProvider>
                <HomeBox />
             </AuthProvider>
        </body>
    ) 
}