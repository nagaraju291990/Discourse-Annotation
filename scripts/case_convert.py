#convert text to lowercase 

import sys
#open file using open file mode
fp1 = open(sys.argv[1]) # Open file on read mode -- input file
lines = fp1.read().split("\n") # Create a list containing all lines
fp1.close() # Close file

#write output to a file name it out.txt
fp2 = open("out.txt", "w")

#do something with the text and write it to the file
for line in lines:
	out_line = line.lower()
	fp2.write(out_line + "\n")


fp2.close()