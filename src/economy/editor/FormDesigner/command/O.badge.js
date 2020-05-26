export default {
    "eye-invisible": (reference) => {
        const {raft = {}} = reference.state;
        if (raft.form) {
            const hidden = raft.form.hidden ? raft.form.hidden : [];
            return hidden.length;
        } else return 0;
    }
}