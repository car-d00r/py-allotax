
import { render } from 'svelte/server';
import Dashboard from './components/Dashboard.svelte';

export function renderDashboard(props) {
  const result = render(Dashboard, { props });
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Allotaxonometer Dashboard</title>
</head>
<body>
  ${result.body}
</body>
</html>`;
}