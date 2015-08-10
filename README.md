# Tree-checkbox
Simple checkbox tree

Реализация дерева чекбоксов.


Инициализация

jQuery(document).on('ready', function(){
  new Three();  
});

Подписка на изменение состояния чекбоксов внутри дерева

jQuery(document).on('ready', function(){
  var tree = new Three();  
  tree.addEventListener('CHANGE', function(){
    // Здесь, например, можно задизейблить кнопку "Сохранить" если ничего не выбрано в дереве
  });
});
