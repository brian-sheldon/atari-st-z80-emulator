# How this code was extracted and built

I used the Hatari Atari-ST Emulator as the platform used to run the Atari-ST CP/M Emulator v8.4 by SoftDesign Munich.  In order for this to run, I had to ensure Hatari was running a compatible ROM.  In my case, I used the US TOS 1.62 version.

Run the following command from a Windows shell to start Hatari.  Will be different on non-Windows platform.

./hatari.exe --wincon

![](img/01.png)

click ok

![](img/02.png)

press F12 to bring up the Hatari main menu

![](img/03.png)

click floppy disks, for Drive A:, browse to file containing the img file for the CP/M Emulator.  Go back to main menu and click OK.

![](img/04.png)

Open Drive A and double click on CPMZ80.TOS

![](img/05.png)

When asked to insert floppy, click F12

![](img/06.png)

Go into floppy disk menu, browse to CP/M system floppy img.

![](img/07.png)

Exit menu

![](img/08.png)
Type dir and press enter.

Type type happy.txt and do not press enter.

Get ready to quickly press press the alt-pause key to enter the Hatari debug console.

Note:  The reason for entering the Hatari debug console while the type happy.txt is running, is to ensure the emulator is currently running the emulation loop, so the registers and the program counter are set with the values used when the loop is running, making it far easier to analyze the code.
![](img/09.png)
Press enter followed quickly by pressing alt-pause key.
![](img/10.png)
We are now in the Hatari debug console.
![](img/11.png)
Enter r to examine the cpu state.
![](img/12.png)
Enter d $118e4 to list the assembly code that will execute next.
![](img/13.png)
![](img/14.png)
![](img/15.png)
![](img/16.png)



