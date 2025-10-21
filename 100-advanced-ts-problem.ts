// ====================================================================================================
// 100 Advanced TypeScript Problem-Solving Examples START
// Single-file learning resource. Categories included:
// Algorithms, Data Structures, Functional, Async, Generics, Types, Patterns, Utilities
// ====================================================================================================

// ==========================================================================
// Utilities And Helpers
// ==========================================================================

// 1. Assert helper---> narrowing
function assert(condition: any, msg = "Assertion failed"): asserts condition {
  if (!condition) throw new Error(msg);
}

// 2. Range generator
function* range(start: number, end: number, step = 1): Generator<number> {
  for (let i = start; i <= end; i += step) yield i;
}

// 3. Memoize generic
function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map<string, ReturnType<T>>();
  return ((...args: any[]) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key) as ReturnType<T>;
    const res = fn(...args);
    cache.set(key, res);
    return res;
  }) as T;
}

// 4. LRU Cache---> small
class LRUCache<K, V> {
  private map = new Map<K, V>();
  constructor(private capacity: number) {}
  get(k: K) {
    if (!this.map.has(k)) return undefined;
    const v = this.map.get(k) as V;
    this.map.delete(k);
    this.map.set(k, v);
    return v;
  }
  set(k: K, v: V) {
    if (this.map.has(k)) this.map.delete(k);
    else if (this.map.size === this.capacity) {
      const first = this.map.keys().next().value;
      if (first !== undefined) {
        this.map.delete(first);
      }
    }
    this.map.set(k, v);
  }
}

// ==============================================================================================
// Algorithms --> Sorting / Searching
// ==============================================================================================

// 5. QuickSort----------> in-place
function quickSort<T>(arr: T[], left = 0, right = arr.length - 1): T[] {
  if (left >= right) return arr;
  const pivot = arr[Math.floor((left + right) / 2)];
  let i = left,
    j = right;
  while (i <= j) {
    while ((arr[i] as any) < (pivot as any)) i++;
    while ((arr[j] as any) > (pivot as any)) j--;
    if (i <= j) [arr[i++], arr[j--]] = [arr[j + 1 - 1], arr[i - 1 + 1]];
  }
  if (left < j) quickSort(arr, left, j);
  if (i < right) quickSort(arr, i, right);
  return arr;
}

// 6. MergeSort
function mergeSort<T>(arr: T[]): T[] {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  const res: T[] = [];
  let i = 0,
    j = 0;
  while (i < left.length && j < right.length)
    res.push((left[i] as any) < (right[j] as any) ? left[i++] : right[j++]);
  return res.concat(left.slice(i)).concat(right.slice(j));
}

// 7. Binary Search----------------------> iterative
function binarySearch<T>(arr: T[], value: T): number {
  let l = 0,
    r = arr.length - 1;
  while (l <= r) {
    const m = Math.floor((l + r) / 2);
    if ((arr[m] as any) === (value as any)) return m;
    if ((arr[m] as any) < (value as any)) l = m + 1;
    else r = m - 1;
  }
  return -1;
}

// =============================================================================================
// Algorithms-------> Dynamic Programming
// =============================================================================================

// 8. Fibonacci----------> DP bottom-up
function fibDP(n: number): number {
  if (n <= 1) return n;
  const dp = [0, 1];
  for (let i = 2; i <= n; i++) dp[i] = dp[i - 1] + dp[i - 2];
  return dp[n];
}

// 9. Longest Increasing Subsequence----------------> n log n
function lis(nums: number[]): number {
  const tails: number[] = [];
  for (const x of nums) {
    let i = 0,
      j = tails.length;
    while (i < j) {
      const mid = Math.floor((i + j) / 2);
      if (tails[mid] < x) i = mid + 1;
      else j = mid;
    }
    tails[i] = x;
  }
  return tails.length;
}

// 10. Knapsack-----------------------------> 0/1 DP
function knapsack(
  weights: number[],
  values: number[],
  capacity: number
): number {
  const n = weights.length;
  const dp = Array(capacity + 1).fill(0);
  for (let i = 0; i < n; i++)
    for (let w = capacity; w >= weights[i]; w--)
      dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
  return dp[capacity];
}

// ===================================================================================================
// Data Structures----------> Linked Lists / Trees / Heaps / Tries
// ====================================================================================================

