#tcacher

## history
In first place, I often implement methods in nodejs that manipulate one item. My team then often want me, to provide the same functionality as list operation, for optimization purpose. Code that does list operations is much faster, because it reduces a lot the amount of queries to the database. I found that pattern in a few places. And I wanted to do that optimization, without writing code for list operations. At some point I got the idea to write the query function in a way it will not execute the query immediately, but collect a few, execute once and fulfill the promisees at once.

Describing this optimization to my team, I called it "query caching" or "request caching". Because I was not caching the result, but collected the request promisees. I also found some talk on programming languages and compiler optimizations. There was spoken about "lazy evaluation". So on a (meetup)[https://www.meetup.com/Shanghai-JavaScript/events/239208884/] I was asking the audience how they would name such a technique. I also proposed to them "lazy execution".

Starting to work in a new company, learning (graphQL)[http://graphql.org/] I found that people at facebook had the same problem as me. They named it "batching". Their node module to implement that is (dataloader)[https://www.npmjs.com/package/dataloader]. 

## compared to dataloader
 - DataLoader creates a dataloader object for every method.
 - tcacher uses higher order functions 
 - DataLoader also does caching (store results, in memory)
 - tcacher believe that should be done by other libraries.
 - DataLoader require you to sort the result set.
 - tcacher map the results my an object key.
 - DataLoader developed by facebook
 - tcacher is a personal project
 - DataLoader 300 lines of code
 - tcacher 100 lines of code
 
```js
/* listing 1 */
// some caching sql query function
function query(sql){
    return cache.get(sql).then(function(res){
        if(res){
            return res;
        }
        return db.query(sql).then(function(res){
            cash.set(sql, res);
            return res;
        });
    });
}
```
That is useful if your program executes the same 'SELECT' on a database very frequently but the data changes very seldom. So the drawback is, that your application might work with old data from the cache and you have to figure out to how to clear the cache properly. This is what this library NOT does.

**toCachingFunction** will help you to implement request caching. So the advantage will be, that your application will always work with the newest state. The second, this one method works for SQL, http, mongo, redis, actually any method/protocol that does request-response and is able to be used via promisees.

Let's visualize the functionality on some example:
```js
/* listing 2 */
var userDAO = {
    /**
     * takes ids
     * return promise that resolves to:
     *      a list of users, corresponding to the given ids
     */
    getById: function(ids){
        return db.sql('select * from users where id in (?)');
    }
}
```
This is simple, any web application will have users and has to query them frequently from the database. Now this function will execute the select-statement very often. In a social media app, you would have similar data sources for posts, comments, likes, ... This type of methods is specially often used when fetching related data.

note: The tcacher is not specially made for SQL, it will work the same way with Mongo, redis or any other data source.

The following code will execute the query on the database server three times.
```js
/* listing 3 */
userDAO.getById(1).then(/* ... */);
userDAO.getById(2).then(/* ... */);
userDAO.getById(3).then(/* ... */);
```

When using the tcacher like this:
```js
/* listing 4 */
userDAO.getById = tcacher.toCachingFunction(userDAO.getById);
```
and executing the code from listing 3, the sql query will only execute once. By reducing the number of queries you will reduce the amount of networking overhead, reduce the number of iterations through the database collection. 


## API
```
.toCachingFunction(method, options) : function
    takes a function and return a function
    the returned function is a batching version
    options:
        - resultProp, property name that is used to map the resulting items back to the callback, default 'id'.
        - listIndex, of the property, that identifies position in the arguments, default 0.
        - delay, milliseconds to wait, default 0, use process.nextTick
```

With the *listIndex* function, you will define on what position of the methods arguments is the IDs
parameter. Arguments that are before that, will only be cached, if they match completely. If the
method is called with arguments after the IDs parameter, there will be no caching. So the first 
parameters should be used for general information. Arguments after the list of IDs is good to use for 
more options like, paging, transaction and order-control.


# Developer
Tobias Nickel, german software engineer located in Shanghai.

![alt text](https://avatars1.githubusercontent.com/u/4189801?s=150)