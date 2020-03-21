import { useEffect } from 'react';

export const useMountEffect = (fn: any) => useEffect(fn, []);
