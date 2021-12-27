const fs = require("fs");

const args = process.argv.slice(2);
if (!args || 2 !== args.length) {
    console.error("参数非法，跳过！", args);
    return;
}
args.forEach(folder => {
    if (!fs.existsSync(`${folder}/package.json`)) {
        console.error("非法Node根目录，检查参数！", folder);
    }
})
// Source
const keyCopy = [
    "scripts",
    "eslintConfig",
    "browserslist",
    "jest",
    "dependencies",
    "devDependencies"
]
const sourceStr = fs.readFileSync(`${args[0]}/package.json`, "utf8");
const source = JSON.parse(sourceStr)
const targetStr = fs.readFileSync(`${args[1]}/package.json`, "utf8");
const target = JSON.parse(targetStr)
keyCopy.forEach(key => {
    if (source.hasOwnProperty(key)) {
        target[key] = source[key]
    }
})
fs.writeFile(`${args[1]}/package.json`, JSON.stringify(target, null, 4), () => {
    console.log(`[ Proc ] 包 ${args[1]}/package.json 升级成功!!`);
})

