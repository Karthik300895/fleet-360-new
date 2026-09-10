# AG Grid React Proof of Concept (POC) Prompt

Please build a React Proof of Concept (POC) using `ag-grid-react` and `ag-grid-community` that demonstrates dynamic table manipulation, column/row pinning, multi-table switching, and item visibility toggles.

---

## 1. Tech Stack & Dependencies

- **Framework:** React (TypeScript / Vite or Next.js App Router)
- **Package:** `ag-grid-react` and `ag-grid-community` (MIT Free version)
- **Styling:** AG Grid Quartz Theme (`ag-theme-quartz`) + Tailwind CSS (or standard CSS for controls)

---

## 2. Core Requirements & Technical Specs

### Feature 1: Sticky Rows & Columns (Pinning)

- **Column Pinning:** Lock specific left columns (e.g., `ID`, `Name`) using `{ pinned: 'left' }` while the remaining data columns remain horizontally scrollable.
- **Row Pinning:** Implement sticky top/bottom rows (e.g., summary/pinned rows) using AG Grid’s `pinnedTopRowData` and `pinnedBottomRowData` props.
- **Interactive Control:** Add UI toggle buttons above the grid allowing users to dynamically pin/unpin specific columns or rows.

### Feature 2: Multi-Table View Switching

- Provide a tabbed interface or dropdown (e.g., **"Users Table"**, **"Orders Table"**, **"Inventory Table"**).
- Switching views must dynamically update both `columnDefs` and `rowData` cleanly without crashing the grid instance.

### Feature 3: Dynamic Item Visibility & Addition/Removal

- **Checkbox Selection:** Use AG Grid's built-in checkbox selection (`checkboxSelection: true`, `headerCheckboxSelection: true`).
- **Row Actions:** Include a button to **"Delete Selected Rows"** using AG Grid's transaction updates (`api.applyTransaction({ remove: [...] })`).
- **Row Insertion:** Add a form/button to **"Add New Record"** dynamically using `api.applyTransaction({ add: [...] })`.
- **Column Visibility Toggle:** Include a dropdown panel of checkboxes allowing users to show/hide individual columns dynamically (using `columnApi.setColumnVisible`).

### Feature 4: Customization & Cell Rendering

- Implement custom **Cell Renderers** (e.g., status badges, action buttons inside cells).
- Enable grid customization options:
  - Sorting (`sortable: true`)
  - Filtering (`filter: true`)
  - Resizable columns (`resizable: true`)
  - Quick text search across all columns.

---

## 3. Mock Data Structure

Generate rich, realistic dummy data for at least 2 table views:

1. **Users Dataset:** 20+ rows containing `ID`, `Name`, `Role`, `Department`, `Status`, `Salary`, `Join Date`.
2. **Orders Dataset:** 20+ rows containing `Order ID`, `Customer`, `Product`, `Amount`, `Fulfillment Status`, `Order Date`.

---

## 4. Expected Component Architecture

- `App.tsx`: Main layout, table selector tabs, global action bar (Add Row, Delete Selected, Pin Toggles, Column Visibility Menu).
- `mockData.ts`: Centralized dummy datasets and column definition mappings for each table view.
- `AgGridTable.tsx`: Reusable AG Grid wrapper handling grid initialization, API references, and event handlers.

Please generate the complete, production-ready code with proper TypeScript types and concise comments explaining AG Grid hook/API usage.
