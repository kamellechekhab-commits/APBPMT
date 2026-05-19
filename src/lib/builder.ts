import { Component } from '@/types/database';

export function checkCompatibility(parts: Component[]): string[] {
  const issues: string[] = [];
  const cpu = parts.find(p => p.category === 'cpu');
  const mb = parts.find(p => p.category === 'motherboard');
  const ram = parts.find(p => p.category === 'ram');

  if (cpu && mb) {
    if (cpu.specs.socket !== mb.specs.socket) {
      issues.push(`Incompatible Socket: CPU (${cpu.specs.socket}) and Motherboard (${mb.specs.socket})`);
    }
    if (cpu.specs.ram_type !== mb.specs.ram_type) {
      issues.push(`Incompatible RAM Type: CPU supports ${cpu.specs.ram_type}, but Motherboard supports ${mb.specs.ram_type}`);
    }
  }

  if (mb && ram) {
    if (mb.specs.ram_type !== ram.specs.ram_type) {
      issues.push(`Incompatible RAM Type: Motherboard supports ${mb.specs.ram_type}, but RAM is ${ram.specs.ram_type}`);
    }
  }

  return issues;
}
