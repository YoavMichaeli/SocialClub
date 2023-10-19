function updateList(query) {
  $.ajax({
        method: 'GET',
        url: '/api/v1/search',
        data: {
          q:query
           }
    })
    .done(function(data){
        // show_notification('','success');
        $("#user-list").text('');
        $("#groups-list").text('');
        $("#chats-list").text('');
        for (var i = 0; i < data.length; i++) {
          console.log(data)
          if (data[i]["friendsNumber"] == undefined && data[i]["chatFriendUserId"] == undefined){
            $("#user-list").append(`<li class="list-group-item">
            <img src="${data[i].profile_pic}" class="logo">
            <b><a href="/u/${data[i].username}" id="list-username">${data[i].username} (User)</a></b>
         </li>`)
          }else if (data[i]["description"]){
            $("#groups-list").append(`<li class="list-group-item">
            <img src="${data[i].profile_pic}" class="logo">
            <b><a href="/groups/${data[i].name}" id="group-name">${data[i].name} (Group)</a></b>
         </li>`)
          } else if (data[i]["chatFriendUserId"]){
            console.log("in chat")
            $("#chats-list").append(`<li class="list-group-item">
            <img src="/images/logo/logo.png" class="logo">
            <b><a href="/chat/${data[i].chatFriendUserId}" id="chat">Conversation with ${data[i].chatFriendUsername} (Chat Room)</a></b>
         </li>`)
          }
  
        }

    })
    .fail(function(data){
      show_notification('Oops! Some error out there.','danger')
    });
}

function updateUserList() {
  console
  const lastname = document.getElementsByName("lastname")[0].value;
  const country = document.getElementsByName("country")[0].value;
  const yearOfBirth = document.getElementsByName("yearOfBirth")[0].value;

  // Create an object with the collected values
  const formData = {
    lastname: lastname,
    country: country,
    yearOfBirth: yearOfBirth
  };

  $.ajax({
    method: 'GET',
    url: '/api/v1/advancedUserSearch',
    data: {
      q:formData
       }
})
.done(function(data){
    // show_notification('','success');
    $("#user-list").text('');
    for (var i = 0; i < data.length; i++) {
        $("#user-list").append(`<li class="list-group-item">
        <img src="${data[i].profile_pic}" class="logo">
        <b><a href="/u/${data[i].username}" id="list-username">${data[i].username} (User)</a></b>
     </li>`)

    }

})
.fail(function(data){
  show_notification('Oops! Some error out there.','danger')
});
  
}


function updateGroupList() {
  console
  const description = document.getElementsByName("description")[0].value;
  const friendsNumber = document.getElementsByName("friendsNumber")[0].value;
  const creationMonth = document.getElementsByName("creationMonth")[0].value;

  // Create an object with the collected values
  const formData = {
    description: description,
    friendsNumber: friendsNumber,
    creationMonth: creationMonth
  };

  $.ajax({
    method: 'GET',
    url: '/api/v1/advancedGroupSearch',
    data: {
      q:formData
       }
})
.done(function(data){
    // show_notification('','success');
    $("#groups-list").text('');
    for (var i = 0; i < data.length; i++) {
      $("#groups-list").append(`<li class="list-group-item">
      <img src="${data[i].profile_pic}" class="logo">
      <b><a href="/groups/${data[i].name}" id="group-name">${data[i].name} (Group)</a></b>
   </li>`)

    }

})
.fail(function(data){
  show_notification('Oops! Some error out there.','danger')
});
  
}
