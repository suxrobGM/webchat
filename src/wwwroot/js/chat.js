var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();
var isConnectedToChatRoom = false;

$("#chatRoom").click(() => {
    isConnectedToChatRoom = true;
})

$("#sendMessage").click(event => {
    //if (!isConnectedToChatRoom) {
    //    return;
    //}
    
    let message = document.getElementById("messageInput").value;

    connection.invoke("SendMessage", message).catch(err => {
        return console.error(err.toString());
    });
    event.preventDefault();
});


connection.on("ReceiveMessage", (username, avatarPhoto, message) => {
    let userNodes = $.parseHTML("<strong>" + username + "</strong>");
    let messageNodes = $.parseHTML(message);
    let currentUser = $("#userName").text();
    let msgItem;

    if (currentUser == username) {
        // left item       
        msgItem = createMessageElement(userNodes[0], avatarPhoto, messageNodes);
    }
    else {
        // right item
        msgItem = createMessageElement(userNodes[0], avatarPhoto, messageNodes, false);
    }   

    let messagesList = document.getElementById("messagesList");
    messagesList.appendChild(msgItem);
    messagesList.scrollTo(0, messagesList.scrollHeight);
});

connection.on("AddToOnlineList", (username, avatar, onlineUsersCount) => {    

    document.getElementById("onlineUsersCount").innerHTML = "Online users: " + onlineUsersCount;
    let onlineUserItem = createOnlineUserItem(username, avatar);
    document.getElementById("onlineUsersList").appendChild(onlineUserItem);
});

connection.on("DeleteFromOnlineList", (username, onlineUsersCount) => {

    document.getElementById("onlineUsersCount").innerHTML = "Online users: " + onlineUsersCount;
    let onlineUserItem = document.getElementById(username);
    document.getElementById("onlineUsersList").removeChild(onlineUserItem);
});

connection.start().catch(err => {
    return console.error(err.toString());
});

function createMessageElement(userNode, avatarPhotoText , messageNodes, isLeft = true) {
    let msgItem = document.createElement('div');   

    let imgElement = document.createElement('img');
    imgElement.setAttribute('src', avatarPhotoText);
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

function createOnlineUserItem(username, avatar) {
    let mainDiv = document.createElement('div');
    mainDiv.setAttribute('id', username)
    mainDiv.setAttribute('class', 'row');

    let img = document.createElement('img');
    img.setAttribute('src', avatar);
    img.setAttribute('class', 'rounded-circle');
    img.setAttribute('style', 'width: 30px; height: 30px');
    img.setAttribute('alt', 'avatar');

    let usernameNode = document.createElement('b');
    usernameNode.setAttribute('class', 'ml-1');
    usernameNode.innerText = username;

    mainDiv.appendChild(img);
    mainDiv.appendChild(usernameNode);

    return mainDiv;
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
