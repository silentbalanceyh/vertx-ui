import Init from './Op.Init';
import Table from './Op.Table';
import Action from './Op.Action';
import Mock from './Op.Mock';

export default {
    ...Init,
    ...Table,
    ...Action,
    ...Mock
}