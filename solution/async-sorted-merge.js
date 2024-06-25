"use strict";
const MinHeap = require("../lib/min-heap");

// Print all entries, across all of the *async* sources, in chronological order.

module.exports = async (logSources, printer) => {
  const minHeap = new MinHeap();

  const fetchAndInsert = async (sourceIndex) => {
    const nextEntry = await logSources[sourceIndex].popAsync();
    if (sourceIndex)
      minHeap.insert(nextEntry.date, {
        entry: nextEntry,
        sourceIndex,
      });
  };

  // Initialize the heap with the first entry from each source
  logSources.forEach((logSource, index) => {
    const lastEntry = logSource.last;
    if (lastEntry) {
      minHeap.insert(lastEntry.date, {
        entry: lastEntry,
        sourceIndex: index,
      });
    }
  });

  while (minHeap.size()) {
    // Repeatedly extracts the minimum (earliest) entry from the heap and prints it.
    const {
      payload: { entry, sourceIndex },
    } = minHeap.extractMin();
    printer.print(entry);

    // Fetch next entry from the source we just printed from
    await fetchAndInsert(sourceIndex);
  }

  printer.done();

  return new Promise((resolve, reject) => {
    resolve(console.log("Async sort complete."));
  });
};
