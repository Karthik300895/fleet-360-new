import type { ColumnDefinition } from 'tabulator-tables'

export type TableViewId = 'users' | 'orders' | 'inventory'

export type UserRow = {
  id: number
  name: string
  role: string
  department: string
  status: 'Active' | 'Inactive' | 'On Leave'
  salary: number
  joinDate: string
  email: string
  location: string
}

export type OrderRow = {
  orderId: string
  customer: string
  product: string
  amount: number
  fulfillmentStatus: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled'
  orderDate: string
  shippingAddress: string
  paymentMethod: string
}

export type InventoryRow = {
  sku: string
  productName: string
  category: string
  quantity: number
  warehouse: string
  reorderLevel: number
  lastRestocked: string
  supplier: string
  unitCost: number
}

export type TableRow = UserRow | OrderRow | InventoryRow

export type ColumnMeta = {
  field: string
  title: string
  width?: number
  minWidth?: number
  formatter?: 'status' | 'money' | 'money2' | 'action'
  groupable?: boolean
}

export const DEFAULT_PINNED_COLUMNS: Record<TableViewId, string[]> = {
  users: ['id', 'name'],
  orders: ['orderId', 'customer'],
  inventory: ['sku', 'productName'],
}

export type TableConfig = {
  label: string
  idField: string
  columns: ColumnMeta[]
  createEmptyRow: () => TableRow
  pinnedTopRow: () => Partial<TableRow>
  pinnedBottomRow: () => Partial<TableRow>
}

const USER_NAMES = [
  'Alice Chen', 'Bob Martinez', 'Carol Nguyen', 'David Kim', 'Eva Patel',
  'Frank Okafor', 'Grace Liu', 'Henry Brooks', 'Ivy Santos', 'Jack Turner',
  'Karen Walsh', 'Leo Fernandez', 'Mia Johnson', 'Noah Singh', 'Olivia Reed',
  'Paul Hughes', 'Quinn Adams', 'Rita Gomez', 'Sam Wilson', 'Tina Moore',
  'Uma Shah', 'Victor Lee', 'Wendy Clark', 'Xavier Diaz', 'Yara Ahmed',
]

const ROLES = ['Engineer', 'Manager', 'Analyst', 'Designer', 'Technician']
const DEPARTMENTS = ['Operations', 'Engineering', 'Finance', 'HR', 'Logistics']
const USER_STATUSES: UserRow['status'][] = ['Active', 'Inactive', 'On Leave']

const CUSTOMERS = [
  'Acme Corp', 'Globex LLC', 'Initech', 'Umbrella Co', 'Stark Industries',
  'Wayne Enterprises', 'Oscorp', 'Cyberdyne', 'Soylent Foods', 'Hooli',
]

const PRODUCTS = [
  'GPS Tracker', 'Dash Cam', 'Fuel Sensor', 'Fleet Hub', 'Route Planner',
  'Driver Tablet', 'Cargo Monitor', 'EV Charger', 'Tire Sensor', 'Dash Display',
]

const ORDER_STATUSES: OrderRow['fulfillmentStatus'][] = [
  'Pending', 'Shipped', 'Delivered', 'Cancelled',
]

const WAREHOUSES = ['East Hub', 'West Hub', 'Central Depot', 'North Yard']
const CATEGORIES = ['Hardware', 'Software', 'Accessories', 'Consumables']

function formatDate(offsetDays: number): string {
  const date = new Date(2026, 0, 15)
  date.setDate(date.getDate() + offsetDays)
  return date.toISOString().slice(0, 10)
}

export function createUsersData(): UserRow[] {
  return USER_NAMES.map((name, index) => ({
    id: 1000 + index,
    name,
    role: ROLES[index % ROLES.length],
    department: DEPARTMENTS[index % DEPARTMENTS.length],
    status: USER_STATUSES[index % USER_STATUSES.length],
    salary: 55000 + (index % 12) * 4200,
    joinDate: formatDate(-(index * 47 + 30)),
    email: `${name.toLowerCase().replace(' ', '.')}@fleet360.com`,
    location: ['New York', 'Chicago', 'Austin', 'Seattle', 'Boston'][index % 5],
  }))
}

export function createOrdersData(): OrderRow[] {
  return Array.from({ length: 24 }, (_, index) => ({
    orderId: `ORD-${2400 + index}`,
    customer: CUSTOMERS[index % CUSTOMERS.length],
    product: PRODUCTS[index % PRODUCTS.length],
    amount: 120 + (index % 9) * 85 + (index % 3) * 12.5,
    fulfillmentStatus: ORDER_STATUSES[index % ORDER_STATUSES.length],
    orderDate: formatDate(-(index * 5)),
    shippingAddress: `${100 + index} Market Street, Suite ${index + 1}`,
    paymentMethod: ['Credit Card', 'Invoice', 'Wire Transfer'][index % 3],
  }))
}

