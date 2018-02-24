const fs = require("fs");
const os = require("os");
const Immutable = require("immutable");
const randomjs = require("random-js");
const separator = "/";
// 读取当前目录的根目录，收集路径信息
const dir = fs.readdirSync("./src");
const keys = ["components", "container", "economy"];
const $keys = Immutable.fromJS(keys);
const targets = [];
for (let idx = 0; idx < dir.length; idx++) {
    const folder = dir[idx];
    if ($keys.contains(folder)) {
        const hit = "src" + separator + folder;
        // 二级目录
        const componentDir = fs.readdirSync(`./${hit}`);
        for (let jdx = 0; jdx < componentDir.length; jdx++) {
            const hitFolder = hit + separator + componentDir[jdx];
            // 判断目录
            const item = fs.lstatSync(hitFolder);
            if (item.isDirectory()) {
                targets.push(hitFolder);
            }
        }
    }
}

const generate = length => {
    const engine = randomjs.engines.mt19937().autoSeed();
    const id = randomjs.string()(engine, length);
    return id.replace(/-/g, "_");
};

const $files = Immutable.fromJS(["Act.Types.js", "Act.Epic.js"]);
// 扫描路径下的基础文件
const fnScan = (folder, reference = []) => {
    const dirs = fs.readdirSync(folder);
    dirs.forEach(dir => {
        const target = folder + separator + dir;
        const item = fs.lstatSync(target);
        if (item.isDirectory()) {
            // 枚举文件
            const files = fs.readdirSync(target);
            // 扫描文件
            files.forEach(file => {
                if ($files.contains(file)) {
                    const hitted = target + separator + file;
                    console.info("[Hit] " + hitted);
                    reference.push(hitted);
                }
            });
        }
    });
};
const reference = [];
targets.forEach(target => {
    fnScan(target, reference);
});
// 代码生成流程
const epics = {};
const handlers = {};
reference.forEach(key => {
    if (key.endsWith("Epic.js")) {
        const id = `_${generate(12)}Epic`;
        epics[id] = key.replace("src", "..");
    } else {
        const id = `_${generate(12)}Types`;
        handlers[id] = key.replace("src", "..");
    }
});
const shared = process.env.UX_SHARED;
if (shared) {
    epics['shareEpics'] = `../${shared}/action/Epic`;
    handlers['shareTypes'] = `../${shared}/action/Types`;
}
// 写入文件
let line = [];
for (const key in epics) {
    line.push(`import ${key} from '${epics[key]}';`);
}
for (const key in handlers) {
    line.push(`import ${key} from '${handlers[key]}';`);
}
line.push("");
line.push("import types from './actions';");
line.push("export default {");
// 导出文件集
line.push("\thandlers:{");
// Handlers导出
for (const key in handlers) {
    line.push(`\t\t...${key},`);
}
line.push("\t\t...types");
line.push("\t},");
line.push("\tepics:{");
// Epics导出
for (const key in epics) {
    line.push(`\t\t...${key},`);
}
line.push("\t}");
line.push("}");
const content = line.join("\n");
fs.writeFile("src/environment/datum.js", content, () => {
    console.log("[SUC] Successfully to write data to src/environment/datum.js");
});
// Container和Component组件index.js的生成

