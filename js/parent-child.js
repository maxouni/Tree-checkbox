//
// This source code follows Google JavaScript Style Guide
// http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml
//
// Released under the MIT license - http://opensource.org/licenses/MIT
//
/**
 * @author Max Mishin (maxonmishin@gmail.com)
 */

/**
 * @required jQuery
 *
 * Родительский бокс конструкции
 * @param {!jQuery} root
 * Классы для контейнеров где хранятся чекбоксы, если не заданы то по умолчанию заданы в this.levelClass_
 * @param {Array=} opt_levelClass
 * Элемнты которые используются в качестве чекбоксов(в теории возможны и радиобаттоны)
 * @param {string=} opt_tag
 * @constructor
 */
var Tree = function(root, opt_levelClass, opt_tag) {

  if (!root) return;
  /**
   * @type {!jQuery}
   * @private
   */
  this.root_ = root;
  if(!this.root_.length) return;

  /**
   * @type {Array}
   * @private
   */
  this.levelClass_ = opt_levelClass || [
    'parent-1',
    'parent-2',
    'parent-3',
    'parent-4'
  ];


  /**
   * @type {string}
   * @private
   */
  this.tag_ =  opt_tag || 'input[type=checkbox]';

  /**
   * @type {Object}
   * @private
   */
  this.elements_ = {};

  /**
   * @private
   */
  this.eventsDispatcher_ = /** @type {!jQuery} */ (jQuery({}));

  this.init_();

};

/**
 * @type {string}
 */
Tree.EVENT_CHANGE = 'change';

/**
 * @type {string}
 */
Tree.CLASS_SEMI = 'half';


/**
 * @param {?number} index
 * @constructor
 * @extends {jQuery.Event}
 */
Tree.ChangeEvent = function(index) {
  /**
   * @type {string}
   */
  this.type = 'CHANGE';

  /**
   * @type {?number}
   */
  this.currentIndex = index;
};


/**
 * @enum {string}
 */
Tree.EventType = {
  CHANGE: 'change'
};


/**
 * @private
 */
Tree.prototype.init_ = function() {

  for (var i = 0; i < this.levelClass_.length; i++) {
    var item = this.root_.find('.' + this.levelClass_[i]);

    if (item.length)
      this.elements_[i] = item.find(this.tag_);
  }

  this.attachEvents_();
};

/**
 * @private
 */
Tree.prototype.attachEvents_ = function() {
  /**
   * @type {Tree}
   */
  var that = this;

  for (var i = 0; i < this.levelClass_.length; i++) {
    this.elements_[i].each(function() {
      jQuery(this).on(Tree.EVENT_CHANGE, function() {

        /**
         * @type {!jQuery}
         */
        var el =  jQuery(this);
        /**
         * @type {number}
         */
        var id = parseInt(el.attr('data-id'), 10);
        /**
         * @type {number}
         */
        var idParent = parseInt(el.attr('data-parent'), 10) ;

        /**
         * @type {*}
         */
        var level = that.getLevelbyElement_($(this));

        that.childInit_(
          parseInt(level, 10),
          id,
          el.is(':checked')
        );

        that.parentInit_(
          parseInt(level, 10),
          idParent,
          el.is(':checked')
        );

        that.eventsDispatcher_.trigger(
          new Tree.ChangeEvent(id)
        );
      });
    })
  }
};

/**
 * @param {!jQuery} element
 * @returns {*}
 * @private
 */
Tree.prototype.getLevelbyElement_ = function(element) {
  
  for (var i = 0; i < this.levelClass_.length; i++) {
    if (element.parents('.' + this.levelClass_[i]).length) {
      return i;
    }
  }
  return false;
};

/**
 * @param {null|number} level
 * @param {number} id
 * @param {boolean} checked
 * @private
 */
Tree.prototype.childInit_ = function (level, id, checked) {
  /**
   * @type {Tree}
   */
  var that = this;

  for ( var i = level; i < this.levelClass_.length; i++ ) {
    var element = this.elements_[i].filter('[data-parent="' + id + '"]');
    this.elements_[i].filter('[data-id="' + id + '"]').removeClass(Tree.CLASS_SEMI);
    
    if (element.length) {
      element.each(function () {
        jQuery(this).removeClass(Tree.CLASS_SEMI).prop('checked', checked);
        that.childInit_(
          parseInt(i, 10), 
          parseInt(jQuery(this).attr('data-id'), 10), 
          checked);
      });
    }
  }
};

/**
 * @param {null|number} level
 * @param {number} id
 * @param {boolean} checked
 * @private
 */
Tree.prototype.parentInit_ = function (level, id, checked) {

  /**
   * @type {Tree}
   */
  var that = this;
  /**
   * @type {jQuery}
   */
  var currentCheckbox = this.elements_[level].filter('[data-parent="' + id + '"]');

  for ( var i = level - 1; i >= 0; i-- ) {

    var element = this.elements_[i].filter('[data-id="' + id + '"]');

    if (element.length) {
      element.each(function () {
        if (currentCheckbox.length == currentCheckbox.filter(':checked').length) {
          $(this).prop('checked', true).removeClass(Tree.CLASS_SEMI);
        } else {
          if (currentCheckbox.length - currentCheckbox.filter(':checked').length == currentCheckbox.length) {
            if (!currentCheckbox.filter('.' + Tree.CLASS_SEMI).length)
              $(this).prop('checked', false).removeClass(Tree.CLASS_SEMI);
            else
              $(this).prop('checked', false).addClass(Tree.CLASS_SEMI);
          } else {
            $(this).prop('checked', false).addClass(Tree.CLASS_SEMI);
          }
        }
        that.parentInit_(parseInt(i, 10), parseInt($(this).attr('data-parent'), 10), checked);
      });
    }
  }
};

/**
 * @param {Tree.EventType} eventType
 * @param {function(!jQuery.event)} callback
 */
Tree.prototype.addEventListener = function(eventType, callback) {
  this.eventsDispatcher_.bind(eventType, callback);
};
