import { create } from 'zustand';

export type ViewType = 'workspace' | 'notes' | 'table' | 'canvas';

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
}

export interface TableRow {
  id: string;
  [key: string]: string;
}

export interface TableData {
  id: string;
  title: string;
  rows: TableRow[];
  createdAt: number;
}

export type CanvasElementType = 'sticky_note' | 'shape' | 'text' | 'card';
export type ShapeType = 'rectangle' | 'diamond' | 'ellipse';
export type ArrowType = 'straight' | 'curved' | 'elbow';

export interface CanvasCard {
  id: string;
  canvasId: string;
  type: CanvasElementType;
  title?: string;
  description: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  color?: string;
  shapeType?: ShapeType;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold';
  textAlign?: 'left' | 'center' | 'right';
  tag?: string;
  rotation: number;
}

export interface CanvasData {
  id: string;
  title: string;
  createdAt: number;
}

export interface CanvasArrow {
  id: string;
  canvasId: string;
  type: ArrowType;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  color: string;
}

interface WorkspaceState {
  activeView: ViewType;
  activeDocumentId: string | null;

  notes: Note[];
  tables: TableData[];
  canvases: CanvasData[];
  canvasCards: CanvasCard[];
  canvasArrows: CanvasArrow[];

  setActiveView: (view: ViewType, id?: string) => void;

  createNote: () => void;
  createTable: () => void;
  createCanvas: () => void;

  updateNote: (id: string, content: string) => void;
  updateTableRow: (tableId: string, rowId: string, field: string, value: string) => void;
  updateCanvasCardPos: (cardId: string, x: number, y: number) => void;
  addCanvasElement: (canvasId: string, type: CanvasElementType, properties: Partial<CanvasCard>) => void;
  updateCanvasElement: (elementId: string, properties: Partial<CanvasCard>) => void;

  sendToCanvas: (text: string, sourceCanvasId?: string) => void;
  sendToTable: (text: string, targetTableId?: string) => void;
  addCanvasArrow: (canvasId: string, type: ArrowType) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);
const getRandomRotation = () => (Math.random() - 0.5) * 10;

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  activeView: 'workspace',
  activeDocumentId: null,

  notes: [
    { id: 'n1', title: 'The Architecture of Quokka', content: 'Drafting the core pillars...\n\nIdeas:\n- Local first\n- Visually expressive', createdAt: Date.now() },
    { id: 'n2', title: 'Q3 Manifesto Ideas', content: 'Focus on cross-feature integration.', createdAt: Date.now() - 100000 }
  ],
  tables: [],
  canvases: [
    { id: 'c1', title: 'Product Roadmap', createdAt: Date.now() }
  ],
  canvasCards: [
    { id: 'card1', canvasId: 'c1', type: 'card', title: 'Launch MVP', description: 'Finish the workspace core', x: 100, y: 150, tag: 'star', rotation: getRandomRotation() }
  ],
  canvasArrows: [],

  setActiveView: (view, id) => set({ activeView: view, activeDocumentId: id || null }),

  createNote: () => {
    const id = generateId();
    const newNote: Note = { id, title: 'Untitled Note', content: '', createdAt: Date.now() };
    set((state) => ({
      notes: [newNote, ...state.notes],
      activeView: 'notes',
      activeDocumentId: id,
    }));
  },

  createTable: () => {
    const id = generateId();
    const emptyRow = (): TableRow => ({ id: generateId(), A: '', B: '', C: '', D: '', E: '' });
    const newTable: TableData = {
      id,
      title: 'Untitled Table',
      createdAt: Date.now(),
      rows: Array.from({ length: 20 }, emptyRow),
    };
    set((state) => ({
      tables: [newTable, ...state.tables],
      activeView: 'table',
      activeDocumentId: id,
    }));
  },

  createCanvas: () => {
    const id = generateId();
    const newCanvas: CanvasData = { id, title: 'Untitled Canvas', createdAt: Date.now() };
    set((state) => ({
      canvases: [newCanvas, ...state.canvases],
      activeView: 'canvas',
      activeDocumentId: id,
    }));
  },

  updateNote: (id, content) => {
    set((state) => ({
      notes: state.notes.map(n => n.id === id ? { ...n, content } : n)
    }));
  },

  updateTableRow: (tableId, rowId, field, value) => {
    set((state) => ({
      tables: state.tables.map(t => {
        if (t.id !== tableId) return t;
        return {
          ...t,
          rows: t.rows.map(r => r.id === rowId ? { ...r, [field]: value } : r)
        };
      })
    }));
  },

  updateCanvasCardPos: (cardId, x, y) => {
    set((state) => ({
      canvasCards: state.canvasCards.map(c => c.id === cardId ? { ...c, x, y } : c)
    }));
  },

  addCanvasElement: (canvasId, type, properties) => {
    const newElement: CanvasCard = {
      id: generateId(),
      canvasId,
      type,
      description: '',
      x: 100,
      y: 100,
      rotation: type === 'sticky_note' ? getRandomRotation() : 0,
      ...properties,
    };
    set((state) => ({ canvasCards: [...state.canvasCards, newElement] }));
  },

  updateCanvasElement: (elementId, properties) => {
    set((state) => ({
      canvasCards: state.canvasCards.map(c => c.id === elementId ? { ...c, ...properties } : c)
    }));
  },

  sendToCanvas: (text, sourceCanvasId) => {
    const state = get();
    let canvasId = sourceCanvasId;
    if (!canvasId) {
      if (state.canvases.length > 0) {
        canvasId = state.canvases[0].id;
      } else {
        canvasId = generateId();
        set((s) => ({ canvases: [{ id: canvasId!, title: 'Auto Canvas', createdAt: Date.now() }, ...s.canvases] }));
      }
    }

    const newCard: CanvasCard = {
      id: generateId(),
      canvasId,
      type: 'card',
      title: 'From Note',
      description: text,
      x: Math.random() * 200 + 50,
      y: Math.random() * 200 + 50,
      tag: 'map-pin',
      rotation: getRandomRotation(),
    };

    set((s) => ({ canvasCards: [...s.canvasCards, newCard] }));
  },

  sendToTable: (text, targetTableId) => {
    const state = get();
    let tableId = targetTableId;
    if (!tableId) {
      if (state.tables.length > 0) {
        tableId = state.tables[0].id;
      } else {
        tableId = generateId();
        set((s) => ({
          tables: [{ id: tableId!, title: 'Auto Table', createdAt: Date.now(), rows: [] }, ...s.tables]
        }));
      }
    }

    const newRow: TableRow = { id: generateId(), A: text, B: '', C: '', D: '', E: '' };

    set((s) => ({
      tables: s.tables.map(t => {
        if (t.id !== tableId) return t;
        return { ...t, rows: [...t.rows, newRow] };
      })
    }));
  },

  addCanvasArrow: (canvasId, type) => {
    const baseX = Math.random() * 100 + 80;
    const baseY = Math.random() * 100 + 120;
    const newArrow: CanvasArrow = {
      id: generateId(),
      canvasId,
      type,
      fromX: baseX,
      fromY: baseY,
      toX: baseX + 180,
      toY: baseY + (type === 'elbow' ? 0 : type === 'curved' ? 60 : 0),
      color: '#754C34',
    };
    set((s) => ({ canvasArrows: [...s.canvasArrows, newArrow] }));
  },
}));
