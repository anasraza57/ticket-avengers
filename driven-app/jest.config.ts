import { getJestProjects } from '@nx/jest'
import type {Config} from 'jest'

const config: Config = {
  projects: getJestProjects(),
  setupFilesAfterEnv: ['./jest.preload.js'],
}

export default config