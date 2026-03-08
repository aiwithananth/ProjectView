/**
 * CSV format: same columns for all rows.
 * Overall export: Level (Project|Task|""), Project, Title, Description, Owner, Due Date, Status, Phase, Progress, Tags.
 * Missing values exported as ""; null/undefined/NaN normalized to "".
 */

export const COLS_SINGLE = ['Level', 'Title', 'Description', 'Owner', 'Start Date', 'Due Date', 'Status', 'Phase', 'Progress', 'Tags'];
const COLS_OVERALL = ['Level', 'Project', 'Title', 'Description', 'Owner', 'Start Date', 'Due Date', 'Status', 'Phase', 'Progress', 'Tags'];

function toEmpty(v) {
  if (v == null || v === '') return true;
  if (typeof v === 'number' && Number.isNaN(v)) return true;
  const s = String(v).trim().toLowerCase();
  if (s === '' || s === 'null' || s === 'undefined' || s === 'nan') return true;
  return false;
}

function escapeCsvCell(value) {
  if (toEmpty(value)) return '';
  const s = String(value).trim();
  if (s.includes(',') || s.includes('"') || s.includes('\n') || s.includes('\r')) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

function formatDateForCsv(date) {
  if (date == null || date === '') return '';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().split('T')[0];
}

/** Flatten task tree to export rows: root tasks have Level "Task", subtasks have Level "". */
export function taskTreeToExportRows(tasks) {
  const rows = [];
  function walk(task, isRoot) {
    const level = isRoot ? 'Task' : '';
    const owner = task.owner?.name ?? task.owner?.email ?? '';
    const tags = (task.tags || []).map((t) => t.name).join(';');
    rows.push({
      Level: level,
      Title: task.title ?? '',
      Description: task.description ?? '',
      Owner,
      'Start Date': formatDateForCsv(task.startDate),
      'Due Date': formatDateForCsv(task.dueDate),
      Status: task.status ?? 'PENDING',
      Phase: task.phase ?? '',
      Progress: Number.isFinite(task.progress) ? String(task.progress) : '',
      Tags: tags,
    });
    (task.children || []).forEach((child) => walk(child, false));
  }
  (tasks || []).forEach((t) => walk(t, true));
  return rows;
}

/**
 * Build overall export rows from API data: project rows (Level=Project, Project=name) + task rows per project.
 * All null/undefined/NaN/empty become "".
 */
export function overallExportRowsFromData(apiData) {
  const rows = [];
  const projects = apiData?.projects ?? [];
  for (const project of projects) {
    rows.push({
      Level: 'Project',
      Project: project.name ?? '',
      Title: '',
      Description: project.description ?? '',
      Owner: '',
      'Start Date': '',
      'Due Date': '',
      Status: '',
      Phase: '',
      Progress: '',
      Tags: '',
    });
    const projectName = project.name ?? '';
    function walk(task, isRoot) {
      const level = isRoot ? 'Task' : '';
      const owner = task.owner?.name ?? task.owner?.email ?? '';
      const tags = (task.tags || []).map((t) => t.name).join(';');
      const progress = task.progress;
      rows.push({
        Level: level,
        Project: isRoot ? projectName : '',
        Title: task.title ?? '',
        Description: task.description ?? '',
        Owner: owner,
        'Start Date': formatDateForCsv(task.startDate),
        'Due Date': formatDateForCsv(task.dueDate),
        Status: task.status ?? 'PENDING',
        Phase: task.phase ?? '',
        Progress: Number.isFinite(progress) ? String(progress) : '',
        Tags: tags,
      });
      (task.children || []).forEach((child) => walk(child, false));
    }
    (project.tasks || []).forEach((t) => walk(t, true));
  }
  return rows;
}

/** Build CSV string from rows. Use cols for column order (overall or single-project). */
export function buildCsv(rows, cols = COLS_OVERALL) {
  const header = cols.map(escapeCsvCell).join(',');
  const body = rows.map((row) => cols.map((c) => escapeCsvCell(row[c])).join(',')).join('\r\n');
  return '\uFEFF' + header + '\r\n' + body; // BOM for Excel UTF-8
}

/** Parse CSV text into rows of objects (keys = header). */
export function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter((line) => line.length > 0);
  if (lines.length === 0) return [];
  const header = parseCsvLine(lines[0]);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]);
    const row = {};
    header.forEach((h, j) => {
      row[h] = values[j] !== undefined ? values[j].trim() : '';
    });
    rows.push(row);
  }
  return rows;
}

