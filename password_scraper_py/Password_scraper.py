import re

passwords = []

with open("accounts.txt", "r") as file:
    for line in file:
        match = re.search(r"(.*):(.*)", line)
        if match:
            passwords.append(match.group(2))

if passwords:
    print("Unencrypted passwords found, please secure your accounts")
    print("Passwords found: ", passwords)
else:
    print("No unencrypted passwords found.")
