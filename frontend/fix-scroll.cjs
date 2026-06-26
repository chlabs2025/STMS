const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'src', 'pages', 'admin');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

files.forEach(f => {
  const filePath = path.join(dir, f);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Replace top-level container classes that cause clipping
  const oldContent = content;
  content = content.replace(/className=\"([^\"]*)h-full min-h-full([^\"]*)overflow-(y-auto|hidden)([^\"]*)\"/g, (match, p1, p2, p3, p4) => {
    return 'className=\"' + (p1 + p2 + p4).replace(/\s+/g, ' ').trim() + '\"';
  });

  if (content !== oldContent) {
    fs.writeFileSync(filePath, content);
    console.log('Fixed:', f);
  }
});
