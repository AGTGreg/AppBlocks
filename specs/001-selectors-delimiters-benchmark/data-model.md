# Data Model: Selectors, Delimiters, Benchmark

## Entities

### EventMapping
- Description: Mapping between an event name and a CSS selector to a handler function, delegated at the AppBlock container.
- Fields:
  - key: string (format: "<eventName> <cssSelector>")
  - eventName: string (parsed from key)
  - cssSelector: string (descendant combinators allowed)
  - handler: function reference (opaque in data model)
- Rules:
  - First space separates eventName from selector
  - Delegation scope limited to the AppBlock root element

### PlaceholderDelimiters
- Description: Pair of strings that denote placeholder boundaries.
- Fields:
  - open: string (non-empty)
  - close: string (non-empty)
- Defaults:
  - open = "{"
  - close = "}"
- Rules:
  - Applies to text nodes and attribute values
  - Filters remain delimited by pipe `|`

### BenchmarkRun
- Description: Result of executing the standard benchmark scenario.
- Fields:
  - samples: number[10] (milliseconds)
  - meanMs: number
  - date: ISO string
  - baseline?: { meanMs: number, samples?: number[], date?: string }
  - report: string (human-readable summary)
- Rules:
  - Time per run = afterRender - beforeRender
  - Fixed scenario (template + data + directives)

## Relationships
- AppBlock has one PlaceholderDelimiters configuration
- AppBlock has many EventMapping entries (events map)
- BenchmarkRun is independent artifact stored locally for comparison