function parseCsvLine(line) {
  const result = [];
  let i = 0;
  while (i < line.length) {
    if (line[i] === '"') {
      let cell = '';
      i++;
      while (i < line.length) {
        if (line[i] === '"') {
          i++;
          if (line[i] === '"') {
            cell += '"';
            i++;
          } else break;
        } else {
          cell += line[i];
          i++;
        }
      }
      result.push(cell);
    } else {
      let cell = '';
      while (i < line.length && line[i] !== ',') {
        cell += line[i];
        i++;
      }
      result.push(cell.trim());
    }
    if (line[i] === ',') i++;
  }
  return result;
}

const STATUS_MAP = {
  pending: 'PENDING',
  'in progress': 'IN_PROGRESS',
  in_progress: 'IN_PROGRESS',
  'on track': 'ON_TRACK',
  on_track: 'ON_TRACK',
  overdue: 'OVERDUE',
  blocked: 'BLOCKED',
  done: 'DONE',
};
const PHASE_MAP = { review: 'REVIEW', dev: 'DEV', test: 'TEST' };

/** Normalize a raw cell for import: "", "null", "undefined", "nan" -> "". */
function normalizeCell(v) {
  if (v == null) return '';
  const s = String(v).trim();
  if (s.toLowerCase() === 'null' || s.toLowerCase() === 'undefined' || s.toLowerCase() === 'nan') return '';
  return s;
}

/** Parse date string; return null if empty or invalid. Handles ISO, YYYY-MM-DD, MM/DD/YYYY, DD-MM-YYYY. */
export function parseDateSafe(value) {
  const s = normalizeCell(value);
  if (!s) return null;
  let d = new Date(s);
  if (!Number.isNaN(d.getTime())) return d.toISOString().split('T')[0];
  const iso = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) {
    d = new Date(iso[1], Number(iso[2]) - 1, Number(iso[3]));
    if (!Number.isNaN(d.getTime())) return d.toISOString().split('T')[0];
  }
  const slash = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slash) {
    d = new Date(Number(slash[3]), Number(slash[1]) - 1, Number(slash[2]));
    if (!Number.isNaN(d.getTime())) return d.toISOString().split('T')[0];
  }
  return null;
}

/** Normalize parsed row (case-insensitive headers). Empty/null/nan -> "". */
export function normalizeImportRow(row) {
  const key = (k) => Object.keys(row).find((r) => String(r).trim().toLowerCase() === k.toLowerCase()) || k;
  const get = (k) => normalizeCell(row[key(k)] ?? '');
  const statusRaw = get('Status') || 'PENDING';
  const phaseRaw = get('Phase');
  const progressRaw = get('Progress');
  let progress = 0;
  if (progressRaw) {
    const n = parseInt(progressRaw, 10);
    if (Number.isFinite(n)) progress = Math.min(100, Math.max(0, n));
  }
  return {
    level: get('Level'),
    project: get('Project'),
    title: get('Title'),
    description: get('Description'),
    owner: get('Owner'),
    startDate: parseDateSafe(row[key('Start Date')]),
    dueDate: parseDateSafe(row[key('Due Date')]),
    status: STATUS_MAP[statusRaw.toLowerCase()] ?? statusRaw.toUpperCase().replace(/\s+/g, '_'),
    phase: phaseRaw ? (PHASE_MAP[phaseRaw.toLowerCase()] ?? phaseRaw) : null,
    progress,
    tags: (get('Tags') || '').split(/[;,]/).map((t) => t.trim()).filter(Boolean),
  };
}
