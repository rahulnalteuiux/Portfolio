const fs = require('fs');
const postcss = require('postcss');

const tiers = [
  { name: 'Extra Small Mobile', query: '(max-width: 374px)', max: 374 },
  { name: 'Mobile', query: '(min-width: 375px) and (max-width: 767px)', min: 375, max: 767 },
  { name: 'Tablet', query: '(min-width: 768px) and (max-width: 1023px)', min: 768, max: 1023 },
  { name: 'Laptop', query: '(min-width: 1024px) and (max-width: 1279px)', min: 1024, max: 1279 },
  { name: 'Desktop', query: '(min-width: 1280px) and (max-width: 1535px)', min: 1280, max: 1535 },
  { name: 'Large Desktop', query: '(min-width: 1536px)', min: 1536 }
];

function processCSS(inputFile) {
  const css = fs.readFileSync(inputFile, 'utf8');
  const root = postcss.parse(css);

  const tierBuckets = tiers.map(t => postcss.atRule({ name: 'media', params: t.query, nodes: [] }));
  const otherMedia = [];

  root.walkAtRules('media', (rule) => {
    const params = rule.params.replace(/\s+/g, ' ');

    let parsedMax = null;
    let parsedMin = null;

    const maxMatch = params.match(/max-width:\s*(\d+)px/);
    if (maxMatch) parsedMax = parseInt(maxMatch[1], 10);

    const minMatch = params.match(/min-width:\s*(\d+)px/);
    if (minMatch) parsedMin = parseInt(minMatch[1], 10);

    // If it's a simple width-based media query
    if (params.includes('width:') && !params.includes('height:') && !params.includes('ratio')) {
      tiers.forEach((tier, index) => {
        let isMatch = true;
        
        if (parsedMax !== null) {
          if (tier.min && tier.min > parsedMax) isMatch = false;
        }
        
        if (parsedMin !== null) {
          if (tier.max && tier.max < parsedMin) isMatch = false;
        }

        if (isMatch) {
          rule.nodes.forEach(n => {
            tierBuckets[index].append(n.clone());
          });
        }
      });
      // Remove original rule since we redistributed it entirely
      rule.remove();
    } else {
      // Keep other media queries (hover, print, dark mode, etc) in place
      otherMedia.push(rule.clone());
      rule.remove();
    }
  });

  // Now append the filtered tier buckets to root at the end
  tiers.forEach((t, i) => {
    if (tierBuckets[i].nodes.length > 0) {
      const comment = postcss.comment({ text: `--- ${t.name} ---` });
      root.append(comment);
      root.append(tierBuckets[i]);
    }
  });

  otherMedia.forEach(m => root.append(m));

  fs.writeFileSync(inputFile, root.toString());
  console.log('Processed', inputFile);
}

const targetDir = '../css/';
['style.css', 'responsive.css', 'animations.css', 'case-study.css'].forEach(file => {
  if (fs.existsSync(targetDir + file)) {
      processCSS(targetDir + file);
  }
});
