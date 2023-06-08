import Ux from 'ux';
import __Sk from './allocation.__.fn.seek.uri';

const __seekBase = (path, menuData = [], reference) => {
    let page = __Sk.seekUri(path, menuData, reference);
    if (!page) {
        // 找不到就直接找主页
        page = __Sk.seekUri(Ux.Env.ENTRY_ADMIN, menuData, reference);
        if (!page) {
            throw Error(`站点配置出现问题，无法查找到配置中的合法主页！出错页：${path}`)
        }
    }
    return page;
}
const __seekBag = (key, menuData = [], reference) => {
    let found = Ux.elementBranch(menuData, key, "parentId");
    if (0 < found.length) {
        found = Ux.elementFind(found, {type: Ux.Env.MENU_TYPE.BAG});
    }
    if (1 === found.length) {
        return found[0];
    } else {
        return __Sk.seekUri(Ux.Env.ENTRY_ADMIN, menuData, reference);
    }
}
const __seekTop = (key, menuData = [], reference) => {
    let found = Ux.elementBranch(menuData, key, "parentId");
    found = found
        .filter(item => Ux.Env.MENU_TYPE.BAG !== item.type)
        .filter(item => Ux.Env.MENU_TYPE.TOP !== item.type);
    if (1 < found.length) {
        return found[0];
    } else {
        // 查找第一个菜单（还原）
        const page = __Sk.seekUri(Ux.Env.ENTRY_ADMIN, menuData, reference);
        return __seekFirst(page.key, menuData);
    }
}
const __seekApp = (uri, menuData = [], reference) => {
    if (__Sk.seekPassword(reference)) {
        return {};
    }
    let page = __seekBase(uri, menuData, reference);
    if (Ux.Env.MENU_TYPE.BAG === page.type) {
        return page;
    } else {
        return __seekBag(page.key, menuData, reference);
    }
}
const __seekFirst = (key, menuData = []) => {
    const menuSource = __Sk.seekSource(menuData);
    let children = Ux.elementFind(menuSource, {parentId: key});
    if (0 === children.length) {
        throw Error(`站点配置出现问题，无法捕捉子页面！出错页：${key}`)
    }
    children = children.sort(Ux.sorterAscTFn("order"));   // 查找最小的
    return children[0];
}
export default {
    /*
     * 去掉 NAV-MENU, DEV-MENU, SC-MENU 三种
     */
    resolveData: (menuData = []) => {

    },
    /*
     * 顶部页面只可能有两种：
     * 1. 首页、模块主页（带uri）
     * 2. 内页（也带uri）
     * 所以可通过反向uri来计算，从menuData中提取信息，此处提取的内容在路由中存在
     *
     * 行为分析：
     * 1）使用 F5 的情况
     * -- 1.1）在主页或应用首页刷新：计算导航、计算默认左菜单（第一个）
     * -- 1.2）在非主页刷新，递归查找
     *         1）找到链条：计算导航、计算默认开、计算当前页
     *         2）没找到：游离页（同主页），这种情况为小概率刷新
     * 2）不使用 F5 的情况
     * -- 1.1）大部分情况会遵循找到链条结构
     * -- 1.2）少部分情况会找不到
     */
    // ---------------------- 导航方法 --------------------
    /*
     * 主导航（顶部、根导航）
     */
    resolveApp: __seekApp,
    /*
     * 左导航
     */
    resolveSide: (uri, menuData = [], reference = {}) => {
        if (__Sk.seekPassword(reference)) {
            return {}
        }
        /*
         * 此处交汇配合处理
         * 1）没有选中页则查看是否有激活页：         $keyActive
         * 2）没有激活页根据当前路由地址计算
         */
        const {$keyActive} = reference.state ? reference.state : {};
        if ($keyActive) {
            // 点击头部事件
            return Ux.elementUnique(menuData, 'key', $keyActive);
        }
        const page = __Sk.seekUri(uri, menuData, reference);
        const pageApp = __seekApp(uri, menuData, reference);
        if (page.key === pageApp.key) {
            // 导航首页
            return __seekFirst(pageApp.key, menuData);
        }
        // 导航内页
        return __seekTop(page.key, menuData, reference);
    },
    resolveOpen: (uri, menuData = [], reference) => {
        if (__Sk.seekPassword(reference)) {
            return [];
        }
        const {$keyActive} = reference.state ? reference.state : {};
        let keySet = new Set();
        if ($keyActive) {
            // 点击头部事件
            const nodeActive = Ux.elementUnique(menuData, 'key', $keyActive);
            if (nodeActive) {
                keySet.add(nodeActive.key);
            }
        } else {
            const page = __Sk.seekUri(uri, menuData, reference);
            const pageApp = __seekApp(uri, menuData, reference);
            if (page.key === pageApp.key) {
                // 导航首页（只Open一个）
                const found = __seekFirst(pageApp.key, menuData);
                const nodeKey = [found ? found.key : false].filter(item => !!item);
                nodeKey.forEach(key => keySet.add(key));
            } else {
                // 导航内页（Open所有父类）
                const branch = Ux.elementBranch(menuData, page.key, "parentId");
                const nodeKey = branch.map(item => item.key)
                    .filter(key => key !== page.key);
                nodeKey.forEach(key => keySet.add(key));
            }
        }
        const {$router} = reference.props;
        const prevOpens = $router.state("_opens");
        if (Ux.isArray(prevOpens)) {
            prevOpens.forEach(key => keySet.add(key));
        }
        return Array.from(keySet);
    },
    resolvePage: (uri, menuData = [], reference) => {
        if (__Sk.seekPassword(reference)) {
            return {};
        }
        const page = __Sk.seekUri(uri, menuData, reference);
        const pageApp = __seekApp(uri, menuData, reference);
        if (page.key === pageApp.key) {
            return pageApp;
        } else {
            return page;
        }
    },
    resolvePwd: (reference) => __Sk.seekPassword(reference),
}