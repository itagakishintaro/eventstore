const esURL = 'http://127.0.0.1:2113'
const stream = 'todolist'

/********** COMMANDS **********/
// Add To Do
let addTodoES = ( todo, showList ) => {
  let postTodoPromise = new Promise( ( resolve, reject ) => {
    $.ajax( {
      type: 'POST',
      url: esURL + '/streams/' + stream,
      data: JSON.stringify( todo ),
      contentType: 'application/json',
      headers: {
        'ES-EventType': 'addTodo'
      }
    } ).done( d => {
      resolve();
      console.log( 'ADD SUCCEED', d );
    } );
  } );
  postTodoPromise.then( () => {
    console.log( 'CALL showList' );
    showList();
  } );
}

let toggleDoneES = () => {

}

/********** QUERY **********/
// Get To Do List
let getTodolistES = ( showListItems ) => {
    let events = [];
    getEntriesPromise().then( ( entries ) => {
      Promise.all( getDataPromiseList( entries, events ) ).then( () => {
        console.log( events );
        let todolist = aggregate( events );
        showListItems( todolist );
      } );
    } );
  }
  /********** Aggregate **********/
  // aggregate todo list from events
let aggregate = events => {
  let todolist = [];
  events.forEach( e => {
    if ( e.content.eventType === 'addTodo' ) {
      todolist.push( e.content.data );
    } else if ( e.content.eventType === 'toggleDone' ) {
      todolist.map( todo => {
        if ( todo.id === e.content.data.id ) {
          todo.done = e.content.data.done;
        }
        return todo;
      } );
    } else if ( e.content.eventType === 'deleteTodo' ) {
      todolist = todolist.filter( todo => todo.id !== e.content.data.id );
    }
  } );
  return todolist;
}

/********** HELPERS **********/
// Get Entries Promise
let getEntriesPromise = () => {
  return new Promise( ( resolve, reject ) => {
    $.ajax( {
      type: 'GET',
      url: esURL + '/streams/' + stream,
      headers: {
        Accept: 'application/vnd.eventstore.atom+json'
      }
    } ).done( ( d ) => {
      console.log( 'GOT ENTRIES', d );
      resolve( d.entries );
    } );
  } );
}

// Get  Data of All Entries
let getDataPromiseList = ( entries, events ) => {
  let list = [];
  entries.forEach( v => {
    list.push( new Promise( ( resolve, reject ) => {
      $.ajax( {
        type: 'GET',
        url: v.id,
        headers: {
          Accept: 'application/vnd.eventstore.atom+json'
        }
      } ).done( d => {
        events.push( d );
        resolve();
      } );
    } ) );
  } );
  return list;
}