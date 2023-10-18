function followGroup(){
	$.ajax({
        method: 'POST',
        url: '/api/v1/followGroup',
        data: {
        	"_id":_id
         	 }
    })
    .done(function(data){
      show_notification('Following group!','success')
      setTimeout(()=> {window.location.reload()}, 1000)

    })
    .fail(function(data){
      console.log(data)  
    });
};