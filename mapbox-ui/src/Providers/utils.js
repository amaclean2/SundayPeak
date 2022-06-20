export const validateAdventure = (currentAdventure, setAdventureError) => {

    const coordinates = JSON.stringify(currentAdventure.coordinates);
    let approachDistance = null;
    let season = null;
    let avgAngle = null;
    let maxAngle = null;
    let elevation = null;
    let difficulty = null;
    let gear = null;
    let gain = null;

    if (typeof currentAdventure.adventure_name !== 'string') {
        setAdventureError('Adventure Name must be a string');
        throw new Error('Adventure Name must be a string');
    }

    if (isNaN(parseInt(currentAdventure.approach)) && currentAdventure.approach !== '') {
        setAdventureError('Appraoch Distance must contain a number');
        throw new Error('Approach Distance must contain a number');
    } else {
        approachDistance = parseInt(currentAdventure.approach);
    }

    if (currentAdventure.season?.length) {
        season = JSON.stringify(currentAdventure.season.sort((a, b) => Number(a) - Number(b)));
    }

    if (isNaN(parseInt(currentAdventure.avgSlope)) && currentAdventure.avgSlope !== '') {
        setAdventureError('Average Angle must contain a number');
        throw new Error('Average angle must contain a number');
    } else {
        avgAngle = parseInt(currentAdventure.avgSlope);
    }

    if (isNaN(parseInt(currentAdventure.maxSlope)) && currentAdventure.maxSlope !== '') {
        setAdventureError('Max Angle must contain a number');
        throw new Error('Max angle must contain a number');
    } else {
        maxAngle = parseInt(currentAdventure.maxSlope);
    }

    if (isNaN(parseInt(currentAdventure.elevation)) && currentAdventure.elevation !== '') {
        setAdventureError('Elevation must contain a number');
        throw new Error('Elevation must contain a number');
    } else {
        elevation = parseInt(currentAdventure.elevation);
    }

    if (isNaN(parseInt(currentAdventure.difficulty)) && currentAdventure.difficulty !== '') {
        setAdventureError('Difficulty must contain a number');
        throw new Error('Difficulty must contain a number');
    } else {
        difficulty = parseInt(currentAdventure.difficulty);
    }

    if (currentAdventure.gear?.length) {
        gear = JSON.stringify(currentAdventure.gear.sort((a, b) => Number(a) - Number(b)));
    }

    if (isNaN(parseInt(currentAdventure.gain)) && currentAdventure.gain !== '') {
        setAdventureError('Elevation Gain must contain a number');
        throw new Error('Elevation Gain must contian a number');
    } else {
        gain = parseInt(currentAdventure.gain);
    }

    const adventureObj = {
        adventure_type: 'line',
        adventure_name: currentAdventure.adventure_name,
        approach_distance: approachDistance,
        season,
        avg_angle: avgAngle,
        max_angle: maxAngle,
        elevation,
        difficulty,
        gear,
        gain,
        bio: currentAdventure.bio || '',
        nearest_city: currentAdventure.nearest_city || null,
        coordinates
    };

    console.log("ADVENUTRE_OBJ", adventureObj);

    return adventureObj;
}