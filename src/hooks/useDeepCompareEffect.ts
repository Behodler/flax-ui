import { useEffect, useRef } from 'react';
import isEqual from 'lodash/isEqual';

export function useDeepCompareEffect(callback: () => void, dependencies: any[]) {
  const currentDependenciesRef = useRef<any>();

  if (!isEqual(currentDependenciesRef.current, dependencies)) {
    currentDependenciesRef.current = dependencies;
  }

  useEffect(callback, [currentDependenciesRef.current]);
}
