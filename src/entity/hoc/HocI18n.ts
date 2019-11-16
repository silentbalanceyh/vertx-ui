import {Langue} from "environment";
import * as U from 'underscore';
import * as Immutable from 'immutable';
import Ux from "ux";
import HocContainer from "./HocContainer";

class HocI18n implements HocContainer {
    private readonly hoc: any = {};
    private readonly ready: boolean = false;
    private lg: any = {};
    private props: any = {};
    private readonly resourcePath: String = "";
    private readonly ns: String = "";

    constructor(namespace, name: String, hoc: Object) {
        this.lg = Langue(name);
        this.hoc = hoc;
        this.ns = namespace;
        this.ready = true;
        this.resourcePath = `cab/${Ux.Env.LANGUAGE}/${name}`;
    }

    is(): boolean {
        return this.ready;
    }

    name() {
        return this.resourcePath;
    }

    namespace() {
        return this.ns;
    }

    mergeVector(path, key, value) {
        if (this.ready && U.isArray(path) && value) {
            let $hoc = Immutable.fromJS(this.lg);
            // 修正第一路径
            if (path[0] && !path[0].startsWith("_")) {
                path[0] = `_${path[0]}`;
            }
            // 直接设置该路径的值
            let $target = $hoc.getIn(path);
            if ($target && $target.toJS) {
                $target = $target.toJS();
                if (U.isObject(value)) {
                    // 遍历value
                    for (const field in value) {
                        if (value.hasOwnProperty(field) &&
                            $target.hasOwnProperty(field)) {
                            const ref = $target[field];
                            if (ref) {
                                // 最终设值
                                ref[key] = value[field];
                            }
                        }
                    }
                    $hoc = $hoc.setIn(path, $target);
                }
            } else {
                console.error("[ZI] This method require your hit node must be object/array.");
            }
            this.lg = $hoc.toJS();
        }
    }

    to(): any {
        let ret = {};
        if (this.hoc) {
            // TODO: 合并Hoc
        }
        Object.assign(ret, this.lg);
        return ret;
    }

    merge(metadata: any): HocI18n {
        if (metadata) {
            /*
             * 使用一级合并，不合并的节点如：
             * 1）_button
             * 2）_dialog
             * 3）_fatal
             * 4）_loading
             * 5）_logicals
             * 6）_placheholder
             */
            const $keys = Immutable.fromJS([
                "_button", "_dialog", "_fatal",
                "_loading", "_logicals", "_placeholder"
            ]);
            Object.keys(metadata)
                .filter(key => !$keys.contains(key))
                .filter(key => !!metadata[key])
                .forEach(key => {
                    if (!this.lg[key]) {
                        this.lg[key] = {}
                    }
                    Object.assign(this.lg[key], metadata[key]);
                });
        }
        return this;
    }

    _(key: string): any {
        let targetKey = key;
        // 防止其他key乱入
        if ("string" !== typeof key) {
            key = String(key);
        }
        if (!key.startsWith("_")) {
            targetKey = `_${key}`;
        }
        if (this.lg) {
            return this.lg[targetKey];
        }
    }

    bind(props: any): HocI18n {
        this.props = props;
        return this;
    }
}

export default HocI18n;
