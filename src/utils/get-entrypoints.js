const getEntryPoints = (projects, packagePath) => {
    const projectPath = projects.find(item => item.split('@')[0] === packagePath);

    if (!projectPath) {
        return []; // returning an empty array will build all assets/entrypoints.
    }

    const entrypointsString = projectPath.split('@').slice(1)[0];

    // handles @ being defined in project path but no entrypoints defined.
    if (!entrypointsString || entrypointsString === '' ) {
        return [];
    }

    // handles multiple entrypoints, with '+' being the seperator between each entrypoint.
    return entrypointsString.split('+');
};

module.exports = {
    getEntryPoints,
};