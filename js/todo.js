todolist = [];

( () => {
  let eventstore = $( '#eventstore' ).prop( 'checked' );

  // Document Ready
  $( () => {
    showList();
    // eventstore event
    $( '#eventstore' ).on( 'click', () => {
      eventstore = $( '#eventstore' ).prop( 'checked' );
      $( '#timemachine' ).toggle();
      showList();
    } );
    // add event
    $( '#addTodo' ).on( 'click', () => {
      addTodo();
    } );
    $( '#goBack' ).on( 'click', () => {
      showList( $( '#eventNumber' ).val() );
    } );
  } );

  // Clear List
  let clearList = () => $( '#list ul' ).empty();

  // Show List
  let showList = ( eventNumber ) => {
    console.log( 'SHOW LIST', todolist );
    es.getTodolist( showListItems, eventNumber );
  }

  // Show List Items
  let showListItems = () => {
    console.log( 'SHOW LIST ITEMS', todolist );
    clearList();
    todolist = util.sortObjects( todolist, 'id', false );
    todolist.forEach( v => {
      let item = `
            <li class="mdl-list__item">
              <span class="mdl-list__item-primary-content">
                <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="${v.id}">
                  <input type="checkbox" id="${v.id}" class="mdl-checkbox__input todo" ${v.done? 'checked': ''} />
                  <span class="mdl-checkbox__label ${v.done? 'done': ''}">${v.title}</span>
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
    setEvents();
  }

  // Set Events
  let setEvents = () => {
    // toggle
    $( '.todo' ).on( 'click', function () {
      $( this ).next( 'span' ).toggleClass( "done" );
      toggleDone( this );
    } );
    // delete
    $( '.del' ).on( 'click', function () {
      deleteTodo( this );
    } );
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
    es.addTodo( todo, showListItems );
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
    es.toggleDone( todo );
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
    es.deleteTodo( todo );
  }

} )();
