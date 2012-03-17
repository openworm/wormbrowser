'use strict';

/**
 * Computes a 4-by-4 camera look-at transformation. This is the
 * inverse of lookAt The transformation generated is an
 * orthogonal rotation matrix with translation component.
 * @param {(!tdl.fast.Vector3|!tdl.fast.Vector4)} eye The position
 *     of the eye.
 * @param {(!tdl.fast.Vector3|!tdl.fast.Vector4)} target The
 *     position meant to be viewed.
 * @param {(!tdl.fast.Vector3|!tdl.fast.Vector4)} up A vector
 *     pointing up.
 * @return {!tdl.fast.Matrix4} The camera look-at matrix.
 */
o3v.cameraLookAt = function(dst, eye, target, up) {
  var t0 = new Float32Array(3);
  var t1 = new Float32Array(3);
  var t2 = new Float32Array(3);

  var vz = o3v.normalize(t0, o3v.subVector(t0, eye, target));
  var vx = o3v.normalize(t1, o3v.cross(t1, up, vz));
  var vy = o3v.cross(t2, vz, vx);

  dst[ 0] = vx[0];
  dst[ 1] = vx[1];
  dst[ 2] = vx[2];
  dst[ 3] = 0;
  dst[ 4] = vy[0];
  dst[ 5] = vy[1];
  dst[ 6] = vy[2];
  dst[ 7] = 0;
  dst[ 8] = vz[0];
  dst[ 9] = vz[1];
  dst[10] = vz[2];
  dst[11] = 0;
  dst[12] = eye[0];
  dst[13] = eye[1];
  dst[14] = eye[2];
  dst[15] = 1;

  return dst;
};

/**
 * Subtracts two vectors.
 * @param {!tdl.fast.Vector} dst vector.
 * @param {!tdl.fast.Vector} a Operand vector.
 * @param {!tdl.fast.Vector} b Operand vector.
 */
o3v.subVector = function(dst, a, b) {
  var aLength = a.length;
  for (var i = 0; i < aLength; ++i)
    dst[i] = a[i] - b[i];
  return dst;
};

/**
 * Computes the cross product of two vectors; assumes both vectors have
 * three entries.
 * @param {!tdl.math.Vector} dst vector.
 * @param {!tdl.math.Vector} a Operand vector.
 * @param {!tdl.math.Vector} b Operand vector.
 * @return {!tdl.math.Vector} The vector a cross b.
 */
o3v.cross = function(dst, a, b) {
  dst[0] = a[1] * b[2] - a[2] * b[1];
  dst[1] = a[2] * b[0] - a[0] * b[2];
  dst[2] = a[0] * b[1] - a[1] * b[0];
  return dst;
};

/**
 * Divides a vector by its Euclidean length and returns the quotient.
 * @param {!tdl.fast.Vector} dst vector.
 * @param {!tdl.fast.Vector} a The vector.
 * @return {!tdl.fast.Vector} The normalized vector.
 */
o3v.normalize = function(dst, a) {
  var n = 0.0;
  var aLength = a.length;
  for (var i = 0; i < aLength; ++i)
    n += a[i] * a[i];
  n = Math.sqrt(n);
  if (n > 0.00001) {
    for (var i = 0; i < aLength; ++i)
      dst[i] = a[i] / n;
  } else {
    for (var i = 0; i < aLength; ++i)
      dst[i] = 0;
  }
  return dst;
};


function Renderer(canvas, textureFromMaterialFunction) {
  getHttpRequest('scripts/shaders.txt', this.onloadShaders.bind(this));

  this.canvas_ = canvas;
  this.textureFromMaterialFunction_ = textureFromMaterialFunction;

  var gl = createContextFromCanvas(canvas);
  this.gl_ = gl;

  // Camera.
  this.zNear_ = Math.sqrt(3);
  this.model_ = mat4.identity(mat4.create());
  this.view_ = mat4.identity(mat4.create());
  this.proj_ = mat4.create();
  this.mvp_ = mat4.create();

  // Meshes.
  this.meshes_ = [];

  // WebGL
  gl.clearColor(0, 0, 0, 0);
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  // Set up viewport.
  this.handleResize();
  mat4.translate(this.view_, [0, 0, -1]);

  // Set up for off-screen surface for entity identification.
  this.selectionFbo_ = { width: 0, height: 0 };

  this.forceColored_ = false;
};

