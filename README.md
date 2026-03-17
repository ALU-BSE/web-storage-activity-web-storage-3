[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=23163778)

**Group Activity: Implementing Web Storage Mechanisms in an E-Commerce Site**  
*Objective:* Apply knowledge of Cookies, Local Storage, and Session Storage to build a secure and functional e-commerce demo.  

---

### **Task 1: User Authentication with Cookies**  
**Scenario:** Implement a login system using cookies to retain user sessions.  
1. Create a login form with `username` and `password` fields.  
2. On form submission, set a **secure cookie** named `authToken` with a dummy value (e.g., "user123").  
   - Ensure the cookie uses `HttpOnly` and `Secure` flags.  
   - Set an expiration date of 7 days.  
3. Display a "Logout" button that deletes the `authToken` cookie.  

**Code Skeleton:**  
```javascript
// Set cookie on login
document.cookie = "authToken=user123; expires=Fri, 31 Dec 2024 12:00:00 UTC; Secure; HttpOnly; path=/";

// Delete cookie on logout
document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
```

**Questions:**  
- Why are `HttpOnly` and `Secure` flags important for cookies?  
- How do session cookies differ from persistent cookies in this context?  

---

### **Task 2: Theme Preferences with Local Storage**  
**Scenario:** Allow users to save their preferred theme (light/dark mode).  
1. Add a theme toggle button to the page.  
2. Store the selected theme ("light" or "dark") in **local storage**.  
3. Retrieve the theme on page load and apply it automatically.  

**Code Skeleton:**  
```javascript
// Save theme preference
localStorage.setItem("theme", "dark");

// Retrieve theme
const savedTheme = localStorage.getItem("theme");
document.body.classList.add(savedTheme);
```

**Challenge:**  
- Use `JSON.stringify` and `JSON.parse` to store/retrieve a settings object (e.g., `{ theme: "dark", fontSize: 16 }`).  

**Questions:**  
- What happens if local storage exceeds its size limit? How would you handle this?  

---

### **Task 3: Session-Specific Shopping Cart**  
**Scenario:** Implement a cart that resets when the browser closes.  
1. Use **session storage** to store cart items (e.g., `{ product: "Book", quantity: 2 }`).  
2. Add a "Add to Cart" button that updates the cart.  
3. Display cart items dynamically.  

**Code Skeleton:**  
```javascript
// Add item to cart
const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
cart.push({ product: "Book", quantity: 1 });
sessionStorage.setItem("cart", JSON.stringify(cart));
```

**Debugging:**  
- Intentionally introduce an error (e.g., forget `JSON.parse`) and ask students to fix it.  

**Questions:**  
- Why is session storage suitable for this use case?  

---

### **Task 4: Security Implementation**  
**Scenario:** Secure the application against XSS and CSRF attacks.  
1. Sanitize user input using `encodeURIComponent` before displaying it on the page.  
2. Generate a CSRF token on the server (simulate with `Math.random()`) and include it in forms.  

**Code Skeleton:**  
```javascript
// Sanitize input
const userInput = "<script>alert('XSS')</script>";
const sanitizedInput = encodeURIComponent(userInput);

// Add CSRF token to form
const csrfToken = Math.random().toString(36).substr(2);
document.getElementById("form").innerHTML += `<input type="hidden" name="csrfToken" value="${csrfToken}">`;
```

**Challenge:**  
- Encrypt sensitive data (e.g., user email) in local storage using a library like `CryptoJS`.  

---

### **Task 5: Reflection and Comparison**  
1. Fill out a comparison table based on the document:  

| Criteria          | Cookies          | Local Storage    | Session Storage  |  
|-------------------|------------------|------------------|------------------|  
| Storage Limit     | 4KB              | 5-10MB           | 5-10MB           |  
| Data Persistence  | Configurable     | Permanent        | Session-only     |  
| Server Accessibility | Yes            | No               | No               |  

2. **Discussion Questions:**  
   - When would you use cookies over local storage?  
   - What are the risks of storing passwords in session storage?  

---

### **Final Challenge: Integration**  
Combine all tasks into a single demo application where:  
- Users log in (cookies).  
- Customize their theme (local storage).  
- Add items to a session-specific cart (session storage).  
- Security measures are applied (CSRF tokens, input sanitization).  

**Bonus:** Test the app in incognito mode and explain how storage behaviors differ.  
