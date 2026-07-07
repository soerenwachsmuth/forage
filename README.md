# Forage

## Overview

The standard Wikidata/Wikibase editing interface is comprehensive, but not that user-friendly. When looking at a page, it is difficult to know any of the following:
- Which information that would be expected for this type of entity is missing
- The right property to use for each such piece of information (for example, "country" vs. "country of origin")
- Conversely, which properties found on this page do ''not'' belong, and should probably be removed, or replaced

Forage is a user script that provides an additional editing interface that makes editing easier, by showing the expected properties for a page (based on its "instance of" values), and providing simple inputs to let users add values for any such property.

It should be noted that Forage is meant to _complement_, not replace, the existing Wikidata/Wikibase editing interface. There are many types of editing that can only be done with the standard interface, and not with Forage. Forage, for example, cannot add qualifiers or references for property values. Also, Forage does not allow for editing or removing existing data - only for adding new data. The fact that it is add-only was a design decision done on purpose, to make Forage a "safer" editing environment. Editing or removing data should often involve looking at the page history (and doing a revert), modifying references, etc.: these are best done through the main editing interface, not a simplified one.

## Forage Extended

**Forage Extended** is a drop-in extension of Forage developed for custom Wikibase instances. It retains all original Forage functionality and adds the following features:

- **Schema-based form layout** — properties are grouped and ordered per entity type via a configuration object, rather than shown alphabetically by class
- **Bootstrap flow** — opening "Daten erfassen" on a blank item shows a class-selection screen; clicking a class automatically sets the required "instance of" (or equivalent) claims and reloads the form
- **Qualifier support** — configurable qualifier inputs appear directly beneath their parent property; qualifier-only properties are hidden from the standalone field list
- **Required-field validation** — fields marked as required are shown with a red asterisk and listed in a warning banner until a value has been saved
- **EDTF date support** — properties with datatype `edtf` are handled with a plain text input alongside standard `time` properties
- **Enter-to-submit** — pressing Enter in any text input submits that field
- **Entity type heading** — the active schema label is shown above the form so the data entry context is always visible

Forage Extended was developed by Sören Wachsmuth, based on the original Forage script.

## Installation

To install Forage, just add the following line to the common.js subpage under your user page on Wikidata, i.e. wikidata.org/wiki/User:_Your username here_/common.js:
```
importScript('User:Techwizzie/forage.js');
```

### Installing Forage Extended

To use Forage Extended on your own Wikibase instance, copy `forage-extended.js` to a page on your wiki (for example `MediaWiki:Gadget-ForageExtended.js` or a user script page), then load it from your `common.js`:

```javascript
importScript('MediaWiki:Gadget-ForageExtended.js');
```

Forage Extended does not depend on the original Forage script — it is self-contained. Do not load both at the same time.

## Credits

