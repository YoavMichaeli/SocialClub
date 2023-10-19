function deleteHistory(userId){
    console.log(userId)
	$.ajax({
        method: 'DELETE',
        url: `/chat/${userId}`
    })
    .done(function(data){
      show_notification('Deleted Chat History!','success')
      setTimeout(()=> {window.location.reload()}, 1000)

    })
    .fail(function(data){
      console.log(data)  
    });
};