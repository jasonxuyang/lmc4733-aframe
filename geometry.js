/* Constant used for extrusions */
const EXTRUSION_LENGTH = 2;

/* 
  Parses a vertex string and consturcts a three.v3
  params: string[] - "["x1 y1 z1", "x2 y2 z2", "x3 y3 z3"]
  return: THREE.Vector3[]
*/
const parseVertices = (vertices) => {
  return vertices.map((vertex) => {
    let points = vertex.split(" ").map((point) => {
      return parseFloat(point);
    });
    return new THREE.Vector3(points[0], points[1], points[2]);
  });
};

/* 
  Takes an existing geometry and extrudes it, adding new vertices
  params: Three.Geometry
  return: Three.Geometry
*/
const extrudeGeometry = (geometry, length) => {
  // first add new vertices
  let newVertices = geometry.vertices.map((vertex) => {
    return new THREE.Vector3(vertex.x, vertex.y, vertex.z - length);
  });
  geometry.vertices = [...geometry.vertices, ...newVertices];
  return geometry;
};

/* 
  Takes an existing geometry and builds geometry for a triangular prism
  params: Three.Geometry
  return: Three.Geometry
*/
const buildTPrism = (geometry) => {
  extrudeGeometry(geometry, EXTRUSION_LENGTH);

  // front
  geometry.faces.push(new THREE.Face3(0, 1, 2));

  // right
  geometry.faces.push(new THREE.Face3(1, 5, 2));
  geometry.faces.push(new THREE.Face3(5, 1, 4));

  // back
  geometry.faces.push(new THREE.Face3(3, 4, 5));

  // top
  geometry.faces.push(new THREE.Face3(5, 3, 0));
  geometry.faces.push(new THREE.Face3(0, 2, 5));

  // bottom
  geometry.faces.push(new THREE.Face3(3, 1, 0));
  geometry.faces.push(new THREE.Face3(3, 4, 1));

  return geometry;
};

/* 
  Takes an existing geometry and builds geometry for a triangular prism
  params: Three.Geometry
  return: Three.Geometry
*/
const buildRPrism = (geometry) => {
  extrudeGeometry(geometry, EXTRUSION_LENGTH);

  // front
  geometry.faces.push(new THREE.Face3(0, 3, 2));
  geometry.faces.push(new THREE.Face3(0, 1, 3));

  // right
  geometry.faces.push(new THREE.Face3(1, 7, 3));
  geometry.faces.push(new THREE.Face3(1, 5, 7));

  // back
  geometry.faces.push(new THREE.Face3(5, 6, 7));
  geometry.faces.push(new THREE.Face3(5, 4, 6));

  // left
  geometry.faces.push(new THREE.Face3(4, 2, 6));
  geometry.faces.push(new THREE.Face3(4, 0, 2));

  // top
  geometry.faces.push(new THREE.Face3(2, 7, 6));
  geometry.faces.push(new THREE.Face3(2, 3, 7));

  // bottom
  geometry.faces.push(new THREE.Face3(4, 1, 0));
  geometry.faces.push(new THREE.Face3(4, 5, 1));

  return geometry;
};

/* 
  Takes an existing geometry and computes face normals among other stuff
  params: Three.Geometry
  return: Three.Geometry
*/
const computeGeometry = (geometry) => {
  geometry.computeBoundingBox();
  geometry.mergeVertices();
  geometry.computeFaceNormals();
  return geometry;
};

/* 
  Renders a triangular prism with the passed in vertices
  params: string[] an array of vertices
*/
AFRAME.registerGeometry("t_prism", {
  schema: {
    vertices: {
      default: ["0 10 0", "-10 -10 0", "10 -10 0"],
    },
  },

  init: function (data) {
    let geometry = new THREE.Geometry();
    geometry.vertices = parseVertices(data.vertices);
    this.geometry = computeGeometry(buildTPrism(geometry));
  },
});

/* 
  Renders a rectangular prism with the passed in vertices
  params: string[] an array of vertices
*/
AFRAME.registerGeometry("r_prism", {
  schema: {
    vertices: {
      default: ["-1 -1 1", "1 -1 1", "-1 1 1", "1 1 1"],
    },
  },

  init: function (data) {
    let geometry = new THREE.Geometry();
    geometry.vertices = parseVertices(data.vertices);
    this.geometry = computeGeometry(buildRPrism(geometry));
  },
});
