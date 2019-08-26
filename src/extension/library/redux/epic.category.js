import Ux from 'ux';
import I from '../ajax';

import Types from './types';

export default {
    epicCategory: Ux.rxEdict(Types.epicCategory, I.category,
        data => Ux.rxAssist({list: data}, 'datum.category'))
}