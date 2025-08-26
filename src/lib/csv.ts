export function parseCSV(text: string): { rows: Record<string,string>[], errors: string[] } {
    const lines = text.replace(/\r\n/g, '\n').split('\n').filter(l => l.trim().length)
    if (lines.length === 0) return { rows: [], errors: ['Empty CSV'] }
    const headers = splitCSVLine(lines[0])
    const errors: string[] = []
    const rows: Record<string,string>[] = []
    for (let i = 1; i < lines.length; i++) {
      const cols = splitCSVLine(lines[i])
      if (cols.length !== headers.length) {
        errors.push(`Line ${i+1}: expected ${headers.length} columns, got ${cols.length}`)
        continue
      }
      const row: Record<string,string> = {}
      headers.forEach((h, idx) => row[h] = cols[idx])
      rows.push(row)
    }
    return { rows, errors }
  }
  
  function splitCSVLine(line: string): string[] {
    const out: string[] = []
    let cur = ''
    let inQuotes = false
    for (let i=0; i<line.length; i++){
      const ch = line[i]
      if (inQuotes) {
        if (ch === '"') {
          if (line[i+1] === '"') { cur += '"'; i++ } else { inQuotes = false }
        } else {
          cur += ch
        }
      } else {
        if (ch === ',') { out.push(cur); cur = '' }
        else if (ch === '"') { inQuotes = true }
        else { cur += ch }
      }
    }
    out.push(cur)
    return out.map(s => s.trim())
  }
  