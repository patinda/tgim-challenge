import type { ValuationResult, ValuatorInputs } from '../types/valuator';

// Détection de la clé API depuis Vite (frontend)
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY as string | undefined;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Helper pour parser la réponse IA
function parseAIValuation(text: string): {min: number, max: number, risk: number, report: string} {
  // Tentative extraction automatique
  let min = 0, max = 0, risk = 0;
  const rangeRegex = /Fourchette[^:]*:.*?(\d{2,}[\s\u202f,.]*€?).*?(\d{2,}[\s\u202f,.]*€?)/i;
  const riskRegex = /risque[^:]*:?\s*(\d{1,3}) ?\/? ?100/gi;

  const rangeMatch = text.match(rangeRegex);
  if (rangeMatch) {
    min = parseInt(rangeMatch[1]?.replace(/[^\d]/g, '') || '0', 10);
    max = parseInt(rangeMatch[2]?.replace(/[^\d]/g, '') || '0', 10);
  }
  let riskMatch = riskRegex.exec(text);
  if (riskMatch) risk = parseInt(riskMatch[1], 10);
  // Fallback
  if (!min || !max) {
    // essayer autre pattern
    const simple = /([0-9]{5,})[^0-9]+([0-9]{5,})/g.exec(text);
    if(simple) {
      min = parseInt(simple[1], 10);
      max = parseInt(simple[2], 10);
    }
  }
  if (!risk) risk = 50;
  return {
    min,
    max,
    risk,
    report: text.trim()
  };
}

export async function valuateBusinessAI(inputs: ValuatorInputs): Promise<ValuationResult> {
  if (!OPENAI_API_KEY) {
    // Pas de clé, fallback mock (ancien comportement)
    await new Promise(res => setTimeout(res, 1800));
    return {
      minValuation: 1150000,
      maxValuation: 1400000,
      riskScore: 75,
      report: `Entreprise simulée :\nSecteur : ${inputs.sector}\nCA déclaré : ${inputs.ca} €\nEBITDA : ${inputs.ebitda} €\nAnalyse équilibrée et risque modéré.`
    };
  }
  // Prompt construit d'après les inputs utilisateur
  const userPrompt = `Voici les informations sur une entreprise à valoriser :\n
Secteur : ${inputs.sector}\nPays : ${inputs.country}\nCA actuel : ${inputs.ca} €\nCA N-1 : ${inputs.ca_n1} €\nCA N-2 : ${inputs.ca_n2} €\nEBITDA : ${inputs.ebitda} €\nDette nette : ${inputs.debt} €\nTrésorerie : ${inputs.treasury} €\nCroissance annualisée : ${inputs.growth} %\nNombre d’employés : ${inputs.employees}\nBarrières à l’entrée : ${inputs.barriers}\nRépartition clients : ${inputs.clients}\nDigital : ${inputs.digital}\nNotoriété/Marque : ${inputs.brand}\nCommentaires : ${inputs.comment}\n
Génère sur cette base l’analyse d’un expert en évaluation d’entreprise :\n- Donne une fourchette de valorisation réaliste en euros.\n- Donne un score de risque sur 100 (100=risque élevé) pour la cible.\n- Explique ta méthode et fournis un rapport structuré en moins de 15 lignes.\n- Le format doit être en français.\n- Format de ta réponse : 
Fourchette: [MIN] € – [MAX] € \nRisque: [SCORE] /100\nRapport: [texte structuré court].`;
  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'Tu es un expert en évaluation de PME pour des M&A.' },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 700,
        temperature: 0.7,
        stream: false
      }),
    });

    if (!response.ok) throw new Error('Erreur API OpenAI');
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    const parsed = parseAIValuation(content);

    return {
      minValuation: parsed.min || 100000,
      maxValuation: parsed.max || 500000,
      riskScore: parsed.risk ?? 50,
      report: parsed.report,
    };
  } catch (err) {
    // Fallback mock si erreur !
    await new Promise(res => setTimeout(res, 1200));
    return {
      minValuation: 170000,
      maxValuation: 320000,
      riskScore: 43,
      report: `Erreur IA : fallback mock.\n Secteur: ${inputs.sector}, CA: ${inputs.ca}`
    };
  }
}
