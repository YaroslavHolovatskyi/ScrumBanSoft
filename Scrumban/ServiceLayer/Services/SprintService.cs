﻿using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Scrumban.DataAccessLayer;
using Scrumban.DataAccessLayer.Interfaces;
using Scrumban.DataAccessLayer.Models;
using Scrumban.ServiceLayer.DTO;
using Scrumban.ServiceLayer.Interfaces;

namespace Scrumban.ServiceLayer.Services
{
    public class SprintService: ISprintService
    {
        IUnitOfWork _unitOfWork;

        public SprintService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public void Create(SprintDTO sprint)
        {
            int sprintStatus_id = _unitOfWork.SprintStatusRepository.GetByCondition(status => status.StatusName == sprint.SprintStatus).SprintStatus_id;
            SprintDAL sprintDAL = new SprintDAL
            {
                Name = sprint.Name,
                Description = sprint.Description,
                StartDate = sprint.StartDate,
                EndDate = sprint.EndDate,
                SprintStatus_id = sprintStatus_id
            };

            _unitOfWork.SprintRepository.Create(sprintDAL);
            _unitOfWork.Save();
        }

        public void Delete(int id)
        {
            _unitOfWork.SprintRepository.Delete(id);
            _unitOfWork.Save();
        }

        public void Delete(SprintDTO sprint)
        {
            SprintDAL sprintDAL = new SprintDAL()
            {
                Sprint_id = sprint.Sprint_id
            };
            _unitOfWork.SprintRepository.Delete(sprintDAL);
            _unitOfWork.Save();
        }

        public IQueryable<SprintDTO> GetAllSprints()
        {
            IQueryable<SprintDAL> sprintsDAL = _unitOfWork.SprintRepository.GetAll();
            IQueryable<SprintDTO> sprintsDTO = sprintsDAL.Select(sprintDAL => new SprintDTO()
            {
                Sprint_id = sprintDAL.Sprint_id,
                Name = sprintDAL.Name,
                Description = sprintDAL.Description,
                StartDate = sprintDAL.StartDate,
                EndDate = sprintDAL.EndDate,
                SprintStatus = sprintDAL.Status.StatusName
            });
            return sprintsDTO.AsQueryable();
        }

        public IList<SprintStatusDTO> GetAllStatuses()
        {
            var statusesDAL = _unitOfWork.SprintStatusRepository.GetAll();
            List<SprintStatusDTO> statuses = new List<SprintStatusDTO>();
            foreach(var status in statusesDAL)
            {
                statuses.Add(new SprintStatusDTO() { SprintStatus = status.StatusName });
            }
            return statuses;
        }

        public SprintDTO GetByID(int id)
        {
            SprintDAL sprintDAL = _unitOfWork.SprintRepository.GetByID(id);
            SprintDTO sprint = new SprintDTO()
            {
                Sprint_id = sprintDAL.Sprint_id,
                Name = sprintDAL.Name,
                Description = sprintDAL.Description,
                StartDate = sprintDAL.StartDate,
                EndDate = sprintDAL.EndDate,
                SprintStatus = sprintDAL.Status.StatusName
            };
            return sprint;
        }

        public void Update(SprintDTO sprintDTO)
        {
            var sprintDAL = _unitOfWork.SprintRepository.GetByID(sprintDTO.Sprint_id);
            sprintDAL.Name = sprintDTO.Name;
            sprintDAL.Description = sprintDTO.Description;
            sprintDAL.StartDate = sprintDTO.StartDate;
            sprintDAL.EndDate = sprintDTO.EndDate;

            sprintDAL.SprintStatus_id = _unitOfWork.SprintStatusRepository.GetByCondition(sprintStatus => sprintStatus.StatusName == sprintDTO.SprintStatus).SprintStatus_id;
            _unitOfWork.Save();
        }
    }
}
