import Datum from './AI.RxAnt.Datum';
import Pure from './AI.RxAnt.Pure';
import Complex from './AI.RxAnt.Complex';
import Data from './AI.RxAnt.Data';

class RxAnt {
    // 有返回值的走to，无返回值的走on
    static onDisabledDate = Pure.disabledDate;
    static onPrefix = Pure.prefix;
    static onPlaceHolder = Pure.placeholder;
    static onAddonAfter = Pure.addonAfter;
    static onChange = Pure.onChange;
    static onSelect = Pure.onSelect;
    static onMultiple = Pure.multiple;
    static onFromTo = Complex.fromTo;
    // 特殊
    static toParsed = Datum.parseExpr;
    static toDatum = Datum.gainDatum;   // 读取Datum
    // 窗口解析
    static toDialogConfig = Complex.dialog;
    // 树相关options解析
    static toTreeOptions = Complex.treeOptions;
    // 普通解析：items / datum
    static toOptions = Complex.options;

    static toConfig = Data.toConfig;

    static onMockData = Data.mock;
}

export default RxAnt;