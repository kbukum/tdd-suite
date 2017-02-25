// install modules
const path = require("path");

const buildTs = () => {
    const spawn = require('child_process').spawn;
    spawn('rimraf ./lib && tsc -p tsconfig.json --watch', { shell: true, stdio: 'inherit' });
};

const buildSync = () => {
    const spawn = require('child_process').spawn;
    spawn('npm run sync', { shell: true, stdio: 'inherit' });
};

buildTs();
buildSync();

