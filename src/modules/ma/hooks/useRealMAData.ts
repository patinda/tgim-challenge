import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { DealSubmission } from '../../deals/types';
import { Target, Deal, DealModule, Message, Artifact, Task } from '../types';
import { RealDataTransformer } from '../services/real-data-transformer';

export function useRealMAData() {
  const [targets, setTargets] = useState<Target[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [dealModules, setDealModules] = useState<DealModule[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Récupérer les deals qualifiés depuis Supabase
  const fetchQualifiedDeals = async () => {
    try {
      setLoading(true);
      setError(null);

      // Récupérer les deals avec status 'qualified' ou 'in_review'
      const { data: dealSubmissions, error: fetchError } = await supabase
        .from('deal_submissions')
        .select('*')
        .in('internal_status', ['qualified', 'in_review'])
        .order('submitted_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      if (!dealSubmissions || dealSubmissions.length === 0) {
        console.log('Aucun deal qualifié trouvé, utilisation des données mockées');
        return false; // Indique qu'il faut utiliser les données mockées
      }

      console.log(`🎯 ${dealSubmissions.length} deals qualifiés trouvés`);

      // Transformer les deals en cibles et deals M&A
      const transformedTargets: Target[] = [];
      const transformedDeals: Deal[] = [];
      const transformedModules: DealModule[] = [];

      dealSubmissions.forEach((dealSubmission, index) => {
        try {
          // Créer la cible
          const target = RealDataTransformer.transformToTarget(dealSubmission);
          transformedTargets.push(target);

          // Créer le deal
          const deal = RealDataTransformer.transformToDeal(dealSubmission);
          transformedDeals.push(deal);

          // Créer les modules
          const modules = RealDataTransformer.createModulesForDeal(deal.id);
          transformedModules.push(...modules);

          console.log(`✅ Deal transformé: ${target.name} (${target.sector})`);
        } catch (transformError) {
          console.error(`❌ Erreur transformation deal ${index}:`, transformError);
        }
      });

      // Mettre à jour l'état
      setTargets(transformedTargets);
      setDeals(transformedDeals);
      setDealModules(transformedModules);

      // Créer des messages et artifacts de base pour chaque module
      const baseMessages: Message[] = [];
      const baseArtifacts: Artifact[] = [];
      const baseTasks: Task[] = [];

      transformedModules.forEach((module, index) => {
        // Message de bienvenue contextuel
        const welcomeMessage: Message = {
          id: `welcome-${module.id}`,
          deal_module_id: module.id,
          role: 'assistant',
          content: `Bienvenue dans le module ${module.code} ! 

${RealDataTransformer.generateEnrichedContext(dealSubmissions.find(d => d.id === module.deal_id.replace('deal-', '')) || dealSubmissions[0])}

Comment puis-je vous aider aujourd'hui ?`,
          metadata: { action: 'welcome' },
          created_at: new Date().toISOString()
        };
        baseMessages.push(welcomeMessage);

        // Artifact de contexte
        const contextArtifact: Artifact = {
          id: `context-${module.id}`,
          deal_module_id: module.id,
          type: 'document',
          title: `Contexte du deal - ${module.code}`,
          content: RealDataTransformer.generateEnrichedContext(
            dealSubmissions.find(d => d.id === module.deal_id.replace('deal-', '')) || dealSubmissions[0]
          ),
          created_at: new Date().toISOString()
        };
        baseArtifacts.push(contextArtifact);

        // Tâches de base selon le module
        const baseTasksForModule = generateBaseTasks(module);
        baseTasks.push(...baseTasksForModule);
      });

      setMessages(baseMessages);
      setArtifacts(baseArtifacts);
      setTasks(baseTasks);

      return true; // Indique que les vraies données ont été utilisées

    } catch (error) {
      console.error('Erreur lors de la récupération des deals:', error);
      setError(error instanceof Error ? error.message : 'Erreur inconnue');
      return false; // Indique qu'il faut utiliser les données mockées
    } finally {
      setLoading(false);
    }
  };

  // Générer des tâches de base selon le module
  const generateBaseTasks = (module: DealModule): Task[] => {
    const baseTasks: Task[] = [];
    
    switch (module.code) {
      case 'M1':
        baseTasks.push(
          {
            id: `task-${module.id}-1`,
            deal_module_id: module.id,
            title: 'Analyser le profil de la cible',
            description: 'Étudier le secteur, la taille et la position marché',
            status: 'pending',
            priority: 'high',
            created_at: new Date().toISOString()
          },
          {
            id: `task-${module.id}-2`,
            deal_module_id: module.id,
            title: 'Préparer le pitch de présentation',
            description: 'Structurer l\'argumentaire de crédibilité',
            status: 'pending',
            priority: 'high',
            created_at: new Date().toISOString()
          }
        );
        break;
      
      case 'M2':
        baseTasks.push(
          {
            id: `task-${module.id}-1`,
            deal_module_id: module.id,
            title: 'Analyser la valuation demandée',
            description: 'Comparer avec les multiples sectoriels',
            status: 'pending',
            priority: 'high',
            created_at: new Date().toISOString()
          }
        );
        break;
      
      case 'M3':
        baseTasks.push(
          {
            id: `task-${module.id}-1`,
            deal_module_id: module.id,
            title: 'Planifier la Due Diligence',
            description: 'Définir le scope et le planning',
            status: 'pending',
            priority: 'high',
            created_at: new Date().toISOString()
          }
        );
        break;
      
      case 'M4':
        baseTasks.push(
          {
            id: `task-${module.id}-1`,
            deal_module_id: module.id,
            title: 'Identifier les points d\'arbitrage',
            description: 'Liste des concessions possibles',
            status: 'pending',
            priority: 'high',
            created_at: new Date().toISOString()
          }
        );
        break;
    }
    
    return baseTasks;
  };

  // Charger les données au montage
  useEffect(() => {
    fetchQualifiedDeals();
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
    setMessages(prev => [...prev, newMessage]);
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
    error,
    
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
    refetch: fetchQualifiedDeals
  };
}
