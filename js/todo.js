( () => {
  let todolist = [];

  // Document Ready
  $( () => {
    showList( todolist );
    // add event
    $( '#addTodo' )
      .on( 'click', () => {
        console.log( todolist );
        addTodo( todolist )
      } );
  } );

  // Functions
  // Clear List
  let clearList = () => {
    $( '#list ul' )
      .empty();
  }

  // Show List
  let showList = todolist => {
    clearList();
    // storage
    if ( localStorage.getItem( 'todolist' ) ) {
      todolist = JSON.parse( localStorage.getItem( 'todolist' ) );
    }
    todolist.forEach( v => {
      let item = `
            <li class="mdl-list__item">
              <span class="mdl-list__item-primary-content">
                <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="${v.id}">
                  <input type="checkbox" id="${v.id}" class="mdl-checkbox__input" ${v.done? 'checked': ''} />
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
      $( '#list ul' )
        .append( item );
    } );
    setEvents();
    console.log( todolist );
  }

  // Set Events
  let setEvents = () => {
    // toggle
    $( 'input[type=checkbox]' )
      .on( 'click', function () {
        toggleDone( this );
      } );
    // delete
    $( '.del' )
      .on( 'click', function () {
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
    // storage
    localStorage.setItem( 'todolist', JSON.stringify( todolist ) );
    showList( todolist );
  }

  // Toggle Done
  let toggleDone = target => {
    // data toggle
    todolist = todolist.map( ( v ) => {
      if ( v.id === Number( $( target )
          .attr( 'id' ) ) ) {
        v.done = !v.done;
      }
      return v;
    } );
    // storage
    localStorage.setItem( 'todolist', JSON.stringify( todolist ) );
    console.log( todolist );
  }

  // Delete Todo
  let deleteTodo = target => {
    // view remove
    let id = $( target )
      .attr( 'data-id' );
    $( `#${id}` )
      .parents( 'li' )
      .remove();
    // data remove
    todolist = todolist.filter( ( v ) => v.id !== Number( id ) );
    // storage
    localStorage.setItem( 'todolist', JSON.stringify( todolist ) );
    console.log( todolist );
  }

} )();