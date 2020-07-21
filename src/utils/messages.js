const generateNotification = (text) => {
    return {
        text,
        createdAt: new Date().getTime()
    }
}

const generateMsg = (username, text, id) => {
    return {
        username,
        text,
        id,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMsg,
    generateNotification
}