# VectorShift Frontend Technical Assessment - Development Plan

## Overview

This document outlines the development plan for completing the VectorShift Frontend Technical Assessment. The assessment consists of 4 parts that will transform a basic node-based pipeline builder into a polished, production-ready application.

### Tech Stack Decisions
- **Styling**: Tailwind CSS (with custom theme matching VectorShift's design language)
- **UI Components**: shadcn/ui (Radix UI primitives + Tailwind, provides accessible, customizable components)
- **State Management**: Zustand (already in use, will extend as needed)
- **HTTP Client**: Axios (for backend integration)
- **Icons**: Lucide React (lightweight, consistent icon library)

### Why shadcn/ui?
✅ **Perfect fit for this project:**
- Built on Tailwind CSS (matches your preference)
- Copy-into-codebase model (full ownership, easy customization)
- Accessible by default (Radix UI primitives)
- Professional defaults with full styling control
- Components we'll use: Button, Input, Textarea, Select, Card, Dialog, Tooltip, Tabs, Label, Switch, Badge

### shadcn/ui Component Mapping

| Use Case | shadcn Component | Customization Level |
|----------|------------------|---------------------|
| Form inputs in nodes | `Input`, `Textarea` | Wrap with Label, add node-specific styling |
| Dropdowns (Type selectors) | `Select` | Wrap with Label, customize options |
| Toggle switches | `Switch` | Wrap with Label |
| Submit button | `Button` | Use default variant, add loading state |
| Result modal | `Dialog` | Customize content, add icons |
| Node cards | `Card` | Heavy customization for node-specific layout |
| Toolbar tabs | `Tabs` | Customize for node categories |
| Handle tooltips | `Tooltip` | Minimal customization |
| Category badges | `Badge` | Color-coded by category |
| Node container | `Card` | Base structure, heavily customized |

**Benefits for this project:**
1. **Faster Development**: No need to build form components from scratch
2. **Consistency**: All inputs/buttons look and behave the same
3. **Accessibility**: Built-in keyboard navigation, focus management, ARIA labels
4. **Customization**: Full control via Tailwind classes (match VectorShift design)
5. **Maintainability**: Clean, readable component code
6. **Professional Polish**: Smooth animations, proper focus states, hover effects

**Trade-offs:**
- Initial setup time (but saves time overall)
- Need to configure path aliases (`@/components/ui/`)
- May need to convert TS to JS if not using TypeScript
- Some components may need heavy customization (like node cards)

---

## Part 1: Node Abstraction

### Current State Analysis
The existing nodes (`inputNode.js`, `outputNode.js`, `llmNode.js`, `textNode.js`) share significant code duplication:
- Similar container structure with inline styles
- Handle positioning logic
- State management patterns
- Label/title rendering

### Abstraction Strategy

#### 1.1 Create Base Node Component (`/frontend/src/components/nodes/BaseNode.jsx`)

```
BaseNode
├── NodeContainer (wrapper with consistent styling)
│   ├── NodeHeader (icon, title, action buttons)
│   ├── NodeBody (configurable content area)
│   └── NodeHandles (dynamic input/output handles)
```

**Props Interface:**
```javascript
{
  id: string,
  title: string,
  icon: ReactNode,
  category: 'input' | 'output' | 'ai' | 'logic' | 'data' | 'integration',
  handles: {
    inputs: [{ id, label, type, position }],
    outputs: [{ id, label, type, position }]
  },
  children: ReactNode, // Node-specific content
  headerActions?: ReactNode[], // Optional action buttons
  minWidth?: number,
  minHeight?: number
}
```

#### 1.2 Create Node Configuration System (`/frontend/src/config/nodeConfig.js`)

Centralized configuration for all node types:
```javascript
{
  nodeType: {
    title: string,
    icon: Component,
    category: string,
    defaultHandles: { inputs: [], outputs: [] },
    defaultData: {},
    fields: [{ name, type, label, options?, placeholder? }]
  }
}
```

#### 1.3 Create Field Components (`/frontend/src/components/fields/`)

**Using shadcn/ui components as base:**
- `TextField.jsx` - Wraps shadcn `Input` + `Label` components
- `TextAreaField.jsx` - Wraps shadcn `Textarea` + `Label` components
- `SelectField.jsx` - Wraps shadcn `Select` + `Label` components
- `ToggleField.jsx` - Wraps shadcn `Switch` + `Label` components
- `NumberField.jsx` - Wraps shadcn `Input` (type="number") + `Label` components

**Benefits:**
- Consistent styling and behavior across all fields
- Built-in accessibility (focus states, keyboard navigation, ARIA labels)
- Easy to customize with Tailwind classes
- Professional look with minimal code

#### 1.4 Refactor Existing Nodes

Convert existing 4 nodes to use the new abstraction:
- [ ] `InputNode` → Uses BaseNode + TextField + SelectField
- [ ] `OutputNode` → Uses BaseNode + TextField + SelectField
- [ ] `LLMNode` → Uses BaseNode with static content
- [ ] `TextNode` → Uses BaseNode + TextAreaField (with dynamic handles)

#### 1.5 Create 5 New Demo Nodes

Demonstrate abstraction flexibility with diverse node types:

| Node | Category | Inputs | Outputs | Fields |
|------|----------|--------|---------|--------|
| **APINode** | Integration | request_body | response | URL (text), Method (select), Headers (textarea) |
| **ConditionalNode** | Logic | condition, true_branch, false_branch | output | Operator (select) |
| **TransformNode** | Data | input | output | Transform Type (select), Expression (text) |
| **MergeNode** | Data | input_1, input_2, input_3 | merged_output | Merge Strategy (select) |
| **FilterNode** | Logic | input | passed, failed | Filter Expression (text), Case Sensitive (toggle) |

---

## Part 2: Styling

### Design System (VectorShift-Inspired)

#### 2.1 Color Palette

```css
/* Primary Colors */
--primary-50: #f5f3ff;
--primary-100: #ede9fe;
--primary-200: #ddd6fe;
--primary-500: #8b5cf6;   /* Main accent */
--primary-600: #7c3aed;
--primary-700: #6d28d9;

/* Neutral Colors */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-400: #9ca3af;
--gray-500: #6b7280;
--gray-600: #4b5563;
--gray-700: #374151;
--gray-800: #1f2937;
--gray-900: #111827;

/* Category Colors */
--category-input: #3b82f6;    /* Blue */
--category-output: #8b5cf6;   /* Purple */
--category-ai: #06b6d4;       /* Cyan */
--category-logic: #f59e0b;    /* Amber */
--category-data: #10b981;     /* Emerald */
--category-integration: #ec4899; /* Pink */

/* Semantic Colors */
--success: #10b981;
--warning: #f59e0b;
--error: #ef4444;
--info: #3b82f6;
```

#### 2.2 Install Tailwind CSS & shadcn/ui

**Step 1: Install Tailwind CSS**
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Step 2: Initialize shadcn/ui**
```bash
npx shadcn-ui@latest init
```
This will:
- Create `components.json` config file
- Set up `components/ui/` directory
- Configure Tailwind with shadcn's design tokens
- Set up CSS variables for theming

**Step 3: Install required shadcn components**
```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add select
npx shadcn-ui@latest add label
npx shadcn-ui@latest add switch
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add tooltip
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add badge
```

**Note:** shadcn requires React 18+ and TypeScript (optional but recommended). If using JS, you may need to convert `.tsx` files to `.jsx` or configure accordingly.

**tailwind.config.js:**
```javascript
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { /* color scale */ },
        // ... category colors
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'node': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'node-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'node-selected': '0 0 0 2px rgba(139, 92, 246, 0.5)',
      }
    }
  },
  plugins: [],
}
```

#### 2.3 Component Styling Tasks

- [ ] **App Layout** (`App.jsx`)
  - Full-height flex layout
  - Sidebar/toolbar + main canvas structure
  
- [ ] **Toolbar** (`toolbar.jsx`)
  - Use shadcn `Tabs` for categorized node palette
  - Use shadcn `Input` for search functionality
  - Use shadcn `Badge` for node category indicators
  - Fixed header with logo and navigation
  - Dark header with light content area
  
- [ ] **DraggableNode** (`draggableNode.jsx`)
  - Use shadcn `Card` component as base
  - Icon + label layout
  - Category color indicator (use `Badge`)
  - Hover/drag states with subtle animation
  
- [ ] **BaseNode Component**
  - Use shadcn `Card` component as base (customized)
  - Rounded corners (8px)
  - Subtle shadow
  - Category-colored left border or header
  - Selected state glow (custom Tailwind classes)
  - Clean typography hierarchy
  - Use shadcn `Button` (variant="ghost", size="icon") for header actions
  
- [ ] **Handles**
  - Larger hit area for easier connections
  - Color-coded by data type
  - Use shadcn `Tooltip` for handle labels on hover
  - Connection animation
  
- [ ] **ReactFlow Canvas** (`ui.jsx`)
  - Subtle dot grid background
  - Custom controls styling (use shadcn `Button` for controls)
  - Custom minimap styling
  
- [ ] **Submit Button** (`submit.jsx`)
  - Use shadcn `Button` component (variant="default")
  - Loading state (use shadcn's built-in or custom spinner)
  - Positioned in header or floating

#### 2.4 Visual Enhancements

- Smooth transitions on all interactive elements
- Consistent spacing using Tailwind's spacing scale
- Responsive considerations (minimum viewport support)
- Custom scrollbar styling
- Focus states for accessibility

---

## Part 3: Text Node Logic

### 3.1 Dynamic Resizing

**Implementation Approach:**
1. Use a hidden `<span>` or `contenteditable` div to measure text dimensions
2. Calculate required width/height based on content
3. Apply minimum constraints (200x80) and maximum constraints (400x300)
4. Smooth transition when resizing

**Technical Implementation:**
```javascript
// useAutoResize hook
const useAutoResize = (text, minWidth, minHeight, maxWidth, maxHeight) => {
  const [dimensions, setDimensions] = useState({ width: minWidth, height: minHeight });
  // ... measurement logic
  return dimensions;
};
```

### 3.2 Variable Detection & Dynamic Handles

**Variable Pattern:** `{{variableName}}`
- Must match valid JavaScript variable name: `[a-zA-Z_$][a-zA-Z0-9_$]*`
- Regex: `/\{\{([a-zA-Z_$][a-zA-Z0-9_$]*)\}\}/g`

**Implementation Steps:**

1. **Parse Variables from Text:**
```javascript
const extractVariables = (text) => {
  const regex = /\{\{([a-zA-Z_$][a-zA-Z0-9_$]*)\}\}/g;
  const variables = new Set();
  let match;
  while ((match = regex.exec(text)) !== null) {
    variables.add(match[1]);
  }
  return Array.from(variables);
};
```

2. **Sync Variables to Node State:**
   - Store extracted variables in node data
   - Update store when text changes (debounced)

3. **Dynamic Handle Generation:**
   - Map variables to left-side input handles
   - Position handles evenly distributed
   - Update positions when variables change

4. **Variable Highlighting in TextArea:**
   - Highlight `{{variable}}` syntax in the text input
   - Consider using a contenteditable div or overlay approach

**State Structure for TextNode:**
```javascript
{
  text: string,
  variables: string[],  // Extracted from text
}
```

---

## Part 4: Backend Integration

### 4.1 Frontend Changes

**Install Axios:**
```bash
npm install axios
```

**Update `submit.jsx`:**
```javascript
import axios from 'axios';
import { useStore } from './store';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';

export const SubmitButton = () => {
  const { nodes, edges } = useStore();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [open, setOpen] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/pipelines/parse', {
        nodes: nodes.map(n => ({ id: n.id, type: n.type, data: n.data })),
        edges: edges.map(e => ({ source: e.source, target: e.target }))
      });
      
      setResult(response.data);
      setOpen(true);
    } catch (error) {
      setResult({ error: 'Failed to analyze pipeline. Please try again.' });
      setOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Analyzing...' : 'Submit Pipeline'}
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pipeline Analysis Results</DialogTitle>
          </DialogHeader>
          {result && !result.error && (
            <div className="space-y-2">
              <p><strong>Nodes:</strong> {result.num_nodes}</p>
              <p><strong>Edges:</strong> {result.num_edges}</p>
              <p><strong>Is Valid DAG:</strong> {result.is_dag ? '✓ Yes' : '✗ No'}</p>
            </div>
          )}
          {result?.error && <p className="text-red-500">{result.error}</p>}
        </DialogContent>
      </Dialog>
    </>
  );
};
```

### 4.2 Backend Changes

**Update `main.py`:**
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Node(BaseModel):
    id: str
    type: str
    data: dict

class Edge(BaseModel):
    source: str
    target: str

class PipelineRequest(BaseModel):
    nodes: List[Node]
    edges: List[Edge]

class PipelineResponse(BaseModel):
    num_nodes: int
    num_edges: int
    is_dag: bool

def is_dag(nodes: List[Node], edges: List[Edge]) -> bool:
    """Check if the graph is a Directed Acyclic Graph using Kahn's algorithm."""
    from collections import defaultdict, deque
    
    # Build adjacency list and in-degree count
    adj = defaultdict(list)
    in_degree = defaultdict(int)
    node_ids = {n.id for n in nodes}
    
    for node_id in node_ids:
        in_degree[node_id] = 0
    
    for edge in edges:
        adj[edge.source].append(edge.target)
        in_degree[edge.target] += 1
    
    # Find all nodes with no incoming edges
    queue = deque([n for n in node_ids if in_degree[n] == 0])
    visited = 0
    
    while queue:
        node = queue.popleft()
        visited += 1
        for neighbor in adj[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    
    return visited == len(node_ids)

@app.post('/pipelines/parse', response_model=PipelineResponse)
async def parse_pipeline(pipeline: PipelineRequest):
    return PipelineResponse(
        num_nodes=len(pipeline.nodes),
        num_edges=len(pipeline.edges),
        is_dag=is_dag(pipeline.nodes, pipeline.edges)
    )
```

### 4.3 Enhanced Alert UI

**Using shadcn Dialog component:**
- Replace browser `alert()` with shadcn `Dialog` (already implemented above)
- Shows success/error states with appropriate styling
- Can be extended to include pipeline visualization summary
- Fully accessible with keyboard navigation and focus management

---

## Implementation Order & Timeline

### Phase 1: Setup & Infrastructure (Day 1) ✅ COMPLETED
1. [x] Install Tailwind CSS and configure
2. [x] Initialize shadcn/ui (manual setup with components)
3. [x] Install required shadcn components (button, input, textarea, select, label, switch, card, dialog, tooltip, tabs, badge)
4. [x] Install additional dependencies (axios, lucide-react, radix-ui primitives, tailwindcss-animate)
5. [x] Configure Tailwind with VectorShift design tokens
6. [x] Set up CSS variables for theming (light/dark mode support)
7. [x] Create folder structure for components

**Installed Dependencies:**
- Tailwind CSS v3.4.19, PostCSS, Autoprefixer
- shadcn/ui components (manually created): Button, Input, Label, Textarea, Card, Select, Switch, Dialog, Tooltip, Tabs, Badge
- Radix UI primitives: dialog, label, select, slot, switch, tabs, tooltip
- Utilities: class-variance-authority, clsx, tailwind-merge, tailwindcss-animate
- HTTP: axios
- Icons: lucide-react

**Created Files:**
- `tailwind.config.js` - Full configuration with design tokens
- `postcss.config.js` - PostCSS configuration
- `jsconfig.json` - Path aliases (`@/*`)
- `src/lib/utils.js` - `cn()` utility function
- `src/index.css` - Tailwind directives + CSS variables
- `src/components/ui/*.jsx` - 11 shadcn components

### Phase 2: Node Abstraction (Day 1-2) ✅ COMPLETED
1. [x] Create `BaseNode` component
2. [x] Create field components (TextField, SelectField, etc.)
3. [x] Create node configuration system
4. [x] Refactor existing 4 nodes (InputNode, OutputNode, LLMNode, TextNode)
5. [x] Create 5 new demo nodes (APINode, ConditionalNode, TransformNode, MergeNode, FilterNode)
6. [x] Update `ui.jsx` with new node types

**Created Components:**
- `BaseNode.jsx` - Flexible node container with category colors, dynamic handles
- Field Components: TextField, TextAreaField, SelectField, ToggleField, NumberField
- Node Config: `config/nodeConfig.js` with metadata for all 9 node types
- Refactored: InputNode, OutputNode, LLMNode, TextNode (with dynamic variable handles)
- New Nodes: APINode, ConditionalNode, TransformNode, MergeNode, FilterNode
- Updated: ui.js, toolbar.js, draggableNode.js, App.js, submit.js

### Phase 3: Styling (Day 2-3) ✅ COMPLETED
1. [x] Style App layout and structure (header with logo, gradient button)
2. [x] Style Toolbar with categorized tabs (All, Start, AI, Data, Logic, Integration, End)
3. [x] Style DraggableNode components (category colors, icons, tooltips)
4. [x] Style BaseNode and all nodes (gradients, shadows, rounded corners)
5. [x] Style ReactFlow canvas, controls, minimap (custom colors, empty state)
6. [x] Style Submit button and add to header (gradient, loading state)
7. [x] Add transitions and animations (hover effects, scale transforms)
8. [x] Polish and responsive adjustments (custom scrollbars, focus states)

**Styling Highlights:**
- VectorShift-inspired purple/violet primary color scheme
- Category-coded node colors (blue=input, violet=output, cyan=AI, emerald=data, amber=logic, pink=integration)
- Gradient headers and buttons
- Custom ReactFlow styling (handles, edges, controls, minimap)
- Empty state with helpful onboarding message
- Enhanced Dialog for pipeline results with visual stats
- Smooth transitions and hover effects throughout

### Phase 4: Text Node Logic (Day 3) ✅ COMPLETED
1. [x] Implement auto-resize functionality
2. [x] Implement variable extraction
3. [x] Implement dynamic handle generation
4. [x] Add variable syntax highlighting
5. [x] Test edge cases

**Text Node Features:**
- Auto-resize: Width/height adjusts based on text content (min 280x160, max 450x400)
- Variable extraction: Regex `/\{\{([a-zA-Z_$][a-zA-Z0-9_$]*)\}\}/g` for valid JS variable names
- Dynamic handles: Each unique variable creates a left-side input handle
- Syntax highlighting: Variables highlighted with green background in textarea
- Variable badges: Visual display of detected variables with count
- Help text: Guidance shown when no variables are present

### Phase 5: Backend Integration (Day 3-4) ✅ COMPLETED
1. [x] Update backend with CORS and proper endpoint
2. [x] Implement DAG detection algorithm (Kahn's algorithm)
3. [x] Update frontend submit functionality
4. [x] Create user-friendly result display
5. [x] Handle error states

**Backend Features:**
- FastAPI with CORS middleware for localhost:3000
- Pydantic models for type-safe request/response
- POST `/pipelines/parse` endpoint accepting nodes and edges
- DAG detection using Kahn's algorithm (topological sort)
- Returns: `{num_nodes: int, num_edges: int, is_dag: bool}`

**Frontend Features:**
- Submit button with loading state and gradient styling
- Beautiful dialog with visual stats cards
- Color-coded results (green for valid DAG, red for invalid)
- Error handling with user-friendly messages

### Phase 6: Testing & Polish (Day 4) ✅ COMPLETED
1. [x] End-to-end testing of all features
2. [ ] Fix any bugs
3. [ ] Performance optimization
4. [ ] Final UI polish
5. [ ] Code cleanup and documentation

---

## File Structure (After Implementation)

```
frontend/src/
├── components/
│   ├── ui/                    # shadcn/ui components (auto-generated)
│   │   ├── button.jsx
│   │   ├── input.jsx
│   │   ├── textarea.jsx
│   │   ├── select.jsx
│   │   ├── label.jsx
│   │   ├── switch.jsx
│   │   ├── card.jsx
│   │   ├── dialog.jsx
│   │   ├── tooltip.jsx
│   │   ├── tabs.jsx
│   │   └── badge.jsx
│   ├── nodes/
│   │   ├── BaseNode.jsx
│   │   ├── InputNode.jsx
│   │   ├── OutputNode.jsx
│   │   ├── LLMNode.jsx
│   │   ├── TextNode.jsx
│   │   ├── APINode.jsx
│   │   ├── ConditionalNode.jsx
│   │   ├── TransformNode.jsx
│   │   ├── MergeNode.jsx
│   │   └── FilterNode.jsx
│   ├── fields/
│   │   ├── TextField.jsx      # Wraps shadcn Input + Label
│   │   ├── TextAreaField.jsx  # Wraps shadcn Textarea + Label
│   │   ├── SelectField.jsx    # Wraps shadcn Select + Label
│   │   ├── ToggleField.jsx    # Wraps shadcn Switch + Label
│   │   └── NumberField.jsx    # Wraps shadcn Input + Label
│   ├── ui/
│   │   ├── Toolbar.jsx        # Uses shadcn Tabs, Input, Badge
│   │   ├── DraggableNode.jsx # Uses shadcn Card
│   │   ├── Canvas.jsx
│   │   ├── SubmitButton.jsx  # Uses shadcn Button, Dialog
│   │   └── ResultModal.jsx   # Uses shadcn Dialog
│   └── common/
│       ├── Handle.jsx         # Uses shadcn Tooltip
│       └── Tooltip.jsx        # Re-export or wrapper for shadcn Tooltip
├── config/
│   └── nodeConfig.js
├── hooks/
│   ├── useAutoResize.js
│   └── useVariableExtraction.js
├── utils/
│   └── api.js
├── store.js
├── App.jsx
├── index.js
├── index.css
└── lib/
    └── utils.js              # shadcn utility functions (cn helper)
```

---

## Testing Checklist

### Part 1: Node Abstraction
- [ ] All 4 original nodes work correctly with new abstraction
- [ ] All 5 new nodes render and function properly
- [ ] Handles connect correctly between nodes
- [ ] Node data persists in state

### Part 2: Styling
- [ ] Consistent visual design across all components
- [ ] Responsive at various viewport sizes
- [ ] Smooth animations and transitions
- [ ] Accessible focus states
- [ ] No visual regressions from original functionality

### Part 3: Text Node Logic
- [ ] Text node resizes as content grows
- [ ] Variables `{{varName}}` create left-side handles
- [ ] Multiple variables create multiple handles
- [ ] Removing variables removes corresponding handles
- [ ] Invalid variable names don't create handles
- [ ] Handles can be connected to other nodes

### Part 4: Backend Integration
- [ ] Submit button sends correct data to backend
- [ ] Backend correctly counts nodes and edges
- [ ] DAG detection works for various graph shapes
- [ ] Alert displays correct information
- [ ] Error handling works for failed requests

---

## Notes & Considerations

1. **Zustand Store Extensions**: May need to add selectors for accessing nodes/edges from submit button
2. **Handle IDs**: Ensure unique handle IDs for dynamic variables
3. **Performance**: Consider debouncing text input for variable extraction
4. **Edge Cases**: Handle empty pipelines, disconnected nodes, self-loops
5. **Type Safety**: Consider adding PropTypes or migrating to TypeScript
6. **shadcn/ui Setup**: 
   - Components are copied into your codebase (you own them)
   - Can customize any component by editing files in `components/ui/`
   - Ensure path aliases are configured (`@/components/ui/` → `src/components/ui/`)
   - If using JS instead of TS, may need to convert `.tsx` files to `.jsx` or configure accordingly
7. **shadcn/ui Customization**:
   - All components use Tailwind classes, easy to customize
   - Design tokens in `tailwind.config.js` control colors, spacing, etc.
   - CSS variables in `globals.css` control theme colors
   - Can override any component's styling by modifying the component file directly

