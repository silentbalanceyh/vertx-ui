export default {
    // Base64 / Blob
    valueBlob: (imageData = "") => {
        const attr = imageData.split(",");
        const mime = attr[0].match(/:(.*?);/)[1];
        const bytes = window.atob(attr[1]);
        let len = bytes.length;
        const u8arr = new Uint8Array(len);
        while (len--) {
            u8arr[len] = bytes.charCodeAt(len);
        }
        return new Blob([u8arr], {type: mime});
    }
}