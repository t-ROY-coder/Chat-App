const socket = io();

const $msgForm = document.querySelector("form");
const $msgFormInput = $msgForm.querySelector('input')
const $msgFormButton = $msgForm.querySelector('button')
const $sendLoc = document.querySelector("#send-location")
const $messages = document.querySelector('#messages')

const $msgTemplate = document.querySelector('#message-template').innerHTML
const $urlTemplate = document.querySelector('#url-template').innerHTML
const $notficationTemplate = document.querySelector('#notification-template').innerHTML

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

socket.on("message", (msg) => {
    console.log(msg);
    const html = Mustache.render($notficationTemplate, {
        notification: msg.text,
        createdAt: moment(msg.createdAt).format('h:mm A')
    })
    $messages.insertAdjacentHTML('beforeend', html)
});

socket.on("locationMessage", (url) => {
    console.log(url);
    const html = Mustache.render($urlTemplate, {
        username: url.username,
        url: url.text,
        createdAt: moment(url.createdAt).format('h:mm A')
    })
    $messages.insertAdjacentHTML('beforeend', html)
});

socket.on("updateMsg", (msg) => {
    console.log(msg);
    const html = Mustache.render($msgTemplate, {
        username: msg.username,
        msg: msg.text,
        createdAt: moment(msg.createdAt).format('h:mm A')
    })
    $messages.insertAdjacentHTML('beforeend', html)
});

$msgForm.addEventListener("submit", (e) => {
    e.preventDefault();
    $msgFormButton.setAttribute('disabled', 'disabled')
    const msg = e.target.elements.message.value;

    socket.emit("sendMsg", msg, (error) => {
        $msgFormButton.removeAttribute('disabled')
        $msgFormInput.value = ''
        $msgFormInput.focus()
        if (error) {
            console.log(error)
        } else {
            console.log("Delivered!");
        }
    });
});


$sendLoc.addEventListener("click", () => {
    if (!navigator.geolocation) {
        return alert("Geolocation is not supported by your browser");
    }
    $sendLoc.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit("sendLocation", {
            lat: position.coords.latitude,
            long: position.coords.longitude,
        }, (error) => {
            if (error) {
                alert(error)
            } else {
                alert('Current Location Shared!')
            }
        });
    });
    $sendLoc.removeAttribute('disabled')
});

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})