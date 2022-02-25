import AVI from './files/extension-avi.png';
import DOC from './files/extension-doc.png';
import EPS from './files/extension-eps.png';
import XLS from './files/extension-xls.png';
import EXE from './files/extension-exe.png';
import GIF from './files/extension-gif.png';
import MP3 from './files/extension-mp3.png';
import PDF from './files/extension-pdf.png';
import PPT from './files/extension-ppt.png';
import PSD from './files/extension-psd.png';
import SQL from './files/extension-sql.png';
import TXT from './files/extension-txt.png';
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    FILE_ICON: {
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
    }
}