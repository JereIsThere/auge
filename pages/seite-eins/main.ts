import data from './data.json';

const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML = `
  <p>Generiert: ${data.generated_at}</p>
  <p>Wert: ${data.value}</p>
`;
