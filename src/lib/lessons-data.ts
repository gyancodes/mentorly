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
    description: 'Learn the basic structure of an HTML document',
    content: `
# HTML Document Structure

Every HTML document follows a basic structure. Let's learn about the essential elements:

## The HTML5 Document Structure

1. **DOCTYPE Declaration**: Tells the browser this is an HTML5 document
2. **HTML Element**: The root element that contains all content
3. **Head Section**: Contains metadata about the document
4. **Body Section**: Contains the visible content

## Key Elements:
- \`<!DOCTYPE html>\` - HTML5 declaration
- \`<html>\` - Root element
- \`<head>\` - Document metadata
- \`<title>\` - Page title (shown in browser tab)
- \`<body>\` - Visible content

Try creating a basic HTML document structure in the editor!
    `,
    code: `<!DOCTYPE html>
<html>
<head>
    <title>My First Web Page</title>
</head>
<body>
    <h1>Welcome to HTML!</h1>
    <p>This is my first paragraph.</p>
</body>
</html>`,
    expectedOutput: `<!DOCTYPE html>
<html>
<head>
    <title>My First Web Page</title>
</head>
<body>
    <h1>Welcome to HTML!</h1>
    <p>This is my first paragraph.</p>
</body>
</html>`,
    hints: [
      'Start with the DOCTYPE declaration',
      'Remember to close all tags',
      'The title goes in the head section',
      'Visible content goes in the body'
    ],
    difficulty: 'beginner',
    estimatedTime: 5
  },
  {
    id: 'headings-paragraphs',
    title: 'Headings and Paragraphs',
    description: 'Learn how to structure text with headings and paragraphs',
    content: `
# Headings and Paragraphs

HTML provides several elements for structuring text content:

## Headings (h1-h6)
HTML has 6 levels of headings, from \`<h1>\` (largest) to \`<h6>\` (smallest):
- \`<h1>\` - Main title (use only once per page)
- \`<h2>\` - Section headings
- \`<h3>\` - Subsection headings
- \`<h4>\`, \`<h5>\`, \`<h6>\` - Smaller headings

## Paragraphs
- \`<p>\` - Used for paragraphs of text
- Automatically adds spacing before and after

## Best Practices:
- Use headings in hierarchical order
- Don't skip heading levels
- Use paragraphs for blocks of text
    `,
    code: `<h1>Main Title</h1>
<h2>Section Title</h2>
<p>This is a paragraph of text. It can contain multiple sentences and will wrap automatically.</p>
<h3>Subsection</h3>
<p>Another paragraph here.</p>`,
    expectedOutput: `<h1>Main Title</h1>
<h2>Section Title</h2>
<p>This is a paragraph of text. It can contain multiple sentences and will wrap automatically.</p>
<h3>Subsection</h3>
<p>Another paragraph here.</p>`,
    hints: [
      'Use h1 for the main title',
      'Use h2 for section headings',
      'Wrap text in <p> tags',
      'Keep the hierarchy logical'
    ],
    difficulty: 'beginner',
    estimatedTime: 5
  },
  {
    id: 'links-images',
    title: 'Links and Images',
    description: 'Learn how to add links and images to your web pages',
    content: `
# Links and Images

Make your web pages interactive and visual with links and images.

## Links (\`<a>\` tag)
- \`href\` attribute specifies the destination
- Can link to other pages, sections, or external sites
- \`target="_blank"\` opens in new tab

## Images (\`<img>\` tag)
- \`src\` attribute specifies the image source
- \`alt\` attribute provides alternative text
- Self-closing tag (no closing tag needed)

## Examples:
- External link: \`<a href="https://example.com">Visit Example</a>\`
- Internal link: \`<a href="#section1">Go to Section 1</a>\`
- Image: \`<img src="image.jpg" alt="Description">\`
    `,
    code: `<h1>My Favorite Websites</h1>
<p>Here are some useful links:</p>
<a href="https://developer.mozilla.org" target="_blank">MDN Web Docs</a>
<br>
<a href="https://www.w3schools.com">W3Schools</a>

<h2>A Beautiful Image</h2>
<img src="https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=HTML+Lesson" alt="HTML Lesson Placeholder">`,
    expectedOutput: `<h1>My Favorite Websites</h1>
<p>Here are some useful links:</p>
<a href="https://developer.mozilla.org" target="_blank">MDN Web Docs</a>
<br>
<a href="https://www.w3schools.com">W3Schools</a>

<h2>A Beautiful Image</h2>
<img src="https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=HTML+Lesson" alt="HTML Lesson Placeholder">`,
    hints: [
      'Use href attribute for link destinations',
      'Add target="_blank" to open in new tab',
      'Always include alt text for images',
      'Use <br> for line breaks'
    ],
    difficulty: 'beginner',
    estimatedTime: 7
  },
  {
    id: 'lists',
    title: 'Lists',
    description: 'Create ordered and unordered lists',
    content: `
# HTML Lists

Lists help organize information in a structured way.

## Unordered Lists (\`<ul>\`)
- Use for items without specific order
- Each item wrapped in \`<li>\` tags
- Default styling shows bullet points

## Ordered Lists (\`<ol>\`)
- Use for items with specific order/sequence
- Each item wrapped in \`<li>\` tags
- Default styling shows numbers

## Nested Lists
- You can put lists inside other lists
- Useful for creating hierarchical structures

## List Items (\`<li>\`)
- Contains the actual list content
- Can contain text, links, images, or other elements
    `,
    code: `<h2>My Favorite Programming Languages</h2>
<ul>
    <li>JavaScript</li>
    <li>Python</li>
    <li>HTML/CSS</li>
</ul>

<h2>Learning Steps</h2>
<ol>
    <li>Learn HTML structure</li>
    <li>Add CSS styling</li>
    <li>Make it interactive with JavaScript</li>
</ol>`,
    expectedOutput: `<h2>My Favorite Programming Languages</h2>
<ul>
    <li>JavaScript</li>
    <li>Python</li>
    <li>HTML/CSS</li>
</ul>

<h2>Learning Steps</h2>
<ol>
    <li>Learn HTML structure</li>
    <li>Add CSS styling</li>
    <li>Make it interactive with JavaScript</li>
</ol>`,
    hints: [
      'Use <ul> for unordered lists',
      'Use <ol> for ordered lists',
      'Each item goes in <li> tags',
      'Lists can be nested inside each other'
    ],
    difficulty: 'beginner',
    estimatedTime: 6
  }
]

export const lessonTracks: LessonTrack[] = [
  {
    id: 'html-basics',
    title: 'HTML Basics',
    description: 'Learn the fundamentals of HTML structure and elements',
    icon: '🏗️',
    color: 'from-orange-500 to-red-500',
    lessons: htmlBasicsLessons
  }
  // CSS and JavaScript tracks will be added later
]