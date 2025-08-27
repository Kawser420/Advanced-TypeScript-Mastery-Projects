// ===============================================================
// 📘 100 Advanced TypeScript Problem-Solving Examples
// Single-file learning resource. Categories included:
// Algorithms, Data Structures, Functional, Async, Generics, Types, Patterns, Utilities
// ===============================================================

// -----------------------------
// Utilities & Helpers
// -----------------------------

// 1. Assert helper (narrowing)
function assert(condition: any, msg = "Assertion failed"): asserts condition {
  if (!condition) throw new Error(msg);
}
