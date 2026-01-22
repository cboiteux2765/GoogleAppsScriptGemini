async function getToken(interactive = false) {
  const { token } = await chrome.identity.getAuthToken({ interactive });
  return token;
}

async function runDeployment(deploymentId, requestObj) {
  const token = await getToken(true);

  const res = await fetch(`https://script.googleapis.com/v1/scripts/${deploymentId}:run`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      function: "api_execute",
      parameters: [requestObj]
    })
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`scripts.run failed: ${res.status} ${txt}`);
  }
  return await res.json();
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  (async () => {
    if (msg.type === "RUN_DEPLOYMENT") {
      const result = await runDeployment(msg.deploymentId, msg.request);
      sendResponse(result);
    }
  })().catch(err => sendResponse({ error: String(err) }));
  return true;
});
