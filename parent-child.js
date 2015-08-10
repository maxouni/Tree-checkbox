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
var Three = function(root, opt_levelClass, opt_tag) {
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
Three.EVENT_CHANGE = 'change';

/**
 * @type {string}
 */
Three.CLASS_SEMI = 'half';


/**
 * @param {?number} index
 * @constructor
 * @extends {jQuery.Event}
 */
Three.ChangeEvent = function(index) {
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
Three.EventType = {
  CHANGE: 'change'
};


/**
 * @private
 */
Three.prototype.init_ = function() {

  for (var i = 0; i < this.levelClass_.length; i++) {
    this.elements_[i] =
      this.root_.find('.' + this.levelClass_[i])
        .find(this.tag_);
  }

  this.attachEvents_();
};

/**
 * @private
 */
Three.prototype.attachEvents_ = function() {
  /**
   * @type {Three}
   */
  var that = this;

  for (var i = 0; i < this.levelClass_.length; i++) {
    this.elements_[i].each(function() {

      $(this).on(Three.EVENT_CHANGE, function() {
        /**
         * @type {number}
         */
        var id = parseInt($(this).attr('data-id'), 10);
        /**
         * @type {number}
         */
        var idParent = parseInt($(this).attr('data-parent'), 10) ;

        var level = that.getLevelbyElement_($(this));

        that.childInit_(
          parseInt(level, 10),
          id,
          jQuery(this).is(':checked')
        );

        that.parentInit_(
          parseInt(level, 10),
          idParent,
          jQuery(this).is(':checked')
        );

        that.eventsDispatcher_.trigger(
          new Three.ChangeEvent(id)
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
Three.prototype.getLevelbyElement_ = function(element) {
  
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
Three.prototype.childInit_ = function (level, id, checked) {
  /**
   * @type {Three}
   */
  var that = this;

  for ( var i = level; i < this.levelClass_.length; i++ ) {
    var element = this.elements_[i].filter('[data-parent="' + id + '"]');
    this.elements_[i].filter('[data-id="' + id + '"]').removeClass(Three.CLASS_SEMI);
    
    if (element.length) {
      element.each(function () {
        jQuery(this).removeClass(Three.CLASS_SEMI).prop('checked', checked);
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
Three.prototype.parentInit_ = function (level, id, checked) {

  /**
   * @type {Three}
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
          $(this).prop('checked', true).removeClass(Three.CLASS_SEMI);
        } else {
          if (currentCheckbox.length - currentCheckbox.filter(':checked').length == currentCheckbox.length) {
            if (!currentCheckbox.filter('.' + Three.CLASS_SEMI).length)
              $(this).prop('checked', false).removeClass(Three.CLASS_SEMI);
            else
              $(this).prop('checked', false).addClass(Three.CLASS_SEMI);
          } else {
            $(this).prop('checked', false).addClass(Three.CLASS_SEMI);
          }
        }
        that.parentInit_(parseInt(i, 10), parseInt($(this).attr('data-parent'), 10), checked);
      });
    }
  }
};

/**
 * @param {Three.EventType} eventType
 * @param {function(!jQuery.event)} callback
 */
Three.prototype.addEventListener = function(eventType, callback) {
  this.eventsDispatcher_.bind(eventType, callback);
};
