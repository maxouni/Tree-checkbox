jQuery(document).on('ready', function(){

  var box = jQuery('.columns');

  var tree = new Tree(box);

  tree.addEventListener('CHANGE', function() {
    window.console.log(box.find('input[type=checkbox]').filter(':checked').length);
  });

});