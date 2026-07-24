import Papa from "papaparse";

export type CsvMappingRow = {
  filename: string;
  productCode: string;
  productName?: string;
};

export type CsvMappingResult = {
  rows: CsvMappingRow[];
  byFilename: Map<string, CsvMappingRow>;
  errors: string[];
};

const FILENAME_KEYS = ["filename", "file", "파일명", "이미지", "이미지명"];
const CODE_KEYS = ["productcode", "product_code", "sku", "code", "상품코드", "코드"];
const NAME_KEYS = ["productname", "product_name", "name", "상품명", "이름"];

function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/[\s_-]+/g, "");
}

function pick(row: Record<string, string>, candidates: string[]): string | undefined {
  const normalizedRow = new Map(
    Object.entries(row).map(([k, v]) => [normalize(k), v]),
  );
  for (const c of candidates) {
    const v = normalizedRow.get(normalize(c));
    if (v && v.trim()) return v.trim();
  }
  return undefined;
}

export function parseCsvMapping(file: File): Promise<CsvMappingResult> {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows: CsvMappingRow[] = [];
        const byFilename = new Map<string, CsvMappingRow>();
        const errors: string[] = [];

        results.data.forEach((raw, i) => {
          const filename = pick(raw, FILENAME_KEYS);
          const productCode = pick(raw, CODE_KEYS);
          if (!filename || !productCode) {
            errors.push(
              `${i + 2}행: 파일명 또는 상품코드 열을 찾을 수 없습니다`,
            );
            return;
          }
          const row: CsvMappingRow = {
            filename,
            productCode,
            productName: pick(raw, NAME_KEYS),
          };
          rows.push(row);
          byFilename.set(filename.trim(), row);
          // 확장자 유연 매칭
          const noExt = stripExt(filename);
          if (!byFilename.has(noExt)) byFilename.set(noExt, row);
        });

        resolve({ rows, byFilename, errors });
      },
      error: (err) => reject(err),
    });
  });
}

function stripExt(name: string): string {
  const dot = name.lastIndexOf(".");
  return dot > 0 ? name.slice(0, dot) : name;
}

export function findMapping(
  mapping: CsvMappingResult | null,
  filename: string,
): CsvMappingRow | undefined {
  if (!mapping) return undefined;
  const direct = mapping.byFilename.get(filename);
  if (direct) return direct;
  return mapping.byFilename.get(stripExt(filename));
}
