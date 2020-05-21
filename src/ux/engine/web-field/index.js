import Input from './O.input';
import InputNumber from './O.input.number';
import InputPassword from './O.input.password';
import Action from './O.action';
import Hidden from './O.hidden';
import Magic from './O.magic';
import Select from './O.select';
import TextArea from './O.textarea';
import Transfer from './O.transfer';

import DatePicker from './O.picker.date';
import TimePicker from './O.picker.time';

import Checkbox from './O.checkbox';
import TreeSelect from './O.tree.select';
import Radio from './O.radio';
import Button from './O.button';
// 自定义部分
import ListSelector from './O.selector.list';
import TreeSelector from './O.selector.tree';
import AddressSelector from './O.selector.address';
import DatumCascade from './O.cascade.datum';
import FileUpload from './O.file.upload';
import TableEditor from './O.editor.table';
import RichEditor from './O.editor.rich';
import DialogEditor from './O.editor.dialog';
import JsonEditor from './O.editor.json';
// 搜索
import SearchInput from './O.search.input';
import SearchRangeDate from './O.search.range.date';

const exported = {
    ...Input,
    ...InputPassword,
    ...InputNumber,

    ...Action,
    ...Hidden,
    ...Magic,
    ...Select,
    ...TextArea,
    ...DatePicker,
    ...TimePicker,
    ...Checkbox,
    ...TreeSelect,
    ...Radio,
    ...Transfer,

    ...ListSelector,
    ...TreeSelector,
    ...AddressSelector,
    ...DatumCascade,
    ...FileUpload,
    ...TableEditor,
    ...RichEditor,
    ...Button,
    ...DialogEditor,
    ...JsonEditor,

    ...SearchInput,
    ...SearchRangeDate
};
export default exported;