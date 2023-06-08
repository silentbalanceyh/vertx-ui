import global from './func.interface.option';
// Deprecate
import authority from './func.interface.rbac.auth';
import admit from './func.interface.admit';
// ------------- 上边是全局处理 -------------
import {_Refuse} from './func.interface.error';
// ------------- 上边是调试专用 -------------
import business from './o.interface.business';

import io_jet from './func.interface.io.jet';
import finance from './func.interface.finance';
import func from './func.interface.func';
import parser from './func.interface.parser';
import generator from './func.interface.rx';
import config from './func.interface.config';
import web from './func.interface';
// ------------- X6 -----------------------
import X6 from './func.interface.c.x6';

export default {
    ...authority,
    ...func,
    ...config,
    ...generator,
    ...global,
    ...business,
    ...io_jet,      // business in / out
    ...finance,     // business finance
    ...admit,
    ...web,

    ...parser,
    /*
     * class definition
     * _Refuse -> Error
     * X6 ( Graphic )
     */
    E: _Refuse,     // _Refuse -> Error
    X6,
}