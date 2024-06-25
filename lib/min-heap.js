"use strict";

class Node {
  constructor(value, payload = null) {
    this.value = value;
    this.payload = payload;
  }
}

module.exports = class MinHeap {
  constructor() {
    this.heap = [];
  }

  getParentIndex(index) {
    return Math.floor((index - 1) / 2);
  }

  getLeftChildIndex(index) {
    return index * 2 + 1;
  }

  getRightChildIndex(index) {
    return index * 2 + 2;
  }

  size() {
    return this.heap.length;
  }

  swap(indexA, indexB) {
    [this.heap[indexA], this.heap[indexB]] = [
      this.heap[indexB],
      this.heap[indexA],
    ];
  }

  bubbleUp(index) {
    let currentIndex = index;
    let parentIndex = this.getParentIndex(index);
    while (
      currentIndex > 0 &&
      this.heap[currentIndex].value < this.heap[parentIndex].value
    ) {
      this.swap(currentIndex, parentIndex);
      currentIndex = parentIndex;
      parentIndex = this.getParentIndex(currentIndex);
    }
  }

  insert(value, payload = null) {
    if (!value) return;
    this.heap.push(new Node(value, payload));
    this.bubbleUp(this.size() - 1);
  }

  bubbleDown(index) {
    let smallestIndex = index;
    const leftChildIndex = this.getLeftChildIndex(index);
    const rightChildIndex = this.getRightChildIndex(index);

    if (
      leftChildIndex < this.size() &&
      this.heap[leftChildIndex].value < this.heap[smallestIndex].value
    ) {
      smallestIndex = leftChildIndex;
    }

    if (
      rightChildIndex < this.size() &&
      this.heap[rightChildIndex].value < this.heap[smallestIndex].value
    ) {
      smallestIndex = rightChildIndex;
    }

    if (smallestIndex !== index) {
      this.swap(index, smallestIndex);
      this.bubbleDown(smallestIndex);
    }
  }

  extractMin() {
    if (this.size() === 0) return null;
    if (this.size() === 1) return this.heap.pop();
    const minNode = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.bubbleDown(0);
    return minNode;
  }
};
