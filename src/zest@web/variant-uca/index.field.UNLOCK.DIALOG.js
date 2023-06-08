import __AI_ACTION from './render.__.ai.action';
import __AI_SUBMIT from './render.__.ai.submit';
import __AI_INPUT from './render.__.ai.input';
import __AI_PASSWORD from './render.__.ai.password';
import __AI_CAPTCHA from './render.__.ai.captcha';
import __AI_PROTOCOL from './render.__.ai.protocol';
import __AI_INPUT_NUMBER from './render.__.ai.input.number';
import __AI_HIDDEN from './render.__.ai.hidden';
import __AI_SELECT from './render.__.ai.select';
import __AI_TEXTAREA from './render.__.ai.textarea';
import __AI_DATE_PICKER from './render.__.ai.date.picker';
import __AI_TIME_PICKER from './render.__.ai.time.picker';
import __AI_CHECKBOX from './render.__.ai.checkbox';
import __AI_TREE_SELECT from './render.__.ai.tree.select';
import __AI_RADIO from './render.__.ai.radio';
import __AI_TREE_SELECTOR from './render.__.ai.tree.selector';
import __AI_TABLE_EDITOR from './render.__.ai.table.editor';
import __AI_MATRIX_SELECTOR from './render.__.ai.matrix.selector';
import __AI_LIST_SELECTOR from './render.__.ai.list.selector';
import __AI_USER_SELECTOR from './render.__.ai.user.selector';
import __AI_USER_LEADER from './render.__.ai.user.leader';
import __AI_GROUP_SWITCHER from './render.__.ai.group.switcher';
import __AI_USER_GROUP from './render.__.ai.user.group';
import __AI_JSON_EDITOR from './render.__.ai.json.editor';
import __AI_INPUT_MULTI from './render.__.ai.input.multi';
import __AI_FILE_UPLOAD from './render.__.ai.file.upload';
import __AI_FILE_LOGO from './render.__.ai.file.logo';
import __AI_FILE_BATCH from './render.__.ai.file.batch';
import __AI_CHECK_TRANSFER from './render.__.ai.transfer';
import __AI_CHECK_JSON from './render.__.ai.check.json';
import __AI_ADDRESS_SELECTOR from './render.__.ai.address.selector';
import __AI_BRAFT_EDITOR from './render.__.ai.braft.editor';
import __AI_TABLE_TRANSFER from './render.__.ai.table.transfer';
import __AI_MAGIC from './render.v.__.ai.magic';

import __AI_QR_SEARCH_RANGE_DATE from './render.qr.__.ai.search.range.date';
import __AI_QR_SEARCH_INPUT from './render.qr.__.ai.search.input';

export default {
    // aiTableTransfer
    ...__AI_TABLE_TRANSFER,
    // aiBraftEditor
    ...__AI_BRAFT_EDITOR,
    // aiAddressSelector
    ...__AI_ADDRESS_SELECTOR,
    // aiCheckJson
    ...__AI_CHECK_JSON,
    // aiTransfer
    ...__AI_CHECK_TRANSFER,
    // aiDialogEditor
    // ...__AI_DIALOG_EDITOR,
    // aiFileBatch
    ...__AI_FILE_BATCH,
    // aiFileLogo
    ...__AI_FILE_LOGO,
    // aiFileUpload
    ...__AI_FILE_UPLOAD,
    // aiInputMulti
    // aiInputArray
    ...__AI_INPUT_MULTI,
    // aiJsonEditor
    ...__AI_JSON_EDITOR,
    // aiUserGroup
    ...__AI_USER_GROUP,
    // aiGroupSwitcher
    ...__AI_GROUP_SWITCHER,
    // aiUserLeader
    ...__AI_USER_LEADER,
    // aiUserSelector
    ...__AI_USER_SELECTOR,
    // aiListSelector
    ...__AI_LIST_SELECTOR,
    // aiMagic
    ...__AI_MAGIC,
    // aiMatrixSelector
    ...__AI_MATRIX_SELECTOR,
    // aiTableEditor
    ...__AI_TABLE_EDITOR,
    // aiTreeSelector
    ...__AI_TREE_SELECTOR,
    // aiRadio
    ...__AI_RADIO,
    // aiTreeSelect
    ...__AI_TREE_SELECT,
    // aiCheckBox
    ...__AI_CHECKBOX,
    // aiTimePicker
    ...__AI_TIME_PICKER,
    // aiDatePicker
    ...__AI_DATE_PICKER,
    // aiTextArea
    ...__AI_TEXTAREA,
    // aiSelect,
    ...__AI_SELECT,
    // aiHidden
    ...__AI_HIDDEN,
    // aiInputNumber
    ...__AI_INPUT_NUMBER,
    // aiProtocol
    ...__AI_PROTOCOL,
    // aiCaptcha
    ...__AI_CAPTCHA,
    // aiAction
    ...__AI_ACTION,
    // aiSubmit
    ...__AI_SUBMIT,
    // aiInput
    ...__AI_INPUT,
    // aiPassword
    ...__AI_PASSWORD,


    // aiSearchInput
    ...__AI_QR_SEARCH_INPUT,
    // aiSearchRangeDate
    ...__AI_QR_SEARCH_RANGE_DATE,
}
export {default as AddressSelector} from './AddressSelector/UI';
export {default as BraftEditor} from './BraftEditor/UI';
export {default as CheckJson} from './CheckJson/UI';
export {default as CheckTransfer} from './CheckTransfer/UI';
export {default as FileBatch} from './FileBatch/UI';
export {default as FileLogo} from './FileLogo/UI';
export {default as FileUpload} from './FileUpload/UI';
export {default as GroupSwitcher} from './GroupSwitcher/UI';
export {default as InputArray} from './InputArray/UI';
export {default as InputCaptcha} from './InputCaptcha/UI';
export {default as InputProtocol} from './InputProtocol/UI';
export {default as JsonEditor} from './JsonEditor/UI';
export {default as ListSelector} from './ListSelector/UI';
export {default as MagicView} from './MagicView/UI';
export {default as MatrixSelector} from './MatrixSelector/UI';
export {default as SearchInput} from './SearchInput/UI';
export {default as SearchRangeDate} from './SearchRangeDate/UI';
export {default as TableEditor} from './TableEditor/UI';
export {default as TableTransfer} from './TableTransfer/UI';
export {default as TreeSelector} from './TreeSelector/UI';
export {default as UserGroup} from './UserGroup/UI';
export {default as UserLeader} from './UserLeader/UI';
export {default as UserSelector} from './UserSelector/UI';
