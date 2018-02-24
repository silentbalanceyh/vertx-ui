import BindContainer from './BindContainer';
import Navigator from './Navigator';

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
    }
    return params;
};

class DataRouter implements BindContainer {
    private history: any = {};
    private location: any = {};
    private match: any = {};

    constructor(
        props = {
            history: {},
            location: {},
            match: {}
        }
    ) {
        const { history, location, match } = props;
        this.history = history;
        this.location = location;
        this.match = match;
    }

    to(uri: string): void {
        if (uri) {
            this.history.push(uri);
        } else {
            console.warn(
                "[TS-VI] Please provide correct uri for DataRouter. uri = " +
                uri
            );
        }
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
        const { $app } = props;
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
    params(): any {
        // 参数合并：Path变量和Params变量
        const params = _query(this.location.search);
        const pathParams = this.match.params;
        for (const key in pathParams) {
            params[key] = pathParams[key];
        }
        return params;
    }

    _(key): any {
        if (key) {
            const params = this.params();
            return params[key];
        }
    }

    key(): string {
        return this.location.key;
    }
}

export default DataRouter;
