import __Zn from './zero.module.dependency';

const Cv = __Zn.Env;

const __keyDatum = (props, key) => {
    key = key.replace(/\./g, "_");
    const targetKey = props[`$t_${key}`] || props[`$a_${key}`];
    if (targetKey && targetKey.is()) {
        return targetKey.to();
    }
    return undefined;
};

const annoLog = (reference, options = {}) => {
    if (options.logger) {
        const fullname = __Zn.annoI18nName(reference, options);
        if (Cv.DEBUG) {
            if (fullname) {
                options.logger(reference, fullname);
            } else {
                options.logger(reference, "Unknown");
            }
        }
    }
};
const annoUnmount = (target, options = {}) => {
    if (options.unmount) {
        // 改装componentWillUnmount，销毁的时候记录一下
        let next = target.prototype.componentWillUnmount
        target.prototype.componentWillUnmount = function () {
            if (next) next.call(this, ...arguments);
            this.unmount = true
        }
        // 对setState的改装，setState查看目前是否已经销毁
        let setState = target.prototype.setState
        target.prototype.setState = function () {
            if (this.unmount) return;
            setState.call(this, ...arguments)
        }
    }
    return target
}
const annoOp = (options = {}) => {
    const binding = {};
    if (options.op) {
        // eslint-disable-next-line
        for (const key in options.op) {
            if (options.op.hasOwnProperty(key)) {
                binding[key] = options.op[key];
            }
        }
    }
    return binding;
};
const annoRender = (props = {}, options = {}) => {
    let render = true;
    if (options.loading && 0 < options.loading.length) {
        if (Cv.DEBUG) {
            console.groupCollapsed("%c 「Zero」 数据加载专用日志....", `color:#eb2f96;font-weight:100`);
        }
        options.loading.forEach(key => {
            if (0 <= key.indexOf(".")) {
                const value = __keyDatum(props, key);
                if (!value) {
                    render = false;
                    // forEach中中断必须跳出
                    if (Cv.DEBUG) {
                        console.debug(`[ERR]加载的数据问题（Tabular / Assist）：key = ${key}`);
                    }
                }
            } else {
                const targetKey = `$${key}`;
                if (!props[targetKey] || (props[targetKey].is && !props[targetKey].is())) {
                    render = false;
                    // forEach中中断必须跳出
                    if (Cv.DEBUG) {
                        console.warn(`[ERR]加载纯数据问题：key = ${key}`);
                    }
                }
            }
        });
        if (Cv.DEBUG) {
            console.groupEnd();
        }
    }
    return render;
};
export default {
    annoRender,
    annoLog,
    annoUnmount,
    annoOp,
}