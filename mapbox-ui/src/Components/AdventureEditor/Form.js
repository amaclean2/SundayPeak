import { useAdventureEditContext } from "../../Providers";
import { ErrorField, FormField } from "../Reusable";
import { gearOptions, rangeValues, seasonOptions } from "./utils";

const AdventureEditorForm = ({
    isEditable,
    onChange
}) => {
    const { currentAdventure } = useAdventureEditContext();
    
    return (
        <div className="adventure-info flex-box">
            <ErrorField form={'adventure'} />
            <FormField
                name="bio"
                label="Bio"
                type="textarea"
                isEditable={isEditable}
                fullWidth
                value={currentAdventure.bio}
                onChange={onChange}
            />
            <FormField
                name="approach_distance"
                label="Approach Distance"
                isEditable={isEditable}
                fullWidth
                options={{ suffix: 'miles' }}
                value={currentAdventure.approach_distance}
                onChange={onChange}
            />
            <FormField
                name="elevation"
                label="Elevation"
                isEditable={isEditable}
                fullWidth
                options={{ suffix: 'feet' }}
                value={currentAdventure.elevation}
                onChange={onChange}
            />
            <FormField
                name="season"
                label="Best Season"
                type="selectMany"
                options={{ selectMany: seasonOptions }}
                isEditable={isEditable}
                fullWidth
                value={currentAdventure.season}
                onChange={onChange}
            />
            <FormField
                name="gear"
                label="Gear Required"
                type="selectMany"
                options={{ selectMany: gearOptions }}
                isEditable={isEditable}
                fullWidth
                value={currentAdventure.gear}
                onChange={onChange}
            />
            <FormField
                name="gain"
                label="Elevation Gain"
                isEditable={isEditable}
                fullWidth
                value={currentAdventure.gain}
                options={{ suffix: 'feet' }}
                onChange={onChange}
            />
            <FormField
                name="avg_angle"
                label="Average Slope Angle"
                isEditable={isEditable}
                fullWidth
                value={currentAdventure.avg_angle}
                options={{ suffix: 'degrees' }}
                onChange={onChange}
            />
            <FormField
                name="max_angle"
                label="Max Slope Angle"
                isEditable={isEditable}
                fullWidth
                value={currentAdventure.max_angle}
                options={{ suffix: 'degrees' }}
                onChange={onChange}
            />
            <FormField
                name="difficulty"
                label="Difficulty"
                type="range"
                options={{ range: rangeValues }}
                isEditable={isEditable}
                fullWidth
                value={currentAdventure.difficulty}
                onChange={onChange}
            />
            <FormField
                name="nearest_city"
                label="Nearest City"
                isEditable={isEditable}
                fullWidth
                value={currentAdventure.nearest_city}
                onChange={onChange}
            />
        </div>
    );
};

export default AdventureEditorForm;