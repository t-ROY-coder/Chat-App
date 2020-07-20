const generateNotification = (text) => {
    return {
        text,
        createdAt: new Date().getTime()
    }
}

const generateMsg = (username, text) => {
    return {
        username,
        text,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMsg,
    generateNotification
}