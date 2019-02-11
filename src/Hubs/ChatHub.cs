using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebChat.Models;
using Newtonsoft.Json;

namespace WebChat.Hubs
{
    public class ChatHub : Hub
    {
        private readonly ApplicationDbContext _db;
        private readonly SingletonModel _model;

        public ChatHub(ApplicationDbContext db)
        {
            _db = db;
            _model = SingletonModel.Instance;
        }

        public override Task OnConnectedAsync()
        {
            var username = Context.User.Identity.Name;
            var onlineUser = _db.Users.Where(i => i.UserName == username).FirstOrDefault();
            _model.OnlineUsers.Add(new OnlineUser(onlineUser.Id)
            {
                UserName = onlineUser.UserName,
                Avatar = onlineUser.ProfilePhoto.GetDataBase64()
            });

            var onlineUsersJson = JsonConvert.SerializeObject(_model.OnlineUsers);
            Clients.All.SendAsync("UpdateOnlineList", onlineUsersJson);
            
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            var username = Context.User.Identity.Name;
            var disconnectingUser = _db.Users.Where(i => i.UserName == username).FirstOrDefault();
            _model.OnlineUsers.Remove(new OnlineUser(disconnectingUser.Id)
            {
                UserName = disconnectingUser.UserName,
                Avatar = disconnectingUser.ProfilePhoto.GetDataBase64()
            });

            var onlineUsersJson = JsonConvert.SerializeObject(_model.OnlineUsers);
            Clients.All.SendAsync("UpdateOnlineList", onlineUsersJson);

            return base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(string message)
        {
            var username = Context.User.Identity.Name;
            var avatarPhoto = _db.Users.Where(i => i.UserName == username).FirstOrDefault().ProfilePhoto.GetDataBase64();

            await Clients.All.SendAsync("ReceiveMessage", username, avatarPhoto, message);           
        }
    }
}
