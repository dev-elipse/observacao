import type { Category, ServiceRequest, Step, ActivityEvent } from '../types'

export const CATEGORIES: Category[] = [
  { id: 'iluminacao', label: 'Iluminação Pública',  icon: 'ti-bulb',               iconColor: 'text-amber-500',   bgColor: 'bg-amber-50' },
  { id: 'buraco',     label: 'Buraco na Via',        icon: 'ti-alert-triangle',     iconColor: 'text-orange-500',  bgColor: 'bg-orange-50' },
  { id: 'limpeza',    label: 'Limpeza Urbana',       icon: 'ti-trash',              iconColor: 'text-emerald-600', bgColor: 'bg-emerald-50' },
  { id: 'saude',      label: 'Saúde Pública',        icon: 'ti-heart-rate-monitor', iconColor: 'text-red-500',     bgColor: 'bg-red-50' },
  { id: 'seguranca',  label: 'Segurança Escolar',    icon: 'ti-shield-check',       iconColor: 'text-blue-600',    bgColor: 'bg-blue-50' },
  { id: 'poda',       label: 'Poda de Árvores',      icon: 'ti-trees',              iconColor: 'text-green-700',   bgColor: 'bg-green-50' },
  { id: 'outros',     label: 'Outros',               icon: 'ti-grid-dots',          iconColor: 'text-slate-500',   bgColor: 'bg-slate-100' },
]

export const MOCK_REQUESTS: ServiceRequest[] = [
  {
    id: 'PRF-2023-10-00123',
    type: 'Iluminação Pública',
    icon: 'ti-bulb',
    addr: 'Rua das Flores, 100 — Centro',
    date: '15/10/2023',
    status: 'EM EXECUÇÃO',
    variant: 'blue',
  },
  {
    id: 'PRF-2023-10-00122',
    type: 'Buraco na Via',
    icon: 'ti-alert-triangle',
    addr: 'Av. Brasil, S/N — Bela Vista',
    date: '14/10/2023',
    status: 'ABERTO',
    variant: 'orange',
  },
  {
    id: 'PRF-2023-10-00110',
    type: 'Iluminação Pública',
    icon: 'ti-bulb',
    addr: 'Praça da Sé',
    date: '10/10/2023',
    status: 'CONCLUÍDO',
    variant: 'green',
  },
]

export const STEPS: Step[] = [
  {
    n: '1',
    icon: 'ti-map-pin',
    title: 'Relate o Problema',
    desc: 'Selecione a categoria, descreva a situação e informe a localização. Você pode se identificar ou manter o anonimato.',
  },
  {
    n: '2',
    icon: 'ti-receipt',
    title: 'Receba seu Protocolo',
    desc: 'O sistema gera um número único imediatamente. Sua solicitação entra na fila de triagem com prazo definido (SLA).',
  },
  {
    n: '3',
    icon: 'ti-circle-check',
    title: 'Acompanhe a Solução',
    desc: 'Use o protocolo para rastrear cada atualização. O histórico é imutável e transparente para todos.',
  },
]

export const ACTIVITY_EVENTS: ActivityEvent[] = [
  {
    msg: 'Protocolo PRF-2023-10-00123 teve atualização de status.',
    time: '2h atrás',
    icon: 'ti-refresh',
    iconColor: 'text-blue-500',
  },
  {
    msg: 'Solicitação PRF-2023-10-00110 foi concluída com sucesso.',
    time: '3 dias atrás',
    icon: 'ti-circle-check',
    iconColor: 'text-emerald-600',
  },
  {
    msg: 'Novo protocolo gerado: PRF-2023-10-00122.',
    time: '4 dias atrás',
    icon: 'ti-file-plus',
    iconColor: 'text-amber-500',
  },
]
