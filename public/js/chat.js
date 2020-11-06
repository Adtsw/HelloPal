const socket = io()

const $messageForm = document.querySelector('#message-input')
const $messageButton = $messageForm.querySelector('button')
const $messageInput = $messageForm.querySelector('input')

const myLoc = document.querySelector('#myLoc')


const messageTemplate = document.querySelector('#message-template').innerHTML
const messages = document.querySelector('#messages')

const locationTemplate = document.querySelector('#location-template').innerHTML

const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

const {userName, room} = Qs.parse(location.search, {ignoreQueryPrefix: true})

socket.emit('join', {
    userName,room
},(error) => {
    if(error){
        alert(error)
        location.href = '/'
    }
})

const autoscroll = () =>{
    //new message 
    const newMessage = messages.lastElementChild

    //height of the last element
    const newMessageStyles = getComputedStyle(newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = newMessageMargin + newMessage.offsetHeight

    //Visible height
    const visibleHeight = messages.offsetHeight

    //height of the message container
    const containerHeight = messages.scrollHeight

    //how far i have scrolled
    const scrolled = messages.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrolled){
        messages.scrollTop = messages.scrollHeight
    }

}

socket.on('message', (count) => {
    console.log( count)

    const html = Mustache.render(messageTemplate,{
        username: count.userName,
        message: count.text,
        time: moment(count.createdAt).format('dddd, MMMM Do YYYY, h:mm:ss a')
    })
    messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('location', (url) => {
    const html = Mustache.render(locationTemplate,{
        username: url.userName,
        url: url.url,
        LocTime: moment(url.createdAt).format('dddd, MMMM Do YYYY, h:mm:ss a')
    })
    messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('roomData', ({room,users}) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    $messageButton.setAttribute('disabled','disabled')
   // const message = document.querySelector('input').value
   const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error) => {
        $messageButton.removeAttribute('disabled')
        $messageInput.value=''
        $messageInput.focus()

        if(error){
           return console.log(error)
        }
        console.log('The message was delivered!!')
    
    })
})

myLoc.addEventListener('click', () => {

    myLoc.setAttribute('disabled','disabled')
    if(!navigator.geolocation){
        return alert('Sorry but geolocation is not supported by your browser')
    }

    navigator.geolocation.getCurrentPosition((position) => {
        
        //console.log(position)
        socket.emit('sendLoc', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        },() => {
            console.log('Location shared successfully!')
            myLoc.removeAttribute('disabled')
        })
    })
})