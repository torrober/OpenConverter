class Queue {
  constructor() {
    this.items = [];
  }

  // Add an element to the queue
  enqueue(element) {
    const existingElement = this.items.find(item => item.input === element.input);
    if (existingElement) {
      console.log(`An element with input '${element.input}' already exists in the queue.`);
    } else {
      this.items.push(element);
    }
  }
  list() {
    return this.items;
  }
  // Remove an element from the queue
  dequeue(){
    if (this.isEmpty()) {
      return "Underflow";
    }
    return this.items.shift();
  }

  // Get the front element of the queue
  front() {
    if (this.isEmpty()) {
      return "No elements in the queue";
    }
    return this.items[0];
  }

  // Check if the queue is empty
  isEmpty() {
    return this.items.length === 0;
  }

  // Get the size of the queue
  size() {
    return this.items.length;
  }

  // Clear the queue
  clear() {
    this.items = [];
  }
}

module.exports = Queue;
