import {
    useAdventureEditContext,
    useCardStateContext,
    useSubmitAdventurePicture
} from '../../Providers';
import './styles.css';

const PhotoGallery = () => {
    const { submitAdventurePicture } = useSubmitAdventurePicture();
    const { setViewingImage } = useCardStateContext();
    const { currentAdventure } = useAdventureEditContext();

    const changeHandler = ({ target: { files } }) => {
        submitAdventurePicture({ data: files[0], adventureId: currentAdventure.id });
    };

    const images = [...currentAdventure.images, 'new'];

    const handleImageClick = (imageSource) => {
        setViewingImage(imageSource);
    };

    return (
        <div className="scroller-container flex-box" >
            {images.map((image, key) => {
                if (image === 'new') {
                    return (
                        <label className="file-upload-container flex-box" key={`profile_image_create`}>
                            Add a new photo
                            <input type="file" name="image" className="image-input" onChange={changeHandler} />
                        </label>
                    );
                }

                return <img src={image} key={`profile_image_${key}`} onClick={() => handleImageClick(image)} />;
            })}
        </div>
    );
};

export default PhotoGallery;