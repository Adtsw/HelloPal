const MessageObj = (userName,text) =>{
  return { userName,text,
    createdAt: new Date().getTime()}
}

const MessageLocObj = (userName,url) =>{
    return { userName,
      url,
      createdAt: new Date().getTime()}
  }

module.exports = {
    MessageObj,
    MessageLocObj
}