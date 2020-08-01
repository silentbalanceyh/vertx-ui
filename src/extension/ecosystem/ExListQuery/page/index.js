import Ex from 'ex';
import PageList from './P.list';
import PageAdd from './P.add';
import PageEdit from './P.edit';

const exported = {};
exported[Ex.Mode.LIST] = PageList;
exported[Ex.Mode.ADD] = PageAdd;
exported[Ex.Mode.EDIT] = PageEdit;
export default exported;