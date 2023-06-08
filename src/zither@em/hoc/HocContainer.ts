/**
 * TypeScript：数据模型接口
 * @class HocContainer
 */
interface HocContainer {
    to(): Object;

    is(): boolean;

    bind(props: Object, promise: any): HocContainer;

    __type(): String;
}

export default HocContainer;
