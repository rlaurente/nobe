export interface NobePlugin {
  echo(options: { value: string }): Promise<{ value: string }>;
}
