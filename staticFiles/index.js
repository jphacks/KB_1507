/**
 * Created by suzutomo on 2014/04/15.
 */

/**
 * bodyの内容を変える
 */
function link(str){
    //console.log(str);
    $.ajax({
        type: 'GET',
        url: 'HTML/' + str + '.html',
        dataType: 'html',
        success: function(data) {
            $('#body').html(data);
        },
        error:function() {
            $('#body').html('<h1>読み込めません</h1>');
        }
    });
    $('#menu li span').css('background-color', '#47515A');
    $('#'+str).css('background-color', '#F9C24B');
}

/**
 *  メニューの項目にマウスオーバーした時に色を変える
 */
var color;

$(function(){
    $('#menu li span').hover(function(){
        // マウスオーバーした時
        color = $(this).css("background-color");
        //console.log(color);
        //選択されてなければ色を変え，カーソルの形を手にする
        if(color != 'rgb(249, 194, 75)'){
            $(this).css("background-color", '#577A98');
            $(this).css("cursor","pointer");
        }
    },function(){
        //マウスオーバーが外れた時
        color = $(this).css("background-color");
        //console.log(color);
        //選択されてなければ色を戻す
        if(color != 'rgb(249, 194, 75)'){
            $(this).css("background-color", '#47515A');
        } else {
            //選択されていればカーソルの形を矢印に変える
            $(this).css("cursor","default");
        }
    });

    // $('#title').peelback({
    //     adImage  : 'IMG/musu.jpg',
    //     peelImage  : 'IMG/peel-image.png',
    //     clickURL : 'IMG/takenoko.JPG',
    //     smallSize: 50,
    //     bigSize: 175,
    //     autoAnimate: true
    // });
});
