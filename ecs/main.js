'use strict';

let entityIdGenerator = new class {
  constructor() {
    this._id = 0;
  }

  get next() {
    return this._id++;
  }
}

class Entity extends Array {
  constructor(id, ...args) {
    super(...args);
    this.id = id;
  }
};

class PositionComponent {
  constructor(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }
};

class VelocityComponent {
  constructor(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }
};

class NamedComponent {
  constructor(name) {
    this.name = name;
  }
};

class EntitiesManager extends Array {
  newEntity(...components) {
    let entity = new Entity(entityIdGenerator.next, ...components);
    this.push(entity);
    return entity;
  }

  getEntitiesByComponents(...componentList) {
    let results = [];
    for (let entity of this) {
      if (componentList.length > entity.length) {
        continue;  // entity's component list is not a superset
      }
      let componentSet = new Entity(entity.id);
      let cindex = 0;
      for (let componentType of componentList) {
        for (let component of entity) {
          if (component instanceof componentType) {
            componentSet[cindex] = component;  // using cindex guaranties the
                                               // ordering of the components
          }
        }
        cindex += 1;
      }
      if (componentSet.length === componentList.length) {
        results.push(componentSet);  // we are only interested in components
                                     // that have all of the input components
      }
    }
    return results;
  }
};

var entities = new EntitiesManager();

class PhysicalSystem {
  updateVelocities() {
    let dt = 1.0 / 60.0;
    let es =
        entities.getEntitiesByComponents(PositionComponent, VelocityComponent);
    for (let entity of es) {
      let [pc, vc] = entity;
      pc.x += vc.x * dt;
      pc.y += vc.y * dt;
    }
  }
};


(function main() {
  // let physical = new PhysicalSystem()

  entities.newEntity(
      new NamedComponent(), new PositionComponent(),
      new VelocityComponent(2, 3));
  entities.newEntity(new PositionComponent(), new VelocityComponent(1, 1));
  entities.newEntity(new PositionComponent());


  console.log(entities.getEntitiesByComponents(PositionComponent, VelocityComponent))

  console.log(entities.getEntitiesByComponents(PositionComponent))

  for (let e of entities.getEntitiesByComponents(PositionComponent, VelocityComponent)) {
    let [pc, vc] = e;
    console.log(pc, vc)
  }

  
  /*
  physical.updateVelocities();
  for (let e of entities) {
    console.log('->', e)
  }
  */
  console.log(entities.length)
})();
