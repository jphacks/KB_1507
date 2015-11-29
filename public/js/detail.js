document.addEventListener('DOMContentLoaded', function(){
    getScore(function(res){
        console.log('get point');
        var result = JSON.parse(res);
        var files = result.files;
        var len = files.length;
        var parent = document.getElementById('sourcecode');
        for(var i = 0; i < len; i++){
            var file = files[i];
            for(var j = 0; j < file.points.length; j++){
                var point = file.points[j];

                var point_dom = document.createElement('div');
                point_dom.classList.add('point');

                var comment_dom = document.createElement('div');
                comment_dom.classList.add('comment');
                comment_dom.innerHTML = point.comment;

                var name_dom = document.createElement('div');
                point_dom.classList.add('filename');
                name_dom.innerHTML = file.name;

                var code_dom = document.createElement('pre');
                var parsed_filename = file.name.split('.');
                var exet = parsed_filename[parsed_filename.length-1];
                code_dom.classList.add('blush:'+exet);
                var splited_body = file.body.split('\n');
                var start_line = point.line - 5;
                if(start_line < 1){start_line=1;}
                var end_line = point.line + 5;
                if(start_line > splited_body.length){start_line=splited_body.length;}

                for(var k = start_line-1; k < end_line; k++){
                    code_dom.innerHTML += splited_body[k] + '\n';
                }

                point_dom.appendChild(comment_dom);
                point_dom.appendChild(name_dom);
                point_dom.appendChild(code_dom);
                parent.appendChild(point_dom);

            }
        }
        SyntaxHighlighter.all();
        console.log('done');
    });
});

function getScore(callback){
    var xhr = new XMLHttpRequest();

    xhr.onload = function(response){
        callback(xhr.response);
    };

    xhr.onerror = function(error){
        console.error(error);
    };

    xhr.open('POST', '/point');

    xhr.send();
}
