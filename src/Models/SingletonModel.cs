using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebChat.Models
{
    public class SingletonModel
    {
        private static SingletonModel _instance;

        public static SingletonModel Instance
        {
            get
            {
                if (_instance == null)               
                    _instance = new SingletonModel();               

                return _instance;
            }
        }
        public HashSet<User> OnlineUsers { get; set; }

        private SingletonModel()
        {
            OnlineUsers = new HashSet<User>(new UserComparer());
        }       
    }
}
