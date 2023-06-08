import Ux from "ux";
import __Zn from "./zero.module.dependency";

const KEYWORD = {
    "/workflow/": ["name"],       // 工作流专用页
    "/acme/modulat": ["bag"]      // 模块化动态页
}
const __seekPath = (path, reference) => {
    const {$router} = reference.props;
    // 1. 基本的 Normalize 处理
    let pageUri;
    if (path.startsWith(`/${Ux.Env.ROUTE}`)) {
        pageUri = path.replace(`/${Ux.Env.ROUTE}`, "");
    } else {
        pageUri = path;
    }
    if (0 >= pageUri.indexOf("?")) {
        // 匹配关键字
        const params = $router.paramsQs();
        if (params.type || params.status) {
            // 3. 特殊参数计算
            const required = Ux.valueSubset(params, ["type", "status"]);
            const queryPart = Ux.formatQuery(pageUri, required);
            pageUri = `${pageUri}${queryPart}`;
        } else {
            // 2. 规则计算
            Object.keys(KEYWORD).forEach(keyword => {
                const required = Ux.valueSubset(params, KEYWORD[keyword]);
                const queryPart = Ux.formatQuery(pageUri, required);
                pageUri = `${pageUri}${queryPart}`;
            })
        }
    }
    return pageUri;
}
const __seekDeeply = (path, menuData, reference) => {
    const {$router} = reference.props;
    const target = $router.from();
    if (!target) {
        // 彻底停止
        return null;
    }
    return seekUri(target, menuData, reference);
}
/*
 * 根据当前页面检查是否密码修改页，密码修改页是账号第一次登录系统的页面
 * 该页面配置在环境变量：Z_ENTRY_FIRST 中，并且不带前缀，从路由中提取的
 * 是带前缀的页：
 * Z_ROUTE + / + Z_ENTRY_FIRST
 * 密码修改页存在一定特殊性，会限制任意账号登录系统之后触发其他页面，所以
 * 密码修改页存在拦截功能
 */
const seekPassword = (reference) => {
    const {$router} = reference.props;
    return Ux.Env.ENTRY_FIRST === $router.path();
}
/*
 * 读取菜单源数据相关信息，菜单元数据信息应该只会包含
 * SIDE-MENU / BAG-MENU
 * 应该在源头去掉 NAV-MENU / SC-MENU 等呈现在首页的信息
 * 在框架级做菜单的路由计算时忽略首页呈现的 快捷
 */
const seekSource = (menuData = []) => {
    return menuData
        .filter(item => !Ux.Env.MENUS.DASH.includes(item.type))
}
/*
 * 查看是否存在顶部菜单执行压缩
 */
const seekActive = (menuData = [], analyzed = [], reference = {}) => {
    const {$keyActive} = reference.state ? reference.state : {};
    if ($keyActive) {
        const branches = analyzed.map(item => Ux.elementBranch(menuData, item.key, "parentId"));
        let actived = analyzed;
        branches.forEach(group => {
            const found = group.filter(item => $keyActive === item.key);
            if (0 < found.length) {
                const keys = group.map(item => item.key);
                const reduced = analyzed.filter(item => keys.includes(item.key));
                if (1 === reduced.length) {
                    actived = [reduced[0]];
                }
            }
        });
        return actived;
    } else {
        return analyzed;
    }
}
const seekUri = (path, menuData = [], reference) => {
    // 根据 path 查找唯一路由
    const pageUri = __seekPath(path, reference);
    let analyzed = seekSource(menuData).filter(item => pageUri.startsWith(item.uri));
    if (analyzed && 0 < analyzed.length) {
        if (1 === analyzed.length) {
            return analyzed[0];
        }
        // 同一个 active 之下会包含多个
        analyzed = seekActive(menuData, analyzed, reference);
        // 多路, 应用检索
        const bagKey = Ux.Session.getDirect(Ux.Env.PAGE_APP);
        if (!bagKey) {
            // 无应用绑定，空降
            return analyzed[0];
        }

        // 存在应用，计算
        const $menuAt = __Zn.a4MenuAt(menuData);
        let found;
        analyzed.forEach(item => {
            const bagAt = $menuAt[item.key];
            if (bagKey === bagAt) {
                // 同一个应用中的点击
                found = item;
            }
        })

        if (found) {
            return found;
        } else {
            // 保驾护航
            return analyzed[0];
        }
    } else {
        /*
         * 深度检索，取 target 执行相关处理
         */
        const page = __seekDeeply(path, menuData, reference);
        if (!page) {
            /*
             * 密码页检查
             */
            if (!seekPassword(reference)) {
                return null;
            }
        }
        return page;
        // 此处直接抛异常，属于配置错
        // return new Error("菜单配置不符合规范，无法解析路由，请检查！！");
    }
}
export default {
    seekPassword,
    seekSource,
    seekUri,
}