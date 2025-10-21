/* ALL JAVASCRIPT CODE STARTS */
// Syntax highlighting
hljs.highlightAll();

// Data
const examples = [
  {
    title: "Union Types Example",
    description:
      "Function that accepts both string and number types and returns different results based on the input type.",
    code: `function processInput(input: string | number): number {
    if (typeof input === "string") {
        return input.length;
    } else {
        return input * input;
    }
}`,
    run: (input) => {
      try {
        const parsedInput = isNaN(input) ? input : Number(input);
        return processInput(parsedInput);
      } catch (e) {
        return "Error: " + e.message;
      }
    },
  },
  {
    title: "Optional Chaining Example",
    description:
      "Safely access nested properties with optional chaining to avoid runtime errors.",
    code: `interface Address {
    city: string;
    street: string;
}

interface Person {
    phone?: string;
    address?: Address;
}

const getAddressCity = (person: Person): string | undefined => {
    return person.address?.city;
}`,
    run: (input) => {
      try {
        const testPerson = {
          name: "John",
          address:
            input === "withAddress"
              ? { city: "New York", street: "Broadway" }
              : undefined,
        };
        return getAddressCity(testPerson) || "No address found";
      } catch (e) {
        return "Error: " + e.message;
      }
    },
  },
  {
    title: "Type Guards Example",
    description:
      "Using type guards to narrow down types and ensure type safety at runtime.",
    code: `class Cat {
    meow() {
        return "Meow!";
    }
}

const isCat = (obj: any): obj is Cat => {
    return obj instanceof Cat;
}

const checkCat = (obj: any): string => {
    if (isCat(obj)) {
        return "Yes, it's a cat: " + obj.meow();
    } else {
        return "No, it's not a cat";
    }
}`,
    run: (input) => {
      try {
        if (input === "cat") {
          return checkCat(new Cat());
        } else {
          return checkCat({ bark: () => "Woof!" });
        }
      } catch (e) {
        return "Error: " + e.message;
      }
    },
  },
  {
    title: "Type Assertions Example",
    description:
      "Using type assertions to tell the compiler to treat a value as a specific type.",
    code: `const processData = (mixedData: string | number) => {
    if (typeof mixedData === "string") {
        const convertNumber = parseFloat(mixedData) * 1000;
        return \`String converted to number: \${convertNumber}\`;
    }
    if (typeof mixedData === "number") {
        return \`Number multiplied by 1000: \${mixedData * 1000}\`;
    }
}`,
    run: (input) => {
      try {
        const parsedInput = isNaN(input) ? input : Number(input);
        return processData(parsedInput);
      } catch (e) {
        return "Error: " + e.message;
      }
    },
  },
  {
    title: "Generics Example",
    description:
      "Using generics to create reusable components that work with multiple types.",
    code: `const findFirstOccurrence = <T>(arr: T[], value: T): number => {
    const index = arr.indexOf(value);
    return index;
}

const numbers: number[] = [1, 2, 3, 4, 5, 2];
const strings: string[] = ['apple', "banana", "cherry", "data", "apple"];`,
    run: (input) => {
      try {
        const numbers = [1, 2, 3, 4, 5, 2];
        const strings = ["apple", "banana", "cherry", "data", "apple"];

        if (input === "number") {
          return `Index of 2 in numbers: ${findFirstOccurrence(numbers, 2)}`;
        } else {
          return `Index of "cherry" in strings: ${findFirstOccurrence(
            strings,
            "cherry"
          )}`;
        }
      } catch (e) {
        return "Error: " + e.message;
      }
    },
  },
  {
    title: "Decorators Example",
    description: "Using decorators to add metadata and modify class behavior.",
    code: `function log(target: any, key: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = function(...args: any[]) {
        console.log(\`Calling \${key} with args: \${JSON.stringify(args)}\`);
        const result = originalMethod.apply(this, args);
        console.log(\`\${key} returned: \${JSON.stringify(result)}\`);
        return result;
    };
    
    return descriptor;
}

class Calculator {
    @log
    add(x: number, y: number): number {
        return x + y;
    }
}

const calc = new Calculator();
console.log(calc.add(5, 3));`,
    run: (input) => {
      try {
        return "Decorators are a compile-time feature. Check the console for output if running in a proper TypeScript environment.";
      } catch (e) {
        return "Error: " + e.message;
      }
    },
  },
];

let currentExample = 0;
let lastScrollTop = 0;
let chatbotOpen = false;

