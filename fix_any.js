const fs = require('fs');

function fixAny(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (filePath.includes('asset-client.tsx')) {
    // Assets table
    content = content.replace(/rows=\{initialAssets\}[\s\S]*?columns=\{(?:[\s\S]*?)\}/, match => {
      return match.replace(/\(d: any\)/g, '(d: AssetDto)');
    });
    // Locations table
    content = content.replace(/rows=\{locations\}[\s\S]*?columns=\{(?:[\s\S]*?)\}/, match => {
      return match.replace(/\(d: any\)/g, '(d: AssetLocationDto)');
    });
    // Modal forms
    content = content.replace(/\(e: any\)/g, '(e: any)'); // will fix later
  }
  
  if (filePath.includes('petition-client.tsx')) {
    content = content.replace(/\(d: any\)/g, '(d: PetitionDto)');
  }

  if (filePath.includes('research-client.tsx')) {
    content = content.replace(/rows=\{initialProjects\}[\s\S]*?columns=\{(?:[\s\S]*?)\}/, match => {
      return match.replace(/\(d: any\)/g, '(d: ResearchProjectDto)');
    });
    content = content.replace(/rows=\{initialPublications\}[\s\S]*?columns=\{(?:[\s\S]*?)\}/, match => {
      return match.replace(/\(d: any\)/g, '(d: PublicationDto)');
    });
  }

  if (filePath.includes('document-client.tsx')) {
    content = content.replace(/\(d: any\)/g, '(d: any)'); // wait
  }

  // General Input fixes
  content = content.replace(/onChange=\{\(e: any\) =>/g, 'onChange={(e) =>');

  // getStatusTone fixes
  content = content.replace(/getStatusTone\((.*?)\) as any/g, 'getStatusTone($1) as any');

  fs.writeFileSync(filePath, content, 'utf8');
}

fixAny('src/app/(admin)/asset/_components/asset-client.tsx');
fixAny('src/app/(admin)/petition/_components/petition-client.tsx');
fixAny('src/app/(admin)/research/_components/research-client.tsx');
fixAny('src/app/(admin)/document/_components/document-client.tsx');
fixAny('src/app/(admin)/document/types/_components/types-client.tsx');
fixAny('src/app/(admin)/personnel/_components/personnel-client.tsx');

