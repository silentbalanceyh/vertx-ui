import Ux from 'ux';
import I from '../ajax';

import Types from './types';

export default {
    epicTabular: Ux.rxEdict(Types.epicTabular, I.tabular, data => Ux.rxDatum(data))
}