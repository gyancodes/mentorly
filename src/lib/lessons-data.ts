export interface Lesson {
  id: string
  title: string
  description: string
  content: string
  code: string
  expectedOutput: string
  hints: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: number // in minutes
}

export interface LessonTrack {
  id: string
  title: string
  description: string
  icon: string
  color: string
  lessons: Lesson[]
}

export const htmlBasicsLessons: Lesson[] = [
  {
    id: 'html-structure',
    title: 'HTML Document Structure',
    description: 'Learn the fundamental structure of an HTML document and essential elements',
    content: `# HTML Document Structure

Every HTML document follows a standard structure that browsers understand. This lesson covers the essential building blocks.

## The HTML5 Document Structure

An HTML document consists of several key components:

1. **DOCTYPE Declaration** - Tells the browser this is an HTML5 document
2. **HTML Element** - The root element containing all content
3. **Head Section** - Contains metadata and page information
4. **Body Section** - Contains the visible content

## Key Elements Explained

- \`<!DOCTYPE html>\` - HTML5 declaration (must be first line)
- \`<html>\` - Root element wrapping all content
- \`<head>\` - Contains metadata (title, styles, scripts)
- \`<title>\` - Page title (appears in browser tab)
- \`<body>\` - Contains all visible content

## Exercise

Create a complete HTML document with:
- Proper DOCTYPE declaration
- HTML, head, and body elements
- A meaningful title
- A heading and paragraph in the body

**Tip**: Always close your tags and maintain proper indentation for readability.`,
    code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First Web Page</title>
</head>
<body>
    <h1>Welcome to HTML!</h1>
    <p>This is my first paragraph. I'm learning the basics of HTML structure.</p>
</body>
</html>`,
    expectedOutput: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First Web Page</title>
</head>
<body>
    <h1>Welcome to HTML!</h1>
    <p>This is my first paragraph. I'm learning the basics of HTML structure.</p>
</body>
</html>`,
    hints: [
      'Start with <!DOCTYPE html> on the first line',
      'Include the lang attribute in the html tag',
      'Add meta tags for charset and viewport in the head',
      'Close all opening tags properly'
    ],
    difficulty: 'beginner',
    estimatedTime: 8
  },
  {
    id: 'text-elements',
    title: 'Text Elements and Semantics',
    description: 'Master headings, paragraphs, and semantic text elements',
    content: `# Text Elements and Semantics

HTML provides various elements for structuring and emphasizing text content. Understanding these elements is crucial for creating well-structured web pages.

## Headings Hierarchy

HTML has 6 levels of headings, from \`<h1>\` (most important) to \`<h6>\` (least important):

- \`<h1>\` - Main page title (use only once per page)
- \`<h2>\` - Major section headings
- \`<h3>\` - Subsection headings
- \`<h4>\`, \`<h5>\`, \`<h6>\` - Smaller headings

## Text Formatting Elements

- \`<p>\` - Paragraphs for blocks of text
- \`<strong>\` - Important text (bold)
- \`<em>\` - Emphasized text (italic)
- \`<br>\` - Line break (self-closing)
- \`<hr>\` - Horizontal rule (self-closing)

## Best Practices

- Use headings in hierarchical order (don't skip levels)
- Use \`<strong>\` for importance, not just bold styling
- Use \`<em>\` for emphasis, not just italic styling
- Keep paragraphs focused and concise

## Exercise

Create a document with:
- A main heading (h1)
- Two section headings (h2)
- Paragraphs with emphasized and important text
- Proper heading hierarchy`,
    code: `<!DOCTYPE html>
<html lang="en">
<head>
    <title>Text Elements Practice</title>
</head>
<body>
    <h1>Web Development Fundamentals</h1>
    
    <h2>HTML Basics</h2>
    <p>HTML stands for <strong>HyperText Markup Language</strong>. It's the foundation of every web page. <em>Understanding HTML is essential</em> for any web developer.</p>
    
    <h2>CSS Styling</h2>
    <p>CSS, or <strong>Cascading Style Sheets</strong>, controls the visual appearance of web pages. It allows you to create <em>beautiful and responsive designs</em>.</p>
    
    <hr>
    
    <p>These technologies work together to create modern web experiences.</p>
</body>
</html>`,
    expectedOutput: `<!DOCTYPE html>
<html lang="en">
<head>
    <title>Text Elements Practice</title>
</head>
<body>
    <h1>Web Development Fundamentals</h1>
    
    <h2>HTML Basics</h2>
    <p>HTML stands for <strong>HyperText Markup Language</strong>. It's the foundation of every web page. <em>Understanding HTML is essential</em> for any web developer.</p>
    
    <h2>CSS Styling</h2>
    <p>CSS, or <strong>Cascading Style Sheets</strong>, controls the visual appearance of web pages. It allows you to create <em>beautiful and responsive designs</em>.</p>
    
    <hr>
    
    <p>These technologies work together to create modern web experiences.</p>
</body>
</html>`,
    hints: [
      'Use h1 for the main title, h2 for sections',
      'Wrap important words in <strong> tags',
      'Use <em> for emphasis, not just styling',
      'Add <hr> to create visual separation'
    ],
    difficulty: 'beginner',
    estimatedTime: 10
  },
  {
    id: 'links-navigation',
    title: 'Links and Navigation',
    description: 'Create interactive links and navigation elements',
    content: `# Links and Navigation

Links are the foundation of web navigation, connecting different pages and resources. Understanding how to create effective links is essential for web development.

## Link Element (\`<a>\`)

The \`<a>\` tag creates hyperlinks with the \`href\` attribute:

- **External links**: \`<a href="https://example.com">Visit Site</a>\`
- **Internal links**: \`<a href="about.html">About Us</a>\`
- **Email links**: \`<a href="mailto:contact@example.com">Contact</a>\`
- **Phone links**: \`<a href="tel:+1234567890">Call Us</a>\`

## Link Attributes

- \`href\` - The destination URL (required)
- \`target="_blank"\` - Opens link in new tab
- \`title\` - Tooltip text on hover
- \`rel="noopener"\` - Security attribute for external links

## Navigation Lists

Create navigation menus using lists with links:

\`\`\`html
<nav>
    <ul>
        <li><a href="index.html">Home</a></li>
        <li><a href="about.html">About</a></li>
        <li><a href="contact.html">Contact</a></li>
    </ul>
</nav>
\`\`\`

## Exercise

Create a page with:
- A navigation menu with 3 internal links
- An external link to a learning resource
- An email contact link
- Proper link attributes for accessibility`,
    code: `<!DOCTYPE html>
<html lang="en">
<head>
    <title>Links and Navigation</title>
</head>
<body>
    <h1>My Learning Journey</h1>
    
    <nav>
        <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="projects.html">Projects</a></li>
            <li><a href="contact.html">Contact</a></li>
        </ul>
    </nav>
    
    <h2>Learning Resources</h2>
    <p>Check out this excellent resource for web development:</p>
    <a href="https://developer.mozilla.org" target="_blank" rel="noopener" title="Mozilla Developer Network">
        MDN Web Docs
    </a>
    
    <h2>Get in Touch</h2>
    <p>Have questions? <a href="mailto:learn@example.com">Send me an email</a>!</p>
</body>
</html>`,
    expectedOutput: `<!DOCTYPE html>
<html lang="en">
<head>
    <title>Links and Navigation</title>
</head>
<body>
    <h1>My Learning Journey</h1>
    
    <nav>
        <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="projects.html">Projects</a></li>
            <li><a href="contact.html">Contact</a></li>
        </ul>
    </nav>
    
    <h2>Learning Resources</h2>
    <p>Check out this excellent resource for web development:</p>
    <a href="https://developer.mozilla.org" target="_blank" rel="noopener" title="Mozilla Developer Network">
        MDN Web Docs
    </a>
    
    <h2>Get in Touch</h2>
    <p>Have questions? <a href="mailto:learn@example.com">Send me an email</a>!</p>
</body>
</html>`,
    hints: [
      'Use <nav> to wrap navigation links',
      'Add target="_blank" for external links',
      'Include rel="noopener" for security',
      'Use mailto: for email links'
    ],
    difficulty: 'beginner',
    estimatedTime: 12
  },
  {
    id: 'lists-structure',
    title: 'Lists and Data Organization',
    description: 'Organize information with ordered, unordered, and definition lists',
    content: `# Lists and Data Organization

Lists are powerful HTML elements for organizing and structuring information. They improve readability and provide semantic meaning to your content.

## Types of Lists

### Unordered Lists (\`<ul>\`)
Use for items without a specific order:
- Shopping lists
- Feature lists
- Navigation menus

### Ordered Lists (\`<ol>\`)
Use for items with a specific sequence:
- Step-by-step instructions
- Rankings
- Numbered procedures

### Definition Lists (\`<dl>\`)
Use for term-definition pairs:
- Glossaries
- FAQ sections
- Key-value pairs

## List Structure

Each list type uses different child elements:

- \`<ul>\` and \`<ol>\` contain \`<li>\` (list item) elements
- \`<dl>\` contains \`<dt>\` (definition term) and \`<dd>\` (definition description) elements

## Nested Lists

You can nest lists inside other lists to create hierarchical structures:

\`\`\`html
<ul>
    <li>Frontend
        <ul>
            <li>HTML</li>
            <li>CSS</li>
        </ul>
    </li>
    <li>Backend
<ul>
    <li>JavaScript</li>
    <li>Python</li>
        </ul>
    </li>
</ul>
\`\`\`

## Exercise

Create a comprehensive list structure with:
- An ordered list of learning steps
- An unordered list of technologies
- A definition list of key terms
- Proper nesting where appropriate`,
    code: `<!DOCTYPE html>
<html lang="en">
<head>
    <title>Lists and Organization</title>
</head>
<body>
    <h1>Web Development Learning Path</h1>

<h2>Learning Steps</h2>
<ol>
        <li>Learn HTML fundamentals</li>
        <li>Master CSS styling</li>
        <li>Add JavaScript interactivity</li>
        <li>Build your first project</li>
    </ol>
    
    <h2>Technologies to Learn</h2>
    <ul>
        <li>HTML5
            <ul>
                <li>Semantic elements</li>
                <li>Forms and validation</li>
            </ul>
        </li>
        <li>CSS3
            <ul>
                <li>Flexbox and Grid</li>
                <li>Responsive design</li>
            </ul>
        </li>
        <li>JavaScript
            <ul>
                <li>ES6+ features</li>
                <li>DOM manipulation</li>
            </ul>
        </li>
</ul>
    
    <h2>Key Terms</h2>
    <dl>
        <dt>HTML</dt>
        <dd>HyperText Markup Language - the standard markup language for web pages</dd>
        
        <dt>CSS</dt>
        <dd>Cascading Style Sheets - used for styling and layout of web pages</dd>
        
        <dt>JavaScript</dt>
        <dd>A programming language that adds interactivity to web pages</dd>
    </dl>
</body>
</html>`,
    expectedOutput: `<!DOCTYPE html>
<html lang="en">
<head>
    <title>Lists and Organization</title>
</head>
<body>
    <h1>Web Development Learning Path</h1>

<h2>Learning Steps</h2>
<ol>
        <li>Learn HTML fundamentals</li>
        <li>Master CSS styling</li>
        <li>Add JavaScript interactivity</li>
        <li>Build your first project</li>
    </ol>
    
    <h2>Technologies to Learn</h2>
    <ul>
        <li>HTML5
            <ul>
                <li>Semantic elements</li>
                <li>Forms and validation</li>
            </ul>
        </li>
        <li>CSS3
            <ul>
                <li>Flexbox and Grid</li>
                <li>Responsive design</li>
            </ul>
        </li>
        <li>JavaScript
            <ul>
                <li>ES6+ features</li>
                <li>DOM manipulation</li>
            </ul>
        </li>
    </ul>
    
    <h2>Key Terms</h2>
    <dl>
        <dt>HTML</dt>
        <dd>HyperText Markup Language - the standard markup language for web pages</dd>
        
        <dt>CSS</dt>
        <dd>Cascading Style Sheets - used for styling and layout of web pages</dd>
        
        <dt>JavaScript</dt>
        <dd>A programming language that adds interactivity to web pages</dd>
    </dl>
</body>
</html>`,
    hints: [
      'Use <ol> for numbered steps',
      'Use <ul> for unordered items',
      'Nest lists by placing <ul> inside <li>',
      'Use <dl>, <dt>, and <dd> for definitions'
    ],
    difficulty: 'beginner',
    estimatedTime: 15
  },
  {
    id: 'images-media',
    title: 'Images and Media Elements',
    description: 'Add images, figures, and media content to your web pages',
    content: `# Images and Media Elements

Images and media content make web pages engaging and informative. Learn how to properly include and optimize media elements.

## Image Element (\`<img>\`)

The \`<img>\` tag is self-closing and requires these attributes:

- \`src\` - Path to the image file (required)
- \`alt\` - Alternative text for accessibility (required)
- \`width\` and \`height\` - Dimensions (optional but recommended)
- \`title\` - Tooltip text on hover

## Image Best Practices

- Always include meaningful \`alt\` text
- Use appropriate image formats (JPEG for photos, PNG for graphics)
- Optimize file sizes for web performance
- Provide multiple sizes for responsive design

## Figure and Caption

Use \`<figure>\` and \`<figcaption>\` for images with captions:

\`\`\`html
<figure>
    <img src="diagram.jpg" alt="HTML structure diagram">
    <figcaption>Basic HTML document structure</figcaption>
</figure>
\`\`\`

## Responsive Images

Use the \`<picture>\` element for responsive images:

\`\`\`html
<picture>
    <source media="(min-width: 800px)" srcset="large.jpg">
    <source media="(min-width: 400px)" srcset="medium.jpg">
    <img src="small.jpg" alt="Responsive image">
</picture>
\`\`\`

## Exercise

Create a page with:
- Multiple images with proper alt text
- A figure with caption
- Images with appropriate dimensions
- Good accessibility practices`,
    code: `<!DOCTYPE html>
<html lang="en">
<head>
    <title>Images and Media</title>
</head>
<body>
    <h1>Web Development Gallery</h1>
    
    <h2>Learning Resources</h2>
    <p>Here are some helpful images for learning web development:</p>
    
    <figure>
        <img src="https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=HTML+Structure" 
             alt="HTML document structure diagram showing DOCTYPE, html, head, and body elements"
             width="400" 
             height="300"
             title="HTML Document Structure">
        <figcaption>Basic HTML document structure with essential elements</figcaption>
    </figure>
    
    <h2>Technology Stack</h2>
    <div>
        <img src="https://via.placeholder.com/150x150/10B981/FFFFFF?text=HTML5" 
             alt="HTML5 logo"
             width="150" 
             height="150">
        
        <img src="https://via.placeholder.com/150x150/3B82F6/FFFFFF?text=CSS3" 
             alt="CSS3 logo"
             width="150" 
             height="150">
        
        <img src="https://via.placeholder.com/150x150/F59E0B/FFFFFF?text=JS" 
             alt="JavaScript logo"
             width="150" 
             height="150">
    </div>
    
    <h2>Learning Path</h2>
    <figure>
        <img src="https://via.placeholder.com/600x200/8B5CF6/FFFFFF?text=Frontend+Development+Path" 
             alt="Frontend development learning path flowchart"
             width="600" 
             height="200">
        <figcaption>Recommended learning path for frontend development</figcaption>
    </figure>
</body>
</html>`,
    expectedOutput: `<!DOCTYPE html>
<html lang="en">
<head>
    <title>Images and Media</title>
</head>
<body>
    <h1>Web Development Gallery</h1>
    
    <h2>Learning Resources</h2>
    <p>Here are some helpful images for learning web development:</p>
    
    <figure>
        <img src="https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=HTML+Structure" 
             alt="HTML document structure diagram showing DOCTYPE, html, head, and body elements"
             width="400" 
             height="300"
             title="HTML Document Structure">
        <figcaption>Basic HTML document structure with essential elements</figcaption>
    </figure>
    
    <h2>Technology Stack</h2>
    <div>
        <img src="https://via.placeholder.com/150x150/10B981/FFFFFF?text=HTML5" 
             alt="HTML5 logo"
             width="150" 
             height="150">
        
        <img src="https://via.placeholder.com/150x150/3B82F6/FFFFFF?text=CSS3" 
             alt="CSS3 logo"
             width="150" 
             height="150">
        
        <img src="https://via.placeholder.com/150x150/F59E0B/FFFFFF?text=JS" 
             alt="JavaScript logo"
             width="150" 
             height="150">
    </div>
    
    <h2>Learning Path</h2>
    <figure>
        <img src="https://via.placeholder.com/600x200/8B5CF6/FFFFFF?text=Frontend+Development+Path" 
             alt="Frontend development learning path flowchart"
             width="600" 
             height="200">
        <figcaption>Recommended learning path for frontend development</figcaption>
    </figure>
</body>
</html>`,
    hints: [
      'Always include descriptive alt text for images',
      'Use <figure> and <figcaption> for images with captions',
      'Specify width and height attributes for better performance',
      'Use placeholder images for practice'
    ],
    difficulty: 'beginner',
    estimatedTime: 12
  }
]

export const lessonTracks: LessonTrack[] = [
  {
    id: 'html-basics',
    title: 'HTML Fundamentals',
    description: 'Master the building blocks of web development with comprehensive HTML lessons',
    icon: '📝',
    color: 'from-blue-600 to-blue-800',
    lessons: htmlBasicsLessons
  }
  // CSS and JavaScript tracks will be added later
]