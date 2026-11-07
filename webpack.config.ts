import type { Configuration } from 'webpack';
import grafanaConfig, { type Env } from './.config/webpack/webpack.config';

// Grafana < 12.3 doesn't share react/jsx-runtime with plugins, so it must be bundled.
const BUNDLED = new Set(['react/jsx-runtime', 'react/jsx-dev-runtime']);

const config = async (env: Env): Promise<Configuration> => {
  const base = await grafanaConfig(env);
  const externals = Array.isArray(base.externals) ? base.externals : [];
  return {
    ...base,
    externals: externals.filter((item) => typeof item !== 'string' || !BUNDLED.has(item)),
  };
};

export default config;
