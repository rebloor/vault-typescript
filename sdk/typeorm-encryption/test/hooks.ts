import "reflect-metadata"
import {Vault} from "@piiano/testcontainers-vault";
import type {Context} from "mocha";


import mysqlSetup from '@databases/mysql-test/jest/globalSetup';
import mysqlTeardown from '@databases/mysql-test/jest/globalTeardown';
import {OpenAPI} from "@piiano/vault-client";

async function test() {
  await mysqlSetup();
  // ... run you tests ...
  await mysqlTeardown();
}

const vault = new Vault({
  env: {
    PVAULT_SENTRY_ENABLE: false,
    PVAULT_LOG_DATADOG_ENABLE: 'none',
  }
});

export const mochaHooks = {

  async beforeAll(this: Context) {
    this.timeout(30000);
    this.slow(25000);
    const port = await vault.start();

    OpenAPI.BASE = `http://localhost:${port}`;
    OpenAPI.WITH_CREDENTIALS = true;
    OpenAPI.TOKEN = "pvaultauth";
  },

  async afterAll(this: Context) {
    this.timeout(10000);
    await vault.stop();
  }
};
