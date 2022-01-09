import { AxiosRequestConfig, AxiosResponse } from "axios";
export interface NobePlugin {
  setConfig(options: { is_mock: boolean, is_debug: boolean}): void;
  init(options: { git_url: string, workspace?: string, branch?: string, wipe?: boolean }): Promise<{ is_success: boolean }>;
  switchBranch(options: { branch_name: string }): Promise<{ is_success: boolean }>;
  get(options: { key: string }): Promise<any>;
  set(options: { key: string, data: any }): Promise<boolean>;
  request(options: AxiosRequestConfig): Promise<AxiosResponse>
  mock(options: { url: string, handler: any }): void;
  apply(): Promise<boolean>;
}