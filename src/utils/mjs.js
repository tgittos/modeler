//arrays are flat, not arrays of arrays
//0, 1, 2, 3
//4, 5, 6, 7
//8, 9, 10, 11
//12, 13, 14, 15

M4x3 = {};
M4x3.make4x4 = function(m) {
  console.log('M4x3.make4x4')
  r = [];
  r[0] = m[0]; r[1] = m[1]; r[2] = m[2]; r[3] = 1;
  r[4] = m[3]; r[5] = m[4]; r[6] = m[5]; r[7] = 1;
  r[8] = m[6]; r[9] = m[7]; r[10] = m[8]; r[11] = 1;
  r[12] = m[9]; r[13] = m[10]; r[14] = m[11]; r[15] = 1;
  return r;
}

M3x3 = {};
M3x3.make4x4 = function(m) {
  console.log('M3x3.make4x4');
  r = []
  r[0] = m[0]; r[1] = m[1]; r[2] = m[2]; r[3] = 1;
  r[4] = m[3]; r[5] = m[4]; r[6] = m[5]; r[7] = 1;
  r[8] = m[6]; r[9] = m[7]; r[10] = m[8]; r[11] = 1;
  r[12] = r[13] = r[14] = r[15] = 1;
  return r;
}

M4x4.left4x3 = function(m) {
  console.log('M4x4.left4x3');
  r = [];
  r[0] = m[0]; r[1] = m[1]; r[2] = m[2]; 
  r[3] = m[4]; r[4] = m[5]; r[5] = m[6]; 
  r[6] = m[8]; r[7] = m[9]; r[8] = m[10];
  r[9] = m[12]; r[10] = m[13]; r[11] = m[14];
  return r;
}