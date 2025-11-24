# 🤝 Contributing to Shoez

First off, thank you for considering contributing to Shoez! It's people like you that make Shoez such a great tool.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)
- [Testing](#testing)
- [Documentation](#documentation)

---

## 📜 Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Examples of behavior that contributes to creating a positive environment include:**

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git
- Supabase account (for backend testing)

### Setup

1. **Fork the repository**

   ```bash
   # Click the "Fork" button on GitHub
   ```

2. **Clone your fork**

   ```bash
   git clone https://github.com/YOUR_USERNAME/shoez-ecommerce.git
   cd shoez-ecommerce
   ```

3. **Add upstream remote**

   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/shoez-ecommerce.git
   ```

4. **Install dependencies**

   ```bash
   npm install
   ```

5. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

---

## 💻 Development Process

### Branching Strategy

We use **Git Flow** branching model:

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Urgent production fixes

### Creating a Feature Branch

```bash
# Update your local develop branch
git checkout develop
git pull upstream develop

# Create a new feature branch
git checkout -b feature/amazing-feature
```

### Making Changes

1. **Write clean, readable code**
2. **Follow existing code patterns**
3. **Add comments for complex logic**
4. **Update documentation if needed**
5. **Test your changes thoroughly**

---

## 🔄 Pull Request Process

### Before Submitting

- [ ] Code follows the style guidelines
- [ ] Self-review of your code
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No console.logs or debugging code
- [ ] Tested on multiple browsers
- [ ] Tested on mobile devices
- [ ] No linting errors (`npm run lint`)
- [ ] Build succeeds (`npm run build`)

### Submitting a Pull Request

1. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

2. **Push to your fork**

   ```bash
   git push origin feature/amazing-feature
   ```

3. **Create Pull Request**
   - Go to GitHub
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template

### PR Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

How has this been tested?

## Screenshots (if applicable)

Add screenshots here

## Checklist

- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No console.logs
- [ ] Tested on multiple browsers
- [ ] Tested on mobile
```

---

## 📝 Coding Standards

### JavaScript/React

**Use functional components with hooks:**

```javascript
// ✅ Good
const MyComponent = () => {
  const [state, setState] = useState(initial);
  return <div>{state}</div>;
};

// ❌ Avoid
class MyComponent extends React.Component {
  // ...
}
```

**Use destructuring:**

```javascript
// ✅ Good
const { name, price } = product;

// ❌ Avoid
const name = product.name;
const price = product.price;
```

**Use meaningful variable names:**

```javascript
// ✅ Good
const userProducts = products.filter((p) => p.userId === userId);

// ❌ Avoid
const x = products.filter((p) => p.userId === userId);
```

### File Organization

```
ComponentName/
├── ComponentName.jsx       # Component logic
├── ComponentName.module.css # Component styles (if needed)
└── index.js               # Export
```

### Import Order

```javascript
// 1. React and external libraries
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// 2. Internal components
import Button from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";

// 3. Utils and helpers
import { formatCurrency } from "@/lib/utils";

// 4. Styles
import "./styles.css";
```

### CSS/Tailwind

**Use Tailwind utility classes:**

```jsx
// ✅ Good
<div className="flex items-center gap-4 p-6 bg-white rounded-lg">

// ❌ Avoid inline styles
<div style={{ display: 'flex', padding: '24px' }}>
```

**Responsive design:**

```jsx
<div className="w-full md:w-1/2 lg:w-1/3">
```

---

## 📝 Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(cart): add quantity selector to cart items

fix(auth): resolve login redirect issue

docs(readme): update installation instructions

style(navbar): improve mobile menu spacing

refactor(products): optimize product filtering logic

perf(images): implement lazy loading for product images
```

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Feature works as expected
- [ ] No console errors
- [ ] Responsive on mobile (< 640px)
- [ ] Responsive on tablet (640px - 1024px)
- [ ] Responsive on desktop (> 1024px)
- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works in Edge
- [ ] Accessibility (keyboard navigation)
- [ ] Loading states work
- [ ] Error states work

### Browser Testing

Test on:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Mobile Testing

Test on:

- iOS Safari
- Android Chrome
- Various screen sizes

---

## 📚 Documentation

### Code Comments

```javascript
/**
 * Calculates the total price of cart items
 * @param {Array} items - Array of cart items
 * @returns {number} Total price
 */
const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};
```

### Component Documentation

```javascript
/**
 * ProductCard Component
 *
 * Displays a product with image, name, price, and actions
 *
 * @param {Object} product - Product object
 * @param {Function} onQuickView - Quick view handler
 * @param {Function} onAddToCart - Add to cart handler
 */
const ProductCard = ({ product, onQuickView, onAddToCart }) => {
  // ...
};
```

### README Updates

When adding new features, update:

- README.md - Main documentation
- FEATURES_IMPLEMENTED.md - Feature details
- ENHANCEMENT_PLAN.md - If planning future work

---

## 🐛 Reporting Bugs

### Before Reporting

- Check existing issues
- Try to reproduce the bug
- Gather relevant information

### Bug Report Template

```markdown
**Describe the bug**
A clear description of the bug

**To Reproduce**
Steps to reproduce:

1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen

**Screenshots**
If applicable, add screenshots

**Environment:**

- OS: [e.g. Windows 11]
- Browser: [e.g. Chrome 120]
- Version: [e.g. 1.0.0]

**Additional context**
Any other relevant information
```

---

## 💡 Feature Requests

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of the problem

**Describe the solution you'd like**
What you want to happen

**Describe alternatives you've considered**
Other solutions you've thought about

**Additional context**
Any other relevant information
```

---

## 🏆 Recognition

Contributors will be:

- Added to CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation

---

## 📞 Questions?

- **Email:** support@shoez.com
- **Discord:** [Join our server](https://discord.gg/shoez)
- **GitHub Discussions:** [Ask a question](https://github.com/yourusername/shoez/discussions)

---

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to Shoez! 🎉**