// Function To Show
function showExample(index) {
  currentExample = index - 1;
  const example = examples[currentExample];
  document.getElementById("example-title").textContent = example.title;
  document.getElementById("example-description").textContent =
    example.description;
  document.getElementById("example-code").textContent = example.code;

  // Update Input Placeholder
  let placeholder = "Enter a value";
  if (currentExample === 1)
    placeholder = "Enter 'withAddress' or anything else";
  if (currentExample === 2) placeholder = "Enter 'cat' or anything else";
  if (currentExample === 4) placeholder = "Enter 'number' or anything else";

  document.getElementById("example-input").placeholder = placeholder;

  // Update Tabs
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((tab, i) => {
    if (i === index - 1) {
      tab.classList.add("tab-active");
    } else {
      tab.classList.remove("tab-active");
    }
  });

  hljs.highlightAll();
}

// Function To Run
function runExample() {
  const input = document.getElementById("example-input").value;
  const output = examples[currentExample].run(input);
  document.getElementById("example-output").textContent = output;
}

// Function To Compile
function compileCode() {
  const code = document.getElementById("typescript-code").value;
  const outputElement = document.getElementById("output-code");

  // Show Loading State
  outputElement.innerHTML = '<span class="spinner"></span> Compiling...';

  setTimeout(() => {
    try {
      const result = window.ts.transpileModule(code, {
        compilerOptions: {
          target: window.ts.ScriptTarget.ES2015,
          module: window.ts.ModuleKind.CommonJS,
          strict: true,
          experimentalDecorators: true,
        },
      });

      const compiledCode = result.outputText;
      const originalLog = console.log;
      let output = "";
      console.log = function (message) {
        output += message + "\n";
      };
      try {
        eval(compiledCode);
      } catch (e) {
        output = "Runtime error: " + e.message;
      }
      console.log = originalLog;

      outputElement.textContent =
        output || "Code executed successfully (no output)";
    } catch (error) {
      outputElement.textContent = "Compilation error: " + error.message;
    }
  }, 500);
}

// Format Code Editor
function formatCode() {
  const codeElement = document.getElementById("typescript-code");
  const code = codeElement.value;

  try {
    let formattedCode = code
      .replace(/(\{)(?!\s)/g, "$1 ")
      .replace(/(\})(?!\s)/g, "$1 ")
      .replace(/(\;)(?!\s)/g, "$1\n")
      .replace(/(\n)(\s*)(?=\/\/)/g, "$1$2");

    codeElement.value = formattedCode;
  } catch (e) {
    console.error("Error formatting code:", e);
  }
}

// Clear Editor
function clearEditor() {
  if (confirm("Are you sure you want to clear the editor?")) {
    document.getElementById("typescript-code").value = "";
  }
}

// Clear Output
function clearOutput() {
  document.getElementById("output-code").textContent = "// Output cleared";
}

// Toggle Article Visibility
function toggleArticle(index) {
  const articles = document.querySelectorAll(".article-content");
  const article = articles[index];
  article.classList.toggle("show");

  // Update Chevron Icon
  const chevron = article.parentElement.querySelector(".fa-chevron-down");
  chevron.classList.toggle("fa-rotate-180");
}

// Show Article
function showArticle(index) {
  const articles = document.querySelectorAll(".article-content");
  articles.forEach((article) => {
    article.classList.remove("show");
  });

  // Reset All Chevrons
  const chevrons = document.querySelectorAll(".fa-chevron-down");
  chevrons.forEach((chevron) => {
    chevron.classList.remove("fa-rotate-180");
  });
  toggleArticle(index);
  document.getElementById("articles").scrollIntoView({ behavior: "smooth" });
}

// Toggle Mobile Menu
function toggleMobileMenu() {
  const mobileMenu = document.getElementById("mobile-menu");
  mobileMenu.classList.toggle("-translate-y-full");
}

// Toggle Chatbot
function toggleChatbot() {
  const chatbotWindow = document.querySelector(".chatbot-window");
  chatbotOpen = !chatbotOpen;

  if (chatbotOpen) {
    chatbotWindow.classList.add("open");
    document.getElementById("chat-input").focus();
  } else {
    chatbotWindow.classList.remove("open");
  }
}

