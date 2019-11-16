import Input from './O.input';
import InputNumber from './O.input.number';
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
import MultiCheckBox from './O.checkbox.multi';
import AddressSelector from './O.selector.address';
import DatumCascade from './O.cascade.datum';
import FileUpload from './O.file.upload';
import DateVersion from './O.date.version';
import TableEditor from './O.editor.table';
import ChangeEditor from './O.editor.change';
import TableTransfer from './O.transfer.table';
import TimeRanger from './O.ranger.time';
import CheckedDate from './O.checked.date';
import CheckedInput from './O.checked.input';
import MatrixEditor from './O.editor.matrix';
import RichEditor from './O.editor.rich';
import TeamSelector from './O.selector.team'
import DialogEditor from './O.editor.dialog';
import Dev from '../../develop';

const exported = {
    ...Input,
    ...Action,
    ...Hidden,
    ...Magic,
    ...Select,
    ...TextArea,
    ...DatePicker,
    ...TimePicker,
    ...Checkbox,
    ...TreeSelect,
    ...InputNumber,
    ...Radio,
    ...Transfer,

    ...ListSelector,
    ...TreeSelector,
    ...MultiCheckBox,
    ...AddressSelector,
    ...DatumCascade,
    ...FileUpload,
    ...DateVersion,
    ...TableEditor,
    ...ChangeEditor,
    ...TableTransfer,
    ...TimeRanger,
    ...CheckedDate,
    ...CheckedInput,
    ...MatrixEditor,
    ...RichEditor,
    ...TeamSelector,
    ...Button,
    ...DialogEditor,
};
Dev.dgDebug(exported, "所有合法的表单字段", "#DAA520");
export default exported;