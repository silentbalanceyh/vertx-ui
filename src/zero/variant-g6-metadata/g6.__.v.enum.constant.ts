export enum ModeLayout {
    LeftRight = 'LR',       // Left-Right，从左到右的布局
    TopDown = 'TD',         // Top-Down，从上到下的布局
}

export enum ModeSort {
    Asc = 'Asc',            // 升序
    Desc = 'Desc',          // 降序
}

export enum ModeGroup {
    Tree = 'Tree',          // 按多根树形结构执行分组
    Field = 'Field',        // 按每个字段的值执行分组
    None = 'None',          // 不分组
}

export enum OptionKey {
    MODE_GROUP = 'mode.group',                  // 分组模式

    DATA_TEXT = "data.text",                    // 对应 text 属性
    DATA_IMAGE = "data.image",                  // 对应 image 属性
    DATA_TITLE = "data.title",                  // 对应 title 属性
    DATA_FIELDS = "data.fields",                // 数据字段信息
    DATA_ID = 'data.id',                        // 主键专用字段
    DATA_CONDITION = 'data.condition',          // 条件专用字段配置

    RELATION_MAPPING = 'relation.mapping',      // 关联关系映射信息

    SORT_FIELD = 'sort.field',                  // 排序字段
    SORT_MODE = 'sort.mode',                    // 排序模式：升序还是降序

    GROUP_FIELD = "group.field",                // 对应分组字段
    GROUP_FIELD_ROOT = "group.field.root",      // 对应分组根节点字段

    MESSAGE_CONFIRM = 'message.confirm'
}