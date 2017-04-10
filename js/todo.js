( () => {
  let todolist = [];
  let eventstore = $( '#eventstore' ).prop( 'checked' );

  // Document Ready
  $( () => {
    todolist = showList();
    // eventstore event
    $( '#eventstore' ).on( 'click', () => {
      eventstore = $( '#eventstore' ).prop( 'checked' );
      showList();
    } );
    // add event
    $( '#addTodo' ).on( 'click', () => {
      addTodo( todolist )
    } );
  } );

  // Clear List
  let clearList = () => $( '#list ul' ).empty();

  // Show List
  let showList = () => {
    clearList();
    let todolist = [];
    if ( eventstore ) { // eventstore
      console.log( 'CALL getTodolistES' );
      getTodolistES( showListItems );
    } else if ( localStorage.getItem( 'todolist' ) ) { // localstorage
      todolist = JSON.parse( localStorage.getItem( 'todolist' ) );
      showListItems( todolist );
    }
    setEvents();
    console.log( todolist );
    return todolist;
  }

  // Show List Items
  let showListItems = todolist => {
    todolist = todolist.sort( ( a, b ) => {
      if ( a.id < b.id ) {
        return 1;
      }
      if ( a.id > b.id ) {
        return -1;
      }
    } );
    todolist.forEach( v => {
      let item = `
            <li class="mdl-list__item">
              <span class="mdl-list__item-primary-content">
                <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="${v.id}">
                  <input type="checkbox" id="${v.id}" class="mdl-checkbox__input todo" ${v.done? 'checked': ''} />
                  <span class="mdl-checkbox__label">${v.title}</span>
                </label>
              </span>
              <span class="mdl-list__item-secondary-action">
                <span class="del" data-id="${v.id}">
                  <i class="material-icons">delete</i>
                  </span>
              </span>
            </li>
          `;
      $( '#list ul' ).append( item );
    } );
  }

  // Set Events
  let setEvents = () => {
    // toggle
    $( '.todo' ).on( 'click', function () {
      toggleDone( this );
    } );
    // delete
    $( '.del' ).on( 'click', function () {
      deleteTodo( this );
    } );
  }

  // Add Todo
  let addTodo = todolist => {
    let id = new Date().getTime();
    let todo = {
      id,
      title: $( '#newTodo' ).val(),
        done: false,
    };
    todolist.push( todo );
    if ( eventstore ) { // eventstore
      console.log( 'CALL addTodoES' );
      addTodoES( todo, showList );
    } else { // localstorage
      localStorage.setItem( 'todolist', JSON.stringify( todolist ) );
      showList();
    }
  }

  // Toggle Done
  let toggleDone = target => {
    // data toggle
    todolist = todolist.map( ( v ) => {
      if ( v.id === Number( $( target ).attr( 'id' ) ) ) {
        v.done = !v.done;
      }
      return v;
    } );
    if ( eventstore ) { // eventstore

    } else { // localstorage
      localStorage.setItem( 'todolist', JSON.stringify( todolist ) );
    }
    console.log( todolist );
  }

  // Delete Todo
  let deleteTodo = target => {
    // view remove
    let id = $( target ).attr( 'data-id' );
    $( `#${id}` ).parents( 'li' ).remove();
    // data remove
    todolist = todolist.filter( ( v ) => v.id !== Number( id ) );
    if ( eventstore ) { // eventstore

    } else { // localstorage
      localStorage.setItem( 'todolist', JSON.stringify( todolist ) );
    }
    console.log( todolist );
  }

} )();