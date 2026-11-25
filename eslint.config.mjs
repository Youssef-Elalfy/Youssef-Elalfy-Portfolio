import { defineConfig, globalIgnores } from "eslint/config";
import next from "eslint-config-next";
export default defineConfig([globalIgnores(['.next/**', '.npm-cache/**', '.media-capture-nova/**', '.superdesign/**', 'backups/**', 'docs/qa/**', 'test-results/**', 'playwright-report/**']), {
    extends: [...next],
}]);
