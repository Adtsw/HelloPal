const users = []

const addUser = ({id, userName, room}) => {
    userName = userName.trim().toLowerCase()
    room = room.trim().toLowerCase()


    //validate
    if(!userName || !room){
        return {
            error: 'Username and room required'
        }
    }

    //cheking existing user
    const exinstingUser = users.find((user) => {
        return user.userName === userName && user.room === room
    })

    //validating userName
    if(exinstingUser){
        return {
            error: 'UserName already exists'
        }
    }

    //store data
    const user = {id, userName, room}
    users.push(user)
    return {user}
}

const removerUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if(index !== -1){
    return users.splice(index, 1)[0]
    }
}

const getUser = (id) =>{
    return users.find((user) => user.id === id)
}

const getUserInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
}

module.exports = {
    addUser, removerUser, getUser, getUserInRoom
}