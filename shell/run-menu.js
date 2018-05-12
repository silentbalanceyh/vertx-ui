const mockFile = process.env.MENU_FILE;
const fs = require("fs");
const mkdirs = (dirpath) => {
    const pathes = dirpath.split("/");
    const targetPath = [];
    let item;
    for (let idx = 0; idx < pathes.length; idx++) {
        if (item) {
            item = item + "/" + pathes[idx];
        } else {
            item = pathes[idx];
        }
        targetPath.push(item);
    }
    for (let idx = 0; idx < targetPath.length; idx++) {
        const folder = targetPath[idx];
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, "0777");
        }
    }
};
if (fs.existsSync(mockFile)) {
    console.info(`[Zero] Start to initialize menus from file: ${mockFile}`);
    const item = fs.lstatSync(mockFile);
    if (!item.isDirectory()) {
        const path = [];
        fs.readFile(mockFile, {}, (err, content) => {
            if (!err) {
                const json = JSON.parse(content);
                if (json.data && 0 < json.data.length) {
                    json.data.forEach(each => {
                        if (each.uri) {
                            // Zero规范主页
                            path.push(`src/components${each.uri}/UI.js`);
                        }
                    })
                }
            }
            // 回调中处理Path
            console.info("[Zero] Start to generate entry file UI.js....");
            console.info("[Zero] Read tpl file from shell/tpl/init/UI.zt");
            const fromContent = fs.readFileSync("shell/tpl/init/UI.zt");
            path.forEach(each => {
                if (!fs.existsSync(each)) {
                    const folder = each.substring(0, each.lastIndexOf('/'));
                    mkdirs(folder);
                    fs.writeFileSync(each, fromContent);
                }
            });
            console.info("[Zero] Generate files successfully!");
        })
    }
} else {
    console.error(`[Zero] The path file does not exist: ${mockFile}`)
}