# gp-grid Grafana panel

A Grafana panel plugin that renders data frames with [gp-grid](https://github.com/GioPat/gp-grid). User documentation lives in [src/README.md](./src/README.md), which is also the page shown in the Grafana plugin catalog.

## Development

Requires Node.js 22+, pnpm and Docker.

```bash
pnpm install
pnpm run dev        # build in watch mode
pnpm run server     # start Grafana with the plugin at http://localhost:3000
```

## Checks

```bash
pnpm run typecheck
pnpm run lint
pnpm run test:ci    # unit tests (Jest)
pnpm run e2e        # end-to-end tests (Playwright, needs `pnpm run server`)
```

## Release

```bash
pnpm run build
```

Plugins must be signed before they are distributed. See [Sign a plugin](https://grafana.com/developers/plugin-tools/publish-a-plugin/sign-a-plugin). Pushing a version tag (`npm version <major|minor|patch>` then `git push --follow-tags`) triggers the release workflow in `.github/workflows`. It needs a `GRAFANA_API_KEY` repository secret.

## Layout

- `src/module.ts`: panel and field option definitions
- `src/components/GridPanel.tsx`: the panel component
- `src/data/frameToGrid.ts`: maps a Grafana data frame to gp-grid columns and a columnar data source
