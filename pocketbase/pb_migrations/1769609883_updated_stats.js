/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2617366849")

  // add field
  collection.fields.addAt(1, new Field({
    "hidden": false,
    "id": "number39224934",
    "max": null,
    "min": null,
    "name": "totalVisitors",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "number1849452185",
    "max": null,
    "min": null,
    "name": "totalClicks",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "number2076035367",
    "max": null,
    "min": null,
    "name": "totalConversions",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "number2334161762",
    "max": null,
    "min": null,
    "name": "conversionRate",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "number3910233221",
    "max": null,
    "min": null,
    "name": "revenue",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2617366849")

  // remove field
  collection.fields.removeById("number39224934")

  // remove field
  collection.fields.removeById("number1849452185")

  // remove field
  collection.fields.removeById("number2076035367")

  // remove field
  collection.fields.removeById("number2334161762")

  // remove field
  collection.fields.removeById("number3910233221")

  return app.save(collection)
})
