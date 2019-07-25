import Opts from '../options';
import PageList from './P.list';
import PageAdd from './P.add';
import PageEdit from './P.edit';

const {Type} = Opts;
const exported = {};
exported[Type.LIST] = PageList;
exported[Type.ADD] = PageAdd;
exported[Type.EDIT] = PageEdit;
export default exported;