Forage was created by [Sanjay Thiyagarajan](https://github.com/sanjay-thiyagarajan), [Naresh Kumar Babu](https://github.com/naresh-kumar-babu) and [Yaron Koren](https://github.com/yaronkoren), based on a design by Yaron. Thanks also to [Laurence Parry](https://github.com/greenreaper) for providing helpful initial feedback.

Forage Extended was developed by Sören Wachsmuth.

## License

Forage is open-source software that uses the [MIT license](https://opensource.org/license/mit).

## Usage

Once you install Forage, on every page in the main namespace you will see a new tab, "Add property values", that looks like this:

!["Add property values" tab](https://github.com/sanjay-thiyagarajan/forage/blob/main/images/Forage-tab-display.png)

Clicking on it will show a display that looks like this:

![Forage main display](https://github.com/sanjay-thiyagarajan/forage/blob/main/images/Forage-main-display.png)

Properties are shown in alphabetical order, by "class". This is done by querying three different Wikidata/Wikibase properties:
- "[instance of](https://www.wikidata.org/wiki/Property:P31)" is used to get the main class, or classes, of this page.
- "[subclass of](https://www.wikidata.org/wiki/Property:P279)" is used to get all the "superclasses" of this initial set of classes - since this page can presumably be defined to belong to those classes as well.
- "[properties for this type](https://www.wikidata.org/wiki/Property:P1963)" is used to get all the properties that are to be expected for any specific class. (If the same property is defined for more than one of those classes, it will only be displayed the first time it is encountered.)

Note that "instance of" cannot be set by the Forage interface - this property, at least, has to be set before you can edit a new page.

Scrolling further down the interface, you can see properties for the additional classes:

![Properties for additional classes](https://github.com/sanjay-thiyagarajan/forage/blob/main/images/Forage-additional-classes.png)

If the page has any properties defined for it that are not specified for any of these classes, they will show up below all the classes, in a grouping titled "Other fields":

![Other fields display](https://github.com/sanjay-thiyagarajan/forage/blob/main/images/Forage-other-fields.png)

The class and field listings shown above include all properties except for the so-called "identifier" or "ID" properties. These are displayed separately, in a section at the bottom of the page that is minimized by default. If you click on "External IDs", you will see all of these additional fields, again split up by class:

![External IDs listing](https://github.com/sanjay-thiyagarajan/forage/blob/main/images/Forage-external-IDs.png)

To add a value for a property of any type, click on the "+" next to that property name; this will add a display like the following, though the exact input will depend on the property type:

![Forage combobox input](https://raw.githubusercontent.com/sanjay-thiyagarajan/forage/main/images/Forage-combobox-input.png)

Clicking "publish" will add the value to the page, and the display:

![Post-save display](https://github.com/sanjay-thiyagarajan/forage/blob/main/images/Forage-post-save.png)

After adding values, you can then use the main Wikidata/Wikibase display to add additional information; every "claim" should ideally have a reference, and some should have qualifiers as well:

![Adding additional information via main interface](https://raw.githubusercontent.com/sanjay-thiyagarajan/forage/main/images/Forage-additional-info.png)

## Translation

Forage defines various internationalization (i18n) messages, which can be seen near the top of the forage.js file. Currently these are defined only for English, but patches are welcome to add translations into other languages. Eventually, if possible, it would be good if the translations could be split off into separate JSON files for each language, in the standard MediaWiki style, so that translations could be provided by the community at translatewiki.net.

## Usage outside Wikidata

In theory, Forage can be used in any Wikibase installation, not just Wikidata, as long as the installation contains (and uses) properties equivalent to the following: "instance of", "subclass of", "properties for this type", "point in time", "start time" and "end time". If it does, then using Forage is just a matter of copying over the script into some local page on the Wikibase-using wiki, then changing the values of the constants for these six properties (e.g., `instanceOfItemID`), from their current value (e.g., "P31") to their local property IDs on that wiki.

---

## Configuring Forage Extended

Forage Extended is controlled by a single configuration object called `WIKIBASE_SCHEMAS` near the top of the script. Each key in that object is a Q-item ID (e.g. `"Q3"`) that identifies an entity type. When a user opens "Daten erfassen" on an item, the script reads the item's claims, finds the matching schema, and renders the corresponding grouped form.

### Adapting the script to your Wikibase

Before adding your schemas, adjust the following constants at the top of the main script section to match your Wikibase property IDs:

| Constant | Default | Meaning |
|---|---|---|
| `instanceOfItemID` | `"P1"` | instance of |
| `propertiesForTypeID` | `"P133"` | properties for this type |
| `subClassOfID` | `"P2"` | subclass of |
| `pointInTimeID` | `"P119"` | point in time (for qualifier display) |
| `startTimeID` | `"P10"` | start time (for qualifier display) |
| `endTimeID` | `"P11"` | end time (for qualifier display) |

### Schema object reference

```javascript
"Q3": {
  // Required
  label: "Performance Work",

  // Shown in the bootstrap class-picker
  description: "Theatre piece, opera, dance piece, etc.",

  // Optional — which property to check for this Q-ID.
  // Omit to use the default instanceOfItemID (P1).
  // Use this when your Wikibase classifies items via a different property.
  property: "P70",

  // Claims to set automatically on a blank item.
  // The bootstrap screen appears when an item has no claims yet.
  // Each entry creates one claim via wbcreateclaim before reloading the form.
  bootstrap: [
    { property: "P1",  value: "Q6"  },
    { property: "P70", value: "Q3"  }
  ],

  // Property IDs that must be filled in.
  // Shown with a red * and listed in a warning banner until saved.
  required: ["P47", "P38"],

  // Ordered form sections. Each section becomes a blue card with a heading.
  // All properties listed here are shown regardless of whether the item
  // already has a value for them — useful for newly created items.
  // Properties not listed in any group appear in an auto-generated
  // "Other fields" section at the bottom.
  groups: [
    {
      label: "Basic data",
      properties: ["P14", "P92", "P47"]
    },
    {
      label: "Related works",
      properties: ["P5", "P6", "P91"]
    }
  ],

  // Per-property qualifier definitions.
  // Each key is a property ID that receives qualifier inputs.
  // Qualifier-only property IDs are automatically hidden from the
  // standalone field list so they only appear beneath their parent property.
  qualifiers: {
    "P39": [
      { id: "P4",   label: "Role name",     datatype: "string"       },
      { id: "P102", label: "Cast type",     datatype: "wikibase-item" }
    ],
    "P80": [
      { id: "P10",  label: "Start",         datatype: "edtf"         },
      { id: "P11",  label: "End",           datatype: "edtf"         },
      { id: "P50",  label: "Institution",   datatype: "wikibase-item" }
    ]
  }
}
```

**Supported qualifier datatypes:** `string`, `wikibase-item`, `time`, `edtf`, `quantity`

### Minimal example

The following is the smallest possible schema that enables the grouped form for items with `P1 = Q99`:

```javascript
var WIKIBASE_SCHEMAS = {
  "Q99": {
    label: "My Entity Type",
    description: "A short description shown in the class picker.",
    bootstrap: [ { property: "P1", value: "Q99" } ],
    required: [],
    groups: [
      { label: "Basic data",  properties: ["P10", "P20", "P30"] },
      { label: "Relations",   properties: ["P40", "P50"] }
    ],
    qualifiers: {}
  }
};
```

### Adding a new entity type

1. Open `forage-extended.js` and find the `WIKIBASE_SCHEMAS` object.
2. Add a new entry before the closing `};`, following the structure above.
3. Set the Q-item key to the Q-ID of the "instance of" value (or whichever value the `property` field points to) for that entity type.
4. Define your groups, required fields, qualifiers, and bootstrap claims.
5. Save and reload — the new type will appear in the bootstrap picker on blank items and the grouped form on existing items of that type.

### EDTF dates

If your Wikibase uses the `edtf` datatype for date properties (instead of the standard Wikibase `time` type), set `datatype: "edtf"` in your qualifier definitions and the script will render a plain text input. Valid EDTF strings include `1990`, `1990-03`, `1990-03-24`, and ranges like `1990/2000`.
