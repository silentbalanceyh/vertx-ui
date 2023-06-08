import __Zn from '../zero.module.dependency';
import __AI_ERR from '../autonomy.fn.ai.error';
import __CFG from '../equip.fn.config.element';
import __RX from '../behavior.fn.rx.checked';
import __AI_FORM from '../ask.fn.ai.form.external';
import __DATA_FORM from '../form.submit.fn.data.io';

// For DialogEditor Only
import __TABLE from '../table.fn.config.table.UNLOCK';
import __TABLE_EXECUTOR from '../table.fn.config.executor';
import __EQUIP_DIALOG from '../equip.fn.config.container';
import __AUTONOMY_BUTTONS from '../autonomy.fn.ai.unit.buttons';

export default {
    ...__Zn,
    ...__AI_ERR,            // aiErrorInput
    ...__CFG,               // configIcon
    ...__RX,                // rxCheckedTree
    ...__AI_FORM,           // aiForm / aiField
    ...__DATA_FORM,         // dataRequest
    ...__TABLE,             // configScroll / configColumn
    ...__TABLE_EXECUTOR,    // configExecutor
    ...__EQUIP_DIALOG,      // configDialog
    ...__AUTONOMY_BUTTONS,  // aiButtonGroups
}