
const fs = require( 'fs' );

let path = 'z80.json';
let z80str = fs.readFileSync( path, 'utf8' );

let z80 = JSON.parse( z80str );

let o = {};

let last = 0;
let count = 0;
let tcount = 0;
for ( let i = 0; i < z80.length; i++ ) {
  let ignore = [
    'n', 'nn', 'd'
  ];
  let opc = '';
  let opcode = z80[i].opcode;
  let p = opcode.split( ' ' );
  for ( let j = 0; j < p.length; j++ ) {
    if ( ! ignore.includes( p[j] ) ) {
      opc += p[j];
    }
  }
  opc = opc.toLowerCase();
  let asm = z80[i].asm;
  o[opc] = asm;
  if ( z80[i].table != last ) {
    if ( last != 0 ) {
      console.log( last, tcount );
    }
    console.log( z80[i].opcode, z80[i].asm );
    tcount = 0;
    last = z80[i].table;
  }
  count++;
  tcount++;
}
console.log( last, tcount );
console.log( count );

let out = JSON.stringify( o, null, 2 );
fs.writeFileSync( 'z80.ops.json', out, 'utf8' );

