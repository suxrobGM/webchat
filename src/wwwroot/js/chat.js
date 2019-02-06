"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();
var isConnectedToChatRoom = false;

$("#chatRoom").click(() => {
    isConnectedToChatRoom = true;
})

$("#sendMessage").click(event => {
    //if (!isConnectedToChatRoom) {
    //    return;
    //}

    let user = $("#userName").text();
    let message = document.getElementById("messageInput").value;

    connection.invoke("SendMessage", user, message).catch(err => {
        return console.error(err.toString());
    });
    event.preventDefault();
});

connection.on("ReceiveMessage", (user, message) => {
    let userNodes = $.parseHTML("<strong>" + user + "</strong>");
    let messageNodes = $.parseHTML(message);
    let currentUser = $("#userName").text();
    let msgItem;

    if (currentUser == user) {
        // left item       

        msgItem = createMessageElement(userNodes[0], messageNodes);
    }
    else {
        // right item
        msgItem = createMessageElement(userNodes[0], messageNodes, false);
    }
    

    let messagesList = document.getElementById("messagesList");
    messagesList.appendChild(msgItem);
    messagesList.scrollTo(0, messagesList.scrollHeight);
});

connection.on("UpdateOnlineUsersCount", count => {
    //let currentUser = $("#userName").text();

    document.getElementById("onlineUsersCount").innerHTML = "Online users: " + count;
});

connection.start().catch(err => {
    return console.error(err.toString());
});

function createMessageElement(userNode, messageNodes, isLeft = true) {
    let msgItem = document.createElement('div');   

    let imgElement = document.createElement('img');
    imgElement.setAttribute('src', '/img/default_user_photo.jpg');
    imgElement.setAttribute('class', 'rounded-circle');
    imgElement.setAttribute('alt', 'avatar');
    imgElement.setAttribute('style', 'width: 30px; height: 30px');

    let imgDiv = document.createElement('div');
    imgDiv.appendChild(imgElement);

    let msgDiv = document.createElement('div');   
    msgDiv.setAttribute('style', 'background-color: rgba(206, 212, 218, 0.75)');
    msgDiv.appendChild(userNode);

    for (var i = 0; i < messageNodes.length; i++) {
        msgDiv.appendChild(messageNodes[i]);
    }

    if (isLeft) {
        imgDiv.setAttribute('class', '');
        msgDiv.setAttribute('class', 'messageNoMargin rounded mx-2 p-1');
        msgItem.setAttribute('class', 'row float-left w-100 mt-2');
        msgItem.appendChild(imgDiv);
        msgItem.appendChild(msgDiv);
    }
    else {
        imgDiv.setAttribute('class', 'ml-2');
        msgDiv.setAttribute('class', 'messageNoMargin rounded ml-auto p-1');
        msgItem.setAttribute('class', 'row float-right w-100 mt-2');
        msgItem.appendChild(msgDiv);
        msgItem.appendChild(imgDiv);        
    }

    return msgItem;
}

$("#messageInput").summernote({
    airMode: true,
    focus: true,
    tabsize: 2,
    placeholder: "Type message ...",
    /*toolbar: [
        'picture',
        'video',
        'link'
    ]*/
    popover: {        
        air: [
            ['color', ['color']],
            ['font', ['bold', 'underline', 'clear']],
            ['para', ['ul', 'paragraph']],
            ['video', ['video']],
            ['insert', ['link', 'picture']]
        ]
    }
})
