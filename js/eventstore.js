let es = {};

( () => {
  const url = 'http://127.0.0.1:2113/streams/todolist'

  /********** COMMANDS **********/
  // Add To Do
  es.addTodo = ( todo, showListItems, todolist ) => {
    console.log( 'ADD TODO', todolist );
    $.ajax( {
      type: 'POST',
      url,
      data: JSON.stringify( todo ),
      contentType: 'application/json',
      headers: {
        'ES-EventType': 'addTodo'
      }
    } ).done( d => {
      showListItems();
    } );
  }

  let toggleDone = () => {

  }

  /********** QUERY **********/
  // Get To Do List
  es.getTodolist = ( showListItems ) => {
      console.log( 'GET TODO LIST', todolist );
      let events = [];
      getEntriesPromise().then( ( entries ) => {
        Promise.all( getDataPromiseList( entries, events ) ).then( () => {
          todolist = aggregate( events );
          showListItems();
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
        url,
        headers: {
          Accept: 'application/vnd.eventstore.atom+json'
        }
      } ).done( ( d ) => {
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

} )();