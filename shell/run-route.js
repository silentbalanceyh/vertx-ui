const fs = require("fs");
const separator = "/";

const collect = dirPath => {
    const dirs = fs.readdirSync(dirPath);
    const results = [];
    for(let idx = 0; idx < dirs.length; idx++ ){
        const folder = dirs[idx];
        const hit = dirPath + separator + folder;
        if(!hit.startsWith("\\.")) {
            const item = fs.lstatSync(hit);
            if (item.isDirectory()) {
                const subFolder = fs.readdirSync(hit);
                for(let jdx = 0; jdx < subFolder.length; jdx++ ){
                    const subHit = subFolder[jdx];
                    const subFile = "\./" + folder + separator + subHit;
                    const subItem = hit + separator + subHit;
                    if(!subHit.startsWith("\\.")){
                        const jitem = fs.lstatSync(subItem);
                        if(jitem.isDirectory()){
                            // 二级目录处理
                            results.push(subFile);
                        }
                    }
                }
            }
        }
    }
    return results;
};

const layoutDir = collect('./src/container');
// index.js for container
let line = [];
let variables = [];
layoutDir.forEach(layout => {
    const key = layout.replace(/\./g,'').replace(/-/g,'').replace(/\//g,'_');
    line.push(`import ${key} from '${layout}/UI';`);
    variables.push(key);
});
line.push('\nexport default {');
variables.forEach(variable => {
    line.push(`\t${variable},`)
});
line.push('}\n');
let content = line.join("\n");
fs.writeFile("src/container/index.js", content, () => {
    console.log("[SUC] Successfully to write data to src/container/index.js");
});
// index.js for components
const pageDir = collect('./src/components');
line = [];
variables = [];
pageDir.forEach(layout => {
    const key = layout.replace(/\./g,'').replace(/-/g,'').replace(/\//g,'_');
    line.push(`import ${key} from '${layout}/UI';`);
    variables.push(key);
});
line.push('\nexport default {');
variables.forEach(variable => {
    line.push(`\t${variable},`)
});
line.push('}\n');
content = line.join("\n");
fs.writeFile("src/components/index.js", content, () => {
    console.log("[SUC] Successfully to write data to src/components/index.js");
});
