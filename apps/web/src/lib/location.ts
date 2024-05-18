export type Province =
  | 'Banten'
  | 'DKI Jakarta'
  | 'Jawa Barat'
  | 'Jawa Tengah'
  | 'Jawa Timur';

export const provinces: Record<Province, string[]> = {
  Banten: ['Serang', 'Tangerang'],
  'DKI Jakarta': [
    'Jakarta Pusat',
    'Jakarta Utara',
    'Jakarta Selatan',
    'Jakarta Timur',
    'Jakarta Barat',
  ],
  'Jawa Barat': ['Bandung', 'Bogor', 'Bekasi'],
  'Jawa Tengah': ['Semarang', 'Salatiga'],
  'Jawa Timur': ['Surabaya', 'Malang'],
};