// Send Message To Chatbot
function sendMessage() {
  const input = document.getElementById("chat-input");
  const message = input.value.trim();

  if (message === "") return;

  const chatMessages = document.getElementById("chat-messages");

  // Add User Message
  const userMessage = document.createElement("div");
  userMessage.className = "message user-message";
  userMessage.textContent = message;
  chatMessages.appendChild(userMessage);

  // Clear Input
  input.value = "";

  // Scroll To Bottom
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // Show Typing Indicator
  const typingIndicator = document.createElement("div");
  typingIndicator.className = "typing-animation";
  typingIndicator.innerHTML = "<span></span><span></span><span></span>";
  chatMessages.appendChild(typingIndicator);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // Simulate AI response After A Delay
  setTimeout(() => {
    chatMessages.removeChild(typingIndicator);

    // Add Bot Response
    const botResponse = getBotResponse(message);
    const botMessage = document.createElement("div");
    botMessage.className = "message bot-message";
    botMessage.innerHTML = botResponse;
    chatMessages.appendChild(botMessage);

    // Scroll To Bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 1500);
}

// Get Bot Response Based On User Message
function getBotResponse(message) {
  const lowerMessage = message.toLowerCase();

  // Union Types
  if (
    lowerMessage.includes("union") ||
    lowerMessage.includes("multiple type")
  ) {
    return `Union types allow a value to be one of several types. You define them using the pipe character (|). For example: <code>type ID = string | number;</code>. This is useful when a value can be of multiple types, like API responses where a field could be a string, number, or null.`;
  }
  // Generics Types
  else if (
    lowerMessage.includes("generic") ||
    lowerMessage.includes("reusable")
  ) {
    return `Generics enable creating reusable components that work with multiple types. They provide type variables that can be used to capture types. For example: <code>function identity&lt;T&gt;(arg: T): T { return arg; }</code>. This allows the function to work with any type while maintaining type safety.`;
  }
  // Type Guards
  else if (
    lowerMessage.includes("guard") ||
    lowerMessage.includes("narrow") ||
    lowerMessage.includes("runtime check")
  ) {
    return `Type guards are expressions that perform runtime checks to narrow down types. You can use typeof, instanceof, or custom type guard functions with a type predicate. For example: <code>function isString(value: any): value is string { return typeof value === "string"; }</code>. This helps TypeScript understand the type within conditional blocks.`;
  }
  // Optional Chaining
  else if (
    lowerMessage.includes("optional") ||
    lowerMessage.includes("chain") ||
    lowerMessage.includes("safe access")
  ) {
    return `Optional chaining (?.) allows safe access to nested properties without worrying about null/undefined. For example: <code>const city = user?.address?.city;</code>. It short-circuits and returns undefined if any part is null/undefined. This eliminates the need for verbose null checks.`;
  }
  // Type Assertions
  else if (
    lowerMessage.includes("assertion") ||
    lowerMessage.includes("cast") ||
    lowerMessage.includes("tell compiler")
  ) {
    return `Type assertions tell the compiler to treat a value as a specific type. Use the as syntax: <code>let value = someValue as string;</code>. This is useful when you know more about the type than TypeScript does, like when working with DOM elements: <code>const input = document.getElementById('myInput') as HTMLInputElement;</code>.`;
  }
  // Decorators
  else if (
    lowerMessage.includes("decorator") ||
    lowerMessage.includes("annotation") ||
    lowerMessage.includes("metadata")
  ) {
    return `Decorators are a special kind of declaration that can be attached to classes, methods, properties, or parameters. They use the form @expression and are an experimental feature. Example: <code>function sealed(constructor: Function) { Object.seal(constructor); Object.seal(constructor.prototype); }</code>. They're commonly used in frameworks like Angular to provide functionality like dependency injection, component definitions, and more.`;
  }
  // Advanced Types
  else if (
    lowerMessage.includes("advanced type") ||
    lowerMessage.includes("mapped") ||
    lowerMessage.includes("conditional")
  ) {
    return `TypeScript provides advanced types like Mapped Types, Conditional Types, and Template Literal Types. For example, a mapped type: <code>type Readonly&lt;T&gt; = { readonly [P in keyof T]: T[P]; }</code>. Conditional types: <code>type NonNullable&lt;T&gt; = T extends null | undefined ? never : T;</code>. These allow for powerful type transformations.`;
  }
  // Modules And Namespaces
  else if (
    lowerMessage.includes("module") ||
    lowerMessage.includes("namespace") ||
    lowerMessage.includes("import")
  ) {
    return `Modules and namespaces help organize code. Modules are file-based and use import/export. Namespaces are used to group related code and avoid global scope pollution. Example module: <code>export function add(x: number, y: number) { return x + y; }</code>. Example namespace: <code>namespace Geometry { export function area() { ... } }</code>.`;
  }
  // Utility Types
  else if (
    lowerMessage.includes("utility") ||
    lowerMessage.includes("partial") ||
    lowerMessage.includes("pick") ||
    lowerMessage.includes("omit")
  ) {
    return `Utility types are built-in type transformations in TypeScript. Common ones include Partial&lt;T&gt; (makes all properties optional), Required&lt;T&gt; (makes all properties required), Pick&lt;T, K&gt; (selects specific properties), and Omit&lt;T, K&gt; (removes specific properties). For example: <code>type PartialUser = Partial&lt;User&gt;;</code>`;
  }
  // Type Inference
  else if (
    lowerMessage.includes("inference") ||
    lowerMessage.includes("infer") ||
    lowerMessage.includes("automatic")
  ) {
    return `Type inference allows TypeScript to automatically determine types when they're not explicitly annotated. TypeScript can infer types from variable initialization, function return values, and contextual information. For example: <code>let x = 3; // TypeScript infers type 'number'</code>.`;
  }
  // Declaration Files
  else if (
    lowerMessage.includes("declaration") ||
    lowerMessage.includes(".d.ts") ||
    lowerMessage.includes("type definition")
  ) {
    return `Declaration files (with .d.ts extension) describe the shape of existing JavaScript code, enabling TypeScript to provide type checking for JavaScript libraries. They use the declare keyword to describe types that exist at runtime. For example: <code>declare function myLibraryFunction(): void;</code>`;
  }
  // Hello Hi Hey
  else if (
    lowerMessage.includes("hello") ||
    lowerMessage.includes("hi") ||
    lowerMessage.includes("hey")
  ) {
    return `Hello! I'm your TypeScript assistant. Ask me about TypeScript features like union types, generics, type guards, optional chaining, type assertions, decorators, advanced types, modules and namespaces, utility types, type inference, or declaration files.`;
  }
  // Default Response
  else {
    return `I'm not sure how to answer that. Try asking about TypeScript features like:
          <ul class="mt-2 ml-4 list-disc">
            <li>Union types</li>
            <li>Generics</li>
            <li>Type guards</li>
            <li>Optional chaining</li>
            <li>Type assertions</li>
            <li>Decorators</li>
            <li>Advanced types</li>
            <li>Modules and namespaces</li>
            <li>Utility types</li>
            <li>Type inference</li>
            <li>Declaration files</li>
          </ul>`;
  }
}

// TypeScript Functions
function processInput(input) {
  if (typeof input === "string") {
    return input.length;
  } else {
    return input * input;
  }
}

function getAddressCity(person) {
  return person.address?.city;
}

class Cat {
  meow() {
    return "Meow!";
  }
}

function isCat(obj) {
  return obj instanceof Cat;
}

function checkCat(obj) {
  if (isCat(obj)) {
    return "Yes, it's a cat: " + obj.meow();
  } else {
    return "No, it's not a cat";
  }
}

function processData(mixedData) {
  if (typeof mixedData === "string") {
    const convertNumber = parseFloat(mixedData) * 1000;
    return `String converted to number: ${convertNumber}`;
  }
  if (typeof mixedData === "number") {
    return `Number multiplied by 1000: ${mixedData * 1000}`;
  }
}

function findFirstOccurrence(arr, value) {
  const index = arr.indexOf(value);
  return index;
}

// Hide Navbar On Scroll Down, Show On Scroll Up
window.addEventListener("scroll", function () {
  const navbar = document.getElementById("navbar");
  const mobileMenu = document.getElementById("mobile-menu");
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (scrollTop > lastScrollTop && scrollTop > 100) {
    navbar.classList.add("nav-hidden");
    mobileMenu.classList.add("-translate-y-full");
  } else {
    navbar.classList.remove("nav-hidden");
  }

  lastScrollTop = scrollTop;
});

// Close Mobile Menu When Clicking Outside
document.addEventListener("click", function (event) {
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileMenuButton = document.getElementById("mobile-menu-button");

  if (
    !mobileMenu.contains(event.target) &&
    event.target !== mobileMenuButton &&
    !mobileMenuButton.contains(event.target)
  ) {
    mobileMenu.classList.add("-translate-y-full");
  }
});

// Close Chatbot When Clicking Outside
document.addEventListener("click", function (event) {
  const chatbotButton = document.querySelector(".chatbot-button");
  const chatbotWindow = document.querySelector(".chatbot-window");

  if (
    chatbotOpen &&
    !chatbotWindow.contains(event.target) &&
    !chatbotButton.contains(event.target)
  ) {
    toggleChatbot();
  }
});

showExample(1);

/* ALL JAVASCRIPT CODE ENDS */
