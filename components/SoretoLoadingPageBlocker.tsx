import { ProgressSpinner } from "primereact/progressspinner";
import { Tag } from "primereact/tag";

interface SoretoLoadingPageBlockerProps {
    visible: boolean;
    errorMessage?: string;
}

const SoretoLoadingPageBlocker = (props: SoretoLoadingPageBlockerProps) => {
    return (
        props.visible ? (
            <div className={`w-full h-full absolute flex align-items-center z-5 opacity-90 border-round surface-700 flex-column justify-content-center`}>
                {!props.errorMessage && <ProgressSpinner></ProgressSpinner>}
                {props.errorMessage && <Tag severity="danger" value={props.errorMessage}></Tag>}
            </div>
        ) : <div className="hidden"></div>
    );
};

export default SoretoLoadingPageBlocker;
