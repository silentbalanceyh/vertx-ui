import Ux from 'ux';
import * as Q from 'q';

class RxFlow {
    private action: any;
    private metadata: any;
    private promiseMap: any = {};
    private parameterMap: any = {};

    private constructor(action: any) {
        this.action = action;
    }

    static from(action: any) {
        return new RxFlow(action)
    }

    bind(metadata) {
        this.metadata = metadata;
        return this;
    }

    mount(...keys) {
        const metadata = this.metadata;
        const promiseMap = this.promiseMap;
        keys.forEach(key => {
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
            const ajaxes = [];
            const processors = [];

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
            return Ux.rxEdict(action,
                (param) => Q.all(ajaxes.map(ajax => ajax(param))),
                (response) => {
                    let result = {};
                    response.forEach((item, index) => {
                        if (item) {
                            const data = item;
                            const processor = processors[index];
                            const processed = processor(data);
                            Object.assign(result, processed);
                        }
                    });
                    console.info(result);
                    return result;
                })
        }
    }
}

export default RxFlow;