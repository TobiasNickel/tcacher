# tcacher
general purpose library for query batching.

## history
In first place, I often implement methods in nodejs that manipulate one item. My team wanted then often from me, to provide the same functionality as list operation, for optimization purpose. Code that handels does list operations is much faster, because in reduces a lot the amount of queries to the database. I found that pattern in a few places. And I wanted to do that optimization, without writing code for list operations. At some point I got the idea to write the query function in a way it will not execute the query imidietly but collect a few, execute once and fulfill the promisses at once.

Describing this optimization to my team, I called it "query caching" or "request caching". because I was not caching the result, but collected the request promisses. I also found some talk on programming languages and compiler optimizations. There was spoken about "lazy evaluation". So on a (meetup)[https://www.meetup.com/Shanghai-JavaScript/events/239208884/] I was asking the audience how they would name such a technique. I also proposed to them "lazy execution".

Starting to work in a new company, learning (graphQL)[http://graphql.org/] I found that people at facebook had the same questions as me. They named it "batching". There node module to implement that is (dataloader)[https://www.npmjs.com/package/dataloader]. 

## compared to dataloader
 - dataloader creates a dataloader object for every method.
 - tcacher uses higher order functions 
 - DataLoader also does caching (store results, in memory)
 - tcacher believe that should be done in other libraries.
 - DataLoader developed by facebook
 - tcacher is a personal project
 - DataLoader 300 lines of code
 - tcacher 100 lines of code

## API
This module exports only the function ``toCachingFunction``.
```js
var batchingVersionOfMethod = tcacher.toCachingFunction(method, options)
```

- ``method`` would be a method like "getUsersById". It takes one or more Ids and will return a promise that will get users o that id. 
- ``batchingVersionOfMethod`` will do the same, but wait for other calles of itself, to reduce the number of queries to the database.
- ``options``: 
  - ``listIndex`` you might not want to cache on the first argument, but second. than set this option to 1.
    for this example it might be usefull when you want to query only users by mail in a certain domain. ``getUserById(domain, id)``
  - ''resultProp'' the method to optimise need to return a promise that will fulfilled with objects. resultProp will be used to map the correct elements back to the requesting promise. (default is 'id')

The get userById method can still use parameter behind the id position of the paremeters. They are usefull for paging, sorting or transactions. When the batchingVersionOfMethod is called with extra parameter, it will directly execute the original method and not try to do optimization.


## Developer
[Tobias Nickel](http://tnickel.de/) German software developer in Shanghai. 
![alt text](https://avatars1.githubusercontent.com/u/4189801?s=150) 
