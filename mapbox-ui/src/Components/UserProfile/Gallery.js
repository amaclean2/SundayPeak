import { useState } from 'react';
import { Button } from '../Reusable';

const GalleryPlaceholder = ({ width }) => (
    <div className="gallery-placeholder" style={{ width }} />
);

const UserProfileGallery = () => {

    const [selectedFile, setSelectedFile] = useState();
    const [isFilePicked, setIsFilePicked] = useState(false);

    const changeHandler = ({ target: { files, validity }}) => {
        console.log("FILES", files, validity);
        setSelectedFile(files[0]);
        setIsFilePicked(true);
    };

    const handleSubmission = () => {
        console.log("SF", selectedFile);
    };

    return (
        <div className="scroller-container">
            <input type="file" name="file" onChange={changeHandler} />
            {isFilePicked ? (
                <div>
                    Filename: {selectedFile.name}
                    Filetype: {selectedFile.type}
                    Size: {selectedFile.size}
                </div>
            ) : (
                <>Select a file to show details</>
            )}
            <Button
                id="image-submit-button"
                onClick={handleSubmission}
            >
                Submit
            </Button>
        </div>
    )
};

export default UserProfileGallery;