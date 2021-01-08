

import React from 'react';
import { Settings } from '../../settings';
import './SettingsEditor.scss';

interface SettingsEditorProps {
  settings: Settings;
  onChange: (settings: Settings) => void;
}

export const SettingsEditor: React.FC<SettingsEditorProps> = ({ settings, onChange }) => {
  return (
    <div className="settings">
      <div></div>
    </div>
  );
};
