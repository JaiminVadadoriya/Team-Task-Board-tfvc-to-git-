using System.Collections.Concurrent;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("TaskBoardUi", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});
builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("TaskBoardUi");

var users = new[]
{
    new User(1, "Avery Patel"),
    new User(2, "Jordan Lee"),
    new User(3, "Sam Rivera"),
    new User(4, "Taylor Kim")
};

var tasks = new ConcurrentDictionary<int, BoardTask>();
var nextTaskId = 4;

tasks.TryAdd(1, new BoardTask(1, "Create task API", "Expose endpoints for task CRUD.", TaskStatus.InProgress, 1));
tasks.TryAdd(2, new BoardTask(2, "Build task list", "Show tasks grouped by status.", TaskStatus.ToDo, 2));
tasks.TryAdd(3, new BoardTask(3, "Draft PR template", "Add a lightweight review checklist.", TaskStatus.Done, 3));

app.MapGet("/api/users", () => Results.Ok(users));

app.MapGet("/api/tasks", () =>
{
    var orderedTasks = tasks.Values.OrderBy(task => task.Id);
    return Results.Ok(orderedTasks);
});

app.MapGet("/api/tasks/{id:int}", (int id) =>
{
    return tasks.TryGetValue(id, out var task)
        ? Results.Ok(task)
        : Results.NotFound();
});

app.MapPost("/api/tasks", (TaskRequest request) =>
{
    if (string.IsNullOrWhiteSpace(request.Title))
    {
        return Results.BadRequest("Title is required.");
    }

    if (!users.Any(user => user.Id == request.AssignedUserId))
    {
        return Results.BadRequest("Assigned user was not found.");
    }

    var id = Interlocked.Increment(ref nextTaskId);
    var task = new BoardTask(
        id,
        request.Title.Trim(),
        request.Description.Trim(),
        request.Status,
        request.AssignedUserId);

    tasks[id] = task;
    return Results.Created($"/api/tasks/{id}", task);
});

app.MapPut("/api/tasks/{id:int}", (int id, TaskRequest request) =>
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

    var task = new BoardTask(
        id,
        request.Title.Trim(),
        request.Description.Trim(),
        request.Status,
        request.AssignedUserId);

    tasks[id] = task;
    return Results.Ok(task);
});

app.MapPatch("/api/tasks/{id:int}/status", (int id, StatusRequest request) =>
{
    if (!tasks.TryGetValue(id, out var task))
    {
        return Results.NotFound();
    }

    var updatedTask = task with { Status = request.Status };
    tasks[id] = updatedTask;
    return Results.Ok(updatedTask);
});

app.MapDelete("/api/tasks/{id:int}", (int id) =>
{
    return tasks.TryRemove(id, out _)
        ? Results.NoContent()
        : Results.NotFound();
});

app.Run();

record User(int Id, string Name);

record BoardTask(
    int Id,
    string Title,
    string Description,
    TaskStatus Status,
    int AssignedUserId);

record TaskRequest(
    string Title,
    string Description,
    TaskStatus Status,
    int AssignedUserId);

record StatusRequest(TaskStatus Status);

enum TaskStatus
{
    ToDo,
    InProgress,
    Done
}
