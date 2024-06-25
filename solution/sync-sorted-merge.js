"use strict";
const MinHeap = require("../lib/min-heap");

// Print all entries, across all of the sources, in chronological order.

module.exports = (logSources, printer) => {
  const minHeap = new MinHeap();

  logSources.forEach((logSource, index) => {
    // Inserts the last log entry of each source into the MinHeap based on the entry's date.
    const lastEntry = logSource.last;
    if (lastEntry)
      minHeap.insert(lastEntry.date, {
        entry: lastEntry,
        sourceIndex: index,
      });
  });

  while (minHeap.size()) {
    // Repeatedly extracts the minimum (earliest) entry from the heap and prints it.
    const {
      payload: { entry, sourceIndex },
    } = minHeap.extractMin();
    printer.print(entry);
    // Fetches and inserts the next log entry from the same source into the MinHeap.
    const nextEntry = logSources[sourceIndex].pop();
    if (nextEntry)
      minHeap.insert(nextEntry.date, {
        entry: nextEntry,
        sourceIndex,
      });
  }

  printer.done();

  return console.log("Sync sort complete.");
};

// About my solution
// For k log sources entries and n entries
// Efficiency: O(log n) for insertion and extraction due to MinHeap.
// Scalability: Memory scales with sources not entries.
// Time Complexity: O(n log k).
// Space Complexity: O(k), only needs space for heap proportional to number of sources.
