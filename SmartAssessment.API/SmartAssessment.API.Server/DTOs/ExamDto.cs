using System.ComponentModel.DataAnnotations;

namespace SmartAssessment.API.Server.DTOs;

public class ExamDto
{
    public int Id { get; set; }

    [Required]
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    [Required]
    public int Duration { get; set; }

    [Required]
    public DateTime StartTime { get; set; }

    [Required]
    public DateTime EndTime { get; set; }

    public int PassPercentage { get; set; } = 50;

    public int InstructorId { get; set; }

    public bool AlreadySubmitted { get; set; }
}