function deleteUserAccount(userId){
    console.log(userId)
	$.ajax({
        method: 'DELETE',
        url: `/me/userAccount/${userId}`
    })
    .done(function(data){
      show_notification('Deleted User Account, Redirecting to Login...','success')
      setTimeout(()=> {window.location.href = '/account/getin'}, 1000)

    })
    .fail(function(data){
      console.log(data)  
    });
};