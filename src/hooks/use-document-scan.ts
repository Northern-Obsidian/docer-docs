import { useState, useCallback, useRef } from 'react';
import { Platform } from 'react-native';
import {
  autoFetchOnLaunch,
  scanWithPicker,
  hasFilePermissions,
  requestFilePermissions,
  scanCustomPath,
  type ScanProgress,
} from '@/services/auto-fetch';

export type ScanStage = 'idle' | 'scanning' | 'fetching' | 'done';

interface ScanState {
  visible: boolean;
  stage: ScanStage;
  filesFound: number;
  filesImported: number;
  currentPath: string | null;
  error: string | null;
}

interface UseDocumentScanReturn {
  state: ScanState;
  startAutoScan: () => Promise<void>;
  startCustomScan: (path: string) => Promise<void>;
  startPickerScan: () => Promise<void>;
  cancelScan: () => void;
  dismissModal: () => void;
  requestPermission: () => Promise<boolean>;
  hasPermission: () => Promise<boolean>;
}

const initialState: ScanState = {
  visible: false,
  stage: 'idle',
  filesFound: 0,
  filesImported: 0,
  currentPath: null,
  error: null,
};

export function useDocumentScan(): UseDocumentScanReturn {
  const [state, setState] = useState<ScanState>(initialState);
  const cancelled = useRef(false);

  const updateState = useCallback((partial: Partial<ScanState>) => {
    setState((prev) => ({ ...prev, ...partial }));
  }, []);

  const handleProgress = useCallback(
    (progress: ScanProgress) => {
      if (cancelled.current) return;
      updateState({
        filesFound: progress.filesFound,
        filesImported: progress.filesImported,
        currentPath: progress.currentPath,
      });
    },
    [updateState]
  );

  const cancelScan = useCallback(() => {
    cancelled.current = true;
  }, []);

  const dismissModal = useCallback(() => {
    setState(initialState);
  }, []);

  const requestPermission = useCallback(async () => {
    if (Platform.OS !== 'android') return false;
    return requestFilePermissions();
  }, []);

  const hasPermission = useCallback(async () => {
    if (Platform.OS !== 'android') return false;
    return hasFilePermissions();
  }, []);

  const startAutoScan = useCallback(async () => {
    cancelled.current = false;
    setState({
      ...initialState,
      visible: true,
      stage: 'scanning',
      currentPath: 'Preparing scan...',
    });

    try {
      updateState({ stage: 'fetching' });
      const count = await autoFetchOnLaunch(handleProgress);

      if (cancelled.current) {
        updateState({ visible: false, stage: 'idle' });
        return;
      }

      updateState({
        stage: 'done',
        filesFound: count,
        filesImported: count,
        currentPath: null,
      });
    } catch (err) {
      updateState({
        stage: 'done',
        error: err instanceof Error ? err.message : 'Scan failed',
      });
    }
  }, [updateState, handleProgress]);

  const startCustomScan = useCallback(
    async (path: string) => {
      cancelled.current = false;
      setState({
        ...initialState,
        visible: true,
        stage: 'scanning',
        currentPath: path,
      });

      try {
        updateState({ stage: 'fetching' });
        const count = await scanCustomPath(path, handleProgress);

        if (cancelled.current) {
          updateState({ visible: false, stage: 'idle' });
          return;
        }

        updateState({
          stage: 'done',
          filesFound: count,
          filesImported: count,
          currentPath: null,
        });
      } catch (err) {
        updateState({
          stage: 'done',
          error: err instanceof Error ? err.message : 'Scan failed',
        });
      }
    },
    [updateState, handleProgress]
  );

  const startPickerScan = useCallback(async () => {
    cancelled.current = false;
    setState({
      ...initialState,
      visible: true,
      stage: 'scanning',
      currentPath: 'Selected folder',
    });

    try {
      updateState({ stage: 'fetching' });
      const count = await scanWithPicker();

      if (cancelled.current) {
        updateState({ visible: false, stage: 'idle' });
        return;
      }

      updateState({
        stage: 'done',
        filesFound: count,
        filesImported: count,
        currentPath: null,
      });
    } catch (err) {
      updateState({
        stage: 'done',
        error: err instanceof Error ? err.message : 'Scan failed',
      });
    }
  }, [updateState]);

  return {
    state,
    startAutoScan,
    startCustomScan,
    startPickerScan,
    cancelScan,
    dismissModal,
    requestPermission,
    hasPermission,
  };
}
