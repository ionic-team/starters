// Values defined in this default environment will be overwritten when another
// environment is selected, such as during `ionic build --prod`. For details,
// see `ionic build --help`.
//
// Import the environment like this: `import env from './environment';`
//
// Configure additional environments in `.angular-cli.json`.

import { EnvironmentSchema } from './schema';

const env: EnvironmentSchema = {
  name: 'development',
};

export default env;
