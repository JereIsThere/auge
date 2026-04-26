# LaTeX for Beginners 🟢

Start writing professional documents in LaTeX today! No installation needed — everything is online.

## Essential Concepts

| Concept | What It Does | Example |
|---------|-------------|---------|
| `\documentclass` | Defines document type | `\documentclass{article}` |
| `\usepackage` | Imports functionality | `\usepackage{amsmath}` |
| `\begin{} \end{}` | Environments | `\begin{document}...\end{document}` |
| `\section` | Creates heading | `\section{Introduction}` |
| `\textbf` | Bold text | `\textbf{important}` |
| `\textit` | Italic text | `\textit{emphasize}` |
| `\emph` | Emphasis (usually italic) | `\emph{key point}` |
| `$...$` | Inline math | `$E = mc^2$` |
| `$$...$$` | Display math | `$$\int_0^\infty e^{-x} dx = 1$$` |
| `\\` | Line break | Text \\ New line |

## 📚 Curated Resources (Online-Only!)

### Start Here: Interactive Tutorials

1. **[Overleaf Learn LaTeX in 30 Minutes](https://www.overleaf.com/learn/latex/Learn_LaTeX_in_30_minutes)** ⭐ TOP CHOICE
   - Official Overleaf tutorial
   - Interactive examples you can edit live
   - Perfect entry point
   - **Time**: 30-45 minutes

2. **[Overleaf - 30 Second Intro](https://www.overleaf.com/learn/latex/30_second_intro)**
   - Ultra-quick overview
   - Gives you the feel immediately

### Videos & Courses

3. **[Overleaf Video Tutorials (YouTube)](https://www.youtube.com/channel/UCQyEcl48ZdDAKNqRtzk8UMw)**
   - Official Overleaf channel
   - Short, focused videos
   - Topics: basics, math, graphics, presentations

4. **[LaTeX Course for Beginners (YouTube - Dr. Trefor Bazett)](https://www.youtube.com/watch?v=VhmkLrOjLsw&list=PLHXZ9OQGMqxcWYwmWw91VijVtjWYVvvHv)**
   - Comprehensive beginner course
   - ~10 videos, 1-2 hours total
   - Clear and well-paced

### Hands-On Learning

5. **[Overleaf Templates Library](https://www.overleaf.com/latex/templates)**
   - Hundreds of ready-made templates
   - Pick one, customize, learn by doing
   - **Recommended for beginners**: Resume, Article, Letter templates

### Reference

6. **[Overleaf Documentation](https://www.overleaf.com/learn)**
   - Comprehensive reference
   - Search for any command
   - Has examples for everything

## 🚀 Getting Started (5 Minutes)

1. Go to [overleaf.com](https://www.overleaf.com)
2. Sign up (free account is fine)
3. Click "New Project"
4. Choose "Blank Project" or pick a template
5. Start typing!

### Your First LaTeX Document

Copy this into Overleaf and see it compile:

```latex
\documentclass{article}
\usepackage[utf8]{inputenc}

\title{My First LaTeX Document}
\author{Your Name}
\date{\today}

\begin{document}

\maketitle

\section{Introduction}
Hello, \textbf{LaTeX}!

\section{Math Example}
Here's an equation:
$$E = mc^2$$

\end{document}
```

## 💡 Common Tasks (Beginner)

### Task: Write a Simple Report
- Use `article` or `report` class
- Sections: `\section{}`
- Subsections: `\subsection{}`
- Follow the template structure

### Task: Add Math
- Inline math: `$x^2 + y^2 = z^2$`
- Display math: `$$\frac{a}{b}$$`
- Use `amsmath` package for advanced math

### Task: Create a Table
```latex
\begin{tabular}{|l|c|r|}
\hline
Left & Center & Right \\
\hline
\end{tabular}
```

### Task: Add an Image
```latex
\includegraphics[width=0.5\textwidth]{image.png}
```

## Code Examples

See [examples/](./examples/) for complete LaTeX documents:
- `simple_article.tex` - Basic article structure
- `resume.tex` - Professional resume template
- `math_demo.tex` - Mathematical equations examples

## 🎯 Beginner Checklist

- [ ] I've created a LaTeX document on Overleaf
- [ ] I understand document structure (`\documentclass`, `\begin{document}`)
- [ ] I can create sections and subsections
- [ ] I can write bold and italic text
- [ ] I can write simple mathematical equations
- [ ] I've compiled and seen the PDF output

## Common Mistakes to Avoid

❌ **Don't**: Use special characters without escaping (`$`, `%`, `&`, `#`)
✓ **Do**: Escape them with backslash: `\$`, `\%`, `\&`, `\#`

❌ **Don't**: Worry about formatting — let LaTeX do it
✓ **Do**: Focus on structure, LaTeX handles the rest

❌ **Don't**: Use 10 different font sizes
✓ **Do**: Use semantic commands like `\section`, `\textbf`

## Next Steps

Once comfortable, move to **[Intermediate LaTeX](../intermediate/resources.md)** to learn:
- Custom commands and macros
- Bibliography and citations
- Multi-file projects
- Figures and captions