Renderer.prototype.onloadShaders = function(req) {
  // TODO: error handling.
  var shaders = {};
  req.responseText.split('/** ').forEach(function(shader) {
    var name_and_body = shader.split(' **/');
    shaders[name_and_body[0]] = name_and_body[1];
  });

  var gl = this.gl_;

  // Set up program for rendering.
  var simpleVsrc = shaders['shader_vertex'];
  var simpleFsrc = shaders['shader_fragment'];
  this.normProgram_ = new Program(gl, [vertexShader(gl, simpleVsrc),
                                       fragmentShader(gl, simpleFsrc)]);

  // Set up program for selection.
  var idVsrc = shaders['shader_vertex_id'];
  var idFsrc = shaders['shader_fragment_id'];
  this.idProgram_ = new Program(gl, [vertexShader(gl, idVsrc),
                                     fragmentShader(gl, idFsrc)]);

  this.shadersLoaded_ = true;
};

Renderer.prototype.handleResize = function() {
  this.canvas_.width = this.canvas_.clientWidth;
  this.canvas_.height = this.canvas_.clientHeight;
  this.gl_.viewport(0, 0, this.canvas_.width, this.canvas_.height);
};

Renderer.prototype.drawAll_ = function(opt_forId) {
  var numMeshes = this.meshes_.length;
  for (var i = 0; i < numMeshes; i++) {
    this.meshes_[i].bindAndDraw(this.program_, opt_forId);
  }
};

Renderer.prototype.drawLists_ = function(displayLists, opt_forId) {
  var numLists = displayLists.length;
  for (var i = 0; i < numLists; i++) {
    var displayList = displayLists[i];
    var mesh = this.meshes_[i];
    mesh.bind(this.program_, opt_forId);
    mesh.drawList(displayList);
  }
};

// Update matrices and then redisplay.
Renderer.prototype.postRedisplayWithCamera = function(camera) {
  mat4.perspective(
      camera.fov,
      this.canvas_.clientWidth / this.canvas_.clientHeight,
      1, 1000,
      this.proj_);

  o3v.cameraLookAt(this.view_, camera.eye, camera.target, camera.up);
  mat4.inverse(this.view_);
  var vpMatrix = new Float32Array(16);
  mat4.multiply(this.proj_, this.view_, vpMatrix);
  mat4.multiply(vpMatrix, this.model_, this.mvp_);

  this.postRedisplay();
};

Renderer.prototype.postRedisplay = function() {
  var self = this;
  if (!this.frameStart_) {
    this.frameStart_ = Date.now();
    window.requestAnimFrame(function() {
      self.draw_();
      self.frameStart_ = 0;
    }, this.canvas_);
  }
};

Renderer.prototype.ready = function() {
  return this.shadersLoaded_ && (this.frameStart_ === 0);
};

Renderer.prototype.createOffscreenSurface_ = function(width, height) {
  var gl = this.gl_;
  if (!this.selectionFbo_.framebuffer)
    this.selectionFbo_.framebuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, this.selectionFbo_.framebuffer);

  if (!this.selectionFbo_.colorTexture) {
    this.selectionFbo_.colorTexture = gl.createTexture();

    gl.bindTexture(gl.TEXTURE_2D, this.selectionFbo_.colorTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  }

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0,
                gl.RGBA, gl.UNSIGNED_BYTE, null);

  if (!this.selectionFbo_.renderbuffer) {
    this.selectionFbo_.renderbuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, this.selectionFbo_.renderbuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16,
                           width, height);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
                            gl.TEXTURE_2D, this.selectionFbo_.colorTexture, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT,
                               gl.RENDERBUFFER,
                               this.selectionFbo_.renderbuffer);
  }

  var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  if (status != gl.FRAMEBUFFER_COMPLETE) {
    o3v.log.error('Incomplete off-screen framebuffer');
    this.selectionFbo_.framebuffer = null;
  }
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
};

