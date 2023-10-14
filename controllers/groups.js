const groupDal = require("../models/dal/group");
const userDal = require("../models/dal/user");


function createNewGroup(group, username) { 
    groupDal.createNew(group, (error, result) => {
        if (error){
            return null;
        }
        userDal.editUser({username: username, groups: result._id.toString(), groupsAdmin: result._id.toString()},
            (error, result) => {
               if (error){
                   return null;
               } 
       })
      });

    
}


function editGroup(group) { 
    groupDal.edit(group, (error, result) => {
        if (error){
            return null;
        }
       });
}

function deleteGroup(group) { 
    groupDal.deleteOne(group, (error, result) => {
        if (error){
            return null;
        }
       });
}

module.exports = {
    createNewGroup: createNewGroup,
    editGroup: editGroup,
    deleteGroup: deleteGroup
};
