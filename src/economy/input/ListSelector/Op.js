import Yo from './yo';
import Yi from './yi';
import Ix from '../../_internal/ix';

export default {
    /* 生命周期 constructor */
    ...Yi,
    /* 必须实时才可以这里 */
    ...Yo,
    yoCombine: Ix.dialogCombine,
};