// 11. Singly Linked List with reverse
class SinglyNode<T> {
  constructor(public val: T, public next: SinglyNode<T> | null = null) {}
}
class SinglyLinkedList<T> {
  head: SinglyNode<T> | null = null;
  append(val: T) {
    if (!this.head) this.head = new SinglyNode(val);
    else {
      let cur = this.head;
      while (cur.next) cur = cur.next;
      cur.next = new SinglyNode(val);
    }
  }
  reverse() {
    let prev = null as SinglyNode<T> | null;
    let cur = this.head;
    while (cur) {
      const nx = cur.next;
      cur.next = prev;
      prev = cur;
      cur = nx;
    }
    this.head = prev;
  }
}

// 12. Doubly Linked List--------> partial
class DNode<T> {
  constructor(
    public val: T,
    public prev: DNode<T> | null = null,
    public next: DNode<T> | null = null
  ) {}
}
class DoublyLinkedList<T> {
  head: DNode<T> | null = null;
  tail: DNode<T> | null = null;
  push(val: T) {
    const n = new DNode(val);
    if (!this.tail) this.head = this.tail = n;
    else {
      this.tail.next = n;
      n.prev = this.tail;
      this.tail = n;
    }
  }
}

// 13. Binary Search Tree--------> insert, find
class BSTNode<T> {
  constructor(
    public val: T,
    public left: BSTNode<T> | null = null,
    public right: BSTNode<T> | null = null
  ) {}
}
class BST<T> {
  root: BSTNode<T> | null = null;
  insert(val: T) {
    const node = new BSTNode(val);
    if (!this.root) {
      this.root = node;
      return;
    }
    let cur = this.root;
    while (true) {
      if ((val as any) < (cur.val as any)) {
        if (!cur.left) {
          cur.left = node;
          break;
        }
        cur = cur.left;
      } else {
        if (!cur.right) {
          cur.right = node;
          break;
        }
        cur = cur.right;
      }
    }
  }
  find(val: T) {
    let cur = this.root;
    while (cur) {
      if ((cur.val as any) === (val as any)) return cur;
      cur = (val as any) < (cur.val as any) ? cur.left : cur.right;
    }
    return null;
  }
}

// 14. Min-Heap--> array-based
class MinHeap<T> {
  private data: T[] = [];
  constructor(
    private cmp: (a: T, b: T) => number = (a: any, b: any) => a - b
  ) {}
  size() {
    return this.data.length;
  }
  push(x: T) {
    this.data.push(x);
    this._siftUp(this.data.length - 1);
  }
  pop() {
    if (!this.data.length) return undefined;
    const r = this.data[0];
    const last = this.data.pop() as T;
    if (this.data.length) {
      this.data[0] = last;
      this._siftDown(0);
    }
    return r;
  }
  private _siftUp(i: number) {
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (this.cmp(this.data[i], this.data[p]) < 0) {
        [this.data[i], this.data[p]] = [this.data[p], this.data[i]];
        i = p;
      } else break;
    }
  }
  private _siftDown(i: number) {
    const n = this.data.length;
    while (true) {
      let smallest = i;
      const l = 2 * i + 1,
        r = 2 * i + 2;
      if (l < n && this.cmp(this.data[l], this.data[smallest]) < 0)
        smallest = l;
      if (r < n && this.cmp(this.data[r], this.data[smallest]) < 0)
        smallest = r;
      if (smallest !== i) {
        [this.data[i], this.data[smallest]] = [
          this.data[smallest],
          this.data[i],
        ];
        i = smallest;
      } else break;
    }
  }
}

// 15. Trie --> prefix tree
class TrieNode {
  children = new Map<string, TrieNode>();
  end = false;
}
class Trie {
  root = new TrieNode();
  insert(word: string) {
    let cur = this.root;
    for (const ch of word) {
      if (!cur.children.has(ch)) cur.children.set(ch, new TrieNode());
      cur = cur.children.get(ch)!;
    }
    cur.end = true;
  }
  startsWith(prefix: string) {
    let cur = this.root;
    for (const ch of prefix) {
      if (!cur.children.has(ch)) return false;
      cur = cur.children.get(ch)!;
    }
    return true;
  }
}

// =========================================================================================
// Graph Algorithms
// =========================================================================================

// 16. BFS (adj list)
function bfs(adj: Map<number, number[]>, start: number) {
  const q: number[] = [start];
  const seen = new Set([start]);
  const order: number[] = [];
  while (q.length) {
    const v = q.shift() as number;
    order.push(v);
    for (const nb of adj.get(v) || [])
      if (!seen.has(nb)) {
        seen.add(nb);
        q.push(nb);
      }
  }
  return order;
}

