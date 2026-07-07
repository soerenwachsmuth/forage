/**
 * Forage Extended
 *
 * A schema-driven extension to the Forage Wikibase data-entry script.
 * Adds the following features on top of the original Forage:
 *
 *  - Schema-based grouping and ordering of properties per entity type
 *  - Configurable qualifier support per property
 *  - Bootstrap flow: empty items show a class-selection screen that
 *    sets the required "instance of" (or equivalent) claims automatically
 *  - Required-field validation with a warning banner
 *  - EDTF date support alongside standard time values
 *  - Qualifier-only properties are hidden from the standalone field list
 *  - Enter key submits the active input field
 *
 * Based on Forage by Sanjay Thiyagarajan, Naresh Kumar, and Yaron Koren.
 * Development of the original tool: https://github.com/sanjay-thiyagarajan/forage
 *
 * @author Original Forage: Sanjay Thiyagarajan, Naresh Kumar, Yaron Koren
 * @author Forage Extended: Sören Wachsmuth
 * @license MIT
 */

// =============================================================================
// SCHEMA CONFIGURATION  (WIKIBASE_SCHEMAS)
// =============================================================================
//
// Each key is a Q-item ID that identifies the entity type.
// The matching schema is detected by reading the item's claims for the
// configured "property" (default: P1 / instance of) and checking whether
// its value matches one of the keys below.
//
// Schema object structure:
// {
//   label:       "Human-readable type name",        // shown as page heading
//   description: "Short description of this type",  // shown in bootstrap picker
//
//   property: "P70",   // OPTIONAL — which property to check for the Q-ID.
//                      // Defaults to P1 (instance of) when omitted.
//                      // Use this when your Wikibase uses a different property
//                      // to classify items (e.g. "classified as").
//
//   bootstrap: [       // Claims to create automatically on a blank item
//     { property: "P1",  value: "Q6"  },  // instance of: some base class
//     { property: "P70", value: "Q3"  },  // classified as: this type
//   ],
//
//   required: ["P47", "P38"],  // Property IDs that must be filled in.
//                               // Shown with a red * and listed in a warning
//                               // banner until a value is saved.
//
//   groups: [          // Ordered list of form sections
//     {
//       label: "Section heading",
//       properties: ["P14", "P92", "P47"]  // shown in this order
//     }
//   ],
//                      // Properties NOT listed in any group appear in an
//                      // auto-generated "Other fields" section at the end.
//
//   qualifiers: {      // Per-property qualifier definitions
//     "P39": [         // Property that receives qualifiers
//       {
//         id:       "P4",            // Qualifier property ID
//         label:    "Role name",     // Label shown in the qualifier input block
//         datatype: "string"         // string | wikibase-item | time | edtf | quantity
//       }
//     ]
//   }
//                      // Qualifier-only property IDs are automatically hidden
//                      // from the standalone field list so they only appear
//                      // as qualifier inputs beneath their parent property.
// }
//
// To add a new entity type, copy one of the blocks below and adjust the
// Q-ID key, label, groups, and qualifiers to match your Wikibase setup.
// =============================================================================

var WIKIBASE_SCHEMAS = {

  // --------------------------------------------------------------------------
  // Q3 — Performance Work
  // --------------------------------------------------------------------------
  "Q3": {
    label: "Performance Work",
    description: "Theaterstueck, Oper, Tanzabend, Performance o.ae.",
    property: "P70",
    bootstrap: [
      { property: "P1",  value: "Q6" },
      { property: "P70", value: "Q3" }
    ],
    required: ["P47", "P38", "P17", "P134", "P58"],
    groups: [
      {
        label: "Basisdaten",
        properties: ["P14", "P92", "P47", "P68", "P76", "P17", "P38"]
      },
      {
        label: "Verwandte Werke & Struktur",
        properties: ["P21", "P5", "P6", "P91"]
      },
      {
        label: "Auffuehrungen",
        properties: ["P20", "P124", "P121", "P122", "P66", "P123"]
      },
      {
        label: "Produktion & Organisation",
        properties: ["P93", "P134"]
      },
      {
        label: "Auszeichnungen & Festivals",
        properties: ["P117", "P22", "P129"]
      },
      {
        label: "Regie & Leitung",
        properties: ["P90", "P84", "P51"]
      },
      {
        label: "Musik & Text",
        properties: ["P49", "P81", "P48", "P46", "P45", "P44", "P43"]
      },
      {
        label: "Musikalische Leitung",
        properties: ["P42", "P41"]
      },
      {
        label: "Choreografie & Besetzung",
        properties: ["P40", "P39", "P15"]
      },
      {
        label: "Ausstattung & Design",
        properties: ["P34", "P33", "P32", "P31", "P30", "P29", "P28", "P26"]
      },
      {
        label: "Weitere Beteiligte",
        properties: ["P35", "P25", "P24"]
      },
      {
        label: "Quellenangaben",
        properties: ["P58", "P113"]
      }
    ],
    qualifiers: {
      "P39": [
        { id: "P4",   label: "Rollenname",     datatype: "string" },
        { id: "P102", label: "Besetzungstyp",  datatype: "wikibase-item" }
      ],
      "P15": [
        { id: "P4",   label: "Rollenname",     datatype: "string" },
        { id: "P102", label: "Besetzungstyp",  datatype: "wikibase-item" }
      ],
      "P117": [
        { id: "P119", label: "Zeitpunkt",                  datatype: "edtf" },
        { id: "P120", label: "Aussage ist Gegenstand von", datatype: "wikibase-item" }
      ],
      "P22": [
        { id: "P119", label: "Zeitpunkt",                  datatype: "edtf" },
        { id: "P120", label: "Aussage ist Gegenstand von", datatype: "wikibase-item" }
      ],
      "P129": [
        { id: "P119", label: "Zeitpunkt",                  datatype: "edtf" },
        { id: "P120", label: "Aussage ist Gegenstand von", datatype: "wikibase-item" }
      ]
    }
  },

  // --------------------------------------------------------------------------
  // Q7 — Performance (Auffuehrung)
  // --------------------------------------------------------------------------
  "Q7": {
    label: "Performance (Auffuehrung)",
    description: "Einzelne Auffuehrung einer Performance Work.",
    bootstrap: [ { property: "P1", value: "Q7" } ],
    required: ["P19", "P12", "P23"],
    groups: [
      {
        label: "Basisdaten & Zeitangabe",
        properties: ["P12", "P75", "P93"]
      },
      {
        label: "Ort & Buehne",
        properties: ["P9", "P107", "P23"]
      },
      {
        label: "Bezug zur Performance Work",
        properties: ["P19"]
      },
      {
        label: "Abweichender Cast",
        properties: ["P39", "P15"]
      },
      {
        label: "Sprache & Medien",
        properties: ["P96", "P77"]
      },
      {
        label: "Quellenangaben",
        properties: ["P58", "P113"]
      },
      {
        label: "Festivalteilnahme",
        properties: ["P129"]
      }
    ],
    qualifiers: {
      "P39": [
        { id: "P4",   label: "Rollenname",    datatype: "string" },
        { id: "P102", label: "Besetzungstyp", datatype: "wikibase-item" }
      ],
      "P15": [
        { id: "P4",   label: "Rollenname",    datatype: "string" },
        { id: "P102", label: "Besetzungstyp", datatype: "wikibase-item" }
      ]
    }
  },

  // --------------------------------------------------------------------------
  // Q8 — Artistic Work
  // --------------------------------------------------------------------------
  "Q8": {
    label: "Artistic Work",
    description: "Literarisches, musikalisches oder anderes kuenstlerisches Werk.",
    bootstrap: [ { property: "P1", value: "Q8" } ],
    required: [],
    groups: [
      {
        label: "Basisdaten",
        properties: ["P93", "P60", "P76"]
      },
      {
        label: "Beteiligte Personen",
        properties: ["P81", "P45"]
      },
      {
        label: "Verlag & Organisation",
        properties: ["P82"]
      },
      {
        label: "Verwandte Werke & Struktur",
        properties: ["P91", "P6"]
      }
    ],
    qualifiers: {}
  },

  // --------------------------------------------------------------------------
  // Q5 — Human (Person)
  // --------------------------------------------------------------------------
  "Q5": {
    label: "Person",
    description: "(realer) toter oder lebender Mensch",
    bootstrap: [ { property: "P1", value: "Q5" } ],
    required: [],
    groups: [
      {
        label: "Name & Identitaet",
        properties: ["P99", "P98", "P100", "P55", "P101"]
      },
      {
        label: "Geburt & Tod",
        properties: ["P64", "P63", "P61", "P59"]
      },
      {
        label: "Beruf & Zugehoerigkeit",
        properties: ["P80", "P50"]
      },
      {
        label: "Auszeichnungen",
        properties: ["P117"]
      }
    ],
    qualifiers: {
      "P80": [
        { id: "P10", label: "Beginn",      datatype: "edtf" },
        { id: "P11", label: "Ende",        datatype: "edtf" },
        { id: "P50", label: "Institution", datatype: "wikibase-item" }
      ],
      "P50": [
        { id: "P10", label: "Beginn", datatype: "edtf" },
        { id: "P11", label: "Ende",   datatype: "edtf" }
      ],
      "P117": [
        { id: "P118", label: "Fuer Werk",               datatype: "wikibase-item" },
        { id: "P119", label: "Zeitpunkt",               datatype: "edtf" },
        { id: "P120", label: "Aussage ist Gegenstand von", datatype: "wikibase-item" }
      ]
    }
  },

  // --------------------------------------------------------------------------
  // Q21 — Place (Ort)
  // --------------------------------------------------------------------------
  "Q21": {
    label: "Place (Ort)",
    description: "jede Art von Standort",
    bootstrap: [ { property: "P1", value: "Q21" } ],
    required: [],
    groups: [
      {
        label: "Geografische Daten",
        properties: ["P37", "P17"]
      }
    ],
    qualifiers: {}
  },

  // --------------------------------------------------------------------------
  // Q123 — Stage (Buehne)
  // --------------------------------------------------------------------------
  "Q123": {
    label: "Stage (Buehne)",
    description: "Buehne oder Spielstaette innerhalb einer Organisation.",
    bootstrap: [ { property: "P1", value: "Q123" } ],
    required: [],
    groups: [
      {
        label: "Basisdaten & Typ",
        properties: ["P93"]
      },
      {
        label: "Ort & Zugehoerigkeit",
        properties: ["P38", "P23"]
      },
      {
        label: "Adresse & Kapazitaet",
        properties: ["P36", "P111"]
      },
      {
        label: "Erbauung & Aufloesung",
        properties: ["P10", "P110"]
      }
    ],
    qualifiers: {}
  },

  // --------------------------------------------------------------------------
  // Q131 — Performance Arts Festival
  // --------------------------------------------------------------------------
  "Q131": {
    label: "Performance Arts Festival",
    description: "ein Festival fuer darstellende Kuenste.",
    bootstrap: [ { property: "P1", value: "Q131" } ],
    required: [],
    groups: [
      {
        label: "Basisdaten & Zeitraum",
        properties: ["P10", "P11", "P113"]
      },
      {
        label: "Ort & Organisation",
        properties: ["P9", "P35"]
      },
      {
        label: "Struktur & Ausgaben",
        properties: ["P5", "P6"]
      },
      {
        label: "Auffuehrungen & Programm",
        properties: ["P121"]
      },
      {
        label: "Personen",
        properties: ["P130", "P131"]
      },
      {
        label: "Auszeichnungen",
        properties: ["P117"]
      },
      {
        label: "Quellenangaben",
        properties: ["P58", "P113"]
      }
    ],
    qualifiers: {}
  },

  // --------------------------------------------------------------------------
  // Q130 — Award (Auszeichnung)
  // --------------------------------------------------------------------------
  "Q130": {
    label: "Award (Auszeichnung)",
    description: "Ehrung oder Wuerdigung",
    bootstrap: [ { property: "P1", value: "Q130" } ],
    required: [],
    groups: [
      {
        label: "Basisdaten & Zeitraum",
        properties: ["P10", "P11", "P12", "P77"]
      },
      {
        label: "Vergabe",
        properties: ["P115", "P116", "P22"]
      },
      {
        label: "Jury",
        properties: ["P130"]
      },
      {
        label: "Struktur",
        properties: ["P6"]
      },
      {
        label: "Quellenangaben",
        properties: ["P58", "P113"]
      }
    ],
    qualifiers: {
      "P116": [
        { id: "P118", label: "Fuer Werk",  datatype: "wikibase-item" },
        { id: "P132", label: "Kategorie",  datatype: "string" }
      ],
      "P22": [
        { id: "P118", label: "Fuer Werk",  datatype: "wikibase-item" },
        { id: "P132", label: "Kategorie",  datatype: "string" }
      ]
    }
  }

};

