const socket = io();

socket.on("message", (msg) => {
    console.log(msg);
});

const $msgForm = document.querySelector("form");
const $msgFormInput = $msgForm.querySelector('input')
const $msgFormButton = $msgForm.querySelector('button')
const $sendLoc = document.querySelector("#send-location")
const $messages = document.querySelector('#messages')

const $msgTemplate = document.querySelector('#message-template').innerHTML

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

socket.on("updateMsg", (msg) => {
    console.log(msg);
    const html = Mustache.render($msgTemplate, { msg })
    $messages.insertAdjacentHTML('beforeend', html)
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
                console.log(error)
            } else {
                console.log('Location Shared!')
            }
        });
    });
    $sendLoc.removeAttribute('disabled')
});