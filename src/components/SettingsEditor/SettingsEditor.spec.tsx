
import '@testing-library/jest-dom';
import { cleanup, fireEvent, render } from '@testing-library/react';
import React from 'react';
import { Settings } from '../../settings';
import { SettingsEditor } from './SettingsEditor';

describe('SettingsEditor', () => {
  const defaultSettings: Settings = {
    refreshRate: 10000,
    expirationWindow: 600000,
    pollingEndpoint: '',
    cpuRecoveryNotificationThreshold: 120000,
    cpuOverloadAlertingThreshold: 120000,
    cpuLoadAverageThreshold: 1,
    bufferSize: 60,
  };

  const SettingsEditorPropsStub = {
    settings: defaultSettings,
    onChange: jest.fn(),
    onToggle: jest.fn(),
  }

  afterEach(cleanup);

  test('should populate the refreshRate input and its associated label', () => {
    render(<SettingsEditor {...SettingsEditorPropsStub} />);
    expect(document.getElementById('refreshRate')).toHaveDisplayValue(defaultSettings.refreshRate.toString())
    expect(document.querySelector('label[for="refreshRate"]')).toHaveTextContent('Refresh rate: 10 seconds');
  });

  test('should update refreshRate settings upon changing its input range control', () => {
    render(<SettingsEditor {...SettingsEditorPropsStub} />);
    fireEvent.change(document.getElementById('refreshRate'), { target: { value: '15000' } });
    expect(SettingsEditorPropsStub.onChange).toHaveBeenCalledWith({
      ...defaultSettings,
      refreshRate: 15000,
      bufferSize: 40,
    });
  });

  test('should populate the expirationWindow input and its associated label', () => {
    render(<SettingsEditor {...SettingsEditorPropsStub} />);
    expect(document.getElementById('expirationWindow')).toHaveDisplayValue(defaultSettings.expirationWindow.toString())
    expect(document.querySelector('label[for="expirationWindow"]')).toHaveTextContent('Data expiration period: 10 minutes');
  });

  test('should update expirationWindow settings upon changing its input range control', () => {
    render(<SettingsEditor {...SettingsEditorPropsStub} />);
    fireEvent.change(document.getElementById('expirationWindow'), { target: { value: '300000' } });
    expect(SettingsEditorPropsStub.onChange).toHaveBeenCalledWith({
      ...defaultSettings,
      expirationWindow: 300000,
      bufferSize: 30,
    });
  });

  test('should populate the cpuOverloadAlertingThreshold input and its associated label', () => {
    render(<SettingsEditor {...SettingsEditorPropsStub} />);
    expect(document.getElementById('cpuOverloadAlertingThreshold')).toHaveDisplayValue(defaultSettings.cpuOverloadAlertingThreshold.toString())
    expect(document.querySelector('label[for="cpuOverloadAlertingThreshold"]')).toHaveTextContent('Wait before triggering alerts: 2 minutes');
  });

  test('should update cpuOverloadAlertingThreshold settings upon changing its input range control', () => {
    render(<SettingsEditor {...SettingsEditorPropsStub} />);
    fireEvent.change(document.getElementById('cpuOverloadAlertingThreshold'), { target: { value: '210000' } });
    expect(SettingsEditorPropsStub.onChange).toHaveBeenCalledWith({
      ...defaultSettings,
      cpuOverloadAlertingThreshold: 210000,
    });
  });

  test('should populate the cpuRecoveryNotificationThreshold input and its associated label', () => {
    render(<SettingsEditor {...SettingsEditorPropsStub} />);
    expect(document.getElementById('cpuRecoveryNotificationThreshold')).toHaveDisplayValue(defaultSettings.cpuRecoveryNotificationThreshold.toString())
    expect(document.querySelector('label[for="cpuRecoveryNotificationThreshold"]')).toHaveTextContent('Wait before CPU is fully recovered: 2 minutes');
  });

  test('should update cpuRecoveryNotificationThreshold settings upon changing its input range control', () => {
    render(<SettingsEditor {...SettingsEditorPropsStub} />);
    fireEvent.change(document.getElementById('cpuRecoveryNotificationThreshold'), { target: { value: '30000' } });
    expect(SettingsEditorPropsStub.onChange).toHaveBeenCalledWith({
      ...defaultSettings,
      cpuRecoveryNotificationThreshold: 30000,
    });
  });

  test('should emit a toggle vent upon clicking on the toggle button', () => {
    render(<SettingsEditor {...SettingsEditorPropsStub} />);
    fireEvent.click(document.querySelector('.settings__toggle'));
    expect(SettingsEditorPropsStub.onToggle).toHaveBeenCalled();
  });
});