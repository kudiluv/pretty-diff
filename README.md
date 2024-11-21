# AlterAtlas

Library for creating a nice difference log

-   [Single Resolver](#single-resolver)
-   [Array Resolver](#array-resolver)
-   [Resolver Wrapper](#resolver-wrapper)
-   [Nested Resolver](#nested-resolver)
-   [Context](#context)

## Single Resolver

Utility to check if the value has changed

### Attributes

-   options (required);
    -- name (required);
    -- compareBy (optional);
    -- transformForView (optional);

```typescript
SingleResolver({
    name: 'Birthdate',
    compareBy: (doc) => new Date(doc?.birthDate).toISOString(),
    transformForView: (doc) => dayjs(doc?.birthDate).format('DD-MM-YYYY'),
});
```

### Return value

The resolver returns the changed value or null

```json
{
    "name": "Birthdate",
    "old": "2002-12-18T21:00:00.000Z",
    "new": "2024-11-04T21:00:00.000Z",
    "oldForView": "19-12-2002",
    "newForView": "05-11-2024",
    "subChanges": []
}
```

## Array Resolver

Utility for comparing arrays

### Attributes

-   change name (required);
-   array path resolver (required);
-   uniq by function to search for a unique item for comparison (required) (required)
-   item name (required)
-   resolvers for comparing the properties for each modified element (required)

```typescript
type CarType = { uniqId: number; carName: string; power: number };
ArrayResolver<CarType[], CarType>(
    'Cars',
    (value) => value ?? [], // array path
    (value, index) => value?.uniqId, // uniq id resolver
    (value) => value?.carName ?? 'unknown', // name resolver
    [SingleResolver('power', (value) => value?.item?.power)], // nested change resolvers
)(prev, current);
```

### Return value

Resolver returns the value of the array change or null

```typescript
{
    "name": "Cars",
    "isArray": true,
    "subChanges": [
        {
            "name": "Ford",
            "isArrayItem": true,
            "isNewArrayItem": false,
            "isRemovedArrayItem": false,
            "isUpdatedArrayItem": true,
            "subChanges": [
                {
                    "name": "power",
                    "old": 100,
                    "new": 150,
                    "subChanges": []
                }
            ]
        },
        {
            "name": "Toyota",
            "isArrayItem": true,
            "isNewArrayItem": false,
            "isRemovedArrayItem": true,
            "isUpdatedArrayItem": false,
            "subChanges": [
                {
                    "name": "power",
                    "old": 200,
                    "subChanges": []
                }
            ]
        }
    ]
}
```

## Resolver Wrapper

Utility for comparing objects with many resolvers

### Attributes

-   array of resolvers (required)

```typescript
type TestType = { field: string; array: CarType[] };
type CarType = { uniqId: number; carName: string; power: number };

ResolverWrapper<TestType>([
    SingleResolver('field', (value) => value?.field),
    ArrayResolver<TestType, CarType>(
        'Cars',
        (value) => value?.array ?? [],
        (value, index) => value?.uniqId,
        (value) => value?.carName ?? 'unknown',
        [SingleResolver('power', (value) => value?.item?.power)],
    ),
])(prev, current);
```

### Return value

The return value is an array of changes

```json
[
    {
        "name": "field",
        "old": "test1",
        "new": "test2",
        "subChanges": []
    },
    {
        "name": "Cars",
        "isArray": true,
        "subChanges": [
            {
                "name": "Ford",
                "isArrayItem": true,
                "isNewArrayItem": false,
                "isRemovedArrayItem": false,
                "isUpdatedArrayItem": true,
                "subChanges": [
                    {
                        "name": "power",
                        "old": 100,
                        "new": 150,
                        "subChanges": []
                    }
                ]
            }
        ]
    }
]
```

## Nested Resolver

Utility for adding nested changes

### Attributes

-   name of change (required)
-   array of resolvers (required)

```typescript
NestedResolver<string>('test', [
    SingleResolver('first-resolve', (value) => value),
    SingleResolver('second-resolve', (value) => value),
])(prev, current);
```

### Return value

Returns the nested structure of the changes

```json
{
    "name": "test",
    "subChanges": [
        {
            "name": "first-resolve",
            "old": "prev",
            "new": "current",
            "subChanges": []
        },
        {
            "name": "second-resolve",
            "old": "prev",
            "new": "current",
            "subChanges": []
        }
    ]
}
```

## Context

Utility for change the context of your resolvers

```typescript
type NestedObject = {
    first: {
        second: {
            testField: string;
            testField2: number;
        };
    };
};

NestedResolver<NestedObject>('', [
    Context(
        (value) => value?.first.second,
        [
            SingleResolver('testField', (value) => value?.testField),
            SingleResolver('testField2', (value) => value?.testField2),
        ],
    ),
])(prev, current);
```
