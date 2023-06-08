import BindContainer from './BindContainer';
import Navigator from './Navigator';
import __Zn from '../zero.module.dependency';

const _query: Function = (path: string = "") => {
    const params: any = {};
    if (path.startsWith("?")) {
        path = path.substring(path.indexOf("?") + 1);
        const pairs = path.split("&");
        pairs.forEach((item: string) => {
            if (0 < item.indexOf("=")) {
                const key = item.split("=")[0];
                const value = item.split("=")[1];
                if (key) params[key] = value;
            }
        });
    } else if (0 < path.indexOf("?")) {
        const paris = _query(`?${path.split("?")[1]}`);
        Object.assign(params, paris);
    }
    return params;
};

class DataRouter implements BindContainer {
    private readonly navigateFn: any;
    private readonly location: any = {};
    private readonly match: any = {};

    constructor(
        props = {
            navigate: {},
            location: {},
            match: {}
        },
        metadata: any
    ) {
        const {navigate, location, match} = props;
        this.navigateFn = navigate;
        this.location = location;
        this.match = match;
    }

    to(uri: string, bg: any = {}): void {
        if (uri) {
            // OLD
            // this.navigate.push(uri, bg);
            this.navigateFn(uri, {state: bg});       // New
        } else {
            console.warn(
                "[TS-VI] Please provide correct uri for DataRouter. uri = " +
                uri
            );
        }
    }


    __type(): String {
        return "DataRouter"
    }

    /**
     *
     * 判断两个路由是否相同
     *
     * @param {DataRouter} router
     * @returns {boolean}
     * @memberof DataRouter
     */
    same(router: DataRouter): boolean {
        if (!router) {
            return false;
        }
        const thisPath = this.location.pathname;
        const thatPath = router.path();
        return thisPath === thatPath;
    }

    /**
     * 生成绑定按钮执行操作的函数：Button
     * @param props
     * @param uri
     * @param params
     * @returns {Function}
     */
    bind(props: any, uri: string, params: any = {}): Function {
        const reference = this;
        // 和uri执行绑定
        const {$app} = props;
        const $navigator: Navigator = props.$navigator;
        if ($app) {
            uri = `/${$app._("path")}${uri}`;
        } else {
            console.warn(
                "[TS-VI] Could not identify $app of application information. $app = ",
                $app
            );
        }
        return (event: any) => {
            event.preventDefault();
            // 写Redux树
            if ($navigator) {
                $navigator.setActive(params.nid, params.sid);
                $navigator.flush(props);
            }
            // 页面跳转
            reference.to(uri);
        };
    }

    path(): string {
        return this.location.pathname;
    }

    uri(uri: string = ""): string {
        const original = _query(this.location.search);
        const params = _query(uri);
        const merged = Object.assign({}, original, params);
        let target;
        if (0 < uri.indexOf("?")) {
            target = uri.split("?")[0];
        } else {
            target = uri;
        }
        let calculated = target;
        if (0 <= Object.keys(merged).length) {
            calculated += "?";
            const paramQueue = [];
            Object.keys(params)
                .forEach(paramName => paramQueue.push(`${paramName}=${params[paramName]}`));
            calculated += paramQueue.join('&');
        }
        return calculated;
    }

    paramsQs(): any {
        return _query(this.location.search);
    }

    params(): any {
        // 参数合并：Path变量和Params变量
        const params = _query(this.location.search);
        const pathParams = this.match.params;
        for (const key in pathParams) {
            if (pathParams.hasOwnProperty(key)) {
                params[key] = pathParams[key];
            }
        }
        // 内部参数读取
        const internal = this.location.state;
        if (internal) {
            Object.keys(internal).forEach(iKey => params[iKey] = internal[iKey]);
        }
        return params;
    }

    _(key): any {
        if (key) {
            const params = this.params();
            return params[key];
        }
    }

    __state(): any {
        const __stateStr = this.state("__state");
        const result = {};
        if (__stateStr) {
            try {
                Object.assign(result, JSON.parse(__stateStr));
            } catch (ex) {
            }
        }
        return result;
    }

    state(key: string): any {
        const {state} = this.location;
        if (state) {
            return state[key];
        } else {
            return null;
        }
    }

    key(): string {
        return this.location.key;
    }

    from(): string {
        const target = this._('target');
        if (target) return __Zn.decryptBase64(target);
    }
}

export default DataRouter;
