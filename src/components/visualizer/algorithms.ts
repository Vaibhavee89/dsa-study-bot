import { AlgorithmStep } from "./types";

export function* bubbleSort(arr: number[]): Generator<AlgorithmStep> {
  const array = [...arr];
  const n = array.length;
  const sorted: number[] = [];

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      yield {
        array: [...array],
        comparing: [j, j + 1],
        sorted: [...sorted],
        description: `Comparing ${array[j]} and ${array[j + 1]}`,
      };

      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        yield {
          array: [...array],
          swapping: [j, j + 1],
          sorted: [...sorted],
          description: `Swapping ${array[j + 1]} and ${array[j]}`,
        };
      }
    }
    sorted.unshift(n - 1 - i);
  }
  sorted.unshift(0);

  yield {
    array: [...array],
    sorted: Array.from({ length: n }, (_, i) => i),
    description: "Array is sorted!",
  };
}

export function* selectionSort(arr: number[]): Generator<AlgorithmStep> {
  const array = [...arr];
  const n = array.length;
  const sorted: number[] = [];

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    for (let j = i + 1; j < n; j++) {
      yield {
        array: [...array],
        comparing: [minIdx, j],
        sorted: [...sorted],
        description: `Finding minimum: comparing ${array[minIdx]} and ${array[j]}`,
      };

      if (array[j] < array[minIdx]) {
        minIdx = j;
      }
    }

    if (minIdx !== i) {
      [array[i], array[minIdx]] = [array[minIdx], array[i]];
      yield {
        array: [...array],
        swapping: [i, minIdx],
        sorted: [...sorted],
        description: `Swapping ${array[minIdx]} to position ${i}`,
      };
    }

    sorted.push(i);
  }
  sorted.push(n - 1);

  yield {
    array: [...array],
    sorted: Array.from({ length: n }, (_, i) => i),
    description: "Array is sorted!",
  };
}

export function* insertionSort(arr: number[]): Generator<AlgorithmStep> {
  const array = [...arr];
  const n = array.length;
  const sorted: number[] = [0];

  for (let i = 1; i < n; i++) {
    const key = array[i];
    let j = i - 1;

    yield {
      array: [...array],
      comparing: [i],
      sorted: [...sorted],
      description: `Inserting ${key} into sorted portion`,
    };

    while (j >= 0 && array[j] > key) {
      yield {
        array: [...array],
        comparing: [j, j + 1],
        sorted: [...sorted],
        description: `Comparing ${array[j]} > ${key}`,
      };

      array[j + 1] = array[j];
      yield {
        array: [...array],
        swapping: [j, j + 1],
        sorted: [...sorted],
        description: `Shifting ${array[j]} right`,
      };
      j--;
    }

    array[j + 1] = key;
    sorted.push(i);
  }

  yield {
    array: [...array],
    sorted: Array.from({ length: n }, (_, i) => i),
    description: "Array is sorted!",
  };
}

export function* quickSort(arr: number[], low: number = 0, high: number = arr.length - 1, sorted: number[] = []): Generator<AlgorithmStep> {
  const array = [...arr];

  function* partition(arr: number[], low: number, high: number): Generator<AlgorithmStep, number, unknown> {
    const pivot = arr[high];
    let i = low - 1;

    yield {
      array: [...arr],
      pivot: high,
      sorted: [...sorted],
      description: `Pivot selected: ${pivot}`,
    };

    for (let j = low; j < high; j++) {
      yield {
        array: [...arr],
        comparing: [j, high],
        pivot: high,
        sorted: [...sorted],
        description: `Comparing ${arr[j]} with pivot ${pivot}`,
      };

      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        yield {
          array: [...arr],
          swapping: [i, j],
          pivot: high,
          sorted: [...sorted],
          description: `Swapping ${arr[j]} and ${arr[i]}`,
        };
      }
    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    yield {
      array: [...arr],
      swapping: [i + 1, high],
      sorted: [...sorted],
      description: `Placing pivot ${pivot} at correct position`,
    };

    return i + 1;
  }

  function* quickSortHelper(arr: number[], low: number, high: number): Generator<AlgorithmStep> {
    if (low < high) {
      const pi = yield* partition(arr, low, high);
      sorted.push(pi);
      yield* quickSortHelper(arr, low, pi - 1);
      yield* quickSortHelper(arr, pi + 1, high);
    } else if (low === high) {
      sorted.push(low);
    }
  }

  yield* quickSortHelper(array, low, high);

  yield {
    array: [...array],
    sorted: Array.from({ length: array.length }, (_, i) => i),
    description: "Array is sorted!",
  };
}

