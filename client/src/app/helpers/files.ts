const someJSCodeExample = ``;
const someCSSCodeExample = ``;
const someHTMLCodeExample = ``;
const somePythonCodeExample = ``;
const someJavaCodeExample = `public class Simple {
  public static void main(String[] args) {
    System.out.println("Hello, Java!");
  }
}`;

// Define the type
type CodeFile = {
  name: string;
  language: string;
  value: string;
};

const files: Record<string, CodeFile> = {
  "script.js": {
    name: "script.js",
    language: "javascript",
    value: someJSCodeExample,
  },
  "style.css": {
    name: "style.css",
    language: "css",
    value: someCSSCodeExample,
  },
  "index.html": {
    name: "index.html",
    language: "html",
    value: someHTMLCodeExample,
  },
  "python.py": {
    name: "python.py",
    language: "python",
    value: somePythonCodeExample,
  },
  "cpp.cpp": {
    name: "cpp.cpp",
    language: "cpp",
    value: somePythonCodeExample,
  },
  "input.py": {
    name: "input.py",
    language: "input",
    value: somePythonCodeExample,
  },
  "output.py": {
    name: "output.py",
    language: "output",
    value: somePythonCodeExample,
  },
  "simple.java": {
    name: "simple.java",
    language: "java",
    value: someJavaCodeExample,
  },
};

export default files;
