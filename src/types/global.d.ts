/* eslint-disable @typescript-eslint/no-explicit-any */
import type { EmployeeTable, FilterEmployee, EmployeeTable, Employee } from './Employee';
import type { FilterSupplier } from './Supplier';
import type { CategorySupplier, CategoryProduct } from './Category';
import type { RenderAuth } from './Auth';
import type {
  DataDepartment,
  Department,
  DepartmentNode,
  TransformedDepartment,
  DepartmentRoot,
} from './Department';
import type { QuasarSelect, QuasarTable } from './Quasar';
import type { RoleSelect } from './Role';
import type { FilterUser, User } from './User';
import type { FilterClient, Client } from './Client';
import type { Color } from './Color';
import type { Grid, GridGroup, GridItem, GridItemCreate } from './Grid';
import type { CreateGrid, UpdateGrid } from './Payload';
import type { ActionStock } from 'src/utils/actions';
import type { Tag } from './Tag';
import type { ProductModalTabs } from './Product';
import type { VModelProductBasic, ProductVariant } from './Product';

export {};

declare global {
  type IRenderAuth = RenderAuth;

  type IDataDepartment = DataDepartment;
  type IDepartment = Department;
  type IDepartmentNode = DepartmentNode;
  type ITransformedDepartment = TransformedDepartment;
  type IDepartmentRoot = DepartmentRoot;
  type IDepartmentSelect = DepartmentSelect;

  type IQuasarSelect<T = any> = QuasarSelect<T>;
  type IQuasarTable = QuasarTable;

  type IUser = User;
  type IUserSystem = UserSystem;
  type IFilterUser = FilterUser;

  type ICategorySupplier = CategorySupplier;
  type ICategoryProduct = CategoryProduct;

  type ISupplier = Supplier;
  type IFilterSupplier = FilterSupplier;

  type IClient = Client;
  type IFilterClient = FilterClient;

  type IEmployee = Employee;
  type IEmployeeTable = EmployeeTable;
  type IFilterEmployee = FilterEmployee;

  type IRoleSelect = RoleSelect;

  type IColor = Color;

  type IGrid = Grid;
  type IGridGroup = GridGroup;
  type IGridItem = GridItem;
  type ICreateGrid = CreateGrid;
  type IUpdateGrid = UpdateGrid;
  type IGridItemCreate = GridItemCreate;
  type IGridItemUpdate = GridItemUpdate;

  type IActionStock = ActionStock;

  type ITag = Tag;

  type IProductModalTabs = ProductModalTabs;

  type IVModelProductBasic = VModelProductBasic;
  type IVModelProductVariant = VModelProductVariant;
  type IProductVariant = ProductVariant;
}
