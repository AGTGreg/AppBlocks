<!--
Sync Impact Report:
- Version change: 1.1.0 → 1.2.0
- Principles modified: Documentation (expanded requirements)
- Added sections: Enhanced documentation update requirements
- Templates requiring updates:
  ✅ plan-template.md (reviewed - compatible)
  ✅ spec-template.md (reviewed - compatible)
  ✅ tasks-template.md (reviewed - compatible)
- Follow-up TODOs: Ensure all future features include documentation updates in tasks
- Rationale: MINOR version bump - expanded documentation requirements to mandate updates for all feature changes
-->

# AppBlocks Constitution

## Core Principles

### I. Lightweight & Focused

AppBlocks MUST remain a small, fast, and lightweight JavaScript library.

**Rules**:
- New features MUST justify their inclusion against library size impact
- Dependencies MUST be minimized; prefer vanilla JavaScript solutions
- Build output MUST be monitored; significant size increases require explicit approval
- Each feature MUST have a clear, specific purpose that aligns with micro app development

**Rationale**: The project's core value proposition is being "ridiculously easy to integrate" and "small" - bloat destroys this advantage.

### II. Test-First Development (NON-NEGOTIABLE)

All code changes MUST follow test-driven development practices.

**Rules**:
- Tests MUST be written before implementation
- Tests MUST fail initially to prove they test the right behavior
- Implementation proceeds only after tests are approved
- After each milestone completion, ALL tests MUST pass before proceeding
- Red-Green-Refactor cycle is strictly enforced

**Rationale**: Testing ensures library stability, prevents regressions, and maintains quality as the project evolves. Milestone testing gates prevent accumulation of technical debt.

### III. Browser Compatibility & Simplicity

AppBlocks MUST work reliably across browsers and remain simple to use.

**Rules**:
- Features MUST work in all modern browsers (Chrome, Firefox, Safari, Edge)
- API design MUST prioritize developer experience and simplicity
- Breaking changes MUST follow semantic versioning (MAJOR.MINOR.PATCH)
- Documentation MUST be updated alongside code changes
- Examples MUST be provided for all public APIs

**Rationale**: As a library meant to be "practical and small," complexity in either usage or compatibility undermines the core mission.

## Development Workflow

### Quality Gates

**Pre-Implementation**:
- Feature specification approved
- Tests written and reviewed
- Tests fail as expected

**Post-Milestone**:
- ALL tests pass
- Documentation updated
- Build size impact assessed
- Browser compatibility verified

### Milestone Testing

After completing each milestone:
1. Run complete test suite
2. Verify all tests pass
3. Test in supported browsers
4. Review build output size
5. Only proceed to next milestone when all checks pass

## Documentation

**Documentation Requirements**:
- Documentation MUST be maintained in `docs/`
- Every time a feature is added, updated, or removed, the documentation MUST be updated to reflect the changes
- Every time a feature is added, updated, or removed, the Changelog located at `docs/changelog.md` MUST be updated to reflect the changes
- Documentation updates MUST happen as part of the same implementation phase, not deferred
- MUST provide clear examples showing how to use new or modified features
- New features/modules MUST be linked in project documentation (`_sidebar.md`)
- Removed features MUST be clearly marked as deprecated or removed from documentation
- Updated features MUST have changelog entries explaining what changed and why

## Testing Guidelines

**Always consult `docs/testing.md` on how testing works and how to add new tests.**

### Test Organization

**Structure**:
- Tests MUST be organized into groups aligned with AppBlocks modules (core, directives, filters, utils, processing, requests)
- Test directory structure MUST mirror the source code organization
- Each test group MUST be discoverable without configuration changes

**Extensibility**:
- When adding new features, corresponding test files MUST be added to the appropriate group
- New test groups MUST be created if introducing new modules
- Test structure MUST support adding tests incrementally as features grow

### Test Scope & Focus

**What to Test**:
- AppBlocks' own code behavior and logic
- Integration points with external dependencies (verify correct inputs/outputs)
- Data flow and state management
- User-facing functionality (directives, filters, rendering, events)

**What NOT to Test**:
- Third-party libraries and frameworks (assume they work correctly)
- External dependency internals (only test AppBlocks' usage of them)

### Shared Test Data

**Mockup Data Requirements**:
- Shared test fixtures MUST be provided for common test scenarios
- Each test MUST receive a fresh copy of mockup data (no mutation between tests)
- Mockup data MUST include realistic examples covering common use cases and edge cases
- Fixtures MUST be extensible - easy to add new data as features expand

**Purpose**:
- Reduce code duplication across tests (target: 70% reduction vs inline fixtures)
- Ensure consistency in test scenarios
- Speed up test writing for new contributors

### Test Execution

**Commands**:
- MUST support running all tests with a single command
- MUST support running specific test groups independently
- MUST provide clear pass/fail reporting with error details
- MUST exit with appropriate status codes (0 for success, non-zero for failure)

**Performance**:
- Keep tests fast to encourage frequent execution
- Optimize for quick feedback loops during development

## Governance

This constitution supersedes all other development practices and guidelines.

**Amendment Process**:
- Amendments require documented justification
- Version number MUST be incremented following semantic versioning
- Changes MUST be propagated to all templates and documentation

**Compliance**:
- All pull requests MUST verify compliance with these principles
- Deviations MUST be explicitly justified and documented
- Templates in `.specify/templates/` guide feature development per these principles

**Version**: 1.2.0 | **Ratified**: 2025-11-03 | **Last Amended**: 2025-11-05
