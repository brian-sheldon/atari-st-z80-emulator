


let fs = require( 'fs' );

global.hex = function( v, w = 0 ) {
  return v.toString( 16 ).padStart( w, '0' );
}

global.hex2 = function( v ) {
  return hex( v, 2 );
}

global.hex4 = function( v ) {
  return hex( v, 4 );
}

global.hex6 = function( v ) {
  return hex( v, 6 );
}

global.hex8 = function( v ) {
  return hex( v, 8 );
}

global.hex10 = function( v ) {
  return hex( v, 10 );
}

let Proc = require( './processor.js' ).Processor;

class Bug {
  say( s ) {
  }
}

class Memory {
  constructor() {
    this.init();
  }
  init() {
    this.mem = Buffer.alloc( 1024 * 1024 );
  }
  readByte( addr ) {
    return this.mem[addr];
  }
  readWord( addr ) {
    return ( this.readByte( addr ) << 8 ) + this.readByte( addr + 1 );
  }
  readLong( addr ) {
    return ( this.readByte( addr ) << 24 ) + ( this.readByte( addr + 1 ) << 16 ) + ( this.readByte( addr + 2 ) << 8 ) + this.readByte( addr + 3 );
  }
  writeByte( addr, v ) {
    this.mem[addr] = v & 0xff;
  }
  writeWord( addr, v ) {
    this.writeByte( addr, ( v & 0xff00 ) >> 8 );
    this.writeByte( addr + 1, v & 0xff );
  }
  writeLong( addr, v ) {
    this.writeByte( addr, ( v & 0xff000000 ) >> 24 );
    this.writeByte( addr + 1, ( v & 0xff0000 ) >> 16 );
    this.writeByte( addr + 2, ( v & 0xff00 ) >> 8 );
    this.writeByte( addr + 3, v & 0xff );
  }
  load( file, tbeg = 0, sbeg = 0, send = 0 ) {
    let buffer = fs.readFileSync( file );
    if ( send == 0 ) {
      send = buffer.length;
    }
    buffer.copy( this.mem, tbeg, sbeg, send );
  }
}


let opts = {};
opts.bug = new Bug();
opts.memory = new Memory();
mem = opts.memory;

mem.load( 'test.code.bin' );
console.log( hex2( mem.readByte( 0 ) ) );
console.log( hex4( mem.readWord( 0 ) ) );
console.log( hex8( mem.readLong( 0 ) ) );

let proc = new Proc( opts );
proc.setup();
proc.reset( 0 );

let reg = proc.getReg();

let beg = performance.now();
console.log( reg );
console.log( hex8( mem.readLong( 0 ) ) );
console.log( hex8( mem.readLong( 4 ) ) );
console.log( reg );
proc.step();
proc.step();
proc.step();
proc.step();
proc.step();
proc.step();
proc.step();
proc.step();
proc.step();
console.log( reg );
let end = performance.now();
let diff = end - beg;

console.log( beg, end, diff );



