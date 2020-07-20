const users = []

const addUser = ({ id, username, room }) => {
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if (!username || !room) {
        return { error: "Username and Room are required" }
    }

    const existingUser = users.find((user) => {
        return user.username === username && user.room === room
    })

    if (existingUser) {
        return { error: 'Username already in use' }
    }

    const user = { id, username, room }
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const idx = users.findIndex((user) => user.id === id)

    if (idx !== -1) {
        return users.splice(idx, 1)[0]
    }
}

const getUser = (id) => {
    return users.find((user) => user.id === id)
}

const getUserInRoom = (room) => {
    return users.find((user) => user.room === room)
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUserInRoom
}