// Identify the mesh clicked.
Renderer.prototype.identify = function(x, y) {
  var gl = this.gl_;

  if (this.selectionFbo_.width != this.canvas_['clientWidth'] ||
      this.selectionFbo_.height != this.canvas_['clientHeight']) {
    this.createOffscreenSurface_(this.canvas_['clientWidth'],
                                 this.canvas_['clientHeight']);
    if (!this.selectionFbo_.framebuffer) {
      o3v.log.error('Unable to identify without valid off-screen buffer.');
      return null;
    }
    var selectionSurfaceSize =
      this.canvas_['clientWidth'] * this.canvas_['clientHeight'] * 4;
    this.selectionFbo_.selectionSurfaceArray =
      new Uint8Array(selectionSurfaceSize);
    this.selectionFbo_.width = this.canvas_['clientWidth'];
    this.selectionFbo_.height = this.canvas_['clientHeight'];
  }

  gl.bindFramebuffer(gl.FRAMEBUFFER, this.selectionFbo_.framebuffer);

  this.draw_(true);

  gl.readPixels(0, 0, this.selectionFbo_.width, this.selectionFbo_.height,
                gl.RGBA, gl.UNSIGNED_BYTE,
                this.selectionFbo_.selectionSurfaceArray);

  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  var tolerancePx = 10;
  var value = this.findPixelInRect_(
      x, y, tolerancePx, this.selectionFbo_.width, this.selectionFbo_.height,
      this.selectionFbo_.selectionSurfaceArray);

  value = Math.floor(value / this.selectionColorScale_);
  if (value != 0) {
    return this.colorToName_[value];
  } else {
    return null;
  }
};

Renderer.prototype.findPixelInRect_ =
    function(sx, sy, windowSize, width, height, data) {
  // Check center.
  var value = this.getPixel_(sx, sy, width, height, data);
  if (value != 0) return value;

  // Walk growing rectangle edges.
  for (var d = 1; d <= windowSize / 2; ++d) {
    for (var y = sy - d; y <= sy + d; ++y) {
      if (y < 0) continue;
      if (y >= height) break;

      value = this.getPixel_(sx - d, y, width, height, data);
      if (value != 0) return value;
      value = this.getPixel_(sx + d, y, width, height, data);
      if (value != 0) return value;
    }
    for (var x = sx - d + 1; x <= sx + d - 1; ++x) {
      if (x < 0) continue;
      if (x >= width) break;

      value = this.getPixel_(x, sy - d, width, height, data);
      if (value != 0) return value;
      value = this.getPixel_(x, sy + d, width, height, data);
      if (value != 0) return value;
    }
  }
  return 0;
};

Renderer.prototype.getPixel_ = function(sx, sy, width, height, data) {
  if (sx < 0 || sx >= width || sy < 0 || sy >= height)
    return 0;

  var startByte = ((height - 1 - sy) * width + sx) * 4;
  var red = data[startByte + 0];
  var green = data[startByte + 1];
  var blue = data[startByte + 2];
  return blue + green * 256 + red * 256 * 256;
};

Renderer.prototype.draw_ = function(opt_forId) {
  if (!this.shadersLoaded_)
    return;

  if (this.forceColored_) {
    opt_forId = true;  // colorcoded
  }

  if (opt_forId) {
    // Flat, one-color-per mesh program used for identification.
    this.program_ = this.idProgram_;
  } else {
    // Normal program used for rendering.
    this.program_ = this.normProgram_;
  }

  this.program_.use();

  if (opt_forId) {
    this.program_.enableVertexAttribArrays(['a_position',
                                            'a_colorIndex']);
    this.program_.disableVertexAttribArrays(['a_normal',
                                             'a_texcoord']);
  } else {
    this.program_.enableVertexAttribArrays(['a_position',
                                            'a_texcoord',
                                            'a_normal']);
    this.program_.disableVertexAttribArrays(['a_colorIndex']);
  }

  var gl = this.gl_;

  if (opt_forId) {
    this.selectionColorScale_ =
        Math.floor((256*256*256-1) / this.maxColorIndex_);
    gl.uniform1f(this.program_.set_uniform.u_colorScale,
                 this.selectionColorScale_);
    //gl.colorMask(true, true, true, true);
  } else {
    //gl.colorMask(true, true, true, false);
  }

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);

  gl.uniformMatrix4fv(this.program_.set_uniform.u_mvp, false, this.mvp_);
  gl.uniformMatrix3fv(this.program_.set_uniform.u_model, false,
                      mat4.toMat3(this.model_));

  gl.uniform1f(this.program_.set_uniform.u_opacity, 1.0);
  if (this.opacityLists_ !== undefined) {
    var meshes = this.meshes_;

    // Draw opaque lists. (Really should only be one, at position zero.)
    for (var i = 0; i < this.opacityLists_.length; i++) {
      var opacity = this.opacityLists_[i].opacity;
      if (opacity == 1) {
        this.drawLists_(this.opacityLists_[i].drawLists, opt_forId);
      }
    }

    // Draw transluscent layers.
    gl.enable(gl.BLEND);
    for (var i = 0; i < this.opacityLists_.length; i++) {
      var opacity = this.opacityLists_[i].opacity;
      if (opacity != 0 && opacity != 1) {
        gl.uniform1f(this.program_.set_uniform.u_opacity, opacity);
        this.drawLists_(this.opacityLists_[i].drawLists, opt_forId);
      }
    }
    gl.disable(gl.BLEND);

  } else {
    this.drawAll_(opt_forId);
  }
};

