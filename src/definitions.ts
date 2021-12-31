export interface NobePlugin {
  init(options: { url: string, workspace?: string, branch?: string, wipe?: boolean}): Promise<{ is_success: boolean }>;
  switchBranch(options: { branch_name: string }): Promise<{ is_success: boolean }>;
  get(options: { key: string }): Promise<any>;
  set(options: { key: string, data: any }): Promise<boolean>;
  request(options: { path: string, type: string, data?: any, headers?: any}): Promise<any>
  mock(options: {path: string, handler: any}): void;
  apply(): Promise<boolean>;
}
