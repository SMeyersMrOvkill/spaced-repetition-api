class _Node {
    constructor(value, next) {
        this.value = value;
        this.next = next;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
    }

    insertFirst(item) {
        this.head = new _Node(item, this.head);
    }
    
    insertLast(item) {
        if(this.head === null) {
            this.insertFirst(item);
        } else {
            let tempNode = this.head;
            while(tempNode.next !== null) {
                tempNode = tempNode.next;
            }
            tempNode.next = new _Node(item, null);
        }
    }

    insertBefore(item, before) {
        if(this.head === null) {
            return;
        }
        if(this.head.value === before) {
            this.insertFirst(item);
        } else {
            let currNode = this.head;
            let done = false;
            while(currNode.next !== null && !done) {
                if(currNode.next.value === before) {
                    currNode.next = new _Node(item, currNode.next);
                    done = true;
                }
                currNode = currNode.next;
            }
        }
    }

    insertLastArray(items) {
        for(let item of items) {
            this.insertLast(item);
        }
    }

    find(item) {
        let currNode = this.head;
        if(!this.head) {
            return null;
        }
        while(currNode.value !== item) {
            if(currNode.next === null) {
                return null;
            } else {
                currNode = currNode.next;
            }
        }
        return currNode;
    }

    remove(item) {
        if(!this.head) {
            return null;
        }
        if(this.head.value === item) {
            this.head = this.head.next;
            return;
        }
        let currNode = this.head;
        let previousNode = this.head;
        while((currNode !== null) && (currNode.value !== item)) {
            previousNode = currNode;
            currNode = currNode.next;
        }
        if(currNode === null) {
            console.log('Item not found');
            return;
        }
        previousNode.next = currNode.next;
    }

    moveWordBack(word, n) {
        if(n < 1) {
            return;
        }
        if(!this.head) {
            return;
        }
        let node = this.head;
        while (node !== null && node.value.original !== word.original) {
            node = node.next;
        }
        if(node === null) {
            node = new _Node(word, null);
        } else {
            let tmp = node.next;
            node.next = new _Node(word, tmp);
        }
        this.moveWordBack(word, n-1);
    }

    forEach(fn) {
        if(!this.head) {
            return;
        }
        let index = 0;
        let currNode = this.head;
        while(currNode !== null) {
            fn(currNode.value, index);
            currNode = currNode.next;
            index++;
        } 
    }

    print() {
        this.forEach((item, index) => {
            console.log(`[${index}]`, item);
        })
    }
}

module.exports = LinkedList;