/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ({

/***/ 2:
/***/ (function(module, exports) {

es = {};

(function () {
  var streamUrl = 'http://127.0.0.1:2113/streams/todolist';

  /********** COMMANDS **********/
  // common function
  var command = function command(todo, eventType, callback) {
    console.log(eventType, todolist);
    $.ajax({
      type: 'POST',
      url: streamUrl,
      data: JSON.stringify(todo),
      contentType: 'application/json',
      headers: {
        'ES-EventType': eventType
      }
    }).done(function (d) {
      if (callback) {
        callback();
      }
    });
  };

  // Add To Do
  es.addTodo = function (todo, showListItems) {
    command(todo, 'addTodo', showListItems);
  };

  // Toggle Done
  es.toggleDone = function (todo) {
    command(todo, 'toggleDone');
  };

  // Delete To Do
  es.deleteTodo = function (todo) {
    command(todo, 'deleteTodo');
  };

  /********** QUERY **********/
  // Get To Do List
  es.getTodolist = function (showListItems, eventNumber) {
    var events = [];
    getEntriesPromise(streamUrl + '/0/forward/100?embed=body', []).then(function (e) {
      var max = Math.max.apply(null, e.map(function (o) {
        return o.eventNumber;
      }));
      $('#maxEventNumber').text(max);

      var filtered = e;
      if (eventNumber) {
        filtered = e.filter(function (data) {
          return data.eventNumber <= eventNumber;
        });
      }
      todolist = aggregate(filtered);
      showListItems();
    });
  };
  /********** Aggregate **********/
  // aggregate todo list from events
  var aggregate = function aggregate(events) {
    console.log('AGGREGATE', events);
    var todolist = [];
    events = util.sortObjects(events, 'updated', true);
    events.forEach(function (e) {
      var data = JSON.parse(e.data);
      if (e.eventType === 'addTodo') {
        todolist.push(data);
      } else if (e.eventType === 'toggleDone') {
        todolist.map(function (todo) {
          if (todo.id === Number(data.id)) {
            todo.done = data.done;
          }
          return todo;
        });
      } else if (e.eventType === 'deleteTodo') {
        todolist = todolist.filter(function (todo) {
          return todo.id !== Number(data.id);
        });
      }
    });
    return todolist;
  };

  /********** HELPERS **********/
  // Get Entries Promise
  var getEntriesPromise = function getEntriesPromise(url, entries) {
    return new Promise(function (resolve, reject) {
      $.ajax({
        type: 'GET',
        url: url,
        headers: {
          Accept: 'application/vnd.eventstore.atom+json'
        }
      }).done(function (d) {
        var previous = d.links.filter(function (v) {
          return v.relation === 'previous';
        })[0];
        if (previous) {
          getEntriesPromise(previous.uri + '?embed=body', entries.concat(d.entries)).then(function (d) {
            resolve(d);
          });
        } else {
          resolve(entries.concat(d.entries));
        }
      });
    });
  };
})();

/***/ })

/******/ });
//# sourceMappingURL=eventstore.js.map