import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Project } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, FolderOpen, CheckCircle2, Clock, ListTodo } from "lucide-react";
import { useProjects } from "@/contexts/ProjectContext";

const ProjectCard = ({ project }: { project: Project }) => {
  const navigate = useNavigate();
  const { deleteProject, fetchTasks } = useProjects();
  const [counts, setCounts] = useState({ todo: 0, inProgress: 0, completed: 0 });

  useEffect(() => {
    let cancelled = false;
    fetchTasks(project._id, 1, 200).then((data) => {
      if (cancelled) return;
      const tasks = data.tasks || [];
      setCounts({
        todo: tasks.filter((t) => t.status === "todo").length,
        inProgress: tasks.filter((t) => t.status === "in-progress").length,
        completed: tasks.filter((t) => t.status === "completed").length,
      });
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [project._id, fetchTasks]);

  return (
    <Card className="group hover:shadow-md transition-all duration-200 border-border/60 animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: project.color || "#3b82f6" }} />
            <CardTitle className="font-heading text-base leading-tight">{project.projectName}</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
            onClick={async (e) => { e.stopPropagation(); await deleteProject(project._id); }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        {project.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{project.description}</p>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
          <span className="flex items-center gap-1"><ListTodo className="h-3 w-3" />{counts.todo}</span>
          <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-warning" />{counts.inProgress}</span>
          <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-success" />{counts.completed}</span>
        </div>
        <Button variant="secondary" size="sm" className="w-full" onClick={() => navigate(`/dashboard/project/${project._id}`)}>
          <FolderOpen className="mr-2 h-3.5 w-3.5" /> Open Project
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
