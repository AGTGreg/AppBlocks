# Contracts Overview

This feature extends internal library behavior (event delegation, placeholder parsing) and adds a benchmark harness. No external API endpoints are introduced.

## Internal Interfaces (Conceptual)

### EventRegistration
```ts
interface EventRegistration {
  key: string;          // "<eventName> <cssSelector>"
  eventName: string;    // parsed
  cssSelector: string;  // descendant selector string
  handler: (e: Event) => void;
}
```

### DelimiterConfig
```ts
interface DelimiterConfig {
  delimiters: [string, string]; // [open, close]
}
```

### BenchmarkResult
```ts
interface BenchmarkResult {
  samples: number[];    // length 10
  meanMs: number;
  date: string;         // ISO
  baseline?: { meanMs: number; date?: string; samples?: number[] };
  report: string;       // human readable summary
}
```

These interfaces are conceptual and not enforced at runtime; they guide test and implementation consistency.
