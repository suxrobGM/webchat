// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your Javascript code.

$("#ajaxGet").click(() => {
    $.ajax({
        type: "GET",
        url: "/Chat?handler=List",
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            var dvItems = $("#dvItems");
            dvItems.empty();
            $.each(response, function (i, item) {
                var $tr = $('<li>').append(item).appendTo(dvItems);
            });
        },
        failure: function (response) {
            alert(response);
        }
    })
})

function onSelectGroup(groupId)
{
    $.ajax({
        type: "GET",
        url: `/Chat?handler=Group&groupId=${groupId}`,        
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            let group = JSON.parse(response);
            $("#groupName").text(group.Name);            
            
        },
        failure: function (response) {
            alert(response);
        }
    })
}