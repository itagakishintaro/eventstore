let todolist = [];

( () => {
  let todolistVue;
  let eventstore = $( '#eventstore' ).prop( 'checked' );

  // Document Ready
  $( () => {
    // todolist data binding
    todolistVue = new Vue( {
      el: '#list',
      data: {
        todolist
      },
      methods: {
        toggleDone: event => {
          $( event.target ).next( 'label' ).toggleClass( "done" );
          toggleDone( event.target );
        },
        deleteTodo: event => {
          deleteTodo( event.target );
        }
      }
    } );
    // get and show list
    getAndShowList();

    // add event
    $( '#addTodo' ).on( 'click', () => {
      addTodo();
    } );
    // eventstore event
    $( '#eventstore' ).on( 'click', () => {
      console.log( 'TOGGLE EVENTSTORE' );
      eventstore = $( '#eventstore' ).prop( 'checked' );
      $( '#timemachine' ).toggle();
      getAndShowList();
    } );
    $( '#goBack' ).on( 'click', () => {
      getAndShowList( $( '#eventNumber' ).val() );
    } );
  } );

  // Get and show List
  let getAndShowList = ( eventNumber ) => {
    console.log( 'GET AND SHOW LIST', todolist );
    if ( eventstore ) { // eventstore
      es.getTodolist( showList, eventNumber );
    } else if ( localStorage.getItem( 'todolist' ) ) { // localstorage
      todolist = JSON.parse( localStorage.getItem( 'todolist' ) );
      showList();
    }
  }

  // Show List Items
  let showList = () => {
    console.log( 'SHOW LIST', todolist );
    todolist = util.sortObjects( todolist, 'id', false );
    todolistVue.todolist = todolist;
  }

  /*********** ACTIONS **********/
  // Add Todo
  let addTodo = () => {
    console.log( 'ADD TODO', todolist );
    let id = new Date().getTime();
    let todo = {
      id,
      title: $( '#newTodo' ).val(),
        done: false,
    };
    todolist.push( todo );
    if ( eventstore ) { // eventstore
      es.addTodo( todo, showList );
    } else { // localstorage
      localStorage.setItem( 'todolist', JSON.stringify( todolist ) );
      showList();
    }
  }

  // Toggle Done
  let toggleDone = target => {
    console.log( 'TOGGLE DONE', todolist );
    // data toggle
    todolist = todolist.map( ( v ) => {
      if ( v.id === Number( $( target ).attr( 'id' ) ) ) {
        v.done = !v.done;
      }
      return v;
    } );
    let todo = {
      id: $( target ).attr( 'id' ),
      done: $( target ).prop( 'checked' ),
    };
    if ( eventstore ) { // eventstore
      es.toggleDone( todo );
    } else { // localstorage
      localStorage.setItem( 'todolist', JSON.stringify( todolist ) );
    }
  }

  // Delete Todo
  let deleteTodo = target => {
    console.log( 'DELETE TODO', todolist );
    // view remove
    let id = $( target ).attr( 'data-id' );
    $( `#${id}` ).parents( 'li' ).remove();
    // data remove
    todolist = todolist.filter( ( v ) => v.id !== Number( id ) );
    let todo = {
      id,
    };
    if ( eventstore ) { // eventstore
      es.deleteTodo( todo );
    } else { // localstorage
      localStorage.setItem( 'todolist', JSON.stringify( todolist ) );
    }
  }

} )();