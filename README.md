# atari-st-z80-emulator
Z80 emulator from the CP/M emulator (not complete)

In 1990, I decided to make a quick and dirty emulator of my TRS-80 Model 1 that would run on my Atari ST.  As I had the CP/M emulator for the Atari ST that emulated a Z80 processor, I realized I could probably make a quick emulator by disassembling this CP/M emulator and then using some of the code to build my TRS-80 emulator.  From what I recall, I managed to get the code for emulating all the Z80 ops on one weekend and built the rest of the emulator the following weekend.  Note, it was very basic, it just emulated the Z80 processor, the keyboard and the screen, no cassette, disk or other hardware, but it did what I needed at the time.  Unfortunately, I never kept this code.

Thinking about it now, I am surprised I managed to do this so quickly.  So, I decided to at a minimum, see how easy it is to at least do part of this again, partially as I felt the code for the Z80 emulation might have some value for anyone writing a similar emulator.  So I installed the Atari ST emulator on my Windows 11 PC.  Then I acquired the disk image for the CP/M emulator.  The next step was to run the emulator and while it was running, enter the Hatari debug console.  Note:  To make it easier to find the code, I wanted to enter the debugger while CP/M was in the middle of executing Z80 code.  Having written another CP/M emulator, I realized that while CP/M is waiting for keyboard input, it is not actively running the Z80 emulation code.  I therefore ran the CP/M "TYPE" command on a reasonably large text file.  This allowed me time to enter the debugger while this command was still active.

At this point, I was able to start examining the code of this emulator.  This CP/M emulator uses a jump table for each of the various groups of up to 256 Z80 instructions, some one byte and some multiple byte instructions.  Within the first 256 one byte instructions, are 4 instructions that are further decoded using another jump table of 256 instructions.  For this emulator, there are a total of 6 jump tables, 1 for the one byte instructions, 4 for the 2 byte instruction, CBxx, DDxx, EDxx, FDxx.  Then there is 1 table shared by both the DDCBxx and FDCBxx instructions.  Not everyone of these groups have 256 instruction, some of the opcodes are undefined and are therefore redirected to code to handle these undefined instructions.

Currently, I have so far managed to extract the jump tables and code for all the instructions.  I have yet to go through all the code and replace any hardcoded references with labels.  Plus, not of the support routines used by this code have not been included.  At this point, the tables and code I have constructed, does not match the address of the running code in the CP/M emulator.  Therefore, some of the code may attempt to address absolute addresses that would not be valid.  But the primary purpose of having this code as a reference for how one might emulate the various instructions has mostly been fulfilled.  I still need to add some info on how the various 68000 registers are used and some of the variables stored in memory are used, in order for this code to be easier to understand.

### Sample pieces of the extracted code

```
        table_op:
000000  0200                          dc.w      op_00 - table_op
000002  020c                          dc.w      op_01 - table_op
...
0001fc  1f14                          dc.w      op_fe - table_op
0001fe  1f2c                          dc.w      op_ff - table_op
        op_00:                        ; nop
000200  1019                          MOVE.b    (A1)+,D0
000202  d040                          ADD.w     D0,D0
000204  3233 0000                     MOVE.w    $00(A3,D0),D1
000208  4ef3 1000                     JMP       $00(A3,D1)
        op_01:                        ; ld bc,nn
00020c  1b59 0005                     MOVE.b    (A1)+,$0005(A5)
000210  1b59 0004                     MOVE.b    (A1)+,$0004(A5)
000214  1019                          MOVE.b    (A1)+,D0
000216  d040                          ADD.w     D0,D0
000218  3233 0000                     MOVE.w    $00(A3,D0),D1
00021c  4ef3 1000                     JMP       $00(A3,D1)
...
        op_ff:                        ; rst 38h
001f2c  93ce                          SUBA.l    A6,A1
001f2e  3009                          MOVE.w    A1,D0
001f30  1200                          MOVE.b    D0,D1
001f32  e058                          ROR.w     #8,D0
001f34  1500                          MOVE.b    D0,-(A2)
001f36  1501                          MOVE.b    D1,-(A2)
001f38  43ee 0038                     LEA       $0038(A6),A1
001f3c  4240                          CLR.w     D0
001f3e  1019                          MOVE.b    (A1)+,D0
001f40  d040                          ADD.w     D0,D0
001f42  3233 0000                     MOVE.w    $00(A3,D0),D1
001f46  4ef3 1000                     JMP       $00(A3,D1)
        table_opcb:
001f4a  0200                          dc.w      op_cb00 - table_opcb
001f4c  021c                          dc.w      op_cb01 - table_opcb
...
001fa8  0702                          dc.w      op_cb2f - table_opcb
001faa  ffff                          dc.w      op_undefined - table_opcb
001fac  ffff                          dc.w      op_undefined - table_opcb
001fae  ffff                          dc.w      op_undefined - table_opcb
001fb0  ffff                          dc.w      op_undefined - table_opcb
001fb2  ffff                          dc.w      op_undefined - table_opcb
001fb4  ffff                          dc.w      op_undefined - table_opcb
001fb6  ffff                          dc.w      op_undefined - table_opcb
001fb8  ffff                          dc.w      op_undefined - table_opcb
001fba  0716                          dc.w      op_cb38 - table_opcb
...
002146  1684                          dc.w      op_cbfe - table_opcb
002148  169a                          dc.w      op_cbff - table_opcb
        op_cb00:                      ; rlc b
00214a  122d 0004                     MOVE.b    ($0004,a5),D1
00214e  e319                          ROL.b     #1,D1
002150  5bc2                          SMI       D2
002152  57c3                          SEQ       D3
002154  55c6                          SCS       D6
002156  1b41 0004                     MOVE.b    D1,$0004(A5)
00215a  1019                          MOVE.b    (A1)+,D0
00215c  d040                          ADD.w     D0,D0
00215e  3233 0000                     MOVE.w    $00(A3,D0),D1
002162  4ef3 1000                     JMP       $00(A3,D1)
...
...
...
        op_ddcbfe:                    ; set 7,(ix+d)
0051a2  08f6 0007 1800                BSET      #$07,$00(A6,D1.l)
0051a8  4240                          CLR.w     D0
0051aa  1019                          MOVE.b    (A1)+,D0
0051ac  d040                          ADD.w     D0,D0
0051ae  3233 0000                     MOVE.w    $00(A3,D0),D1
0051b2  4ef3 1000                     JMP       $00(A3,D1)
```


