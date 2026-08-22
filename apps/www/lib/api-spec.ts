import { PRODUCT_NAME, SITE_URL } from "@/lib/constants"

export const OPENAPI_DOCUMENT = {
  components: {
    schemas: {
      ErrorDetail: {
        additionalProperties: false,
        properties: {
          code: { type: "string" },
          message: { type: "string" },
          resolution: { type: "string" },
        },
        required: ["code", "message", "resolution"],
        type: "object",
      },
      ErrorResponse: {
        additionalProperties: false,
        properties: {
          error: { $ref: "#/components/schemas/ErrorDetail" },
        },
        required: ["error"],
        type: "object",
      },
      HealthResponse: {
        additionalProperties: false,
        properties: {
          service: { const: `${PRODUCT_NAME} Agent API`, type: "string" },
          status: { const: "ok", type: "string" },
          version: { const: "1.0.0", type: "string" },
        },
        required: ["status", "service", "version"],
        type: "object",
      },
    },
  },
  info: {
    description:
      "Machine-readable service information for Limeplay developer tooling and agents.",
    title: `${PRODUCT_NAME} Agent API`,
    version: "1.0.0",
  },
  openapi: "3.1.0",
  paths: {
    "/api/health": {
      get: {
        operationId: "getHealth",
        responses: {
          "200": {
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/HealthResponse" },
              },
            },
            description: "The Limeplay API is available.",
          },
          default: {
            content: {
              "application/problem+json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
            description: "Structured API error.",
          },
        },
        security: [],
        summary: "Check API availability",
      },
    },
  },
  servers: [{ description: "Production", url: SITE_URL }],
} as const

export const API_ERROR_DOCUMENT = {
  error: {
    code: "route_not_found",
    message: "No Limeplay API route matches this request.",
    resolution:
      "Read https://limeplay.winoffrg.dev/openapi.json for supported operations and request formats.",
  },
} as const
