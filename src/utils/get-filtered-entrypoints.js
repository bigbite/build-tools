/**
 * Get filtered entrypoints for projects.
 * 
 * Example command: build project1@entry1+entry2,project2@entry3
 * Example input: 'project1@entry1+entry2,project2@entry3'
 * Example return: { project1: ['entry1', 'entry2'], project2: ['entry3'] }
 * 
 * @param {Array} projects Projects of which to filter entrypoints for.
 * @returns {object} An object with project keys of which value for each is the entrypoints to build.
 */
const getFilteredEntryPoints = (projects) => {
    const filteredProjectEntryPoints = {};
    const projectNames = projects.split(',');

    projectNames.forEach((project) => {
        const projectParts = project.split('@');
        const projectName = projectParts[0];
        const entryPoints = projectParts[1] ? projectParts[1].split('+') : [];

        if (!projectName) {
            return filteredProjectEntryPoints;
        }

        if (entryPoints.length === 0) {
            filteredProjectEntryPoints[projectName] = [];
            return;
        }

        return filteredProjectEntryPoints[projectName] = entryPoints;
    });

    return filteredProjectEntryPoints;
};

module.exports = {
    getFilteredEntryPoints,
};