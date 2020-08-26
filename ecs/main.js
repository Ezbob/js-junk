'use strict';

class Entity extends Array {
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

class EntitiesManager extends Array {

  newEntity(...components) {
    this.push(new Entity(...components))
  }

  getEntitySet(...componentList) {
    return this.filter(entity => {
      if (componentList.length != entity.length) {
        return false;
      }
      let found = true;
      for (let componentType of componentList) {
        found = found && (!!entity.find(component => component instanceof componentType));
      }
      return found;
    })
  }
};

var entities = new EntitiesManager();

class PhysicalSystem {
  updateVelocities() {
    let dt = 1.0 / 60.0;
    let es = entities.getEntitySet(PositionComponent, VelocityComponent)
    for (let entity of es) {
      let [ pc , vc ] = entity;
      pc.x += vc.x * dt;
      pc.y += vc.y * dt;
    }
  }
};


(function main() {
    let physical = new PhysicalSystem()

    entities.newEntity(new PositionComponent(), new VelocityComponent(2, 3));
    entities.newEntity(new PositionComponent(), new VelocityComponent(1, 1));
    entities.newEntity(new PositionComponent());

    physical.updateVelocities();
    for (let e of entities) {
      console.log(e)
    }
    console.log(entities.length)
})();
