Requirement to create pdf files from markdown:

- [Pandoc](https://pandoc.org/)
- [Mermaid-cli](https://github.com/mermaid-js/mermaid-cli)


To create case pdf: 
```shell
pandoc case.md -o case.pdf
```

To create product repport pdf: 
```shell
mmdc -i ProductRepport.md -o ProductRepport-converted.md -e "png"
pandoc ProductRepport-converted.md --toc -f markdown-implicit_figures --listings -H listings-setup.tex -V geometry:"left=3cm, top=2cm, right=3cm, bottom=2cm" -V fontsize=12pt -o ProductRepport.pdf
```

If the markdown file contains images, then to ensure correct location of the images, add `-f markdown-implicit_figures` as an option to the pandoc command.

To add code blocks that looks better and wraps nicely add the following to the pandoc command: `--listings -H listings-setup.tex`

To set some default format of the pdf: `-V geometry:"left=3cm, top=2cm, right=3cm, bottom=2cm" -V fontsize=12pt`
