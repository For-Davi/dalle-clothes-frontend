/* eslint-disable @typescript-eslint/no-explicit-any */
import type { EmployeeTable, FilterEmployee, EmployeeTable, Employee } from './Employee';
import type { FilterSupplier, DataSupplierCatalog, CatalogSupplier } from './Supplier';
import type {
  CategorySupplier,
  CategoryProduct,
  CategoryTransaction,
  CategoryTransaction,
} from './Category';
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
import type { ActionStock, ActionsMovement } from './Actions';
import type { Tag } from './Tag';
import type {
  VModelProductBasic,
  ProductVariant,
  VModelProductAdvanced,
  Variant,
  ProductModalTabs,
  DataCreateProduct,
  DataUpdateVariant,
  Product,
  FilterProduct,
  ShowProduct,
  ProductBasic,
  DataProductBasic,
  DataProductAdvanced,
  ProductAdvanced,
  ReturnProductAdvanced,
  LinkedProducts,
  SearchProductVariant,
  DataMovementProductRegister,
} from './Product';
import type { CustomFile } from './File';
import type { Log } from './Log';
import type { SettingAppearance, SettingModalTabs, Appearance, SettingSystem, System } from './Setting';
import type { Image, MediaItem } from './Image';
import type { ProfilePassword, ProfileData } from './Profile';
import type { TypesReceipt } from './Types';
import type { DataMovement, ExportMovement, FilterMovement, Movement } from './Movement';
import type { Receipt, DataReceipt } from './Receipts';
import type {
  DataSchedule,
  FilterSchedule,
  Schedule,
  DataScheduleFinish,
  ExportSchedule,
} from './Schedules';
import type { Notification } from './Notification'

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
  type ICategoryTransaction = CategoryTransaction;

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
  type IActionMovement = ActionsMovement;

  type ITag = Tag;

  type ILog = Log;

  type IProductModalTabs = ProductModalTabs;
  type IDataCreateProduct = DataCreateProduct;
  type IDataUpdateVariant = DataUpdateVariant;

  type IVModelProductBasic = VModelProductBasic;
  type IVModelProductAdvanced = VModelProductAdvanced;
  type IVModelProductVariant = VModelProductVariant;
  type IVModelProductMedia = VModelProductMedia;
  type IProductVariant = ProductVariant;
  type IProduct = Product;
  type IShowProdut = ShowProduct;
  type IVariant = Variant;
  type IFilterProduct = FilterProduct;
  type IProductBasic = ProductBasic;
  type IProductAdvanced = ProductAdvanced;
  type IReturnProductAdvanced = ReturnProductAdvanced;
  type IDataProductBasic = DataProductBasic;
  type IDataProductAdvanced = DataProductAdvanced;
  type ILinkedProducts = LinkedProducts;
  type ISearchProductVariant = SearchProductVariant;
  type IDataMovementProductRegister = DataMovementProductRegister;

  type ICustomFile = CustomFile;

  type IImage = Image;
  type IMediaItem = MediaItem;

  type ISettingModalTabs = SettingModalTabs;
  type ISettingAppearance = SettingAppearance;
  type IAppearance = Appearance;
  type ISettingSystem = SettingSystem;
  type ISystem = System;

  type IProfileData = ProfileData;
  type IProfilePassword = ProfilePassword;

  type ITypesReceipt = TypesReceipt;
  type IReceipt = Receipt;
  type IDataReceipt = DataReceipt;

  type IFilterMovement = FilterMovement;
  type IMovement = Movement;
  type IDataMovement = DataMovement;
  type IExportMovement = ExportMovement;

  type IFilterSchedule = FilterSchedule;
  type ISchedule = Schedule;
  type IDataSchedule = DataSchedule;
  type IDataScheduleFinish = DataScheduleFinish;
  type IExportSchedule = ExportSchedule;

  type IDataSupplierCatalog = DataSupplierCatalog;
  type ICatalogSupplier = CatalogSupplier;

  type INotification = Notification;
}
