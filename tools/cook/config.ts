import { type Config, type Exercise } from './core.ts';

const exercises: Exercise[] = [
  {
    id: '101-review-fatigue',
    name: '101 - Review Fatigue',
  },
  {
    id: '201-skill-unfolding',
    name: '201 - Skill Unfolding',
  },
  {
    id: '301-charted-design',
    name: '301 - Charted Design',
  },
  {
    id: '302-charted-implementation',
    name: '302 - Charted Implementation',
  },
  {
    id: '303-custom-design',
    name: '303 - Custom Design',
  },
  {
    id: '401-fast-feedback',
    name: '401 - Fast Feedback',
  },
  {
    id: '402-architecture-feedback',
    name: '402 - Architecture Feedback',
  },
  {
    id: '403-steering-capture',
    name: '403 - Steering Capture',
  },
];

export const config: Config = {
  base: 'main',
  exercises,
};
