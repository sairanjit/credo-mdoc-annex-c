
import { AskarModule } from "@credo-ts/askar";
import {
  Agent,
  ConsoleLogger,
  LogLevel,
  X509Module,
} from "@credo-ts/core";
import { agentDependencies } from "@credo-ts/node";
import { askar } from "@openwallet-foundation/askar-nodejs";

export const verifier = new Agent({
  config: {
    logger: new ConsoleLogger(LogLevel.trace),
  },
  modules: {
    askar: new AskarModule({
      askar,
      store: {
        id: "verifier-agent-id-4",
        key: "verifier-agent-key",
      }
    }),
    x509: new X509Module({
      trustedCertificates: [
        'MIICizCCAhGgAwIBAgIQhSNgpAK9MvvRZYnf/FXrvDAKBggqhkjOPQQDAzAuMR8wHQYDVQQDDBZPV0YgTXVsdGlwYXogVEVTVCBJQUNBMQswCQYDVQQGDAJVUzAeFw0yNjAyMjgwOTExMzNaFw0yNzA1MjkwOTExMzNaMCwxHTAbBgNVBAMMFE9XRiBNdWx0aXBheiBURVNUIERTMQswCQYDVQQGDAJVUzBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABCZr3cNhNdCzSX8tBiuwmFbVLKilvYsZ65r4TzFi6k1moUoj/2KFUdz1um69oe2aH+GAfSDUVLAbCDFH3eyVu2ajggERMIIBDTAfBgNVHSMEGDAWgBSrZRvgVsKQU/Hdf2zkh75o3mDJ9TAOBgNVHQ8BAf8EBAMCB4AwFQYDVR0lAQH/BAswCQYHKIGMXQUBAjBMBgNVHRIERTBDhkFodHRwczovL2dpdGh1Yi5jb20vb3BlbndhbGxldC1mb3VuZGF0aW9uLWxhYnMvaWRlbnRpdHktY3JlZGVudGlhbDBWBgNVHR8ETzBNMEugSaBHhkVodHRwczovL2dpdGh1Yi5jb20vb3BlbndhbGxldC1mb3VuZGF0aW9uLWxhYnMvaWRlbnRpdHktY3JlZGVudGlhbC9jcmwwHQYDVR0OBBYEFNjov6dBUJMI0XRRPQ5Rw7BX0sxzMAoGCCqGSM49BAMDA2gAMGUCMQDbHFuKlUG+beRDCyH9C3JFdhhgBlxynxzCsJt+3QcRF0AHPD3mhitEv10eD81kBdUCMAotlayVBgbPar9IBMYpKGmBgLjeSttxVdZGbb+mU+e9+lvk2pQovwGYSJX33B5Q3g==',
      ]
    })
  },
  dependencies: agentDependencies,
});