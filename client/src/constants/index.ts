import type { Category, Step } from '../types'

export const CATEGORIES: Category[] = [
  { id: 'infraestrutura', categoria: 'INFRAESTRUTURA', label: 'Infraestrutura',     icon: 'ti-alert-triangle', iconColor: 'text-orange-500',  bgColor: 'bg-orange-50' },
  { id: 'iluminacao',     categoria: 'ILUMINACAO',     label: 'Iluminação Pública', icon: 'ti-bulb',           iconColor: 'text-amber-500',   bgColor: 'bg-amber-50' },
  { id: 'limpeza',        categoria: 'LIMPEZA',        label: 'Limpeza Urbana',     icon: 'ti-trash',          iconColor: 'text-emerald-600', bgColor: 'bg-emerald-50' },
  { id: 'sinalizacao',    categoria: 'SINALIZACAO',    label: 'Sinalização',        icon: 'ti-traffic-cone',   iconColor: 'text-red-500',     bgColor: 'bg-red-50' },
  { id: 'calcada',        categoria: 'CALCADA',        label: 'Calçada',            icon: 'ti-road',           iconColor: 'text-blue-600',    bgColor: 'bg-blue-50' },
  { id: 'arborizacao',    categoria: 'ARBORIZACAO',    label: 'Arborização',        icon: 'ti-trees',          iconColor: 'text-green-700',   bgColor: 'bg-green-50' },
  { id: 'outros',         categoria: 'OUTROS',         label: 'Outros',             icon: 'ti-grid-dots',      iconColor: 'text-slate-500',   bgColor: 'bg-slate-100' },
]

export const STEPS: Step[] = [
  {
    n: '1',
    icon: 'ti-map-pin',
    title: 'Relate o Problema',
    desc: 'Selecione a categoria, descreva a situação e informe o endereço da ocorrência. O registro é público e não exige cadastro.',
  },
  {
    n: '2',
    icon: 'ti-receipt',
    title: 'Receba seu Protocolo',
    desc: 'O sistema gera um identificador único imediatamente. Sua ocorrência entra na fila de análise da prefeitura.',
  },
  {
    n: '3',
    icon: 'ti-circle-check',
    title: 'Acompanhe a Solução',
    desc: 'Use o protocolo para consultar o status a qualquer momento, de forma pública e transparente.',
  },
]
