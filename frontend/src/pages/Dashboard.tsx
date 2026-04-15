import { useEffect } from "react";
import { useProjects } from "@/contexts/ProjectContext";
import { useAuth } from "@/contexts/AuthContext";
import CreateProjectDialog from "@/components/projects/CreateProjectDialog";
import ProjectCard from "@/components/projects/ProjectCard";
import { FolderKanban, Loader2 } from "lucide-react";

const Dashboard = () => {
  const { projects, loading, fetchProjects } = useProjects();
  const { user } = useAuth();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <div className="animate-fade-in space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold">Welcome, {user?.name}</h1>
          <p className="text-muted-foreground text-sm">
            {projects.length} project{projects.length !== 1 ? "s" : ""}
          </p>
        </div>
        <CreateProjectDialog />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <FolderKanban className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-heading font-semibold text-lg mb-1">No projects yet</h3>
          <p className="text-muted-foreground text-sm mb-4">Create your first project to get started</p>
          <CreateProjectDialog />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <ProjectCard key={p._id} project={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
