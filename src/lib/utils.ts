export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function formatPhone(phone: string): string {
  return phone.replace(/(\d{4})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4');
}

export function getBloodTypeColor(bt: string): string {
  const colors: Record<string, string> = {
    'O+': 'bg-red-600', 'O-': 'bg-red-800',
    'A+': 'bg-blue-600', 'A-': 'bg-blue-800',
    'B+': 'bg-green-600', 'B-': 'bg-green-800',
    'AB+': 'bg-purple-600', 'AB-': 'bg-purple-800',
  };
  return colors[bt] || 'bg-gray-600';
}

export const BLOOD_TYPES = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

export const EQUIPMENT_TYPES = [
  'كرسي متحرك', 'عكاز', 'سرير طبي', 'جهاز أكسجين',
  'أطراف اصطناعية', 'مشاية طبية', 'أخرى'
];

export const EQUIPMENT_CONDITIONS = ['جديد', 'مشابه للجديد', 'جيدة', 'مقبولة'];
