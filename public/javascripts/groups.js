function deleteGroup(groupId){
    console.log(groupId)
	$.ajax({
        method: 'DELETE',
        url: `/groups/${groupId}`
    })
    .done(function(data){
      show_notification('Deleted Group!','success')
      setTimeout(()=> {window.location.reload()}, 1000)

    })
    .fail(function(data){
      console.log(data)  
    });
};