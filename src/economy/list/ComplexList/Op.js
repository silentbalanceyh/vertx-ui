import Init from './Op.Init';
import Bar from './Op.Bar';
import Table from './Op.Table';
import Action from './Op.Action';
import Fn from '../../_internal/Ix.Fn';

export default {
    ...Init,
    ...Bar,
    ...Table,
    ...Action,
    ...Fn.Mock
}