using System.Collections.Concurrent;
using Microsoft.AspNetCore.Mvc;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("TaskBoardUi", policy =>
    {
        _ = policy.AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});
builder.Services.AddOpenApi();

WebApplication app = builder.Build();

if (app.Environment.IsDevelopment())
{
    _ = app.MapOpenApi();
}

app.Use((context, next) =>
{
    Console.WriteLine($"Incoming request: {context.Request.Method} {context.Request.Path}");
    return next();
});

app.UseRouting();
app.UseCors("TaskBoardUi");

User[] users =
[
    new User(1, "Avery Patel"),
    new User(2, "Jordan Lee"),
    new User(3, "Sam Rivera"),
    new User(4, "Taylor Kim")
];

ConcurrentDictionary<int, BoardTask> tasks = new();
int nextTaskId = 4;

tasks.TryAdd(1, new BoardTask(1, "Create task API", "Expose endpoints for task CRUD.", TaskStatus.InProgress, 1));
tasks.TryAdd(2, new BoardTask(2, "Build task list", "Show tasks grouped by status.", TaskStatus.ToDo, 2));
tasks.TryAdd(3, new BoardTask(3, "Draft PR template", "Add a lightweight review checklist.", TaskStatus.Done, 3));

RouteGroupBuilder api = app.MapGroup("/api").RequireCors("TaskBoardUi");

api.MapGet("/users", () => Results.Ok(users));

api.MapGet("/health", () => Results.Ok(new { Status = "Healthy" }));

api.MapGet("/tasks", () =>
{
    IOrderedEnumerable<BoardTask> orderedTasks = tasks.Values.OrderBy(task => task.Id);
    return Results.Ok(orderedTasks);
});

api.MapGet("/tasks/{id:int}", (int id) =>
{
    return tasks.TryGetValue(id, out BoardTask? task)
        ? Results.Ok(task)
        : Results.NotFound();
});

api.MapPost("/tasks", (TaskRequest request) =>
{
    if (string.IsNullOrWhiteSpace(request.Title))
    {
        return Results.BadRequest("Title is required.");
    }

    if (!users.Any(user => user.Id == request.AssignedUserId))
    {
        return Results.BadRequest("Assigned user was not found.");
    }

    int id = Interlocked.Increment(ref nextTaskId);
    BoardTask task = new(
        id,
        request.Title.Trim(),
        request.Description.Trim(),
        request.Status,
        request.AssignedUserId);

    tasks[id] = task;
    return Results.Created($"/api/tasks/{id}", task);
});

api.MapPut("/tasks/{id:int}", (int id, TaskRequest request) =>
{
    if (!tasks.ContainsKey(id))
    {
        return Results.NotFound();
    }

    if (string.IsNullOrWhiteSpace(request.Title))
    {
        return Results.BadRequest("Title is required.");
    }

    if (!users.Any(user => user.Id == request.AssignedUserId))
    {
        return Results.BadRequest("Assigned user was not found.");
    }

    BoardTask task = new(
        id,
        request.Title.Trim(),
        request.Description.Trim(),
        request.Status,
        request.AssignedUserId);

    tasks[id] = task;
    return Results.Ok(task);
});

api.MapPatch("/tasks/{id:int}/status", (int id, StatusRequest request) =>
{
    if (!tasks.TryGetValue(id, out BoardTask? task))
    {
        return Results.NotFound();
    }

    BoardTask updatedTask = task with { Status = request.Status };
    tasks[id] = updatedTask;
    return Results.Ok(updatedTask);
});

api.MapDelete("/tasks/{id:int}", (int id) =>
{
    return tasks.TryRemove(id, out _)
        ? Results.NoContent()
        : Results.NotFound();
});

app.Run();

internal sealed record User(int Id, string Name);

internal sealed record BoardTask(
    int Id,
    string Title,
    string Description,
    TaskStatus Status,
    int AssignedUserId);

internal sealed record TaskRequest(
    string Title,
    string Description,
    TaskStatus Status,
    int AssignedUserId);

internal sealed record StatusRequest(TaskStatus Status);

internal enum TaskStatus
{
    ToDo,
    InProgress,
    Done
}
