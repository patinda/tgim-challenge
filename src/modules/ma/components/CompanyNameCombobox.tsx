import * as React from 'react';
import { Input } from '@/components/ui/input';

interface CompanyNameComboboxProps {
  companies: string[];
  value: string;
  onChange: (name: string) => void;
  disabled?: boolean;
}

const CompanyNameCombobox: React.FC<CompanyNameComboboxProps> = ({ companies, value, onChange, disabled }) => {
  const [focus, setFocus] = React.useState(false);
  const shownSuggestions = value.length > 0
    ? companies.filter(
        nom => nom && nom.toLowerCase().includes(value.toLowerCase()) && nom !== value
      ).slice(0, 7)
    : [];

  return (
    <div className="relative w-full">
      <Input
        id="companyName"
        name="companyName"
        required
        autoComplete="off"
        disabled={disabled}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setTimeout(() => setFocus(false), 150)}
        placeholder={companies.length > 0 ? 'Sélectionner ou saisir une société…' : 'Saisir le nom de la société'}
        className="w-full"
      />
      {focus && shownSuggestions.length > 0 && (
        <ul className="absolute left-0 w-full z-30 max-h-48 overflow-auto bg-white border border-border rounded-b shadow-lg">
          {shownSuggestions.map(nom => (
            <li
              key={nom}
              className="px-4 py-2 cursor-pointer hover:bg-blue-50 text-sm"
              onMouseDown={() => onChange(nom)}
            >
              {nom}
            </li>
          ))}
        </ul>
      )}
      {focus && value && shownSuggestions.length === 0 && (
        <div className="text-[13px] mt-2 text-blue-600 bg-blue-50 rounded px-3 py-1">
          Aucune société trouvée. Vous pouvez en ajouter une nouvelle simplement.
        </div>
      )}
    </div>
  );
};

export default CompanyNameCombobox;
