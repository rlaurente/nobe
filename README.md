# @rlaurente/nobe

NOBackEnd - A library that will convert a frontend dev to fullstack dev without any knowledge in backend tech / languages. The fast way to create an MVP app without any server setup / cost.

## Install

```bash
npm install @rlaurente/nobe
npx cap sync
```

## API

<docgen-index>

* [`echo(...)`](#echo)
* [`init(...)`](#init)

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
init(options: { url: string; workspace?: string; }) => Promise<{ is_success: boolean; }>
```

| Param         | Type                                              |
| ------------- | ------------------------------------------------- |
| **`options`** | <code>{ url: string; workspace?: string; }</code> |

**Returns:** <code>Promise&lt;{ is_success: boolean; }&gt;</code>

--------------------

</docgen-api>
