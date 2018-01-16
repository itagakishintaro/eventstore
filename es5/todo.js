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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

todolist = [];

(function () {
  var eventstore = $('#eventstore').prop('checked');

  // Document Ready
  $(function () {
    showList();
    // eventstore event
    $('#eventstore').on('click', function () {
      eventstore = $('#eventstore').prop('checked');
      $('#timemachine').toggle();
      showList();
    });
    // add event
    $('#addTodo').on('click', function () {
      addTodo();
    });
    $('#goBack').on('click', function () {
      showList($('#eventNumber').val());
    });
  });

  // Clear List
  var clearList = function clearList() {
    return $('#list ul').empty();
  };

  // Show List
  var showList = function showList(eventNumber) {
    console.log('SHOW LIST', todolist);
    es.getTodolist(showListItems, eventNumber);
  };

  // Show List Items
  var showListItems = function showListItems() {
    console.log('SHOW LIST ITEMS', todolist);
    clearList();
    todolist = util.sortObjects(todolist, 'id', false);
    todolist.forEach(function (v) {
      var item = '\n            <li class="mdl-list__item">\n              <span class="mdl-list__item-primary-content">\n                <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="' + v.id + '">\n                  <input type="checkbox" id="' + v.id + '" class="mdl-checkbox__input todo" ' + (v.done ? 'checked' : '') + ' />\n                  <span class="mdl-checkbox__label ' + (v.done ? 'done' : '') + '">' + v.title + '</span>\n                </label>\n              </span>\n              <span class="mdl-list__item-secondary-action">\n                <span class="del" data-id="' + v.id + '">\n                  <i class="material-icons">delete</i>\n                  </span>\n              </span>\n            </li>\n          ';
      $('#list ul').append(item);
    });
    setEvents();
  };

  // Set Events
  var setEvents = function setEvents() {
    // toggle
    $('.todo').on('click', function () {
      $(this).next('span').toggleClass("done");
      toggleDone(this);
    });
    // delete
    $('.del').on('click', function () {
      deleteTodo(this);
    });
  };

  /*********** ACTIONS **********/
  // Add Todo
  var addTodo = function addTodo() {
    console.log('ADD TODO', todolist);
    var id = new Date().getTime();
    var todo = {
      id: id,
      title: $('#newTodo').val(),
      done: false
    };
    todolist.push(todo);
    es.addTodo(todo, showListItems);
  };

  // Toggle Done
  var toggleDone = function toggleDone(target) {
    console.log('TOGGLE DONE', todolist);
    // data toggle
    todolist = todolist.map(function (v) {
      if (v.id === Number($(target).attr('id'))) {
        v.done = !v.done;
      }
      return v;
    });
    var todo = {
      id: $(target).attr('id'),
      done: $(target).prop('checked')
    };
    es.toggleDone(todo);
  };

  // Delete Todo
  var deleteTodo = function deleteTodo(target) {
    console.log('DELETE TODO', todolist);
    // view remove
    var id = $(target).attr('data-id');
    $('#' + id).parents('li').remove();
    // data remove
    todolist = todolist.filter(function (v) {
      return v.id !== Number(id);
    });
    var todo = {
      id: id
    };
    es.deleteTodo(todo);
  };
})();

/***/ })
/******/ ]);
//# sourceMappingURL=todo.js.map