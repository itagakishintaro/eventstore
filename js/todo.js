( () => {
  let todolist = [];
  let eventstore = $( '#eventstore' ).prop( 'checked' );

  // Document Ready
  $( () => {
    showList( todolist );
    // add event
    $( '#addTodo' ).on( 'click', () => {
      console.log( todolist );
      addTodo( todolist )
    } );
  } );
  // eventstore event
  $( '#eventstore' ).on( 'click', () => {
    eventstore = $( '#eventstore' ).prop( 'checked' );
    showList( todolist );
    console.log( eventstore );
  } )

  // Functions
  // Clear List
  let clearList = () => $( '#list ul' ).empty();

  // Show List
  let showList = todolist => {
    clearList();
    if ( eventstore ) { // eventstore

    } else if ( localStorage.getItem( 'todolist' ) ) { // localstorage
      todolist = JSON.parse( localStorage.getItem( 'todolist' ) );
    }
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
    setEvents();
    console.log( todolist );
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
    let id = todolist.length === 0 ? 0 : Math.max.apply( null, todolist.map( o => o.id ) ) + 1;
    todolist.push( {
      id,
      title: $( '#newTodo' )
        .val(),
        done: false,
    } );
    if ( eventstore ) { // eventstore

    } else { // localstorage
      localStorage.setItem( 'todolist', JSON.stringify( todolist ) );
    }
    showList( todolist );
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