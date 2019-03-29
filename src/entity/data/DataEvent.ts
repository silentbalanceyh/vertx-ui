import * as U from 'underscore';
import Ux from 'ux';

const verify = (target: any = {}) => {
    const {_name} = target;
    if (!_name || !_name.startsWith("on")) {
        console.error("[OXE] 事件规范冲突，名称必须是 onXXX 格式！", _name);
        return false;
    }
    return true;
};

class DataEvent {
    name: any;
    source: any = {};
    target: any = {};
    // 绑定好执行事件的函数
    events;
    // 执行期状态
    params: any = {};
    returns: any = [];
    state: any = {};

    constructor(source: Object, target: Object) {
        // 1. 验证事件本身规范
        if (verify(target)) {
            this.source = source;
            this.target = target;
            // 2. 抽取元数据
            this.name = this.target._name;
        }
    }

    bind(Events: any): DataEvent {
        const name = this.name;
        if (Events.hasOwnProperty(name)) {
            const generator = Events[name];
            if (U.isFunction(generator)) {
                this.events = generator;
            } else {
                console.error("[OXE] 事件规范冲突，无法读取对应的生成器！", this.name);
            }
        }
        return this;
    }

    mount(params: any): DataEvent {
        if (params) {
            const input = Ux.clone(params);
            this.params = input;
            /**
             * 每次调用 mount 表示输入，所以此时会清空执行期队列
             * 执行期保留了每个 Behavior的返回值
             */
            this.returns = [];
            /**
             * 构造核心属性
             */
            this.source.$input = input;
            /**
             * 清空状态
             */
            this.state = {};
        }
        return this;
    }

    stored(data: any): DataEvent {
        this.returns.push(data);
        return this;
    }

    addState(key: any, data: any): DataEvent {
        this.state[key] = data;
        return this;
    }

    key(): String {
        return this.name;
    }

    provider(): Function {
        if (this.events) {
            // 执行 generator
            return this.events(this);
        } else {
            return () => {
                console.error("[OXE] 事件规范冲突，无法生成事件提供者！", this.name, this.events);
            }
        }
    }

    getReturn() {
        let index = this.returns.length - 1;
        if (0 > index) index = 0;
        return this.returns[index];
    }

    getData() {
        return this.params;
    }

    getState() {
        return this.state;
    }

    getTarget(key) {
        if (key) {
            const hit = `_${key}`;
            return this.target[hit];
        } else return this.target;
    }

    getSource(key) {
        if (key) {
            const hit = `$${key}`;
            return this.source[hit];
        } else return this.source;
    }
}

export default DataEvent;