app.factory("Event", function($http) {
    function Event(eventObj) {
        var event = eventObj;

        var update = function(eventObj) {
            if (eventObj) {
                for (var key in eventObj) {
                    // Skip if property is from prototype
                    if(!eventObj.hasOwnProperty(key)) continue;
                    event[key] = eventObj[key];
                }
            }
        };

        var save = function() {
            console.log("save function called");
            return (
                $http
                .post('/api/events/create', {event})
            );
        };
        return {
            event,
            update,
            save
        };

        //
        // var list = [];
        // var pristine = [];
        // var add = function(obj) {
        //     list.push(obj);
        // };
        //
        // var get = function(i) {
        //     if(validIndex(i))
        //     return list[i];
        // };
        //
        // var last = function() {
        //     return list[list.length-1];
        // };
        //
        // var remove = function(i) {
        //     if(validIndex(i))
        //     return list.splice(i,1).length;
        //     return false;
        // };
        //
        // var all = function() {
        //     return list;
        // };
        //
        // var create = function(obj) {
        //     list = obj;
        //     pristine = angular.copy(obj);
        // };
        //
        // var validIndex = function(i) {
        //     if(!list.length) return false;
        //     if(i===0) return !!list.length;
        //     return i && i<list.length && i>=0;
        // };
        //
        // var set = function(i, obj) {
        //     if(validIndex(i)) {
        //         for(var key in obj) {
        //             list[i][key] = obj[key];
        //         }
        //     }
        // };
        //
        // var size = function() {
        //     return list.length;
        // };
        // var resetPristineObject = function() {
        //     pristine = angular.copy(list);
        // };
        //
        // return {
        //     add,
        //     set,
        //     get,
        //     last,
        //     remove,
        //     all,
        //     create,
        //     validIndex,
        //     size,
        //     resetPristineObject,
        //     isPristine: function() {
        //         if(list.length !== pristine.length) return false;
        //         return angular.equals(list, pristine);
        //     }
        // };
    }
    return Event;
});
