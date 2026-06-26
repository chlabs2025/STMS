const fs = require('fs');
const file = 'c:\\Users\\moham\\OneDrive\\Documents\\GitHub\\STMS\\frontend\\src\\pages\\admin\\LocalDetailPage.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<div className="flex items-center gap-2 flex-shrink-0 mt-1 sm:mt-0 w-full sm:w-auto justify-end">/,
  `</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0 mt-1 sm:mt-0 w-full sm:w-auto justify-end">`
);

fs.writeFileSync(file, content);
console.log('Fixed extra div');
