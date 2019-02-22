# Adjacent Prefectures

## Parameters

* `of` 対象の都道府県
  * default: 東京都

## Endpoint

http://ja.dbpedia.org/sparql

## `adjacent_prefectures` Query adjacent prefectures

```sparql
PREFIX prop-ja: <http://ja.dbpedia.org/property/>
PREFIX resource-ja: <http://ja.dbpedia.org/resource/>
SELECT DISTINCT *
WHERE {
    resource-ja:{{of}} prop-ja:隣接都道府県 ?o .
}
```

## Output

```javascript
({
  json({adjacent_prefectures}) {
    return adjacent_prefectures.results.bindings.map((row) => {
      const components = row.o.value.split('/');
      return components[components.length-1];
    });
  },
  text({adjacent_prefectures}) {
    return adjacent_prefectures.results.bindings.map((row) => {
      const components = row.o.value.split('/');
      return components[components.length-1];
    }).join('\n');
  },
  html({adjacent_prefectures}) {
    return '<ul>' + adjacent_prefectures.results.bindings.map((row) => {
      const components = row.o.value.split('/');
      return `<li>${components[components.length-1]}</li>`;
    }).join('\n') + '</ul>';
  }
})
```
