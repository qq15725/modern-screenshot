import type { Options } from './options'

export interface HandleNodeFunc {
  <T extends Node>(node: T, options?: Options): Promise<void>
}

export interface CloneNodeFunc {
  <T extends Node>(node: T, options?: Options): Promise<Node>
}

export interface CloneFilteredNodeFunc {
  <T extends Node>(node: T, options?: Options): Promise<Node | null>
}

export interface ShallowCloneNodeFunc {
  <T extends Node>(node: T, options?: Options): Promise<Node>
}

export interface DepthCloneNodeFunc {
  <T extends Node>(node: T, cloned: T, options?: Options): Promise<void>
}
