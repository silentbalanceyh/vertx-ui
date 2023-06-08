import __Zs from 'zs';

/**
 * 验证规则属性
 * message：校验文件
 * type: 可选（内建类型）
 * required：是否必填
 * len:字段长度
 * min:最小长度
 * max:最大长度
 * enum: 枚举类型
 * pattern:正则表达式校验
 * transform:校验前转换字段值
 * validator: 自定义校验
 * @method _uiDisplay
 * @private
 * @param raft 构造的配置
 * @param config 额外的配置
 * **/
const raftRow = (raft = {}, config = {}) =>
    __Zs.raftRow(raft, config);

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    raftRow
}