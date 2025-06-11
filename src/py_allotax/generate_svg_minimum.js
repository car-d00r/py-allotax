import fs from 'fs';
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { combElems, RTD, myDiamond, wordShift_dat } from 'allotaxonometer';
import { renderDashboard } from './dist/dashboard-ssr-compiled.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

(async () => {
  try {
    // Parse command line arguments
    const tempFilePath = process.argv[2];
    const outputPath = process.argv[3];
    
    if (!tempFilePath || !outputPath) {
      console.error('Usage: node generate_pdf_direct.js <temp_file> <output.pdf>');
      process.exit(1);
    }
    
    // Load data from temp file
    const fullTempPath = resolve(__dirname, tempFilePath);
    
    if (!fs.existsSync(fullTempPath)) {
      console.error(`File not found: ${fullTempPath}`);
      process.exit(1);
    }
    
    const tempData = await import(`file://${fullTempPath}`);
    const { data1, data2, alpha, title1, title2 } = tempData;
    
    // Process data (same as your existing logic)
    const me = combElems(data1, data2);
    const rtd = RTD(me, alpha);
    const dat = myDiamond(me, rtd);
    const diamond_count = dat.counts;
    const diamond_dat = diamond_count.filter(d => d.types !== "");
    const barData = wordShift_dat(me, dat).slice(0, 30);
    
    // Calculate derived values
    const maxlog10 = Math.ceil(Math.max(
      Math.log10(Math.max(...me[0].ranks)),
      Math.log10(Math.max(...me[1].ranks))
    ));
    
    // Generate HTML with SSR
    const html = renderDashboard({
      diamond_count,
      diamond_dat,
      barData,
      test_elem_1: data1,
      test_elem_2: data2,
      alpha,
      rtd,
      title: [title1, title2],
      height: 815,
      width: 1200,
      maxlog10,
      DiamondHeight: 600,
      DiamondWidth: 600,
      DiamondInnerHeight: 440,
      margin: { inner: 160, diamond: 40 },
      trueDiamondHeight: 400
    });
    
    console.log('Launching browser...');
    
    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'] // Good for servers
    });
    
    const page = await browser.newPage();
    
    console.log('Setting page content...');
    
    // Set content and wait for rendering
    await page.setContent(html, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    console.log('Generating PDF...');
    
    // Generate PDF with good settings for your dashboard
    await page.pdf({
      path: outputPath,
      format: 'A3', // Larger format for your dashboard
      landscape: true,
      printBackground: true,
      preferCSSPageSize: false,
      margin: {
        top: '10mm',
        right: '10mm',
        bottom: '10mm',
        left: '10mm'
      },
      scale: 0.8 // Adjust if needed to fit content
    });
    
    await browser.close();
    console.log(`PDF successfully generated: ${outputPath}`);
    
  } catch (error) {
    console.error('Error generating PDF:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
})();