/* jasmine specs for widgets go here */

describe('widget', function(){
  var controller, scope, element;
  function compile(html){
    scope = angular.compile(html, controller);
    element = scope.$element;
    scope.$init();
    scope.$onEval("evalCount = evaleCount + 1");
  }

  beforeEach(function(){
    controller = {
        start: jasmine.createSpy('start'),
        end: jasmine.createSpy('end'),
        accept: jasmine.createSpy('accept'),
        commit: jasmine.createSpy('commit')
    };

    this.addMatchers({
      toHaveClass: function(className) {
        var element = this.actual;
        var outter = $('<div>');
        outter.append(element.clone());
        this.actual = outter.html();
        return element.hasClass(className);
      }
    });

  });

  describe('jqui:drag-start', function(){
    beforeEach(function(){
      compile('<div jqui:drag-start="start()" jqui:drag-end="end($token)">');
    });

    it('should call drag-start; hold on to taken; call drag-stop; destroy token',function(){
      controller.start.andReturn('TOKEN');

      element.draggable("option", 'start')();

      expect(controller.start).toHaveBeenCalled();
      expect(controller.end).not.toHaveBeenCalled();
      expect(element.data('jqui-dnd-item-token')).toEqual('TOKEN');
      expect(element).toHaveClass('jqui-dnd-item-dragging');

      element.draggable("option", 'stop')();

      expect(controller.end).toHaveBeenCalledWith('TOKEN');
      expect(element.data('jqui-dnd-item-token')).toEqual(undefined);
      expect(element).not.toHaveClass('jqui-dnd-item-dragging');
    });
  });

  describe('jqui:drop-commit', function(){
    var ui;

    beforeEach(function(){
      ui = {
        draggable: (function createDraggableItemInDraggingState(){
          var itemScope = angular.compile(
              '<div jqui:drag-start="start()" jqui:drag-end="end($token)">',
              controller);
          itemScope.$init();
          controller.start.andReturn('TOKEN');
          itemScope.$element.draggable('option', 'start')();
          return itemScope.$element;
        })()
      };

      compile('<div jqui:drop-commit="commit($token)" jqui:drop-accept="accept($token)">');
    });

    it('should accept dragging when active', function(){
      compile('<div jqui:drop-commit="commit($token)">');
      element.addClass('jqui-dnd-target-active');
      element.droppable("option", "drop")(event, ui);
      expect(controller.commit).toHaveBeenCalledWith("TOKEN");
      expect(controller.end).toHaveBeenCalledWith("TOKEN");
      expect(scope.evalCount).toEqual(1);
    });

    it('should not accept dragging when not active', function(){
      element.droppable("option", "drop")(event, ui);
      expect(controller.commit).not.toHaveBeenCalled();
    });

    it('should not activate', function(){
      controller.accept.andReturn(false);
      element.droppable("option", "activate")(event, ui);
      expect(controller.accept).toHaveBeenCalledWith("TOKEN");
      expect(element).toHaveClass('jqui-dnd-target-disable');
      expect(element).not.toHaveClass('jqui-dnd-target-active');
      expect(scope.evalCount).toEqual(1);
    });

    it('should activate', function(){
      controller.accept.andReturn(true);
      element.droppable("option", "activate")(event, ui);
      expect(controller.accept).toHaveBeenCalledWith("TOKEN");
      expect(element).not.toHaveClass('jqui-dnd-target-disable');
      expect(element).toHaveClass('jqui-dnd-target-active');
      expect(scope.evalCount).toEqual(1);
    });

    it('should change over/out CSS when active', function(){
      controller.accept.andReturn(true);
      element.droppable("option", "activate")(event, ui);

      element.droppable("option", "over")(event, ui);
      expect(element).toHaveClass('jqui-dnd-target-over');
      expect(ui.draggable).toHaveClass('jqui-dnd-item-over');

      element.droppable("option", "out")(event, ui);
      expect(element).not.toHaveClass('jqui-dnd-target-over');
      expect(ui.draggable).not.toHaveClass('jqui-dnd-item-over');
    });

    it('should not change over/out CSS when not active', function(){
      controller.accept.andReturn(false);
      element.droppable("option", "activate")(event, ui);

      element.droppable("option", "over")(event, ui);
      expect(element).not.toHaveClass('jqui-dnd-target-over');
      expect(ui.draggable).not.toHaveClass('jqui-dnd-item-over');
    });

    it('should commit item', function(){
      element.addClass('jqui-dnd-target-active');
      element.addClass('jqui-dnd-target-disable');
      element.addClass('jqui-dnd-target-over');

      element.droppable("option", "drop")(event, ui);

      expect(controller.commit).toHaveBeenCalledWith("TOKEN");
      expect(controller.end).toHaveBeenCalledWith("TOKEN");
      expect(element).not.toHaveClass('jqui-dnd-target-active');
      expect(element).not.toHaveClass('jqui-dnd-target-disable');
      expect(element).not.toHaveClass('jqui-dnd-target-over');
      expect(scope.evalCount).toEqual(1);
    });
  });
});
