import React, { createContext, useContext, useState } from 'react';
import { SensorContextInput } from '../types/disease';

export type FieldSensorPreset = 'optimal' | 'waterlogged_acidic' | 'drought_alkaline';

interface SensorContextValue {
  moistureEnabled: boolean;
  setMoistureEnabled: (enabled: boolean) => void;
  toggleMoisture: () => void;
  moisturePercent: number;
  setMoisturePercent: (value: number) => void;
  phEnabled: boolean;
  setPhEnabled: (enabled: boolean) => void;
  togglePh: () => void;
  soilPh: number;
  setSoilPh: (value: number) => void;
  applyPreset: (preset: FieldSensorPreset) => void;
  resetSensors: () => void;
  sensorContext: SensorContextInput;
  activeSensorCount: number;
}

const DEFAULT_MOISTURE = 58;
const DEFAULT_PH = 6.4;

const SensorContext = createContext<SensorContextValue | undefined>(undefined);

export const SensorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [moistureEnabled, setMoistureEnabled] = useState<boolean>(true);
  const [moisturePercent, setMoisturePercentState] = useState<number>(DEFAULT_MOISTURE);
  const [phEnabled, setPhEnabled] = useState<boolean>(true);
  const [soilPh, setSoilPhState] = useState<number>(DEFAULT_PH);

  const setMoisturePercent = (value: number) => {
    const clamped = Math.min(95, Math.max(10, Math.round(value)));
    setMoisturePercentState(clamped);
  };

  const setSoilPh = (value: number) => {
    const clamped = Math.min(8.5, Math.max(4.5, Number(value.toFixed(1))));
    setSoilPhState(clamped);
  };

  const toggleMoisture = () => setMoistureEnabled((prev) => !prev);
  const togglePh = () => setPhEnabled((prev) => !prev);

  const applyPreset = (preset: FieldSensorPreset) => {
    setMoistureEnabled(true);
    setPhEnabled(true);
    if (preset === 'optimal') {
      setMoisturePercentState(58);
      setSoilPhState(6.4);
    } else if (preset === 'waterlogged_acidic') {
      setMoisturePercentState(86);
      setSoilPhState(5.2);
    } else if (preset === 'drought_alkaline') {
      setMoisturePercentState(24);
      setSoilPhState(7.8);
    }
  };

  const resetSensors = () => {
    setMoistureEnabled(true);
    setMoisturePercentState(DEFAULT_MOISTURE);
    setPhEnabled(true);
    setSoilPhState(DEFAULT_PH);
  };

  const sensorContext: SensorContextInput = {
    moistureEnabled,
    moisturePercent,
    phEnabled,
    soilPh
  };

  const activeSensorCount = (moistureEnabled ? 1 : 0) + (phEnabled ? 1 : 0);

  return (
    <SensorContext.Provider
      value={{
        moistureEnabled,
        setMoistureEnabled,
        toggleMoisture,
        moisturePercent,
        setMoisturePercent,
        phEnabled,
        setPhEnabled,
        togglePh,
        soilPh,
        setSoilPh,
        applyPreset,
        resetSensors,
        sensorContext,
        activeSensorCount
      }}
    >
      {children}
    </SensorContext.Provider>
  );
};

export const useSensors = (): SensorContextValue => {
  const ctx = useContext(SensorContext);
  if (!ctx) {
    throw new Error('useSensors must be used within a SensorProvider');
  }
  return ctx;
};
