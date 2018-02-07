# Gene and organism annotations

## Parameters

* `tax_id` Taxonomy identifier
  * default: 9606
* `gene_id` Gene identifier
  * default: BRCA1

## Endpoint

http://dev.togogenome.org/sparql-test

## `tg_up` Map TogoGenome gene ID to UniProt ID

```sparql
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX up: <http://purl.uniprot.org/core/>
SELECT DISTINCT ?tg ?up ?rs
FROM <http://togogenome.org/graph/tgup>
FROM <http://togogenome.org/graph/uniprot>
WHERE {
  {
    SELECT ?tg ?rs
    {
      VALUES ?tg { <http://togogenome.org/gene/{{tax_id}}:{{gene_id}}> }
      ?tg skos:exactMatch ?rs .
    } ORDER BY ?rs LIMIT 1
  }
  ?tg skos:exactMatch ?rs ;
    rdfs:seeAlso ?up_id .
  ?up_id rdfs:seeAlso ?up .
  ?up a up:Protein .
}
```

## `ids` Remove redundant values

```javascript
({tg_up}) => {
  const unwrapped = tg_up.results.bindings.map((binding) => {
    const ret = {};
    Object.keys(binding).forEach(function(key) {
      ret[key] = binding[key].value;
    });
    return ret;
  });

  return unwrapped.reduce((acc, row) => {
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

## `up_names` Protein names

```sparql
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX up: <http://purl.uniprot.org/core/>
SELECT DISTINCT ?up ?protein_name ?synonym_name ?locus_name ?orf_name ?recommended_name ?short_name ?ec_name ?alternative_name ?alt_short_name ?alt_ec_name ?allergen ?cd_antigen ?inn ?biotech
FROM <http://togogenome.org/graph/uniprot>
WHERE {
  VALUES ?up { {{#each ids.up}}<{{this}}> {{/each}} }
  ?up a up:Protein .
  ?up up:encodedBy ?up_hash .
  # Name
  OPTIONAL { ?up_hash skos:prefLabel ?protein_name . }
  # Synonyms
  OPTIONAL { ?up_hash skos:altLabel ?synonym_name . }
  # Ordered Locus names
  OPTIONAL { ?up_hash up:locusName ?locus_name . }
  # ORF names
  OPTIONAL { ?up_hash up:orfName ?orf_name . }
  # Recommended name
  OPTIONAL {
    ?up up:recommendedName ?recommended_name_node .
    ?recommended_name_node up:fullName ?recommended_name .
    # Short name
    OPTIONAL { ?recommended_name_node up:shortName ?short_name . }
    # EC
    OPTIONAL { ?recommended_name_node up:ecName ?ec_name . }
  }
  # Alternative name
  OPTIONAL {
    ?up up:alternativeName ?alternative_name_node .
    ?alternative_name_node up:fullName ?alternative_name .
    OPTIONAL { ?alternative_name_node up:shortName ?alt_short_name }
    OPTIONAL { ?alternative_name_node up:ecName ?alt_ec_name }
    OPTIONAL { ?alternative_name_node up:allergenName ?allergen }
    OPTIONAL { ?alternative_name_node up:cdAntigenName ?cd_antigen }
    OPTIONAL { ?alternative_name_node up:internationalNonproprietaryName ?inn }
    OPTIONAL { ?alternative_name_node up:biotechName ?biotech }
  }
}
```

## `names` Remove redundant values

```javascript
({up_names}) => {
  const unwrapped = up_names.results.bindings.map((binding) => {
    const ret = {};
    Object.keys(binding).forEach(function(key) {
      ret[key] = binding[key].value;
    });
    return ret;
  });

  return unwrapped.reduce((acc, row) => {
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

## `taxonomy` Taxonomic information

```sparql
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX up: <http://purl.uniprot.org/core/>
PREFIX tax:    <http://ddbj.nig.ac.jp/ontologies/taxonomy/>
SELECT DISTINCT ?tg ?taxonomy ?organism_name ?parent_taxonomy_name ?parent_taxonomy (COUNT(?parent_taxonomy) AS ?taxonomy_count)
FROM <http://togogenome.org/graph/tgup>
FROM <http://togogenome.org/graph/taxonomy>
WHERE {
  VALUES ?tg { <http://togogenome.org/gene/9606:BRCA1> }
  ?tg rdfs:seeAlso ?taxonomy .
  ?taxonomy a tax:Taxon .
  OPTIONAL { ?taxonomy tax:scientificName ?organism_name . }
  OPTIONAL {
    ?taxonomy rdfs:subClassOf* ?parent_taxonomy .
    ?parent_taxonomy tax:rank ?rank .
    ?parent_taxonomy tax:scientificName ?parent_taxonomy_name .
    ?parent_taxonomy rdfs:subClassOf* ?ancestor .
  }
}
GROUP BY ?tg ?taxonomy ?organism_name ?parent_taxonomy_name ?parent_taxonomy
ORDER BY ?taxonomy_count
```

## `lineage` Lineage summary

```javascript
({taxonomy}) => {
  return { "lineage": taxonomy.results.bindings.map(row => row.parent_taxonomy_name.value) };
}
```

## Merge results

```javascript
({ids, names, lineage}) => {
  return Object.assign({}, ids, names, lineage);
}
```
