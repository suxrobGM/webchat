using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;


namespace WebChat.Models
{
    public class User : IdentityUser<string>
    {
        public User()
        {
            RegistrationDate = DateTime.Now;
        }
           
        public string ProfilePhotoId { get; set; }
        public DateTime? RegistrationDate { get; set; }
        public virtual Media ProfilePhoto { get; set; }        
    }

    public class UserComparer : IEqualityComparer<User>
    {
        public bool Equals(User user1, User user2)
        {
            return user1.Id == user2.Id;
        }

        public int GetHashCode(User user)
        {
            return StringComparer.InvariantCultureIgnoreCase.GetHashCode(user.UserName);
        }
    }
}