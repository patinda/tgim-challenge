import React from 'react';

export function EmergencyFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          🚨 Erreur de chargement
        </h1>
        <p className="text-gray-600 mb-4">
          Le module M&A rencontre des difficultés techniques.
        </p>
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p className="text-sm">
            <strong>Actions recommandées :</strong><br/>
            1. Vérifiez la console du navigateur (F12)<br/>
            2. Rechargez la page<br/>
            3. Contactez le support technique
          </p>
        </div>
      </div>
    </div>
  );
}
