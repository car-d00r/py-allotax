<script>
  import Diamond from './Diamond.svelte';
  import Wordshift from './Wordshift.svelte';
  import DivergingBarChart from './DivergingBarChart.svelte';
  import Legend from './Legend.svelte';

  let {
    diamond_count = [],
    diamond_dat = [],
    barData = [],
    test_elem_1 = null,
    test_elem_2 = null,
    height = 815,
    width = 1200,
    DiamondHeight = 600,
    DiamondWidth = 600,
    DiamondInnerHeight = 440,
    margin = { inner: 160, diamond: 40 },
    trueDiamondHeight = 400,
    alpha = 0.58,
    maxlog10 = 0,
    rtd = null,
    title = ['System 1', 'System 2']
  } = $props();
</script>

<svg width={width} height={height} xmlns="http://www.w3.org/2000/svg">
  <Diamond 
    {diamond_count} 
    {diamond_dat} 
    {DiamondInnerHeight} 
    {margin} 
    {trueDiamondHeight} 
    {alpha} 
    {maxlog10} 
    {rtd} 
    {title}
  />
  
  <Wordshift 
    {barData} 
    DashboardHeight={height} 
    DashboardWidth={width}
  />
  
  <DivergingBarChart 
    {test_elem_1} 
    {test_elem_2} 
    {DiamondHeight} 
    {DiamondWidth} 
  />
  
  <Legend 
    {diamond_dat} 
    {DiamondHeight}
  />
</svg>