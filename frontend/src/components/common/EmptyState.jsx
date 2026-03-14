import React from 'react';
import { PackageX } from 'lucide-react';

export default function EmptyState({ title = 'No records found', desc = 'Create one to get started.', action }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon"><PackageX size={32} /></div>
      <h3>{title}</h3>
      <p>{desc}</p>
      {action}
    </div>
  );
}
