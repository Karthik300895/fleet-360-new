/**
 * Canonical _acl-output path for Markdown Studio saves (shared by save-markdown API).
 */
export function resolveMarkdownRepoPath(folderPath, filename) {
  let cleanFolder = (folderPath || '').replaceAll('\\', '/').trim();
  cleanFolder = cleanFolder.replace(/^(_acl-output|_acl_output|acl-output)\/?/i, '');
  cleanFolder = cleanFolder.replace(/^\/+/, '').replace(/\/+$/, '');
  const cleanFilename = (filename || '').replace(/^\/+/, '').trim();
  const lowerName = cleanFilename.toLowerCase();

  if (lowerName === 'project-context.md') {
    cleanFolder = '';
  } else if (!cleanFolder || cleanFolder === 'root' || cleanFolder === '.') {
    switch (lowerName) {
      case 'brief.md': {
        cleanFolder = '1-analysis/acl-product-brief';
        break;
      }
      case 'prd.md': {
        cleanFolder = '2-plan-workflows/acl-prd';
        break;
      }
      case 'architecture-spine.md':
      case 'architecture.md': {
        cleanFolder = '3-solutioning/acl-architecture';
        break;
      }
      case 'epics.md': {
        cleanFolder = '3-solutioning/acl-create-epics-and-stories';
        break;
      }
      default: {
        if (/^story-\d+/i.test(lowerName) || /^spec-/i.test(lowerName)) {
          cleanFolder = '4-implementation';
        } else {
          cleanFolder = '';
        }
        break;
      }
    }
  }

  const repoFilePath = cleanFolder
    ? `_acl-output/${cleanFolder}/${cleanFilename}`
    : `_acl-output/${cleanFilename}`;

  return { repoFilePath, cleanFilename, cleanFolder };
}
