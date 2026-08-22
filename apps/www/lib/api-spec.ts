import { PRODUCT_NAME, SITE_URL } from "@/lib/constants"

export const API_SERVICE_NAME = `${PRODUCT_NAME} Agent API`
export const API_VERSION = "1.0.0"

export const API_DEPLOYMENT_MARKER_DOCUMENT = {
  service: API_SERVICE_NAME,
  status: "ok",
  version: API_VERSION,
} as const

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
          service: {
            const: API_DEPLOYMENT_MARKER_DOCUMENT.service,
            type: "string",
          },
          status: {
            const: API_DEPLOYMENT_MARKER_DOCUMENT.status,
            type: "string",
          },
          version: {
            const: API_DEPLOYMENT_MARKER_DOCUMENT.version,
            type: "string",
          },
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
    version: API_VERSION,
  },
  openapi: "3.1.0",
  paths: {
    "/api/health": {
      get: {
        description:
          "Returns a build-time marker for the deployed static site. It does not probe runtime dependencies.",
        operationId: "getDeploymentMarker",
        responses: {
          "200": {
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/HealthResponse" },
              },
            },
            description: "The Limeplay static deployment marker is available.",
          },
          "405": {
            content: {
              "application/problem+json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
            description: "The request method is not supported.",
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
        summary: "Read the static deployment marker",
      },
    },
  },
  servers: [{ description: "Production", url: SITE_URL }],
} as const

export const API_NOT_FOUND_DOCUMENT = {
  error: {
    code: "route_not_found",
    message: "No Limeplay API route matches this request.",
    resolution: `Read ${SITE_URL}/openapi.json for supported operations and request formats.`,
  },
} as const

export const API_METHOD_NOT_ALLOWED_DOCUMENT = {
  error: {
    code: "method_not_allowed",
    message: "This Limeplay API route does not support the request method.",
    resolution: `Read ${SITE_URL}/openapi.json for the methods supported by this operation.`,
  },
} as const
