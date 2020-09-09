
class VectorAOS {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class VectorSOA {
  constructor(xs, ys) {
    this.xs = xs;
    this.ys = ys;
  }
}

/**
 * Gives an integer timestamp in seconds
 */
function getTime() {
  return new Date().getTime() / 1000;
};

function printDescriptors(name, min, max, avg, sum) {
  console.log('---- ', name, ' ----');
  console.log(`min: ${min} sec`);
  console.log(`max: ${max} sec`);
  console.log(`avg: ${avg} sec`);
  console.log(`sum: ${sum} sec`);
}


function operationTimeTest() {
  let sumA1Time = 0;
  let maxA1 = 0, minA1 = 0;

  let tries = 1000;
  let nEntities = 1000000;

  let a1 = [];
  let b1 = new VectorSOA([], []);
  let c1 =
      new VectorSOA(new Uint32Array(nEntities), new Uint32Array(nEntities));

  for (let i = 0; i < nEntities; ++i) {
    a1[i] = new VectorAOS(i + 1, i * (i / 2));
  }

  for (let i = 0; i < nEntities; ++i) {
    b1.xs[i] = i + 1;
  }

  for (let i = 0; i < nEntities; ++i) {
    b1.ys[i] = i * (i / 2);
  }

  for (let i = 0; i < nEntities; ++i) {
    c1.xs[i] = i + 1;
  }

  for (let i = 0; i < nEntities; ++i) {
    c1.ys[i] = i * (i / 2);
  }

  let scala = 0.7

  for (let t = 0; t < tries; ++t) {
    let start = getTime();
    for (let i = 0; i < nEntities; ++i) {
      a1[i].x *= scala;
      a1[i].y *= scala;
    }
    let endTime = getTime() - start;

    if (endTime < minA1) {
      minA1 = endTime
    } else if (t === 0) {
      minA1 = endTime
    }
    if (endTime > maxA1) maxA1 = endTime;

    sumA1Time += endTime;
  }

  let sumB1Time = 0;
  let maxB1 = 0, minB1 = 0;
  for (let t = 0; t < tries; ++t) {
    let start = getTime();
    for (let i = 0; i < nEntities; ++i) {
      b1.xs[i] *= scala;
    }

    for (let i = 0; i < nEntities; ++i) {
      b1.ys[i] *= scala;
    }
    let endTime = getTime() - start;

    if (endTime < minB1) {
      minB1 = endTime
    } else if (t === 0) {
      minB1 = endTime
    }
    if (endTime > maxB1) maxB1 = endTime;

    sumB1Time += endTime;
  }

  let sumC1Time = 0;
  let maxC1 = 0, minC1 = 0;
  for (let t = 0; t < tries; ++t) {
    let start = getTime();
    for (let i = 0; i < nEntities; ++i) {
      c1.xs[i] *= scala;
    }

    for (let i = 0; i < nEntities; ++i) {
      c1.ys[i] *= scala;
    }
    let endTime = getTime() - start;

    if (endTime < minC1) {
      minC1 = endTime
    } else if (t === 0) {
      minC1 = endTime
    }
    if (endTime > maxC1) maxC1 = endTime;

    sumC1Time += endTime;
  }

  printDescriptors('A1: AOS', minA1, maxA1, sumA1Time / tries, sumA1Time)

  printDescriptors('B1: SOA', minB1, maxB1, sumB1Time / tries, sumB1Time)

  printDescriptors('C1: typed SOA', minC1, maxC1, sumC1Time / tries, sumC1Time)


  let denom = sumA1Time <= sumB1Time ? sumA1Time : sumB1Time
  let nominator = sumA1Time >= sumB1Time ? sumA1Time : sumB1Time

  console.log()
  console.log('multiplicative difference in sum of times: ', nominator / denom)
}

function initTimeTest() {
  let tries = 1000;
  let nEntities = 1000000;

  let sumA1Time = 0;
  let maxA1 = 0, minA1 = 0;
  for (let t = 0; t < tries; ++t) {
    let a1 = [];

    let start = getTime();
    for (let i = 0; i < nEntities; ++i) {
      a1[i] = new VectorAOS(i + 1, i * (i / 2));
    }
    let endTime = getTime() - start;

    if (endTime < minA1) {
      minA1 = endTime
    } else if (t === 0) {
      minA1 = endTime
    }
    if (endTime > maxA1) maxA1 = endTime;

    sumA1Time += endTime;
  }

  let sumB1Time = 0;
  let maxB1 = 0, minB1 = 0;
  for (let t = 0; t < tries; ++t) {
    let b1 = new VectorSOA([], []);

    let start = getTime();
    for (let i = 0; i < nEntities; ++i) {
      b1.xs[i] = i + 1;
    }

    for (let i = 0; i < nEntities; ++i) {
      b1.ys[i] = i * (i / 2);
    }
    let endTime = getTime() - start;

    if (endTime < minB1) {
      minB1 = endTime
    } else if (t === 0) {
      minB1 = endTime
    }
    if (endTime > maxB1) maxB1 = endTime;

    sumB1Time += endTime;
  }

  let sumC1Time = 0;
  let maxC1 = 0, minC1 = 0;
  for (let t = 0; t < tries; ++t) {
    let c1 =
        new VectorSOA(new Uint32Array(nEntities), new Uint32Array(nEntities));

    let start = getTime();
    for (let i = 0; i < nEntities; ++i) {
      c1.xs[i] = i + 1;
    }

    for (let i = 0; i < nEntities; ++i) {
      c1.ys[i] = i * (i / 2);
    }
    let endTime = getTime() - start;

    if (endTime < minC1) {
      minC1 = endTime
    } else if (t === 0) {
      minC1 = endTime
    }
    if (endTime > maxC1) maxC1 = endTime;

    sumC1Time += endTime;
  }

  printDescriptors('A1: AOS', minA1, maxA1, sumA1Time / tries, sumA1Time)

  printDescriptors('B1: SOA', minB1, maxB1, sumB1Time / tries, sumB1Time)

  printDescriptors('C1: typed SOA', minC1, maxC1, sumC1Time / tries, sumC1Time)

  let denom = sumA1Time <= sumB1Time ? sumA1Time : sumB1Time
  let nominator = sumA1Time >= sumB1Time ? sumA1Time : sumB1Time

  console.log()
  console.log('multiplicative difference in sum of times: ', nominator / denom)
}


(function main() {
  console.log('Initialization test of 1000000 entries, SOA, AOS');
  initTimeTest();

  console.log()
  console.log('Operation test of 1000000 entries, SOA, AOS');
  operationTimeTest();
})();