# Django to React Migration Guide

This directory contains the exact, pixel-perfect React conversions of your `index.html` and `school_detail.html` Django templates. The UI layout, CSS classes, HTML tag structures, and inline SVGs were rigorously preserved.

## 1. What was Converted?
- `index.html` -> `src/pages/Home.jsx`
- `school_detail.html` -> `src/pages/SchoolDetail.jsx`
- Navbar and Footer structurally extracted into `src/components/Navbar.jsx` & `src/components/Footer.jsx`.

## 2. Replacing Django Template Syntax with React Props/State

| Django Template Variable/Tag | React Counterpart (JSX) |
| --- | --- |
| `{{ school.name }}` | `{school.name}` (from component state/props) |
| `{% for school in schools %}` | `{schools.map((school) => ( ... ))}` |
| `{% if school.description %}` | `{school.description ? ( ... ) : ( ... )}` |
| `{% url 'home' %}` | `<Link to="/">` (from `react-router-dom`) |
| `{{ school.thumbnail.url }}` | `{school.thumbnail_url}` |
| `{% csrf_token %}` | Sent as a header in your API fetch calls instead of hidden input |

## 3. Minimal API Integration Guide
To bring these components to life with your backend data, you will implement an API fetch layer in your components.

### Example `fetch` call for the `Home.jsx` component:
```javascript
useEffect(() => {
  const fetchSchools = async () => {
    try {
      // Build your query string based on the `query` state and `activeFilters` array.
      const qs = new URLSearchParams();
      if (query) qs.append('q', query);
      activeFilters.forEach(f => qs.append('filter', f));
      
      const response = await fetch(`/api/schools/?${qs.toString()}`);
      const data = await response.json();
      setSchools(data); 
    } catch (error) {
      console.error("Failed to fetch schools", error);
    }
  };
  
  if (query || activeFilters.length > 0) {
      fetchSchools();
  } else {
      // maybe fetch all schools
      fetchSchools();
  }
}, [query, activeFilters]);
```

### Example for Comment Submission in `SchoolDetail.jsx`:
```javascript
const handleCommentSubmit = async (e) => {
  e.preventDefault();
  const response = await fetch(`/api/schools/${id}/comments/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Get CSRF token from cookies in a real Django setup
      'X-CSRFToken': getCookie('csrftoken') 
    },
    body: JSON.stringify({
      username: commentUsername,
      text: commentText
    })
  });
  
  if (response.ok) {
     const newComment = await response.json();
     setComments([...comments, newComment]);
     setCommentText(""); // clear input
  }
};
```

## 4. Plugging into Existing Backend

To transition from Django's template rendering to serving the new React SPA:

1. Setup Django REST Framework (DRF) if you haven't already.
2. Build serializers and API views mapping to your `School`, `Comment`, and `User` models matching the data structures expected by `Home.jsx` and `SchoolDetail.jsx`.
3. Replace the `views.py` template renderings (e.g. `render(request, 'index.html')`) to return JSON models (e.g., `Response(serializer.data)`).
4. Treat `frontend_migration` as a starting point. Initialize a new Vite project:
   ```bash
   npx create-vite@latest frontend --template react
   ```
   Copy the `src` folder from `frontend_migration` into `frontend/` and add `react-router-dom`:
   ```bash
   npm install react-router-dom
   ```
5. Build the React project:
   ```bash
   npm run build
   ```
6. Move the generated `dist/` JS and CSS build files into your Django app's `static/` directory.
7. Instruct Django to serve an empty HTML wrapper (with `<div id="root"></div>`) that points to your static React JS/CSS bundles. React DOM will mount there and handle everything frontend-related.
8. Make sure to serve the existing vanilla CSS `style.css` and `detail.css` in that base `index.html` wrapper exactly as you did in Django, as the React components use strictly those global classes.
