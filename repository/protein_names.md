# Protein Names

## Parameters

* `tax_id` Taxonomy identifier
  * default: 39947
* `gene_id` Gene identifier
  * default: Os04g0464200

## Endpoint

http://togogenome.org/sparql

## Gene names

```sparql
PREFIX up: <http://purl.uniprot.org/core/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
SELECT DISTINCT ?gene_name ?synonyms_name ?locus_name ?orf_name
FROM <http://togogenome.org/graph/uniprot>
FROM <http://togogenome.org/graph/tgup>
WHERE {
  {
    SELECT ?gene
    {
      <http://togogenome.org/gene/{{params.tax_id}}:{{params.gene_id}}> skos:exactMatch ?gene .
    } ORDER BY ?gene LIMIT 1
  }
  <http://togogenome.org/gene/{{params.tax_id}}:{{params.gene_id}}> skos:exactMatch ?gene ;
    rdfs:seeAlso ?id_upid .
  ?id_upid rdfs:seeAlso ?protein .
  ?protein a up:Protein .
  # Gene names
  ?protein up:encodedBy ?gene_hash .
  ## Name:
  OPTIONAL { ?gene_hash skos:prefLabel ?gene_name . }
  ## Synonyms:
  OPTIONAL { ?gene_hash skos:altLabel ?synonyms_name . }
  ## Ordered Locus Names:
  OPTIONAL { ?gene_hash up:locusName ?locus_name . }
  ## ORF Names:
  OPTIONAL { ?gene_hash up:orfName ?orf_name . }
}
```

## Remove redundant values

```javascript
(context, prev) => {
  const unwrapped = prev.results.bindings.map((binding) => {
    const ret = {};
    Object.keys(binding).forEach(function(key) {
      ret[key] = binding[key].value;
    });
    return ret;
  });

  context.gene_names = unwrapped.reduce((acc, row) => {
    Object.keys(row).forEach((key) => {
      const value = row[key];
      if (acc[key] === undefined) {
        acc[key] = [];
      }
      if (!acc[key].includes(value)) {
        acc[key].push(value);
      }
    });
    return acc;
  }, {});
};
```

## Protein name and taxonomy

```sparql
PREFIX up: <http://purl.uniprot.org/core/>
SELECT DISTINCT ?recommended_name ?ec_name ?alternative_names ?organism_name ?parent_taxonomy_names (COUNT(?parent_taxonomy) AS ?taxonomy_count) REPLACE( STR(?tax_id), "http://purl.uniprot.org/taxonomy/", "") AS ?taxonomy_id
FROM <http://togogenome.org/graph/taxonomy>
FROM <http://togogenome.org/graph/uniprot>
FROM <http://togogenome.org/graph/tgup>
WHERE {
  {
    SELECT ?gene
    {
      <http://togogenome.org/gene/{{params.tax_id}}:{{params.gene_id}}> skos:exactMatch ?gene .
    } ORDER BY ?gene LIMIT 1
  }
  <http://togogenome.org/gene/{{params.tax_id}}:{{params.gene_id}}> skos:exactMatch ?gene ;
    rdfs:seeAlso ?id_upid .
  ?id_upid rdfs:seeAlso ?protein .
  ?protein a up:Protein .
  # Protein names
  ## Recommended name:
  OPTIONAL {
    ?protein up:recommendedName ?recommended_name_node .
    ?recommended_name_node up:fullName ?recommended_name .
  }
  ### EC=
  OPTIONAL { ?recommended_name_node up:ecName ?ec_name . }
  OPTIONAL {
    ?protein up:alternativeName ?alternative_names_node .
    ?alternative_names_node up:fullName ?alternative_names .
  }
  # Taxonomic identifier
  <http://togogenome.org/gene/{{params.tax_id}}:{{params.gene_id}}> skos:exactMatch ?gene ;
    rdfs:seeAlso ?id_taxid.
  ?id_taxid rdfs:seeAlso ?tax_id .
  ?tax_id a up:Taxon .
  # Organism
  OPTIONAL { ?tax_id up:scientificName ?organism_name . }
  # Taxonomic lineage
  OPTIONAL {
    ?tax_id rdfs:subClassOf* ?parent_taxonomy .
    # 真核は階層が多いので rank のあるものだけ表示
    ?parent_taxonomy up:rank ?rank .
    ?parent_taxonomy up:scientificName ?parent_taxonomy_names .
    ?parent_taxonomy rdfs:subClassOf* ?ancestor .
  }
}
GROUP BY ?recommended_name ?ec_name ?alternative_names ?organism_name ?parent_taxonomy_names ?parent_taxonomy ?tax_id
ORDER BY DESC(?taxonomy_count)
```

## Remove redundant values

```javascript
(context, prev) => {
  const unwrapped = prev.results.bindings.map((binding) => {
    const ret = {};
    Object.keys(binding).forEach(function(key) {
      ret[key] = binding[key].value;
    });
    return ret;
  });

  context.summary = unwrapped.reduce((acc, row) => {
    Object.keys(row).forEach((key) => {
      const value = row[key];
      if (acc[key] === undefined) {
        acc[key] = [];
      }
      if (!acc[key].includes(value)) {
        acc[key].push(value);
      }
    });
    return acc;
  }, {});
};
```

## Merge results

```javascript
({gene_names, summary}) => {
  return Object.assign({}, gene_names, summary);
}
```
