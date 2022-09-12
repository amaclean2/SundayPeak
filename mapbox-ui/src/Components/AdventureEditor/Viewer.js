import { useAdventureEditContext } from "../../Providers";
import { Field, FieldHeader, FieldPage, FieldRow } from "../Reusable";
import AdventureGallery from "./Gallery";
import AdventureTickPanel from "./TickPanel";
import { gearOptions, seasonOptions } from "./utils";

const AdventureViewer = () => {
    const { currentAdventure } = useAdventureEditContext();

    const buildGearList = () => {
        const gearList = (typeof currentAdventure.gear === 'string')
            ? JSON.parse(currentAdventure.gear)
            : currentAdventure.gear;

        return gearList?.map((item, key) => (
            <span key={`option_${key}`}>{gearOptions.find(({ value }) => value.toString() === item).name}</span>
        ));
    };

    const buildSeasonList = () => {
        const seasonList = (typeof currentAdventure.season === 'string')
            ? JSON.parse(currentAdventure.season)
            : currentAdventure.season;

        return seasonList.map((item, key) => (
            <span key={`season_${key}`}>{seasonOptions.find(({ value }) => value.toString() === item).name}</span>
        ));
    }

    return <div className="adventure-viewer flex-box">
        <AdventureGallery />
        <FieldPage>
            <FieldRow className="adventure-bio">
                <Field>
                    {currentAdventure.bio}
                </Field>
            </FieldRow>
            <FieldRow borderBottom>
                <Field borderRight>
                    <FieldHeader text="Aspect" />
                    NW
                </Field>
                <Field borderRight>
                    <FieldHeader text="Exposure" />
                    3
                </Field>
                <Field borderRight>
                    <FieldHeader text="Slope Angle" />
                    {currentAdventure.avg_angle} - {currentAdventure.max_angle}
                </Field>
                <Field>
                    <FieldHeader text="Difficulty" />
                    {currentAdventure.difficulty}
                </Field>
            </FieldRow>
            <FieldRow borderBottom>
                <Field borderRight>
                    <FieldHeader text="Approach" />
                    {currentAdventure.approach_distance}
                </Field>
                <Field>
                    <FieldHeader text="Elevation" />
                    {currentAdventure.elevation} - {currentAdventure.elevation + currentAdventure.gain}
                </Field>
            </FieldRow>
            <FieldRow borderBottom>
                <Field>
                    <FieldHeader text="Gear" />
                    {buildGearList()}
                </Field>
            </FieldRow>
            <FieldRow borderBottom>
                <Field>
                    <FieldHeader text="Best Season" />
                    {buildSeasonList()}
                </Field>
            </FieldRow>
            <AdventureTickPanel />
        </FieldPage>
    </div>
};

export default AdventureViewer;