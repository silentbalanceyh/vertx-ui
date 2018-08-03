import Init from './Op.Init';
import Bar from './Op.Bar';
import Table from './Op.Table';
import Action from './Op.Action';
import Mock from './Op.Mock';

export default {
    ...Init,
    ...Bar,
    ...Table,
    ...Action,
    ...Mock
}