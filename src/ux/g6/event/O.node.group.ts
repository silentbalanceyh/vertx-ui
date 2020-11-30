import {Abs, T} from './I.common';

class GGroup {
    // 分组名称
    private readonly _title: string = null;
    private readonly _name: string = null;
    // 绑定类
    private _css: any = {};
    private _children: Array<any> = [];
    private _data: any = {};

    constructor(name: string) {
        this._title = name;
        this._name = T.encryptMD5(name);
        this._data.__name = name;
    }

    data(data: any = {}): GGroup {
        Object.assign(this._data, data);
        return this;
    }

    css(css: any = {}): GGroup {
        this._css = Abs.clone(css);
        return this;
    }

    dataItems(children: any = []): GGroup {
        this._children = children;
        this._data.__size = children.length;
        return this;
    }

    build(): any {
        const groupData: any = {};
        groupData.name = this._name;
        groupData.title = this._title;
        {
            // 风格处理，解析外层的 css 节点
            const {
                columns,
                width,
                heightRow = 60
            } = this._css;
            // 宽度
            groupData.graphWidth = width ? width : 200;

            // 网格配置，构造 layoutOptions
            const layoutOptions: any = {};
            layoutOptions.columns = columns ? columns : 1;
            groupData.layoutOptions = layoutOptions;
            groupData.collapsed = true;

            // 高度计算
            const length = this._children.length;
            let seed = 0;
            if (0 < length % columns) {
                seed = ((length / columns) + 1) * heightRow;
            } else {
                seed = (length / columns) * heightRow;
            }
            groupData.graphHeight = seed;
        }
        return groupData;
    }

    group = () => this._data;
    children = () => this._children;
    title = () => this._title;
    name = () => this._name;
}

export default GGroup;