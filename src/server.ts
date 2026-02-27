import { serve } from '@hono/node-server'
import { TypedArrayEncoder } from '@credo-ts/core'
import { Hono } from 'hono'
import { randomBytes } from 'crypto'
import { readFile } from 'fs/promises'
import { verifier } from './agents'
import { PublicJwk } from '@credo-ts/core/kms'
import { transformPrivateKeyToPrivateJwk } from '@credo-ts/askar'

// const READER_PRIVATE_JWK_P256 = {
//   kty: 'EC' as const,
//   x: 'f83OJ3D2xF1Bg8vub9tLe1gHMzV76e8Tus9uPHvRVEU',
//   y: 'x_FEzRu9m36HLN_tue659LNpXW6pCyStikYjKIWI5a0',
//   crv: 'P-256' as const,
//   d: 'jpsQnnGQmL-YBIffH1136cspYG6-0iY7X1fCE9-E9LI',
// }

const { privateJwk } = transformPrivateKeyToPrivateJwk({
  type: {
    crv: 'P-256',
    kty: 'EC'
  },
  privateKey: TypedArrayEncoder.fromString('afjdemoverysecure000000000000000'),
})

type SessionData = {
  encryptionInfoBase64Url: string
  origin?: string
  readerPrivateJwk: string
}

type DcApiRequestBody = {
  documentRequests: Array<{
    docType: string
    nameSpaces: Record<string, Record<string, boolean>>
    readerAuth?: {
      readerKey: unknown
      x5chain: string[]
    }
  }>
  nonce?: number[]
  nonceBase64?: string
  origin?: string
  trustedCertificates?: string[]
}

const app = new Hono()
const dcApiSessions = new Map<string, SessionData>()

app.get('/', async (c) => {
  const html = await readFile('index.html', 'utf8')
  return c.html(html)
})

app.post('/dc-api/request', async (c) => {
  try {
    const body = (await c.req.json()) as DcApiRequestBody

    // const readerPrivateJwk = READER_PRIVATE_JWK_P256 as unknown as JsonWebKey
    const importedReaderKey = await verifier.kms.importKey({
      privateJwk,
    })
    const recipientPublicJwk = PublicJwk.fromPublicJwk(importedReaderKey.publicJwk)

    const nonce = body.nonceBase64
      ? TypedArrayEncoder.fromBase64(body.nonceBase64)
      : body.nonce
        ? Uint8Array.from(body.nonce)
        : randomBytes(16)

    const request = await verifier.mdoc.createDcApiRequest({
      documentRequests: body.documentRequests.map((docRequest) => ({
        ...docRequest,
        readerAuth: docRequest.readerAuth
          ? {
              ...docRequest.readerAuth,
              readerKey: PublicJwk.fromUnknown(docRequest.readerAuth.readerKey),
            }
          : undefined,
      })),
      nonce,
      recipientPublicJwk,
    })

    const sessionId = randomBytes(12).toString('base64url')
    dcApiSessions.set(sessionId, {
      encryptionInfoBase64Url: request.encryptionInfo,
      origin: body.origin,
      readerPrivateJwk: JSON.stringify(privateJwk),
    })

    return c.json({
      sessionId,
      dcRequestProtocol: 'org-iso-mdoc',
      dcRequestProtocol2: null,
      dcRequestString: JSON.stringify(request),
      dcRequestString2: null,
    })
  } catch (error) {
    return c.json(
      {
        error: 'Failed to create DC API request',
        details: error instanceof Error ? error.message : String(error),
      },
      400
    )
  }
})

app.post('/dc-api/verify', async (c) => {
  try {
    const body = (await c.req.json()) as {
      sessionId: string
      encryptedResponse?: string
      origin?: string
    }
    console.log("🚀 ~ body:", body)

    const session = dcApiSessions.get(body.sessionId)
    if (!session) return c.json({ error: 'Unknown sessionId' }, 404)

    const mdocs = await verifier.mdoc.verifyEncryptedDcApiDeviceResponse({
      encryptedResponse: body.encryptedResponse,
      encryptionInfoBase64Url: session.encryptionInfoBase64Url,
      origin: body.origin,
      readerPrivateJwk: JSON.parse(session.readerPrivateJwk),
    })
    console.log("🚀 ~ mdocs:", mdocs)

    return c.json({
      sessionId: body.sessionId,
      mdocs: mdocs.map((mdoc) => ({
        docType: mdoc.docType,
        encoded: mdoc.encoded,
      })),
    })
  } catch (error) {
    console.log("🚀 ~ error:", error)
    return c.json(
      {
        error: 'Failed to verify encrypted device response',
        details: error instanceof Error ? error.message : String(error),
      },
      400
    )
  }
})

async function startServer() {
  await verifier.initialize()
  serve({ fetch: app.fetch, port: 3000 }, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
  })
}

void startServer()
