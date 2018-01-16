es = {};

( () => {
  const streamUrl = 'http://127.0.0.1:2113/streams/todolist'

  /********** COMMANDS **********/
  // common function
  let command = ( todo, eventType, callback ) => {
    console.log( eventType, todolist );
    $.ajax( {
      type: 'POST',
      url: streamUrl,
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
  es.getTodolist = ( showListItems, eventNumber ) => {
      let events = [];
      getEntriesPromise( streamUrl + '/0/forward/100?embed=body', [] ).then( e => {
        let max = Math.max.apply( null, e.map( o => {
          return o.eventNumber;
        } ) );
        $( '#maxEventNumber' ).text( max );

        let filtered = e;
        if ( eventNumber ) {
          filtered = e.filter( data => {
            return data.eventNumber <= eventNumber;
          } );
        }
        todolist = aggregate( filtered );
        showListItems();
      } );
    }
    /********** Aggregate **********/
    // aggregate todo list from events
  let aggregate = events => {
    console.log( 'AGGREGATE', events );
    let todolist = [];
    events = util.sortObjects( events, 'updated', true );
    events.forEach( e => {
      let data = JSON.parse( e.data );
      if ( e.eventType === 'addTodo' ) {
        todolist.push( data );
      } else if ( e.eventType === 'toggleDone' ) {
        todolist.map( todo => {
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
  let getEntriesPromise = ( url, entries ) => {
    return new Promise( ( resolve, reject ) => {
      $.ajax( {
        type: 'GET',
        url,
        headers: {
          Accept: 'application/vnd.eventstore.atom+json',
        },
      } ).done( ( d ) => {
        let previous = d.links.filter( v => v.relation === 'previous' )[ 0 ];
        if ( previous ) {
          getEntriesPromise( previous.uri + '?embed=body', entries.concat( d.entries ) ).then( d => {
            resolve( d );
          } );
        } else {
          resolve( entries.concat( d.entries ) );
        }
      } );
    } );
  }

} )();
