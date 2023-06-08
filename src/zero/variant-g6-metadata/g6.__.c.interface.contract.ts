import {GStore} from "./g6.__.c.pojo.g.store";

/*
 * 生命周期专用接口，用于处理不同的生命周期的方法，生命周期完成：
 * 1. 配置和数据分离
 * 2. 显示和数据分离
 * 3. 行为和数据分离
 * 完整生命周期如下：
 *
 * 1. 创建周期（仅解析配置）
 * 2. 初始化周期（根据配置和输入初始化组件）
 * - 2.1. 初始化显示
 * - 2.2. 初始化数据
 * - 2.3. 初始化行为
 * 3. 就绪周期（当前组件可使用）
 */
export interface GLife {
    // 创建的生命周期
    configure(store: GStore): GLife;

    // 初始化的生命周期
    initialize(...args: any): GLife;
}

export interface GView {
    // 读取视图对应的ID
    id(): string | any;

    // 读取视图的 CSS数据
    css(): any;
}