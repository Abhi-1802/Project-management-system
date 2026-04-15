import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProjects } from "@/contexts/ProjectContext";
import type { Task, TaskStatus, TaskPriority, Project } from "@/types";
import TaskCard from "@/components/tasks/TaskCard";
import TaskDialog from "@/components/tasks/TaskDialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const columns: { status: TaskStatus; label: string; accent: string }[] = [
  { status: "todo", label: "To Do", accent: "bg-muted-foreground" },
  { status: "in-progress", label: "In Progress", accent: "bg-warning" },
  { status: "completed", label: "Completed", accent: "bg-success" },
];

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProject, addTask, updateTask, deleteTask, changeTaskStatus, fetchTasks } = useProjects();
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const loadProject = async () => {
    try {
      const data = await getProject(id!);
      setProject(data);
    } catch {
      toast({ title: "Error", description: "Project not found", variant: "destructive" });
      navigate("/dashboard");
      return;
    }
  };

  const loadTasks = async () => {
    try {
      const data = await fetchTasks(id!, 1, 100);
      setTasks(data.tasks);
    } catch {
      setTasks([]);
    }
  };

  useEffect(() => {
    const load = async () => {
      await loadProject();
      await loadTasks();
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!project) return <div className="p-8 text-center text-muted-foreground">Project not found</div>;

  const handleAdd = async (title: string, description: string, priority: TaskPriority) => {
    await addTask(project._id, title, description, priority);
    await loadTasks();
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const handleUpdate = async (title: string, description: string, priority: TaskPriority) => {
    if (editingTask) {
      await updateTask(project._id, editingTask._id, { title, description, priority });
      setEditingTask(null);
      await loadTasks();
    }
  };

  const handleDelete = async (taskId: string) => {
    await deleteTask(project._id, taskId);
    await loadTasks();
  };

  const handleStatusChange = async (taskId: string, status: TaskStatus) => {
    await changeTaskStatus(project._id, taskId, status);
    await loadTasks();
  };

  return (
    <div className="animate-fade-in space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: project.color || "#3b82f6" }} />
            <h1 className="text-2xl font-heading font-bold">{project.projectName}</h1>
          </div>
        </div>
        <Button onClick={() => { setEditingTask(null); setDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </div>

      {project.description && (
        <p className="text-muted-foreground text-sm">{project.description}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.status);
          return (
            <div key={col.status} className="space-y-3">
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${col.accent}`} />
                <h3 className="font-heading font-semibold text-sm">{col.label}</h3>
                <span className="text-xs text-muted-foreground ml-auto">{colTasks.length}</span>
              </div>
              <div className="space-y-2 min-h-[100px] rounded-lg bg-muted/30 p-2">
                {colTasks.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-8">No tasks</p>
                ) : (
                  colTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onStatusChange={handleStatusChange}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={editingTask ? handleUpdate : handleAdd}
        task={editingTask}
      />
    </div>
  );
};

export default ProjectDetail;
