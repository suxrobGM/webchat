using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebChat.Models;

namespace WebChat.Hubs
{
    public class ChatHub : Hub
    {
        public override Task OnConnectedAsync()
        {
            var model = SingletonModel.GetInstance();
            var count = ++model.OnlineUsersCount;

            Clients.All.SendAsync("UpdateOnlineUsersCount", count);

            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            var model = SingletonModel.GetInstance();
            var count = model.OnlineUsersCount;
            if (count > 0)
            {
                count = --model.OnlineUsersCount;
            }

            Clients.All.SendAsync("UpdateOnlineUsersCount", count);

            return base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(string user, string message)
        {            
            await Clients.All.SendAsync("ReceiveMessage", user, message);           
        }
    }
}
