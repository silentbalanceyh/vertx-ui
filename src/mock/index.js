// ---------- 成熟接口
import 登录主接口 from './ajax/全局专用/POST-登录主接口'
import 读取主页菜单 from './ajax/全局专用/GET-读取主页菜单'
import 读取所有菜单 from './ajax/全局专用/GET-读取所有菜单'
import 读取租户列表 from './ajax/全局专用/GET-读取租户';
import 注销主接口 from './ajax/全局专用/POST-注销主接口'

// ---------- 全局 ------------
import 数据源类型字典 from './ajax/字典信息/GET-数据源类型字典'

// 数据资产 -> 数据源
import 读取所有数据源 from './ajax/数据资产/数据源/GET-读取所有数据源'
import 读取物理表下列信息 from './ajax/数据资产/数据源/GET-读取物理表下所有列';
import 读取数据源详情 from './ajax/数据资产/数据源/GET-读取数据源详情';

// 数据资产 -> 画像建模 -> 模型关系图
import 模型统计 from './ajax/数据资产/画像建模/模型关系图/GET-模型统计';
import 关系统计 from './ajax/数据资产/画像建模/模型关系图/GET-关系统计';
import 读取物理表 from './ajax/数据资产/画像建模/模型关系图/GET-读取物理表';
import 读取物理表2 from './ajax/数据资产/画像建模/模型关系图/GET-读取物理表2'
import 步骤移动 from './ajax/数据资产/画像建模/模型关系图/POST-步骤移动';
import 读取键信息 from './ajax/数据资产/画像建模/模型关系图/GET-读取键信息';
// 读取物理表对应字段
import 读取关联属性 from './ajax/数据资产/画像建模/模型关系图/GET-读取关联属性';
import 读取关联行为 from './ajax/数据资产/画像建模/模型关系图/GET-读取关联行为';

// 数据源 -> 数据导入 -> 任务
import 任务列表 from './ajax/数据资产/数据导入/任务/POST-任务列表';
import 读取数据源 from './ajax/数据资产/数据导入/任务/GET-读取数据源';
import 创建任务 from './ajax/数据资产/数据导入/任务/POST-创建任务';
import 启用任务 from './ajax/数据资产/数据导入/任务/PUT-变更任务状态';
import 禁用任务 from './ajax/数据资产/数据导入/任务/PUT-变更任务状态';
import 手动运行任务 from './ajax/数据资产/数据导入/任务/PUT-变更任务状态';
import 读取任务详情 from './ajax/数据资产/数据导入/任务/GET-读取任务';
import 删除任务 from './ajax/数据资产/数据导入/任务/DELETE-删除任务';

// 数据资产 -> 画像建模 -> 数据模型
import 读取完整模型 from './ajax/数据资产/画像建模/数据模型/GET-读取所有模型'
import 读取单个模型 from './ajax/数据资产/画像建模/数据模型/GET-读取单个模型'
// 数据画像 -> 数据标签 -> 基础标签
import 基础标签列表 from './ajax/数据画像/数据标签/基础标签/GET-标签列表'
import 标签类型 from './ajax/数据画像/数据标签/基础标签/GET-标签类型'
import 标签数据模型 from './ajax/数据画像/数据标签/基础标签/GET-标签数据模型'
import 读取标签子类 from './ajax/数据画像/数据标签/基础标签/GET-读取标签子类'
import 读取模型属性 from './ajax/数据画像/数据标签/基础标签/GET-读取模型属性'
import 写基础标签 from './ajax/数据画像/数据标签/基础标签/POST-创建标签';
import 读基础标签 from './ajax/数据画像/数据标签/基础标签/GET-读取标签';
// 数据画像 -> 数据标签 -> 标签类别
import 标签类别 from './ajax/数据画像/数据标签/标签类别/GET-标签类别';
import 新增标签类别 from './ajax/数据画像/数据标签/标签类别/POST-新增标签类别';
import 删除标签类别 from './ajax/数据画像/数据标签/标签类别/DELETE-删除标签类别';
import 保存标签类别 from './ajax/数据画像/数据标签/标签类别/PUT-保存标签类别';
import 读取标签详情 from './ajax/数据画像/数据标签/标签类别/GET-类别详情';
import 搜索标签 from './ajax/数据画像/数据标签/标签类别/SEARCH-搜索标签';
// 系统设置 -> 权限管理 -> 用户
import 用户列表 from './ajax/系统设置/权限管理/用户/SEARCH-用户列表';
import 密码生成 from './ajax/系统设置/权限管理/用户/PUT-密码重设';

