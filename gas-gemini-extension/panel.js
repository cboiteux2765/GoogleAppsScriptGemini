const out = document.getElementById("out");

function bg() {
  return chrome.runtime.getBackgroundPage
    ? chrome.runtime.getBackgroundPage()
    : null;
}

async function run(action, args) {
  const deploymentId = document.getElementById("deploymentId").value.trim();
  if (!deploymentId) throw new Error("Missing deploymentId");

  const res = await chrome.runtime.sendMessage({
    type: "RUN_DEPLOYMENT",
    deploymentId,
    request: { action, args }
  });

  return res;
}

document.getElementById("btnPing").onclick = async () => {
  out.textContent = "Running...";
  try { out.textContent = JSON.stringify(await run("ping"), null, 2); }
  catch (e) { out.textContent = String(e); }
};

document.getElementById("btnSheet").onclick = async () => {
  out.textContent = "Running...";
  try { out.textContent = JSON.stringify(await run("createTestSheet", { name: "Gemini MVP Sheet" }), null, 2); }
  catch (e) { out.textContent = String(e); }
};