// 17. DFS----------------> recursive
function dfsRecursive(
  adj: Map<number, number[]>,
  start: number,
  seen = new Set<number>(),
  order: number[] = []
) {
  seen.add(start);
  order.push(start);
  for (const nb of adj.get(start) || [])
    if (!seen.has(nb)) dfsRecursive(adj, nb, seen, order);
  return order;
}

// 18. Dijkstra -----------> weights >= 0
function dijkstra(n: number, edges: [number, number, number][], src: number) {
  const adj: Map<number, [number, number][]> = new Map();
  for (const [u, v, w] of edges) {
    if (!adj.has(u)) adj.set(u, []);
    adj.get(u)!.push([v, w]);
  }
  const dist = Array(n).fill(Infinity);
  dist[src] = 0;
  const heap = new MinHeap<[number, number]>((a, b) => a[1] - b[1]);
  heap.push([src, 0]);
  while (heap.size()) {
    const [u, d] = heap.pop() as [number, number];
    if (d > dist[u]) continue;
    for (const [v, w] of adj.get(u) || [])
      if (dist[v] > d + w) {
        dist[v] = d + w;
        heap.push([v, dist[v]]);
      }
  }
  return dist;
}

// ====================================================================================================
// Functional / FP helpers
// ====================================================================================================

// 19. Curry with typed args-------> simple
const curry2 =
  <A, B, R>(fn: (a: A, b: B) => R) =>
  (a: A) =>
  (b: B) =>
    fn(a, b);

// 20. Compose typed----------> two functions
const compose2 =
  <A, B, C>(f: (b: B) => C, g: (a: A) => B) =>
  (x: A) =>
    f(g(x));

// ======================================================================
// Advanced Types --> Utility and Mapped Types
// ======================================================================

// 21. Flatten tuple
type Flatten<T> = T extends (infer U)[] ? U : T;

// 22. Tuple to Union
type TupleToUnion<T extends any[]> = T[number];

// 23. Index signature keys
type Keys<T> = keyof T;

// 24. DeepPartial
type DeepPartial2<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial2<T[P]> : T[P];
};

// 25. Conditional type infer
type ReturnTypeOf<T> = T extends (...a: any[]) => infer R ? R : any;

// ====================================================================================================
// Generics--> Advanced Usage
// ====================================================================================================

// 26. Generic Factory
function createInstance<T>(c: new (...args: any[]) => T, ...args: any[]): T {
  return new c(...args);
}

// 27. Generic Map utility
function mapObj<T, U>(
  obj: { [k: string]: T },
  fn: (v: T, k: string) => U
): { [k: string]: U } {
  const out: { [k: string]: U } = {};
  for (const k in obj) out[k] = fn(obj[k], k);
  return out;
}

// ====================================================================================================
// Concurrency and Async Patterns
// ====================================================================================================

// 28. Debounce
function debounce<T extends (...args: any[]) => any>(fn: T, ms = 300) {
  let timer: any;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

// 29. Throttle
function throttle<T extends (...args: any[]) => any>(fn: T, ms = 300) {
  let last = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - last >= ms) {
      last = now;
      fn(...args);
    }
  };
}

// 30. Semaphore ---> simple
class Semaphore {
  private waiting: (() => void)[] = [];
  private count: number;
  constructor(count = 1) {
    this.count = count;
  }
  async acquire() {
    if (this.count > 0) {
      this.count--;
      return;
    }
    await new Promise<void>((res) => this.waiting.push(res));
  }
  release() {
    this.count++;
    const next = this.waiting.shift();
    if (next) {
      this.count--;
      next();
    }
  }
}

// ====================================================================================================
// Design Patterns
// ====================================================================================================

// 31. Factory Pattern
class Product {
  constructor(public name: string) {}
}
class ProductFactory {
  static create(name: string) {
    return new Product(name);
  }
}

// 32. Strategy Pattern
type Strategy = (a: number, b: number) => number;
class Context {
  constructor(private strategy: Strategy) {}
  execute(a: number, b: number) {
    return this.strategy(a, b);
  }
}

// 33. Decorator method decorator example
function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const orig = descriptor.value;
  descriptor.value = function (...args: any[]) {
    console.log(`Calling ${propertyKey}`, args);
    return orig.apply(this, args);
  };
}

// ====================================================================================================
// Algorithms ----> Combinatorics / Backtracking
// ====================================================================================================

