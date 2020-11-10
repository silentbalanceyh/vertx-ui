import Control from './ix.constant';
import Dialog from './ix.dialog';
import Search from './ix.search';
import Table from './ix.table';

export default {
    Limit: Control,

    // 专用于弹出框
    ...Dialog,  // 弹框
    ...Search,  // 搜索框专用
    ...Table,   // 表格专用
};