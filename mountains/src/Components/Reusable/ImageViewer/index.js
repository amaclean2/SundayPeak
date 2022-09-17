import { FlexSpacer } from '..';
import { useCardStateContext, useDeletePicture } from '../../../Providers';
import { Button } from '../Button';

import './styles.css';

export const ImageViewer = () => {
    const { viewingImage, setViewingImage } = useCardStateContext();
    const { deletePicture } = useDeletePicture();

    const closeViewer = () => {
        setViewingImage(null);
    };

    if (!viewingImage) {
        return null;
    }

    return (
        <div className="image-viewer-background flex-box" onClick={closeViewer}>
            <div className="image-viewer-header flex-box">
                <FlexSpacer />
                <Button
                    onClick={() => deletePicture({ pictureRef: viewingImage })}
                    id={'image-delete-button'}
                    className="image-delete-button"
                >
                    delete
                </Button>
                <Button
                    onClick={closeViewer}
                    id={'image-close-button'}
                    className="image-close-button"
                >
                    close
                </Button>
            </div>
            <img src={viewingImage} alt={''} className="image-view" />
        </div>
    );
};