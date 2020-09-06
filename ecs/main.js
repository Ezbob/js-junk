'use strict';

let entityIdGenerator = new class {
  constructor() {
    this._id = 0;
  }

  get next() {
    return this._id++;
  }
}

let componentIdGenerator = new class {
  constructor() {
    this._id = 0;
  }

  get next() {
    return this._id++;
  }
}

class Entity {
  constructor(id, ...args) {
    this.components = new Map();
    this.id = id;
    for (let c of args) {
      this.components.set(c.cid, c);
    }
  }

  getComponentById(componentId) {
    return this.components.get(componentId);
  }

  hasComponentId(componentId) {
    return this.components.has(componentId);
  }

  removeComponentById(componentId) {
    this.components.remove(componentId);
  }

  addComponent(componentInstance) {
    this.components.set(componentInstance.cid, componentInstance)
  }

  get length() {
    return this.components.size
  }
};

class PositionComponent {
  constructor(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  get cid() {
    return PositionComponent.cid;
  }
};

PositionComponent.cid = componentIdGenerator.next;

class VelocityComponent {
  constructor(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  get cid() {
    return VelocityComponent.cid;
  }
};

VelocityComponent.cid = componentIdGenerator.next;

class NamedComponent {
  constructor(name) {
    this.name = name;
  }

  get cid() {
    return NamedComponent.cid;
  }
};

NamedComponent.cid = componentIdGenerator.next;

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

      let shouldAdd = true;
      for (let c of componentList) {
        shouldAdd = shouldAdd && entity.components.has(c.cid);
      }

      if (shouldAdd) {
        results.push(entity)
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
      let pc = entity.getComponentById(PositionComponent.cid);
      let vc = entity.getComponentById(VelocityComponent.cid);
      pc.x += vc.x * dt;
      pc.y += vc.y * dt;
    }
  }
};


(function main() {
  let physical = new PhysicalSystem()


  entities.newEntity(new PositionComponent(), new VelocityComponent(1, 1));
  entities.newEntity(new PositionComponent());

  console.log(
      entities.getEntitiesByComponents(PositionComponent, VelocityComponent))

  console.log(entities.getEntitiesByComponents(PositionComponent))

  for (let e of entities.getEntitiesByComponents(
           PositionComponent, VelocityComponent)) {
    let pc = e.getComponentById(PositionComponent.cid);
    let vc = e.getComponentById(VelocityComponent.cid);
    console.log("components", pc, vc)
  }


  physical.updateVelocities();
  for (let e of entities) {
    console.log('->', e)
  }
  
  console.log(entities.length)
})();
