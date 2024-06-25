"use strict";
const MinHeap = require("../lib/min-heap");

// Print all entries, across all of the *async* sources, in chronological order.

module.exports = async (logSources, printer) => {
  const minHeap = new MinHeap();

  await Promise.all(
    logSources.map(async (logSource, index) => {
      const lastEntry = await logSource.last;
      if (lastEntry)
        minHeap.insert(lastEntry.date, {
          entry: lastEntry,
          sourceIndex: index,
        });
    })
  );

  while (minHeap.size()) {
    const {
      payload: { entry, sourceIndex },
    } = minHeap.extractMin();
    printer.print(entry);
    const nextEntry = await logSources[sourceIndex].popAsync();
    if (nextEntry)
      minHeap.insert(nextEntry.date, {
        entry: nextEntry,
        sourceIndex,
      });
  }

  printer.done();

  return new Promise((resolve, reject) => {
    resolve(console.log("Async sort complete."));
  });
};