export default {
    // -------------------------------------------------- 全局
    post_Login_user_login: 登录主接口,
    post_api_user_logout: 注销主接口,
    "post_Login_user_get-app-list": 读取主页菜单,
    "post_Login_user_get-menu-list": 读取所有菜单,
    get_api_tenant: 读取租户列表,

    // -------------------------------------------------- 字典类型
    "get_Console_dictionary_name_DATA_SOURCE_TYPE": 数据源类型字典,

    // -------------------------------------------------- 数据资产 -> 数据源
    "get_DataAsset_data-source_tree_company1_all": 读取所有数据源,
    "get_DataAsset_physical-table-column_query": 读取物理表下列信息,

    "get_api_source_:key": 读取数据源详情,
    "get_api_source_account-mapping": 读取数据源详情,
    "get_api_source_user-basic-info": 读取数据源详情,

    // -------------------------------------------------- 数据资产 -> 画像建模 -> 模型关系图
    "get_DataAsset_account_account-object-count_company1": 模型统计,
    "get_DataAsset_account_object-relationship_company1": 关系统计,
    "get_DataAsset_physical-table_get": 读取物理表,
    post_api_source_tables: 读取物理表2,
    post_api_model_phase1: 步骤移动,

    // 大步骤1 中的最后一小步
    "get_DataAsset_data-source_physical-tables-keys_table1": 读取键信息,
    "get_DataAsset_data-source_physical-tables-keys_table2": 读取键信息,
    "get_DataAsset_data-source_physical-tables-keys_table3": 读取键信息,
    "get_DataAsset_data-source_physical-tables-keys_table4": 读取键信息,
    // 大步骤3 中的第三步
    "get_DataAsset_data-source_id-data-model_table1": 读取关联属性,
    "get_DataAsset_data-source_id-data-action_table1": 读取关联行为,

    // -------------------------------------------------- 数据源 -> 数据导入 -> 任务
    "get_DataAsset_data-source_physical-tables_company1": 读取数据源,        // 初始化
    post_api_task_search: 任务列表,                     // 搜索任务
    post_api_task_create: 创建任务,                     // 创建任务主接口
    "get_api_search_data-source": 读取数据源,           // 读取导入数据源
    "get_api_search_data-target": 读取数据源,           // 数据目标数据源
    "get_api_search_data-sub-source": 读取数据源,       // 读取导入数据源（子任务）
    "get_api_search_data-sub-target": 读取数据源,       // 读取目标数据源（子任务）
    "put_api_task_enabled_:id": 启用任务,               // 启用任务
    "put_api_task_disabled_:id": 禁用任务,              // 禁用任务
    "put_api_task_run_:id": 手动运行任务,                // 手动运行
    "delete_api_task_remove_:id": 删除任务,              // 删除
    "get_api_task_view_:id": 读取任务详情,                // 读取任务

    // -------------------------------------------------- 数据资产 -> 画像建模 -> 数据模型
    "get_api_model_full_read": 读取完整模型,               // 读取完整模型
    "get_api_model_full_read_:id": 读取单个模型,          // 读取单个模型

    // -------------------------------------------------- 数据画像 -> 数据标签 -> 基础标签
    post_api_tag_search: 基础标签列表,                    // 读取标签列表
    "get_api_tag_data-types": 标签类型,                   // 读取标签类型
    "get_api_tag_data-modals": 标签数据模型,               // 读取标签数据模型
    "get_api_tag_categories-by": 读取标签子类,             // 第一个下拉
    "get_api_tag_attributes-by": 读取模型属性,             // 第二个下拉
    "post_api_tag_create": 写基础标签,                   // 创建基础标签
    "put_api_tag_update": 写基础标签,
    "delete_api_tag_delete": 写基础标签,
    "get_api_tag_id": 读基础标签,

    "get_api_tag_categories": 标签类别,                 // 读取所有标签类别
    "post_api_tag_category": 新增标签类别,               // 新增类别
    "delete_api_tag_category": 删除标签类别,             // 删除类别
    "put_api_tag_category": 保存标签类别,                // 保存类别
    "get_api_tag_category_:id": 读取标签详情,            // 读取标签详情
    "post_api_tag_search_by": 搜索标签,                 // 按条件搜索标签
    // -------------------------------------------------- 系统设置 -> 权限管理 -> 用户
    "post_api_user_search": 用户列表,                   // 用户列表
    "put_api_user_:key_re-generate": 密码生成,           // 生成密码
}