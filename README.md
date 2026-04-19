# Job Application Tracker

## Objective

Build a responsive Job Application Tracker where users can manage and track job applications with status updates.

---

## Tech Stack

* HTML5
* CSS3 (Flexbox / Grid)
* JavaScript (ES6+)
* Bootstrap (for styling)

---

## Setup Instructions

1. Clone the repository:

```
git clone https://github.com/your-username/job-application-tracker.git
```

2. Navigate into the project folder:

```
cd job-application-tracker
```

3. Open the project:

* Simply open `index.html` in your browser

---

## Features Implemented

### Dashboard

* Displays summary cards:

  * Total Applications
  * Applied
  * Interview Scheduled
  * Offer
  * Rejected

---

### Job Applications List

* Table view with:

  * Company Name
  * Role
  * Location
  * Applied Date
  * Status

---

### Add / Edit Application

* Modal form with:

  * Company Name (required)
  * Role (required)
  * Location
  * Applied Date
  * Status dropdown
* Supports:

  * Adding new application
  * Editing existing application

---

### Filters & Search

* Filter by status (Applied, Interview, Offer, Rejected)
* Search by:

  * Company Name
  * Role

---

### Status Update

* Update application status directly from the table using dropdown

---

### Data Persistence

* Uses **localStorage**
* Data remains saved even after page reload

---

### UI/UX Features

* Fully responsive (mobile + desktop)
* Clean and modern layout
* Proper spacing and alignment
* Icons for better usability
* Smooth hover effects and transitions

---

## Bonus Features

* Kanban Board (Drag & Drop)
* Modal popup for form
* Toast notifications
* Sorting (date & company)
* Dark mode toggle

---

## Approach

The application is built using a modular and event-driven approach.

* All job application data is stored in a central array (`applications`)
* Data is synchronized with **localStorage** for persistence

### Workflow:

1. User performs an action (add, edit, delete, drag-drop)
2. JavaScript updates the data array
3. Data is saved to localStorage
4. UI is re-rendered dynamically

### Key Concepts Used:

* `map()` → Rendering UI
* `filter()` → Searching & filtering
* `sort()` → Sorting data
* Event handling → User interactions

### UI Structure:

* Dashboard → Overview statistics
* Applications Table → Detailed data view
* Kanban Board → Visual workflow tracking

---

## Future Improvements

* Enhance UI/UX with more animations and transitions
* Add advanced filtering and sorting options
* Improve accessibility (ARIA roles, keyboard navigation)
* Export data as CSV or PDF
* Add reminders or notifications for application follow-ups

---

## Screenshots

### Dashboard
![Dashboard](screenshot/dashboard.png)

### Applications Table
![Application](screenshot/application.png)

### Kanban Board
![Kanban](screenshot/kanban.png)

---

## Author

Vasudev Yadav
