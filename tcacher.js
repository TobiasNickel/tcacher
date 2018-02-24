const tcacher = module.exports;

tcacher.toCachingFunction = function(method, options) {
    if (!options) options = {};
    const resultProp = options.resultProp || 'id';
    const listIndex = options.listIndex || 0;

    var nextTasks = {};
    var waitings = {};
    return function() {
        if (Object.keys(arguments).length > (listIndex + 1)) {
            return method.apply(this, arguments)
        }
        var args = arguments[listIndex];

        if (!Array.isArray(args)) args = [args];
        var deffer = getDeffer();

        var hash = JSON.stringify(getFirstItems(listIndex, arguments));
        if (!nextTasks[hash]) {
            nextTasks[hash] = [];
        }
        nextTasks[hash].push({
            args: args,
            deffer: deffer,
            context: this
        });
        apply(hash);

        return deffer;
    }

    function apply(hash) {
        if ((!waitings[hash]) && nextTasks[hash] && nextTasks[hash].length) {
            waitings[hash] = true
            process.nextTick(function() {
                var tasks = nextTasks[hash];
                delete nextTasks[hash];
                var args = [];
                var context;
                tasks.forEach(function(task) {
                    context = task.context;
                    task.args.forEach(function(arg) {
                        if (args.indexOf(arg) === -1) {
                            args.push(arg);
                        }
                    });
                });
                method.apply(context, [args]).then(function(results) {
                    delete waitings[hash];
                    apply(hash);
                    var resultIndex = {};
                    var resultPropName = resultProp;
                    // allow idName to be in argumentList
                    if (typeof resultProp === 'number') {
                        resultPropName = tasks[0].args[resultProp]
                    }
                    results.forEach(function(r) {
                        if (!resultIndex[r[resultPropName]]) resultIndex[r[resultPropName]] = [];
                        resultIndex[r[resultPropName]].push(r);
                    });
                    tasks.forEach(function(tasks) {
                        var result = [];
                        tasks.args.forEach(function(arg) {
                            var r = resultIndex[arg];
                            if (r) {
                                result = result.concat(r);
                            }
                        });
                        tasks.deffer.resolve(clone(result));
                    });
                    return results;
                }).catch(function(err) {
                    delete waitings[hash];
                    apply(hash);
                    tasks.forEach(function(task) {
                        task.deffer.reject(err);
                    });
                });
            });
        }
    }
}

function getFirstItems(num, args) {
    var out = [];
    for (var i = 0; i < num; i++) {
        out.push(args[i]);
    }
    return out;
}

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function getDeffer() {
    var resolve;
    var reject
    var p = new Promise(function(res, rej) {
        resolve = res;
        reject = rej;
    });
    p.resolve = resolve;
    p.reject = reject;
    return p;
};