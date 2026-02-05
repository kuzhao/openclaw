import { describe, it, expect, vi } from "vitest";
import type { ProviderPlugin } from "openclaw/plugin-sdk";

describe("Azure OpenAI Plugin", () => {
  it("should export a valid plugin definition", async () => {
    const plugin = (await import("./index.js")).default as ProviderPlugin;

    expect(plugin).toBeDefined();
    expect(plugin.id).toBe("azure-openai");
    expect(plugin.name).toBe("Azure OpenAI");
    expect(plugin.description).toBeDefined();
  });

  it("should have register function", async () => {
    const plugin = (await import("./index.js")).default;

    expect("register" in plugin).toBe(true);
    expect(typeof plugin["register"] === "function").toBe(true);
  });

  it("should register provider with auth methods", async () => {
    const plugin = (await import("./index.js")).default;
    const mockApi = {
      registerProvider: vi.fn(),
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    plugin.register(mockApi as any);

    expect(mockApi.registerProvider).toHaveBeenCalledTimes(1);
    const providerCall = mockApi.registerProvider.mock.calls[0]?.[0];

    expect(providerCall).toBeDefined();
    expect(providerCall.id).toBe("azure-openai");
    expect(providerCall.auth).toHaveLength(2);

    // Check API key auth method
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const apiKeyAuth = providerCall.auth.find((a: any) => a.id === "api-key");
    expect(apiKeyAuth).toBeDefined();
    expect(apiKeyAuth.kind).toBe("api_key");

    // Check keyless auth method
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const keylessAuth = providerCall.auth.find((a: any) => a.id === "keyless");
    expect(keylessAuth).toBeDefined();
    expect(keylessAuth.kind).toBe("custom");
  });
});
