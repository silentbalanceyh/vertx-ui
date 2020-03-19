export default (item = {}) => {
    let image;
    const {metadata} = item;
    if (metadata && metadata.image) {
        image = metadata.image;
    } else {
        image = '/img/ox/ci/' + item.identifier + ".png";
    }
    return image;
}