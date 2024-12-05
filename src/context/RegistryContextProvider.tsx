'use client';
import React, { createContext, useContext, ReactNode } from 'react';
import { REGISTRY_APP_DATA, removeItem } from '../utils/LocalStorage';
import { useLocalStorageState } from '../hooks/useLocalStorageState';
import { SmartSessionGrantPermissionsResponse } from '@reown/appkit-experimental/smart-session';

interface RegistryContextType {
  projectId: string;
  smartSession:
    | {
        grantedPermissions: SmartSessionGrantPermissionsResponse;
      }
    | undefined;
  setSmartSession: React.Dispatch<
    React.SetStateAction<
      | {
          grantedPermissions: SmartSessionGrantPermissionsResponse;
        }
      | undefined
    >
  >;
  clearSmartSession: () => void;
}

const RegistryContext = createContext<RegistryContextType | undefined>(
  undefined
);

export function RegistryContextProvider({ children }: { children: ReactNode }) {
  const projectId = process.env['NEXT_PUBLIC_PROJECT_ID'];
  if (!projectId) {
    throw new Error('NEXT_PUBLIC_PROJECT_ID is not set');
  }

  const [smartSession, setSmartSession] = useLocalStorageState<
    | {
        grantedPermissions: SmartSessionGrantPermissionsResponse;
      }
    | undefined
  >(REGISTRY_APP_DATA, undefined);

  function clearSmartSession() {
    removeItem(REGISTRY_APP_DATA);
    setSmartSession(undefined);
  }

  return (
    <RegistryContext.Provider
      value={{
        projectId,
        smartSession,
        clearSmartSession,
        setSmartSession,
      }}
    >
      {children}
    </RegistryContext.Provider>
  );
}

export function useRegistryContext() {
  const context = useContext(RegistryContext);
  if (!context) {
    throw new Error(
      'useRegistryContext must be used within a RegistryContextProvider'
    );
  }

  return context;
}
