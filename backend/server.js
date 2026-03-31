const { exec } = require("child_process");
const fs = require("fs");

// RUN CODE API (FIXED VERSION)
app.post("/api/run", async (req, res) => {
  const { code, language } = req.body;

  if (!code) {
    return res.status(400).json({ output: "No code provided" });
  }

  // 🔹 Try Piston first
  try {
    const response = await axios.post(PISTON_URL, {
      language,
      version: "*",
      files: [{ content: code }],
    });

    return res.json({
      output:
        response.data.run?.output ||
        response.data.run?.stderr ||
        "No output",
    });

  } catch (err) {
    console.log("⚠️ Piston not available, switching to local execution...");
  }

  // 🔥 FALLBACK → LOCAL EXECUTION

  try {
    if (language === "javascript") {
      fs.writeFileSync("temp.js", code);

      exec("node temp.js", (error, stdout, stderr) => {
        if (error) {
          return res.json({ output: stderr || error.message });
        }
        res.json({ output: stdout });
      });

    } else if (language === "python") {
      fs.writeFileSync("temp.py", code);

      exec("python temp.py", (error, stdout, stderr) => {
        if (error) {
          return res.json({ output: stderr || error.message });
        }
        res.json({ output: stdout });
      });

    } else {
      res.json({ output: "⚠️ Language not supported locally" });
    }

  } catch (err) {
    res.status(500).json({
      output: "Execution failed",
    });
  }
});