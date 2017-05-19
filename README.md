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
まず、EventStoreを使わず、ブラウザのLocal Storageを使ったToDOアプリをつくります。

## htmlの作成
次のとおり、`index.html`を作成します。
[Material Design Lite](https://getmdl.io/)とjQueryを使用しています。
Material Design Liteを使って装飾しているため、複雑にみえるかもしれませんが、よくみると、ヘッダーとテキストボックスとボタンだけのフォームとリスト(ul)があるだけなのがわかると思います。

```html
<!DOCTYPE html>
<html lang="jp">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
  <link rel="stylesheet" href="https://code.getmdl.io/1.3.0/material.indigo-pink.min.css">
  <script defer src="https://code.getmdl.io/1.3.0/material.min.js"></script>
  <link rel="stylesheet" href="todo.css">
  <title>ToDo</title>
</head>

<body>
  <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
    <header class="mdl-layout__header">
      <div class="mdl-layout__header-row">
        <!-- Title -->
        <span class="mdl-layout-title">To Do List</span>
      </div>
    </header>
    <div class="mdl-layout__drawer">
      <span class="mdl-layout-title">Top</span>
    </div>
    <main class="mdl-layout__content">
      <div class="page-content">
        <div class="mdl-grid">

          <div class="mdl-cell mdl-cell--6-col">
            <form action="#">
              <div class="mdl-textfield mdl-js-textfield">
                <input class="mdl-textfield__input" type="text" id="newTodo">
                <label class="mdl-textfield__label" for="newTodo">Text...</label>
              </div>
              <span id="addTodo" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored">Add</span>
            </form>
          </div>

          <div id="list" class="mdl-cell mdl-cell--6-col">
            <ul class="demo-list-control mdl-list">
            </ul>
          </div>

        </div>
      </div>
    </main>
  </div>

  <script src="https://code.jquery.com/jquery-3.2.1.min.js" integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=" crossorigin="anonymous"></script>
  <script src="todo.js" charset="utf-8"></script>
</body>

</html>
```

次に`todo.js`を作成します。

```js
let todolist = [];

( () => {
  // Document Ready
  $( () => {
    showList();
    // add event
    $( '#addTodo' ).on( 'click', () => {
      addTodo();
    } );
  } );

  // Clear List
  let clearList = () => $( '#list ul' ).empty();

  // Show List
  let showList = () => {
      todolist = JSON.parse( localStorage.getItem( 'todolist' ) );
      showListItems();
    }

  // Show List Items
  let showListItems = () => {
    clearList();
    todolist = sortObjects( todolist, 'id', false );
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
    let id = new Date().getTime();
    let todo = {
      id,
      title: $( '#newTodo' ).val(),
        done: false,
    };
    todolist.push( todo );
    localStorage.setItem( 'todolist', JSON.stringify( todolist ) );
    showListItems();
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
    let todo = {
      id: $( target ).attr( 'id' ),
      done: $( target ).prop( 'checked' ),
    };
    localStorage.setItem( 'todolist', JSON.stringify( todolist ) );
  }

  // Delete Todo
  let deleteTodo = target => {
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

  /*********** UTIL **********/
  let sortObjects = ( objects, target, asc ) => {
    return objects.sort( ( a, b ) => {
      if ( a[ target ] < b[ target ] ) {
        return asc ? -1 : 1;
      }
      if ( a[ target ] > b[ target ] ) {
        return asc ? 1 : -1;
      }
    });
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

`showList()`では、localStorageからtodolistを取得し、`showListItems()`を呼び出してtodoをリストアイテムとして表示しています。

# EventStoreを使ったToDoアプリをつくる

# 任意の時点の状態を再現する

# AggregationとSnapshot
