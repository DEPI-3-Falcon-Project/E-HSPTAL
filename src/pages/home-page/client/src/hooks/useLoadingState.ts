import { useState, useCallback } from 'react';

interface LoadingState {
  isLoading: boolean;
  loadingText: string;
  showSuccess: boolean;
}

export const useLoadingState = () => {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    loadingText: '',
    showSuccess: false
  });

  const startLoading = useCallback((text: string = 'جاري التحميل...') => {
    setLoadingState({
      isLoading: true,
      loadingText: text,
      showSuccess: false
    });
  }, []);

  const stopLoading = useCallback((showSuccess: boolean = true) => {
    setLoadingState(prev => ({
      ...prev,
      isLoading: false,
      showSuccess
    }));
  }, []);

  const completeLoading = useCallback(() => {
    setLoadingState({
      isLoading: false,
      loadingText: '',
      showSuccess: false
    });
  }, []);

  const setLoadingText = useCallback((text: string) => {
    setLoadingState(prev => ({
      ...prev,
      loadingText: text
    }));
  }, []);

  return {
    loadingState,
    startLoading,
    stopLoading,
    completeLoading,
    setLoadingText
  };
};







