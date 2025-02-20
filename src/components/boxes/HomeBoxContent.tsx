import { ListContent } from "../list/ListContent";

export default function HomeBoxContent({ query, internAction}: IQuery & ModalProps) {
    return (
        <div className="cmp-home-box-content">
            <div className="cmp-home-box-content-intern">
                <HomeBoxContentHeader />
                <HomeBoxContentBody query={query} internAction={internAction} />
            </div>
        </div>
    )
}

export const HomeBoxContentHeader = () => {
    return (
        <div className="cmp-home-box-content-header"></div>
    )
}

export const HomeBoxContentBody = ({ query, internAction}: IQuery & ModalProps) => {
    return (
        <div className="cmp-home-box-content-body">
            <ListContent query={query} internAction={internAction} />
        </div>
    )
}