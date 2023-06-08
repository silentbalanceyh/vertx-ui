import V4App, {v4Message, v4Modal, v4Notify} from './o.v4.component.mmn';
import V4InputGroup from "./o.v4.component.input.group";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    // Modal / Message / Notify Hook
    v4Modal: () => v4Modal,
    v4Message: () => v4Message,
    v4Notify: () => v4Notify,
    // 解决特定应用问题
    V4App,
    V4InputGroup,
}