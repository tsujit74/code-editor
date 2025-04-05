import { spawn } from "child_process";
import { writeFile, unlink } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import os from "os"; // ✅ Import OS for cross-platform temp directory

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TIMEOUT = 5000;

async function executeCode(language, code) {
  try {
    switch (language) {
      case "python": {
        const process = spawn("python3", ["-c", code]);
        return handleProcess(process);
      }

      case "javascript": {
        const process = spawn("node", ["-e", code]);
        return handleProcess(process);
      }

      case "java": {
        const filename = `Main_${Date.now()}`;
        const folder = path.join(os.tmpdir(), filename); // ✅ Use OS temp dir
        const javaFile = `${folder}.java`;

        const javaCode = code.replace(/public\s+class\s+\w+/, `public class ${filename}`);

        await writeFile(javaFile, javaCode);

        const compileProcess = spawn("javac", [javaFile]);
        const compileResult = await handleProcess(compileProcess);

        if (!compileResult.success) {
          await cleanup(javaFile);
          return compileResult;
        }

        const runProcess = spawn("java", ["-cp", os.tmpdir(), filename]); // ✅ Fix classpath
        const result = await handleProcess(runProcess);

        await cleanup(javaFile);
        await unlink(path.join(os.tmpdir(), `${filename}.class`)).catch(() => {}); // ✅ Delete .class file

        return result;
      }

      case "cpp": {
        const filename = `temp_${Date.now()}`;
        const filepath = path.join(os.tmpdir(), filename); // ✅ OS temp dir

        await writeFile(`${filepath}.cpp`, code);

        const compileProcess = spawn("g++", [`${filepath}.cpp`, "-o", filepath]);
        const compileResult = await handleProcess(compileProcess);

        if (!compileResult.success) {
          await cleanup(filepath);
          return compileResult;
        }

        const runProcess = spawn(filepath);
        const result = await handleProcess(runProcess);

        await cleanup(filepath);
        return result;
      }

      default:
        throw new Error("Unsupported language");
    }
  } catch (error) {
    return {
      success: false,
      output: error.message,
    };
  }
}

function handleProcess(process) {
  return new Promise((resolve) => {
    let output = "";
    let error = "";
    let killed = false;

    const timeoutId = setTimeout(() => {
      process.kill();
      killed = true;
      resolve({
        success: false,
        output: "Execution timed out",
      });
    }, TIMEOUT);

    process.stdout.on("data", (data) => {
      output += data.toString();
    });

    process.stderr.on("data", (data) => {
      error += data.toString();
    });

    process.on("close", (code) => {
      clearTimeout(timeoutId);
      if (!killed) {
        resolve({
          success: code === 0,
          output: error || output,
        });
      }
    });
  });
}

async function cleanup(filepath) {
  try {
    await unlink(filepath);
    await unlink(`${filepath}.cpp`).catch(() => {});
    await unlink(`${filepath}.java`).catch(() => {});
    await unlink(`${filepath}.class`).catch(() => {});
  } catch (e) {
    console.error("Cleanup error:", e);
  }
}

export default executeCode;
