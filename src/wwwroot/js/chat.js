var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();
var isConnectedToChatRoom = false;

connection.start().catch(err => {
    return console.error(err.toString());
});

$("#chatRoom").click(() => {
    isConnectedToChatRoom = true;
})

$("#sendMessage").click(e => {
    //if (!this.isConnectedToChatRoom) {
    //    return;
    //}
    
    let message = document.getElementById("messageInput").value;

    connection.invoke("SendMessage", message).catch(err => {
        return console.error(err.toString());
    });
    e.preventDefault();
});

connection.on("ReceiveMessage", (username, avatarPhoto, message) => {
    let userNodes = $.parseHTML("<p><b>" + username + "</b></p>");
    let messageNodes = $.parseHTML(message);
    let currentUser = $("#userName").text();
    let msgItem;

    if (currentUser == username) {          
        msgItem = createMessageElement(userNodes[0], avatarPhoto, messageNodes); // left item  
    }
    else {
        msgItem = createMessageElement(userNodes[0], avatarPhoto, messageNodes, false); // right item
    }   

    let messagesList = document.getElementById("messagesList");
    messagesList.appendChild(msgItem);
    messagesList.scrollTo(0, messagesList.scrollHeight);
});

connection.on("UpdateOnlineList", onlineUsersJson => {    
    let onlineUsers = JSON.parse(onlineUsersJson);
    document.getElementById("onlineUsersCount").innerHTML = "Online users: " + onlineUsers.length;
    let onlineUserItems = createOnlineUserItems(onlineUsers);
    $("#onlineUsersList").html(onlineUserItems);
});

function createMessageElement(userNode, avatarPhotoText , messageNodes, isLeft = true) {
    let msgLayout = document.createElement('div');

    let imgElement = document.createElement('img');
    imgElement.setAttribute('src', avatarPhotoText);  
    imgElement.setAttribute('alt', 'avatar');

    let msgDiv = document.createElement('div');   
    msgDiv.appendChild(userNode);

    for (var i = 0; i < messageNodes.length; i++) {
        msgDiv.appendChild(messageNodes[i]);
    }

    if (isLeft) {
        imgElement.setAttribute('class', 'message-avatar rounded-circle');
        msgDiv.setAttribute('class', 'message-item message-no-margin rounded p-1 mx-2');
        msgLayout.setAttribute('class', 'row float-left w-100 mt-2');
        msgLayout.appendChild(imgElement);
        msgLayout.appendChild(msgDiv);
    }
    else {
        imgElement.setAttribute('class', 'message-avatar rounded-circle ml-2');
        msgDiv.setAttribute('class', 'message-item message-no-margin rounded p-1 ml-auto');
        msgLayout.setAttribute('class', 'row float-right w-100 mt-2');
        msgLayout.appendChild(msgDiv);
        msgLayout.appendChild(imgElement);        
    }

    return msgLayout;
}

function createOnlineUserItems(onlineUsers) {
    let rootDiv = document.createElement('div');

    for (var i = 0; i < onlineUsers.length; i++) {
        let layoutDiv = document.createElement('div');
        layoutDiv.setAttribute('class', 'mt-2');
        layoutDiv.setAttribute('id', onlineUsers[i].UserName);

        let img = document.createElement('img');
        img.setAttribute('src', onlineUsers[i].Avatar);
        img.setAttribute('class', 'rounded-circle');
        img.setAttribute('style', 'width: 30px; height: 30px');
        img.setAttribute('alt', 'avatar');

        let usernameNode = document.createElement('b');
        usernameNode.setAttribute('class', 'ml-1');
        usernameNode.innerText = onlineUsers[i].UserName;

        layoutDiv.appendChild(img);
        layoutDiv.appendChild(usernameNode);
        rootDiv.appendChild(layoutDiv);
    }

    return rootDiv;
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

$("#sidebarToggler").click(() => {
    let sidebarShowed = $("#onlineUsersListSidebar").hasClass("chat-sidebar-show");

    if (!sidebarShowed) {
        $("#onlineUsersListSidebar").addClass("chat-sidebar-show");
        $("#backgroundFade").addClass("background-fade-show");
        $("#sidebarToggler").text(">>");
    }
    else {
        $("#onlineUsersListSidebar").removeClass("chat-sidebar-show");
        $("#backgroundFade").removeClass("background-fade-show");
        $("#sidebarToggler").text("<<");
    }
});
