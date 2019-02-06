﻿using System;
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
}