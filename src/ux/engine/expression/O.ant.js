import Datum from './I.datum';
import Pure from './I.pure';
import Complex from './I.complex';
import Data from './I.data';
import Unique from './I.unique';
import onChange from './I.fn.change';

class RxAnt {
    // 有返回值的走to，无返回值的走on
    static onDisabledDate = Pure.disabledDate;
    static onPrefix = Pure.prefix;
    static onPlaceHolder = Pure.placeholder;
    static onAddonAfter = Pure.addonAfter;
    static onChange = onChange;
    static onSelect = Pure.onSelect;
    static onMultiple = Pure.multiple;
    static onReadOnly = Pure.readOnly;
    // 特殊
    static toParsed = Datum.parseExpr;
    static toDatum = Datum.parseDatum;      // 读取Datum
    static toOrigin = Datum.parseOrigin;    // Origin专用处理

    // 窗口解析
    static onFromTo = Complex.plxFromTo;
    static toDialogConfig = Complex.plxDialog;
    static toTreeOptions = Complex.plxTreeOptions;  // 树相关options解析，optionJsx.config.<items>/<datum>，返回数组
    static toOptions = Complex.plxOptions;  // 普通解析：items / datum, optionJsx.config.<items>/<datum>，返回数组
    static toRecord = Complex.plxRecord;    // 解析记录

    // 解析成List
    static toUnique = Unique.plxUnique;     // 解析：config.$datum, 返回数组

    // 数据相关
    static toConfig = Data.toConfig;
    static toMock = Data.toMock;
}

export default RxAnt;