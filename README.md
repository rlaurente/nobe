# @rlaurente/nobe

NOBackEnd - The next level api mocking library for frontend developers. Data persistent mocking api for MVP apps rapid development.

Demo, Docs will be publish soon

## Install

```bash
npm install @rlaurente/nobe
```

## API

<docgen-index>

* [`init(...)`](#init)
* [`switchBranch(...)`](#switchbranch)
* [`get(...)`](#get)
* [`set(...)`](#set)
* [`request(...)`](#request)
* [`mock(...)`](#mock)
* [`apply()`](#apply)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### init(...)

```typescript
init(options: { url: string; workspace?: string; branch?: string; wipe?: boolean; }) => Promise<{ is_success: boolean; }>
```

| Param         | Type                                                                               |
| ------------- | ---------------------------------------------------------------------------------- |
| **`options`** | <code>{ url: string; workspace?: string; branch?: string; wipe?: boolean; }</code> |

**Returns:** <code>Promise&lt;{ is_success: boolean; }&gt;</code>

--------------------


### switchBranch(...)

```typescript
switchBranch(options: { branch_name: string; }) => Promise<{ is_success: boolean; }>
```

| Param         | Type                                  |
| ------------- | ------------------------------------- |
| **`options`** | <code>{ branch_name: string; }</code> |

**Returns:** <code>Promise&lt;{ is_success: boolean; }&gt;</code>

--------------------


### get(...)

```typescript
get(options: { key: string; }) => Promise<any>
```

| Param         | Type                          |
| ------------- | ----------------------------- |
| **`options`** | <code>{ key: string; }</code> |

**Returns:** <code>Promise&lt;any&gt;</code>

--------------------


### set(...)

```typescript
set(options: { key: string; data: any; }) => Promise<boolean>
```

| Param         | Type                                     |
| ------------- | ---------------------------------------- |
| **`options`** | <code>{ key: string; data: any; }</code> |

**Returns:** <code>Promise&lt;boolean&gt;</code>

--------------------


### request(...)

```typescript
request(options: { path: string; type: string; data?: any; headers?: any; }) => Promise<any>
```

| Param         | Type                                                                    |
| ------------- | ----------------------------------------------------------------------- |
| **`options`** | <code>{ path: string; type: string; data?: any; headers?: any; }</code> |

**Returns:** <code>Promise&lt;any&gt;</code>

--------------------


### mock(...)

```typescript
mock(options: { path: string; handler: any; }) => void
```

| Param         | Type                                         |
| ------------- | -------------------------------------------- |
| **`options`** | <code>{ path: string; handler: any; }</code> |

--------------------


### apply()

```typescript
apply() => Promise<boolean>
```

**Returns:** <code>Promise&lt;boolean&gt;</code>

--------------------

</docgen-api>
