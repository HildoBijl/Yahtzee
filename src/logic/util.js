

// getJSON is like jQuery's getJSON but instead returns a promise, obtained through the fetch function.
export function getJSON(filename) {
	return fetch(new Request(filename, {
		method: 'GET',
		headers: {}
	})).then((data) => data.json())
}

// createAscendingArray creates an array having the numbers [min, min+1, ..., max-1, max].
export function createAscendingArray(min, max) {
  return Array.apply(null, {length: max - min + 1}).map((v,i) => i + min)
}
