import __Zn from './zero.uca.dependency';

export class GGroup {
    // 分组名称
    private readonly _title: string = null;
    private readonly _name: string = null;
    // 绑定类
    private _css: any = {};
    private _children: Array<any> = [];
    private _data: any = {};

    constructor(name: string) {
        this._title = name;
        this._name = __Zn.encryptMD5(name);
        this._data.__name = name;
    }

    data(data: any = {}): GGroup {
        Object.assign(this._data, data);
        return this;
    }

    css(css: any = {}): GGroup {
        this._css = __Zn.clone(css);
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
                rowHeight = 80,
            } = this._css;
            // 宽度
            groupData.graphWidth = width ? width : 200;

            /**
             * 网格配置，构造 layoutOptions
             * 默认值：
             * columns = 2, 两列
             * rowHeight = 80，每一行行高80
             * width = 192, 当前工具宽192
             */
            const layoutOptions: any = {};
            layoutOptions.columns = columns ? columns : 1;
            layoutOptions.rowHeight = rowHeight;
            layoutOptions.dy = 6;
            layoutOptions.dx = 6;

            groupData.layoutOptions = layoutOptions;
            groupData.collapsed = true;

            // 高度计算
            const length = this._children.length;
            let seed;
            if (0 < length % columns) {
                seed = ((length / columns) + 1) * (rowHeight + 6);
            } else {
                seed = (length / columns) * (rowHeight + 6);
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
