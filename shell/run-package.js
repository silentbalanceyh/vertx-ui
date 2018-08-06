const fs = require("fs");

const pkg = fs.readFileSync('./package.json', "utf8");
const pkgObj = JSON.parse(pkg);
const keep = fs.readFileSync('./shell/run-package.json', "utf8");
const keepObj = JSON.parse(keep);
// dependencies
const updateVersion = (target = {}) => {
    if (target) {
        for (const key in keepObj) {
            if (keepObj.hasOwnProperty(key) &&
                target.hasOwnProperty(key)) {
                const fromVal = target[key];
                target[key] = keepObj[key];
                console.info(`[SUC] ${key} ${fromVal} => ${target[key]}`);
            }
        }
    }
};

updateVersion(pkgObj.dependencies);
updateVersion(pkgObj.devDependencies);
fs.writeFile("./package.json", JSON.stringify(pkgObj, null, 4), () => {
    console.log("[SUC] Successfully to write versions to package.json");
});