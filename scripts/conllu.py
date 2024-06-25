import sys
import re
file_path = sys.argv[1]

with open(file_path, "r", encoding="utf-8") as file:
    for line_number, line in enumerate(file, start=1):
        flag = 0
        if not line.strip() or re.search(r'^#', line):
            continue
        fields = line.strip().split('\t')

        try:
            upos = fields[3].strip()
        except:
            flag = 1
        try:
            tokenno = fields[0].strip()
        except:
            flag = 1

        try:
            head = fields[6].strip()
        except:
            flag = 2

        if len(fields) > 10:
            print(line.strip())
            print(f"Line {line_number}: More than 10 fields\n")

        elif len(fields) < 10:
            print(line.strip())
            print(f"Line {line_number}: Less than 10 fields\n")

        elif( (upos.strip() == "-" and not re.search(r'\-', tokenno)) or flag == 1):
            print(line.strip())
            print(f"Line {line_number}: has formatting issues.\n")
        elif( tokenno == head ):
            print(line.strip())
            print(f"Line {line_number}: There is a Cycle\n")

        #else:
        #    print(f"Line {line_number}: Exactly 10 fields")

print("No issues found.")
