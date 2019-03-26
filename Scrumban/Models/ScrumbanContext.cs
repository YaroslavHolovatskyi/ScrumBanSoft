using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using CustomIdentityApp.Models;
using Scrumban.TaskModel.Models;

namespace Scrumban.Models
{
    public class ScrumbanContext : DbContext
    {
        public ScrumbanContext(DbContextOptions<ScrumbanContext> options) : base(options)
        {
            Database.EnsureCreated();
        }
        public DbSet<Users> Users { get; set; }
        public DbSet<TaskModel.Models.Task> Tasks { get; set; }
        public DbSet<State> States { get; set; }
        public DbSet<TaskState> TaskStates { get; set; }
        public DbSet<Priority> Priorities { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<TaskState>().HasData(
                new TaskState[]
                {
                    new TaskState{Id = 1, Name = "To Do"},
                    new TaskState{Id = 2, Name = "In Progress"},
                    new TaskState{Id = 3, Name = "Completed"}
                }
            );
            modelBuilder.Entity<State>().HasData(
                new State[]
                {
                    new State{Id = 1, Name = "Ready To Start"},
                    new State{Id = 2, Name = "In Progress"},
                    new State{Id = 3, Name = "Development Complete"},
                    new State{Id = 4, Name = "Test Complete"},
                    new State{Id = 5, Name = "Accepted"}
                }
            );
            modelBuilder.Entity<Priority>().HasData(
                new Priority[]
                {
                    new Priority{Id = 1, Name = "Low"},
                    new Priority{Id = 2, Name = "Medium"},
                    new Priority{Id = 3, Name = "Heigh"},
                    new Priority{Id = 4, Name = "Immediate"}
                }
            );
            modelBuilder.Entity<TaskModel.Models.Task>().HasData(
                new TaskModel.Models.Task[]
                {
                    new TaskModel.Models.Task { Id = 1, Name = "Task1" },
                    new TaskModel.Models.Task { Id = 2, Name = "Task2" },
                    new TaskModel.Models.Task { Id = 3, Name = "Task3" }
                }
            );
            base.OnModelCreating(modelBuilder);
        }
    }
}
