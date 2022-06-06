const Lines = require('../../SampleData/LineData.json');

const lineResolvers = {
    Query: {
        getAllLines: (parent, args) => {
            const { lat, long } = args;
            return Lines;
        },
        getLineDetails: (parent, args) => {
            const { id } = args;
            console.log("ID", id);
            return Lines.find((line) => line.id === id);
        }
    },

    Mutation: {
        createLine: (parent, args) => {
            const newLine = args;
            Lines.push(newLine);

            return newLine;
        },

        editLine: (parent, args) => {
            const { id, name, approach, season, avg_angle, max_angle, elevation, dificulty, gain, bio, city, last_editor_id } = args;
            const editableLineIdx = Lines.findIndex((line) => line.id === id);

            const newLineData = {
                ...Lines[editableLineIdx],
                name,
                approach,
                season,
                avg_angle,
                max_angle,
                elevation,
                dificulty,
                gain,
                bio,
                city,
                editor_ids: [...Lines[editableLineIdx].editor_ids, last_editor_id]
            };

            Lines = [...Lines.slice(0, editableLineIdx), newLineData, ...Lines.slice(editableLineIdx + 1)];

            return newLineData;
        },

        deleteLine: (parent, args) => {
            const { id } = args;
            const lineIdx = Lines.findIndex((line) => line.id === id);

            const seelctedLine = Lines[lineIdx];

            Lines = [...Lines.slice(0, lineIdx), ...Lines.slice(lineIdx + 1)];

            return seelctedLine;
        }
    }
};

module.exports = {
    lineResolvers
};