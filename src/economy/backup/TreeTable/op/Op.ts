import Init from './Op.Init';
import Dynamic from './Op.Dynamic'
import Data from './Op.Data';
import Record from './Op.Record';

export default {
    ...Dynamic,
    ...Init,
    ...Data,
    ...Record
}