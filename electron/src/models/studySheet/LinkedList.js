class LinkedList {
    constructor(head) {
        this.head = head;
    }

    iterNext() {
        if (this.head) return this.head.next;
    }

    addHead(head) {
        this.head = head;
    }

    size() {
        let size = 0;
        let item = this.head;

        while (item.next) {
            size++;
            item = item.next;
        }

        return size;
    }

    getFirst() {
        return this.head;
    }

    getLast() {
        let lastItem = this.head;

        while (lastItem.next) {
            lastItem = lastItem.next;
        }

        return lastItem;
    }

    clear() {
        this.head = null;
    }
}

module.exports = LinkedList;
