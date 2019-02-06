using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace WebChat.Models
{
    public enum Role
    {
        SuperAdmin,
        Admin,
        Moderator        
    }

    public class UserRole : IdentityRole
    {
        public UserRole(Role role): base(role.ToString())
        {
            Role = role;            
        }

        public Role Role { get; set; }        
    }
}
