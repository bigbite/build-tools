const fs = require('fs');

const getPackage = (path, throwError = true) => {
    let packageName = '';

    const packagePath = `${path}/package.json`;
      
    if(!fs.existsSync(packagePath)) {
        if(throwError) {
            throw new Error(`package.json does not exist for ${projectName} project.\n\nPlease create one in: ${path}`);
        }

        return false;
    }

    const packageJSON = require(packagePath) || {};
    const packageNames = packageJSON.name.split('/');
    packageName = packageNames[packageNames.length - 1];

    return {
        path,
        packagePath,
        packageName,
        package: packageJSON
    };
}

module.exports = {
    getPackage,
}
