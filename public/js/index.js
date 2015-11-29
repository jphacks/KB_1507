document.addEventListener('DOMContentLoaded', function(){
   document.getElementById('submit').disabled=true;
});

function check(){
   var url_text = document.getElementById('url').value;
   
   if(url_text.match(/https?:\/\/[\w/:%#\$\&\?\(\)\~\.=\+\-]+/)){
   	document.getElementById('submit').disabled=false;
   }else{
   	document.getElementById('submit').disabled=true;
   }

}
