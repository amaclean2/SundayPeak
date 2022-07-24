import cx from 'classnames';
import { CarretIcon } from '../../../Images';
import { useCardStateContext } from '../../../Providers';
import { Button } from '../Button';

const DisplayHeader = ({ className, onClose }) => {
    const { closeCard } = useCardStateContext();

    const localOnClose = (e) => {
		onClose(e);
		closeCard();
	}

    return (
        <div className={cx(className, 'display-header')}>
            <div className="display-header-spacer" />
            <Button
                id="display-back-button"
                className="display-back-button flex-box"
                onClick={localOnClose}>
                <CarretIcon />
            </Button>
        </div>
    );
};

export default DisplayHeader;