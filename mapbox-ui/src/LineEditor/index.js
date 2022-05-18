import DisplayCard from "../DisplayCard";
import { useLineEditContext } from "../Providers/lineEditProvider";
import FormField from "../Reusable/FormField/";

import './styles.css';

const LineEditor = () => {
	const {
		lineAddState,
		setLineAddState,
		currentLine,
		setCurrentLine,
		isEditable,
		setIsEditable,
		setAllLines
	} = useLineEditContext();

	const onChange = (e) => {
		setCurrentLine((workingLine) => {
			const newLine = {...workingLine};
			newLine.properties[e.target.name] = e.target.value;

			return newLine;
		});
	};

	const handleClose = () => {
		setCurrentLine(null);
		setLineAddState(false);
		setIsEditable(false);
	};

	const saveLine = () => {
		setIsEditable(false);
		setAllLines((currentLines) => {
			const workingLineIdx = currentLines.findIndex(({ id }) => id === currentLine.id);
			const newLines = [...currentLines];
			newLines[workingLineIdx].properties = currentLine.properties;

			return newLines;
		});
	};

	return (
		<DisplayCard onClose={handleClose}>
			<div className="profile-header">
				{
					(currentLine) ? (
						<FormField
							value={currentLine.properties.name}
							hideLabel
							name="name"
							className="card-header"
							isEditable={isEditable}
							onChange={onChange}
						/>
					) : (
						<FormField
							value={'Line Editor'}
							isEditable={false}
							className="card-header"
						/>
					)
				}
			</div>
			<div className="profile-content">
				{currentLine && (
					<div className="line-info flex-box">
						<FormField
							name="approach"
							label="Approach Distance"
							isEditable={isEditable}
							value={currentLine.properties.approach}
							onChange={onChange}
						/>
						<FormField
							name="elevation"
							label="Elevation"
							isEditable={isEditable}
							value={currentLine.properties.elevation}
							onChange={onChange}
						/>
						<FormField
							name="season"
							label="Best Season"
							isEditable={isEditable}
							value={currentLine.properties.season}
							onChange={onChange}
						/>
						<FormField
							name="gain"
							label="Elevation Gain"
							isEditable={isEditable}
							value={currentLine.properties.gain}
							onChange={onChange}
						/>
						<FormField
							name="avgSlope"
							label="Average Sope Angle"
							isEditable={isEditable}
							value={currentLine.properties.avgSlope}
							onChange={onChange}
						/>
						<FormField
							name="maxSlope"
							label="Max Slope Angle"
							isEditable={isEditable}
							value={currentLine.properties.maxSlope}
							onChange={onChange}
						/>
						<FormField
							name="bio"
							label="Bio"
							isEditable={isEditable}
							value={currentLine.properties.bio}
							onChange={onChange}
						/>
					</div>
				)}
				<div className="action-buttons">
					{!currentLine && (
						<button
							onClick={() => setLineAddState(true)}
							disabled={lineAddState}
							className="button line-add-button"
						>
							Add New Line
						</button>
					)}
					{currentLine && !isEditable && (
						<button
							onClick={() => setIsEditable(true)}
							className="button line-edit-button"
						>
							Edit Line
						</button>
					)}
					{currentLine && isEditable && (
						<button
							onClick={saveLine}
							className="button line-edit-button"
						>
							Save
						</button>
					)}
				</div>
			</div>
		</DisplayCard>
	);
};

export default LineEditor;