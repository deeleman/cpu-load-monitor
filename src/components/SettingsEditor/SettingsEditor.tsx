import React from 'react';
import { Settings, defaultSettings } from '../../settings';
import settingsIcon from './assets/settings-icon.png';
import './SettingsEditor.scss';

type SettingsEditorProps = {
  settings: Settings;
  onChange: (settings: Settings) => void;
  onToggle: () => void;
}

export const SettingsEditor = ({ settings = defaultSettings, onChange, onToggle }: SettingsEditorProps) => {
  const handleChange = (changedProp: Partial<Settings>): void => {
    const updatedSettings = { ...settings, ...changedProp };
    const bufferSize = updatedSettings.expirationWindow / updatedSettings.refreshRate;
    onChange({ ...updatedSettings, bufferSize });
  };

  return (
    <div className="settings">
      <nav className="settings__nav">
        <button className="settings__toggle" onClick={onToggle}>
          <img className="toggle--open" src={settingsIcon} alt="Open Settings" width="32" height="32" />
        </button>
      </nav>
      <form className="settings__form">
        <fieldset>
          <label htmlFor="refreshRate">
            Refresh rate: 
            <strong> {settings.refreshRate / 1000} seconds</strong> 
          </label>
          <input id="refreshRate" type="range"
            defaultValue={settings.refreshRate}
            min="5000" max="15000" step="1000"
            onChange={(event) => handleChange({ refreshRate: event.target.valueAsNumber })}></input>
        </fieldset>

        <fieldset>
          <label htmlFor="expirationWindow">
            Data expiration period: 
            <strong> {settings.expirationWindow / 1000 / 60} minutes</strong> 
          </label>
          <input id="expirationWindow" type="range"
            defaultValue={settings.expirationWindow}
            min="300000" max="900000" step="60000"
            onChange={(event) => handleChange({ expirationWindow: event.target.valueAsNumber })}></input>
        </fieldset>

        <fieldset>
          <label htmlFor="cpuOverloadAlertingThreshold">
            Wait before triggering alerts: 
            <strong> {settings.cpuOverloadAlertingThreshold / 1000 / 60} minutes</strong> 
          </label>
          <input id="cpuOverloadAlertingThreshold" type="range"
            defaultValue={settings.cpuOverloadAlertingThreshold}
            min="30000" max="210000" step="30000"
            onChange={(event) => handleChange({ cpuOverloadAlertingThreshold: event.target.valueAsNumber })}></input>
        </fieldset>

        <fieldset>
          <label htmlFor="cpuRecoveryNotificationThreshold">
            Wait before CPU is fully recovered: 
            <strong> {settings.cpuRecoveryNotificationThreshold / 1000 / 60} minutes</strong> 
          </label>
          <input id="cpuRecoveryNotificationThreshold" type="range"
            defaultValue={settings.cpuRecoveryNotificationThreshold}
            min="30000" max="210000" step="30000"
            onChange={(event) => handleChange({ cpuRecoveryNotificationThreshold: event.target.valueAsNumber })}></input>
        </fieldset>
      </form>
    </div>
  );
};
