const fs = require('fs');

module.exports = (targetDirs = []) => {
    if(!Array.isArray(targetDirs)) {
        throw new Error('Expected an array.');
    }

    if(targetDirs.length <= 0) {
        throw new Error('Expected dirExists to have at least 1 item passed in array.');
    }


    const items = targetDirs.filter((dir) => fs.existsSync(path.resolve(`./${dir}`)));

    return items.length > 0;
}