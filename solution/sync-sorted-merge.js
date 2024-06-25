"use strict";
const MinHeap = require("../lib/min-heap");

// Print all entries, across all of the sources, in chronological order.

module.exports = (logSources, printer) => {
  const minHeap = new MinHeap();

  logSources.forEach((logSource, index) => {
    const lastEntry = logSource.last;
    if (lastEntry)
      minHeap.insert(lastEntry.date, {
        entry: lastEntry,
        sourceIndex: index,
      });
  });

  while (minHeap.size()) {
    const {
      payload: { entry, sourceIndex },
    } = minHeap.extractMin();
    printer.print(entry);
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
