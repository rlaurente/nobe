# @rlaurente/nobe

NOBackEnd - Build a full MVP app without Backend API.

## Install

```bash
npm install @rlaurente/nobe
```

## API

<docgen-index>

* [`echo(...)`](#echo)
* [`init(...)`](#init)
* [`switchBranch(...)`](#switchbranch)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### echo(...)

```typescript
echo(options: { value: string; }) => Promise<{ value: string; }>
```

| Param         | Type                            |
| ------------- | ------------------------------- |
| **`options`** | <code>{ value: string; }</code> |

**Returns:** <code>Promise&lt;{ value: string; }&gt;</code>

--------------------


### init(...)

```typescript
init(options: { url: string; workspace?: string; branch?: string; }) => Promise<{ is_success: boolean; }>
```

| Param         | Type                                                               |
| ------------- | ------------------------------------------------------------------ |
| **`options`** | <code>{ url: string; workspace?: string; branch?: string; }</code> |

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

</docgen-api>