// 34. Permutations
function permutations<T>(arr: T[]): T[][] {
  const res: T[][] = [];
  const a = arr.slice();
  function back(i: number) {
    if (i === a.length) {
      res.push(a.slice());
      return;
    }
    for (let j = i; j < a.length; j++) {
      [a[i], a[j]] = [a[j], a[i]];
      back(i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
  }
  back(0);
  return res;
}

// 35. Combinations--> k
function combinations<T>(arr: T[], k: number): T[][] {
  const res: T[][] = [];
  const cur: T[] = [];
  function back(i: number) {
    if (cur.length === k) {
      res.push(cur.slice());
      return;
    }
    for (let j = i; j < arr.length; j++) {
      cur.push(arr[j]);
      back(j + 1);
      cur.pop();
    }
  }
  back(0);
  return res;
}

// ====================================================================================================
// Parsing / Regex / Strings
// ====================================================================================================

// 36. Parse query string to object
function parseQS(qs: string) {
  return qs
    .split("&")
    .filter(Boolean)
    .reduce((acc: any, pair) => {
      const [k, v] = pair.split("=");
      acc[decodeURIComponent(k)] = decodeURIComponent(v || "");
      return acc;
    }, {});
}

// 37. Template literal types example (simple)
type EventName<T extends string> = `on${Capitalize<T>}`;

// ====================================================================================================
// Bitwise / Math Tricks
// ====================================================================================================

// 38. Check power of two
const isPowerOfTwo = (n: number) => n > 0 && (n & (n - 1)) === 0;

// 39. Count bits (Brian Kernighan)
function countBits(n: number) {
  let c = 0;
  while (n) {
    n &= n - 1;
    c++;
  }
  return c;
}

// ====================================================================================================
// IO-like --> in memory / Streams
// ====================================================================================================

// 40. Simple EventEmitter
class EventEmitter<T extends string | symbol = string> {
  private listeners = new Map<T, Function[]>();
  on(event: T, fn: Function) {
    (this.listeners.get(event) ||
      this.listeners.set(event, []).get(event))!.push(fn);
  }
  emit(event: T, ...args: any[]) {
    for (const f of this.listeners.get(event) || []) f(...args);
  }
}

// ====================================================================================================
// Type-level puzzles
// ====================================================================================================

// 41. Build tuple of length N (type)
type BuildTuple<L extends number, T extends any[] = []> = T["length"] extends L
  ? T
  : BuildTuple<L, [...T, any]>;

// 42. Reverse tuple (type)
type Reverse<T extends any[]> = T extends [infer F, ...infer R]
  ? [...Reverse<R>, F]
  : [];

// ====================================================================================================
// Advanced Generics / Constraints
// ====================================================================================================

// 43. Constrained generic function
function pickKeys<T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> {
  const res = {} as Pick<T, K>;
  for (const k of keys) res[k] = obj[k];
  return res;
}

// ====================================================================================================
// Algorithms ----> Greedy / Interval
// ====================================================================================================

// 44. Merge Intervals
function mergeIntervals(intervals: [number, number][]) {
  if (!intervals.length) return [];
  intervals.sort((a, b) => a[0] - b[0]);
  const res: [number, number][] = [intervals[0]];
  for (const [s, e] of intervals.slice(1)) {
    const last = res[res.length - 1];
    if (s <= last[1]) last[1] = Math.max(last[1], e);
    else res.push([s, e]);
  }
  return res;
}

// ====================================================================================================
// Security / Validation
// ====================================================================================================

// 45. Safe JSON parse
function safeJSON<T = any>(s: string): T | null {
  try {
    return JSON.parse(s) as T;
  } catch {
    return null;
  }
}

// ====================================================================================================
// Misc algorithms
// ====================================================================================================

// 46. Reservoir Sampling---> k=1
function reservoirSample<T>(iter: Iterable<T>): T | null {
  let i = 0;
  let chosen: T | null = null;
  for (const x of iter) {
    i++;
    if (Math.random() < 1 / i) chosen = x;
  }
  return chosen;
}

// 47. Fisher–Yates shuffle
function shuffle<T>(a: T[]) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ====================================================================================================
// Testing helpers / Mocking
// ====================================================================================================

// 48. Fake timer (very small)
class FakeTimer {
  now = 0;
  advance(ms: number) {
    this.now += ms;
  }
}

// ====================================================================================================
// Serialization / Deep clone
// ====================================================================================================

// 49. Deep clone (JSON-safe)
function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// 50. Deep clone with cycles ---> using WeakMap
function deepCloneCycles<T>(obj: T, map = new WeakMap()): T {
  if (obj === null || typeof obj !== "object") return obj;
  if (map.has(obj as any)) return map.get(obj as any);
  const copy: any = Array.isArray(obj) ? [] : {};
  map.set(obj as any, copy);
  for (const k in obj as any) copy[k] = deepCloneCycles((obj as any)[k], map);
  return copy;
}

// ====================================================================================================
// Advanced Patterns ----> Proxy / Adapter
// ====================================================================================================

// 51. Simple Proxy usage (validation)
function createValidatedObject<T extends object>(
  obj: T,
  validate: (k: keyof T, v: any) => boolean
) {
  return new Proxy(obj, {
    set(target, prop: any, value) {
      if (!validate(prop, value)) throw new Error("Invalid");
      target[prop as keyof T] = value;
      return true;
    },
  });
}

// ====================================================================================================
// Performance / Profiling Helpers
// ====================================================================================================

// 52. Time function
function timeit<T>(fn: () => T) {
  const s = Date.now();
  const r = fn();
  return { duration: Date.now() - s, result: r };
}

// ====================================================================================================
// Advanced Recursion / Tail recursion example
// ====================================================================================================

// 53. Tail-recursive factorial (converted to loop)
function factorialTail(n: number): number {
  let acc = 1;
  while (n > 1) {
    acc *= n--;
  }
  return acc;
}

// ====================================================================================================
// Reactive / Observables --> mini
// ====================================================================================================

// 54. Mini Observable
class MiniObservable<T> {
  private observers: ((v: T) => void)[] = [];
  subscribe(fn: (v: T) => void) {
    this.observers.push(fn);
    return () => {
      this.observers = this.observers.filter((o) => o !== fn);
    };
  }
  next(v: T) {
    for (const o of this.observers) o(v);
  }
}

// ====================================================================================================
// Serialization Types / Branded Types
// ====================================================================================================

// 55. Branded type pattern
type UserId = string & { readonly __brand: unique symbol };
function makeUserId(s: string) {
  return s as UserId;
}

// ====================================================================================================
// Algorithmic puzzles
// ====================================================================================================

// 56. Two-sum (hash)
function twoSum(nums: number[], target: number): [number, number] | null {
  const m = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (m.has(need)) return [m.get(need)!, i];
    m.set(nums[i], i);
  }
  return null;
}

// 57. Product of array
function productExceptSelf(nums: number[]) {
  const n = nums.length;
  const out = Array(n).fill(1);
  let left = 1;
  for (let i = 0; i < n; i++) {
    out[i] *= left;
    left *= nums[i];
  }
  let right = 1;
  for (let i = n - 1; i >= 0; i--) {
    out[i] *= right;
    right *= nums[i];
  }
  return out;
}

// ====================================================================================================
// Graph ----> Topological Sort
// ====================================================================================================

// 58. Topological sort (Kahn)
function topoSort(n: number, edges: [number, number][]) {
  const indeg = Array(n).fill(0);
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    indeg[v]++;
  }
  const q: number[] = [];
  for (let i = 0; i < n; i++) if (!indeg[i]) q.push(i);
  const res: number[] = [];
  while (q.length) {
    const u = q.shift()!;
    res.push(u);
    for (const v of adj[u]) if (--indeg[v] === 0) q.push(v);
  }
  return res.length === n ? res : null; // null on cycle
}

