document.getElementById('verifyBtn').addEventListener('click', async () => {
  const resultDiv = document.getElementById('result');
  resultDiv.style.display = 'block';
  resultDiv.innerHTML = 'Scraping page & running AI analysis...';

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // Call backend API
    const response = await fetch('http://localhost:8000/api/v1/detect/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: tab.title || "Page Content Verification",
        title: tab.title,
        url: tab.url,
        input_type: "url"
      })
    });

    const data = await response.json();
    const verdictClass = data.verdict === 'Real' ? 'verdict-real' : 'verdict-fake';
    
    resultDiv.innerHTML = `
      <div>Verdict: <span class="${verdictClass}">${data.verdict}</span></div>
      <div>Confidence: <strong>${data.confidence_score}%</strong></div>
      <div>Risk Rating: <strong>${data.risk_score}/100</strong></div>
      <p style="margin-top: 6px;">${data.explanation}</p>
    `;
  } catch (e) {
    resultDiv.innerHTML = 'Error analyzing page. Ensure VeritasAI backend is running on port 8000.';
  }
});
