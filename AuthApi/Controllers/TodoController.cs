using System.Security.Claims;
using AuthApi.Data;
using AuthApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AuthApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TodoController : ControllerBase
{
  private readonly ApplicationDbContext _db;
  public TodoController(ApplicationDbContext db) { _db = db; }

  [HttpGet]
  public async Task<ActionResult<IEnumerable<TodoItem>>> Get()
  {
    var userId = User.FindFirstValue("sub")!;
    var items = await _db.TodoItems.Where(t => t.OwnerId == userId).ToListAsync();
    return items;
  }

  [HttpPost]
  public async Task<ActionResult<TodoItem>> Create([FromBody] TodoItem item)
  {
    var userId = User.FindFirstValue("sub")!;
    item.OwnerId = userId;
    item.Id = 0;
    _db.TodoItems.Add(item);
    await _db.SaveChangesAsync();
    return CreatedAtAction(nameof(GetById), new { id = item.Id }, item);
  }

  [HttpGet("{id:int}")]
  public async Task<ActionResult<TodoItem>> GetById(int id)
  {
    var userId = User.FindFirstValue("sub")!;
    var item = await _db.TodoItems.FirstOrDefaultAsync(t => t.Id == id && t.OwnerId == userId);
    if (item == null) return NotFound();
    return item;
  }

  [HttpPut("{id:int}")]
  public async Task<IActionResult> Update(int id, TodoItem update)
  {
    var userId = User.FindFirstValue("sub")!;
    var item = await _db.TodoItems.FirstOrDefaultAsync(t => t.Id == id && t.OwnerId == userId);
    if (item == null) return NotFound();
    item.Title = update.Title;
    item.IsCompleted = update.IsCompleted;
    await _db.SaveChangesAsync();
    return NoContent();
  }

  [HttpDelete("{id:int}")]
  public async Task<IActionResult> Delete(int id)
  {
    var userId = User.FindFirstValue("sub")!;
    var item = await _db.TodoItems.FirstOrDefaultAsync(t => t.Id == id && t.OwnerId == userId);
    if (item == null) return NotFound();
    _db.TodoItems.Remove(item);
    await _db.SaveChangesAsync();
    return NoContent();
  }
}
