export interface NobePlugin {
  init(options: { url: string, workspace?: string, branch?: string }): Promise<{ is_success: boolean }>;
  switchBranch(options: { branch_name: string }): Promise<{ is_success: boolean }>;
}
