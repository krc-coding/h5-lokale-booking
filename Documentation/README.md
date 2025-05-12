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
pandoc ProductRepport-converted.md --toc -o ProductRepport.pdf
```

If the markdown file contains images, then to ensure correct location of the images, add `-f markdown-implicit_figures` as an option to the pandoc command.
