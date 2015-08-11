# Tree-checkbox
Simple checkbox tree

Реализация дерева чекбоксов.
Наглядный пример в папке example

Инициализация
```javascript
jQuery(document).on('ready', function(){
  new Tree();
});
```

Подписка на изменение состояния чекбоксов внутри дерева
```javascript
jQuery(document).on('ready', function(){
  var tree = new Tree();
  tree.addEventListener('CHANGE', function(){
    // Здесь, например, можно задизейблить кнопку "Сохранить" если ничего не выбрано в дереве
  });
});
```
