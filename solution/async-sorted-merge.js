"use strict";
const MinHeap = require("../lib/min-heap");

// Print all entries, across all of the *async* sources, in chronological order.

module.exports = async (logSources, printer) => {
  const minHeap = new MinHeap();
  const numberOfSources = logSources.length;
  const pendingPromises = new Array(numberOfSources);

  const fetchAndInsert = async (sourceIndex) => {
    try {
      const entry = await pendingPromises[sourceIndex];
      if (entry) {
        // Start fetching the next entry
        pendingPromises[sourceIndex] = logSources[sourceIndex].popAsync();
        minHeap.insert(entry.date, { entry, sourceIndex });
      } else {
        // Reflect drained status in the source promise array
        pendingPromises[sourceIndex] = null;
      }
    } catch (error) {
      console.error(`Error fetching from source ${sourceIndex}:`, error);
      pendingPromises[sourceIndex] = null;
    }
  };

  // Initialize the heap with the first entry from each source
  logSources.forEach((logSource, index) => {
    const lastEntry = logSource.last;
    if (lastEntry) {
      minHeap.insert(lastEntry.date, {
        entry: lastEntry,
        sourceIndex: index,
      });
      // Start fetching the next entry
      pendingPromises[index] = logSource.popAsync();
    } else {
      // In case the source starts empty
      pendingPromises[index] = null;
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

    // If our heap is running low, fetch from other sources
    if (minHeap.size() < numberOfSources / 2) {
      const activeSources = pendingPromises.filter((p) => p !== null);
      if (activeSources.length > 0) {
        await Promise.allSettled(
          activeSources.map((_, index) => fetchAndInsert(index))
        );
      }
    }
  }

  printer.done();

  return new Promise((resolve, reject) => {
    resolve(console.log("Async sort complete."));
  });
};

// Min heap maintains chronological order while processing async log sources.
// Entries are fetched asynchronously, minimizing blocking operations.
// Memory usage stays constant: one entry per source in the heap and promises array.
