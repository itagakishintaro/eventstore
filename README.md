# 概要
[EventStore](https://geteventstore.com/)というサービスを使ったToDoアプリを作成します。

EventStoreはイベントソーシングとCQRSという2つのデザインパターンを実現するデータベースです。
イベントソーシングは、データの状態(値)を記録するのではなく、イベントを記録し、イベントをシーケンシャルに読み取ることでデータの状態(値)を再現するデザインパターンで、Martin Fowlerが考案しました。
す。
また、CQRS(Command Query Responsibility Segregation)は、コマンド(データの登録・更新・削除)とクエリー(参照)を完全に分離するデザインパターンで、Greg Youngが考案しました。
EventStoreは、このGreg Youngが起こしたスタートアップによって開発されています。

どちらも新しくはありませんが、マイクロサービス化が進み、分散データ管理が重要となってきたことで再注目されています。
なお、イベントソーシングとCQRSについては、[Nginxの解説](https://www.nginx.com/blog/event-driven-data-management-microservices/)がわかりやすいかと思います。

## 学べること
* EventStoreの基本的な使い方
* イベントソーシングの概要
* CQRSの概要

## 必要な知識
* HTML, CSS, JavaScriptの基本

## 注意
* Windowsを前提としますが、MacやLinuxでも基本は同じです。

# 準備
## curl
動作確認にcurlコマンドを使うため、以下のサイトからGit Bashをインストールします。
(curlが使えればよいので、Git Bashでなくてもかまいません。)

https://git-for-windows.github.io/

## Webブラウザー
このチュートリアルではECMA Script 6の記法を使用します。
そのため、ChromeかFIrefoxをインストールします。

# EventStoreのインストール
公式サイト:http://docs.geteventstore.com/introduction/latest

## インストール
次のページからインストーラーをダウンロードし、インストールします。
https://geteventstore.com/downloads/

## 起動
コマンドプロンプトを**管理者モード**で起動し、**インストール先のフォルダに移動し**、次のコマンドを実行します。

```
EventStore.ClusterNode.exe --db ./db --log ./logs
```

次のURLにアクセスし、EventStoreが起動されていることを確認します。

http://localhost:2113
ID:admin
Password:changeit.

## 基本操作の実行
EventStoreはHTTP APIを持っているため、言語を問わず利用できます。
ここでは、curlコマンドを使って動作確認します。

### イベントの登録
event.txtという名前で次のファイルを作成します。

```
[
  {
    "eventId": "fbf4a1a1-b4a3-4dfe-a01f-ec52c34e16e4",
    "eventType": "event-type",
    "data": {

      "a": "1"
    }
  }
]
```

GitBashを起動し、**event.txtを保存したフォルダで**次のコマンドを実行します。

```
curl -i -d @event.txt "http://127.0.0.1:2113/streams/newstream" -H "Content-Type:application/vnd.eventstore.events+json"
```

次のURLにアクセスしイベントが登録されていることを確認します。

http://127.0.0.1:2113/web/index.html#/streams/newstream

### イベントの参照
GitBashを起動し、次のコマンドを実行します。

```
curl -i http://127.0.0.1:2113/streams/newstream/0 -H "Accept: application/json"
```

次のJSONデータが返却されることを確認します。

```
{
  "a": "1"
}
```

# EventStoreを使わないToDoアプリをつくる
まず、EventStoreを使わず、ブラウザのLocal Storageを使ったToDoアプリをつくります。
任意のフォルダを用意したら、その中に`css`と`js`というフォルダを作成します。

## htmlの作成
次のとおり、`index.html`と`css/todo.css`を作成します。

```html
<!DOCTYPE html>
<html lang="jp">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  <!-- Compiled and minified CSS -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.99.0/css/materialize.min.css">
  <link rel="stylesheet" href="css/todo.css">
  <title>ToDo List</title>
</head>

<body>
  <!-- Header -->
  <nav class="header teal lighten-2">
    <div class="nav-wrapper">
      <a href="#" class="brand-logo">TODO LIST</a>
    </div>
  </nav>

  <div class="container">
    <div class="row">
      <!-- Input ToDo-->
      <form class="col s12 m6">
        <div class="input-field">
          <input id="newTodo" type="text" placeholder="Text...">
          <label for="newTodo"></label>
          <a id="addTodo" class="waves-effect waves-light btn">Add</a>
        </div>
      </form>

      <!-- ToDo LIst -->
      <div id="list" class="col s12 m6">
        <ul class="collection">
          <li v-for="todo in todolist" class="collection-item">
            <!-- Toggle DONE -->
            <span v-bind:for="todo.id">
              <input type="checkbox" v-bind:id="todo.id" v-model="todo.done" v-on:click="toggleDone" />
              <label v-bind:for="todo.id" v-bind:class="{done: todo.done}">{{todo.title}}</label>
            </span>
            <!-- Delete ICON -->
            <i class="material-icons del" v-bind:data-id="todo.id" v-on:click="deleteTodo">delete</i>
          </li>
        </ul>
      </div>
    </div>
  </div>

  <script src=" https://unpkg.com/vue" charset="utf-8"></script>
  <script src="https://code.jquery.com/jquery-3.2.1.min.js" integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=" crossorigin="anonymous"></script>
  <!-- Compiled and minified JavaScript -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.99.0/js/materialize.min.js"></script>
  <script src="js/util.js" charset="utf-8"></script>
  <script src="js/todo.js" charset="utf-8"></script>
</body>

</html>
```

```css
.header{
  margin-bottom: 1em;
}
.del {
  float: right;
  margin-left: 1em;
}
.done {
  color: lightgray;
  text-decoration: line-through;
}
```

[Materialize](http://materializecss.com/)と[Vue.js](https://jp.vuejs.org/), jQueryを使用していますが、最低限の利用なのであまり気にする必要はありません。。
Materializedを使って装飾しているため、複雑にみえるかもしれませんが、よくみると、ヘッダー、テキストボックスとボタンだけのフォーム、ToDoのリスト(ul)というシンプルな構成なのがわかると思います。

次に`js/todo.js`と`js/util.js`を作成します。

```js
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
  } );

  // Get and show List
  let getAndShowList = () => {
    console.log( 'GET AND SHOW LIST', todolist );
    todolist = JSON.parse( localStorage.getItem( 'todolist' ) );
    showList();
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
    localStorage.setItem( 'todolist', JSON.stringify( todolist ) );
    showList();
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
    localStorage.setItem( 'todolist', JSON.stringify( todolist ) );
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
    localStorage.setItem( 'todolist', JSON.stringify( todolist ) );
  }

} )();
```

```
let util = {};

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
```

`todolist`の配列にtodoを保存しています。todoはJSON Objectで次の構造にしています。

```js
{
    id: [Number],
    title: [String],
    done: [Boolean],
}
```

`getAndShowList()`では、localStorageからtodolistを取得し、`showList()`を呼び出してtodoをリストアイテムとして表示しています。

# EventStoreを使ったToDoアプリをつくる
## 登録(Command)
まず、`js/todo.js`の`addTodo`関数の最後の部分を次のように修正します。

```js
// localStorage.setItem( 'todolist', JSON.stringify( todolist ) );
es.addTodo( todo, showList );
// showList();
```

JavaScriptに慣れていない人は、第2引数に関数を渡しているのが奇妙にみえるかもしれませんが、JavaScriptではよくあることです。
今回、`js/todo.js`は、次のような記述で囲まれていますが、これは即時関数といって、定義した変数や関数をカプセル化して外部と変数などが衝突しないようにしています。

```
( () => {

} )();
```

次に、`eventsotre.js`次の内容で作成します。

```js
let es = {};

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
  es.addTodo = ( todo, showList ) => {
    command( todo, 'addTodo', showList );
  }

} )();
```

登録はCQRSではCommandになります。後ほどわかりますが、Event Storeでは登録も更新も削除もイベントの登録で、イベントタイプが異なるだけです。
そのため、登録、更新、削除の共通関数としてcommand関数を定義しています。
Event Store利用のポイントは、`contentType`と`headers`です。公式サイトで仕様を確認してください。

[Writing to a Stream](http://docs.geteventstore.com/http-api/4.0.0/writing-to-a-stream/)

最後に、`index.html`に`js/eventstore.js`の読み込み処理を追加します。

```html
  <script src="js/eventstore.js" charset="utf-8"></script>
</body>
```

画面からイベントの登録をし、Event Storeにアクセスして、イベントが登録されていることを確認します。

```
http://localhost:2113/
メニュー: Stream Browser
Recently Changed Streams: todolist
```

## 更新、削除(Command)
`js/todo.js`の`toggleDone`関数と`deleteTodo`関数を次のように修正します。


```js
// localStorage.setItem( 'todolist', JSON.stringify( todolist ) );
es.toggleDone( todo );
```

```js
// localStorage.setItem( 'todolist', JSON.stringify( todolist ) );
es.deleteTodo( todo );
```

次に、`js/eventstore.js`に以下を追加します。

```
// Toggle Done
es.toggleDone = ( todo ) => {
  command( todo, 'toggleDone' );
}

// Delete To Do
es.deleteTodo = ( todo ) => {
  command( todo, 'deleteTodo' );
}
```

画面からイベントの更新、削除をし、Event Storeにアクセスして、イベントが登録されていることを確認します。
(現在、画面に表示されているのはlocalStorageに登録されているものです。localStorageにデータを登録していない場合は画面からは確認できませんので、確認はあとからでかまいません。)

## 参照(Query)
まず、`js/todo.js`の`getAndShowList`関数を次のように修正します。

```js
// todolist = JSON.parse( localStorage.getItem( 'todolist' ) );
// showList();
es.getTodolist( showList );
```

次に、`eventstore.js`に次を追加します。

```js
/********** QUERY **********/
// Get To Do List
es.getTodolist = ( showList ) => {
    let events = [];
    getEntriesPromise( streamUrl + '/0/forward/100?embed=body', [] ).then( e => {
      todolist = aggregate( e );
      showList();
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
```

少し込み入っていますが、`es.getTodolist`は`getEntriesPromise`を呼び出してイベントを取得し、`aggregate`を呼び出して集計しています。
この集計処理が必要なところがイベントソーシングのポイントです。
Event Storeにはデータの状態(値)ではなく、イベントが登録されているだけなので、イベントからデータの状態(値)を再現する必要があります。

Event Store利用のポイントは、URLの `/0/forward/100`部分と`?embed=body`、`headers`です。
`/0/forward/100`は先頭から100件のデータを取得することを意味し、`?embed=body`部分はデータの中身も取得することを示しています。
ページングの仕様は標準仕様に基づいているため、Web APIに慣れていれば難しくはないかと思いますが、そうでなければ複雑に思えるかもしれません。
`getEntriesPromise`関数は続きのページがあれば再帰的に自分自身を呼び出しています。
Event Storeのその他の仕様は公式サイトで確認してください。

[Reading Streams and Events](http://docs.geteventstore.com/http-api/4.0.0/reading-streams/)

# 任意の時点の状態を再現する
ここまででEvent Storeの基本的な使い方は終了ですが、この使い方では従来のRDBと変わりません。
イベントソーシングのよさを少しでも感じるために、イベントソーシングの特徴の1つである「任意の時点の状態を再現できる」機能を追加します。
(もちろん、イベントソーシングの強みはこれだけではなく、これはほんの一部です)

`index.html`に以下を追加します。

```html
<!-- Time Machine -->
<div id="timemachine">
  <span class="chip">
    Time Machine! (0 ~
    <span id="maxEventNumber"></span>)
  </span>
  <div class="input-field">
    <input class="validate" type="number" id="eventNumber" placeholder="Event Number">
    <label for="eventNumber" data-error="Input is not a number!"></label>
  </div>
  <a id="goBack" class="waves-effect waves-light btn">Go Back!</a>
</div>
```

次に`js/todo.js`と`js/eventstore.js`を次のように変更します。

```js
// add event
$( '#addTodo' ).on( 'click', () => {
  addTodo();
} );
$( '#goBack' ).on( 'click', () => {
  getAndShowList( $( '#eventNumber' ).val() );
} );


// Get and show List
let showList = ( eventNumber ) => {
  // todolist = JSON.parse( localStorage.getItem( 'todolist' ) );
  // showList();
  es.getTodolist( showList, eventNumber );
}
```

```js
es.getTodolist = ( showList, eventNumber ) => {
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
      showList();
    } );
  }
```

画面でイベント番号を指定し、その時点のデータが再現できることを確認してください。

# 落ち穂拾い
実際に使ってみると、理屈だけでは少し難しく感じるイベントソーシングとCQRSもなんとなく理解できたのではないでしょうか。
優れたプロダクト/サービスは理屈を理解しなければ使えないものではなく、使うことで背景の思想やアーキテクチャ、パターンが理解できるものが少なくありません。
Event Storeもその1つといえるのではないかと考えています。
このチュートリアルではふれなかったことをいくつか補足します。

## Projections
イベントソーシングで、これまでのやり方と比べて手間が増えるのが、イベントからデータの状態を再現する集計処理です。
この集計処理をサーバーに登録しておいて、クライアントはそれを呼び出すだけで集計済みのデータを取得できるProjectionsという機能がEvent Storeにはあります。
気になる方は以下を参照に試してみてください。

[Projections](http://docs.geteventstore.com/projections/4.0.0/)

## スナップショット
イベントソーシングは、イベントから集計処理でデータの状態(値)を再現するため、集計処理の分パフォーマンスが落ちます。
(CQRSによって、クエリーを担うサーバーを分散できるため、性能を向上させることはできますが)
イベントが増えるほどパフォーマンスが落ちてしまうアーキテクチャは大きな問題です。
一般的に、イベントソーシングではスナップショットとして、集計済みのデータの状態(値)をスナップショットとして保存する手法を用います。
Event Storeでは以下のとおり、スナップショットの機能はありませんが、aggregate-foo-1234-domain-snapshotのようなストリームを保存することでスナップショットを利用できます。

https://groups.google.com/forum/#!topic/event-store/az_M-DRVXTw

## 不変性と拡張性、保守性
イベントソーシングの最大のポイントはデータ(イベント)の不変性にあります。
データ(イベント)は登録されるだけで、一度登録されたデータ(イベント)は更新も削除もされません。
そのため、ロックも発生しません。
データ(イベント)が不変で、CQRSによってコマンドとクエリーが明確に分離されていれば、クエリーを担うサービスはいくらでも増やすことができます。
単純にデータをコピーすればよいからです。
当然、コマンドによってデータが登録されてから、冗長化された多くのクエリーサービスにデータをコピーするまでのタイムラグが発生するため、一時的にACID特性が保たれなくなりますが、わずかなタイムラグでデータの整合性が保たれます。
これを結果的整合性といいます。
また、データが不変でロックも発生しないという特徴から、データは単純なファイルとして扱うことができます。
実際、Event Storeはchunkとよばれるファイルでデータを管理しています。
バックアップもリストアも、スケールアウトも単純なファイル操作で実現できます。

## マイクロサービスとイベント駆動
デジタルサービスの多くは、イベント駆動型のマイクロサービス連携によって実現しています。
その際、ACID特性を重視する集中型データ管理から、結果的整合性によるスケーラビリティを重視した分散データ管理へのパラダイムシフトがおきます。
Event Storeはその際の有力な選択肢の一つになるでしょう。
