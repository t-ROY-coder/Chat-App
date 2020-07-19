const generateMsg = (text) => {
    return {
        text: text,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMsg
}