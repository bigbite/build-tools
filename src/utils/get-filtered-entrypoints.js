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