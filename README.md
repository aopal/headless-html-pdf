# headless-html-pdf

Converts html files to pdf using Chrome headless mode.

Generated pdfs will be almost identical to manually printing to pdf from Chrome. htmlpdf should autodetect your Chrome installation, see below if it does not.

# Installation
`npm install headless-html-pdf`

# Dependencies
- Google Chrome

# Example
```
C:\Users\aopal\Documents\htmlpdf> htmlpdf "hello world.html"
[0119/184712.433:INFO:headless_shell.cc(568)] Written to file C:\Users\aopal\Documents\htmlpdf\hello world.pdf.
```

# Flags
```
--destination=DIR                       Select directory to save pdfs to (default is current directory)
--set-executable=PATH_TO_CHROME         Manually set Chrome executable
```

# Manually setting Chrome executable
`htmlpdf --set-executable=/usr/bin/google-chrome`

If htmlpdf doesn't autodetect your Chrome install or you want to use Chromium/Canary/etc. `--set-executable=PATH_TO_CHROME` will allow you to set the executable. `--set-executable=default` re-attemps auto-detection.