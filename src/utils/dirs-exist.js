const fs = require('fs');
const path = require('path');

/**
 * Check for a list of directories from the current location.
 * 
 * @param {array} targetDirs list of directories to check for
 * @returns 
 */
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