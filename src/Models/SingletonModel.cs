using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebChat.Models
{
    public class SingletonModel
    {
        private static SingletonModel _instance;

        public int OnlineUsersCount { get; set; }

        private SingletonModel()
        {

        }

        public static SingletonModel GetInstance()
        {
            if (_instance == null)
            {
                _instance = new SingletonModel();
            }

            return _instance;
        }
    }
}
