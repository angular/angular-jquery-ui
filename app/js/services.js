angular.service('dialog', function($document){
  var rootScope = this;
  var body = $document.find('body');
  return {
    open: function(title, bodyUrl, Controller){
      rootScope.$dialog = {
          scope: rootScope.$new(Controller),
          src: bodyUrl
      };
      var include = $('<ng:include></ng:include');
      include.attr('scope', '$dialog.scope');
      include.attr('src', '$dialog.src');
      var dialog = $('<div></div>');
      dialog.append(include);
      dialog.attr('title', title);
      body.append(dialog);
      dialog.dialog();
      angular.compile(include)(rootScope);
    }
  };
});
