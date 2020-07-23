import { NeonEngine } from '../../neon-core';
import { Response } from 'express';

export function initNeonMiddleware(_neonEngine: NeonEngine) {
  const neonEngine = _neonEngine;
  return function (_req: any, _res: Response, next: any) {
    _req.neon = neonEngine;
    next();
  };
}
