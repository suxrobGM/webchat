using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using WebChat.Models;

namespace WebChat.Pages.ChatExperimental
{
    [Authorize]
    public class IndexModel : PageModel
    {
        public int OnlineUsersCount { get; set; }

        public void OnGet()
        {
            OnlineUsersCount = SingletonModel.GetInstance().OnlineUsersCount;
        }
    }
}