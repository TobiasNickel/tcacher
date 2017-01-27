const tcacher = require('./tcacher');


const operator = {
    used:false,
    slowTask:function(ids){
        if(this !== operator){
            console.log('context is global',this===global);
            throw new Error('this is not operator')
        }
        if(this.used){
            throw new Error('operator already used')
        }
        this.used = true;
        if(!Array.isArray(ids)){ ids = [ids]; }
        return new Promise(function(resolve){
            setTimeout(function(){
                resolve(ids.map(function(id){
                    return {
                        id:id,
                        name:'tobi_'+id,
                    }
                }))
            },1)
        });
    }
}


operator.slowTask = tcacher.toCachingFunction(operator.slowTask);

operator.slowTask(123).then(function(results){
    console.assert(JSON.stringify(results)==='[{"id":123,"name":"tobi_123"}]');
    console.log('test1 done')
}).catch(function(err){console.log(err);});

operator.slowTask(121).then(function(results){
    console.assert(JSON.stringify(results)==='[{"id":121,"name":"tobi_121"}]');
    console.log('test2 done')
}).catch(function(err){console.log(err);});

operator.slowTask(123).then(function(results){
    console.assert(JSON.stringify(results)==='[{"id":123,"name":"tobi_123"}]');
    console.log('test1 repeat done')
}).catch(function(err){console.log(err);});
