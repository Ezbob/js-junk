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

  getEntitiesByComponentIds(...componentList) {
    let results = [];
    for (let entity of this) {
      if (componentList.length > entity.components.size) {
        continue;  // entity's component list is not a superset
      }
      if (componentList.every((c => entity.components.has(c)))) {
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
    let es = entities.getEntitiesByComponentIds(
        PositionComponent.cid, VelocityComponent.cid);
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

  let getTime = () => {
    return new Date().getTime() / 1000;
  };

  let nEntities = 100000;
  
  for (let i = 0; i < nEntities; i++) {
    entities.newEntity(new PositionComponent(), new VelocityComponent(1, 1));
    entities.newEntity(new PositionComponent());
  }

  let minTime = 0;
  let maxTime = 0;
  let sumTime = 0;
  let tries = 1000;

  for (let i = 0; i < tries; i++) {
    let timeStart = getTime();
    physical.updateVelocities();
    let timeEnd = getTime() - timeStart;
    if (timeEnd < minTime) minTime = timeEnd;
    if (timeEnd > maxTime) maxTime = timeEnd;
    sumTime += timeEnd;
  }

  let avg = sumTime / tries;
  console.log("--- Physical system stats ---");
  console.log("Entities: ", nEntities, "entities");
  console.log("Elapsed: ", sumTime, "secs");
  console.log('Min: ', minTime, "secs");
  console.log('Max: ', maxTime, "secs");
  console.log('Avg: ', avg, "secs");

})();
