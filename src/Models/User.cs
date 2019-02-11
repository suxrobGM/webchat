using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace WebChat.Models
{
    public interface IUser
    {
        string GetUserId();
    }

    public class User : IdentityUser<string>, IUser
    {
        public User()
        {
            RegistrationDate = DateTime.Now;
        }
           
        public string ProfilePhotoId { get; set; }
        public DateTime? RegistrationDate { get; set; }
        public virtual Media ProfilePhoto { get; set; }

        public string GetUserId() => base.Id;
    }

    public class UserComparer : IEqualityComparer<IUser>
    {
        public bool Equals(IUser user1, IUser user2) => user1.GetUserId() == user2.GetUserId();

        public int GetHashCode(IUser user) => StringComparer.InvariantCultureIgnoreCase.GetHashCode(user.GetUserId());
    }


    public class OnlineUser : IUser
    {
        private readonly string _userId;

        public string UserName { get; set; }
        public string Avatar { get; set; }

        public OnlineUser(string userId) => _userId = userId;

        public string GetUserId() => _userId;
    }
}