// =============================================================================
// MAIN SCRIPT
// =============================================================================

messages = {
  en: {
    "menu-title": "Daten erfassen",
    "fields-for-class-title": "Fields for class",
    "other-fields-title": "Other fields",
    "external-ids-title": "External IDs",
    "ids-for-class-title": "IDs for class",
    "other-ids-title": "Other IDs",
  },
};

mw.messages.set(messages["en"]);
var lang = mw.config.get("wgUserLanguage");
if (lang && lang != "en" && lang in messages) {
  mw.messages.set(messages[lang]);
}

mw.loader.using("@wikimedia/codex").then(function (require) {
  const Vue = require("vue");
  const Codex = require("@wikimedia/codex");
  const instanceOfItemID = "P1";
  const propertiesForTypeID = "P133";
  const subClassOfID = "P2";
  const pointInTimeID = "P119";
  const startTimeID = "P10";
  const endTimeID = "P11";
  var statementsMap = {};
  var newStatementsMap = {};
  var allProperties = [];
  var allPropertyLabels = [];
  var allClassLabels = {};
  var statementsToCreate = [];
  var propertiesForClasses = {};
  var parentClassIDs = [];
  var allPropIDLabelsMap = { "": "" };
  var propertyDatatypeMap = {};
  var classIDList = [];
  var allUnitIDs = new Set();

  // Aktives PAD-Schema für dieses Item (wird in mounted() gesetzt)
  var activePadSchema = null;

  var menuList = $("#right-navigation").find(".vector-menu-content-list");
  var editEntityDiv = $("<li>").attr({
    id: "ca-edit-entity",
    class: "vector-tab-noicon mw-list-item",
  });
  var editFieldSpan = $("<span>").text(mw.msg("menu-title"));
  var anchor = $("<a>").append(editFieldSpan);
  anchor.on("click", function () {
    var wbrepo = mw.config.get("wbRepo");
    // wgPageName enthält den vollen Seitennamen inkl. Namespace (z. B. "Item:Q1135"),
    // wgTitle enthält nur den Titel ohne Namespace (z. B. "Q1135") — daher wgPageName verwenden.
    window.location.href =
      wbrepo.url +
      wbrepo.articlePath.replace("$1", mw.config.get("wgPageName")) +
      "?addpropvalues";
  });

  if (mw.config.get("wgPageContentModel") === "wikibase-item") {
    editEntityDiv.append(anchor);
    menuList.append(editEntityDiv);
    const queryString = window.location.search;
    if (queryString.includes("?addpropvalues")) {

      menuList.find("li").each(function () { $(this).removeClass("selected"); });
      $("#ca-edit-entity").addClass("selected");

      // ------------------------------------------------------------------
      // Hilfsfunktionen (unverändert)
      // ------------------------------------------------------------------

      /**
       * Gibt alle Q-IDs zurück, auf die eines der Schema-Properties zeigt.
       * Prüft P1 (instance of) plus alle in WIKIBASE_SCHEMAS konfigurierten
       * abweichenden Properties (z. B. P70 für classified as).
       */
      function getParentClassIDs(entity) {
        var entityParentClassIDs = [];

        // Immer P1 (instance of) auslesen
        if (entity.claims[instanceOfItemID]) {
          entity.claims[instanceOfItemID].forEach(function (val) {
            if (val.mainsnak.snaktype === 'value') {
              entityParentClassIDs.push(val.mainsnak.datavalue.value.id);
            }
          });
        }

        // Zusätzlich alle abweichenden Properties aus WIKIBASE_SCHEMAS prüfen
        var extraProps = new Set();
        Object.values(WIKIBASE_SCHEMAS).forEach(function (schema) {
          if (schema.property && schema.property !== instanceOfItemID) {
            extraProps.add(schema.property);
          }
        });
        extraProps.forEach(function (propID) {
          if (entity.claims[propID]) {
            entity.claims[propID].forEach(function (val) {
              if (val.mainsnak.snaktype === 'value') {
                entityParentClassIDs.push(val.mainsnak.datavalue.value.id);
              }
            });
          }
        });

        return entityParentClassIDs;
      }

      function setStatementsMap(entity, propertyIDs) {
        propertyIDs.forEach(function (propertyID) {
          if (entity.claims[propertyID]) {
            statementsMap[propertyID] = entity.claims[propertyID];
          }
        });
      }

      async function getParentClasses(parentClassIDs) {
        if (parentClassIDs.length === 0) return [];
        let newIds = parentClassIDs.filter(function (classID) {
          return !classIDList.includes(classID);
        });
        classIDList = classIDList.concat(newIds);
        const api = new mw.Api();
        const requestParams = {
          action: "wbgetentities", ids: newIds, props: "claims", format: "json",
        };
        try {
          const res = await api.get(requestParams);
          var parentIDs = new Set();
          for (const itemID of newIds) {
            if (res.entities[itemID].claims[subClassOfID] !== undefined) {
              const parentClasses = res.entities[itemID].claims[subClassOfID];
              parentClasses.forEach(async function (classValue) {
                if (classValue.mainsnak.snaktype !== "novalue" && classValue.rank !== "deprecated") {
                  parentIDs.add(classValue.mainsnak.datavalue.value.id);
                }
              });
            }
          }
          await getParentClasses(Array.from(parentIDs));
        } catch (error) {
          console.error("API call failed: ", error);
        }
      }

      function chunkArray(array, size) {
        return Array.from({ length: Math.ceil(array.length / size) }, function (_, index) {
          return array.slice(index * size, index * size + size);
        });
      }

      function retrieveClassProperties(api, requestParams, parentClassIDs, entity) {
        return new Promise(async function (resolve, reject) {
          var parentClassIDBatches = chunkArray(parentClassIDs, 50);
          var promises = parentClassIDBatches.map(function (classIDBatch) {
            return new Promise(function (innerResolve, innerReject) {
              var requestParams = {
                action: "wbgetentities", ids: classIDBatch, props: "claims", format: "json",
              };
              let typesResponse = api.get(requestParams);
              typesResponse.done(function (res) {
                let entities = res.entities;
                let allPropIDs = new Set();
                classIDBatch.forEach(function (classID) {
                  let curClass = entities[classID];
                  if (!propertiesForClasses[classID]) propertiesForClasses[classID] = [];
                  if (curClass.claims[propertiesForTypeID]) {
                    curClass.claims[propertiesForTypeID].forEach(function (curProperty) {
                      var snakType = curProperty.mainsnak.snaktype;
                      if (snakType == "novalue" || snakType == "somevalue") return;
                      let propertyID = curProperty.mainsnak.datavalue.value.id;
                      if (allPropIDs.has(propertyID)) return;
                      propertiesForClasses[classID].push(propertyID);
                      allPropIDs.add(propertyID);
                    });
                  }
                });
                let propertyIDsForCurrentClassBatch = Array.from(allPropIDs);
                propertyIDsForCurrentClassBatch.splice(propertyIDsForCurrentClassBatch.indexOf(instanceOfItemID), 1);
                setStatementsMap(entity, propertyIDsForCurrentClassBatch);
                retrieveLabels(api, propertyIDsForCurrentClassBatch, classIDBatch).then(function (labelsResult) {
                  allProperties = allProperties.concat(labelsResult.allProperties);
                  Object.assign(allClassLabels, labelsResult.allClassLabels);
                  innerResolve();
                });
              });
            });
          });

          var propertyIDsForThisPage = Object.keys(entity.claims);
          propertyIDsForThisPage.splice(propertyIDsForThisPage.indexOf(instanceOfItemID), 1);
          setStatementsMap(entity, propertyIDsForThisPage);

          var batchedPropertyIDsForThisPage = chunkArray(propertyIDsForThisPage, 50);
          var propertyLabelPromises = batchedPropertyIDsForThisPage.map(function (curPropertyIDsBatch) {
            return new Promise(async function (innerResolve, innerReject) {
              var requestParams = {
                action: "wbgetentities", ids: curPropertyIDsBatch,
                props: "labels", languages: lang + "|en", format: "json",
              };
              var result = await api.get(requestParams);
              allProps = Object.entries(result.entities).map(function ([propID, value]) {
                propertyDatatypeMap[propID] = value.datatype;
                var propLabel;
                if (value.labels && value.labels[lang]) propLabel = value.labels[lang].value;
                else if (value.labels && value.labels["en"]) propLabel = value.labels["en"].value;
                else propLabel = propID;
                return { id: propID, datatype: value.datatype, label: propLabel };
              });
              allProperties = allProperties.concat(allProps);
              innerResolve();
            });
          });

          Promise.all(promises).then(function (_) {
            Promise.all(propertyLabelPromises).then(function (_) { resolve(); })
              .catch(function (error) { console.error("Error fetching labels:", error); });
          }).catch(function (error) { console.error("Error fetching labels:", error); });
        });
      }

      function fetchPropertyLabels(api, properties) {
        var requestParams = { action: "wbgetentities", props: "labels", languages: lang + "|en", format: "json" };
        var propertyBatches = chunkArray(properties, 50);
        return new Promise(function (resolve, reject) {
          var promises = propertyBatches.map(function (propertyBatch) {
            var propertyBatchIDs = propertyBatch.map(function (prop) { return prop.id; });
            var labelsResponse = api.get($.extend({}, requestParams, { ids: propertyBatchIDs }));
            return labelsResponse.then(function (res) {
              var allItemData = res.entities;
              var properties = [];
              Object.keys(allItemData).forEach(function (itemID) {
                var curItemData = allItemData[itemID];
                var propLabel;
                if (curItemData.labels && curItemData.labels[lang]) propLabel = curItemData.labels[lang].value;
                else if (curItemData.labels && curItemData.labels["en"]) propLabel = curItemData.labels["en"].value;
                else propLabel = curItemData.id;
                properties.push({ id: curItemData.id, datatype: curItemData.datatype, label: propLabel });
              });
              return { properties: properties };
            });
          });
          Promise.all(promises).then(function (results) {
            var props = [];
            results.forEach(function (result) { props = props.concat(result.properties); });
            allPropertyLabels = props;
            resolve();
          }).catch(function (error) { console.error("Error fetching labels:", error); });
        });
      }

      async function retrieveLabels(api, propertyIDs, classIDs) {
        var requestParams = { action: "wbgetentities", props: "labels", languages: lang + "|en", format: "json" };
        var batchSize = 50;
        var chunks = [];
        var i, j;
        for (i = 0, j = propertyIDs.length; i < j; i += batchSize) chunks.push(propertyIDs.slice(i, i + batchSize));
        for (i = 0, j = classIDs.length; i < j; i += batchSize) chunks.push(classIDs.slice(i, i + batchSize));
        var promises = chunks.map(function (chunk) {
          var labelsResponse = api.get($.extend({}, requestParams, { ids: chunk }));
          return labelsResponse.then(function (res) {
            var allItemData = res.entities;
            var properties = [];
            var classLabels = {};
            Object.keys(allItemData).forEach(function (itemID) {
              var curItemData = allItemData[itemID];
              var curClassLabel;
              if (curItemData.labels && curItemData.labels[lang]) curClassLabel = curItemData.labels[lang].value;
              else if (lang !== "en" && curItemData.labels && curItemData.labels["en"]) curClassLabel = curItemData.labels["en"].value;
              else curClassLabel = curItemData.id;
              if (classIDs.indexOf(curItemData.id) === -1) {
                properties.push({ id: curItemData.id, datatype: curItemData.datatype, label: curClassLabel });
              } else {
                classLabels[curItemData.id] = curClassLabel;
              }
              propertyDatatypeMap[curItemData.id] = curItemData.datatype;
            });
            return { properties: properties, classLabels: classLabels };
          });
        });
        try {
          const results = await Promise.all(promises);
          var allProperties = [];
          var allClassLabels = {};
          results.forEach(function (result) {
            allProperties = allProperties.concat(result.properties);
            Object.assign(allClassLabels, result.classLabels);
          });
          return { allProperties, allClassLabels };
        } catch (error) { console.error("Error fetching labels:", error); }
      }

      function deleteValue(idx, propID) {
        this.newStatementsMap[propID].splice(idx, 1);
      }

      function adaptApiResponse(pages) {
        return pages.map(({ id, label, url, match, description, display = {}, thumbnail }) => ({
          value: id, label,
          match: match.type === "alias" ? `(${match.text})` : "",
          description,
          language: {
            label: display && display.label && display.label.language,
            match: match.type === "alias" ? match.language : undefined,
            description: display && display.description && display.description.language,
          },
          thumbnail: thumbnail ? { url: thumbnail.url, width: thumbnail.width, height: thumbnail.height } : undefined,
        }));
      }

      function parseTimeValue(timeValue) {
        var timeString = timeValue.time.replace("+", "");
        var isBC = false;
        if (timeString.startsWith('-')) { isBC = true; timeString = timeString.substring(1); }
        var precision = timeValue.precision;
        if (precision >= 11) {
          let dateObj = new Date(timeString);
          let year = dateObj.getUTCFullYear();
          if (isBC) year = '-' + year;
          let monthNum = dateObj.getUTCMonth() + 1;
          let monthNames = mw.config.get("wgMonthNames");
          let dayNum = dateObj.getUTCDate();
          return dayNum + ' ' + monthNames[monthNum] + ' ' + year;
        } else if (precision == 10) {
          let matches = timeString.match(/(\d+)-(\d+)/);
          let year = matches[1].replace(/^0+/, "");
          if (isBC) year = '-' + year;
          let monthNum = parseInt(matches[2]);
          let monthNames = mw.config.get("wgMonthNames");
          return monthNames[monthNum] + ' ' + year;
        } else {
          let matches = timeString.match(/(\d+)/);
          let year = matches[0].replace(/^0+/, "");
          if (isBC) year = '-' + year;
          return year;
        }
      }

      function parseValue(statement) {
        var curValue = statement.mainsnak.datavalue.value;
        var str;
        if (curValue.id) {
          str = allPropIDLabelsMap[curValue.id];
          if (str == "") str = curValue.id;
          let wbrepo = mw.config.get("wbRepo");
          let entityURL = wbrepo.url + wbrepo.articlePath.replace("$1", "Item:" + curValue.id);
          str = '<a href="' + entityURL + '" target="_blank">' + str + "</a>";
        } else if (curValue.amount) {
          str = Number(curValue.amount).toLocaleString(undefined, { maximumFractionDigits: 15 });
          if (curValue.unit !== "1") {
            var unitID = curValue.unit.split("/").pop();
            str += " <" + unitID + "></" + unitID + ">";
            allUnitIDs.add(unitID);
          }
        } else if (curValue.time) {
          str = parseTimeValue(curValue);
        } else if (curValue.latitude && curValue.longitude) {
          str = "(" + curValue.latitude + ", " + curValue.longitude + ")";
          str = '<a href="https://geohack.toolforge.org/geohack.php?params=' +
            curValue.latitude + "_N_" + curValue.longitude +
            '_E" class="external" target="_blank">' + str + "</a>";
        } else if (curValue.text) {
          str = curValue.text;
          if (curValue.language) str += " (" + curValue.language + ")";
        } else if (statement.mainsnak.datatype == "commonsMedia") {
          let wbrepo = mw.config.get("wbRepo");
          let entityURL = wbrepo.url + wbrepo.articlePath.replace("$1", "File:" + curValue);
          str = '<a href="' + entityURL + '" target="_blank">' + curValue + "</a>";
        } else if (statement.mainsnak.datatype == "url") {
          str = '<a href="' + curValue + '" class="external" target="_blank">' + curValue + "</a>";
        } else {
          str = curValue;
        }
        if (statement.qualifiers) {
          var pointInTimeQualifiers = statement.qualifiers[pointInTimeID];
          if (pointInTimeQualifiers && pointInTimeQualifiers[0].datavalue) {
            var pointInTime = parseTimeValue(pointInTimeQualifiers[0].datavalue.value);
            str += " (" + pointInTime + ")";
          } else if (statement.qualifiers[startTimeID] || statement.qualifiers[endTimeID]) {
            var startTimeQualifiers = statement.qualifiers[startTimeID];
            var startTime = (startTimeQualifiers && startTimeQualifiers[0].datavalue)
              ? parseTimeValue(startTimeQualifiers[0].datavalue.value) : "";
            var endTimeQualifiers = statement.qualifiers[endTimeID];
            var endTime = (endTimeQualifiers && endTimeQualifiers[0].datavalue)
              ? parseTimeValue(endTimeQualifiers[0].datavalue.value) : "";
            str += " (" + startTime + " - " + endTime + ")";
          }
        }
        return str;
      }

      function fetchEntityAndQualifierLabels(api, entityIDs) {
        var batchSize = 50;
        var chunks = [];
        var requestParams = { action: "wbgetentities", props: "labels", languages: lang + "|en", format: "json" };
        var i, j;
        for (i = 0, j = entityIDs.length; i < j; i += batchSize) chunks.push(entityIDs.slice(i, i + batchSize));
        var promises = chunks.map(function (chunk) {
          var labelsResponse = api.get($.extend({}, requestParams, { ids: chunk }));
          return labelsResponse.then(function (res) {
            var allItemData = res.entities;
            var labels = {};
            Object.keys(allItemData).forEach(function (itemID) {
              var curItemData = allItemData[itemID];
              if (curItemData.labels && curItemData.labels[lang]) labels[curItemData.id] = curItemData.labels[lang].value;
              else if (lang != "en" && curItemData.labels && curItemData.labels["en"]) labels[curItemData.id] = curItemData.labels["en"].value;
              else labels[curItemData.id] = itemID;
            });
            return { propIDLabelMap: labels };
          });
        });
        return Promise.all(promises).then(function (results) {
          results.forEach(function (result) { Object.assign(allPropIDLabelsMap, result.propIDLabelMap); });
          return allPropIDLabelsMap;
        }).catch(function (error) { console.error("Error fetching labels:", error); });
      }

      function replaceUnitIDsWithLabels() {
        if (allUnitIDs.size == 0) return;
        var api = new mw.Api();
        var requestParams = {
          action: "wbgetentities", ids: Array.from(allUnitIDs),
          props: "labels", languages: lang + "|en", format: "json",
        };
        var result = api.get(requestParams);
        result.done(async function (res) {
          var unitEntities = res.entities;
          Object.keys(unitEntities).forEach(function (unitID) {
            var unitLabel;
            if (unitEntities[unitID].labels && unitEntities[unitID].labels[lang]) unitLabel = unitEntities[unitID].labels[lang].value;
            else if (unitEntities[unitID].labels && unitEntities[unitID].labels["en"]) unitLabel = unitEntities[unitID].labels["en"].value;
            else unitLabel = unitID;
            $(unitID).replaceWith(unitLabel);
          });
        });
      }

      function capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
      }

      // ------------------------------------------------------------------
      // PAD-Hilfsfunktionen: Schema-basierte Gruppierung
      // ------------------------------------------------------------------

      /**
       * Gibt das aktive PAD-Schema zurück, basierend auf den instance-of-Werten
       * des aktuellen Items. Gibt null zurück, wenn kein Schema passt.
       */
      /**
       * Findet das passende PAD-Schema für das aktuelle Item.
       * Prüft ob eine der gesammelten Q-IDs (aus P1 oder der
       * konfigurierten schema.property) einem Schema-Key entspricht.
       */
      function detectPadSchema(classIDs) {
        for (var i = 0; i < classIDs.length; i++) {
          if (WIKIBASE_SCHEMAS[classIDs[i]]) {
            return WIKIBASE_SCHEMAS[classIDs[i]];
          }
        }
        return null;
      }

      /**
       * Baut aus dem PAD-Schema eine geordnete Gruppen-Map:
       * [ { label: "Gruppenname", properties: ["P1", ...] }, ... ]
       * Properties die nicht im Schema stehen, kommen in eine
       * "Weitere Felder"-Gruppe am Ende.
       */
      function buildSchemaGroups(schema, allPropIDs, externalPropIDs) {
        var schemaGroups = [];
        var assignedProps = new Set();

        // Alle Qualifier-Property-IDs sammeln — diese sollen NIE als
        // eigenstaendige Felder auftauchen, nur als Qualifier anderer Properties.
        var qualifierOnlyIDs = new Set();
        if (schema.qualifiers) {
          Object.values(schema.qualifiers).forEach(function (qualList) {
            qualList.forEach(function (q) { qualifierOnlyIDs.add(q.id); });
          });
        }

        // Schema-Gruppen aufbauen.
        // Im Schema-Modus zeigen wir ALLE konfigurierten Properties an,
        // unabhaengig davon ob sie bereits im Item vorhanden sind.
        // So funktioniert das Formular auch bei frisch angelegten Items.
        schema.groups.forEach(function (groupDef) {
          var groupProps = groupDef.properties.filter(function (pID) {
            return !externalPropIDs.includes(pID) && !qualifierOnlyIDs.has(pID);
          });
          if (groupProps.length > 0) {
            schemaGroups.push({ label: groupDef.label, properties: groupProps });
            groupProps.forEach(function (pID) { assignedProps.add(pID); });
          }
        });

        // Bereits im Item vorhandene Properties die nicht im Schema stehen
        // und keine reinen Qualifier-Properties sind → "Weitere Felder"
        var remaining = allPropIDs.filter(function (pID) {
          return !assignedProps.has(pID)
              && !externalPropIDs.includes(pID)
              && !qualifierOnlyIDs.has(pID);
        });
        if (remaining.length > 0) {
          schemaGroups.push({ label: mw.msg("other-fields-title"), properties: remaining });
        }

        return schemaGroups;
      }

      /**
       * Erstellt ein leeres Statement-Objekt für einen Qualifier.
       */
      function createEmptyQualifierValue(datatype) {
        if (datatype === "wikibase-item") {
          return { "entity-type": "item", "numeric-id": null, id: "" };
        } else if (datatype === "time") {
          return { time: "", precision: 9, timezone: 0, before: 0, after: 0, calendarmodel: "http://www.wikidata.org/entity/Q1985727" };
        } else if (datatype === "edtf") {
          return "";  // EDTF ist ein einfacher String, z. B. "1990-03-24" oder "1990/2000"
        } else if (datatype === "quantity") {
          return { amount: "", unit: "1" };
        } else {
          return "";  // string, external-id, url
        }
      }

      /**
       * Erstellt ein vollständiges leeres Statement inkl. Qualifier-Struktur,
       * falls im Schema Qualifier für diese Property definiert sind.
       */
      function createEmptyStatement(propID, propDataType, schema) {
        var statement = {
          mainsnak: {
            snaktype: "value",
            property: propID,
            datavalue: {},
            datatype: propDataType,
          },
          id: "",
        };
        if (propDataType === "wikibase-item") {
          statement.mainsnak.datavalue = { value: { "entity-type": "item", "numeric-id": null, id: "" } };
        } else if (propDataType === "string" || propDataType === "commonsMedia" || propDataType === "external-id") {
          statement.mainsnak.datavalue = { value: "" };
        } else if (propDataType === "quantity") {
          statement.mainsnak.datavalue = { value: { amount: "", unit: "1" } };
        } else if (propDataType === "time") {
          statement.mainsnak.datavalue = { value: { time: "" } };
        } else if (propDataType === "edtf") {
          statement.mainsnak.datavalue = { value: "" };  // EDTF: einfacher String
        } else if (propDataType === "monolingualtext") {
          statement.mainsnak.datavalue = { value: {} };
        } else if (propDataType === "globe-coordinate") {
          statement.mainsnak.datavalue = { value: { latitude: "", longitude: "" } };
        }

        // Qualifier-Struktur anhängen, wenn im Schema definiert
        if (schema && schema.qualifiers && schema.qualifiers[propID]) {
          statement._padQualifiers = {};
          schema.qualifiers[propID].forEach(function (qualDef) {
            statement._padQualifiers[qualDef.id] = {
              def: qualDef,
              value: createEmptyQualifierValue(qualDef.datatype),
              // Für wikibase-item: Label für die Anzeige im Typeahead
              label: ""
            };
          });
        }

        return statement;
      }

      // ------------------------------------------------------------------
      // Vue App
      // ------------------------------------------------------------------

      Vue.createMwApp({
        data: function () {
          return {
            name: "ForagePAD",
            // Stile
            groupDivStyle:
              "border: 1px solid #b0b8bf; width: 80%; padding: 0 1rem 1.2rem 1rem; margin-top: 1rem; background: aliceblue;",
            externalIDDivStyle:
              "font-size: 14px; border: 1px solid #aaa; width: 80%; padding: 0 1rem 1rem 1rem; margin-top: 1rem; background: #f5f5f5;",
            classHeaderStyle: "font-size: 15px; font-weight: bold;",
            qualifierBlockStyle:
              "margin-left: 1.5rem; margin-top: 6px; padding: 8px 12px; background: #e8f0fe; border-left: 3px solid #4a6da7; border-radius: 3px; font-size: 13px;",
            qualifierLabelStyle:
              "display: inline-block; min-width: 120px; font-weight: 500; color: #444;",
            valueInputStyle:
              "display: flex; flex-direction: row; margin: 5px 0 10px 0; flex-wrap: wrap; align-items: flex-start; gap: 6px;",
            valueTagStyle:
              "display: inline-block; font-size: 13px; padding: 3px 10px; border: 1px solid #999; background: lightyellow; border-radius: 10px; margin: 0 8px 6px 0;",

            // Daten
            classIDs: [],
            classLabels: {},
            properties: [],
            schemaGroups: [],           // NEU: Schema-Gruppen für das aktive Item
            classPropertiesMap: {},     // Fallback (alter Modus)
            otherPropertiesMap: {},     // Fallback (alter Modus)
            statementsMap: {},
            progress: true,
            autocompleteItems: [],
            qualifierAutocompleteItems: {},  // NEU: { "propID_qualID": [...] }
            existingValueLabels: {},
            newStatementsMap: {},
            activePadSchema: null,      // NEU: aktives Schema-Objekt
            mw,
            allPropIDLabelsMap,
            deleteValue,
            parseValue,
            message: { show: false, state: "success", text: "" },
            monthNames: mw.config.get("wgMonthNames"),
            publishMsg: "✔ " + mw.msg("wikibase-publish"),
            cancelMsg: "✘ " + mw.msg("wikibase-cancel"),
            unitMsg: mw.msg("valueview-expertextender-unitsuggester-label"),
            dayMsg: capitalizeFirst(mw.msg("valueview-expert-timeinput-precision-day")) + ":",
            monthMsg: capitalizeFirst(mw.msg("valueview-expert-timeinput-precision-month")) + ":",
            yearMsg: capitalizeFirst(mw.msg("valueview-expert-timeinput-precision-year")) + ":",
            languageMsg: mw.msg("valueview-expertextender-languageselector-label"),
          };
        },

        // ------------------------------------------------------------------
        // Template
        // ------------------------------------------------------------------
        template: `
<div>
  <cdx-progress-bar style="margin-top: 30px; width: 80%" v-if="progress" aria-label="ProgressBar"></cdx-progress-bar>
  <cdx-message
    v-if="message.show"
    :type="message.state"
    dismiss-button-label="Close"
    :fade-in="true"
    :auto-dismiss="true"
    :display-time="3000"
    style="position: fixed; right: 2%; width: 70%;"
  >{{message.text}}</cdx-message>

  <!-- ====== BOOTSTRAP: Klassen-Auswahl fuer leere Items ====== -->
  <div v-if="showBootstrap && !progress" style="width:80%; margin-top:1.5rem;">
    <h2 style="font-size:18px; font-weight:bold; margin-bottom:0.5rem;">Welche Art von Eintrag moechten Sie anlegen?</h2>
    <p style="font-size:13px; color:#555; margin-bottom:1rem;">Waehlen Sie eine Klasse. Das Formular wird danach mit den passenden Feldern geladen.</p>
    <div style="display:flex; flex-wrap:wrap; gap:12px;">
      <div
        v-for="(schema, qid) in availableSchemas"
        :key="qid"
        @click="bootstrapEntity(qid)"
        style="cursor:pointer; border:1px solid #b0b8bf; border-radius:6px; padding:14px 20px; background:white; flex:1 1 180px; max-width:220px; min-width:160px; box-sizing:border-box; transition:background 0.15s, border-color 0.15s;"
        onmouseover="this.style.background='#e8f4fd';this.style.borderColor='#4a6da7';"
        onmouseout="this.style.background='white';this.style.borderColor='#b0b8bf';"
      >
        <div style="font-weight:bold; font-size:14px; margin-bottom:4px;">{{ schema.label }}</div>
        <div style="font-size:12px; color:#666; line-height:1.4;">{{ schema.description }}</div>
      </div>
    </div>
    <div v-if="bootstrapLoading" style="margin-top:1rem; font-size:13px; color:#555;">
      Klasse wird gesetzt, bitte warten...
      <cdx-progress-bar style="margin-top:8px; width:60%;" aria-label="Loading"></cdx-progress-bar>
    </div>
  </div>

  <!-- ====== DATENSATZ-TYP ÜBERSCHRIFT ====== -->
  <div v-if="!progress && !showBootstrap && activePadSchema" style="width:80%; margin-top:1.2rem; margin-bottom:0.2rem;">
    <span style="font-size:13px; color:#555;">Datensatz: </span>
    <strong style="font-size:15px;">{{ activePadSchema.label }}</strong>
  </div>

  <!-- ====== PFLICHTFELDER-WARNUNG ====== -->
  <div
    v-if="!progress && !showBootstrap && activePadSchema && missingRequiredFields.length > 0"
    style="width:80%; margin-top:1rem; padding:10px 16px; background:#fff3cd; border:1px solid #ffc107; border-radius:4px; font-size:13px;"
  >
    <strong>Pflichtfelder noch nicht ausgefuellt:</strong>
    <span v-for="(label, i) in missingRequiredFields" :key="i">
      <span style="display:inline-block; margin:2px 6px; padding:2px 8px; background:#ffe082; border-radius:10px;">{{ label }}</span>
    </span>
  </div>

  <!-- ====== SCHEMA-MODUS: gruppierte Darstellung nach PAD-Schema ====== -->
  <template v-if="!progress && !showBootstrap && activePadSchema">
    <div
      v-for="(group, groupIdx) in schemaGroups"
      :key="'group-' + groupIdx"
      :style="groupDivStyle"
    >
      <h2 :style="classHeaderStyle">{{ group.label }}</h2>

      <cdx-field
        style="max-width: max-content;"
        v-for="propID in group.properties"
        :key="propID"
      >
        <template #label>
          <a :href="getWikibasePropertyURL(propID)" target="_blank">
            {{ properties[propID] ? properties[propID].label : propID }}
          </a>
          <span v-if="requiredProps.includes(propID)" style="color:#c0392b; font-weight:bold; margin-left:3px;" title="Pflichtfeld"> *</span>
          &nbsp;
          <cdx-button @click="addNewValue(propID)">+</cdx-button>
        </template>

        <!-- Neue Werte -->
        <div
          v-for="(statement, idx) in newStatementsMap[propID]"
          :key="idx"
          :style="valueInputStyle"
        >
          <!-- Hauptwert-Eingabe -->
          <div style="display:flex; flex-direction:column; gap:4px;">
            <div style="display:flex; align-items:center; gap:6px;">

              <!-- wikibase-item -->
              <cdx-typeahead-search
                v-if="properties[propID] && properties[propID].datatype === 'wikibase-item'
                      && !(statement.references || statement.qualifiers)
                      && (statement.mainsnak.snaktype !== 'novalue')"
                :initial-input-value="allPropIDLabelsMap[statement.mainsnak.datavalue.value.id]"
                placeholder="Typ oder Auswahl …"
                search-results-label="Suchergebnisse"
                :search-results="autocompleteItems"
                :show-thumbnail="true"
                :highlight-query="true"
                :visible-item-limit="5"
                @input="comboboxOnChange"
                @search-result-click="comboboxOnSelect($event, propID, idx)"
                @blur="resetOptions"
              ></cdx-typeahead-search>

              <!-- string / commonsMedia -->
              <cdx-text-input
                v-if="properties[propID] && (properties[propID].datatype === 'commonsMedia' || properties[propID].datatype === 'string')
                      && !(statement.references || statement.qualifiers)
                      && (statement.mainsnak.snaktype !== 'novalue')"
                v-model="statement.mainsnak.datavalue.value"
                @keydown.enter="submitChanges($event, propID, idx)"
              ></cdx-text-input>

              <!-- quantity -->
              <div v-if="properties[propID] && properties[propID].datatype === 'quantity'" :style="valueInputStyle">
                <cdx-text-input
                  v-model="statement.mainsnak.datavalue.value.amount"
                  @keydown.enter="submitChanges($event, propID, idx)"
                ></cdx-text-input>
                <div style="padding: 5px 5px 5px 15px;">{{unitMsg}}</div>
                <cdx-typeahead-search
                  placeholder="Einheit …"
                  search-results-label="Suchergebnisse"
                  :search-results="autocompleteItems"
                  :highlight-query="true"
                  :visible-item-limit="5"
                  @input="comboboxOnChange"
                  @search-result-click="unitComboboxOnSelect($event, propID, idx)"
                  @blur="resetOptions"
                ></cdx-typeahead-search>
              </div>

              <!-- time -->
              <div v-if="properties[propID] && properties[propID].datatype === 'time'">
                {{dayMsg}}
                <input type="text" class="dayInput" size="1" style="padding: 6px 8px;">
                &nbsp;{{monthMsg}}
                <select class="monthInput" style="padding: 6px 8px;">
                  <option v-for="(monthName, monthNum) in monthNames" :value="monthNum">{{monthName}}</option>
                </select>
                &nbsp;{{yearMsg}}
                <input type="text" class="yearInput" size="4" style="padding: 6px 8px;">
              </div>

              <!-- edtf -->
              <cdx-text-input
                v-if="properties[propID] && properties[propID].datatype === 'edtf'"
                v-model="statement.mainsnak.datavalue.value"
                placeholder="EDTF-Datum, z. B. 1990-03-24 oder 1990"
                style="min-width: 220px;"
                @keydown.enter="submitChanges($event, propID, idx)"
              ></cdx-text-input>

              <!-- monolingualtext -->
              <div v-if="properties[propID] && properties[propID].datatype === 'monolingualtext'">
                <input type="text" class="textInput" size="30" style="padding: 6px 8px;">
                &nbsp;{{languageMsg}}
                <input type="text" class="langInput" size="1" style="padding: 6px 8px;">
              </div>

              <!-- globe-coordinate -->
              <div v-if="properties[propID] && properties[propID].datatype === 'globe-coordinate'">
                Latitude: <input type="text" class="latInput" size="20" style="padding: 6px 8px;">
                &nbsp;Longitude: <input type="text" class="lonInput" size="20" style="padding: 6px 8px;">
              </div>

              <cdx-button action="progressive" weight="quiet"
                @click="submitChanges($event, propID, idx)">{{publishMsg}}</cdx-button>
              <cdx-button
                v-if="!(statement.references || statement.qualifiers) && (statement.mainsnak.snaktype !== 'novalue')"
                action="destructive" weight="quiet"
                @click="deleteValue(idx, propID)">{{cancelMsg}}</cdx-button>
            </div>

            <!-- ====== QUALIFIER-BLOCK (NEU) ====== -->
            <div v-if="statement._padQualifiers" :style="qualifierBlockStyle">
              <div
                v-for="(qualState, qualID) in statement._padQualifiers"
                :key="qualID"
                style="display:flex; align-items:center; gap:8px; margin-bottom:6px;"
              >
                <span :style="qualifierLabelStyle">{{ qualState.def.label }}:</span>

                <!-- Qualifier: string -->
                <cdx-text-input
                  v-if="qualState.def.datatype === 'string'"
                  v-model="qualState.value"
                  :placeholder="qualState.def.label"
                  style="min-width: 200px;"
                  @keydown.enter="submitChanges($event, propID, idx)"
                ></cdx-text-input>

                <!-- Qualifier: wikibase-item -->
                <cdx-typeahead-search
                  v-if="qualState.def.datatype === 'wikibase-item'"
                  :initial-input-value="qualState.label"
                  :placeholder="qualState.def.label + ' …'"
                  search-results-label="Suchergebnisse"
                  :search-results="getQualifierAutocomplete(propID, qualID)"
                  :show-thumbnail="true"
                  :highlight-query="true"
                  :visible-item-limit="5"
                  @input="qualifierComboboxOnChange($event, propID, qualID)"
                  @search-result-click="qualifierComboboxOnSelect($event, propID, idx, qualID)"
                  @blur="resetQualifierOptions(propID, qualID)"
                  style="min-width: 200px;"
                ></cdx-typeahead-search>

                <!-- Qualifier: time -->
                <div v-if="qualState.def.datatype === 'time'" style="display:flex; align-items:center; gap:4px;">
                  {{dayMsg}}
                  <input type="text" :class="'qualDayInput_' + propID + '_' + qualID" size="1" style="padding:4px 6px;">
                  &nbsp;{{monthMsg}}
                  <select :class="'qualMonthInput_' + propID + '_' + qualID" style="padding:4px 6px;">
                    <option v-for="(monthName, monthNum) in monthNames" :value="monthNum">{{monthName}}</option>
                  </select>
                  &nbsp;{{yearMsg}}
                  <input type="text" :class="'qualYearInput_' + propID + '_' + qualID" size="4" style="padding:4px 6px;">
                </div>

                <!-- Qualifier: edtf -->
                <cdx-text-input
                  v-if="qualState.def.datatype === 'edtf'"
                  v-model="qualState.value"
                  :placeholder="qualState.def.label + ': z. B. 1990-03-24'"
                  style="min-width: 160px;"
                  @keydown.enter="submitChanges($event, propID, idx)"
                ></cdx-text-input>

              </div>
            </div>
            <!-- /QUALIFIER-BLOCK -->

          </div>
        </div>

        <!-- Vorhandene Werte anzeigen -->
        <span
          :style="valueTagStyle"
          v-for="(statement, idx) in statementsMap[propID]"
          :key="idx"
          v-html="parseValue(statement)"
        ></span>
      </cdx-field>
    </div>

    <!-- Externe IDs (Schema-Modus) -->
    <cdx-accordion style="background: white; border: 1px solid #ccc; margin-top: 1rem; width: 80%;" v-if="!progress">
      <template #title>{{mw.msg('external-ids-title')}}</template>
      <div :style="externalIDDivStyle">
        <cdx-field style="width: max-content;" v-for="propID in externalIdProperties" :key="propID">
          <template #label>
            <a :href="getWikibasePropertyURL(propID)" target="_blank">
              {{ properties[propID] ? properties[propID].label : propID }}
            </a>
            &nbsp;
            <cdx-button @click="addNewValue(propID)">+</cdx-button>
          </template>
          <div style="width: max-content;" v-for="(statement, idx) in newStatementsMap[propID]" :key="idx" :style="valueInputStyle">
            <cdx-text-input
              v-if="statement.mainsnak.snaktype !== 'novalue'"
              v-model="statement.mainsnak.datavalue.value"
            ></cdx-text-input>
            <cdx-button action="progressive" weight="quiet" @click="submitChanges($event, propID, idx)">{{publishMsg}}</cdx-button>
            <cdx-button
              v-if="!(statement.references || statement.qualifiers) && (statement.mainsnak.snaktype !== 'novalue')"
              action="destructive" weight="quiet"
              @click="deleteValue(idx, propID)">{{cancelMsg}}</cdx-button>
          </div>
          <span :style="valueTagStyle" v-for="(statement, idx) in statementsMap[propID]" :key="idx">
            {{parseValue(statement)}}
          </span>
        </cdx-field>
      </div>
    </cdx-accordion>
  </template>

  <!-- ====== FALLBACK-MODUS: alter Forage-Modus wenn kein Schema ====== -->
  <template v-if="!progress && !showBootstrap && !activePadSchema">
    <template v-for="classID in classIDs">
      <div v-if="classPropertiesMap[classID] && classPropertiesMap[classID]['general'].length > 0" :style="groupDivStyle">
        <h2>{{mw.msg('fields-for-class-title')}} <a :href="getWikibaseURL(classID)" target="_blank">{{classLabels[classID]}}</a></h2>
        <cdx-field style="max-width: max-content;" v-for="propID in classPropertiesMap[classID]['generalSorted']" :key="propID">
          <template #label>
            <a :href="getWikibasePropertyURL(propID)" target="_blank">{{properties[propID] ? properties[propID].label : propID}}</a>
            &nbsp;<cdx-button @click="addNewValue(propID)">+</cdx-button>
          </template>
          <div style="width: max-content;" v-for="(statement, idx) in newStatementsMap[propID]" :key="idx" :style="valueInputStyle">
            <cdx-typeahead-search
              v-if="properties[propID] && properties[propID].datatype === 'wikibase-item' && !(statement.references || statement.qualifiers) && (statement.mainsnak.snaktype !== 'novalue')"
              :initial-input-value="allPropIDLabelsMap[statement.mainsnak.datavalue.value.id]"
              placeholder="Type or choose an option"
              search-results-label="Search results"
              :search-results="autocompleteItems"
              :show-thumbnail="true" :highlight-query="true" :visible-item-limit="5"
              @input="comboboxOnChange" @search-result-click="comboboxOnSelect($event, propID, idx)" @blur="resetOptions"
            ></cdx-typeahead-search>
            <cdx-text-input
              v-if="properties[propID] && (properties[propID].datatype === 'commonsMedia' || properties[propID].datatype === 'string') && !(statement.references || statement.qualifiers) && (statement.mainsnak.snaktype !== 'novalue')"
              v-model="statement.mainsnak.datavalue.value"
            ></cdx-text-input>
            <div v-if="properties[propID] && properties[propID].datatype === 'time'">
              {{dayMsg}} <input type="text" class="dayInput" size="1" style="padding: 6px 8px;">
              &nbsp;{{monthMsg}} <select class="monthInput" style="padding: 6px 8px;"><option v-for="(monthName, monthNum) in monthNames" :value="monthNum">{{monthName}}</option></select>
              &nbsp;{{yearMsg}} <input type="text" class="yearInput" size="4" style="padding: 6px 8px;">
            </div>
            <cdx-button action="progressive" weight="quiet" @click="submitChanges($event, propID, idx)">{{publishMsg}}</cdx-button>
            <cdx-button v-if="!(statement.references || statement.qualifiers) && (statement.mainsnak.snaktype !== 'novalue')" action="destructive" weight="quiet" @click="deleteValue(idx, propID)">{{cancelMsg}}</cdx-button>
          </div>
          <span :style="valueTagStyle" v-for="(statement, idx) in statementsMap[propID]" :key="idx" v-html="parseValue(statement)"></span>
        </cdx-field>
      </div>
    </template>
    <div :style="groupDivStyle" v-if="otherPropertiesMap['general'] && otherPropertiesMap['general'].length > 0">
      <h2>{{mw.msg('other-fields-title')}}</h2>
      <cdx-field style="width: 80%;" v-for="propID in otherPropertiesMap['generalSorted']" :key="propID">
        <template #label>
          <a :href="getWikibasePropertyURL(propID)" target="_blank">{{properties[propID] ? properties[propID].label : propID}}</a>
          &nbsp;<cdx-button @click="addNewValue(propID)">+</cdx-button>
        </template>
        <div style="width: max-content;" v-for="(statement, idx) in newStatementsMap[propID]" :key="idx" :style="valueInputStyle">
          <cdx-typeahead-search
            v-if="properties[propID] && properties[propID].datatype === 'wikibase-item' && !(statement.references || statement.qualifiers) && (statement.mainsnak.snaktype !== 'novalue')"
            :initial-input-value="allPropIDLabelsMap[statement.mainsnak.datavalue.value.id]"
            placeholder="Type or choose an option" search-results-label="Search results"
            :search-results="autocompleteItems" :show-thumbnail="true" :highlight-query="true" :visible-item-limit="5"
            @input="comboboxOnChange" @search-result-click="comboboxOnSelect($event, propID, idx)" @blur="resetOptions"
          ></cdx-typeahead-search>
          <cdx-text-input
            v-if="properties[propID] && (properties[propID].datatype === 'commonsMedia' || properties[propID].datatype === 'string') && !(statement.references || statement.qualifiers) && (statement.mainsnak.snaktype !== 'novalue')"
            v-model="statement.mainsnak.datavalue.value"
          ></cdx-text-input>
          <div v-if="properties[propID] && properties[propID].datatype === 'time'">
            {{dayMsg}} <input type="text" class="dayInput" size="1" style="padding: 6px 8px;">
            &nbsp;{{monthMsg}} <select class="monthInput" style="padding: 6px 8px;"><option v-for="(monthName, monthNum) in monthNames" :value="monthNum">{{monthName}}</option></select>
            &nbsp;{{yearMsg}} <input type="text" class="yearInput" size="4" style="padding: 6px 8px;">
          </div>
          <cdx-button action="progressive" weight="quiet" @click="submitChanges($event, propID, idx)">{{publishMsg}}</cdx-button>
          <cdx-button v-if="!(statement.references || statement.qualifiers) && (statement.mainsnak.snaktype !== 'novalue')" action="destructive" weight="quiet" @click="deleteValue(idx, propID)">{{cancelMsg}}</cdx-button>
        </div>
        <span :style="valueTagStyle" v-for="(statement, idx) in statementsMap[propID]" :key="idx" v-html="parseValue(statement)"></span>
      </cdx-field>
    </div>
    <br>
    <cdx-accordion style="background: white; border: 1px solid #ccc;" v-if="!progress">
      <template #title>{{mw.msg('external-ids-title')}}</template>
      <template v-for="classID in classIDs">
        <div :style="externalIDDivStyle" v-if="classPropertiesMap[classID] && classPropertiesMap[classID]['external'].length > 0">
          <h2>{{mw.msg('ids-for-class-title')}} <a :href="getWikibaseURL(classID)" target="_blank">{{classLabels[classID]}}</a></h2>
          <cdx-field style="width: max-content;" v-for="propID in classPropertiesMap[classID]['externalSorted']" :key="propID">
            <template #label>
              <a :href="getWikibasePropertyURL(propID)" target="_blank">{{properties[propID] ? properties[propID].label : propID}}</a>
              &nbsp;<cdx-button @click="addNewValue(propID)">+</cdx-button>
            </template>
            <div style="width: max-content;" v-for="(statement, idx) in newStatementsMap[propID]" :key="idx" :style="valueInputStyle">
              <cdx-text-input v-if="statement.mainsnak.snaktype !== 'novalue'" v-model="statement.mainsnak.datavalue.value"></cdx-text-input>
              <cdx-button action="progressive" weight="quiet" @click="submitChanges($event, propID, idx)">{{publishMsg}}</cdx-button>
              <cdx-button v-if="!(statement.references || statement.qualifiers) && (statement.mainsnak.snaktype !== 'novalue')" action="destructive" weight="quiet" @click="deleteValue(idx, propID)">{{cancelMsg}}</cdx-button>
            </div>
            <span :style="valueTagStyle" v-for="(statement, idx) in statementsMap[propID]" :key="idx">{{parseValue(statement)}}</span>
          </cdx-field>
        </div>
      </template>
      <div :style="externalIDDivStyle" v-if="otherPropertiesMap['external'] && otherPropertiesMap['external'].length > 0">
        <h2>{{mw.msg('other-ids-title')}}</h2>
        <cdx-field style="width: max-content;" v-for="propID in otherPropertiesMap['externalSorted']" :key="propID">
          <template #label>
            <a :href="getWikibasePropertyURL(propID)" target="_blank">{{properties[propID] ? properties[propID].label : propID}}</a>
            &nbsp;<cdx-button @click="addNewValue(propID)">+</cdx-button>
          </template>
          <div style="width: max-content;" v-for="(statement, idx) in newStatementsMap[propID]" :key="idx" :style="valueInputStyle">
            <cdx-text-input v-if="statement.mainsnak.snaktype !== 'novalue'" v-model="statement.mainsnak.datavalue.value"></cdx-text-input>
            <cdx-button action="progressive" weight="quiet" @click="submitChanges($event, propID, idx)">{{publishMsg}}</cdx-button>
            <cdx-button v-if="!(statement.references || statement.qualifiers) && (statement.mainsnak.snaktype !== 'novalue')" action="destructive" weight="quiet" @click="deleteValue(idx, propID)">{{cancelMsg}}</cdx-button>
          </div>
          <span :style="valueTagStyle" v-for="(statement, idx) in statementsMap[propID]" :key="idx">{{parseValue(statement)}}</span>
        </cdx-field>
      </div>
    </cdx-accordion>
  </template>

</div>
        `,

        // ------------------------------------------------------------------
        // Computed
        // ------------------------------------------------------------------
        computed: {
          externalIdProperties: function () {
            var that = this;
            return Object.keys(that.properties).filter(function (pID) {
              return that.properties[pID] && that.properties[pID].datatype === "external-id";
            });
          },

          availableSchemas: function () {
            var result = {};
            Object.keys(WIKIBASE_SCHEMAS).forEach(function (qid) {
              if (WIKIBASE_SCHEMAS[qid].bootstrap && WIKIBASE_SCHEMAS[qid].bootstrap.length > 0) {
                result[qid] = WIKIBASE_SCHEMAS[qid];
              }
            });
            return result;
          },

          requiredProps: function () {
            if (!this.activePadSchema || !this.activePadSchema.required) return [];
            return this.activePadSchema.required;
          },

          missingRequiredFields: function () {
            var that = this;
            if (!that.activePadSchema || !that.activePadSchema.required) return [];
            return that.activePadSchema.required.filter(function (pID) {
              var hasStored  = that.statementsMap[pID]    && that.statementsMap[pID].length > 0;
              var hasPending = that.newStatementsMap[pID] && that.newStatementsMap[pID].length > 0;
              return !hasStored && !hasPending;
            }).map(function (pID) {
              return (that.properties[pID] ? that.properties[pID].label : pID);
            });
          }
        },

        // ------------------------------------------------------------------
        // Mounted
        // ------------------------------------------------------------------
        mounted() {
          $("title").prepend(mw.msg("menu-title") + ": ");
          $(".wikibase-title").prepend(mw.msg("menu-title") + ":");

          // Enter-Taste auf nativen Inputs (yearInput) →
          // nächsten "Veröffentlichen"-Button im selben Werte-Block klicken
          $(document).on("keydown", ".yearInput", function (e) {
            if (e.key === "Enter") {
              e.preventDefault();
              $(this).closest("[style*='flex-direction']").find("button.cdx-button--action-progressive").first().trigger("click");
            }
          });

          const itemID = mw.config.get("wbEntityId");
          var api = new mw.Api();
          var requestParams = {
            action: "wbgetentities", ids: itemID, props: "claims", format: "json",
          };

          var result = api.get(requestParams);
          const that = this;
          result.done(async function (res) {
            var entity = res.entities[itemID];

            if (Object.keys(entity.claims || {}).length === 0) {
              that.showBootstrap = true;
              that.progress = false;
              return;
            }

            parentClassIDs = getParentClassIDs(entity);

            // PAD-Schema erkennen
            activePadSchema = detectPadSchema(parentClassIDs);
            that.activePadSchema = activePadSchema;

            await getParentClasses(parentClassIDs);
            that.classIDs = classIDList;
            await retrieveClassProperties(api, requestParams, classIDList, entity);
            that.classLabels = allClassLabels;
            await fetchPropertyLabels(api, allProperties);

            // Im Schema-Modus: alle konfigurierten Properties nachladen
            // deren Labels noch nicht bekannt sind (weil sie noch keinen Wert im Item haben)
            if (activePadSchema && activePadSchema.groups) {
              var knownIDs = new Set(allPropertyLabels.map(function (o) { return o.id; }));
              var missingIDs = [];
              activePadSchema.groups.forEach(function (group) {
                group.properties.forEach(function (pID) {
                  if (!knownIDs.has(pID)) missingIDs.push(pID);
                });
              });
              // Qualifier-Properties ebenfalls nachladen
              if (activePadSchema.qualifiers) {
                Object.keys(activePadSchema.qualifiers).forEach(function (pID) {
                  if (!knownIDs.has(pID)) missingIDs.push(pID);
                  activePadSchema.qualifiers[pID].forEach(function (q) {
                    if (!knownIDs.has(q.id)) missingIDs.push(q.id);
                  });
                });
              }
              if (missingIDs.length > 0) {
                // In Batches von max. 50 nachladen
                var batches = [];
                for (var i = 0; i < missingIDs.length; i += 50) {
                  batches.push(missingIDs.slice(i, i + 50));
                }
                for (var b = 0; b < batches.length; b++) {
                  var res = await api.get({
                    action: "wbgetentities",
                    ids: batches[b],
                    props: "labels|datatype",
                    languages: lang + "|en",
                    format: "json"
                  });
                  Object.values(res.entities).forEach(function (ent) {
                    var label;
                    if (ent.labels && ent.labels[lang]) label = ent.labels[lang].value;
                    else if (ent.labels && ent.labels["en"]) label = ent.labels["en"].value;
                    else label = ent.id;
                    propertyDatatypeMap[ent.id] = ent.datatype;
                    allPropertyLabels.push({ id: ent.id, datatype: ent.datatype, label: label });
                  });
                }
              }
            }

            that.properties = {};
            allPropertyLabels.forEach(function (obj) {
              that.properties[obj.id] = obj;
            });

            // Alle Property-IDs (general + external) sammeln
            var allPropIDs = allPropertyLabels.map(function (o) { return o.id; });
            var externalPropIDs = allPropertyLabels
              .filter(function (o) { return o.datatype === "external-id"; })
              .map(function (o) { return o.id; });

            if (activePadSchema) {
              // ----- Schema-Modus -----
              that.schemaGroups = buildSchemaGroups(activePadSchema, allPropIDs, externalPropIDs);
            } else {
              // ----- Fallback-Modus (alter Forage-Code) -----
              var newClassPropertiesMap = {};
              var newOtherPropertiesMap = { general: [], external: [] };
              const allGenerals = allPropIDs.filter(function (id) { return !externalPropIDs.includes(id); });
              const allExternals = externalPropIDs;

              classIDList.forEach(function (classID) {
                if (propertiesForClasses[classID]) {
                  newClassPropertiesMap[classID] = {};
                  newClassPropertiesMap[classID]["general"] = propertiesForClasses[classID].filter(function (pID) { return allGenerals.includes(pID); });
                  newClassPropertiesMap[classID]["external"] = propertiesForClasses[classID].filter(function (pID) { return allExternals.includes(pID); });
                  let ga = Object.values(newClassPropertiesMap[classID]["general"]);
                  newClassPropertiesMap[classID]["generalSorted"] = ga.sort((a, b) => that.properties[a].label.toLowerCase() > that.properties[b].label.toLowerCase() ? 1 : -1);
                  let ea = Object.values(newClassPropertiesMap[classID]["external"]);
                  newClassPropertiesMap[classID]["externalSorted"] = ea.sort((a, b) => that.properties[a].label.toLowerCase() > that.properties[b].label.toLowerCase() ? 1 : -1);
                }
              });

              var existingGeneralPropertyIDs = [];
              var existingExternalPropertyIDs = [];
              Object.keys(newClassPropertiesMap).forEach(function (classID) {
                existingGeneralPropertyIDs = existingGeneralPropertyIDs.concat(newClassPropertiesMap[classID]["general"]);
                existingExternalPropertyIDs = existingExternalPropertyIDs.concat(newClassPropertiesMap[classID]["external"]);
              });
              allPropertyLabels.forEach(function (prop) {
                if (prop.datatype !== "external-id") {
                  if (!existingGeneralPropertyIDs.includes(prop.id)) newOtherPropertiesMap["general"].push(prop.id);
                } else {
                  if (!existingExternalPropertyIDs.includes(prop.id)) newOtherPropertiesMap["external"].push(prop.id);
                }
              });
              let ga2 = Object.values(newOtherPropertiesMap["general"]);
              newOtherPropertiesMap["generalSorted"] = ga2.sort((a, b) => that.properties[a].label.toLowerCase() > that.properties[b].label.toLowerCase() ? 1 : -1);
              let ea2 = Object.values(newOtherPropertiesMap["external"]);
              newOtherPropertiesMap["externalSorted"] = ea2.sort((a, b) => that.properties[a].label.toLowerCase() > that.properties[b].label.toLowerCase() ? 1 : -1);

              that.classPropertiesMap = newClassPropertiesMap;
              that.otherPropertiesMap = newOtherPropertiesMap;
            }

            var allQualifiers = new Set();
            var allEntityIDs = new Set();
            Object.keys(statementsMap).forEach(function (propID) {
              statementsMap[propID].forEach(function (statement) {
                if (statement.qualifiers) {
                  Object.keys(statement.qualifiers).forEach(function (qualifierID) { allQualifiers.add(qualifierID); });
                }
                if (statement.mainsnak.datatype === "wikibase-item" &&
                    statement.mainsnak.snaktype !== "novalue" &&
                    statement.mainsnak.snaktype !== "somevalue") {
                  allEntityIDs.add(statement.mainsnak.datavalue.value.id);
                }
              });
            });
            var allIDs = Array.from(allQualifiers).concat(Array.from(allEntityIDs));
            await fetchEntityAndQualifierLabels(api, allIDs);

            that.statementsMap = statementsMap;
            that.newStatementsMap = newStatementsMap;
            that.progress = false;
          });
        },

        updated() { replaceUnitIDsWithLabels(); },

        // ------------------------------------------------------------------
        // Methods
        // ------------------------------------------------------------------
        methods: {
          getWikibaseURL: function (id) {
            var wbrepo = mw.config.get("wbRepo");
            return wbrepo.url + wbrepo.articlePath.replace("$1", id);
          },
          getWikibasePropertyURL: function (propID) {
            return this.getWikibaseURL("Property:" + propID);
          },


          /** Setzt Bootstrap-Claims fuer die gewaehlte Klasse und laedt die Seite neu. */
          bootstrapEntity: async function (qid) {
            var schema = WIKIBASE_SCHEMAS[qid];
            if (!schema || !schema.bootstrap) return;
            this.bootstrapLoading = true;
            var api = new mw.Api();
            var entityID = mw.config.get("wbEntityId");
            var tokenResponse = await api.get({ action: "query", meta: "tokens", format: "json" });
            var csrfToken = tokenResponse.query.tokens.csrftoken;
            for (var i = 0; i < schema.bootstrap.length; i++) {
              var claim = schema.bootstrap[i];
              var dataValue = {
                "entity-type": "item",
                "numeric-id": parseInt(claim.value.replace("Q", "")),
                id: claim.value
              };
              try {
                await api.post({
                  action: "wbcreateclaim", format: "json",
                  entity: entityID, snaktype: "value",
                  property: claim.property,
                  value: JSON.stringify(dataValue),
                  token: csrfToken
                });
              } catch (err) {
                console.error("Bootstrap claim fehlgeschlagen:", claim, err);
              }
            }
            window.location.reload();
          },

          /** Gibt Qualifier-Autocomplete-Ergebnisse fuer eine bestimmte Kombination zurueck */
          getQualifierAutocomplete: function (propID, qualID) {
            var key = propID + "_" + qualID;
            return this.qualifierAutocompleteItems[key] || [];
          },

          /** Öffnet die API-Suche für einen Qualifier vom Typ wikibase-item */
          qualifierComboboxOnChange: function (value, propID, qualID) {
            var that = this;
            var key = propID + "_" + qualID;
            that.qualifierAutocompleteItems[key] = [];
            that.$forceUpdate();
            var api = new mw.Api();
            var requestParams = {
              action: "wbsearchentities", format: "json",
              search: value, language: lang, type: "item", limit: 20,
            };
            api.get(requestParams).done(function (data) {
              that.qualifierAutocompleteItems[key] =
                data.search && data.search.length > 0 ? adaptApiResponse(data.search) : [];
              that.$forceUpdate();
            });
          },

          /** Speichert den ausgewählten Qualifier-Item-Wert im Statement */
          qualifierComboboxOnSelect: function (event, propID, statementIdx, qualID) {
            var statement = this.newStatementsMap[propID][statementIdx];
            if (statement._padQualifiers && statement._padQualifiers[qualID]) {
              statement._padQualifiers[qualID].value = {
                "entity-type": "item",
                "numeric-id": null,
                id: event.searchResult.value,
              };
              statement._padQualifiers[qualID].label = event.searchResult.label;
            }
          },

          resetQualifierOptions: function (propID, qualID) {
            var key = propID + "_" + qualID;
            this.qualifierAutocompleteItems[key] = [];
            this.$forceUpdate();
          },

          addNewValue: function (propID) {
            const propDataType = propertyDatatypeMap[propID];
            var statement = createEmptyStatement(propID, propDataType, activePadSchema);
            if (newStatementsMap[propID]) {
              this.newStatementsMap[propID].unshift(statement);
            } else {
              this.newStatementsMap[propID] = [statement];
            }
          },

          comboboxOnChange: function (value) {
            this.autocompleteItems = [];
            this.$forceUpdate();
            var api = new mw.Api();
            var requestParams = {
              action: "wbsearchentities", format: "json",
              search: value, language: lang, type: "item", limit: 20,
            };
            var that = this;
            api.get(requestParams).done(function (data) {
              that.autocompleteItems = data.search && data.search.length > 0 ? adaptApiResponse(data.search) : [];
              that.$forceUpdate();
            });
          },

          comboboxOnSelect: function (event, propID, statementIdx) {
            const selectedEntityId = event.searchResult.value;
            this.newStatementsMap[propID][statementIdx].mainsnak.datavalue.value = {
              "entity-type": "item", "numeric-id": statementIdx,
              id: selectedEntityId, label: event.searchResult.label,
            };
          },

          unitComboboxOnSelect: function (event, propID, statementIdx) {
            const unitEntityURL = "http://www.wikidata.org/entity/" + event.searchResult.value;
            this.newStatementsMap[propID][statementIdx].mainsnak.datavalue.value.unit = unitEntityURL;
          },

          resetOptions: function (event) {
            this.autocompleteItems = [];
            this.$forceUpdate();
          },

          submitChanges: async function (event, propID, statementIdx) {
            event.target.disabled = true;
            const entityID = mw.config.get("wbEntityId");
            var api = new mw.Api();

            // CSRF-Token holen
            var tokenResponse = await api.get({ action: "query", meta: "tokens", format: "json" });
            const csrfToken = tokenResponse.query.tokens.csrftoken;

            let statement = this.newStatementsMap[propID][statementIdx];
            let dataValue = Vue.toRaw(statement.mainsnak.datavalue.value);
            let dataType = statement.mainsnak.datatype;

            // Zeit-Wert aufbauen
            if (dataType == "time") {
              let yearVal = $(event.target).closest("[style*='flex-direction']").find(".yearInput").val();
              if (!isNaN(parseInt(yearVal.charAt(0)))) yearVal = "+" + yearVal;
              dataValue.precision = 9;
              let monthVal = $(event.target).closest("[style*='flex-direction']").find(".monthInput").val();
              if (monthVal > 0) dataValue.precision = 10;
              if (monthVal.length < 2) monthVal = "0" + monthVal;
              let dayVal = $(event.target).closest("[style*='flex-direction']").find(".dayInput").val();
              if (dayVal == "") { dayVal = "00"; } else { dataValue.precision = 11; }
              if (dayVal.length < 2) dayVal = "0" + dayVal;
              dataValue.time = yearVal + "-" + monthVal + "-" + dayVal + "T00:00:00Z";
              dataValue.timezone = 0; dataValue.before = 0; dataValue.after = 0;
              dataValue.calendarmodel = "http://www.wikidata.org/entity/Q1985727";
            } else if (dataType == "monolingualtext") {
              dataValue.text = $(event.target).closest("[style*='flex-direction']").find(".textInput").val();
              dataValue.language = $(event.target).closest("[style*='flex-direction']").find(".langInput").val();
            } else if (dataType == "globe-coordinate") {
              dataValue.latitude = $(event.target).closest("[style*='flex-direction']").find(".latInput").val();
              dataValue.longitude = $(event.target).closest("[style*='flex-direction']").find(".lonInput").val();
              dataValue.altitude = null;
              dataValue.globe = "http://www.wikidata.org/entity/Q2";
              dataValue.precision = 1e-8;
            }

            const dataLabel = dataValue.label ? dataValue.label : null;
            const dataID = dataValue.id ? dataValue.id : null;

            // Claim erstellen
            var claimResponse = await api.post({
              action: "wbcreateclaim", format: "json",
              entity: entityID, snaktype: "value",
              property: propID, value: JSON.stringify(dataValue),
              token: csrfToken,
            });

            event.target.disabled = false;

            if (claimResponse.success) {
              const newClaimGUID = claimResponse.claim.id;

              if (dataLabel !== null && dataID !== null) {
                this.allPropIDLabelsMap[dataID] = dataLabel;
              }

              // ----- Qualifier speichern (NEU) -----
              var padQuals = Vue.toRaw(statement._padQualifiers);
              if (padQuals) {
                for (var qualID in padQuals) {
                  var qualState = padQuals[qualID];
                  var qualValue = qualState.value;
                  var qualDatatype = qualState.def.datatype;
                  var hasValue = false;

                  if (qualDatatype === "string" && qualValue && qualValue.trim() !== "") {
                    hasValue = true;
                  } else if (qualDatatype === "edtf" && qualValue && qualValue.trim() !== "") {
                    hasValue = true;  // EDTF: einfacher String, direkt verwendbar
                  } else if (qualDatatype === "wikibase-item" && qualValue && qualValue.id) {
                    hasValue = true;
                  } else if (qualDatatype === "time") {
                    // Zeit aus DOM lesen
                    var yearVal = $("." + "qualYearInput_" + propID + "_" + qualID).first().val();
                    if (yearVal && yearVal.trim() !== "") {
                      if (!isNaN(parseInt(yearVal.charAt(0)))) yearVal = "+" + yearVal;
                      var monthVal = $("." + "qualMonthInput_" + propID + "_" + qualID).first().val();
                      var dayVal = $("." + "qualDayInput_" + propID + "_" + qualID).first().val();
                      if (!monthVal || monthVal == "0") monthVal = "00";
                      if (monthVal.length < 2) monthVal = "0" + monthVal;
                      if (!dayVal || dayVal.trim() === "") dayVal = "00";
                      if (dayVal.length < 2) dayVal = "0" + dayVal;
                      qualValue = {
                        time: yearVal + "-" + monthVal + "-" + dayVal + "T00:00:00Z",
                        precision: dayVal !== "00" ? 11 : (monthVal !== "00" ? 10 : 9),
                        timezone: 0, before: 0, after: 0,
                        calendarmodel: "http://www.wikidata.org/entity/Q1985727",
                      };
                      hasValue = true;
                    }
                  }

                  if (hasValue) {
                    try {
                      await api.post({
                        action: "wbsetqualifier", format: "json",
                        claim: newClaimGUID,
                        property: qualID,
                        snaktype: "value",
                        value: JSON.stringify(qualValue),
                        token: csrfToken,
                      });
                    } catch (qualErr) {
                      console.error("Qualifier konnte nicht gespeichert werden:", qualID, qualErr);
                    }
                  }
                }
              }
              // ----- /Qualifier -----

              if (this.statementsMap[propID] == undefined) {
                this.statementsMap[propID] = [claimResponse.claim];
              } else {
                this.statementsMap[propID].push(claimResponse.claim);
              }
              this.newStatementsMap[propID].splice(statementIdx, 1);
              this.$forceUpdate();
              this.message.state = "success";
              this.message.text = "Erfolgreich gespeichert";
              this.message.show = true;
            } else if (claimResponse.error) {
              console.error(claimResponse.error.code);
              this.message.state = "error";
              this.message.text = "Fehler beim Speichern: " + claimResponse.error.code;
              this.message.show = true;
            }
          },
        },
      })
        .component("cdx-button", Codex.CdxButton)
        .component("cdx-typeahead-search", Codex.CdxTypeaheadSearch)
        .component("cdx-field", Codex.CdxField)
        .component("cdx-progress-bar", Codex.CdxProgressBar)
        .component("cdx-text-input", Codex.CdxTextInput)
        .component("cdx-accordion", Codex.CdxAccordion)
        .component("cdx-message", Codex.CdxMessage)
        .mount("#mw-content-text");
    }
  }
});
