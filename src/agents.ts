
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
        'MIICizCCAhGgAwIBAgIQr+1X56Nbro0MCXBn97yguDAKBggqhkjOPQQDAzAuMR8wHQYDVQQDDBZPV0YgTXVsdGlwYXogVEVTVCBJQUNBMQswCQYDVQQGDAJVUzAeFw0yNjAyMjIwODA4NTBaFw0yNzA1MjMwODA4NTBaMCwxHTAbBgNVBAMMFE9XRiBNdWx0aXBheiBURVNUIERTMQswCQYDVQQGDAJVUzBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABFBG88aOV9K2OrRUsiOr6oqePShBrziJGpG8hc9AQYj6t5TZbb1T5LVqtkP9RogibO3zxGXNoR4uAKzTOed4R6SjggERMIIBDTAfBgNVHSMEGDAWgBSrZRvgVsKQU/Hdf2zkh75o3mDJ9TAOBgNVHQ8BAf8EBAMCB4AwFQYDVR0lAQH/BAswCQYHKIGMXQUBAjBMBgNVHRIERTBDhkFodHRwczovL2dpdGh1Yi5jb20vb3BlbndhbGxldC1mb3VuZGF0aW9uLWxhYnMvaWRlbnRpdHktY3JlZGVudGlhbDBWBgNVHR8ETzBNMEugSaBHhkVodHRwczovL2dpdGh1Yi5jb20vb3BlbndhbGxldC1mb3VuZGF0aW9uLWxhYnMvaWRlbnRpdHktY3JlZGVudGlhbC9jcmwwHQYDVR0OBBYEFDirjatEF/zs9EfzAArXGcuhcGjUMAoGCCqGSM49BAMDA2gAMGUCMQCf4SKSlx7hT1NETo3UBhr3ISuBOuVcW+1fwVpE9pcA+ORxhMO2XO73Nju886XZXCYCMDD8NnAM5s6T55MHtlbpF34io2et8KF2NGUSi7D8PeArJTi1hZW+qM7YLjnveKrH9A=='
      ]
    })
  },
  dependencies: agentDependencies,
});