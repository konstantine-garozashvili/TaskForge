import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import yaml from 'yamljs';

/**
 * Loads the OpenAPI 3 specification (single source of truth: openapi.yaml).
 */
const here = dirname(fileURLToPath(import.meta.url));
const specPath = join(here, '../../openapi.yaml');

const openapiSpec = yaml.load(specPath);

export default openapiSpec;
