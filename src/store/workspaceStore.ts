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

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate: 'today' | 'upcoming';
}


export type CanvasElementType = 'sticky_note' | 'shape' | 'text' | 'card';
export type ShapeType = 'rectangle' | 'diamond' | 'ellipse';
export type ArrowType = 'straight' | 'curved' | 'elbow';
export type Handle = 'top' | 'right' | 'bottom' | 'left';

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
  zIndex?: number;
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
  fromElementId?: string;
  toElementId?: string;
  sourceHandle?: Handle;
  targetHandle?: Handle;
  color: string;
}

export interface CanvasPan {
  offsetX: number;
  offsetY: number;
}

export type ConnectionMode =
  | { active: false }
  | { active: true; fromElementId: string; sourceHandle: Handle; arrowType: ArrowType };

export type CanvasTool = 'pan' | 'select';

export interface CanvasHistoryState {
  cards: CanvasCard[];
  arrows: CanvasArrow[];
}

export interface CanvasHistory {
  past: CanvasHistoryState[];
  future: CanvasHistoryState[];
}

interface WorkspaceState {
  activeView: ViewType;
  activeDocumentId: string | null;

  notes: Note[];
  tables: TableData[];
  canvases: CanvasData[];
  canvasCards: CanvasCard[];
  canvasArrows: CanvasArrow[];
  canvasPan: Record<string, CanvasPan>;
  connectionMode: ConnectionMode;
  selectedElementIds: string[];
  canvasHistory: Record<string, CanvasHistory>;
  canvasTool: CanvasTool;

  tasks: Task[];

  setActiveView: (view: ViewType, id?: string) => void;
  setCanvasTool: (tool: CanvasTool) => void;

  createNote: () => void;
  createTable: () => void;
  createCanvas: () => void;

  updateNoteTitle: (id: string, title: string) => void;
  updateTableTitle: (id: string, title: string) => void;
  updateCanvasTitle: (id: string, title: string) => void;

  updateNote: (id: string, content: string) => void;
  updateTableRow: (tableId: string, rowId: string, field: string, value: string) => void;
  updateCanvasCardPos: (cardId: string, x: number, y: number) => void;
  addCanvasElement: (canvasId: string, type: CanvasElementType, properties: Partial<CanvasCard>) => void;
  updateCanvasElement: (elementId: string, properties: Partial<CanvasCard>) => void;

  sendToCanvas: (text: string, sourceCanvasId?: string) => void;
  sendToTable: (text: string, targetTableId?: string) => void;
  addCanvasArrow: (canvasId: string, type: ArrowType) => void;
  addCanvasArrowBetweenElements: (canvasId: string, type: ArrowType, fromElementId: string, toElementId: string, sourceHandle: Handle, targetHandle: Handle) => void;

  startConnection: (fromElementId: string, sourceHandle: Handle, arrowType: ArrowType) => void;
  completeConnection: (canvasId: string, toElementId: string, targetHandle: Handle) => void;
  cancelConnection: () => void;

  updateCanvasPan: (canvasId: string, offsetX: number, offsetY: number) => void;
  getResolvedArrow: (arrow: CanvasArrow) => { fromX: number; fromY: number; toX: number; toY: number };

  setSelectedElements: (ids: string[]) => void;
  clearSelection: () => void;

  saveHistory: (canvasId: string) => void;
  undo: (canvasId: string) => void;
  redo: (canvasId: string) => void;

  addTask: (title: string, dueDate?: 'today' | 'upcoming') => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  updateTask: (id: string, title: string) => void;
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
  canvasPan: {},
  connectionMode: { active: false },
  selectedElementIds: [],
  canvasHistory: {},
  canvasTool: 'pan',

  tasks: [
    { id: 't1', title: 'Draft Q3 Manifesto', completed: false, dueDate: 'today' },
    { id: 't2', title: 'Refine Quokka Tabs', completed: false, dueDate: 'today' },
    { id: 't3', title: 'Plan Sprint 12', completed: false, dueDate: 'upcoming' },
    { id: 't4', title: 'Update Design System', completed: true, dueDate: 'today' },
  ],

  setActiveView: (view, id) => set({ activeView: view, activeDocumentId: id || null }),
  setCanvasTool: (tool) => set({ canvasTool: tool }),

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

