---
applyTo: '**'
---

---

title: UI Development Guidelines
description: Instructions for UI structure, styling, components, and workflow
tags: [ui, tailwind, react, structure, workflow]

---

# UI Development Guidelines

## Component Structure

To maintain a clean and scalable codebase, strict folder structure rules must be followed:

### Page-Specific Components

- Any page must have a corresponding subfolder in the `src/components` directory.
- No folder should mix concerns between two different pages.
- Example: Components specific to the dashboard page go in `src/components/dashboard/`.

### Layout Components

- Global layout components (e.g., Header, Footer) must be placed in a dedicated folder: `src/components/layout`.

### UI Components

- Reusable UI primitives (buttons, inputs, cards, etc.) are located in `src/components/ui`.
- These are foundational components and should be reused across page-specific components.

## Styling (Tailwind CSS v4)

We are using **Tailwind CSS v4**. Styles are defined in `src/app/(frontend)/styles.css`.

### Colors

Use the semantic CSS variables defined in the theme. Do not hardcode hex values unless absolutely necessary.
Refer to `styles.css` for the full palette.

**Common usage examples:**

- Backgrounds: `bg-background`, `bg-card`, `bg-primary`, `bg-muted`
- Text: `text-foreground`, `text-primary-foreground`, `text-muted-foreground`
- Borders: `border-border`, `border-input`
- Rings: `ring-ring`

Example:

```tsx
<div className="bg-card text-card-foreground border-border border rounded-md p-4">
  <h1 className="text-primary font-bold">Title</h1>
</div>
```

## Icons

- Explicitly use **`react-icons`**.
- Use **Outline** icons by default (e.g., from `react-icons/hi2`, `react-icons/io5`, etc., selecting the outline variant) unless authorized otherwise.

### Spacing

- Avoid excessive vertical padding.
- Use `py-6` for mobile and `md:py-10` for desktop as a standard for section spacing unless otherwise specified.

### Spacing

- Avoid excessive vertical padding.
- Use `py-6` for mobile and `md:py-10` for desktop as a standard for section spacing unless otherwise specified.

## Workflow & Quality Assurance

### error Checking

- **After every change**, you must check for issues in the modified file(s).
- Use the `get_errors` tool in the terminal/environment to validate the changes immediately.
- Ensure no linting or compilation errors are introduced.

### Clean Code

- **No Useless Comments**: Do not add unnecessary comments that state the obvious or discuss implementation choices that are not relevant for maintenance. Comments should explain _why_, not _what_, and only when the code itself is not expressive enough.
