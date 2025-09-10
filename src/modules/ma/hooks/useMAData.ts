import { useState, useEffect } from 'react';
import { Target, Deal, DealModule, Message, Artifact, Task } from '../types';

export function useMAData() {
  const [targets, setTargets] = useState<Target[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [dealModules, setDealModules] = useState<DealModule[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler un chargement asynchrone
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Données de base pour éviter les erreurs
      const baseTargets: Target[] = [
        {
          id: 'target-1',
          name: 'TechSoft Solutions',
          sector: 'Tech/IT',
          location: 'Île-de-France',
          revenue: 2500000,
          ebitda: 400000,
          employees: 25,
          founded: '2018-01-01',
          description: 'Éditeur de logiciels SaaS pour la gestion d\'entreprise',
          financial_health: 'good',
          market_position: 'niche',
          created_at: '2025-01-25T09:00:00Z'
        }
      ];

      const baseDeals: Deal[] = [
        {
          id: 'deal-1',
          target_id: 'target-1',
          perimeter: 75,
          context: 'Acquisition stratégique pour expansion européenne',
          asking_price: 6000000,
          timeline: 'Moyen (6-12 mois)',
          status: 'Qualifié',
          created_at: '2025-01-25T09:00:00Z'
        }
      ];

      const baseModules: DealModule[] = [
        {
          id: 'module-1-1',
          deal_id: 'deal-1',
          code: 'M1',
          title: 'Qualification et Acceptation',
          description: 'Être accepté comme acheteur crédible',
          state: 'in_progress',
          progress: 25,
          created_at: '2025-01-25T09:00:00Z'
        },
        {
          id: 'module-1-2',
          deal_id: 'deal-1',
          code: 'M2',
          title: 'LOI et Négociation des termes',
          description: 'Cadrer la valuation et les termes',
          state: 'locked',
          progress: 0,
          created_at: '2025-01-25T09:00:00Z'
        },
        {
          id: 'module-1-3',
          deal_id: 'deal-1',
          code: 'M3',
          title: 'Due Diligence',
          description: 'Piloter les DD et transformer en leviers',
          state: 'locked',
          progress: 0,
          created_at: '2025-01-25T09:00:00Z'
        },
        {
          id: 'module-1-4',
          deal_id: 'deal-1',
          code: 'M4',
          title: 'Négociation finale et Closing',
          description: 'Boucler les points critiques et organiser le closing',
          state: 'locked',
          progress: 0,
          created_at: '2025-01-25T09:00:00Z'
        }
      ];

      setTargets(baseTargets);
      setDeals(baseDeals);
      setDealModules(baseModules);
      setMessages([]);
      setArtifacts([]);
      setTasks([]);
      
      setLoading(false);
    };

    loadData();
  }, []);

  // Méthodes CRUD
  const getTarget = (id: string) => targets.find(t => t.id === id);
  const getDeal = (id: string) => deals.find(d => d.id === id);
  const getDealsByTarget = (targetId: string) => deals.filter(d => d.target_id === targetId);
  const getModulesByDeal = (dealId: string) => dealModules.filter(dm => dm.deal_id === dealId);
  const getMessagesByModule = (moduleId: string) => messages.filter(m => m.deal_module_id === moduleId);
  const getArtifactsByModule = (moduleId: string) => artifacts.filter(a => a.deal_module_id === moduleId);
  const getTasksByModule = (moduleId: string) => tasks.filter(t => t.deal_module_id === moduleId);

  // Ajouter un message
  const addMessage = (message: Omit<Message, 'id' | 'created_at'>) => {
    const newMessage: Message = {
      ...message,
      id: `msg-${Date.now()}-${Math.random()}`,
      created_at: new Date().toISOString()
    };
    console.log('📝 Ajout du message dans le hook:', newMessage);
    setMessages(prev => {
      const updated = [...prev, newMessage];
      console.log('📝 Messages mis à jour:', updated);
      return updated;
    });
  };

  // Créer un artifact
  const createArtifact = (artifact: Omit<Artifact, 'id' | 'created_at'>) => {
    const newArtifact: Artifact = {
      ...artifact,
      id: `art-${Date.now()}-${Math.random()}`,
      created_at: new Date().toISOString()
    };
    setArtifacts(prev => [...prev, newArtifact]);
  };

  // Mettre à jour une tâche
  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ));
  };

  // Déverrouiller un module
  const unlockModule = (moduleId: string) => {
    setDealModules(prev => prev.map(module => 
      module.id === moduleId 
        ? { ...module, state: 'in_progress', progress: 25 }
        : module
    ));
  };

  return {
    // Données
    targets,
    deals,
    dealModules,
    messages,
    artifacts,
    tasks,
    loading,
    error: null,
    
    // Méthodes de récupération
    getTarget,
    getDeal,
    getDealsByTarget,
    getModulesByDeal,
    getMessagesByModule,
    getArtifactsByModule,
    getTasksByModule,
    
    // Méthodes de modification
    addMessage,
    createArtifact,
    updateTask,
    unlockModule,
    
    // Rechargement
    refetch: () => {}
  };
}
