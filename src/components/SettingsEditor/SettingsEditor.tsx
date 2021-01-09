

import React from 'react';
import { Settings, defaultSettings } from '../../settings';
import settingsIcon from './assets/settings-icon.png';
import './SettingsEditor.scss';

interface SettingsEditorProps {
  settings: Settings;
  onChange: (settings: Settings) => void;
  onToggle: () => void;
}

export const SettingsEditor: React.FC<SettingsEditorProps> = ({ settings = defaultSettings, onChange, onToggle }) => {
  const handleChange = (changedProp: Partial<Settings>): void => {
    const updatedSettings = { ...settings, ...changedProp };
    const computedSettings = {
      ...updatedSettings,
      bufferSize: updatedSettings.expirationWindow / updatedSettings.refreshRate,
    };
    onChange(computedSettings);
  };

  return (
    <div className="settings">
      <nav className="settings__nav">
        <button className="settings__toggle" onClick={onToggle}>
          <img className="toggle--open" src={settingsIcon} alt="Open Settings" />
        </button>
      </nav>
      <form className="settings__form">
        <fieldset>
          <label>
            Refresh rate: 
            <strong> {settings.refreshRate / 1000} seconds</strong> 
          </label>
          <input type="range"
            defaultValue={settings.refreshRate}
            min="5000" max="15000" step="1000"
            onChange={(event) => handleChange({ refreshRate: event.target.valueAsNumber })}></input>
        </fieldset>

        <fieldset>
          <label>
            Data expiration period: 
            <strong> {settings.expirationWindow / 1000 / 60} minutes</strong> 
          </label>
          <input type="range"
            defaultValue={settings.expirationWindow}
            min="300000" max="900000" step="60000"
            onChange={(event) => handleChange({ expirationWindow: event.target.valueAsNumber })}></input>
        </fieldset>

        <fieldset>
          <label>
            Wait before triggering alerts: 
            <strong> {settings.cpuOverloadAlertingThreshold / 1000 / 60} minutes</strong> 
          </label>
          <input type="range"
            defaultValue={settings.cpuOverloadAlertingThreshold}
            min="30000" max="210000" step="30000"
            onChange={(event) => handleChange({ cpuOverloadAlertingThreshold: event.target.valueAsNumber })}></input>
        </fieldset>

        <fieldset>
          <label>
            Wait before CPU is fully recovered: 
            <strong> {settings.cpuRecoveryNotificationThreshold / 1000 / 60} minutes</strong> 
          </label>
          <input type="range"
            defaultValue={settings.cpuRecoveryNotificationThreshold}
            min="30000" max="210000" step="30000"
            onChange={(event) => handleChange({ cpuRecoveryNotificationThreshold: event.target.valueAsNumber })}></input>
        </fieldset>
      </form>
    </div>
  );
};
