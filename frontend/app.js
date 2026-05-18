const result = document.getElementById('result');
const button = document.getElementById('helloButton');

button.addEventListener('click', async () => {
  result.textContent = 'Calling backend...';
  try {
    const response = await fetch('/api/hello');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    result.textContent = JSON.stringify(data, null, 2);
  } catch (error) {
    result.textContent = `Request failed: ${error.message}`;
  }
});
