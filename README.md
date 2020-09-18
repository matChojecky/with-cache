
# with-cache

  

with-cache is a simple library that allows you to create with basic composition a function which results will be memoized. You can use cache for any operation from more common like HTTP requests to less like operations that requires heavy computation.

[**Documentation**](https://matchojecky.github.io/with-cache/)

  

## Usage

Simplest case:
```javascript
import { withCache } from 'with-cache';
function heavyOperation(arg1, arg2) {
	//...do something
}
const heavyOperatuionWithCaching = withCache(heavyOperation);

//this call will run heavyOperation function
const result1 = heavyOperatuionWithCaching("pass", "secret");

//this call return previously cached value 
const result2 = heavyOperatuionWithCaching("pass", "secret");

```

  

`withCache` can also accept options as a second argument. [See docs](https://matchojecky.github.io/with-cache/interfaces/cacheoptions.html)

```javascript
import { withCache } from 'with-cache';

function heavyOperation(arg1, arg2) {
	//...do something
}
const customKeymaker = (arg1, arg2) => arg1 + arg2;

class CustomCache extends Map {}

const heavyOperatuionWithCaching = withCache(heavyOperation, {
	keymaker: customKeymaker,
	ttl: 420,
	cache: new CustomCache()
});

```