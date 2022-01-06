const fs = require("fs");
const Immutable = require("immutable");
const separator = "/";

const collect = dirPath => {
    const dirs = fs.readdirSync(dirPath);
    const results = [];
    for (let idx = 0; idx < dirs.length; idx++) {
        const folder = dirs[idx];
        const hit = dirPath + separator + folder;
        if (!hit.startsWith("\\.")) {
            const item = fs.lstatSync(hit);
            if (item.isDirectory()) {
                const subFolder = fs.readdirSync(hit);
                for (let jdx = 0; jdx < subFolder.length; jdx++) {
                    const subHit = subFolder[jdx];
                    const subFile = "\./" + folder + separator + subHit;
                    const subItem = hit + separator + subHit;
                    if (!subHit.startsWith("\\.")) {
                        const jitem = fs.lstatSync(subItem);
                        if (jitem.isDirectory()) {
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

const generateRoute = (Component = [], Config, pageTpl = {}) => {
    const routes = [];
    Component.forEach(item => {
        // 计算该页面的模板
        const special = Config['special'];
        const tpl = !special ? Config['defined'] : (() => {
            let pageTpl = Config['defined'];
            for (const specTpl in Config['special']) {
                if (Config['special'].hasOwnProperty(specTpl)) {
                    const pages = Config['special'][specTpl];
                    const $pages = Immutable.fromJS(pages);
                    if ($pages.contains(item)) {
                        pageTpl = specTpl;
                        break;
                    }
                }
            }
            return pageTpl;
        })();
        const route = {};
        if (pageTpl.hasOwnProperty(item)) {
            route.layout = pageTpl[item];
        } else {
            route.layout = tpl;
        }
        route.page = item;
        route.uri = item.replace(/_/g, "/").replace(/\$/g, '-');
        routes.push(route);
    });
    return routes;
};
/*
 * 生成三种页面
 * 1）/module/page -> Ox动态加载页
 * 2）/ambient/tabular -> 字典 Tabular 管理页
 * 3）/ambient/category -> 分类 Category 管理页
 * 4）其他页面
 */

/*
 * 可支持 `/:type`的链接
 */
const $typePages = Immutable.fromJS([
    "/ambient/tabular",  // 字典
    "/ambient/category", // 类别
    "/ambient/employee", // 员工
    "/ambient/customer", // 客户
    "/ambient/company",  // 企业
    "/ambient/identity", // 档案（详细记录）
    "/ambient/invoice",  // 发票管理
]);
const generateTpl = (lines = [], route = {}) => {
    if ("/module/page" === route.uri) {
        /*
         * 特殊页面，动态加载用，Origin X专用页
         */
        lines.push(`{connect("/ui/:module/:page",Container["${route.layout}"],Component["${route.page}"])}`);
    } else if ($typePages.contains(route.uri)) {
        /*
         * 字典页面
         */
        lines.push(`{connect("${route.uri}/:type",Container["${route.layout}"],Component["${route.page}"])}`);
    } else {
        lines.push(`{connect("${route.uri}",Container["${route.layout}"],Component["${route.page}"])}`);
    }
    /*
     * 首页
     */
    if ("/login/index" === route.uri) {
        lines.push(`{connect("/",Container["${route.layout}"],Component["${route.page}"])}`);
    }
};

const layoutDir = collect('./src/container');
// index.js for container
let line = [];
const layouts = [];
layoutDir.forEach(layout => {
    const key = layout.replace(/\./g, '').replace(/-/g, '$').replace(/\//g, '_');
    line.push(`import ${key} from '${layout}/UI';`);
    layouts.push(key);
});
line.push('\nexport default {');
layouts.forEach(variable => {
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
const variables = [];
const pageTpl = {};
pageDir.forEach(layout => {
    const key = layout.replace(/\./g, '').replace(/-/g, '$').replace(/\//g, '_');
    line.push(`import ${key} from '${layout}/UI';`);
    // tpl计算
    const tpl = `src/components` + layout.substring(1) + "/Cab.json";
    if (fs.existsSync(tpl)) {
        const json = JSON.parse(fs.readFileSync(tpl).toString());
        if (json.tpl) {
            pageTpl[key] = json.tpl;
        }
    }
    variables.push(key);
});

// Extension Dir for Zero Modules
const extensionDir = collect('./src/extension/components');
const extensionVariables = [];
let extensionLine = [];
extensionDir.forEach(page => {
    const key = page.replace(/\./g, '').replace(/-/g, '$').replace(/\//g, '_');
    if (!variables.includes(key)) {
        extensionLine.push(`import ${key} from '${page}/UI';`);
        extensionVariables.push(key);
    }
});
line.push(`import _extension from '../extension/components';`);
line.push('\nexport default {');
variables.forEach(variable => {
    line.push(`\t${variable},`)
});
line.push(`\t..._extension,`);
line.push('}\n');
content = line.join("\n");
// Extension
extensionLine.push('\nexport default {');
extensionVariables.forEach(variable => {
    extensionLine.push(`\t${variable},`)
});
extensionLine.push('}\n');
fs.writeFileSync("src/extension/components/index.js", extensionLine.join("\n"));

fs.writeFile("src/components/index.js", content, () => {
    console.log("[SUC] Successfully to write data to src/components/index.js");
    // 1.读取路由模板，生成静态路由
    const routeConfig = JSON.parse(fs.readFileSync("src/route.json").toString());
    // 2.计算路由关联关系
    const routes = generateRoute(variables.concat(extensionVariables), routeConfig, pageTpl);
    // 3.根据路由规则计算生成片段
    const lines = [];
    routes.forEach(route => generateTpl(lines, route));
    // 4.代码块
    let codeBlock = "";
    lines.forEach(line => codeBlock += "\t\t" + line + "\n");
    // 5.读取文本数据
    const tpl = fs.readFileSync("scripts/zrun-route.zt", "utf-8");
    const codes = tpl.replace(/#{ROUTE}#/g, codeBlock);
    // 6.写入路径
    fs.writeFile("src/environment/routes.js", codes, () => {
        console.info("[SUC] Routes have been updated successfully! > src/environment/routes.js");
    })
});
