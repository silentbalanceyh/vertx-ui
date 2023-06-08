// 文件类型
import AVI from './common/files/extension-avi.png';
import DOC from './common/files/extension-doc.png';
import EPS from './common/files/extension-eps.png';
import XLS from './common/files/extension-xls.png';
import EXE from './common/files/extension-exe.png';
import GIF from './common/files/extension-gif.png';
import MP3 from './common/files/extension-mp3.png';
import PDF from './common/files/extension-pdf.png';
import PPT from './common/files/extension-ppt.png';
import PSD from './common/files/extension-psd.png';
import SQL from './common/files/extension-sql.png';
import TXT from './common/files/extension-txt.png';
// 数据库专用
import databaseWf from './common/toolkit/database.camunda.png';
import databaseAtom from './common/toolkit/database.atom.png';
import databaseHis from './common/toolkit/database.history.png';
import databaseRun from './common/toolkit/database.running.png';
import databaseKo from './common/toolkit/database.ko.png';

import ICON_BLOCK from './block';
import ICON_BLOCK_EXTENSION from './block-extension';

import ICON_SYS from './system';
import TAG from './tag';
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    ICON_FILE: {
        AVI,
        DOC,
        EPS,
        XLS,
        EXE,
        GIF,
        MP3,
        PDF,
        PPT,
        PSD,
        SQL,
        TXT,
        // 拓展
        DOCX: DOC,
        XLSX: XLS,
        PPTX: PPT,
        // 临时代替
        CSV: XLS,
    },
    // 数据库专用
    ICON_DATABASE: {
        WORKFLOW: databaseWf,
        ATOM: databaseAtom,
        HISTORY: databaseHis,
        DATABASE: databaseRun,
        DISABLED: databaseKo
    },
    // 模块专用
    ICON_BLOCK: {
        ...ICON_BLOCK,
        ...ICON_BLOCK_EXTENSION
    },
    ICON_SYS,
    // 标签系统
    TAG,
}