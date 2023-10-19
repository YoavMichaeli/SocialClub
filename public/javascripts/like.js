$(".like-button-box").on("click",likeById);
$(".post").dblclick(likeById);

function likeById() {
	console.log(this.id)
	var author = $(`#${this.id}`).attr("author");
	var category = $(`#${this.id}`).attr("category");
	console.log("asd"+ category)
	$.ajax({
        method: 'POST',
        url: '/api/v1/like',
        data: {
        	"_id":this.id.toString().split('-like')[0],
					"author":author,
					"category": category
         	 }
    })
    .done(function(data){
			if(data.event) {
					show_notification(data.msg,'success');
			}
			else {
				show_notification(data.msg,'danger')
			}

    })
    .fail(function(data){
      show_notification('Some error while liking the feed','danger')
      console.log(data)
    });


}
