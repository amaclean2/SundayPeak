import ButtonBar from "../Components/ButtonBar";
import ReactMap from "../Components/Mapping/ReactMap";
import { ImageViewer } from "../Components/Reusable";

const Discover = () => {
    return (
        <>
            <ReactMap />
            <ButtonBar />
            <ImageViewer />
        </>
    );
};

export default Discover;