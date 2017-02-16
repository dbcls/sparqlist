# Adjacent Prefectures

## Parameters

* `of` 対象の都道府県
  * default: 東京都

## Endpoint

http://ja.dbpedia.org/sparql

## Query adjacent prefectures

```sparql
PREFIX prop-ja: <http://ja.dbpedia.org/property/>
PREFIX resource-ja: <http://ja.dbpedia.org/resource/>
SELECT DISTINCT *
WHERE {
    resource-ja:{{params.of}} prop-ja:隣接都道府県 ?o .
}
```

## Output

```javascript
(context, prev) => {
  return prev.results.bindings.map((row) => {
    const components = row.o.value.split('/');
    return components[components.length-1];
  });
};
```
