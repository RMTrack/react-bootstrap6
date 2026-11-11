import type { LoadContext, Preset } from '@docusaurus/types';

// Registers @docusaurus/plugin-css-cascade-layers from a preset listed before
// `classic`. Preset plugins load before every theme, so the plugin's layer
// order declaration comes before Infima's CSS; a plugin listed in `plugins`
// would load too late for its declaration to set the order. Unlike the
// `future.v4.useCssCascadeLayers` flag, this lets the site pass its own layers.
export default function cssCascadeLayersPreset(
  _context: LoadContext,
  options: Record<string, unknown>,
): Preset {
  return {
    plugins: [['@docusaurus/plugin-css-cascade-layers', options]],
  };
}
