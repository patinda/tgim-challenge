import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, CheckCircle, Clock, AlertCircle, Calendar, User } from 'lucide-react';
import { DealModule, Task } from '../types';
import { useMAData } from '../hooks/useMAData';

interface ModuleTasksProps {
  module: DealModule;
  tasks: Task[];
}

export function ModuleTasks({ module, tasks }: ModuleTasksProps) {
  const { createTask, updateTask } = useMAData();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    due_date: ''
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Terminé';
      case 'in_progress':
        return 'En cours';
      case 'pending':
        return 'En attente';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleCreateTask = () => {
    if (!newTask.title.trim()) return;

    createTask({
      deal_module_id: module.id,
      title: newTask.title,
      description: newTask.description,
      status: 'pending',
      priority: newTask.priority as 'low' | 'medium' | 'high',
      due_date: newTask.due_date || undefined
    });

    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      due_date: ''
    });
    setShowCreateForm(false);
  };

  const handleStatusChange = (taskId: string, newStatus: string) => {
    updateTask(taskId, { status: newStatus as 'pending' | 'in_progress' | 'completed' });
  };

  const handlePriorityChange = (taskId: string, newPriority: string) => {
    updateTask(taskId, { priority: newPriority as 'low' | 'medium' | 'high' });
  };

  const filteredTasks = {
    pending: tasks.filter(t => t.status === 'pending'),
    in_progress: tasks.filter(t => t.status === 'in_progress'),
    completed: tasks.filter(t => t.status === 'completed')
  };

  const totalTasks = tasks.length;
  const completedTasks = filteredTasks.completed.length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* En-tête et statistiques */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Tâches du module {module.code}</h3>
          <p className="text-sm text-muted-foreground">
            {totalTasks} tâche{totalTasks > 1 ? 's' : ''} • {completedTasks} terminée{completedTasks > 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle tâche
        </Button>
      </div>

      {/* Barre de progression */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progression globale</span>
              <span className="font-medium">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulaire de création */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Créer une nouvelle tâche</CardTitle>
            <CardDescription>
              Ajoutez une tâche pour ce module
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                value={newTask.title}
                onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Ex: Finaliser la LOI"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newTask.description}
                onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Détails de la tâche..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priorité</Label>
                <Select value={newTask.priority} onValueChange={(value) => setNewTask(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Basse</SelectItem>
                    <SelectItem value="medium">Moyenne</SelectItem>
                    <SelectItem value="high">Haute</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="due_date">Date limite</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={newTask.due_date}
                  onChange={(e) => setNewTask(prev => ({ ...prev, due_date: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Annuler
              </Button>
              <Button onClick={handleCreateTask} disabled={!newTask.title.trim()}>
                Créer la tâche
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Colonnes des tâches */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* En attente */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <h4 className="font-medium">En attente</h4>
            <Badge variant="secondary">{filteredTasks.pending.length}</Badge>
          </div>
          
          <div className="space-y-3">
            {filteredTasks.pending.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={handleStatusChange}
                onPriorityChange={handlePriorityChange}
              />
            ))}
            
            {filteredTasks.pending.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">Aucune tâche en attente</p>
              </div>
            )}
          </div>
        </div>

        {/* En cours */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <h4 className="font-medium">En cours</h4>
            <Badge variant="secondary">{filteredTasks.in_progress.length}</Badge>
          </div>
          
          <div className="space-y-3">
            {filteredTasks.in_progress.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={handleStatusChange}
                onPriorityChange={handlePriorityChange}
              />
            ))}
            
            {filteredTasks.in_progress.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">Aucune tâche en cours</p>
              </div>
            )}
          </div>
        </div>

        {/* Terminées */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <h4 className="font-medium">Terminées</h4>
            <Badge variant="secondary">{filteredTasks.completed.length}</Badge>
          </div>
          
          <div className="space-y-3">
            {filteredTasks.completed.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={handleStatusChange}
                onPriorityChange={handlePriorityChange}
              />
            ))}
            
            {filteredTasks.completed.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">Aucune tâche terminée</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant de carte de tâche
function TaskCard({ 
  task, 
  onStatusChange, 
  onPriorityChange 
}: { 
  task: Task; 
  onStatusChange: (id: string, status: string) => void;
  onPriorityChange: (id: string, priority: string) => void;
}) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short'
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* En-tête */}
          <div className="flex items-start justify-between">
            <h5 className="font-medium text-sm line-clamp-2">{task.title}</h5>
            <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
              {task.priority === 'high' ? 'Haute' : task.priority === 'medium' ? 'Moyenne' : 'Basse'}
            </Badge>
          </div>

          {/* Description */}
          {task.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Date limite */}
          {task.due_date && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>Limite : {formatDate(task.due_date)}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Select value={task.status} onValueChange={(value) => onStatusChange(task.id, value)}>
              <SelectTrigger size="sm" className="text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="in_progress">En cours</SelectItem>
                <SelectItem value="completed">Terminé</SelectItem>
              </SelectContent>
            </Select>

            <Select value={task.priority} onValueChange={(value) => onPriorityChange(task.id, value)}>
              <SelectTrigger size="sm" className="text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Basse</SelectItem>
                <SelectItem value="medium">Moyenne</SelectItem>
                <SelectItem value="high">Haute</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