export function createInventoryData(): InventoryRow[] {
  return Array.from({ length: 22 }, (_, index) => ({
    sku: `SKU-${8800 + index}`,
    productName: PRODUCTS[index % PRODUCTS.length],
    category: CATEGORIES[index % CATEGORIES.length],
    quantity: 15 + (index * 7) % 180,
    warehouse: WAREHOUSES[index % WAREHOUSES.length],
    reorderLevel: 20 + (index % 5) * 10,
    lastRestocked: formatDate(-(index * 11 + 2)),
    supplier: ['TechParts Inc', 'Global Supply', 'Fleet Goods Co'][index % 3],
    unitCost: 45 + (index % 8) * 12.5,
  }))
}

export const INITIAL_TABLE_DATA: Record<TableViewId, TableRow[]> = {
  users: createUsersData(),
  orders: createOrdersData(),
  inventory: createInventoryData(),
}

export const TABLE_VIEW_ORDER: TableViewId[] = ['users', 'orders', 'inventory']

export const TABLE_CONFIGS: Record<TableViewId, TableConfig> = {
  users: {
    label: 'Users Table',
    idField: 'id',
    columns: [
      { field: 'id', title: 'ID', width: 100 },
      { field: 'name', title: 'Name', width: 180 },
      { field: 'role', title: 'Role', minWidth: 160, groupable: true },
      { field: 'department', title: 'Department', minWidth: 180, groupable: true },
      { field: 'status', title: 'Status', minWidth: 160, formatter: 'status', groupable: true },
      { field: 'salary', title: 'Salary', minWidth: 160, formatter: 'money' },
      { field: 'joinDate', title: 'Join Date', minWidth: 160 },
      { field: 'email', title: 'Email', minWidth: 260 },
      { field: 'location', title: 'Location', minWidth: 160, groupable: true },
      { field: 'actions', title: 'Actions', minWidth: 130, formatter: 'action' },
    ],
    createEmptyRow: () => ({
      id: Date.now(),
      name: 'New User',
      role: 'Analyst',
      department: 'Operations',
      status: 'Active',
      salary: 60000,
      joinDate: formatDate(0),
      email: 'new.user@fleet360.com',
      location: 'Austin',
    }),
    pinnedTopRow: () => ({
      id: 0,
      name: 'Summary (Top)',
      role: '—',
      department: 'All Departments',
      status: 'Active',
      salary: 0,
      joinDate: '—',
      email: '—',
      location: '—',
    }),
    pinnedBottomRow: () => ({
      id: 9999,
      name: 'Summary (Bottom)',
      role: '—',
      department: 'Totals Row',
      status: 'Active',
      salary: 0,
      joinDate: '—',
      email: '—',
      location: '—',
    }),
  },
  orders: {
    label: 'Orders Table',
    idField: 'orderId',
    columns: [
      { field: 'orderId', title: 'Order ID', width: 130 },
      { field: 'customer', title: 'Customer', width: 190 },
      { field: 'product', title: 'Product', minWidth: 180, groupable: true },
      {
        field: 'amount',
        title: 'Amount',
        minWidth: 150,
        formatter: 'money2',
      },
      {
        field: 'fulfillmentStatus',
        title: 'Fulfillment Status',
        minWidth: 190,
        formatter: 'status',
        groupable: true,
      },
      { field: 'orderDate', title: 'Order Date', minWidth: 160 },
      { field: 'shippingAddress', title: 'Shipping Address', minWidth: 280 },
      { field: 'paymentMethod', title: 'Payment Method', minWidth: 180, groupable: true },
      { field: 'actions', title: 'Actions', minWidth: 130, formatter: 'action' },
    ],
    createEmptyRow: () => ({
      orderId: `ORD-${Date.now()}`,
      customer: 'New Customer',
      product: 'GPS Tracker',
      amount: 199.99,
      fulfillmentStatus: 'Pending',
      orderDate: formatDate(0),
      shippingAddress: '1 Main Street',
      paymentMethod: 'Invoice',
    }),
    pinnedTopRow: () => ({
      orderId: 'SUMMARY',
      customer: 'Top Summary Row',
      product: '—',
      amount: 0,
      fulfillmentStatus: 'Pending',
      orderDate: '—',
      shippingAddress: '—',
      paymentMethod: '—',
    }),
    pinnedBottomRow: () => ({
      orderId: 'TOTALS',
      customer: 'Bottom Summary Row',
      product: '—',
      amount: 0,
      fulfillmentStatus: 'Delivered',
      orderDate: '—',
      shippingAddress: '—',
      paymentMethod: '—',
    }),
  },
  inventory: {
    label: 'Inventory Table',
    idField: 'sku',
    columns: [
      { field: 'sku', title: 'SKU', width: 130 },
      { field: 'productName', title: 'Product', width: 190 },
      { field: 'category', title: 'Category', minWidth: 160, groupable: true },
      { field: 'quantity', title: 'Quantity', minWidth: 150 },
      { field: 'warehouse', title: 'Warehouse', minWidth: 170, groupable: true },
      { field: 'reorderLevel', title: 'Reorder Level', minWidth: 170 },
      { field: 'lastRestocked', title: 'Last Restocked', minWidth: 170 },
      { field: 'supplier', title: 'Supplier', minWidth: 190, groupable: true },
      { field: 'unitCost', title: 'Unit Cost', minWidth: 150, formatter: 'money2' },
      { field: 'actions', title: 'Actions', minWidth: 130, formatter: 'action' },
    ],
    createEmptyRow: () => ({
      sku: `SKU-${Date.now()}`,
      productName: 'New Item',
      category: 'Hardware',
      quantity: 50,
      warehouse: 'Central Depot',
      reorderLevel: 25,
      lastRestocked: formatDate(0),
      supplier: 'TechParts Inc',
      unitCost: 99.99,
    }),
    pinnedTopRow: () => ({
      sku: 'SUMMARY',
      productName: 'Top Summary Row',
      category: '—',
      quantity: 0,
      warehouse: 'All',
      reorderLevel: 0,
      lastRestocked: '—',
      supplier: '—',
      unitCost: 0,
    }),
    pinnedBottomRow: () => ({
      sku: 'TOTALS',
      productName: 'Bottom Summary Row',
      category: '—',
      quantity: 0,
      warehouse: 'All',
      reorderLevel: 0,
      lastRestocked: '—',
      supplier: '—',
      unitCost: 0,
    }),
  },
}

