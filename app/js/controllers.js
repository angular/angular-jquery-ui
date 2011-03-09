function DialogDemo(dialog_){
  this.showDialog = function(){
    dialog_.open('title', 'partials/dialog.html', DialogCntl);
  };
}

function DialogCntl(){
  this.name = 'world';
}

function DndDemo() {
  this.list1 = [{name:'one'}, {name:'two'}, {name: 'three', reject: true}, {name: 'four'}];
  this.list2 = [];

  this.dragStart = function(item, list){
    item.dragging = '(dragging)';
    return {src: list, item:item};
  };
  this.dragEnd = function(item){
    delete item.dragging;
  };

  this.acceptToken = function(to, token){
    return token.src != to && !token.item.reject;
  };
  this.commitToken = function(to, token){
    angular.Array.remove(token.src, token.item);
    to.push(token.item);
  };
}
