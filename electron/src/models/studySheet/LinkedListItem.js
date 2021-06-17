class LinkedListItem {
    constructor(data) {
        this.next = null;
        this.data = data;
    }

    addNext(next) {
        this.next = next;
    }
}

module.exports = LinkedListItem;