function isPinnedField(field: string, pinnedFields: string[]): boolean {
  return pinnedFields.includes(field)
}

function statusFormatter(cell: { getValue: () => unknown }) {
  const value = String(cell.getValue() ?? '')
  const normalized = value.toLowerCase().replace(/\s+/g, '-')
  return `<span class="status-pill status-pill--${normalized}">${value || '—'}</span>`
}

function actionFormatter() {
  return '<button type="button" class="grid-action-btn tabulator-action-btn">View</button>'
}

function moneyFormatter(cell: { getValue: () => unknown }) {
  const value = cell.getValue()
  return value != null ? `$${Number(value).toLocaleString()}` : ''
}

function money2Formatter(cell: { getValue: () => unknown }) {
  const value = cell.getValue()
  return value != null ? `$${Number(value).toFixed(2)}` : ''
}

function resolveFormatter(kind: ColumnMeta['formatter']) {
  switch (kind) {
    case 'status':
      return statusFormatter
    case 'money':
      return moneyFormatter
    case 'money2':
      return money2Formatter
    case 'action':
      return actionFormatter
    default:
      return undefined
  }
}

export function buildTabulatorColumns(
  viewId: TableViewId,
  pinnedFields: string[],
  hiddenFields: string[] = [],
): ColumnDefinition[] {
  const metaColumns = [...TABLE_CONFIGS[viewId].columns].sort((a, b) => {
    const aPinned = isPinnedField(a.field, pinnedFields) ? 0 : 1
    const bPinned = isPinnedField(b.field, pinnedFields) ? 0 : 1
    return aPinned - bPinned
  })

  const selectionColumn: ColumnDefinition = {
    title: '',
    formatter: 'rowSelection',
    titleFormatter: 'rowSelection',
    hozAlign: 'center',
    headerSort: false,
    width: 48,
    frozen: true,
    cssClass: 'fixed-column-cell',
  }

  const dataColumns: ColumnDefinition[] = metaColumns.map((column) => {
    const frozen = isPinnedField(column.field, pinnedFields)
    const formatter = resolveFormatter(column.formatter)

    const definition: ColumnDefinition = {
      title: column.title,
      field: column.field,
      width: column.width,
      minWidth: column.minWidth ?? 120,
      frozen,
      visible: !hiddenFields.includes(column.field),
      headerSort: column.formatter !== 'action',
      formatter,
      cssClass: frozen ? 'fixed-column-cell' : undefined,
      headerTooltip: column.title,
    }

    if (column.formatter !== 'action') {
      definition.headerFilter = 'input'
    }

    return definition
  })

  return [selectionColumn, ...dataColumns]
}

export function getColumnVisibilityDefaults(viewId: TableViewId): Record<string, boolean> {
  return TABLE_CONFIGS[viewId].columns.reduce<Record<string, boolean>>((acc, column) => {
    acc[column.field] = true
    return acc
  }, {})
}

export function getColumnLabel(viewId: TableViewId, field: string): string {
  const match = TABLE_CONFIGS[viewId].columns.find((column) => column.field === field)
  return match?.title ?? field
}

export function getGroupableFields(viewId: TableViewId): string[] {
  return TABLE_CONFIGS[viewId].columns
    .filter((column) => column.groupable)
    .map((column) => column.field)
}

export function getRowLabel(row: TableRow): string {
  if ('name' in row && row.name) return row.name
  if ('customer' in row && row.customer) return row.customer
  if ('productName' in row && row.productName) return row.productName
  return 'row'
}
