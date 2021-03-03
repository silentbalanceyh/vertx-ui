import apiLogin from './ajax/O.api.login'
import apiMenu from './ajax/O.api.menu'
import apiMenuSub from './ajax/O.api.menu-sub'

import apiTableInfo from './ajax/O.api.table.info';

import apiSource from './ajax/source/O.api.source'
import apiSourceInfo from './ajax/source/O.api.source.info'
import apiSourceTables from './ajax/source/O.api.source.tables';

import apiSourceCheck from './ajax/source/O.api.source.check';
import apiSourceAdd from './ajax/source/O.api.source.add';
import apiSourceEdit from './ajax/source/O.api.source.edit';
import apiSourceDelete from './ajax/source/O.api.source.delete';

import apiTableGet from './ajax/source/O.api.phytable.get'
import apiTableEdit from './ajax/source/O.api.phytable.edit';
import apiTableDelete from './ajax/source/O.api.phytable.delete';
import apiTableSync from './ajax/source/O.api.phytable.sync';

import apiTableColumn from './ajax/source/O.api.phytable.column';
import apiTableColumnEdit from './ajax/source/O.api.phytable.column.edit';
// 新接口
import apiTenant from './ajax/O.api.tenant';
import apiModel from './ajax/model/O.api.model';
import apiModelPhase1 from './ajax/model/O.api.model.phase1';
import apiModelPhase2 from './ajax/model/O.api.model.phase2';
import apiModelPhase3 from './ajax/model/O.api.model.phase3';
// 任务接口
import apiTaskSearch from './ajax/import/O.api.task.search';
import apiTaskCreate from './ajax/import/O.api.task.create';
import apiTaskEnabled from './ajax/import/O.api.task.enabled';
import apiTaskDisabled from './ajax/import/O.api.task.disabled';
import apiTaskRun from './ajax/import/O.api.task.run';
import apiTaskRemove from './ajax/import/O.api.task.remove';
import apiTaskView from './ajax/import/O.api.task.view';
// 模型管理
import apiModelFull from './ajax/model/O.api.model.full';

// 标签管理
import apiTagSearch from './ajax/tag/O.api.tag.search';
import apiTagCategories from './ajax/tag/O.api.tag.categories.by';
import apiTagAttributes from './ajax/tag/O.api.tag.attributes.by';
import apiTagCreate from './ajax/tag/O.api.tag.create';
import apiTagUpdate from './ajax/tag/O.api.tag.update';
import apiTagGet from './ajax/tag/O.api.tag.view';
import apiTagDelete from './ajax/tag/O.api.tag.delete';

import apiTagTree from './ajax/tag/O.api.tag.categories'
import apiTagCatAdd from './ajax/tag/O.api.tag.category.add';
import apiTagCatSave from './ajax/tag/O.api.tag.category.save';
import apiTagCatDel from './ajax/tag/O.api.tag.category.delete';
import apiTagCatGet from './ajax/tag/O.api.tag.category.get';
import apiTagSearchBy from './ajax/tag/O.api.tag.search.by';

// 用户专用搜索
import apiUserSearch from './ajax/setting/O.api.user.search';
import apiUserPass from './ajax/setting/O.api.password.gen';

export default {
    apiLogin,           // 登录
    apiMenu,            // 读取主菜单
    apiMenuSub,         // 读取子菜单
    apiTenant,          // 读取租户信息
    apiSource,          // 读取数据源（包含数据源中物理表）
    apiTableInfo,       // 读取物理表
    // 数据源相关操作
    apiSourceCheck,     // 数据源检查
    apiSourceAdd,       // 数据源添加
    apiSourceDelete,    // 数据源删除
    apiSourceEdit,      // 数据源编辑

    apiSourceInfo,
    apiSourceTables,

    apiTableGet,       // 物理表读取
    apiTableEdit,       // 物理表编辑
    apiTableColumn,     // 物理表字段
    apiTableDelete,     // 数据表删除
    apiTableSync,       // 数据表同步
    apiTableColumnEdit, // 物理表编辑

    apiModel,           // 读取模型概览信息
    apiModelPhase1,     // 第一次点击：保存、然后下一步
    apiModelPhase2,     // 保存关联关系
    apiModelPhase3,     // 保存关联行为

    apiTaskSearch,      // 导入任务
    apiTaskCreate,      // 创建任务
    apiTaskEnabled,     // 启用
    apiTaskDisabled,    // 禁用
    apiTaskRemove,      // 删除
    apiTaskView,        // 查看
    apiTaskRun,         // 手动执行

    apiModelFull,       // 读取模型详细信息

    apiTagSearch,       // 标签
    apiTagCategories,   // 读取标签子类（下拉）
    apiTagAttributes,   // 读取模型属性（下拉）
    apiTagCreate,       // 创建基础标签
    apiTagDelete,
    apiTagUpdate,
    apiTagGet,
    apiTagTree,         // 读取所有标签分类
    apiTagCatAdd,       // 新增分类
    apiTagCatDel,       // 删除分类
    apiTagCatSave,      // 保存分类
    apiTagCatGet,       // 读取分类
    apiTagSearchBy,     // 搜索标签信息

    apiUserSearch,      // 构造用户专用列表
    apiUserPass,        // 密码重设
}