export function* mergeSort(arr: number[]): Generator<AlgorithmStep> {
  const array = [...arr];
  const n = array.length;
  const sorted: number[] = [];

  function* mergeSortHelper(arr: number[], left: number, right: number): Generator<AlgorithmStep> {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      yield* mergeSortHelper(arr, left, mid);
      yield* mergeSortHelper(arr, mid + 1, right);
      yield* merge(arr, left, mid, right);
    }
  }

  function* merge(arr: number[], left: number, mid: number, right: number): Generator<AlgorithmStep> {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);

    yield {
      array: [...arr],
      comparing: Array.from({ length: right - left + 1 }, (_, i) => left + i),
      sorted: [...sorted],
      description: `Merging subarrays [${leftArr}] and [${rightArr}]`,
    };

    let i = 0, j = 0, k = left;

    while (i < leftArr.length && j < rightArr.length) {
      yield {
        array: [...arr],
        comparing: [left + i, mid + 1 + j],
        sorted: [...sorted],
        description: `Comparing ${leftArr[i]} and ${rightArr[j]}`,
      };

      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i];
        i++;
      } else {
        arr[k] = rightArr[j];
        j++;
      }
      k++;
    }

    while (i < leftArr.length) {
      arr[k] = leftArr[i];
      i++;
      k++;
    }

    while (j < rightArr.length) {
      arr[k] = rightArr[j];
      j++;
      k++;
    }

    yield {
      array: [...arr],
      sorted: [...sorted],
      description: `Merged: [${arr.slice(left, right + 1)}]`,
    };
  }

  yield* mergeSortHelper(array, 0, n - 1);

  yield {
    array: [...array],
    sorted: Array.from({ length: n }, (_, i) => i),
    description: "Array is sorted!",
  };
}

export function* binarySearch(arr: number[], target: number): Generator<AlgorithmStep> {
  const array = [...arr].sort((a, b) => a - b);
  let left = 0;
  let right = array.length - 1;

  yield {
    array,
    sorted: Array.from({ length: array.length }, (_, i) => i),
    description: `Searching for ${target} in sorted array`,
  };

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    yield {
      array,
      comparing: [mid],
      sorted: Array.from({ length: array.length }, (_, i) => i),
      description: `Checking middle element: ${array[mid]}`,
    };

    if (array[mid] === target) {
      yield {
        array,
        found: mid,
        sorted: Array.from({ length: array.length }, (_, i) => i),
        description: `Found ${target} at index ${mid}!`,
      };
      return;
    }

    if (array[mid] < target) {
      yield {
        array,
        comparing: Array.from({ length: right - mid }, (_, i) => mid + 1 + i),
        sorted: Array.from({ length: array.length }, (_, i) => i),
        description: `${target} > ${array[mid]}, searching right half`,
      };
      left = mid + 1;
    } else {
      yield {
        array,
        comparing: Array.from({ length: mid - left }, (_, i) => left + i),
        sorted: Array.from({ length: array.length }, (_, i) => i),
        description: `${target} < ${array[mid]}, searching left half`,
      };
      right = mid - 1;
    }
  }

  yield {
    array,
    sorted: Array.from({ length: array.length }, (_, i) => i),
    description: `${target} not found in array`,
  };
}

export function* linearSearch(arr: number[], target: number): Generator<AlgorithmStep> {
  const array = [...arr];

  yield {
    array,
    description: `Searching for ${target}`,
  };

  for (let i = 0; i < array.length; i++) {
    yield {
      array,
      comparing: [i],
      description: `Checking index ${i}: ${array[i]}`,
    };

    if (array[i] === target) {
      yield {
        array,
        found: i,
        description: `Found ${target} at index ${i}!`,
      };
      return;
    }
  }

  yield {
    array,
    description: `${target} not found in array`,
  };
}
