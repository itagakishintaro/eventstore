let es = {};

( () => {
  const url = 'http://127.0.0.1:2113/streams/todolist'

  /********** COMMANDS **********/
  // common function
  let command = ( todo, eventType, callback ) => {
    console.log( eventType, todolist );
    $.ajax( {
      type: 'POST',
      url,
      data: JSON.stringify( todo ),
      contentType: 'application/json',
      headers: {
        'ES-EventType': eventType
      }
    } ).done( d => {
      if ( callback ) {
        callback();
      }
    } );
  }

  // Add To Do
  es.addTodo = ( todo, showListItems ) => {
    command( todo, 'addTodo', showListItems );
  }

  // Toggle Done
  es.toggleDone = ( todo ) => {
    command( todo, 'toggleDone' );
  }

  // Delete To Do
  es.deleteTodo = ( todo ) => {
    command( todo, 'deleteTodo' );
  }

  /********** QUERY **********/
  // Get To Do List
  es.getTodolist = ( showListItems ) => {
      console.log( 'GET TODO LIST', todolist );
      let events = [];
      getEntriesPromise().then( ( d ) => {
        todolist = aggregate( d );
        showListItems();
      } );
    }
    /********** Aggregate **********/
    // aggregate todo list from events
  let aggregate = events => {
    let todolist = [];
    events = util.sortObjects( events, 'updated', true );
    events.forEach( e => {
      let data = JSON.parse( e.data );
      if ( e.eventType === 'addTodo' ) {
        todolist.push( data );
      } else if ( e.eventType === 'toggleDone' ) {
        todolist.map( todo => {
          console.log( 'HERE', todo.id, data.id );
          if ( todo.id === Number( data.id ) ) {
            todo.done = data.done;
          }
          return todo;
        } );
      } else if ( e.eventType === 'deleteTodo' ) {
        todolist = todolist.filter( todo => todo.id !== Number( data.id ) );
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
        url: url + '?embed=body',
        headers: {
          Accept: 'application/vnd.eventstore.atom+json'
        }
      } ).done( ( d ) => {
        console.log( 'EVENTS', d );
        resolve( d.entries );
      } );
    } );
  }

} )();