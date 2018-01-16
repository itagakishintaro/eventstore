util = {};

( () => {
  util.sortObjects = ( objects, target, asc ) => {
    return objects.sort( ( a, b ) => {
      if ( a[ target ] < b[ target ] ) {
        return asc ? -1 : 1;
      }
      if ( a[ target ] > b[ target ] ) {
        return asc ? 1 : -1;
      }
    } );
  }
} )();