Renderer.prototype.updateMeshInfo = function() {
  this.entityToMeshInfo_ = {};

  for (var i = 0; i < this.meshes_.length; i++) {
    var mesh = this.meshes_[i];
    for (var j = 0 ; j < mesh.names_.length; j++) {

      var name = mesh.names_[j];
      var meshInfo = {};
      meshInfo.index = i;
      meshInfo.start = mesh.starts_[j];
      meshInfo.end = mesh.starts_[j] + mesh.lengths_[j];

      if (this.entityToMeshInfo_[name] !== undefined) {
        o3v.log.info('multiple meshes for \'', name, '\': ',
                     this.entityToMeshInfo_[name], meshInfo);
        this.entityToMeshInfo_[name].push(meshInfo);
      } else {
        this.entityToMeshInfo_[name] = [meshInfo];
      }
    }
  }
};

Renderer.prototype.updateOpacity = function(opacityInfo) {
  // TODO(dkogan): Special-case all-opaque case for speed.

  // this.opacityLists is:
  // [ { opacity: <opacity>,
  //     drawLists: [ [ <start 0 in mesh 0>, <length 0 in mesh 0>,
  //                    <start 1 in mesh 0>, <length 1 in mesh 0>...],
  //                  [ <start 0 in mesh 1>, <length 0 in mesh 1>...
  //                ] } ]

  this.opacityLists_ = [];
  o3v.util.forEach(
      opacityInfo,
      function(entities, opacity) {
        opacityInfo = {};
        opacityInfo.opacity = parseFloat(opacity);
        opacityInfo.drawLists = [];
        for (var i = 0; i < this.meshes_.length; i++) {
          opacityInfo.drawLists[i] = [];
        }
        o3v.util.forEach(
            entities,
            function(unused_true, entityId) {
              for (var i = 0; i < this.entityToMeshInfo_[entityId].length;
                   i++) {
                var meshInfo = this.entityToMeshInfo_[entityId][i];
                opacityInfo.drawLists[meshInfo.index].push(meshInfo.start);
                opacityInfo.drawLists[meshInfo.index].push(meshInfo.end);
              }
            }, this);
        this.opacityLists_.push(opacityInfo);
      }, this);
  this.opacityLists_.sort(function(a, b) { return b.opacity > a.opacity; });
};

Renderer.prototype.onMeshLoad =
    function(attribArray, indexArray, bboxes, meshEntry) {
  var texture = this.textureFromMaterialFunction_(this.gl_, meshEntry.material,
                                                  this.postRedisplay.bind(
                                                      this));

  // Set color for meshes, and record the mapping of color to name.
  var startColorIndex = this.maxColorIndex_;
  for (var i = 0; i < meshEntry.names.length; i++) {
    this.colorToName_[startColorIndex + i] = meshEntry.names[i];
  }
  this.maxColorIndex_ += meshEntry.lengths.length;

  this.meshes_.push(
      new Mesh(this.gl_, attribArray, indexArray, DEFAULT_ATTRIB_ARRAYS,
               texture, meshEntry.names, meshEntry.lengths, bboxes,
               startColorIndex));
};

Renderer.prototype.reset = function() {
  this.meshes_ = [];
  this.postRedisplay();
  this.maxColorIndex_ = 1;
  this.colorToName_ = {};
  this.opacityLists_ = [];
};

Renderer.prototype.getViewportCoords = function(modelCoords) {
  var modelCoords = [modelCoords[0],
                     modelCoords[1],
                     modelCoords[2],
                     1];

  var screenCoords = mat4.create();

  mat4.multiply(this.mvp_, modelCoords, screenCoords);

  var x = screenCoords[0] / screenCoords[3];
  var y = screenCoords[1] / screenCoords[3];

  x = (x + 1) * this.canvas_.width / 2;
  y = (2 - (y + 1)) * this.canvas_.height / 2;

  return [x, y];
};

Renderer.prototype.toggleColored = function() {
  this.forceColored_ = !this.forceColored_;
};
