import Ux from 'ux';
import * as Q from 'q';
import * as Immutable from 'immutable';

const rxMetadata = (ref, action, parameters) => {
    // 构造最终处理
    const ajaxes = [];
    const processors = [];
    // 下一个函数引用
    for (const field in ref) {
        if (ref.hasOwnProperty(field)) {
            if (parameters[field]) {
                ajaxes.push((params = {}) => {
                    Object.assign(params, parameters[field]);
                    return ref[field].ajax(params);
                })
            } else {
                ajaxes.push(ref[field].ajax);
            }
            processors.push(ref[field].processor);
        }
    }
    return {ajaxes, processors}
};

const rxAjaxResponse = (processors = []) => (response) => {
    let result = {};
    response.forEach((item, index) => {
        if (item) {
            const data = item;
            const processor = processors[index];
            const processed = processor(data);
            Object.assign(result, processed);
        }
    });
    return result;
};

const rxAjax = (ajaxes = []) => {
    return (input: any = {}) => {
        const {$props, ...params} = input;
        // 拷贝参数出来，拉平处理
        return Q.all(ajaxes.map(ajax => ajax(Ux.clone(params), $props)))
    };
};

class RxFlow {
    private action: any;
    private metadata: any;
    private promiseMap: any = {};
    private parameterMap: any = {};
    private next: any = [];

    private constructor(action: any) {
        this.action = action;
    }

    static from(action: any) {
        return new RxFlow(action)
    }

    bind(metadata) {
        this.metadata = Immutable.fromJS(metadata).toJS();
        return this;
    }

    mount(...keys) {
        const refArray = Ux.onArray.apply(null, keys);
        const metadata = this.metadata;
        const promiseMap = this.promiseMap;
        refArray.forEach(key => {
            if (key) {
                const action = metadata[key];
                if (action && action.ajax && action.processor) {
                    promiseMap[key] = action;
                } else {
                    console.error('[ZI] mount: missed require attributes "ajax" or "processor"', key)
                }
            }
        });
        return this;
    }

    then(promise) {
        this.next.push(promise);
        return this;
    }

    directory(types = []) {
        if (0 < types.length) {
            const action = this.metadata['tabular'];
            if (action && action.ajax && action.processor) {
                this.promiseMap['tabular'] = action;
                this.parameterMap['tabular'] = {
                    types
                };
            } else {
                console.error('[ZI] dictionary: missed require attributes "ajax" or "processor"', types)
            }
        }
        return this;
    }

    match(key, params = {}) {
        if (key) {
            const action = this.metadata[key];
            if (action && action.ajax && action.processor) {
                this.promiseMap[key] = action;
                this.parameterMap[key] = params;
            } else {
                console.error('[ZI] match: missed require attributes "ajax" or "processor"', key)
            }
        }
        return this;
    }

    to() {
        if (this.action) {
            // 读取当前处理的引用
            const ref = this.promiseMap;
            const action = this.action;
            const parameters = this.parameterMap;
            // 构造最终处理
            const nextArray = this.next;
            const {ajaxes = [], processors = []} = rxMetadata(ref, action, parameters);
            const ajax = rxAjax(ajaxes);
            const processor = rxAjaxResponse(processors);
            if (0 === nextArray.length) {
                // 单结果处理
                return Ux.rxEdict(action, ajax, processor)
            } else {
                // 多结果处理
                return Ux.rxEclat(action, ajax, processor, nextArray)
            }
        }
    }
}

export default RxFlow;