    $(function () {
      jQuery('.wymeditor').wymeditor({
        containersHtml: "",
        classesHtml: "",
        logoHtml: "",
        toolsItems:[
          {'name': 'Bold', 'title': 'Strong', 'css': 'wym_tools_strong'},
          {'name': 'Italic', 'title': 'Emphasis', 'css': 'wym_tools_emphasis'},
          {'name': 'Superscript', 'title': 'Superscript', 'css': 'wym_tools_superscript'},
          {'name': 'Subscript', 'title': 'Subscript', 'css': 'wym_tools_subscript'},
          {'name': 'InsertOrderedList', 'title': 'Ordered_List', 'css': 'wym_tools_ordered_list'},
          {'name': 'InsertUnorderedList', 'title': 'Unordered_List', 'css': 'wym_tools_unordered_list'}
        ],
        postInit: function(wym) {
         $(wym._iframe).css('height', '150px');
        }
      });

      // $('#Score').bind('change',function(){
      //   // $('#testscorechange').text('score has changed = ' + $(this).val());
      //   var val = $(this).val();
      //   var match = val.match('/[0-9]/g');
      //   if(match === true){
      //     $('#testscorechange').text('score has changed = ' + $(this).val());
      //   }
      //   else if(match === false){
      //     $('#testscorechange').text('score has changed to false ');
      //   }
      //   else{
      //       $('#testscorechange').text('score has changed to something else =  ' + match);
      //   }
      //   $('#scorehelp').text('enter a number');
      //   $('#scoreError').addClass('error');
      // });//end of bind change for score

      // $('#Score').keyup(function () {
      //   // var express = /(^\d+$)|(^\d+\.\d+$)|[,\.]/;
      //   // express.test($(this).val());
      //   this.value = this.value.replace(/[^0-9+\.]/g,'');
      // });



      $('#Score').live("keyup",function(){inputControl($(this));});

      function inputControl(input,format){
          var value=input.val();
          var values=value.split("");
          var update="";
          var transition="";
          var expression=/(^\d+$)|(^\d+\.\d+$)|[,\.]/;
          var finalExpression=/^([0-9]*[\.]?\d{0,2})$/;
          for(id in values){
              if (expression.test(values[id])==true && values[id]!=''){
                  transition+=''+values[id];//.replace(',','.');
                  if(finalExpression.test(transition)==true){
                      update+=''+values[id]; //.replace(',','.');
                  }
              }
          }
          input.val(update);
      }//end of inputcontrol function


      });//end of $function