// ====================================================================================================
// Caching / Persistence
// ====================================================================================================

// 59. Simple persistent map (immutable)
function persistentSet<K, V>(map: Map<K, V>, k: K, v: V) {
  const nm = new Map(map);
  nm.set(k, v);
  return nm;
}

// ====================================================================================================
// Filesystem-like Mock-----> in-memory
// ====================================================================================================

// 60. In-memory file system (very small)
class InMemoryFS {
  private files = new Map<string, string>();
  write(path: string, content: string) {
    this.files.set(path, content);
  }
  read(path: string) {
    return this.files.get(path) ?? null;
  }
}

// ====================================================================================================
// Security / Crypto helpers ----> not real crypto
// ====================================================================================================

// 61. Simple HMAC-like (not secure)
function simpleHash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return String(h);
}

// ====================================================================================================
// Scheduling / Rate limiting
// ====================================================================================================

// 62. Rate limiter (token bucket)
class TokenBucket {
  tokens: number;
  last: number;
  constructor(private capacity: number, private refillRatePerMs: number) {
    this.tokens = capacity;
    this.last = Date.now();
  }
  consume(n = 1) {
    const now = Date.now();
    this.tokens = Math.min(
      this.capacity,
      this.tokens + (now - this.last) * this.refillRatePerMs
    );
    this.last = now;
    if (this.tokens >= n) {
      this.tokens -= n;
      return true;
    }
    return false;
  }
}

