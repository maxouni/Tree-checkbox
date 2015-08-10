# Tree-checkbox
Simple checkbox tree

Реализация дерева чекбоксов.

```html
Инициализация
<pre>
jQuery(document).on('ready', function(){
  new Three();  
});
</pre>
Подписка на изменение состояния чекбоксов внутри дерева
<pre>
jQuery(document).on('ready', function(){
  var tree = new Three();  
  tree.addEventListener('CHANGE', function(){
    // Здесь, например, можно задизейблить кнопку "Сохранить" если ничего не выбрано в дереве
  });
});
</pre>
```
