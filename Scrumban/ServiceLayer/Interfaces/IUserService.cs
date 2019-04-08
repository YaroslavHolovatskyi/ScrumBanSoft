﻿using Scrumban.ServiceLayer.Entities.DTO;
using System.Collections.Generic;

namespace Scrumban.ServiceLayer.Interfaces
{
    interface IUserService
    {
        List<UserDTO> GetAllUsers();
        //To Add new user   
        int AddUser(UserDTO user);
        //To Update user  
        int UpdateUser(UserDTO user);
        //Get the details of a user   
        UserDTO GetUserData(int id);
        //To Delete the record of a user 
        int DeleteUser(int id);
        bool CheckAvailability(string email, string password);
        //To get user 
        UserDTO GetUserAccount(string email, string password);
    }
}