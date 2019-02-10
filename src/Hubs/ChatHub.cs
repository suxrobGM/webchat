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

        public int OnlineUsersCount { get => _model.OnlineUsers.Count; } 

        public ChatHub(ApplicationDbContext db)
        {
            _db = db;
            _model = SingletonModel.Instance;
        }

        public override Task OnConnectedAsync()
        {
            string username = Context.User.Identity.Name;
            var onlineUser = _db.Users.Where(i => i.UserName == username).FirstOrDefault();
            var userAvatar = onlineUser.ProfilePhoto.GetDataBase64();
            _model.OnlineUsers.Add(onlineUser);
            Clients.All.SendAsync("AddToOnlineList", onlineUser.UserName, userAvatar, OnlineUsersCount);
            
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            string username = Context.User.Identity.Name;
            var disconnectingUser = _db.Users.Where(i => i.UserName == username).FirstOrDefault();
            _model.OnlineUsers.Remove(disconnectingUser);
            Clients.All.SendAsync("DeleteFromOnlineList", disconnectingUser.UserName, OnlineUsersCount);

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