  updateNoteTitle: (id, title) => {
    set((state) => ({
      notes: state.notes.map(n => n.id === id ? { ...n, title } : n)
    }));
  },

  updateTableTitle: (id, title) => {
    set((state) => ({
      tables: state.tables.map(t => t.id === id ? { ...t, title } : t)
    }));
  },

  updateCanvasTitle: (id, title) => {
    set((state) => ({
      canvases: state.canvases.map(c => c.id === id ? { ...c, title } : c)
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
    set((state) => {
      // If the card being moved is part of a multi-selection, move all selected
      if (state.selectedElementIds.includes(cardId) && state.selectedElementIds.length > 1) {
        const card = state.canvasCards.find(c => c.id === cardId);
        if (!card) return state;
        const dx = x - card.x;
        const dy = y - card.y;
        return {
          canvasCards: state.canvasCards.map(c =>
            state.selectedElementIds.includes(c.id)
              ? { ...c, x: c.x + dx, y: c.y + dy }
              : c
          )
        };
      }
      // Single move
      return {
        canvasCards: state.canvasCards.map(c => c.id === cardId ? { ...c, x, y } : c)
      };
    });
  },

  addCanvasElement: (canvasId, type, properties) => {
    get().saveHistory(canvasId);
    const currentCards = get().canvasCards.filter(c => c.canvasId === canvasId);
    const offset = (currentCards.length % 10) * 20;

    const newElement: CanvasCard = {
      id: generateId(),
      canvasId,
      type,
      description: '',
      x: 100 + offset,
      y: 100 + offset,
      rotation: type === 'sticky_note' ? getRandomRotation() : 0,
      zIndex: Date.now(),
      ...properties,
    };
    set((state) => ({ canvasCards: [...state.canvasCards, newElement] }));
  },

  updateCanvasElement: (elementId, properties) => {
    const state = get();
    const element = state.canvasCards.find(c => c.id === elementId);
    if (element) {
      state.saveHistory(element.canvasId);
    }
    set((s) => ({
      canvasCards: s.canvasCards.map(c => c.id === elementId ? { ...c, ...properties } : c)
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
    get().saveHistory(canvasId);
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

  addCanvasArrowBetweenElements: (canvasId, type, fromElementId, toElementId, sourceHandle, targetHandle) => {
    const state = get();
    const fromEl = state.canvasCards.find(c => c.id === fromElementId);
    const toEl = state.canvasCards.find(c => c.id === toElementId);
    if (!fromEl || !toEl) return;

    state.saveHistory(canvasId);

    const newArrow: CanvasArrow = {
      id: generateId(),
      canvasId,
      type,
      fromX: 0, // will be resolved
      fromY: 0,
      toX: 0,
      toY: 0,
      fromElementId,
      toElementId,
      sourceHandle,
      targetHandle,
      color: '#754C34',
    };
    set((s) => ({ canvasArrows: [...s.canvasArrows, newArrow] }));
  },

  startConnection: (fromElementId, sourceHandle, arrowType) => {
    set({ connectionMode: { active: true, fromElementId, sourceHandle, arrowType } });
  },

  completeConnection: (canvasId, toElementId, targetHandle) => {
    const state = get();
    if (!state.connectionMode.active) return;
    const { fromElementId, sourceHandle, arrowType } = state.connectionMode;
    if (fromElementId === toElementId) {
      set({ connectionMode: { active: false } });
      return;
    }
    state.addCanvasArrowBetweenElements(canvasId, arrowType, fromElementId, toElementId, sourceHandle, targetHandle);
    set({ connectionMode: { active: false } });
  },

  cancelConnection: () => {
    set({ connectionMode: { active: false } });
  },

  updateCanvasPan: (canvasId, offsetX, offsetY) => {
    set((s) => ({
      canvasPan: { ...s.canvasPan, [canvasId]: { offsetX, offsetY } },
    }));
  },

  getResolvedArrow: (arrow) => {
    const state = get();
    let { fromX, fromY, toX, toY } = arrow;

    const resolveHandle = (el: CanvasCard, handle?: Handle) => {
      const w = el.width || 120;
      const h = el.height || 80;
      let cx = el.x + w / 2;
      let cy = el.y + h / 2;

      if (handle === 'top') { cy -= h / 2; }
      else if (handle === 'bottom') { cy += h / 2; }
      else if (handle === 'left') { cx -= w / 2; }
      else if (handle === 'right') { cx += w / 2; }

      return { x: cx, y: cy };
    };

    if (arrow.fromElementId) {
      const el = state.canvasCards.find(c => c.id === arrow.fromElementId);
      if (el) {
        const p = resolveHandle(el, arrow.sourceHandle);
        fromX = p.x; fromY = p.y;
      }
    }
    if (arrow.toElementId) {
      const el = state.canvasCards.find(c => c.id === arrow.toElementId);
      if (el) {
        const p = resolveHandle(el, arrow.targetHandle);
        toX = p.x; toY = p.y;
      }
    }
    return { fromX, fromY, toX, toY };
  },

  setSelectedElements: (ids) => set({ selectedElementIds: ids }),
  clearSelection: () => set({ selectedElementIds: [] }),

  saveHistory: (canvasId) => {
    set((state) => {
      const currentCards = state.canvasCards.filter(c => c.canvasId === canvasId);
      const currentArrows = state.canvasArrows.filter(a => a.canvasId === canvasId);

      const history = state.canvasHistory[canvasId] || { past: [], future: [] };
      const newPast = [...history.past, { cards: currentCards, arrows: currentArrows }];

      // Limit history to 50
      if (newPast.length > 50) newPast.shift();

      return {
        canvasHistory: {
          ...state.canvasHistory,
          [canvasId]: { past: newPast, future: [] }
        }
      };
    });
  },

  undo: (canvasId) => {
    set((state) => {
      const history = state.canvasHistory[canvasId];
      if (!history || history.past.length === 0) return state;

      const previous = history.past[history.past.length - 1];
      const newPast = history.past.slice(0, -1);

      const currentCards = state.canvasCards.filter(c => c.canvasId === canvasId);
      const currentArrows = state.canvasArrows.filter(a => a.canvasId === canvasId);

      const newFuture = [{ cards: currentCards, arrows: currentArrows }, ...history.future];

      const otherCards = state.canvasCards.filter(c => c.canvasId !== canvasId);
      const otherArrows = state.canvasArrows.filter(a => a.canvasId !== canvasId);

      return {
        canvasCards: [...otherCards, ...previous.cards],
        canvasArrows: [...otherArrows, ...previous.arrows],
        canvasHistory: {
          ...state.canvasHistory,
          [canvasId]: { past: newPast, future: newFuture }
        },
        selectedElementIds: [] // Clear selection on undo
      };
    });
  },

  redo: (canvasId) => {
    set((state) => {
      const history = state.canvasHistory[canvasId];
      if (!history || history.future.length === 0) return state;

      const next = history.future[0];
      const newFuture = history.future.slice(1);

      const currentCards = state.canvasCards.filter(c => c.canvasId === canvasId);
      const currentArrows = state.canvasArrows.filter(a => a.canvasId === canvasId);

      const newPast = [...history.past, { cards: currentCards, arrows: currentArrows }];

      const otherCards = state.canvasCards.filter(c => c.canvasId !== canvasId);
      const otherArrows = state.canvasArrows.filter(a => a.canvasId !== canvasId);

      return {
        canvasCards: [...otherCards, ...next.cards],
        canvasArrows: [...otherArrows, ...next.arrows],
        canvasHistory: {
          ...state.canvasHistory,
          [canvasId]: { past: newPast, future: newFuture }
        },
        selectedElementIds: [] // Clear selection on redo
      };
    });
  },

  addTask: (title, dueDate = 'today') => {
    const newTask: Task = {
      id: generateId(),
      title,
      completed: false,
      dueDate,
    };
    set((state) => ({ tasks: [newTask, ...state.tasks] }));
  },

  toggleTask: (id) => {
    set((state) => ({
      tasks: state.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    }));
  },

  deleteTask: (id) => {
    set((state) => ({
      tasks: state.tasks.filter(t => t.id !== id)
    }));
  },

  updateTask: (id, title) => {
    set((state) => ({
      tasks: state.tasks.map(t => t.id === id ? { ...t, title } : t)
    }));
  },
}));
