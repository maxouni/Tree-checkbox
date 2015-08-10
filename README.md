# Tree-checkbox
Simple checkbox tree

Реализация дерева чекбоксов.

```html
Инициализация
<script>
jQuery(document).on('ready', function(){
  new Three();  
});
</script>

Подписка на изменение состояния чекбоксов внутри дерева
<script>
jQuery(document).on('ready', function(){
  var tree = new Three();  
  tree.addEventListener('CHANGE', function(){
    // Здесь, например, можно задизейблить кнопку "Сохранить" если ничего не выбрано в дереве
  });
});
</script>
```
