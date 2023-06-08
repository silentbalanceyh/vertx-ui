import {Langue} from "environment";
import HocContainer from "./HocContainer";
import Fn from './I.common';
import __Zn from '../zero.module.dependency';

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
        // @ts-ignore
        this.resourcePath = `cab/${__Zn.Env.LANGUAGE}/${name}`;
    }

    is(): boolean {
        return this.ready;
    }

    name() {
        return this.resourcePath;
    }

    __type(): String {
        return "HocI18n";
    }

    namespace() {
        return this.ns;
    }

    mergeVector(path, key, value) {
        if (this.ready && __Zn.isArray(path) && value) {
            let $hoc = __Zn.immutable(this.lg);
            // 修正第一路径
            if (path[0] && !path[0].startsWith("_")) {
                path[0] = `_${path[0]}`;
            }
            // 直接设置该路径的值
            let $target = $hoc.getIn(path);
            if ($target && $target['toJS']) {
                $target = $target['toJS']();
                if (__Zn.isObject(value)) {
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
                    // @ts-ignore
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
        Fn.hocMerge(this.lg, metadata);
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

    /*
     * form数据结构
     * {
     *     "assist": {},
     *     "modal": {
     *         "success": {},
     *         "error": {},
     *         "confirm": {}
     *     },
     *     "hidden": []
     *     "initial": {},
     *     "as": {
     *         "key": "$KEY$"
     *     },
     *     "segment": {
     *         "$KEY$": [
     *             []
     *         ]
     *     },
     *     "mapping": {},
     *     "transform": {}
     * }
     */
    formSave(form: any = {}): any {
        // 原始表单配置
        const formRef = this.lg._form;
        const combine = __Zn.toForm(formRef, form);
        // 重写 ui 部分
        const {
            segment = {},
            ...result
        } = combine;
        const uiBefore = __Zn.clone(result.ui);
        // 递归替换复杂算法
        result.ui = __Zn.toFormUi(uiBefore, segment);
        Object.assign(formRef, result);
    }
}

export default HocI18n;
