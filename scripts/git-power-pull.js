// Power pull attempts to do a git rebase. If that cannot be done without conflict it attempts
// a git pull with a merge
// git pull --rebase --autostash
// watches for conflicts and then does a git rebase --abort if conflicts are detected
// now it attempts a standard git pull

