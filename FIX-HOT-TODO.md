Fixing HMR:
=====

- [ ] Move the react render/hydrate data layer into the CLI layer:
  - Client's package will only go as far as the root component. Need to figure out how to
    import that component into a Root.js component in the CLI and make that the entry point for
    webpack.
  - May have to walk back the sourcePath bit
- [ ] prevent `buddha` CLI from creating a config object if none exists. Only create one if user is setting an option.

