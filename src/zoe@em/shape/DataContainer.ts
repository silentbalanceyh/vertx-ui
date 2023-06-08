/**
 * 接口基础类型
 */
interface DataContainer {
    ready: boolean;

    _(key: any): any;

    is(): boolean;

    raw(): Object;

    to(): any;

    __type(): String;
}

export default DataContainer;
