interface BindContainer {
    /**
     * 生成和flush绑定的函数
     * @param props
     * @param rest
     */
    bind(props: any, ...rest: Array<any>): void;
}

export default BindContainer;
