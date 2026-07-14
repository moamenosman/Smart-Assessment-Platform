using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartAssessment.API.Server.Data;
using SmartAssessment.API.Server.DTOs;
using SmartAssessment.API.Server.Models;
using System.Security.Claims;

namespace SmartAssessment.API.Server.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class ExamController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ExamController(ApplicationDbContext context)
    {
        _context = context;
    }

    
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        int? studentId = null;

        if (User.IsInRole("Student"))
        {
            studentId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value
            );
        }

        var exams = await _context.Exams
            .Select(e => new ExamDto
            {
                Id = e.Id,
                Title = e.Title,
                Description = e.Description,
                Duration = e.Duration,
                StartTime = e.StartTime,
                EndTime = e.EndTime,
                PassPercentage = e.PassPercentage,
                InstructorId = e.InstructorId,

                AlreadySubmitted =
                    studentId.HasValue &&
                    _context.StudentExams.Any(se =>
                        se.StudentId == studentId.Value &&
                        se.ExamId == e.Id &&
                        se.SubmittedAt != null)
            })
            .ToListAsync();

        return Ok(exams);
    }


    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var exam = await _context.Exams.FindAsync(id);

        if (exam == null)
            return NotFound();

        return Ok(exam);
    }

    
    [HttpPost]
    [Authorize(Roles = "Instructor")]
    public async Task<IActionResult> Create(ExamDto dto)
    {

        var instructorId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var exam = new Exam
        {
            Title = dto.Title,
            Description = dto.Description,
            Duration = dto.Duration,
            StartTime = dto.StartTime,
            EndTime = dto.EndTime,
            PassPercentage = dto.PassPercentage,
            InstructorId = instructorId
        };

        _context.Exams.Add(exam);
        await _context.SaveChangesAsync();

        return Ok(exam);
    }

    
    [HttpPut("{id}")]
    [Authorize(Roles = "Instructor")]
    public async Task<IActionResult> Update(int id, ExamDto dto)
    {
        var exam = await _context.Exams.FindAsync(id);

        var instructorId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        if (exam == null)
            return NotFound();

        exam.Title = dto.Title;
        exam.Description = dto.Description;
        exam.Duration = dto.Duration;
        exam.StartTime = dto.StartTime;
        exam.EndTime = dto.EndTime;
        exam.PassPercentage = dto.PassPercentage;
        exam.InstructorId = instructorId;

        await _context.SaveChangesAsync();

        return Ok(exam);
    }

    
    [HttpDelete("{id}")]
    [Authorize(Roles = "Instructor")]
    public async Task<IActionResult> Delete(int id)
    {
        var exam = await _context.Exams
            .Include(e => e.Questions)
            .ThenInclude(q => q.Choices)
            .FirstOrDefaultAsync(e => e.Id == id);

        if (exam == null)
            return NotFound();

        var questionIds = exam.Questions.Select(q => q.Id).ToList();

        // StudentAnswers
        var answers = _context.StudentAnswers
            .Where(x => x.ExamId == id || questionIds.Contains(x.QuestionId));

        _context.StudentAnswers.RemoveRange(answers);

        // Choices
        var choices = _context.Choices
            .Where(c => questionIds.Contains(c.QuestionId));

        _context.Choices.RemoveRange(choices);

        // Questions
        _context.Questions.RemoveRange(exam.Questions);

        // Results
        var results = _context.Results.Where(r => r.ExamId == id);
        _context.Results.RemoveRange(results);

        // StudentExams
        var studentExams = _context.StudentExams.Where(s => s.ExamId == id);
        _context.StudentExams.RemoveRange(studentExams);

        // Exam
        _context.Exams.Remove(exam);

        await _context.SaveChangesAsync();

        return Ok("Exam Deleted Successfully");
    }
}