// ====================================================================================================
// Heuristics / Searching
// ====================================================================================================

// 63. A* skeleton (manhattan)
function heuristic(a: [number, number], b: [number, number]) {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

// ====================================================================================================
// CLI / Args parsing helper
// ====================================================================================================

// 64. Simple argv parser
function parseArgs(argv: string[]) {
  const out: any = {};
  for (let i = 2; i < argv.length; i++) {
    const [k, v] = argv[i].split("=");
    out[k.replace(/^--/, "")] = v ?? true;
  }
  return out;
}

// ====================================================================================================
// Advanced Type-level ----> String manipulation
// ====================================================================================================

// 65. ToUpperCamelCase----> type
type ToUpperCamel<S extends string> = S extends `${infer F}-${infer R}`
  ? `${Capitalize<F>}${ToUpperCamel<Capitalize<R>>}`
  : Capitalize<S>;

// ====================================================================================================
// Concurrency ----> Promise queue
// ====================================================================================================

// 66. Promise pool
async function promisePool<T>(tasks: (() => Promise<T>)[], n = 2) {
  const res: T[] = [];
  const pool: Promise<any>[] = [];
  for (const t of tasks) {
    const p = t().then((r) => res.push(r));
    pool.push(p);
    if (pool.length >= n)
      await Promise.race(pool).then(() => {
        for (let i = pool.length - 1; i >= 0; i--) if (pool) pool.splice(i, 1);
      });
  }
  await Promise.all(pool);
  return res;
}

// ====================================================================================================
// Reflection / Metadata ----> experimental
// ====================================================================================================

// 67. Simple metadata store using WeakMap
const metadata = new WeakMap<object, Map<string, any>>();
function defineMeta(obj: object, k: string, v: any) {
  let m = metadata.get(obj);
  if (!m) {
    m = new Map();
    metadata.set(obj, m);
  }
  m.set(k, v);
}
function getMeta(obj: object, k: string) {
  return metadata.get(obj)?.get(k);
}

// ====================================================================================================
// Math ----> Gaussian / Normal approx ----> Box–Muller
// ====================================================================================================

// 68. Random normal generator
function randNormal() {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

// ====================================================================================================
// Algorithms ----> String matching
// ====================================================================================================

// 69. KMP prefix function
function kmpPrefix(s: string) {
  const n = s.length;
  const pi = Array(n).fill(0);
  for (let i = 1; i < n; i++) {
    let j = pi[i - 1];
    while (j > 0 && s[i] !== s[j]) j = pi[j - 1];
    if (s[i] === s[j]) j++;
    pi[i] = j;
  }
  return pi;
}

// ====================================================================================================
// Misc ----> small handy functions
// ====================================================================================================

// 70. GroupBy
function groupBy<T, K extends string | number>(arr: T[], keyFn: (a: T) => K) {
  return arr.reduce((acc: Record<string, T[]>, x) => {
    const k = String(keyFn(x));
    (acc[k] ||= []).push(x);
    return acc;
  }, {} as Record<string, T[]>);
}

// ====================================================================================================
// Advanced Patterns ----> CQRS-like simple separation
// ====================================================================================================

// 71. Command pattern (simple)
class Command {
  constructor(public execute: () => void) {}
}

// ====================================================================================================
// Type Guards / Narrowing
// ====================================================================================================

// 72. isString guard
function isString(v: any): v is string {
  return typeof v === "string";
}

// ====================================================================================================
// Algorithms ----> Median of two sorted arrays -----> hard
// ====================================================================================================

// 73. Median of two sorted arrays (merge-like)
function medianTwoSorted(a: number[], b: number[]) {
  const m = a.length,
    n = b.length;
  const tot = m + n;
  const k = Math.floor((tot - 1) / 2);
  let i = 0,
    j = 0,
    cur = 0;
  while (i < m || j < n) {
    const val = j === n || (i < m && a[i] < b[j]) ? a[i++] : b[j++];
    if (i + j - 1 === k) {
      if (tot % 2 === 1) return val;
      else {
        const next = j === n || (i < m && a[i] < b[j]) ? a[i] : b[j];
        return (val + next) / 2;
      }
    }
  }
  return null;
}

// ------------------------------------------------
//  74 To 76 missing
// ------------------------------------------------

// 77. hex to rgb
function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  const bigint = parseInt(h, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

// 79. Longest substring without repeating characters
function longestUniqueSubstr(s: string) {
  const map = new Map<string, number>();
  let start = 0,
    max = 0;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (map.has(ch) && map.get(ch)! >= start) start = map.get(ch)! + 1;
    map.set(ch, i);
    max = Math.max(max, i - start + 1);
  }
  return max;
}

// ====================================================================================================
// Protocols / Interfaces
// ====================================================================================================

// 80. Tagged union example
type Shape =
  | { kind: "circle"; r: number }
  | { kind: "rect"; w: number; h: number };
function area(s: Shape) {
  if (s.kind === "circle") return Math.PI * s.r * s.r;
  return s.w * s.h;
}

// ====================================================================================================
// Misc ----> Date helpers
// ====================================================================================================

// 81. Format yyyy-mm-dd
function toISODate(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

// ====================================================================================================
// Advanced Types ----> Recursive type constraints
// ====================================================================================================

// 82. JSON type
type JSONValue = string | number | boolean | null | JSONObject | JSONArray;
interface JSONObject {
  [k: string]: JSONValue;
}
interface JSONArray extends Array<JSONValue> {}

// ====================================================================================================
// Algorithms ----> Bitmask DP ---> subset sums
// ====================================================================================================

// 83. Subset sum --> bitmask DP for small n
function subsetSum(nums: number[], target: number) {
  const n = nums.length;
  for (let mask = 0; mask < 1 << n; mask++) {
    let s = 0;
    for (let i = 0; i < n; i++) if (mask & (1 << i)) s += nums[i];
    if (s === target) return true;
  }
  return false;
}

// ====================================================================================================
// Safety ----> Input sanitizer --> simple
// ====================================================================================================

// 84. Escape HTML
function escapeHTML(s: string) {
  return s.replace(
    /[&<>'"]/g,
    (c) =>
      ((
        {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          "'": "&#39;",
          '"': "&quot;",
        } as any
      )[c])
  );
}

// ====================================================================================================
// Algorithms ----> Heap problems
// ====================================================================================================

// 85. K smallest elements
function kSmallest(nums: number[], k: number) {
  const h = new MinHeap<number>();
  for (const n of nums) h.push(n);
  const res: number[] = [];
  for (let i = 0; i < k && h.size(); i++) res.push(h.pop()!);
  return res;
}

// ====================================================================================================
// Patterns ----> Visitor
// ====================================================================================================

// 86. Visitor pattern skeleton
interface Visitable {
  accept(v: Visitor): void;
}
interface Visitor {
  visitA?: (a: any) => void;
  visitB?: (b: any) => void;
}

// ====================================================================================================
// Algorithms ----> Reservoir for k
// ====================================================================================================

// 87. Reservoir sampling k
function reservoirK<T>(iter: Iterable<T>, k: number) {
  const res: T[] = [];
  let i = 0;
  for (const x of iter) {
    i++;
    if (res.length < k) res.push(x);
    else if (Math.random() < k / i) res[Math.floor(Math.random() * k)] = x;
  }
  return res;
}

// ====================================================================================================
// Debugging ----> Source map like helper ---> dummy
// ====================================================================================================

// 88. simple stack trace map
function prettyStack() {
  return new Error().stack;
}

// ====================================================================================================
// Algorithms ----> Bit DP Optimization
// ====================================================================================================

// 89. Count subsets with given sum ---> dp
function countSubsets(nums: number[], target: number) {
  const dp = Array(target + 1).fill(0);
  dp[0] = 1;
  for (const num of nums)
    for (let s = target; s >= num; s--) dp[s] += dp[s - num];
  return dp[target];
}

// ====================================================================================================
// Web-related helpers --> small
// ====================================================================================================

// 90. Cookie parser
function parseCookies(header: string) {
  return header
    .split(";")
    .map((p) => p.trim())
    .reduce((acc: any, pair) => {
      const [k, v] = pair.split("=");
      acc[k] = v;
      return acc;
    }, {});
}

// ====================================================================================================
// Algorithms ----> String compression
// ====================================================================================================

// 91. Run-length encoding
function rle(s: string) {
  let cur = s[0],
    cnt = 1,
    out = "";
  for (let i = 1; i < s.length; i++) {
    if (s[i] === cur) cnt++;
    else {
      out += cur + cnt;
      cur = s[i];
      cnt = 1;
    }
  }
  out += cur + cnt;
  return out;
}

// ====================================================================================================
// Realtime / Websocket-like small helper
// ====================================================================================================

// 92. Heartbeat manager (keepalive)
class Heartbeat {
  last = Date.now();
  beat() {
    this.last = Date.now();
  }
  isAlive(timeout = 30000) {
    return Date.now() - this.last < timeout;
  }
}

// ====================================================================================================
// AI / ML small utilities
// ====================================================================================================

// 93. Cosine similarity (vectors)
function dot(a: number[], b: number[]) {
  return a.reduce((s, v, i) => s + v * b[i], 0);
}
function magnitude(a: number[]) {
  return Math.sqrt(a.reduce((s, v) => s + v * v, 0));
}
function cosine(a: number[], b: number[]) {
  return dot(a, b) / (magnitude(a) * magnitude(b));
}

// ====================================================================================================
// Type Narrowing ----> Exhaustive checks
// ====================================================================================================

// 94. never-exhaustive helper
function assertNever(x: never): never {
  throw new Error("Unexpected object: " + x);
}

// ====================================================================================================
// System ----> PID-like Generator
// ====================================================================================================

// 95. Simple unique id
let _id = 0;
function uid() {
  return (++_id).toString(36);
}

// -----------------------------------------------------------------------------
// Advanced ----> Matrix multiplication---> naive
// -----------------------------------------------------------------------------

// 96. Matrix multiply
function matMul(A: number[][], B: number[][]) {
  const n = A.length,
    m = B[0].length,
    p = B.length;
  const C = Array.from({ length: n }, () => Array(m).fill(0));
  for (let i = 0; i < n; i++)
    for (let k = 0; k < p; k++)
      for (let j = 0; j < m; j++) C[i][j] += A[i][k] * B[k][j];
  return C;
}

// ====================================================================================================
// Algorithms ----> Balanced parentheses ---> stack
// ====================================================================================================

// 97. Valid parentheses
function validParentheses(s: string) {
  const stack: string[] = [];
  for (const ch of s) {
    if (ch === "(") stack.push(ch);
    else {
      if (!stack.length) return false;
      stack.pop();
    }
  }
  return stack.length === 0;
}

// ====================================================================================================
// Misc practical ----> Retry with backoff
// ====================================================================================================

// 98. Exponential backoff retry
async function retryBackoff<T>(fn: () => Promise<T>, retries = 5, base = 100) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      await new Promise((r) => setTimeout(r, base * Math.pow(2, i)));
    }
  }
  throw new Error("Failed after retries");
}

// ====================================================================================================
// Very advanced TS type trick --------> template literal mapping
// ====================================================================================================

// 99. Kebab to Camel (type level)
type KebabToCamel<S extends string> = S extends `${infer P}-${infer R}`
  ? `${P}${Capitalize<KebabToCamel<R>>}`
  : S;

// ====================================================================================================
// Example ----> Combine multiple utilities
// ====================================================================================================

// 100. Example function combining several utilities
function analyzeNumbers(nums: number[]) {
  return {
    sum: nums.reduce((a, b) => a + b, 0),
    mean: nums.reduce((a, b) => a + b, 0) / Math.max(1, nums.length),
    median: (() => {
      const s = [...nums].sort((a, b) => a - b);
      const m = Math.floor(s.length / 2);
      return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
    })(),
    std: Math.sqrt(
      nums
        .map((x) =>
          Math.pow(
            x - nums.reduce((a, b) => a + b, 0) / Math.max(1, nums.length),
            2
          )
        )
        .reduce((a, b) => a + b, 0) / Math.max(1, nums.length)
    ),
  };
}

// ===============================================================
// Example quick-run outputs ---> small tests
// ===============================================================
console.log("fibDP(10)=", fibDP(10));
console.log("quickSort of [3,1,2]=", quickSort([3, 1, 2]));
console.log("isPowerOfTwo(16)=", isPowerOfTwo(16));
console.log(
  'longestUniqueSubstr("abcabcbb")=',
  longestUniqueSubstr("abcabcbb")
);

// =======================================================================================================
// 100 Advanced TypeScript Problem-Solving Examples END
// =======================================================================================================
