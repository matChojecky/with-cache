# with-cache

with-cache is a simple library that allows you to compose a function that will cache it's result. You can use  cache for any operation from more common like HTTP requests to less like operations that requires heavy computation. with-cache is promise based. Returning Promise from wrapped function.


## Usage
Simplest case:
```
	import withCache from 'with-cache';
	function fetchSomething(
		idToFetch,
		urlToFetch,
		whatEver
	) {
		...do something
	}
	
	const wrappedFecthSomething = withCache(fetchSomething);
```

`withCache` can also accept second argument that are options.
```
{
	validFor?:  number; // value accepted in MS, defaults to 12 hours
	keyGen?: (...args) =>  string;
}
```
If you want to cache many results you can pass keyGen function to options, this funtion should accept same arguments as you function you are wrapping as they are passed to it during key evaluation.

### Example:
```
import withCache from 'with-cache';
function fetchSomething(
	idToFetch,
	urlToFetch,
	whatEver
) {
	...do something
}

// This allows for caching multiple responses
function getCacheKey(
	idToFetch,
	urlToFetch,
	whatEver
) {
	return idToFetch
}
	
const wrappedFecthSomething = withCache(fetchSomething, { keyGen: getCacheKey });
``` 