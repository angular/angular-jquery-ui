/* http://docs.angularjs.org/#!angular.widget */

(function(){
  function applyFn(element, scope, exp, property){
    property = property || '$token';
    return function(token){
      var old = scope.hasOwnProperty(property) ? scope[property] : undefined;
      scope[property] = token;
      var retVal = scope.$tryEval(exp, element);
      scope[property] = old;
      return retVal;
    };
  };

  angular.directive('jqui:drag-start', function(_, item){
    var dragStartExp = item.attr('jqui:drag-start') || '';
    var dragEndExp = item.attr('jqui:drag-end') || '';
    item.addClass('jqui-dnd-item');
    return function(item){
      var $updateView = this.$root.$eval;
      var dragStart = applyFn(item, this, dragStartExp);
      var dragEnd = applyFn(item, this, dragEndExp);
      var token;

      item.draggable({
        addClass: false,
        start:function(event, ui){
          item.draggable('option', 'revertDuration', 200);
          item.addClass('jqui-dnd-item-dragging');
          item.data('jqui-dnd-item-token', token = dragStart());
          $updateView();
        },
        stop: function(){
          item.removeClass('jqui-dnd-item-dragging');
          item.removeClass('jqui-dnd-item-over');
          item.removeData('jqui-dnd-item-token');
          dragEnd(token);
          token = null;
          $updateView();
        },
        revert:true
      });
    };
  });

  angular.directive('jqui:drop-commit', function(_, target){
    var acceptExp = target.attr('jqui:drop-accept') || '';
    var commitExp = target.attr('jqui:drop-commit') || '';
    target.addClass('jqui-dnd-target');
    return function(target) {
      var $updateView = this.$root.$eval;
      var accept = applyFn(target, this, acceptExp);
      var commit = applyFn(target, this, commitExp);

      target.droppable({
        addClass: false,
        activate: function(event, ui){
          var token = ui.draggable.data('jqui-dnd-item-token');
          if (accept(token)) {
            target.addClass('jqui-dnd-target-active');
          } else {
            target.addClass('jqui-dnd-target-disable');
          }
          $updateView();
        },
        deactivate: function(){
          target.removeClass('jqui-dnd-target-active');
          target.removeClass('jqui-dnd-target-disable');
          target.removeClass('jqui-dnd-target-over');
        },
        over: function(event, ui){
          if (target.hasClass('jqui-dnd-target-active')) {
            target.addClass('jqui-dnd-target-over');
            ui.draggable.addClass('jqui-dnd-item-over');
          }
        },
        out: function(event, ui){
          target.removeClass('jqui-dnd-target-over');
          ui.draggable.removeClass('jqui-dnd-item-over');
        },
        drop: function(event, ui){
          if (target.hasClass('jqui-dnd-target-active')) {
            commit(ui.draggable.data('jqui-dnd-item-token'));
            ui.draggable.draggable('option', 'revertDuration', 0);
            ui.draggable.css({top:'', left:''});
            ui.draggable.draggable('option', 'stop')();
          }
          target.removeClass('jqui-dnd-target-active');
          target.removeClass('jqui-dnd-target-disable');
          target.removeClass('jqui-dnd-target-over');
          $updateView();
        }
      });
    };
  });

})();

