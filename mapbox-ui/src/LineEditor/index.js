import DisplayCard from "../DisplayCard";
import { useCardStateContext } from "../Providers/cardStateProvider";
import { useLineEditContext } from "../Providers/lineEditProvider";

const LineEditor = () => {
    const {lineEditState, setLineEditState, currentLine, setCurrentLine} = useLineEditContext();

    return (
        <DisplayCard onClose={() => setCurrentLine(null)}>
            <div className="profile-header">
                <h1>{currentLine || 'Line Editor'}</h1>
                <div className="profile-photo" />
            </div>
            <div className="action-buttons">
                <button onClick={() => setLineEditState(true)} disabled={lineEditState} className="button line-edit-button">
                    Add New Line
                </button>
            </div>
        </DisplayCard>
    )
};

export default LineEditor;