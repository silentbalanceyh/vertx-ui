export default (to = {}, from = {}, field) => {
    if (from[field]) {
        to.optionJsx[field] = from[field];
    }
}